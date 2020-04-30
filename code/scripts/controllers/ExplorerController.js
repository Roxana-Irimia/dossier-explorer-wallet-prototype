import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import {
  getDossierServiceInstance
} from "../service/DossierExplorerService.js";

import rootModel from "../view-models/rootModel.js";
import signOutModal from "../view-models/signOutModal.js";
import addFileFolderViewModel from '../view-models/addFileFolder.js';
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

    this._listFiles();
    this._initListeners();
  }

  _initListeners = () => {
    this.on("sign-out", this._signOutFromWalletHandler, true);
    this.on("switch-layout", this._handleSwitchLayout, true);

    this.on('add-file-folder', this._handleFileFolderUpload, true)
    this.on('create-dossier', this._createDossierHandler, true);
    this.on('receive-dossier', this._receiveDossierHandler, true);
    this.on('import-dossier', this._importDossierHandler, true);
    this.on('delete-dossier', this._deleteDossierHandler, true);
    this.on('share-dossier', this._shareDossierHandler, true);
    this.on('rename-dossier', this._renameDossierHandler, true);
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

    this.showModal('createDossier', createDossierModal, (err, response) => {
      console.log(err, response);
      this._listFiles();
    });
  }

  _receiveDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.showModal('receiveDossier', receiveDossierModal, (err, response) => {
      console.log(err, response);
      this._listFiles();
    });
  }

  _importDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.showModal('importDossier', importDossierModal, (err, response) => {
      console.log(err, response);
      this._listFiles();
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
      this._listFiles();
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
      this._listFiles();
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
      this._listFiles();
    });
  }

  _listFiles() {
    let wDir = this.model.currentPath || '/';

    this.dossierService.listDossierFolders(wDir, (err, folders) => {
      if (err) {
        Commons.updateErrorMessage(this.model, this.model.error.genericErrorLabel);
      } else {
        const filteredFolders = folders.filter((folderName) => {
          let paths = folderName.replace(wDir, '').split('/');
          return paths.length <= 1;
        })

        const foldersViewModel = filteredFolders.map((folderName) => {
          return {
            name: folderName.replace(wDir, ''),
            ...addFileFolderViewModel.defaultFolderAttributes
          };
        });

        this.model.content = foldersViewModel;
      }
    });

    this.dossierService.listDossierFiles(wDir, (err, files) => {
      if (err) {
        Commons.updateErrorMessage(this.model, this.model.error.genericErrorLabel);
      } else {
        const filteredFiles = files.filter((fileName) => {
          let paths = fileName.replace(wDir, '').split('/');
          return paths.length <= 1;
        })

        const filesViewModel = filteredFiles.map((fileName) => {
          return {
            name: fileName.replace(wDir, ''),
            ...addFileFolderViewModel.defaultFileAttributes
          };
        });

        this.model.content = filesViewModel;
      }
    });
  }

  _handleFileFolderUpload = async (event) => {
    event.stopImmediatePropagation();

    let filesArray = event.data || [];
    if (!filesArray.length) {
      Commons.updateErrorMessage(this.model, this.model.error.noFileUploadedLabel)
      return;
    }

    let wDir = this.model.currentPath || '/';
    const url = `/upload?path=${wDir}&input=files[]`;

    let formData = new FormData();
    for (const f of filesArray) {
      if (f.webkitRelativePath.length) {
        f.name = f.webkitRelativePath;
      }
      formData.append('files[]', f);
    }

    console.log(filesArray, formData);

    let response = await fetch(url, {
      method: "POST",
      body: formData
    });

    let resJson = await response.json();
    console.log('Response json after upload');
    console.log(resJson);
    this._listFiles();
  }
}