import { normalizeDashedToCamelCase } from "./utils.js";
import { DELETE_ITEMS_PLACEHOLDER } from "./constants.js";

const modalActionsList = {
  deleteDossier: _handleDeletePreliminaryOptions,
  renameDossier: _handleRenamePreliminaryOptions,
};

export function checkForModalOptions(data) {
  if (data && data.modalName && data.getList) {
    let actionName = normalizeDashedToCamelCase(data.modalName);
    modalActionsList[actionName] && modalActionsList[actionName].call(this);
  }
}

function _handleDeletePreliminaryOptions() {
  let model = this;
  let _modal = model.deleteSelectedItemsModal;
  let _selectedList = model.dossierDetails.selectedItems;
  if (!_modal || !_selectedList || !_selectedList.length) {
    return;
  }

  let templateMessage;
  let itemsLabel = _modal.itemsLabel ? _modal.itemsLabel : "";
  if (_modal.templateMessage) {
    templateMessage = _modal.templateMessage;
  } else {
    templateMessage = _modal.notificationMessage;
    _modal.templateMessage = templateMessage;
  }

  let placeholder = `${_selectedList.length} ${itemsLabel}`.trim();
  let finalMessage = templateMessage.replace(
    DELETE_ITEMS_PLACEHOLDER,
    placeholder
  );

  _modal.notificationMessage = finalMessage;
}

function _handleRenamePreliminaryOptions() {
  let model = this;
  let _modal = model.renameDossierModal;
  if (!_modal) {
    return;
  }

  let _selectedList = model.dossierDetails.selectedItems;

  if (_selectedList && _selectedList.length !== 1) {
    model.addItems = {
      ...model.addItems,
      selectedModal: "",
      hasError: true,
      errorMessage: _modal.renameOneFileError,
    };
  }

  _modal.oldValue = _selectedList[0];
  _modal.setNameInput.value = _selectedList[0];
}
