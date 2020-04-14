import { validateSeed, getItemsChainForPath } from "./utils.js";
import { DEFAULT_ICON_COLOR } from "./constants.js";
import { checkForModalOptions } from "./modalUtils.js";
import { updateDisplayedItems } from "../../assets/models/chain-change-handlers.js";

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
    lastModified: new Date().getTime(),
    type: "dossier",
    icon: "lock",
    iconColor: DEFAULT_ICON_COLOR,
    gridIcon: "lock",
    size: "-",
  };

  let currentItems = model.getChainValue("dossierDetails.items");
  if (!currentItems || !currentItems.length) {
    model.setChainValue("dossierDetails.items", []);
    model.setChainValue("dossierDetails.items.0", dossier);
  } else {
    model.setChainValue(`dossierDetails.items.${currentItems.length}`, dossier);
  }

  model.setChainValue(`${rootModel}.createState`, false);
  toggleAddModalHandler.call(this);
  updateDisplayedItems.call(model);
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

export function doubleClickHandler(event) {
  let model = this.model;
  if (!event || !event.data) {
    return;
  }

  let currentPath = model.dossierDetails.currentPath;
  let chain = getItemsChainForPath.call(model, currentPath);
  let itemsList = model.getChainValue(chain);
  if (!itemsList || !itemsList.length) {
    return;
  }

  let selectedDossierName = event.data;
  let selectedItemIdx = itemsList.findIndex(
    (el) => el.name === selectedDossierName
  );
  if (selectedItemIdx === -1) {
    console.error("not found" + selectedDossierName);
    return;
  }

  let newPath =
    currentPath === "/"
      ? selectedDossierName
      : `${currentPath}/${selectedDossierName}`;
  model.setChainValue("dossierDetails.currentPath", newPath);
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

  updateDisplayedItems.call(model);
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
  if (!disabledItems) {
    model.setChainValue("dossierDetails.disabledItems", []);
    disabledItems = [];
  }

  itemsList.forEach((item, index) => {
    if (item.selected === "selected") {
      model.setChainValue(
        `dossierDetails.disabledItems.${disabledItems.length}`,
        item
      );
      itemsList.splice(index, 1);
    }
  });

  itemsList = itemsList.filter((el) => el.selected !== "selected");
  model.setChainValue("dossierDetails.selectedItems", []);

  /**
   * Make interaction with blockchain and save the new state after delete
   * This might generate some errors, so the error attributes can be changed
   * model.setChainValue('deleteSelectedItemsModal.hasError', 1);
   * model.setChainValue('deleteSelectedItemsModal.errorMessage', "Some error.");
   */

  toggleAddModalHandler.call(this);
  updateDisplayedItems.call(model);
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

  updateDisplayedItems.call(model);
}

export function handleFileFolderUpload(filesList) {
  let model = this.model;

  filesList.forEach(function (file) {
    let fPath = file.webkitRelativePath;
    if (fPath.length === 0 || fPath.indexOf("/") === -1) {
      _uploadFileFolderToModel.call(
        model,
        file,
        "dossierDetails.items",
        "file"
      );
      return;
    }

    let splitPath = fPath.replace(`/${file.name}`, "").split("/");
    let fullPath = null;
    let chainByPath;
    for (let i = 0; i < splitPath.length; i++) {
      let path = splitPath[i];
      fullPath = fullPath ? `${fullPath}/${path}` : path;
      chainByPath = getItemsChainForPath.call(model, fullPath);
      if (chainByPath.indexOf("-1") !== -1) {
        const _chain = chainByPath.split(".-1")[0];
        _uploadFileFolderToModel.call(
          model,
          {
            name: path,
            lastModified: new Date().getTime(),
            size: "",
          },
          _chain,
          "folder"
        );
        chainByPath = getItemsChainForPath.call(model, fullPath);
      }
    }

    _uploadFileFolderToModel.call(model, file, chainByPath, "file");
  });

  updateDisplayedItems.call(model);
}

function _uploadFileFolderToModel(
  { name, lastModified, size },
  chainToItems,
  type
) {
  let model = this;

  let item = {
    name: name,
    lastModified: lastModified,
    type: type,
    size: size,
    iconColor: DEFAULT_ICON_COLOR,
    gridIcon: type,
  };

  let currentItems = model.getChainValue(chainToItems);
  if (!currentItems || !currentItems.length) {
    model.setChainValue(chainToItems, []);
    model.setChainValue(`${chainToItems}.0`, item);
    return;
  }

  if (currentItems.find((el) => el.name === name)) {
    console.error(`${name} already exists!`);
    return;
  }

  model.setChainValue(`${chainToItems}.${currentItems.length}`, item);
}
