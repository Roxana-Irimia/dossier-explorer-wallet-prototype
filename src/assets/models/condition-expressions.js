export function isGridLayout() {
  let model = this;

  return model.getChainValue("switchLayout.active") === "grid";
}

export function isListLayout() {
  let model = this;

  return model.getChainValue("switchLayout.active") === "list";
}
