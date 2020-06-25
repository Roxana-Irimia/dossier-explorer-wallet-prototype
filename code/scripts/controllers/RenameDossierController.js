import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";
import FeedbackController from "./FeedbackController.js";
import {
    getDossierServiceInstance
} from "../service/DossierExplorerService.js";

export default class RenameDossierController extends ModalController {
    constructor(element, history) {
        super(element, history);

        this.dossierService = getDossierServiceInstance();
        this.feedbackController = new FeedbackController(this.model);

        this._initListeners();
    }

    _initListeners = () => {
        this.on('confirm-rename', this._handleRenameFile);
    };

    _handleRenameFile = () => {
        const oldFileName = this.model.oldFileName;
        const newFileName = this.model.fileNameInput.value;
        const currentPath = this.model.currentPath;

        if (!newFileName.trim().length) {
            return this.feedbackController.updateErrorMessage(this.model.error.nameNotEmptyLabel);
        }

        if (newFileName.indexOf('/') !== -1) {
            return this.feedbackController.updateErrorMessage(this.model.error.specialCharactersLabel);
        }

        const oldPath = `${currentPath}/${oldFileName}`;
        const newPath = `${currentPath}/${newFileName}`;
        this.dossierService.move(oldPath, newPath, (err, result) => {
            if (err) {
                console.error(err);
                return this.feedbackController.updateErrorMessage(err);
            }

            this.responseCallback(undefined, {
                success: true,
                result: result
            });
        });
    }
}