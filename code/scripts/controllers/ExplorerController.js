const { WebcController } = WebCardinal.controllers;
import FileDownloader from "./file-folder-controllers/FileDownloader.js";
import FeedbackController from "./FeedbackController.js";

import rootModel from "../view-models/rootModel.js";

import receiveDossierViewModel from '../view-models/modals/dossier-modals/receiveDossierViewModel.js';
import testDossierHandlerViewModel from '../view-models/modals/dossier-modals/testDossierHandlerViewModel.js';
import testContractViewModel from '../view-models/modals/dossier-modals/testContractViewModel.js';
import shareDossierViewModel from '../view-models/modals/dossier-modals/shareDossierViewModel.js';

import newFileViewModel from "../view-models/modals/file-folder-modals/newFileViewModel.js";
import newFolderViewModel from "../view-models/modals/file-folder-modals/newFolderViewModel.js";

import deleteViewModel from '../view-models/modals/actions-modals/deleteViewModel.js';
import renameViewModel from '../view-models/modals/actions-modals/renameViewModel.js';
import moveViewModel from '../view-models/modals/actions-modals/moveViewModel.js';

import ExplorerNavigationController from "./ExplorerNavigationController.js";
import Constants from "./Constants.js";
import { getNewDossierServiceInstance } from "../service/NewDossierExplorerServiceWallet.js";

export default class ExplorerController extends WebcController {
    constructor(...props) {
        super(...props);
        this.model = this._getCleanProxyObject(rootModel);
        this._init(props[0], props[1]);
    }

    async _init(element, history) {
        this.dossierService = await getNewDossierServiceInstance();
        // this.dossierService = getDossierServiceInstance();
        this.feedbackController = new FeedbackController(this.model);
        this.explorerNavigator = new ExplorerNavigationController(element, history, this.model);

        this._initListeners();
        this._checkForLandingApp();
    }

    _initListeners = () => {
        this.onTagClick('openFeedback', (evt) => {
            this.feedbackEmitter = evt.detail;
        });

        this.onTagClick("switch-layout", this._handleSwitchLayout);
        this.onTagClick('open-options-menu', this._handleOptionsMenu);

        this.onTagClick('view-file', this._handleViewFile);
        this.onTagClick('export-dossier', this._handleDownload);

        this.onTagClick('create-dossier', this._createDossierHandler);
        this.onTagClick('receive-dossier', this._receiveDossierHandler);
        this.onTagClick('test-dossier-handler', this._testDossierHandler);
        this.onTagClick('test-contract', this._testContract);
        this.onTagClick('share-dossier', this._shareDossierHandler);
        this.onTagClick('delete', this._deleteHandler);
        this.onTagClick('rename', this._renameHandler);
        this.onTagClick('move', this._moveHandler);
        this.onTagClick('run-app', this._handleRunApplication);

        this.onTagClick('new-file', this._addNewFileHandler);
        this.onTagClick('new-folder', this._addNewFolderHandler);
        document.querySelector("#folder-upload").addEventListener('change', this._handleFileFolderUpload);
    };

    _handleOptionsMenu = (event) => {
        // event.preventDefault();
        // event.stopImmediatePropagation();
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

        itemActionsBtn.setAttribute("opened", "");
        this.model.optionsMenu.isApplication = selectedItem.isApplication;
        this.model.optionsMenu.icon = selectedItem.icon;
        this.model.optionsMenu.name = selectedItem.name;
        this.model.optionsMenu.dataType = selectedItem.dataType;
    };

    _checkForLandingApp() {
        this.DSUStorage.getObject("apps/.landingApp", (err, landingApp) => {
            if (!err && landingApp && landingApp.name) {
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

        this.dossierService.printDossierSeed(fullPath, applicationName, (err, keySSI) => {
            if (err) {
                return console.error(err);
            }

            this.showModal("runAppModal", {
                name: applicationName,
                keySSI: keySSI
            }, () => {
                //TODO: what should happen when user closes the app?
            })
        })
    };

    _handleSwitchLayout = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        this.model.isGridLayout = !this.model.isGridLayout;
    };

    _createDossierHandler = (event) => {
        // event.preventDefault();
        // event.stopImmediatePropagation();

       
        this.showModalFromTemplate('./dossier/create-dossier-modal', () => {}, (event) => {
            // const successMessage = this.model[Constants.SUCCESS].dossierCreated
            //     .replace(Constants.NAME_PLACEHOLDER, response.name)
            //     .replace(Constants.PATH_PLACEHOLDER, response.path);
            // this.feedbackEmitter(successMessage, null, Constants.SUCCESS_FEEDBACK_TYPE);
            this.explorerNavigator.listDossierContent();
        }, {
            controller: "dossier-controllers/CreateDossierController",
            model: this.model
        });
    };

    _receiveDossierHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        receiveDossierViewModel.currentPath = this.model.currentPath;
        this.showModal('receiveDossierModal', receiveDossierViewModel, (err, response) => {
            if (err) {
                return this.feedbackEmitter(err, null, Constants.ERROR_FEEDBACK_TYPE);
            }

            const successMessage = this.model[Constants.SUCCESS].dossierImported
                .replace(Constants.NAME_PLACEHOLDER, response.name)
                .replace(Constants.PATH_PLACEHOLDER, response.path);
            this.feedbackEmitter(successMessage, null, Constants.SUCCESS_FEEDBACK_TYPE);
            this.explorerNavigator.listDossierContent();
        });
    };

    _testDossierHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        testDossierHandlerViewModel.currentPath = this.model.currentPath;
        this.showModal('testDossierHandlerModal', testDossierHandlerViewModel);
    }

