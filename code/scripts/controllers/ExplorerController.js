import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import FileDownloader from "./FileDownloader.js";
import FileUploader from "./FileUploader.js";
import FeedbackController from "./FeedbackController.js";

import {
  getDossierServiceInstance
} from "../service/DossierExplorerService.js";

import {
  getAccountServiceInstance
} from "../service/AccountService.js";

import rootModel from "../view-models/rootModel.js";
import signOutModal from "../view-models/signOutModal.js";
import createDossierModal from '../view-models/createDossierModal.js';
import receiveDossierModal from '../view-models/receiveDossierModal.js';
import importDossierModal from '../view-models/importDossierModal.js';
import deleteDossierModal from '../view-models/deleteDossierModal.js';
import renameDossierModal from '../view-models/renameDossierModal.js';
import moveDossierModal from '../view-models/moveDossierModal.js';
import shareDossierModal from '../view-models/shareDossierModal.js';
import ExplorerNavigatorController from "./ExplorerNavigatorController.js";

export default class ExplorerController extends ContainerController {
  constructor(element) {
    super(element);

    this.model = this.setModel(rootModel);
    this.dossierService = getDossierServiceInstance();
    this.feedbackController = new FeedbackController(this.model);
    this.navigatorController = new ExplorerNavigatorController(element, this.model);
    
    this._initListeners();
  }

  _initListeners = () => {
    this.on("sign-out", this._signOutFromWalletHandler);
    this.on("switch-layout", this._handleSwitchLayout);

    this.on('view-file', this._handleViewFile);
    this.on('export-dossier', this._handleDownload);

    this.on('create-dossier', this._createDossierHandler);
    this.on('receive-dossier', this._receiveDossierHandler);
    this.on('import-dossier', this._importDossierHandler);
    this.on('delete-dossier', this._deleteDossierHandler);
    this.on('share-dossier', this._shareDossierHandler);
    this.on('rename-dossier', this._renameDossierHandler);
    this.on('move-dossier', this._moveDossierHandler);

    this.on('add-file-folder', this._handleFileFolderUpload);
  };

