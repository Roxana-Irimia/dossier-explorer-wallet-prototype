import ModalController from "../../../cardinal/controllers/base-controllers/ModalController.js";
import FeedbackController from "../FeedbackController.js";
import Constants from "../Constants.js";
import { getNewDossierServiceInstance } from "../../service/NewDossierExplorerServiceWallet.js";

export default class DeleteController extends ModalController {
    constructor(element, history) {
        super(element, history);
        this._init()

    }

    async _init() {
        this.dossierService = await getNewDossierServiceInstance()
        this.feedbackController = new FeedbackController(this.model);

        this._initListeners();
        this._updateNotificationMessage();
    }

    _initListeners() {
        this.on('delete', this._handleDeleteModalActions.bind(this));
    };

    /**
     * TODO: Validate how to display this message
     */
    _updateNotificationMessage() {
        let message = this.model.notificationMessage;
        message = message.replace(Constants.DELETE_ITEMS_PLACEHOLDER, this.model.selectedItemName);

        this.model.setChainValue('notificationMessage', message);
    }

    _handleDeleteModalActions(event) {
        event.stopImmediatePropagation();

        if (event.data === 'confirm-delete') {
            this.feedbackController.setLoadingState(true);

            return this._deleteSelectedItems((err, name) => {
                this.feedbackController.setLoadingState();
                if (err) {
                    console.error(err);
                }
                this.responseCallback(undefined, {
                    name: name
                });
            });
        }

        this.responseCallback();
    }

    _deleteSelectedItems(callback) {
        let path = this.model.path,
            name = this.model.selectedItemName,
            type = this.model.selectedItemType;

        if (path === "/") {
            path = "";
        }

        switch (type) {
            case 'file':
            case 'folder':
                {
                    this.dossierService.deleteFileFolder(`${path}/${name}`, (err) => {
                        callback(err, name);
                    });
                    break;
                }
            case 'csb':
            case 'dossier':
                {
                    this.dossierService.deleteDossier(path, name, (err) => {
                        callback(err, name);
                    });
                    break;
                }
            default:
                {
                    break;
                }
        }
    }

}