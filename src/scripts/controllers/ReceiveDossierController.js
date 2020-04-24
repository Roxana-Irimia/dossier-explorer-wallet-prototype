import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";
import Commons from "./Commons.js";

export default class ReceiveDossierController extends ModalController {
  constructor(element) {
    super(element);
    this._initListeners();
  }

  _initListeners = () => {
    this.on('next-receive-dossier', this._continueReceiveProcess, true);
    this.on('finish-receive-dossier', this._finishReceiveDossierProcess, true);

    this.model.onChange("dossierNameInput.value", this._validateUserForm);
    this.model.onChange("destinationOptionsForDossier.value", this._validateUserForm);
  };

  _continueReceiveProcess = (event) => {
    event.stopImmediatePropagation();

    console.log('Indentity shared. Proceeding to the next step.');
    this.model.setChainValue('isDossierNameStep', true);
  }

  _finishReceiveDossierProcess = (event) => {
    event.stopImmediatePropagation();
    Commons.updateErrorMessage(this.model);

    let dossierName = this.model.dossierNameInput.value;
    let selectedDossierDestination = this.model.destinationOptionsForDossier.value;

    this.responseCallback(undefined, {
      success: true,
      dossierName: dossierName, // To be removed after integration
      selectedDossierDestination: selectedDossierDestination // To be removed after integration
      // Send back to main Explorer controller the respose that can close the modal 
      //and to fetch the new list items
    });
  }

  _validateUserForm = () => {
    Commons.updateErrorMessage(this.model);

    let isEmptyName = this.model.dossierNameInput.value.trim().length === 0;
    let isDestinationSelected = this.model.destinationOptionsForDossier.value.trim().length !== 0;
    if (!isDestinationSelected) {
      this.model.setChainValue('destinationOptionsForDossier.value', '/');
      isDestinationSelected = true;
    }

    let isFinishButtonDisabled = isEmptyName || !isDestinationSelected;
    this.model.setChainValue('buttons.finishButton.disabled', isFinishButtonDisabled);

    if (isEmptyName) {
      Commons.updateErrorMessage(this.model, this.model.error.errorLabels.nameNotEmptyLabel);
    }
  };
}