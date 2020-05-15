import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";
import {
  getDossierServiceInstance
} from "../service/DossierExplorerService.js";
import FeedbackController from "./FeedbackController.js";

export default class ShareDossierController extends ModalController {
  constructor(element) {
    super(element);

    this.feedbackController = new FeedbackController(this.model);
    this.dossierServive = getDossierServiceInstance();
    this._setSeedForInput();
  }

  _setSeedForInput() {
    let wDir = this.model.currentPath || '/';
    let dossierName = this.model.selectedFile;
    this.dossierServive.printDossierSeed(wDir, dossierName, (err, seed) => {
      if (err) {
        console.error(err);
        this.feedbackController.updateErrorMessage(err);
      } else {
        this.model.setChainValue('dossierSEEDInput.value', seed);
      }
    });
  }

}