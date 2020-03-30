import {
  signOutCheckboxToggle,
  dossierNameInputChangeHandler
} from "../../assets/models/chain-change-handlers.js";
import { modelEquals, isChainEmpty } from "./utils.js";

let conditionDictionary = [
  {
    expression: "isGridLayout",
    callback: function() {
      return modelEquals.call(this, "switchLayout.active", "grid");
    },
    chains: ["switchLayout.active"]
  },
  {
    expression: "isListLayout",
    callback: function() {
      return modelEquals.call(this, "switchLayout.active", "list");
    },
    chains: ["switchLayout.active"]
  },
  {
    expression: "isDossierEmpty",
    callback: function() {
      return isChainEmpty.call(this, "dossierDetails.items");
    },
    chains: ["dossierDetails.items"]
  },
  {
    expression: "isFileSelected",
    callback: function() {
      return !isChainEmpty.call(this, "dossierDetails.items");
    },
    chains: ["rightMenu.selectedItems"]
  },
  {
    expression: "isSignOutModalOpened",
    callback: function() {
      return modelEquals.call(this, "signOut.modal.opened", true);
    },
    chains: ["signOut.modal.opened"]
  },
  {
    expression: "hasExitModalError",
    callback: function() {
      return modelEquals.call(this, "signOut.modal.error.hasError", true);
    },
    chains: ["signOut.modal.error.hasError", "signOut.modal.error.errorMessage"]
  },
  {
    expression: "isCreateDossierModal",
    callback: function() {
      return modelEquals.call(this, "addItems.selectedModal", "create-dossier");
    },
    chains: ["addItems.selectedModal"]
  },
  {
    expression: "isImportDossierModal",
    callback: function() {
      return modelEquals.call(this, "addItems.selectedModal", "import-dossier");
    },
    chains: ["addItems.selectedModal"]
  },
  {
    expression: "isReceiveDossierModal",
    callback: function() {
      return modelEquals.call(
        this,
        "addItems.selectedModal",
        "receive-dossier"
      );
    },
    chains: ["addItems.selectedModal"]
  },
  {
    expression: "isNewDossierCreateState",
    callback: function() {
      return modelEquals.call(this, "createDossierModal.createState", true);
    },
    chains: ["createDossierModal.createState"]
  },
  {
    expression: "hasNewDossierModalError",
    callback: function() {
      return modelEquals.call(this, "screateDossierModal.hasError", true);
    },
    chains: ["createDossierModal.hasError", "createDossierModal.errorMessage"]
  },
  {
    expression: "isImportDossierCreateState",
    callback: function() {
      return modelEquals.call(this, "importDossierModal.createState", true);
    },
    chains: ["importDossierModal.createState"]
  },
  {
    expression: "hasImportDossierModalError",
    callback: function() {
      return modelEquals.call(this, "importDossierModal.hasError", true);
    },
    chains: ["importDossierModal.hasError", "importDossierModal.errorMessage"]
  },
  {
    expression: "isReceiveDossierCreateState",
    callback: function() {
      return modelEquals.call(this, "receiveDossierModal.createState", true);
    },
    chains: ["receiveDossierModal.createState"]
  },
  {
    expression: "hasReceiveDossierModalError",
    callback: function() {
      return modelEquals.call(this, "receiveDossierModal.hasError", true);
    },
    chains: ["receiveDossierModal.hasError", "receiveDossierModal.errorMessage"]
  }
];

export function explorerInitConditionalExpressions() {
  const self = this;

  conditionDictionary.forEach(function({ expression, callback, chains }) {
    if (!self.model.hasExpression(expression)) {
      self.model.addExpression(expression, callback, chains);
    }
  });

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
