import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";
import FeedbackController from "./FeedbackController.js";
import {
  getDossierServiceInstance
} from "../service/DossierExplorerService.js";

export default class ImportDossierController extends ModalController {
  constructor(element) {
    super(element);

    this.dossierService = getDossierServiceInstance();
    this.feedbackController = new FeedbackController(this.model);

    this._initListeners();
  }

  _initListeners = () => {
    this.on('import-dossier-name', this._setNameForImportedDossier);
    this.on('import-dossier-seed', this._importDossierFromSeed);

    this.model.onChange("dossierNameInput.value", this._validateInput);
    this.model.onChange("dossierSeedInput.value", this._validateSeedInput);
  };

  _setNameForImportedDossier = (event) => {
    event.stopImmediatePropagation();
    this.feedbackController.updateErrorMessage();

    if (!this._validateInput()) {
      return;
    }

    const wDir = this.model.currentPath || '/';
    this.dossierName = this.model.dossierNameInput.value;
    this.dossierService.readDir(wDir, (err, dirContent) => {
      if (err) {
        this.feedbackController.updateErrorMessage(err);
      } else {
        if (dirContent.find((el) => el === this.dossierName)) {
          this.feedbackController.updateErrorMessage(this.model.error.errorLabels.fileExistsLabel);
        } else {
          // Go to the next step, where the user provides the SEED for the dossier
          this.model.isDossierNameStep = false;
        }
      }
    });
  };

  _importDossierFromSeed = (event) => {
    event.stopImmediatePropagation();

    let wDir = this.model.currentPath || '/';
    if (wDir == '/') {
      wDir = '';
    }
    const SEED = this.model.dossierSeedInput.value;

    this.dossierService.importDossier(wDir, this.dossierName, SEED, (err) => {
      if (err) {
        console.log(err);
        this.feedbackController.updateErrorMessage(err);
      } else {
        this.responseCallback(undefined, {
          success: true
        });
      }
    });
  };

  _validateInput = () => {
    this.feedbackController.updateErrorMessage();

    const value = this.model.dossierNameInput.value;
    const isEmptyName = value.trim().length === 0;
    const hasWhiteSpaces = value.replace(/\s/g, '') !== value;
    this.model.setChainValue('buttons.continueButton.disabled', isEmptyName || hasWhiteSpaces);

    if (isEmptyName || hasWhiteSpaces) {
      this.feedbackController.updateErrorMessage(this.model.error.errorLabels.nameNotValidLabel);
      return false;
    }

    return true;
  };

  _validateSeedInput = () => {
    this.feedbackController.updateErrorMessage();

    let SEED = this.model.dossierSeedInput.value;
    let isEmptySeed = SEED.trim().length === 0;

    this.model.setChainValue('buttons.finishButton.disabled', isEmptySeed);

    if (isEmptySeed) {
      this.feedbackController.updateErrorMessage(this.model.error.errorLabels.seedNotEmptyLabel);
    }
  };
}