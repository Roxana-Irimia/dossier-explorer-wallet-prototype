export function explorerExitHandler() {
  let self = this;

  let modalState = self.model.getChainValue("signOut.modal.opened");
  modalState = modalState & false;

  self.model.setChainValue("signOut.modal.opened", modalState);
}

export function explorerSwitchLayoutHandler() {
  let self = this;

  let layoutState = self.model.getChainValue("switchLayout.active");
  layoutState = layoutState === "grid" ? "list" : "grid";

  self.model.setChainValue("switchLayout.active", layoutState);
}
