import {
  isGridLayout,
  isListLayout,
  isFileSelected,
  hasExitModalError,
  isSignOutModalOpened,
  isDossierEmpty,
  isCreateDossierModal,
  isNewDossierCreateState,
  hasNewDossierModalError,
  hasImportDossierModalError,
  isImportDossierCreateState,
  isImportDossierModal,
  isReceiveDossierModal,
  isReceiveDossierCreateState,
  hasReceiveDossierModalError
} from "../../assets/models/condition-expressions.js";
import {
  signOutCheckboxToggle,
  dossierNameInputChangeHandler
} from "../../assets/models/chain-change-handlers.js";

// TODO: Refactor: Create a dictionary with the conditions and make a generic function (something similar with assert.true) that will get the condition result.

// let dict = [
//   {
//     expression: "isGridLayout",
//     callback: isGridLayout,
//     chains: ["switchLayout.active"]
//   }
// ];

export function explorerInitConditionalExpressions() {
  const self = this;

  if (!self.model.hasExpression("isGridLayout")) {
    self.model.addExpression("isGridLayout", isGridLayout, [
      "switchLayout.active"
    ]);
  }

  if (!self.model.hasExpression("isListLayout")) {
    self.model.addExpression("isListLayout", isListLayout, [
      "switchLayout.active"
    ]);
  }

  if (!self.model.hasExpression("isDossierEmpty")) {
    self.model.addExpression("isDossierEmpty", isDossierEmpty, [
      "dossierDetails.items"
    ]);
  }

  if (!self.model.hasExpression("isFileSelected")) {
    self.model.addExpression("isFileSelected", isFileSelected, [
      "rightMenu.selectedItems"
    ]);
  }

  if (!self.model.hasExpression("isSignOutModalOpened")) {
    self.model.addExpression("isSignOutModalOpened", isSignOutModalOpened, [
      "signOut.modal.opened"
    ]);
  }

  if (!self.model.hasExpression("hasExitModalError")) {
    self.model.addExpression("hasExitModalError", hasExitModalError, [
      "signOut.modal.error.hasError",
      "signOut.modal.error.errorMessage"
    ]);
  }

  if (!self.model.hasExpression("isCreateDossierModal")) {
    self.model.addExpression("isCreateDossierModal", isCreateDossierModal, [
      "addItems.selectedModal"
    ]);
  }

  if (!self.model.hasExpression("isNewDossierCreateState")) {
    self.model.addExpression(
      "isNewDossierCreateState",
      isNewDossierCreateState,
      ["createDossierModal.createState"]
    );
  }

  if (!self.model.hasExpression("hasNewDossierModalError")) {
    self.model.addExpression(
      "hasNewDossierModalError",
      hasNewDossierModalError,
      ["createDossierModal.hasError", "createDossierModal.errorMessage"]
    );
  }

  if (!self.model.hasExpression("isImportDossierModal")) {
    self.model.addExpression("isImportDossierModal", isImportDossierModal, [
      "addItems.selectedModal"
    ]);
  }

  if (!self.model.hasExpression("isImportDossierCreateState")) {
    self.model.addExpression(
      "isImportDossierCreateState",
      isImportDossierCreateState,
      ["importDossierModal.createState"]
    );
  }

  if (!self.model.hasExpression("hasImportDossierModalError")) {
    self.model.addExpression(
      "hasImportDossierModalError",
      hasImportDossierModalError,
      ["importDossierModal.hasError", "importDossierModal.errorMessage"]
    );
  }

  if (!self.model.hasExpression("isReceiveDossierModal")) {
    self.model.addExpression("isReceiveDossierModal", isReceiveDossierModal, [
      "addItems.selectedModal"
    ]);
  }

  if (!self.model.hasExpression("isReceiveDossierCreateState")) {
    self.model.addExpression(
      "isReceiveDossierCreateState",
      isReceiveDossierCreateState,
      ["receiveDossierModal.createState"]
    );
  }

  if (!self.model.hasExpression("hasReceiveDossierModalError")) {
    self.model.addExpression(
      "hasReceiveDossierModalError",
      hasReceiveDossierModalError,
      ["receiveDossierModal.hasError", "receiveDossierModal.errorMessage"]
    );
  }

  /*****************  Chain change handlers - No Exprssions *********************/

  self.model.onChange(
    "signOut.modal.checkbox.value",
    signOutCheckboxToggle.bind(self.model)
  );

  self.model.onChange(
    "createDossierModal.setNameInput.value",
    dossierNameInputChangeHandler.bind(self.model, "createDossierModal")
  );

  self.model.onChange(
    "importDossierModal.setNameInput.value",
    dossierNameInputChangeHandler.bind(self.model, "importDossierModal")
  );

  self.model.onChange(
    "receiveDossierModal.setNameInput.value",
    dossierNameInputChangeHandler.bind(self.model, "receiveDossierModal")
  );
}
