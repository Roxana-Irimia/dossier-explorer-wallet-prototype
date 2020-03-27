import BindableController from "./base-controllers/BindableController.js";
import { explorerModel } from "../../assets/models/explorer-model.js";
import {
  explorerExitHandler,
  explorerSwitchLayoutHandler,
  explorerConfirmExitHandler,
  toggleAddModalHandler,
  registerNewDossier
} from "../utils/eventHandlers.js";
import { explorerInitConditionalExpressions } from "../utils/controllerUtils.js";

export default class ExplorerController extends BindableController {
  constructor(element) {
    super(element);
    this.model = this.setModel(explorerModel);

    explorerInitConditionalExpressions.call(this);
    this._initListeners();
  }

  _initListeners = () => {
    this.on("exit", this.element, this._toggleExitModalOpened, true);
    this.on("cancel-exit", this.element, this._toggleExitModalOpened, true);
    this.on("confirm-exit", this.element, this._confirmExitHandler, true);

    this.on("switch-layout", this.element, this._handleSwitchLayout, true);

    this.on("add-modal", this.element, this._toggleAddModalHandler, true);
    this.on("send-new-dossier", this.element, this._registerNewDossier, true);
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

  _confirmExitHandler = event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    explorerConfirmExitHandler.call(this);
  };

  _toggleAddModalHandler = event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    toggleAddModalHandler.call(this, event);
  };

  _registerNewDossier = event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    registerNewDossier.call(this);
  };
}
