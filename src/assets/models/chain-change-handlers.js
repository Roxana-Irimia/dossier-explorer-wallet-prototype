import { equals, getItemsChainForPath } from "../../scripts/utils/utils.js";

export function signOutCheckboxToggle() {
  let model = this;

  let isCheckboxChecked =
    model.getChainValue("signOut.modal.checkbox.value") === "checked";

  model.setChainValue(
    "signOut.modal.confirmButton.disabled",
    !isCheckboxChecked
  );
}

export function dossierNameInputChangeHandler(rootModel) {
  let model = this;

  model.setChainValue(`${rootModel}.hasError`, false);
  model.setChainValue(`${rootModel}.setNameButton.disabled`, false);

  let inputDossierName = model.getChainValue(`${rootModel}.setNameInput.value`);

  if (!inputDossierName || !inputDossierName.length) {
    model.setChainValue(`${rootModel}.hasError`, true);
    model.setChainValue(
      `${rootModel}.errorMessage`,
      "The name can not be empty!"
    );
    model.setChainValue(`${rootModel}.setNameButton.disabled`, true);
    return;
  }

  let currentItems = model.getChainValue("dossierDetails.items");
  if (!currentItems || !currentItems.length) {
    return;
  }

  let nameExists = currentItems.find((item) => {
    return equals(item.name, inputDossierName);
  });

  if (nameExists) {
    model.setChainValue(`${rootModel}.hasError`, true);
    model.setChainValue(
      `${rootModel}.errorMessage`,
      "There is already an entry with this name"
    );
    model.setChainValue(`${rootModel}.setNameButton.disabled`, true);
  }
}

export function updateDisplayedItems() {
  let model = this;
  if (!model) {
    console.error("no model inside updatedisplayeditems");
  }

  console.log("inside updatedisplyeditems");

  let _dossierDetails = model.dossierDetails;
  let _currentPath = _dossierDetails && _dossierDetails.currentPath;

  let _chainToItems = getItemsChainForPath.call(model, _currentPath);
  let _items = model.getChainValue(_chainToItems);

  model.setChainValue("dossierDetails.displayedItems", []);

  _items.forEach(function (item, index) {
    model.setChainValue(`dossierDetails.displayedItems.${index}`, item);
  });

  console.log(model.dossierDetails.displayedItems);
}
