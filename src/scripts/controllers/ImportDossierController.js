import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";

export default class ImportDossierController extends ModalController {
  constructor(element) {
    super(element);
    this._initListeners();
  }

  _initListeners = () => {
    this.on('import-dossier-name', this._setNameForImportedDossier, true);
    this.on('import-dossier-seed', this._importDossierFromSeed, true);

    this.model.onChange("dossierNameInput.value", this._validateInput);
  };

  _setNameForImportedDossier = (event) => {
    event.stopImmediatePropagation();
    this._updateError();

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
      newDossierCreated: true,
      dossierName: this.dossierName, // To be removed after integration
      dossierSeed: this.model.dossierSeedInput
      // Send back to main Explorer controller the respose that can close the modal 
      //and to fetch the new list items
    });
  };

  _validateInput = () => {
    this._updateError();

    let isEmptyName = this.model.dossierNameInput.value.trim().length === 0;
    this.model.setChainValue('buttons.createDossier.disabled', isEmptyName);

    if (isEmptyName) {
      this._updateError(this.model.error.errorLabels.nameNotEmptyLabel);
    }
  };

  _updateError = (errorMsg = '') => {
    this.model.setChainValue('error.hasError', errorMsg !== '');
    this.model.setChainValue('error.errorMessage', errorMsg);
  }
}