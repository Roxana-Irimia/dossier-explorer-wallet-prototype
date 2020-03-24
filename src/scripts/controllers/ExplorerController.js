import BindableController from "./base-controllers/BindableController.js";
import { explorerModel } from "../../assets/models/explorer-model.js";
import {
  explorerExitHandler,
  explorerSwitchLayoutHandler
} from "../utils/eventHandlers.js";
import {
  isGridLayout,
  isListLayout,
  isFileSelected,
  isSignOutModalOpened
} from "../../assets/models/condition-expressions.js";

export default class ExplorerController extends BindableController {
  constructor(element) {
    super(element);
    this.model = this.setModel(explorerModel);

    this._explorerInitConditionalExpressions();
    this._initListeners();
  }

  _initListeners = () => {
    this.on("exit", this.element, this._toggleExitModalOpened, true);
    this.on("cancel-exit", this.element, this._toggleExitModalOpened, true);
    this.on("switch-layout", this.element, this._handleSwitchLayout, true);
  };

  _handleSwitchLayout = event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    explorerSwitchLayoutHandler.call(this);
  };

  _toggleExitModalOpened = event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    explorerExitHandler.call(this);
  };

  _explorerInitConditionalExpressions = () => {
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
}
