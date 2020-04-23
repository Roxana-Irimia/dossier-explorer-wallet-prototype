import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";

export default class CreateDossierController extends ModalController {
  constructor(element) {
    super(element);
    this._initListeners();
  }

  _initListeners = () => {
    this.on('name-new-dossier', this._setNameForNewDossier, true);
    this.on('new-dossier-seed-received', this._finishNewDossierProcess, true);

    this.model.onChange("dossierNameInput.value", this._validateInput);
  };

  _setNameForNewDossier = (event) => {
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

  _finishNewDossierProcess = (event) => {
    event.stopImmediatePropagation();

    this.responseCallback(undefined, {
      newDossierCreated: true,
      dossierName: this.dossierName // To be removed after integration
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