    _testContract = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        testContractViewModel.currentPath = this.model.currentPath;
        this.showModal('testContractModal', testContractViewModel);
    }

    _deleteHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const {
            currentPath,
            selectedItem
        } = this._getSelectedItemAndWorkingDir(event.data);

        const name = selectedItem.name;
        if (name === 'manifest') {
            return this.feedbackEmitter(this.model.error.labels.manifestManipulationError, null, Constants.ERROR_FEEDBACK_TYPE);
        }

        deleteViewModel.path = currentPath;
        deleteViewModel.selectedItemName = selectedItem.name;
        deleteViewModel.selectedItemType = selectedItem.type;

        this.showModal('deleteModal', deleteViewModel, (err, response) => {
            if (err) {
                return this.feedbackEmitter(err, null, Constants.ERROR_FEEDBACK_TYPE);
            }

            const successMessage = this.model[Constants.SUCCESS].delete
                .replace(Constants.NAME_PLACEHOLDER, response.name);
            this.feedbackEmitter(successMessage, null, Constants.SUCCESS_FEEDBACK_TYPE);
            this.explorerNavigator.listDossierContent();
        });
    };

    _renameHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const {
            currentPath,
            selectedItem
        } = this._getSelectedItemAndWorkingDir(event.data);

        const name = selectedItem.name;
        if (name === 'manifest') {
            return this.feedbackEmitter(this.model.error.labels.manifestManipulationError, null, Constants.ERROR_FEEDBACK_TYPE);
        }

        renameViewModel.fileNameInput.value = name;
        renameViewModel.oldFileName = name;
        renameViewModel.fileType = selectedItem.type;
        renameViewModel.currentPath = currentPath;

        this.showModal('renameModal', renameViewModel, (err, response) => {
            if (err) {
                return this.feedbackEmitter(err, null, Constants.ERROR_FEEDBACK_TYPE);
            }

            if (!response.cancel) {
                const successMessage = this.model[Constants.SUCCESS].rename
                    .replace(Constants.FROM_PLACEHOLDER, response.from)
                    .replace(Constants.TO_PLACEHOLDER, response.to);
                this.feedbackEmitter(successMessage, null, Constants.SUCCESS_FEEDBACK_TYPE);
                this.explorerNavigator.listDossierContent();
            }
        });
    };

    _moveHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const {
            currentPath,
            selectedItem
        } = this._getSelectedItemAndWorkingDir(event.data);

        if (selectedItem.name === 'manifest') {
            return this.feedbackEmitter(this.model.error.labels.manifestManipulationError, null, Constants.ERROR_FEEDBACK_TYPE);
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
            if (err) {
                return this.feedbackEmitter(err, null, Constants.ERROR_FEEDBACK_TYPE);
            }

            if (!response.cancel) {
                const successMessage = this.model[Constants.SUCCESS].move
                    .replace(Constants.NAME_PLACEHOLDER, response.name)
                    .replace(Constants.FROM_PLACEHOLDER, response.from)
                    .replace(Constants.TO_PLACEHOLDER, response.to);
                this.feedbackEmitter(successMessage, null, Constants.SUCCESS_FEEDBACK_TYPE);
                this.explorerNavigator.listDossierContent();
            }
        });
    };

    _shareDossierHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const {
            currentPath,
            selectedItem
        } = this._getSelectedItemAndWorkingDir(event.data);

        shareDossierViewModel.currentPath = currentPath;
        shareDossierViewModel.selectedFile = selectedItem.name;

        this.showModal('shareDossierModal', shareDossierViewModel, (err) => {
            if (err) {
                this.feedbackEmitter(err, null, Constants.ERROR_FEEDBACK_TYPE);
            }
        });
    };

    _addNewFileHandler = (event) => {
        event.stopImmediatePropagation();

        let wDir = this.model.currentPath || '/';
        if (wDir === '/') {
            wDir = '';
        }

        newFileViewModel.currentPath = wDir;
        this.showModal('newFileModal', newFileViewModel, (err, response) => {
            if (err) {
                return this.feedbackEmitter(err, null, Constants.ERROR_FEEDBACK_TYPE);
            }

            const successMessage = this.model[Constants.SUCCESS].fileCreated
                .replace(Constants.NAME_PLACEHOLDER, response.name)
                .replace(Constants.PATH_PLACEHOLDER, response.path);
            this.feedbackEmitter(successMessage, null, Constants.SUCCESS_FEEDBACK_TYPE);
            this.explorerNavigator.listDossierContent();
        });
    };

    _addNewFolderHandler = (event) => {
        //event.stopImmediatePropagation();

        let wDir = this.model.currentPath || '/';
        if (wDir === '/') {
            wDir = '';
        }

        newFolderViewModel.currentPath = wDir;
        this.showModalFromTemplate('file-folder/new-folder-modal', ()=>{}, (err, response) => {
            // if (err) {
            //     return this.feedbackEmitter(err, null, Constants.ERROR_FEEDBACK_TYPE);
            // }

            // const successMessage = this.model[Constants.SUCCESS].folderCreated
            //     .replace(Constants.NAME_PLACEHOLDER, response.name)
            //     .replace(Constants.PATH_PLACEHOLDER, response.path);
            // this.feedbackEmitter(successMessage, null, Constants.SUCCESS_FEEDBACK_TYPE);
            this.explorerNavigator.listDossierContent();
        }, {
            controller: "file-folder-controllers/NewFolderController"
        });
    };

    _handleFileFolderUpload = (event) => {
        //event.stopImmediatePropagation();
        const files = document.querySelector("#folder-upload").files || [];
        if (!files.length) {
            console.log("No file selected");
            return;
            //return this.feedbackEmitter(this.model.error.labels.noFileUploaded, null, Constants.ERROR_FEEDBACK_TYPE);
        }

        const filesArray = Object.keys(files).map(key => files[key])

        let wDir = this.model.currentPath || '/';
        // Open the ui-loader
        this.feedbackController.setLoadingState(true);
        this.DSUStorage.uploadMultipleFiles(wDir, filesArray, { preventOverwrite: true }, (err, filesUploaded) => {
            if (err) {
                filesUploaded = err.data;
            }

            if (!Array.isArray(filesUploaded)) {
                filesUploaded = [filesUploaded];
            }
            filesUploaded.forEach((entry) => {
                let name, path, messageTemplate, messageType;
                if(entry === undefined) return;
                if (entry.error) {
                    path = entry.file.path;
                    if (entry.error.code === 30) {
                        console.log("File exists")
                        // messageTemplate = this.model[Constants.SUCCESS].fileUploadExists;
                        // messageType = Constants.ERROR_FEEDBACK_TYPE;
                    } else {
                        // messageTemplate = this.model[Constants.SUCCESS].fileUploaded;
                        // messageType = Constants.SUCCESS_FEEDBACK_TYPE;
                    }
                } else {
                    path = entry;
                    // messageTemplate = this.model[Constants.SUCCESS].fileUploaded;
                    // messageType = Constants.SUCCESS_FEEDBACK_TYPE;
                }

                name = path.split('/').pop();
                // let displayedMessage = messageTemplate
                //     .replace(Constants.NAME_PLACEHOLDER, name)
                //     .replace(Constants.PATH_PLACEHOLDER, path);
                // this.feedbackEmitter(displayedMessage, null, messageType);
            });

            // Close the ui-loader as upload is finished
            this.feedbackController.setLoadingState(false);
            this.explorerNavigator.listDossierContent();
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
    };

    _handleDownloadFile(path, fileName) {
        let fileDownloader = new FileDownloader(path, fileName);
        fileDownloader.downloadFile();
    }

    _handleViewFile = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const { currentPath, selectedItem } = this._getSelectedItemAndWorkingDir(event.data);
        if (!selectedItem) {
            console.error(`No item selected to be downloaded!`);
            return;
        }

        const itemViewModel = this._getCleanProxyObject(selectedItem);
        if (itemViewModel.type !== 'file') {
            console.error(`Only files support this funtionality!`);
            return;
        }

        itemViewModel.currentPath = currentPath;
        this.explorerNavigator.openViewFileModal(itemViewModel);
    };

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
    };

    _getSelectedItem = (name) => {
        return this.model.content.find((el) => el.name === name);
    };

    _getCleanProxyObject = (obj) => {
        return obj ? JSON.parse(JSON.stringify(obj)) : null;
    }
}