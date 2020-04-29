import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import DossierService from "../service/DossierExplorerService.js";

import rootModel from "../view-models/rootModel.js";
import signOutModal from "../view-models/signOutModal.js";
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
    DossierService.listDossierFiles(wDir, (err, files) => {
      if (err) {
        Commons.updateErrorMessage(this.model, this.model.error.genericErrorLabel);
      } else {
        this.model.content = files.map(fileName => {
          return {
            name: fileName.replace(wDir, ''),
            type: 'file'
          };
        });
      }
    });
  }

  _handleFileFolderUpload = async (event) => {
    event.stopImmediatePropagation();

    let filesArray = event.data || [];
    let wDir = this.model.currentPath || '/';
    let file = filesArray[0] || {
      name: 'no-file'
    };
    // filesArray.forEach(file => {
    const url = `/upload?path=${wDir}&filename=${file.name}`;
    let response = await fetch(url, {
      method: "POST",
      body: file
    });
    let resJson = await response.json();
    console.log(resJson);
    this._listFiles();
    // .then((response) => {
    //   return response.json((result) => {
    //     this._listFiles();
    //     return result;
    //   }).catch((err) => {
    //     return Promise.resolve({});
    //   })
    // });
    // });
  }
}