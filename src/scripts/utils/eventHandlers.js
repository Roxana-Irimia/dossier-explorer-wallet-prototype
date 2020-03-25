export function explorerExitHandler() {
  let model = this.model;

  let modalState = model.getChainValue("signOut.modal.opened");
  modalState = !modalState;

  model.setChainValue("signOut.modal.opened", modalState);
}

export function explorerConfirmExitHandler() {
  let model = this.model;

  let deleteWalletSeed =
    model.getChainValue("signOut.modal.checkbox.value") === "checked";
  if (deleteWalletSeed) {
    // TODO: Delete SEED from Device
    console.log("[explorerConfirmExitHandler] Delete SEED is checked!");
    // Set the error in case there is any (when deleting the SEED from the device)
    // model.setChainValue("signOut.modal.error.hasError", false);
    // model.setChainValue("signOut.modal.error.errorMessage", null);
  }

  /**
   * TODO: Check if this is necesary
   * Reset the model on initial state for the next wallet opening
   */
  model.setChainValue("signOut.modal.checkbox.value", "unchecked");
  model.setChainValue("signOut.modal.error.hasError", false);
  model.setChainValue("signOut.modal.error.errorMessage", null);
  model.setChainValue("signOut.modal.opened", false);
}

export function explorerSwitchLayoutHandler() {
  let model = this.model;

  let layoutState = model.getChainValue("switchLayout.active");
  layoutState = layoutState === "grid" ? "list" : "grid";

  model.setChainValue("switchLayout.active", layoutState);
}
