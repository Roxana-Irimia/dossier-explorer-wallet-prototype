import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";
import FeedbackController from "./FeedbackController.js";
import {
  getDossierServiceInstance
} from "../service/DossierExplorerService.js";

export default class MoveDossierController extends ModalController {
  constructor(element) {
    super(element);

    this.dossierService = getDossierServiceInstance();
    this.feedbackController = new FeedbackController(this.model);

    this._initListeners();
    this._displayCurrentWorkingDirectory();
  }

  _initListeners = () => {
    this.on('confirm-move', this._handleMoveFile);
  };

  _displayCurrentWorkingDirectory = () => {
    let wDir = this.model.destinationPath || '';
    if (wDir === '/') {
      wDir = '';
    }

    
  }

  _handleMoveFile = () => {
    const selectedEntryName = this.model.selectedEntryName;
    const currentPath = this.model.currentPath || '';
    let destinationPath = this.model.destinationPath || '';
    if (destinationPath === '/') {
      destinationPath = '';
    }

    const oldPath = `${currentPath}/${selectedEntryName}`;
    const newPath = `${destinationPath}/${selectedEntryName}`;
    this.dossierService.move(oldPath, newPath, (err, result) => {
      if (err) {
        console.error(err);
        return this.feedbackController.updateErrorMessage(err);
      }

      this.responseCallback(undefined, {
        success: true,
        result: result
      });
    });
  }
}