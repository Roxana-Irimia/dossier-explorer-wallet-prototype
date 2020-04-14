import BindableController from "./base-controllers/BindableController.js";
import { shareDossierModal } from "../view-models/shareDossierModal.js";

export default class CreateDossierController extends BindableController {
  constructor(element) {
    super(element);

    this.model = this.setModel(shareDossierModal);

    this._initListeners();
  }

  _initListeners = () => {};
}
