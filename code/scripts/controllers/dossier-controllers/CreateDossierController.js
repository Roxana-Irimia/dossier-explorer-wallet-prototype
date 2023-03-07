const { WebcController } = WebCardinal.controllers;
import FeedbackController from "../FeedbackController.js";
import Constants from "../Constants.js";
import { getNewDossierServiceInstance } from "../../service/NewDossierExplorerServiceWallet.js";

export default class CreateDossierController extends WebcController {
    constructor(...props) {
        super(...props);
        this.model = {
            title: "Create dossier",
            isDossierNameStep : true,
            dossierName : "",
            currentPath: this.model.currentPath
        }
        this._init();
    }

    async _init(){
        this.dossierService = await getNewDossierServiceInstance();
        this.feedbackController = new FeedbackController(this.model);
        this.onTagClick("confirm", this._setNameForNewDossier);
        //this._initListeners();
    }

    _initListeners = () => {
        this.on('name-new-dossier', this._setNameForNewDossier);
        this.on('new-dossier-seed-received', this._finishNewDossierProcess);

        this.model.onChange("dossierNameInput.value", this._validateInput);
    };

    _setNameForNewDossier = () => {
        // event.stopImmediatePropagation();
        // this.feedbackController.updateDisplayedMessage(Constants.ERROR);
        const value = document.querySelector("#dossier-name").value;
        if (!this._validateInput(value)) {
            return;
        }

        this.dossierName = value;
        this.wDir = this.model.currentPath || '/';
        if (this.wDir == '/') {
            this.wDir = '';
        }
        // this.feedbackController.setLoadingState(true);

        this.dossierService.readDir(this.wDir, (err, dirContent) => {
            if (err) {
                // this.feedbackController.setLoadingState();
                // this.feedbackController.updateDisplayedMessage(Constants.ERROR, err);
                console.log(err);
            } else {
                if (dirContent.find((el) => el.path === this.dossierName)) {
                    // this.feedbackController.setLoadingState();
                    // this.feedbackController.updateDisplayedMessage(Constants.ERROR, this.model.error.labels.entryExists);
                    console.log("Entry already exists");
                } else {
                    this._createDossier();
                }
            }
        });
    };

    _createDossier = () => {
        this.dossierService.createDossier(this.wDir, this.dossierName, (err, outputSEED) => {
            // this.feedbackController.setLoadingState();
            if (err) {
                console.log(err);
                // this.feedbackController.updateDisplayedMessage(Constants.ERROR, err);
            } else {
                this.model.dossierSeedOutput = outputSEED;
                this.model.isDossierNameStep = false;
            }
        });
    }

    _finishNewDossierProcess = (event) => {
        event.stopImmediatePropagation();

        this.responseCallback(undefined, {
            name: this.dossierName,
            path: `${this.wDir}/${this.dossierName}`
        });
    };

    _validateInput = (value) => {
        // this.feedbackController.updateDisplayedMessage(Constants.ERROR);

        const isEmptyName = value.trim().length === 0;
        const hasWhiteSpaces = value.replace(/\s/g, '') !== value;
        // this.model.setChainValue('buttons.createDossier.disabled', isEmptyName || hasWhiteSpaces);

        if (isEmptyName || hasWhiteSpaces) {
            // this.feedbackController.updateDisplayedMessage(Constants.ERROR, this.model.error.labels.nameNotValid);
            return false;
        }

        return true;
    };
}