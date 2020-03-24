import {
  isGridLayout,
  isListLayout,
  isFileSelected,
  isSignOutModalOpened
} from "../../assets/models/condition-expressions";

export const explorerInitConditionalExpressions = () => {
  if (!this.model.hasExpression("isGridLayout")) {
    this.model.addExpression("isGridLayout", isGridLayout, [
      "switchLayout.active"
    ]);
  }
  if (!this.model.hasExpression("isListLayout")) {
    this.model.addExpression("isListLayout", isListLayout, [
      "switchLayout.active"
    ]);
  }
  if (!this.model.hasExpression("isFileSelected")) {
    this.model.addExpression("isFileSelected", isFileSelected, [
      "rightMenu.selectedItems"
    ]);
  }
  if (!this.model.hasExpression("isSignOutModalOpened")) {
    this.model.addExpression("isSignOutModalOpened", isSignOutModalOpened, [
      "signOut.modal.opened"
    ]);
  }
};
