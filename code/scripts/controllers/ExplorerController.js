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
    this._initNavigationLinks();
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

    this.on('double-click-item', this._handleDoubleClick, true);
    this.on('change-directory', this._handleChangeDirectory, true);

    /**
     * Model chain change watchers
     */
    this.model.onChange('currentPath', () => {
      this._listWalletContent();
      this._initNavigationLinks();
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

    receiveDossierModal.currentPath = this.model.currentPath;
    this.showModal('receiveDossier', receiveDossierModal, (err, response) => {
      console.log(err, response);
      this._listWalletContent();
    });
  }

  _importDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    importDossierModal.currentPath = this.model.currentPath;
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

  _initNavigationLinks() {
    let wDir = this.model.currentPath || '/';
    let links = [{
      label: this.model.dossierContentLabels.homeLabel,
      path: '/',
      disabled: false
    }];

    // If the current path is root
    if (wDir === '/') {
      links[0].disabled = true;
      this.model.setChainValue('navigationLinks', links);
      return;
    }

    // If anything, but root
    let paths = wDir.split('/');
    // pop out first element as it is the root and create below the My Wallet(Home / Root) Link
    paths.shift();

    paths.forEach((pathSegment) => {
      let path = links[links.length - 1].path;
      if (path === '/') {
        path = `/${pathSegment}`;
      } else {
        path = `${path}/${pathSegment}`;
      }

      links.push({
        label: pathSegment,
        path: path,
        disabled: false
      });
    });

    // Disable the last link as it is the current directory in navigation
    links[links.length - 1].disabled = true;

    // Set the navigation links to view-model
    this.model.setChainValue('navigationLinks', links);
  }

  _handleDoubleClick = (event) => {
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

    switch (clickedDirViewModel.type) {
      case 'file': {
        // handle double-click or click+enter to enter preview
        break;
      }
      case 'app': {
        // handle double-click or click+enter to run the applicaion
        break;
      }
      case 'folder':
      case 'dossier': {
        let wDir = this.model.currentPath || '/';
        let newWorkingDirectory = wDir === '/' ?
          `${wDir}${clickedDir}` :
          `${wDir}/${clickedDir}`;
        this.model.setChainValue('currentPath', newWorkingDirectory);
      }
      default:
        break;
    }
  };

  _handleChangeDirectory = (event) => {
    event.stopImmediatePropagation();

    let path = event.data || '/';
    this.model.setChainValue('currentPath', path);
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
      let newContent = [];

      /** Add files to content model */
      if (dirContent.files && dirContent.files.length) {
        let viewModelFiles = dirContent.files
          .filter(el => !!el)
          .map((file) => {
            return {
              ...walletContentViewModel.defaultFileAttributes,
              name: file
            };
          });

        viewModelFiles.forEach((file) => {
          newContent.push(file);
        });
      }

      /** Add folders to content model */
      if (dirContent.folders && dirContent.folders.length) {
        let viewModelFolders = dirContent.folders
          .filter(el => !!el)
          .map((folder) => {
            return {
              ...walletContentViewModel.defaultFolderAttributes,
              name: folder
            };
          });

        viewModelFolders.forEach((folder) => {
          newContent.push(folder);
        });
      }

      /** Add dossiers to content model */
      if (dirContent.mounts && dirContent.mounts.length) {
        let viewModelDossiers = dirContent.mounts
          .filter(el => !!el)
          .map((dossier) => {
            return {
              ...walletContentViewModel.defaultDossierAttributes,
              name: dossier
            };
          });

        viewModelDossiers.forEach((dossier) => {
          newContent.push(dossier);
        });
      }

      this.model.setChainValue('content', newContent);
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
      })
      .then((response) => {
        if (response.ok) {
          console.log('Upload OK!');
        } else {
          console.log('Upload FAILED!');
        }
        return response.json();
      })
      .then((responseJSON) => {
        console.log(responseJSON);
        Commons.setLoadingState(this.model, false);
        this._listWalletContent();

        // Success or file level validation error
        if (Array.isArray(responseJSON)) {
          for (const item of responseJSON) {
            if (item.error) {
              console.error(`Unable to upload ${item.file.name} due to an error. Code: ${item.error.code}. Message: ${item.error.message}`);
              continue;
            }
            console.log(`Uploaded ${item.file.name} to ${item.result.path}`);
          }
          return;
        }

        // Validation error. Can happend when HTTP status is 400
        if (typeof responseJSON === 'object') {
          console.error(`An error occurred: ${responseJSON.message}. Code: ${responseJSON.code}`);
          return;
        }

        // Error is a string. This happens when the HTTP status is 500
        console.error(`An error occurred: ${responseJSON}`);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}