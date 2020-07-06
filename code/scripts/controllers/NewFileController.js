import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";
import {
    getDossierServiceInstance
} from "../service/DossierExplorerService.js";
import FeedbackController from "./FeedbackController.js";

export default class NewFileController extends ModalController {
    constructor(element, history) {
        super(element, history);

        this.feedbackController = new FeedbackController(this.model);
        this.dossierService = getDossierServiceInstance();

        this._initListeners();
    }

    _initListeners() {
        this.on('new-file-create', this._createNewFile);
        this.on('new-file-cancel', () => {
            this.responseCallback(undefined);
        });

        this.model.onChange("fileNameInput.value", this._validateInput);
    }

    _createNewFile = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        let wDir = this.model.currentPath || '/';
        if (wDir == '/') {
            wDir = '';
        }

        const fileName = this.model.fileNameInput.value;
        let fileContent = this.model.fileContentInput.value || '\n';
        if (!fileContent.trim().length) {
            fileContent = '\n';
        }

        this.feedbackController.setLoadingState(true);
        this.dossierService.readDir(wDir, (err, dirContent) => {
            if (err) {
                this.feedbackController.setLoadingState();
                this.feedbackController.updateErrorMessage(err);
            } else {
                if (dirContent.find((el) => el === fileName)) {
                    this.feedbackController.setLoadingState();
                    this.feedbackController.updateErrorMessage(this.model.error.errorLabels.fileExistsLabel);
                } else {
                    // If the name is not used, create the file
                    this._uploadFile(`${wDir}/${fileName}`, fileContent);
                }
            }
        });
    }

    _uploadFile = (path, data) => {
        this.DSUStorage.setItem(path, data, (err, response) => {
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

        const value = this.model.fileNameInput.value;
        const isEmptyName = value.trim().length === 0;
        const hasWhiteSpaces = value.replace(/\s/g, '') !== value;
        this.model.setChainValue('buttons.createFileButton.disabled', isEmptyName || hasWhiteSpaces);

        if (isEmptyName || hasWhiteSpaces) {
            this.feedbackController.updateErrorMessage(this.model.error.errorLabels.nameNotValidLabel);
            return false;
        }

        return true;
    };

}