import {
  isGridLayout,
  isListLayout,
  isFileSelected,
  hasExitModalError,
  isSignOutModalOpened
} from "../../assets/models/condition-expressions.js";
import { signOutCheckboxToggle } from "../../assets/models/chain-change-handlers.js";

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

  if (!self.model.hasExpression("isFileSelected")) {
    self.model.addExpression("isFileSelected", isFileSelected, [
      "rightMenu.selectedItems"
    ]);
  }
  if (!self.model.hasExpression("isSignOutModalOpened")) {
    self.model.addExpression(
      "isSignOutModalOpened",
      isSignOutModalOpened,
      "signOut.modal.opened"
    );
  }

  if (!self.model.hasExpression("hasExitModalError")) {
    self.model.addExpression("hasExitModalError", hasExitModalError, [
      "signOut.modal.error.hasError",
      "signOut.modal.error.errorMessage"
    ]);
  }

  if (!self.model.hasExpression("signOutCheckboxToggle")) {
    self.model.addExpression("signOutCheckboxToggle", function() {}, [
      "signOut.modal.checkbox.value"
    ]);
    self.model.onChangeExpressionChain(
      "signOutCheckboxToggle",
      signOutCheckboxToggle.bind(self.model)
    );
  }
}
