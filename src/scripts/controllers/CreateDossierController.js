import BindableController from "./base-controllers/BindableController.js";
import { createDossierModal } from "../view-models/createDossierModal.js";

export default class CreateDossierController extends BindableController {
  constructor(element) {
    super(element);

    this.model = this.setModel(createDossierModal);

    this._initListeners();
  }

  _initListeners = () => {
    this.on("create-dossier-toggle", document, this._toggleModal, true);

    this.model.onChange("setNameInput.value", this._validateInput);
  };

  _toggleModal = (event) => {
    event.preventDefault();
    event.stopImmediatePrpagation();

    this.model.opened = !this.model.opened;
  };

  _validateInput = (event) => {
    console.log(event, "input");
  };
}