  _handleSwitchLayout = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.model.isGridLayout = !this.model.isGridLayout;
  };

  _signOutFromWalletHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.showModal("signOut", signOutModal, (err, preferences) => {
      if (!err) {
        getAccountServiceInstance().signOut(preferences);
      }
    });
  };

  _createDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    createDossierModal.currentPath = this.model.currentPath;
    this.showModal('createDossier', createDossierModal, (err, response) => {
      // Response will be used to display notification messages using psk-feedback component
      console.log(err, response);
      this.navigatorController.listWalletContent();
    });
  }

  _receiveDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    receiveDossierModal.currentPath = this.model.currentPath;
    this.showModal('receiveDossier', receiveDossierModal, (err, response) => {
      // Response will be used to display notification messages using psk-feedback component
      console.log(err, response);
      this.navigatorController.listWalletContent();
    });
  }

  _importDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    importDossierModal.currentPath = this.model.currentPath;
    this.showModal('importDossier', importDossierModal, (err, response) => {
      // Response will be used to display notification messages using psk-feedback component
      console.log(err, response);
      this.navigatorController.listWalletContent();
    });
  }

  _deleteDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    /**
     * Before showModal, set the selectedItemsPaths attribute inside deleteDossierModal,
     * so the controller can handle the delete process
     */
    let currentPath = this.model.currentPath === '/' ? '' : `${this.model.currentPath}`;
    let selectedItem = this.model.selectedItem.item;
    deleteDossierModal.path = currentPath;
    deleteDossierModal.selectedItemName = selectedItem.name;
    deleteDossierModal.selectedItemType = selectedItem.type;

    this.showModal('deleteDossier', deleteDossierModal, (err, response) => {
      // Response will be used to display notification messages using psk-feedback component
      console.log(err, response);
      this.navigatorController.listWalletContent();
    });
  }

  _renameDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (!this.model.content.length) {
      return console.error('No content available');
    }

    const currentPath = this.model.currentPath === '/' ? '' : `${this.model.currentPath}`;
    const selectedItem = this.model.selectedItem.item;

    if (selectedItem) {
      const name = selectedItem.name;

      if (name === 'manifest') {
        console.error(this.model.error.manifestRenameError);
        return this.feedbackController.updateErrorMessage(this.model.error.manifestRenameError);
      }

      renameDossierModal.fileNameInput.value = name;
      renameDossierModal.oldFileName = name;
      renameDossierModal.currentPath = currentPath;
    }

    this.showModal('renameDossier', renameDossierModal, (err, response) => {
      // Response will be used to display notification messages using psk-feedback component
      console.log(err, response);
      this.navigatorController.listWalletContent();
    });
  }

  _moveDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (!this.model.content.length) {
      return console.error('No content available');
    }

    const currentPath = this.model.currentPath === '/' ? '' : `${this.model.currentPath}`;
    const selectedItem = this.model.selectedItem.item;

    if (selectedItem) {
      moveDossierModal.myWalletLabel = this.model.myWalletLabel;
      moveDossierModal.selectedEntryName = selectedItem.name;
      moveDossierModal.currentPath = currentPath;
    }

    this.showModal('moveDossier', moveDossierModal, (err, response) => {
      // Response will be used to display notification messages using psk-feedback component
      console.log(err, response);
      this.navigatorController.listWalletContent();
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
      // Response will be used to display notification messages using psk-feedback component
      console.log(err, response);
      this.navigatorController.listWalletContent();
    });
  }

  _handleFileFolderUpload = (event) => {
    event.stopImmediatePropagation();

    let filesArray = event.data || [];
    if (!filesArray.length) {
      this.feedbackController.updateErrorMessage(this.model.error.noFileUploadedLabel);
      return;
    }

    let wDir = this.model.currentPath || '/';
    // Open the ui-loader
    this.feedbackController.setLoadingState(true);
    let fileUploader = new FileUploader(wDir, filesArray);
    fileUploader.startUpload((err, result) => {
      if (err) {
        return this.feedbackController.updateErrorMessage(err);
      }

      console.log("[Upload Finished!]");
      console.log(result);
      console.log("[Upload Finished!]");

      // Close the ui-loader as upload is finished
      this.feedbackController.setLoadingState(false);
      this.navigatorController.listWalletContent();
    });
  }

  _handleDownload = (event) => {
    event.stopImmediatePropagation();

    let selectedItem = this.model.selectedItem;
    if (!selectedItem || !selectedItem.item) {
      console.error(`No item selected to be downloaded!`);
      return;
    }

    let itemViewModel = selectedItem.item;
    switch (itemViewModel.type) {
      case 'file': {
        this._handleDownloadFile(itemViewModel.currentPath, itemViewModel.name);
        break;
      }
      case 'folder':
      case 'dossier':
      default:
        break;
    }
  }

  _handleDownloadFile(path, fileName) {
    let fileDownloader = new FileDownloader(path, fileName);
    fileDownloader.downloadFile();
  }

  _handleViewFile = (event) => {
    event.stopImmediatePropagation();

    let selectedItem = this.model.selectedItem;
    if (!selectedItem || !selectedItem.item) {
      console.error(`No item selected to be downloaded!`);
      return;
    }

    let itemViewModel = selectedItem.item;
    if (itemViewModel.type !== 'file') {
      console.error(`Only files support this funtionality!`);
      return;
    }

    this._openViewFileModal(itemViewModel);
  }

  _openViewFileModal = (viewModel) => {
    let path = viewModel.currentPath || '/';
    if (path === '/') {
      path = '';
    }

    viewModel.title = `${path}/${viewModel.name}`;
    viewModel.path = path;
    this.showModal('viewAsset', viewModel, (err, response) => {
      console.log(err, response);
    });
  }
}