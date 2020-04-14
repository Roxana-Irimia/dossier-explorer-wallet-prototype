import BindableController from "./base-controllers/BindableController.js";
import { importDossierModal } from "../view-models/importDossierModal.js";

export default class ImportDossierController extends BindableController {
  constructor(element) {
    super(element);

    this.model = this.setModel(importDossierModal);

    this._initListeners();
  }

  _initListeners = () => {};
}
