import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";
import Commons from "./Commons.js";

export default class ImportDossierController extends ModalController {
  constructor(element) {
    super(element);
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

    let dossierName = this.model.dossierNameInput.value;
    this.dossierName = dossierName;
    console.log(`${dossierName} will be created`);
    // Send a post request to add the new dossier and then to receive the seed of the created dossier
    // Also, if the file already exists, the error labels will be added.
    // Set the seed to the model (dossierSeedOutput.value) and display the finish step of the wizard
    this.model.isDossierNameStep = false;
  };

  _importDossierFromSeed = (event) => {
    event.stopImmediatePropagation();

    this.responseCallback(undefined, {
      success: true,
      dossierName: this.dossierName, // To be removed after integration
      dossierSeed: this.model.dossierSeedInput.value // To be removed after integration
      // Send back to main Explorer controller the respose that can close the modal 
      //and to fetch the new list items
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