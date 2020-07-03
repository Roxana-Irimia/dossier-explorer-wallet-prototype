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
        this.on('cancel-move', this._handleCancel)
    };

    _handleMoveFile = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const selectedEntryName = this.model.selectedEntryName;
        const currentWorkingDirectory = this.model.currentWorkingDirectory || '';
        let currentPath = this.model.currentPath || '';
        if (currentPath === '/') {
            currentPath = '';
        }

        let selectedItem = this.model.getChainValue('selectedItem');
        if (selectedItem && selectedItem.selected) {
            currentPath = `${currentPath}/${selectedItem.item.name}`;
        }

        const oldPath = `${currentWorkingDirectory}/${selectedEntryName}`;
        const newPath = `${currentPath}/${selectedEntryName}`;

        if (oldPath === newPath) {
            console.error(err);
            return this.feedbackController.updateErrorMessage(this.model.error.samePathError);
        }

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