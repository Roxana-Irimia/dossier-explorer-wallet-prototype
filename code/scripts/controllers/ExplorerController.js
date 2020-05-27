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
import DateFormat from "./libs/DateFormat.js";

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

    this.on('add-file-folder', this._handleFileFolderUpload, );

    this.on('select-wallet-item', this._handleSelectWalletItem);
    this.on('double-click-item', this._handleDoubleClick);
    this.on('change-directory', this._handleChangeDirectory);

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
    }, this._updateWalletContent);
  }

  _updateWalletContent = (err, dirContent) => {
    let newContent = [];

    if (err) {
      this.feedbackController.updateErrorMessage(err);
      this.model.setChainValue('content', newContent);
      return;
    }

    /** Add dossiers to content model */
    if (dirContent.mounts && dirContent.mounts.length) {
      newContent = this._updateContentForType(newContent,
        dirContent.mounts,
        walletContentViewModel.defaultDossierAttributes);
    }

    /** Add folders to content model */
    if (dirContent.folders && dirContent.folders.length) {
      newContent = this._updateContentForType(newContent,
        dirContent.folders,
        walletContentViewModel.defaultFolderAttributes);
    }

    /** Add files to content model */
    if (dirContent.files && dirContent.files.length) {
      newContent = this._updateContentForType(newContent,
        dirContent.files,
        walletContentViewModel.defaultFileAttributes);
    }

    this.model.setChainValue('content', newContent);
  }

  /**
   * To be removed after edfs provides the last modified attribute
   */
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  _updateContentForType = (fullContentList, contentToAppend, defaultViewModel) => {
    let mappedContentToAppend = contentToAppend.filter(el => !!el)
      .map(el => {
        let name = el.trim();
        if (name.length && name.charAt(0) === '/') {
          name = name.replace('/', '');
        }

        let viewModelObject = {
          ...defaultViewModel,
          name: name
        };

        const lastModified = this.getRandomInt(1590000000000, new Date().getTime());
        const dateFormat = new DateFormat(lastModified, this.model.dateFormatOptions);
        viewModelObject.fullDateHover = dateFormat.getFullDateString();
        viewModelObject.lastModified = dateFormat.isInLastDay() ?
          dateFormat.getFormattedTime() : dateFormat.getFormattedDate();

        return viewModelObject;
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    mappedContentToAppend.forEach(el => {
      fullContentList.push(el);
    });

    return fullContentList;
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

    viewModel.title = `${path}/${viewModel.name}`;
    viewModel.path = path;
    this.showModal('viewAsset', viewModel, (err, response) => {
      console.log(err, response);
    });
  }
}