import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import FileDownloader from "./FileDownloader.js";
import FeedbackController from "./FeedbackController.js";

import {
    getDossierServiceInstance
} from "../service/DossierExplorerService.js";

import rootModel from "../view-models/rootModel.js";
import newFileModal from "../view-models/newFileModal.js";
import newFolderModal from "../view-models/newFolderModal.js";
import createDossierModal from '../view-models/createDossierModal.js';
import receiveDossierModal from '../view-models/receiveDossierModal.js';
import deleteDossierModal from '../view-models/deleteDossierModal.js';
import renameDossierModal from '../view-models/renameDossierModal.js';
import moveDossierModal from '../view-models/moveDossierModal.js';
import shareDossierModal from '../view-models/shareDossierModal.js';
import ExplorerNavigatorController from "./ExplorerNavigatorController.js";

export default class ExplorerController extends ContainerController {
    constructor(element, history) {
        super(element, history);

        this.model = this.setModel(JSON.parse(JSON.stringify(rootModel)));
        this.dossierService = getDossierServiceInstance();
        this.feedbackController = new FeedbackController(this.model);
        this.navigatorController = new ExplorerNavigatorController(element, history, this.model);

        this._initListeners();
        this._checkForLandingApp();
    }

    _initListeners = () => {
        this.on("switch-layout", this._handleSwitchLayout);

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
        let fullPath = this.navigatorController.getFullPath();

        this.dossierService.getMountedDossier(fullPath, (err, currentDossierPath) => {
            this.showModal("runApp", {
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

    _deleteDossierHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const {
            currentPath,
            selectedItem
        } = this._getSelectedItemAndWorkingDir(event.data);

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

        const {
            currentPath,
            selectedItem
        } = this._getSelectedItemAndWorkingDir(event.data);

        const name = selectedItem.name;
        if (name === 'manifest') {
            console.error(this.model.error.manifestManipulationError);
            return this.feedbackController.updateErrorMessage(this.model.error.manifestManipulationError);
        }

        renameDossierModal.fileNameInput.value = name;
        renameDossierModal.oldFileName = name;
        renameDossierModal.currentPath = currentPath;

        this.showModal('renameDossier', renameDossierModal, (err, response) => {
            // Response will be used to display notification messages using psk-feedback component
            console.log(err, response);
            this.navigatorController.listWalletContent();
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
            console.error(this.model.error.manifestManipulationError);
            return this.feedbackController.updateErrorMessage(this.model.error.manifestManipulationError);
        }

        moveDossierModal.selectedEntryName = selectedItem.name;
        moveDossierModal.currentWorkingDirectory = currentPath;
        moveDossierModal.dateFormatOptions = this._getCleanProxyObject(this.model.dateFormatOptions);
        moveDossierModal.contentLabels = {
            ...this.model.contentLabels,
            ...moveDossierModal.contentLabels,
        };

        this.showModal('moveDossier', moveDossierModal, (err, response) => {
            // Response will be used to display notification messages using psk-feedback component
            console.log(err, response);
            this.navigatorController.listWalletContent();
        });
    }

    _shareDossierHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const {
            currentPath,
            selectedItem
        } = this._getSelectedItemAndWorkingDir(event.data);

        shareDossierModal.currentPath = currentPath;
        shareDossierModal.selectedFile = selectedItem.name;

        this.showModal('shareDossier', shareDossierModal, (err, response) => {
            // Response will be used to display notification messages using psk-feedback component
            console.log(err, response);
            this.navigatorController.listWalletContent();
        });
    }

    _addNewFileHandler = (event) => {
        event.stopImmediatePropagation();

        let wDir = this.model.currentPath || '/';
        if (wDir == '/') {
            wDir = '';
        }

        newFileModal.currentPath = wDir;
        this.showModal('newFile', newFileModal, (err, response) => {
            // Response will be used to display notification messages using psk-feedback component
            console.log(err, response);
            this.navigatorController.listWalletContent();
        });
    }

    _addNewFolderHandler = (event) => {
        event.stopImmediatePropagation();

        let wDir = this.model.currentPath || '/';
        if (wDir == '/') {
            wDir = '';
        }

        newFolderModal.currentPath = wDir;
        this.showModal('newFolder', newFolderModal, (err, response) => {
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
        this.DSUStorage.uploadMultipleFiles(wDir, filesArray, { preventOverwrite: true }, (err, filesUploaded) => {

            //TODO: check for errors:
            //successfully uploaded files are in err.data
            if (err) {
                return this.feedbackController.updateErrorMessage(err);
            }

            console.log(filesUploaded);
            console.log("[Upload Finished!]");

            // Close the ui-loader as upload is finished
            this.feedbackController.setLoadingState(false);
            this.navigatorController.listWalletContent();
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
            this._handleDownloadFile(itemViewModel.currentPath, itemViewModel.name);
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

        this.navigatorController.openViewFileModal(itemViewModel);
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