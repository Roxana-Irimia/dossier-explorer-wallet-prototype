import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";
import FeedbackController from "./FeedbackController.js";
import ExplorerNavigatorController from "./ExplorerNavigatorController.js";
import {
    getDossierServiceInstance
} from "../service/DossierExplorerService.js";

export default class MoveDossierController extends ModalController {
    constructor(element, history) {
        super(element, history);

        this.dossierService = getDossierServiceInstance();
        this.feedbackController = new FeedbackController(this.model);
        this.navigatorController = new ExplorerNavigatorController(element, history, this.model);

        this._initListeners();
    }

    _initListeners = () => {
        this.on('confirm-move', this._handleMoveFile);
        this.on('cancel-move', this._handleCancel);
    };

    _handleMoveFile = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const selectedEntryName = this.model.selectedEntryName;

        let currentWorkingDirectory = this.model.currentWorkingDirectory || '';
        if (currentWorkingDirectory === '/') {
            currentWorkingDirectory = '';
        }

        let currentPath = this.model.currentPath || '';
        if (currentPath === '/') {
            currentPath = '';
        }

        const selectedItem = this.model.content.find(el => el.selected === 'selected');
        if (selectedItem) {
            currentPath = `${currentPath}/${selectedItem.name}`;
        }

        const oldPath = `${currentWorkingDirectory}/${selectedEntryName}`;
        const newPath = `${currentPath}/${selectedEntryName}`;

        if (oldPath === newPath) {
            return this.feedbackController.updateErrorMessage(this.model.error.samePathError);
        }

        this.feedbackController.setLoadingState(true);
        this.dossierService.rename(oldPath, newPath, (err, result) => {
            this.feedbackController.setLoadingState();
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

    _handleCancel = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        this.responseCallback(undefined, {
            success: true,
            result: {
                cancel: true
            }
        });
    }
}