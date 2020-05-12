import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";
import Commons from "./Commons.js";
import {
  getDossierServiceInstance
} from "../service/DossierExplorerService.js";

export default class CreateDossierController extends ModalController {
  constructor(element) {
    super(element);

    this.dossierService = getDossierServiceInstance();

    this._initListeners();
  }

  _initListeners = () => {
    this.on('name-new-dossier', this._setNameForNewDossier, true);
    this.on('new-dossier-seed-received', this._finishNewDossierProcess, true);

    this.model.onChange("dossierNameInput.value", this._validateInput);
  };

  _setNameForNewDossier = (event) => {
    event.stopImmediatePropagation();
    Commons.updateErrorMessage(null, this.model);

    const wDir = this.model.currentPath || '/';
    let dossierName = this.model.dossierNameInput.value;
    this.dossierService.readDir(wDir, (err, dirContent) => {
      if (err) {
        Commons.updateErrorMessage(err, this.model);
      } else {
        if (dirContent.find((el) => el === dossierName)) {
          Commons.updateErrorMessage(this.model.error.errorLabels.fileExistsLabel, this.model);
        } else {
          this._createDossier(dossierName);
        }
      }
    });
  };

  _createDossier = (dossierName) => {
    const wDir = this.model.currentPath || '/';

    this.dossierService.createDossier(wDir + dossierName + '/', (err, outputSEED) => {
      if (err) {
        Commons.updateErrorMessage(err, this.model);
      } else {
        this.model.dossierSeedOutput.value = outputSEED;
        this.model.isDossierNameStep = false;
      }
    });
  }

  _finishNewDossierProcess = (event) => {
    event.stopImmediatePropagation();

    this.responseCallback(undefined, {
      success: true
    });
  };

  _validateInput = () => {
    Commons.updateErrorMessage(null, this.model);

    let isEmptyName = this.model.dossierNameInput.value.trim().length === 0;
    this.model.setChainValue('buttons.createDossier.disabled', isEmptyName);

    if (isEmptyName) {
      Commons.updateErrorMessage(this.model.error.errorLabels.nameNotEmptyLabel, this.model);
    }
  };
}