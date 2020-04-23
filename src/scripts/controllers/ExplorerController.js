import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";

import rootModel from "../view-models/rootModel.js";
import signOutModal from "../view-models/signOutModal.js";
import createDossierModal from '../view-models/createDossierModal.js';
import receiveDossierModal from '../view-models/receiveDossierModal.js';
import importDossierModal from '../view-models/importDossierModal.js';

export default class ExplorerController extends ContainerController {
  constructor(element) {
    super(element);

    this.model = this.setModel(rootModel);
    // let DossierService = getDossierServiceInstance();

    // DossierService.listDossierFiles(function (err, files) {
    //   console.log(err, files);
    // });

    this._initListeners();
  }

  _initListeners = () => {
    this.on("sign-out", this._signOutFromWalletHandler, true);
    this.on("switch-layout", this._handleSwitchLayout, true);

    this.on('create-dossier', this._createDossierHandler, true);
    this.on('receive-dossier', this._receiveDossierHandler, true);
    this.on('import-dossier', this._importDossierHandler, true);
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