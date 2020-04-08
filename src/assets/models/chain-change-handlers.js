import { equals } from "../../scripts/utils/utils.js";

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

  let nameExists = currentItems.find(item => {
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
