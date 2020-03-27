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
  model.setChainValue("signOut.modal.opened", false);
  model.setChainValue("signOut.modal.checkbox.checked", true);
  model.setChainValue("signOut.modal.checkbox.value", "unchecked");
  model.setChainValue("signOut.modal.error.hasError", false);
  model.setChainValue("signOut.modal.error.errorMessage", "");
}

export function explorerSwitchLayoutHandler() {
  let model = this.model;

  let layoutState = model.getChainValue("switchLayout.active");
  layoutState = layoutState === "grid" ? "list" : "grid";

  model.setChainValue("switchLayout.active", layoutState);
}

export function toggleAddModalHandler(event) {
  let model = this.model;

  let selectedModal = "";
  if (event.data) {
    try {
      const data = JSON.parse(event.data);
      selectedModal = data.modalName;
    } catch (e) {
      console.error(`eventData object is not in JSON format: ${event.type}`);
    }
  }

  model.setChainValue("addItems.selectedModal", selectedModal);
}

export function registerNewDossier() {
  let model = this.model;

  model.setChainValue("createDossierModal.hasError", false);
  model.setChainValue("createDossierModal.createDossierButton.disabled", false);

  let inputDossierName = model.getChainValue(
    "createDossierModal.dossierInput.value"
  );

  let dossier = {
    name: inputDossierName,
    lastModification: new Date().getTime(),
    type: "dossier",
    size: "0"
  };

  let currentItems = model.getChainValue("dossierDetails.items");
  if (!currentItems || !currentItems.length) {
    currentItems = [dossier];
  } else {
    currentItems.push(dossier);
  }

  model.setChainValue("createDossierModal.createState", false);

  console.log(model);
}
