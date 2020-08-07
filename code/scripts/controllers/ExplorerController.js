import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import FileDownloader from "./file-folder-controllers/FileDownloader.js";
import FeedbackController from "./FeedbackController.js";

import {
    getDossierServiceInstance
} from "../service/DossierExplorerService.js";

import rootModel from "../view-models/rootModel.js";

import createDossierViewModel from '../view-models/modals/dossier-modals/createDossierViewModel.js';
import receiveDossierViewModel from '../view-models/modals/dossier-modals/receiveDossierViewModel.js';
import shareDossierViewModel from '../view-models/modals/dossier-modals/shareDossierViewModel.js';

import newFileViewModel from "../view-models/modals/file-folder-modals/newFileViewModel.js";
import newFolderViewModel from "../view-models/modals/file-folder-modals/newFolderViewModel.js";

import deleteViewModel from '../view-models/modals/actions-modals/deleteViewModel.js';
import renameViewModel from '../view-models/modals/actions-modals/renameViewModel.js';
import moveViewModel from '../view-models/modals/actions-modals/moveViewModel.js';

import ExplorerNavigationController from "./ExplorerNavigationController.js";
import Constants from "./Constants.js";

export default class ExplorerController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        this.model = this.setModel(this._getCleanProxyObject(rootModel));
        this.dossierService = getDossierServiceInstance();
        this.feedbackController = new FeedbackController(this.model);
        this.explorerNavigator = new ExplorerNavigationController(element, history, this.model);

        this._initListeners();
        this._checkForLandingApp();
    }

    _initListeners = () => {
        this.on("switch-layout", this._handleSwitchLayout);
        this.on('open-options-menu', this._handleOptionsMenu);

        this.on('view-file', this._handleViewFile);
        this.on('export-dossier', this._handleDownload);

        this.on('create-dossier', this._createDossierHandler);
        this.on('receive-dossier', this._receiveDossierHandler);
        this.on('delete-dossier', this._deleteDossierHandler);
        this.on('share-dossier', this._shareDossierHandler);
        this.on('rename-dossier', this._renameDossierHandler);
        this.on('move-dossier', this._moveDossierHandler);
        this.on('run-app', this._handleRunApplication);

        this.on('new-file', this._addNewFileHandler);
        this.on('new-folder', this._addNewFolderHandler);
        this.on('add-file-folder', this._handleFileFolderUpload);
    };

    _handleOptionsMenu = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const selectedItem = event.data;
        let triggeredButton = event.path[0];
        let elementRect = triggeredButton.getBoundingClientRect();
        let itemActionsBtn = this.element.querySelector("#wallet-content-container").shadowRoot.querySelector("#item-actions");

        let containerHeight = selectedItem.optionsContainerHeight;
        let topCorrection = containerHeight / 2 - 15;
        if (window.innerHeight < elementRect.top + containerHeight / 2) {
            topCorrection = topCorrection + (elementRect.top + containerHeight / 2 - window.innerHeight);
        }
        itemActionsBtn.querySelector("psk-grid").style.top = elementRect.top - topCorrection + "px";
        itemActionsBtn.querySelector("psk-grid").style.left = elementRect.left - 220 + "px";

        if (!selectedItem) {
            return console.error(`No item selected!`);
        }

        this.model.optionsMenu.opened = true;
        this.model.optionsMenu.isApplication = selectedItem.isApplication;
        this.model.optionsMenu.icon = selectedItem.icon;
        this.model.optionsMenu.name = selectedItem.name;
        this.model.optionsMenu.dataType = selectedItem.dataType;
    }

    _checkForLandingApp() {
        this.DSUStorage.getObject("apps/.landingApp", (err, landingApp) => {
            if (!err && landingApp.name) {
                this.showModal("runApp", { name: landingApp.name });
                this.dossierService.deleteFileFolder("apps/.landingApp", (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        })

    }
    _handleRunApplication = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        let applicationName = event.data;
        let fullPath = this.explorerNavigator.getFullPath();

        this.dossierService.getMountedDossier(fullPath, (err, currentDossierPath) => {
            this.showModal("runAppModal", {
                name: applicationName,
                dossierContext: { fullPath: fullPath, currentDossierPath: currentDossierPath }
            }, () => {
                //TODO: what should happen when user closes the app?
            })
        })
    }

    _handleSwitchLayout = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        this.model.isGridLayout = !this.model.isGridLayout;
    };

    _createDossierHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        createDossierViewModel.currentPath = this.model.currentPath;
        this.showModal('createDossierModal', createDossierViewModel, (err, response) => {
            // Response will be used to display notification messages using psk-feedback component
            console.log(err, response);
            this.explorerNavigator.listWalletContent();
        });
    }

    _receiveDossierHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        receiveDossierViewModel.currentPath = this.model.currentPath;
        this.showModal('receiveDossierModal', receiveDossierViewModel, (err, response) => {
            // Response will be used to display notification messages using psk-feedback component
            console.log(err, response);
            this.explorerNavigator.listWalletContent();
        });
    }

    _deleteDossierHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const {
            currentPath,
            selectedItem
        } = this._getSelectedItemAndWorkingDir(event.data);

        const name = selectedItem.name;
        if (name === 'manifest') {
            console.error(this.model.error.labels.manifestManipulationError);
            return this.feedbackController.updateDisplayedMessage(Constants.ERROR, this.model.error.labels.manifestManipulationError);
        }

        deleteViewModel.path = currentPath;
        deleteViewModel.selectedItemName = selectedItem.name;
        deleteViewModel.selectedItemType = selectedItem.type;

        this.showModal('deleteModal', deleteViewModel, (err, response) => {
            // Response will be used to display notification messages using psk-feedback component
            console.log(err, response);
            this.explorerNavigator.listWalletContent();
        });
    }

    _renameDossierHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const {
            currentPath,
            selectedItem
        } = this._getSelectedItemAndWorkingDir(event.data);

        const name = selectedItem.name;
        if (name === 'manifest') {
            console.error(this.model.error.labels.manifestManipulationError);
            return this.feedbackController.updateDisplayedMessage(Constants.ERROR, this.model.error.labels.manifestManipulationError);
        }

        renameViewModel.fileNameInput.value = name;
        renameViewModel.oldFileName = name;
        renameViewModel.fileType = selectedItem.type;
        renameViewModel.currentPath = currentPath;

        this.showModal('renameModal', renameViewModel, (err, response) => {
            // Response will be used to display notification messages using psk-feedback component
            console.log(err, response);
            this.explorerNavigator.listWalletContent();
        });
    }

    _moveDossierHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const {
            currentPath,
            selectedItem
        } = this._getSelectedItemAndWorkingDir(event.data);

        if (selectedItem.name === 'manifest') {
            console.error(this.model.error.labels.manifestManipulationError);
            return this.feedbackController.updateDisplayedMessage(Constants.ERROR, this.model.error.labels.manifestManipulationError);
        }

        moveViewModel.selectedEntryName = selectedItem.name;
        moveViewModel.selectedEntryType = selectedItem.type;
        moveViewModel.currentWorkingDirectory = currentPath;
        moveViewModel.dateFormatOptions = this._getCleanProxyObject(this.model.dateFormatOptions);
        moveViewModel.contentLabels = {
            ...this.model.contentLabels,
            ...moveViewModel.contentLabels,
        };

        this.showModal('moveModal', moveViewModel, (err, response) => {
            // Response will be used to display notification messages using psk-feedback component
            console.log(err, response);
            this.explorerNavigator.listWalletContent();
        });
    }

    _shareDossierHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const {
            currentPath,
            selectedItem
        } = this._getSelectedItemAndWorkingDir(event.data);

        shareDossierViewModel.currentPath = currentPath;
        shareDossierViewModel.selectedFile = selectedItem.name;

        this.showModal('shareDossierModal', shareDossierViewModel, (err, response) => {
            // Response will be used to display notification messages using psk-feedback component
            console.log(err, response);
            this.explorerNavigator.listWalletContent();
        });
    }

    _addNewFileHandler = (event) => {
        event.stopImmediatePropagation();

        let wDir = this.model.currentPath || '/';
        if (wDir == '/') {
            wDir = '';
        }

        newFileViewModel.currentPath = wDir;
        this.showModal('newFileModal', newFileViewModel, (err, response) => {
            // Response will be used to display notification messages using psk-feedback component
            console.log(err, response);
            this.explorerNavigator.listWalletContent();
        });
    }

    _addNewFolderHandler = (event) => {
        event.stopImmediatePropagation();

        let wDir = this.model.currentPath || '/';
        if (wDir == '/') {
            wDir = '';
        }

        newFolderViewModel.currentPath = wDir;
        this.showModal('newFolderModal', newFolderViewModel, (err, response) => {
            // Response will be used to display notification messages using psk-feedback component
            console.log(err, response);
            this.explorerNavigator.listWalletContent();
        });
    }

    _handleFileFolderUpload = (event) => {
        event.stopImmediatePropagation();

        let filesArray = event.data || [];
        if (!filesArray.length) {
            this.feedbackController.updateDisplayedMessage(Constants.ERROR, this.model.error.noFileUploaded);
            return;
        }

        let wDir = this.model.currentPath || '/';
        // Open the ui-loader
        this.feedbackController.setLoadingState(true);
        this.DSUStorage.uploadMultipleFiles(wDir, filesArray, { preventOverwrite: true }, (err, filesUploaded) => {

            //TODO: check for errors:
            //successfully uploaded files are in err.data
            if (err) {
                return this.feedbackController.updateDisplayedMessage(Constants.ERROR, err);
            }

            console.log(filesUploaded);
            console.log("[Upload Finished!]");

            // Close the ui-loader as upload is finished
            this.feedbackController.setLoadingState(false);
            this.explorerNavigator.listWalletContent();
        })
    };

    _handleDownload = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const selectedItem = this._getSelectedItem(event.data);
        if (!selectedItem) {
            console.error(`No item selected to be downloaded!`);
            return;
        }

        const itemViewModel = this._getCleanProxyObject(selectedItem);
        if (itemViewModel.type === 'file') {
            this._handleDownloadFile(this.model.currentPath, itemViewModel.name);
        }
    }

    _handleDownloadFile(path, fileName) {
        let fileDownloader = new FileDownloader(path, fileName);
        fileDownloader.downloadFile();
    }

    _handleViewFile = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const selectedItem = this._getSelectedItem(event.data);
        if (!selectedItem) {
            console.error(`No item selected to be downloaded!`);
            return;
        }

        const itemViewModel = this._getCleanProxyObject(selectedItem);
        if (itemViewModel.type !== 'file') {
            console.error(`Only files support this funtionality!`);
            return;
        }

        this.explorerNavigator.openViewFileModal(itemViewModel);
    }

    _getSelectedItemAndWorkingDir = (name) => {
        if (!this.model.content.length) {
            throw console.error('No content available');
        }

        const selectedItem = this._getSelectedItem(name);
        if (!selectedItem) {
            throw console.error('No item selected!');
        }

        return {
            currentPath: this.model.currentPath,
            selectedItem: this._getCleanProxyObject(selectedItem)
        };
    }

    _getSelectedItem = (name) => {
        return this.model.content.find((el) => el.name === name);
    }

    _getCleanProxyObject = (obj) => {
        return obj ? JSON.parse(JSON.stringify(obj)) : null;
    }
}