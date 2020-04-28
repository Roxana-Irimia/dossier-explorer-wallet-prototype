import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import {getDossierServiceInstance} from "../service/DossierExplorerService.js";

import rootModel from "../view-models/rootModel.js";
import signOutModal from "../view-models/signOutModal.js";
import createDossierModal from '../view-models/createDossierModal.js';
import receiveDossierModal from '../view-models/receiveDossierModal.js';
import importDossierModal from '../view-models/importDossierModal.js';
import deleteDossierModal from '../view-models/deleteDossierModal.js';
import renameDossierModal from '../view-models/renameDossierModal.js';
import shareDossierModal from '../view-models/shareDossierModal.js';

export default class ExplorerController extends ContainerController {
  constructor(element) {
    super(element);

    this.model = this.setModel(rootModel);
     let DossierService = getDossierServiceInstance();

     DossierService.listDossierFiles(function (err, files) {
       console.log(err, files);
     });

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
      // Fetch the new list for current path
      // Testing list items:
      this.__addDossier(response.dossierName);
    });
  }

  _receiveDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.showModal('receiveDossier', receiveDossierModal, (err, response) => {
      console.log(err, response);
      // Fetch the new list for current path
      // Testing list items:
      this.__addDossier(response.dossierName);
    });
  }

  _importDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.showModal('importDossier', importDossierModal, (err, response) => {
      console.log(err, response);
      // Fetch the new list for current path
      // Testing list items:
      this.__addDossier(response.dossierName);
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

      // To be deleted after item selection implementation
      // Testing deletion callbacks
      selectedItemsPaths.push(JSON.parse(JSON.stringify(this.model.content[0])).name);
    }

    deleteDossierModal.selectedItemsPaths = selectedItemsPaths;

    this.showModal('deleteDossier', deleteDossierModal, (err, response) => {
      console.log(err, response);
      // Fetch the new list for current path
      // Testing list items:
    });
  }

  _renameDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (this.model.content.length) {
      let selectedItem = this.model.content
        .find(item => item.selected === 'selected');

      // To be deleted after item selection implementation
      // Testing deletion callbacks
      selectedItem = JSON.parse(JSON.stringify(this.model.content[0]));

      if (selectedItem) {
        renameDossierModal.fileName.value = selectedItem.name;
      }
    }
    renameDossierModal.currentPath = this.model.currentPath;

    this.showModal('renameDossier', renameDossierModal, (err, response) => {
      console.log(err, response);
      // Fetch the new list for current path
      // Testing list items:
    });
  }

  _shareDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    let currentPath = this.model.currentPath === '/' ? '/' : `${this.model.currentPath}/`;
    if (this.model.content.length) {
      let selectedItem = this.model.content
        .find(item => item.selected === 'selected');

      // To be deleted after item selection implementation
      // Testing deletion callbacks
      selectedItem = JSON.parse(JSON.stringify(this.model.content[0]));

      if (selectedItem) {
        shareDossierModal.selectedFile = `${currentPath}${selectedItem.name}`;
      }
    }

    this.showModal('shareDossier', shareDossierModal, (err, response) => {
      console.log(err, response);
      // Fetch the new list for current path
      // Testing list items:
    });
  }

  /**
   * This fuction will be removed after integration
   * @param {*} dossierName
   */
  __addDossier(dossierName) {
    this.model.content.push({
      name: dossierName,
      type: 'dossier',
      icon: 'lock',
      gridIcon: 'lock',
      size: '-',
      lastModified: new Date().getTime()
    });
  }
}
