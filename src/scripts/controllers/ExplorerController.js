import BindableController from "./base-controllers/BindableController.js";
import { explorerModel } from "../../assets/models/explorer-model.js";
import {
  isGridLayout,
  isListLayout
} from "../../assets/models/condition-expressions.js";

export default class ExplorerController extends BindableController {
  constructor(element) {
    super(element);
    this.model = this.setModel(explorerModel);

    this._attachExpressions();
    this._initListeners();
  }

  _attachExpressions = () => {
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
  };

  _initListeners = () => {
    this.on("switch-layout", this.element, this._handleSwitchLayout, true);
  };

  _handleSwitchLayout = event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    let layoutState = this.model.getChainValue("switchLayout.active");
    layoutState = layoutState === "grid" ? "list" : "grid";

    this.model.setChainValue("switchLayout.active", layoutState);
  };
}
