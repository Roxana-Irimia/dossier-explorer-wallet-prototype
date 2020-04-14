import BindableController from "./base-controllers/BindableController.js";
import { deleteDossierModal } from "../view-models/deleteDossierModal.js";

export default class DeleteDossierController extends BindableController {
  constructor(element) {
    super(element);

    this.model = this.setModel(deleteDossierModal);

    this._initListeners();
  }

  _initListeners = () => {};
}
