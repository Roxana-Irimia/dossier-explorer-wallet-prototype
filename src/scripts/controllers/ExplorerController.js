import BindableController from "./base-controllers/BindableController.js";
import { explorerModel } from "../../assets/models/explorer-model.js";
// import { getDossierServiceInstance } from "../service/DossierExplorerService.js";
import {
  explorerExitHandler,
  explorerSwitchLayoutHandler,
  explorerConfirmExitHandler,
  toggleAddModalHandler,
  registerNewDossier,
  finishNewDossierProcess,
  validateSeedInput,
  selectWalletItemHandler,
  handleDeleteSelectedFiles,
  handleRename,
  handleFileFolderUpload,
} from "../utils/eventHandlers.js";
import { explorerInitConditionalExpressions } from "../utils/controllerUtils.js";
import { handleDossierPathChange } from "../../assets/models/chain-change-handlers.js";

export default class ExplorerController extends BindableController {
  constructor(element) {
    super(element);

    /**
     * TODO:
     * At the moment when the item list will be brought from the blockchain,
     * initialize each item with the selected attribute,
     * in order to avoid the undefined value for the class attribute
     */
    this.model = this.setModel(explorerModel);
    // let DossierService = getDossierServiceInstance();

    // DossierService.listDossierFiles(function (err, files) {
    //   console.log(err, files);
    // });

    explorerInitConditionalExpressions.call(this);
    this._initListeners();
    handleDossierPathChange.call(this.model);
  }

  _initListeners = () => {
    /**
     * Sign out modal
     */
    this.on("exit", this._toggleExitModalOpened, true);
    this.on("cancel-exit", this._toggleExitModalOpened, true);
    this.on("confirm-exit", this._confirmExitHandler, true);
    /**
     * End sign out modal
     */

    /**
     * Wallet switch & selection handlers
     */
    this.on("select-wallet-item", this._selectWalletItemHandler, true);
    this.on("switch-layout", this._handleSwitchLayout, true);
    /**
     * End wallet switch & selection handlers
     */

    /**
     * Add file-folder handlers
     */
    this.on("add-file-folder", this._handleFileFolderUpload, true);
    /**
     * End add file-folder handlers
     */

    this.on("fd-toggle-modal", this._toggleAddModalHandler, true);
    this.on("name-new-dossier", this._registerNewDossier, true);
    this.on("new-dossier-seed-received", this._finishNewDossierProcess, true);

    this.on("name-import-dossier", this._importNewDossier, true);
    this.on("seed-import-dossier", this._validateImportSeedDossier, true);

    this.on("next-receive-dossier", this._nextReceiveDossier, true);
    this.on("finish-receive-dossier", this._finishReceiveDossier, true);

    /**
     * Rename
     */
    this.on("confirm-rename", this._handleRename, true);
    /**
     * end rename
     */

    /**
     * Delete selected itms handlers
     */
    this.on("delete", this._handleDeleteSelectedFiles, true);
    /**
     * End Delete selected items handlers
     */
  };

  _handleSwitchLayout = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    explorerSwitchLayoutHandler.call(this);
  };

  _toggleExitModalOpened = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    explorerExitHandler.call(this);
  };

  _confirmExitHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    explorerConfirmExitHandler.call(this);
  };

  _toggleAddModalHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    toggleAddModalHandler.call(this, event);
  };

  _registerNewDossier = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    registerNewDossier.call(this, "createDossierModal");
  };

  _finishNewDossierProcess = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    toggleAddModalHandler.call(this, event);
    finishNewDossierProcess.call(this, "createDossierModal");
  };

  _importNewDossier = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    registerNewDossier.call(this, "importDossierModal");
  };

  _validateImportSeedDossier = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    validateSeedInput.call(this, "importDossierModal");
  };

  _nextReceiveDossier = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.model.setChainValue("receiveDossierModal.createState", false);
  };

  _finishReceiveDossier = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    registerNewDossier.call(this, "receiveDossierModal");
  };

  /**
   * Wallet selection handlers
   */
  _selectWalletItemHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    selectWalletItemHandler.call(this, event);
  };
  /**
   * End wallet selection handlers
   */

  /**
   * Rename
   */
  _handleRename = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    handleRename.call(this);
  };
  /**
   * End rename
   */

  /**
   * Delete selected itms handlers
   */
  _handleDeleteSelectedFiles = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    handleDeleteSelectedFiles.call(this, event);
  };
  /**
   * End Delete selected items handlers
   */

  _handleFileFolderUpload = (event) => {
    event.stopImmediatePropagation();
    event.preventDefault();

    handleFileFolderUpload.call(this, event.data);
  };
}
