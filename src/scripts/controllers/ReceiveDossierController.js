import BindableController from "./base-controllers/BindableController.js";
import { receiveDossierModal } from "../view-models/receiveDossierModal.js";

export default class ReceiveDossierController extends BindableController {
  constructor(element) {
    super(element);

    this.model = this.setModel(receiveDossierModal);

    this._initListeners();
  }

  _initListeners = () => {};
}
