import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import {
  getDossierServiceInstance
} from "../service/DossierExplorerService.js";

import rootModel from "../view-models/rootModel.js";
import signOutModal from "../view-models/signOutModal.js";
import walletContentViewModel from '../view-models/walletContentViewModel.js';
import createDossierModal from '../view-models/createDossierModal.js';
import receiveDossierModal from '../view-models/receiveDossierModal.js';
import importDossierModal from '../view-models/importDossierModal.js';
import deleteDossierModal from '../view-models/deleteDossierModal.js';
import renameDossierModal from '../view-models/renameDossierModal.js';
import shareDossierModal from '../view-models/shareDossierModal.js';
import Commons from "./Commons.js";

export default class ExplorerController extends ContainerController {
  constructor(element) {
    super(element);

    this.model = this.setModel(rootModel);
    this.dossierService = getDossierServiceInstance();

    this._listWalletContent();
    this._initListeners();
  }

  _initListeners = () => {
    this.on("sign-out", this._signOutFromWalletHandler, true);
    this.on("switch-layout", this._handleSwitchLayout, true);

    this.on('create-dossier', this._createDossierHandler, true);
    this.on('receive-dossier', this._receiveDossierHandler, true);
    this.on('import-dossier', this._importDossierHandler, true);
    this.on('delete-dossier', this._deleteDossierHandler, true);
    this.on('share-dossier', this._shareDossierHandler, true);
    this.on('rename-dossier', this._renameDossierHandler, true);

    this.on('add-file-folder', this._handleFileFolderUpload, true);

    this.on('double-click-item', this._handleNavigation, true);

    /**
     * Model chain change watchers
     */
    this.model.onChange('currentPath', () => {
      this._listWalletContent();
    });
  };

