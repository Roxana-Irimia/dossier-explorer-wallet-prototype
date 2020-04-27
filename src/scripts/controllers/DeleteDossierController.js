import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";
import Commons from "./Commons.js";

export default class DeleteDossierController extends ModalController {
  constructor(element) {
    super(element);

    this._initListeners();
    this._updateNotificationMessage();
  }

  _initListeners() {
    this.on('delete', this._handleDeleteModalActions.bind(this), true);
  };

  _updateNotificationMessage() {
    let message = this.model.notificationMessage;

    if (!this.model.selectedItemsPaths || !this.model.selectedItemsPaths.length) {
      message = '';
      this.model.setChainValue('buttons.deleteButton.disabled', true);
      Commons.updateErrorMessage(this.model, this.model.error.noItemsSelectedLabel);
    } else {
      let numberOfItems = this.model.selectedItemsPaths.length;
      // let itemsLabel = `<strong>${numberOfItems}</strong>`;
      message = message.replace(Commons.DELETE_ITEMS_PLACEHOLDER, numberOfItems);
    }

    this.model.setChainValue('notificationMessage', message);
  }

  _handleDeleteModalActions(event) {
    event.stopImmediatePropagation();

    if (event.data === 'confirm-delete') {
      let deleteResponse = this._deleteSelectedItems();
      // check the response and update the error messages if there is the case
    }

    this.responseCallback(undefined, {
      success: true
    });
  }

  _deleteSelectedItems() {
    // selectedItems will be an array of paths to be deleted
    // it is created inside ExplorerController and attached to this model
    let selectedItemsPaths = this.model.selectedItemsPaths;
  }

}