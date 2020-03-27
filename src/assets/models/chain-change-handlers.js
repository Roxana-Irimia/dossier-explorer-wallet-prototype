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

export function newDossierInputChangeHandler() {
  let model = this;

  model.setChainValue("createDossierModal.hasError", false);
  model.setChainValue("createDossierModal.createDossierButton.disabled", false);

  let inputDossierName = model.getChainValue(
    "createDossierModal.dossierInput.value"
  );
  if (!inputDossierName || !inputDossierName.length) {
    model.setChainValue("createDossierModal.hasError", true);
    model.setChainValue(
      "createDossierModal.errorMessage",
      "The name of the dossier can not be empty!"
    );
    model.setChainValue(
      "createDossierModal.createDossierButton.disabled",
      true
    );
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
    model.setChainValue("createDossierModal.hasError", false);
    model.setChainValue(
      "createDossierModal.errorMessage",
      "There is already a dossier with this name"
    );
    model.setChainValue(
      "createDossierModal.createDossierButton.disabled",
      true
    );
  }

  console.log(inputDossierName, nameExists);
}
