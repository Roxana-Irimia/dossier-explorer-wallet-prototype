import BindableController from "./base-controllers/BindableController.js";
import { renameDossierModel } from "../view-models/renameDossierModal.js";

export default class RenameDossierController extends BindableController {
  constructor(element) {
    super(element);

    this.model = this.setModel(renameDossierModel);

    this._initListeners();
  }

  _initListeners = () => {
  };

}
