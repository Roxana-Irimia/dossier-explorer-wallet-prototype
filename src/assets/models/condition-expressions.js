export function isGridLayout() {
  let model = this;

  return model.getChainValue("switchLayout.active") === "grid";
}

export function isListLayout() {
  let model = this;

  return model.getChainValue("switchLayout.active") === "list";
}

export function isFileSelected() {
  let model = this;

  const selectedItems = model.getChainValue("rightMenu.selectedItems");
  return selectedItems && selectedItems.length;
}

export function isSignOutModalOpened() {
  let model = this;

  return model.getChainValue("signOut.modal.opened") === true;
}
