import BindableController from "./base-controllers/BindableController.js";
import { addFileFolderModel } from "../view-models/addFileFolderModel.js";

export default class AddFileFolderController extends BindableController {
  constructor(element) {
    super(element);

    this.model = this.setModel(addFileFolderModel);

    this._initListeners();
  }

  _initListeners = () => {};
}
