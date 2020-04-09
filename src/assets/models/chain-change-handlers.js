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

  let nameExists = currentItems.find((item) => {
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

export function handleDossierPathChange() {
  let model = this;
  if (!model) {
    console.error("[handleDossierPathChange] Model not found!");
    return;
  }

  let _dossierDetails = model.dossierDetails;
  let _currentPath = _dossierDetails && _dossierDetails.currentPath;

  if (!_currentPath || !_currentPath.length) {
    console.error("[handleDossierPathChange] current path is not available!");
    return;
  }

  let _items = _dossierDetails.items;
  let _itemsToBeDisplayed = _dossierDetails.itemsToBeDisplayed
    ? _dossierDetails.itemsToBeDisplayed
    : [];

  if (!_items || !_items.length) {
    _itemsToBeDisplayed = [];
    return;
  }

  if (_currentPath === "/") {
    _itemsToBeDisplayed = [..._items];
    model.setChainValue(
      "dossierDetails.itemsToBeDisplayed",
      _itemsToBeDisplayed
    );
    return;
  }

  let _sectionedPath = _currentPath.split("/").map((el) => el.trim());
  let _fullChain = `dossierDetails.items`;
  let _stopParsingNavigation = false;
  _sectionedPath.forEach(function (__pathSegment, index) {
    if (_stopParsingNavigation) {
      return;
    }

    let __currentSectionItems = model.getChainValue(_fullChain);
    if (!__currentSectionItems || !__currentSectionItems.length) {
      _stopParsingNavigation = true;
      _itemsToBeDisplayed = [];
      return;
    }

    let __segmentElementIndex = __currentSectionItems.findIndex(
      (el) => el.name === __pathSegment
    );
    if (__segmentElementIndex === -1) {
      _stopParsingNavigation = true;
      _itemsToBeDisplayed = [];
      return;
    }

    _fullChain = `${_fullChain}.${__segmentElementIndex}.items`;
    if (index + 1 === _sectionedPath.length) {
      _itemsToBeDisplayed = model.getChainValue(_fullChain);
    }
  });

  model.setChainValue("dossierDetails.itemsToBeDisplayed", _itemsToBeDisplayed);
}
