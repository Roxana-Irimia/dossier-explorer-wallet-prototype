import { validateSeed } from "./utils.js";

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
  model.setChainValue("signOut.modal.checkbox.checked", false);
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
  if (event && event.data) {
    try {
      const data = JSON.parse(event.data);
      selectedModal = data.modalName;
    } catch (e) {
      console.error(`eventData object is not in JSON format: ${event.type}`);
    }
  }

  model.setChainValue("addItems.selectedModal", selectedModal);
}

export function registerNewDossier(rootModel) {
  let model = this.model;

  model.setChainValue(`${rootModel}.hasError`, false);
  model.setChainValue(`${rootModel}.setNameButton.disabled`, false);

  let inputDossierName = model.getChainValue(`${rootModel}.setNameInput.value`);

  let dossier = {
    name: inputDossierName,
    lastModification: new Date().getTime(),
    type: "dossier",
    size: "0"
  };

  console.log(model, inputDossierName, dossier);

  let currentItems = model.getChainValue("dossierDetails.items");
  if (!currentItems || !currentItems.length) {
    currentItems = [dossier];
  } else {
    currentItems.push(dossier);
  }

  model.setChainValue(`${rootModel}.createState`, false);
}

export function finishNewDossierProcess(rootModel) {
  let model = this.model;

  model.setChainValue(`${rootModel}.setNameInput.value`, "");
  model.setChainValue(`${rootModel}.setSeedInput.value`, "");
  model.setChainValue(`${rootModel}.hasError`, false);
  model.setChainValue(`${rootModel}.setNameButton.disabled`, true);
  model.setChainValue(`${rootModel}.createState`, true);
}

export function validateSeedInput(rootModel) {
  let model = this.model;
  model.setChainValue(`${rootModel}.hasError`, false);

  let seed = model.getChainValue(`${rootModel}.setSeedInput.value`);
  let isValidSeed = validateSeed(seed);

  if (isValidSeed) {
    toggleAddModalHandler.call(this);
    finishNewDossierProcess.call(this, "importDossierModal");
  } else {
    model.setChainValue(`${rootModel}.hasError`, true);
    model.setChainValue(
      `${rootModel}.errorMessage`,
      "Provided SEED is not valid!"
    );
  }
}
