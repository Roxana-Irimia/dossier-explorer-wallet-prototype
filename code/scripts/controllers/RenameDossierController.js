import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";

export default class RenameDossierController extends ModalController {
  constructor(element) {
    super(element);

    this._initListeners();
  }

  _initListeners = () => {
    this.on('confirm-rename', this._handleRenameFile, true);
  };

  _handleRenameFile = () => {
    let newFileName = this.model.fileName.value;
    let currentPath = this.model.currentPath;
    // Request to middleware for changing the name of file/dossier

    this.responseCallback(undefined, {
      success: true,
      newFileName: newFileName,
      currentPath: currentPath
    });
  }

}