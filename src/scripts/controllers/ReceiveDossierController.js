import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";

export default class ReceiveDossierController extends ModalController {
  constructor(element) {
    super(element);
    this._initListeners();
  }

  _initListeners = () => {
    this.on('next-receive-dossier', this._continueReceiveProcess, true);
    this.on('finish-receive-dossier', this._finishReceiveDossierProcess, true);

    this.model.onChange("dossierNameInput.value", this._validateInput);
  };

  _continueReceiveProcess = (event) => {
    event.stopImmediatePropagation();

    console.log('Indentity shared. Proceeding to the next step.');
    this.model.setChainValue('isDossierNameStep', true);
  }

  _finishReceiveDossierProcess = (event) => {
    event.stopImmediatePropagation();
    this._updateError();

    let dossierName = this.model.dossierNameInput.value;
    let selectedDossierDestination = this.model.destinationOptionsForReceive;

    this.responseCallback(undefined, {
      dossierReceived: true,
      dossierName: dossierName, // To be removed after integration
      selectedDossierDestination: selectedDossierDestination
      // Send back to main Explorer controller the respose that can close the modal 
      //and to fetch the new list items
    });
  }

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