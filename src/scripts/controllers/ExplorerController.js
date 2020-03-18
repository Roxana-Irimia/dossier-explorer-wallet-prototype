import BindableController from "./base-controllers/BindableController.js";
import { explorerModel } from "../../assets/models/explorer-model.js";

export default class ExplorerController extends BindableController {
  constructor(element) {
    super(element);
    this.model = this.setModel(explorerModel);
  }
}
