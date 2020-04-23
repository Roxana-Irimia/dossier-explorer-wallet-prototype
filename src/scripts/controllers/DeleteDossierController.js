import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";

export default class DeleteDossierController extends ModalController {
  constructor(element) {
    super(element);
    this._initListeners();
  }

  _initListeners() {
    this.on('confirm-delete', this._handleConfirmDelete.bind(this), true);
    this.on('confirm-delete', this._handleCancelDelete.bind(this), true);
  };

  _handleConfirmDelete(event) {
    console.log(event, this);
    event.preventDefault();
    event.stopImmediatePropagation();

  }

  _handleCancelDelete(event) {
    console.log(event, this);
    event.preventDefault();
    event.stopImmediatePropagation();

  }
}