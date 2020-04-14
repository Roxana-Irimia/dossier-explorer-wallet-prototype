import ContainerController from "../../cardinal/controllers/ContainerController.js";
import { addFileFolderModel } from "../view-models/addFileFolderModel.js";

export default class AddFileFolderController extends ContainerController {
  constructor(element) {
    super(element);

    this.model = this.setModel(addFileFolderModel);

    this._initListeners();
  }

  _initListeners = () => {};
}
