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
import walletContentViewModel from '../view-models/walletContentViewModel.js';
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
    this.dossierService = getDossierServiceInstance();
    this.feedbackController = new FeedbackController(this.model);

    this._listWalletContent();
    this._initNavigationLinks();
    this._initListeners();
  }

  _initListeners = () => {
    this.on("sign-out", this._signOutFromWalletHandler, true);
    this.on("switch-layout", this._handleSwitchLayout, true);

    this.on('view-file', this._handleViewFile, true);
    this.on('export-dossier', this._handleDownload, true);

    this.on('create-dossier', this._createDossierHandler, true);
    this.on('receive-dossier', this._receiveDossierHandler, true);
    this.on('import-dossier', this._importDossierHandler, true);
    this.on('delete-dossier', this._deleteDossierHandler, true);
    this.on('share-dossier', this._shareDossierHandler, true);
    this.on('rename-dossier', this._renameDossierHandler, true);

    this.on('add-file-folder', this._handleFileFolderUpload, true);

    this.on('select-wallet-item', this._handleSelectWalletItem, true);
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
      this._listWalletContent();
    });
  }

  _receiveDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    receiveDossierModal.currentPath = this.model.currentPath;
    this.showModal('receiveDossier', receiveDossierModal, (err, response) => {
      // Response will be used to display notification messages using psk-feedback component
      console.log(err, response);
      this._listWalletContent();
    });
  }

  _importDossierHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    importDossierModal.currentPath = this.model.currentPath;
    this.showModal('importDossier', importDossierModal, (err, response) => {
      // Response will be used to display notification messages using psk-feedback component
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
    let selectedItem = this.model.selectedItem.item;
    deleteDossierModal.path = currentPath;
    deleteDossierModal.selectedItemName = selectedItem.name;
    deleteDossierModal.selectedItemType = selectedItem.type;

    this.showModal('deleteDossier', deleteDossierModal, (err, response) => {
      // Response will be used to display notification messages using psk-feedback component
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
      // Response will be used to display notification messages using psk-feedback component
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
      // Response will be used to display notification messages using psk-feedback component
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

    let clickedItem = event.data;
    if (!clickedItem) {
      console.error(`Clicked item is not valid!`, event);
      return;
    }

    let clickedItemViewModel = this.model.content.find((el) => el.name === clickedItem);
    if (!clickedItemViewModel) {
      console.error(`Clicked item is not present in the model!`);
      return;
    }

    switch (clickedItemViewModel.type) {
      case 'file': {
        clickedItemViewModel.currentPath = this.model.currentPath || '/';
        this._openViewFileModal(clickedItemViewModel);
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
          `${wDir}${clickedItem}` :
          `${wDir}/${clickedItem}`;
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

  _resetLastSelected = (lastSelectedName) => {
    let previouslySelected = this.model.content.find((item) => {
      return item.selected === 'selected' &&
        (lastSelectedName && item.name !== lastSelectedName);
    });
    if (previouslySelected) {
      previouslySelected.selected = '';
      this.model.setChainValue('selectedItem.selected', false);
      this.model.setChainValue('selectedItem.item', []);
    }
  }

  _handleSelectWalletItem = (event) => {
    event.stopImmediatePropagation();

    let selectedItem = event.data || null;
    if (!selectedItem) {
      console.error('An item was not clicked!');
      return;
    }

    let selectedItemViewModel = this.model.content.find((el) => el.name === selectedItem);
    if (!selectedItemViewModel) {
      console.error('The clicked item is not in the view-model!');
      return;
    }

    // Reset the last selected item(if any), as for the moment we support only single selection
    this._resetLastSelected(selectedItemViewModel.name);

    let isSelected = selectedItemViewModel.selected === 'selected';
    if (isSelected) {
      selectedItemViewModel.selected = '';
      this.model.setChainValue('selectedItem.selected', false);
      this.model.setChainValue('selectedItem.item', []);
    } else {
      selectedItemViewModel.selected = 'selected';
      let item = {
        ...selectedItemViewModel,
        currentPath: this.model.currentPath,
        isFile: selectedItemViewModel.type === 'file',
        isFolder: selectedItemViewModel.type === 'folder',
        isDossier: selectedItemViewModel.type === 'dossier',
        isApplication: selectedItemViewModel.isApplication
      };

      this.model.setChainValue('selectedItem.item', JSON.parse(JSON.stringify(item)));
      this.model.setChainValue('selectedItem.selected', true);
    }
  };

  _listWalletContent() {
    let wDir = this.model.currentPath || '/';
    this.dossierService.readDir(wDir, {
      withFileTypes: true
    }, (err, dirContent) => {
      if (err) {
        console.error(err);
        this.feedbackController.updateErrorMessage(err);
        return;
      }
      let newContent = [];

      /** Add files to content model */
      if (dirContent.files && dirContent.files.length) {
        let viewModelFiles = dirContent.files
          .filter(el => !!el)
          .map((file) => {
            let fName = file.trim();
            if (fName.length && fName.charAt(0) === '/') {
              fName = fName.replace('/', '');
            }
            return {
              ...walletContentViewModel.defaultFileAttributes,
              name: fName
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
            let fName = folder.trim();
            if (fName.length && fName.charAt(0) === '/') {
              fName = fName.replace('/', '');
            }
            return {
              ...walletContentViewModel.defaultFolderAttributes,
              name: fName
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
            let dName = dossier.trim();
            if (dName.length && dName.charAt(0) === '/') {
              dName = dName.replace('/', '');
            }
            return {
              ...walletContentViewModel.defaultDossierAttributes,
              name: dName
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
      this._listWalletContent();
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
    viewModel.title = path + viewModel.name;
    viewModel.path = path;
    this.showModal('viewAsset', viewModel, (err, response) => {
      console.log(err, response);
    });
  }
}