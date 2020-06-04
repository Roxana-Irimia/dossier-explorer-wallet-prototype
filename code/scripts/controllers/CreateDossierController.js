import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";
import FeedbackController from "./FeedbackController.js";
import {
  getDossierServiceInstance
} from "../service/DossierExplorerService.js";

export default class CreateDossierController extends ModalController {
  constructor(element) {
    super(element);

    this.dossierService = getDossierServiceInstance();
    this.feedbackController = new FeedbackController(this.model);

    this._initListeners();
  }

  _initListeners = () => {
    this.on('name-new-dossier', this._setNameForNewDossier);
    this.on('new-dossier-seed-received', this._finishNewDossierProcess);

    this.model.onChange("dossierNameInput.value", this._validateInput);
  };

  _setNameForNewDossier = (event) => {
    event.stopImmediatePropagation();
    this.feedbackController.updateErrorMessage();

    if (!this._validateInput()) {
      return;
    }

    const wDir = this.model.currentPath || '/';
    let dossierName = this.model.dossierNameInput.value;
    this.dossierService.readDir(wDir, (err, dirContent) => {
      if (err) {
        this.feedbackController.updateErrorMessage(err);
      } else {
        if (dirContent.find((el) => el === dossierName)) {
          this.feedbackController.updateErrorMessage(this.model.error.errorLabels.fileExistsLabel);
        } else {
          this._createDossier(dossierName);
        }
      }
    });
  };

  _createDossier = (dossierName) => {
    let wDir = this.model.currentPath || '/';
    if (wDir == '/') {
      wDir = '';
    }

    this.dossierService.createDossier(wDir, dossierName, (err, outputSEED) => {
      if (err) {
        console.log(err);
        this.feedbackController.updateErrorMessage(err);
      } else {
        this.model.dossierSeedOutput.value = outputSEED;
        this.model.isDossierNameStep = false;
      }
    });
  }

  _finishNewDossierProcess = (event) => {
    event.stopImmediatePropagation();

    this.responseCallback(undefined, {
      success: true
    });
  };

  _validateInput = () => {
    this.feedbackController.updateErrorMessage();

    const value = this.model.dossierNameInput.value;
    const isEmptyName = value.trim().length === 0;
    const hasWhiteSpaces = value.replace(/\s/g, '') !== value;
    this.model.setChainValue('buttons.createDossier.disabled', isEmptyName || hasWhiteSpaces);

    if (isEmptyName || hasWhiteSpaces) {
      this.feedbackController.updateErrorMessage(this.model.error.errorLabels.nameNotValidLabel);
      return false;
    }

    return true;
  };
}