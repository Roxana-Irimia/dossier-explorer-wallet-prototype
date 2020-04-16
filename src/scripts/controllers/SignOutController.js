import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";

export default class SignOutController extends ModalController {
  constructor(element) {
    super(element);
    this.element = element;
    this._initListeners();
  }

  _initListeners = () => {
    this.on("sign-out-toggle", this.element, this._toggleSignOutModal, true);
    this.on("sign-out-confirm", this.element, this._confirmExitHandler, true);

    this.model.onChange(
      "deleteSeedAgreement.value",
      this._deleteSeedAgreementToggle
    );
  };

  _toggleSignOutModal = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.model.opened = !this.model.opened;
  };

  _deleteSeedAgreementToggle = () => {
    let isCheckboxChecked =
      this.model.getChainValue("deleteSeedAgreement.value") === "checked";
    this.model.setChainValue("confirmBtn.disabled", !isCheckboxChecked);
  };

  _confirmExitHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    let isCheckboxChecked =
    this.model.getChainValue("deleteSeedAgreement.value") === "checked";
    this.responseCallback(undefined, {deleteSeed:isCheckboxChecked});
  };
}
