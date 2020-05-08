import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";
import Commons from "./Commons.js";
import {
  getDossierServiceInstance
} from "../service/DossierExplorerService.js";

export default class ImportDossierController extends ModalController {
  constructor(element) {
    super(element);

    this.dossierService = getDossierServiceInstance();

    this._initListeners();
  }

  _initListeners = () => {
    this.on('import-dossier-name', this._setNameForImportedDossier, true);
    this.on('import-dossier-seed', this._importDossierFromSeed, true);

    this.model.onChange("dossierNameInput.value", this._validateInput);
    this.model.onChange("dossierSeedInput.value", this._validateSeedInput);
  };

  _setNameForImportedDossier = (event) => {
    event.stopImmediatePropagation();
    Commons.updateErrorMessage(this.model);

    const wDir = this.model.currentPath || '/';
    this.dossierName = this.model.dossierNameInput.value;
    this.dossierService.readDir(wDir, (err, dirContent) => {
      if (err) {
        Commons.updateErrorMessage(this.model, err);
      } else {
        if (dirContent.find((el) => el === this.dossierName)) {
          Commons.updateErrorMessage(this.model, this.model.error.errorLabels.fileExistsLabel);
        } else {
          // Go to the next step, where the user provides the SEED for the dossier
          this.model.isDossierNameStep = false;
        }
      }
    });
  };

  _importDossierFromSeed = (event) => {
    event.stopImmediatePropagation();

    const wDir = this.model.currentPath || '/';
    const SEED = this.model.dossierSeedInput.value;

    this.dossierService.createDossier(wDir + this.dossierName + '/', SEED, (err) => {
      if (err) {
        Commons.updateErrorMessage(this.model, err);
      } else {
        this.responseCallback(undefined, {
          success: true
        });
      }
    });
  };

  _validateInput = () => {
    Commons.updateErrorMessage(this.model);

    let isEmptyName = this.model.dossierNameInput.value.trim().length === 0;
    this.model.setChainValue('buttons.continueButton.disabled', isEmptyName);

    if (isEmptyName) {
      Commons.updateErrorMessage(this.model, this.model.error.errorLabels.nameNotEmptyLabel);
    }
  };

  _validateSeedInput = () => {
    Commons.updateErrorMessage(this.model);

    let SEED = this.model.dossierSeedInput.value;
    let isEmptySeed = SEED.trim().length === 0;
    let isValidSeedForm = Commons.validateSeedForm(SEED);
    let isFinishButtonDisabled = isEmptySeed || !isValidSeedForm;

    this.model.setChainValue('buttons.finishButton.disabled', isFinishButtonDisabled);

    if (isEmptySeed) {
      Commons.updateErrorMessage(this.model, this.model.error.errorLabels.seedNotEmptyLabel);
    }
    if (!isValidSeedForm) {
      Commons.updateErrorMessage(this.model, this.model.error.errorLabels.seedNotValidLabel);
    }
  };
}