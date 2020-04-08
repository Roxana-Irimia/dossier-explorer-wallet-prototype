import { validateSeed } from "./utils.js";
import { checkForModalOptions } from "./modalUtils.js";

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

// TODO: Refactor method toggleAddModalHandler to toggleFileDossierModalHandler.
// TODO: Refactor the addItems.selectedModal model so to comply with the new refactred method.
// The method is used for all the events reponsible with file-dossier modals
export function toggleAddModalHandler(event) {
  let model = this.model;

  if (event && event.data) {
    try {
      const data = JSON.parse(event.data);
      model.setChainValue("addItems.selectedModal", data.modalName);

      checkForModalOptions.call(model, data);

      return;
    } catch (e) {
      console.error(e);
    }
  }

  model.setChainValue("addItems.selectedModal", "");
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
    size: "0",
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

export function selectWalletItemHandler(event) {
  if (!event || !event.data) {
    return;
  }

  let model = this.model;
  if (!model) {
    return;
  }

  let itemsList = model.getChainValue("dossierDetails.items");
  let selectedItems = model.getChainValue("dossierDetails.selectedItems");
  if (!itemsList || !itemsList.length) {
    return;
  }

  let selectedDossierName = event.data;
  let index = itemsList.findIndex((el) => el.name == selectedDossierName);
  if (index === -1) {
    return;
  }

  let isSelected =
    model.getChainValue(`dossierDetails.items.${index}.selected`) ===
    "selected";

  model.setChainValue(
    `dossierDetails.items.${index}.selected`,
    isSelected ? "" : "selected"
  );

  if (!isSelected && (!selectedItems || !selectedItems.length)) {
    model.setChainValue("dossierDetails.selectedItems", [selectedDossierName]);
    return;
  }

  if (!isSelected) {
    selectedItems.push(selectedDossierName);
  } else {
    let index = selectedItems.findIndex((el) => el === selectedDossierName);
    selectedItems.splice(index, 1);
  }
}

export function handleDeleteSelectedFiles(event) {
  if (!event || !event.data) {
    return;
  }

  if (event.data === "cancel-delete") {
    toggleAddModalHandler.call(this);
    return;
  }

  let model = this.model;
  if (!model) {
    return;
  }

  let itemsList = model.getChainValue("dossierDetails.items");
  if (!itemsList || !itemsList.length) {
    return;
  }

  let disabledItems = model.getChainValue("dossierDetails.disabledItems");
  if (!disabledItems || !disabledItems.length) {
    disabledItems = [];
  }

  itemsList.forEach((item) => {
    if (item.selected === "selected") {
      disabledItems.push(item);
    }
  });

  itemsList = itemsList.filter((el) => el.selected !== "selected");

  model.setChainValue("dossierDetails.items", itemsList);
  model.setChainValue("dossierDetails.disabledItems", disabledItems);

  /**
   * Make interaction with blockchain and save the new state after delete
   * This might generate some errors, so the error attributes can be changed
   * model.setChainValue('deleteSelectedItemsModal.hasError', 1);
   * model.setChainValue('deleteSelectedItemsModal.errorMessage', "Some error.");
   */

  toggleAddModalHandler.call(this);
}

export function handleRename() {
  let model = this.model;

  let _modal = model.renameDossierModal;

  if (!_modal || _modal.oldValue === _modal.setNameInput.value) {
    return;
  }

  _modal.hasError = false;
  _modal.errorMessage = "";

  let _currentItems = model.getChainValue("dossierDetails.items");
  if (!_currentItems || !_currentItems.length) {
    return;
  }

  let _itemInListIndex = _currentItems.findIndex(
    (el) => el.name === _modal.oldValue
  );
  if (_itemInListIndex === -1) {
    return;
  }

  model.setChainValue(
    `dossierDetails.items.${_itemInListIndex}.name`,
    _modal.setNameInput.value
  );

  /**
   * Make interaction with blockchain and save the new state after update
   * This might generate some errors, so the error attributes can be changed
   * _modal.hasError = true;
   * _modal.errorMessage = "Some error message";
   */

  toggleAddModalHandler.call(this);
}
