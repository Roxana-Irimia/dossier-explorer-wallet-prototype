import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";
import {
    getDossierServiceInstance
} from "../service/DossierExplorerService.js";
import FeedbackController from "./FeedbackController.js";

export default class NewFolderController extends ModalController {
    constructor(element, history) {
        super(element, history);

        this.feedbackController = new FeedbackController(this.model);
        this.dossierService = getDossierServiceInstance();

        this._initListeners();
    }

    _initListeners() {
        this.on('new-folder-create', this._createNewFolder);
        this.on('new-folder-cancel', () => {
            this.responseCallback(undefined);
        });

        this.model.onChange("folderNameInput.value", this._validateInput);
    }

    _createNewFolder = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        let wDir = this.model.currentPath || '/';
        if (wDir == '/') {
            wDir = '';
        }

        const folderName = this.model.folderNameInput.value;
        this.feedbackController.setLoadingState(true);
        this.dossierService.readDirDetailed(wDir, (err, { folders }) => {
            if (err) {
                this.feedbackController.setLoadingState();
                this.feedbackController.updateErrorMessage(err);
            } else {
                if (folders.find((el) => el === folderName)) {
                    this.feedbackController.setLoadingState();
                    this.feedbackController.updateErrorMessage(this.model.error.errorLabels.entryExistsLabel);
                } else {
                    // If the name is not used, create the folder
                    this._createFolder(wDir, folderName);
                }
            }
        });
    }

    _createFolder = (path, folderName) => {
        this.dossierService.addFolder(path, folderName, (err, response) => {
            this.feedbackController.setLoadingState();
            if (err) {
                console.error(err);
                this.feedbackController.updateErrorMessage(err);
            } else {
                this.responseCallback(undefined, { response: response });
            }
        });
    }

    _validateInput = () => {
        this.feedbackController.updateErrorMessage();

        const value = this.model.folderNameInput.value;
        const isEmptyName = value.trim().length === 0;
        this.model.setChainValue('buttons.createFolderButton.disabled', isEmptyName);

        if (isEmptyName) {
            this.feedbackController.updateErrorMessage(this.model.error.errorLabels.nameNotValidLabel);
            return false;
        }

        return true;
    };

}