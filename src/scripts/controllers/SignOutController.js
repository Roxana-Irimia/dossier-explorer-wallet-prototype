import BindableController from "./base-controllers/BindableController.js";
import { signOutModel } from "../models/signOutModal.js";
import SignOutEvent from "../events/SignOutEvent.js";

export default class SignOutController extends BindableController {
  constructor(element) {
    super(element);

    this.model = this.setModel(signOutModel);

    this._initListeners();
  }

  _initListeners = () => {
    this.on("sign-out-toggle", document, this._toggleSignOutModal, true);
    this.on("sign-out-confirm", document, this._confirmExitHandler, true);

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
    let data = { deleteSeed: isCheckboxChecked };

    this._element.dispatchEvent(new SignOutEvent(data));
    this._resetModelToDefault();
  };

  /**
   * TODO: Check for alternatives of reseting the view-model
   */
  _resetModelToDefault = () => {
    this.model.opened = false;
    this.model.hasError = false;
    this.model.errorMessage = "";
    this.model.confirmBtn.disabled = true;
    this.model.deleteSeedAgreement.checked = false;
    this.model.deleteSeedAgreement.value = "unchecked";
  };
}
