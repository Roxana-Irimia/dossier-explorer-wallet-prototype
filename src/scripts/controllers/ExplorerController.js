import BindableController from "./base-controllers/BindableController.js";
import { explorerModel } from "../../assets/models/explorer-model.js";
import { explorerInitConditionalExpressions } from "../utils/controllerUtils.js";
import {
  explorerExitHandler,
  explorerSwitchLayoutHandler
} from "../utils/eventHandlers.js";

export default class ExplorerController extends BindableController {
  constructor(element) {
    super(element);
    this.model = this.setModel(explorerModel);

    this._initListeners();
    explorerInitConditionalExpressions();
  }

  _initListeners = () => {
    this.on(
      "exit cancel-exit confirm-exit",
      this.element,
      this._toggleExitModalOpened,
      true
    );
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
}
