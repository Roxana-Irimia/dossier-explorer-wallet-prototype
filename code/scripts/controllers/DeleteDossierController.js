import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";
import Constants from "./Constants.js";
import {
  getDossierServiceInstance
} from "../service/DossierExplorerService.js";

export default class DeleteDossierController extends ModalController {
  constructor(element) {
    super(element);

    this.dossierService = getDossierServiceInstance();

    this._initListeners();
    this._updateNotificationMessage();
  }

  _initListeners() {
    this.on('delete', this._handleDeleteModalActions.bind(this));
  };

  /**
   * TBD
   */
  _updateNotificationMessage() {
    let message = this.model.notificationMessage;
    message = message.replace(Constants.DELETE_ITEMS_PLACEHOLDER, '1');

    this.model.setChainValue('notificationMessage', message);
  }

  _handleDeleteModalActions(event) {
    event.stopImmediatePropagation();

    if (event.data === 'confirm-delete') {
      this._deleteSelectedItems((err) => {
        if (err) {
          console.error(err);
        }
        this.responseCallback(undefined, {
          success: true
        });
      });
    }
  }

  _deleteSelectedItems(callback) {
    const path = this.model.path,
      name = this.model.selectedItemName,
      type = this.model.selectedItemType;

    switch (type) {
      case 'file':
      case 'folder': {
        this.dossierService.deleteFileFolder(path + name, (err) => {
          callback(err);
        });
        break;
      }
      case 'dossier': {
        this.dossierService.deleteDossier(path + name, (err) => {
          callback(err);
        });
        break;
      }
      default: {
        break;
      }
    }
  }

}