  _handleSwitchLayout = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.model.isGridLayout = !this.model.isGridLayout;
  };

  _signOutFromWalletHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.showModal("signOut", signOutModal, (err, response) => {
      console.log(err, response);
    });

  };

  _createDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    createDossierModal.currentPath = this.model.currentPath;
    this.showModal('createDossier', createDossierModal, (err, response) => {
      console.log(err, response);
      this._listWalletContent();
    });
  }

  _receiveDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.showModal('receiveDossier', receiveDossierModal, (err, response) => {
      console.log(err, response);
      this._listWalletContent();
    });
  }

  _importDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.showModal('importDossier', importDossierModal, (err, response) => {
      console.log(err, response);
      this._listWalletContent();
    });
  }

  _deleteDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    /**
     * Before showModal, set the selectedItemsPaths attribute inside deleteDossierModal,
     * so the controller can handle the delete process
     */
    let currentPath = this.model.currentPath === '/' ? '/' : `${this.model.currentPath}/`;
    let selectedItemsPaths = [];
    if (this.model.content.length) {
      selectedItemsPaths = this.model.content
        .filter(item => item.selected === 'selected')
        .map(item => `${currentPath}${item.name}`);
    }

    deleteDossierModal.selectedItemsPaths = selectedItemsPaths;

    this.showModal('deleteDossier', deleteDossierModal, (err, response) => {
      console.log(err, response);
      this._listWalletContent();
    });
  }

  _renameDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (this.model.content.length) {
      let selectedItem = this.model.content
        .find(item => item.selected === 'selected');

      if (selectedItem) {
        renameDossierModal.fileName.value = selectedItem.name;
      }
    }
    renameDossierModal.currentPath = this.model.currentPath;

    this.showModal('renameDossier', renameDossierModal, (err, response) => {
      console.log(err, response);
      this._listWalletContent();
    });
  }

  _shareDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (this.model.content.length) {
      let selectedItem = this.model.content
        .find(item => item.selected === 'selected');

      if (selectedItem) {
        shareDossierModal.selectedFile = selectedItem.name;
      }
    }
    shareDossierModal.currentPath = this.model.currentPath;

    this.showModal('shareDossier', shareDossierModal, (err, response) => {
      console.log(err, response);
      this._listWalletContent();
    });
  }

  _handleNavigation = (event) => {
    event.stopImmediatePropagation();

    let clickedDir = event.data;
    if (!clickedDir) {
      console.error(`Clicked directory is not valid!`, event);
      return;
    }

    let clickedDirViewModel = this.model.content.find((el) => el.name === clickedDir);
    if (!clickedDirViewModel) {
      console.error(`Clicked directory is not present in the model!`);
      return;
    }

    if (clickedDirViewModel.type !== 'folder' && clickedDirViewModel.type !== 'dossier') {
      console.error(`Clicked directory is not folder or dossier!`);
      return;
    }

    let wDir = this.model.currentPath || '/';
    let newWorkingDirectory = wDir === '/' ?
      `${wDir}${clickedDir}` :
      `${wDir}/${clickedDir}`;
    this.model.setChainValue('currentPath', newWorkingDirectory);
    this.model.setChainValue('content', []);
  };

  _listWalletContent() {
    let wDir = this.model.currentPath || '/';
    this.dossierService.readDir(wDir, {
      withFileTypes: true
    }, (err, dirContent) => {
      if (err) {
        console.log(err);
        Commons.updateErrorMessage(this.model, err);
        return;
      }
      console.log(dirContent);

      /** Add files to content model */
      if (dirContent.files && dirContent.files.length) {
        let viewModelFiles = dirContent.files.map((file) => {
          return {
            ...walletContentViewModel.defaultFileAttributes,
            name: file
          };
        });

        this.model.content = viewModelFiles;
      }

      /** Add folders to content model */
      if (dirContent.folders && dirContent.folders.length) {
        let viewModelFolders = dirContent.folders.map((folder) => {
          return {
            ...walletContentViewModel.defaultFolderAttributes,
            name: folder
          };
        });

        viewModelFolders.forEach((folder) => {
          this.model.content.push(folder);
        });
      }

      /** Add dossiers to content model */
      if (dirContent.mounts && dirContent.mounts.length) {
        let viewModelDossiers = dirContent.mounts.map((dossier) => {
          return {
            ...walletContentViewModel.defaultDossierAttributes,
            name: dossier
          };
        });

        viewModelDossiers.forEach((dossier) => {
          this.model.content.push(dossier);
        });
      }
    });
  }

  _handleFileFolderUpload = (event) => {
    event.stopImmediatePropagation();

    let filesArray = event.data || [];
    if (!filesArray.length) {
      Commons.updateErrorMessage(this.model, this.model.error.noFileUploadedLabel)
      return;
    }

    let wDir = this.model.currentPath || '/';
    let filesToBeUploaded = filesArray.length;
    // Open the ui-loader
    Commons.setLoadingState(this.model, true);

		const formData = new FormData();
		for (const f of filesArray) {
			// Use array notation in the key to indicate multiple files
			formData.append('files[]', f);
		}

		let folderName = filesArray[0].webkitRelativePath.replace(`/${filesArray[0].name}`, '');
		const url = `/upload?path=${wDir}&input=files[]&filename=${folderName}`;
		fetch(url, {
			method: "POST",
			body: formData
		}).then(response =>

			response.json().then((result) => {
				if (response.ok) {
					console.log("Upload was successful!");
					Commons.setLoadingState(this.model, false);
					this._listWalletContent();
				} else {
					console.log("Upload failed!");


					// Success or file level validation error
					if (Array.isArray(result)) {
						for (const item of result) {
							if (item.error) {
								console.error(`Unable to upload ${item.file.name} due to an error. Code: ${item.error.code}. Message: ${item.error.message}`);
								continue;
							}
							console.log(`Uploaded ${item.file.name} to ${item.result.path}`);
						}
						return;
					}

					// Validation error. Can happend when HTTP status is 400
					if (typeof result === 'object') {
						console.error(`An error occurred: ${result.message}. Code: ${result.code}`);
						return;
					}

					// Error is a string. This happens when the HTTP status is 500
					console.error(`An error occurred: ${result}`);
				}
			})


				.catch((err) => {
					console.log(err);
				}));


		// filesArray.forEach((file) => {
		//   let fName = file.name;
		//   if (file.webkitRelativePath.length) {
		//     wDir = file.webkitRelativePath.replace(`/${file.name}`, '');
		//   }
		//
		//   const url = `/upload?path=${wDir}&filename=${fName}`;
		//   fetch(url, {
		//       method: "POST",
		//       body: file
		//     })
		//     .then((response) => {
		//       response.json().then((result) => {
		//         if (response.ok) {
		//           console.log("Upload was successful!");
		//         } else {
		//           console.log("Upload failed!");
		//         }
		//
		//         // Success or file level validation error
		//         if (Array.isArray(result)) {
		//           for (const item of result) {
		//             if (item.error) {
		//               console.error(`Unable to upload ${item.file.name} due to an error. Code: ${item.error.code}. Message: ${item.error.message}`);
		//               continue;
		//             }
		//             console.log(`Uploaded ${item.file.name} to ${item.result.path}`);
		//           }
		//           return;
		//         }
		//
		//         // Validation error. Can happend when HTTP status is 400
		//         if (typeof result === 'object') {
		//           console.error(`An error occured: ${result.message}. Code: ${result.code}`);
		//           return;
		//         }
		//
		//         // Error is a string. This happens when the HTTP status is 500
		//         console.error(`An error occured: ${result}`);
		//       });
		//
		//       if ((--filesToBeUploaded) === 0) {
		//         // Close ui-loader after all the files are uploaded
		//         Commons.setLoadingState(this.model, false);
		//         this._listWalletContent();
		//       }
		//     })
		//     .catch((err) => {
		//       console.log(err);
		//     });
		// });
	}
}
