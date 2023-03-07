const { WebcController } = WebCardinal.controllers;
import FeedbackController from "../FeedbackController.js";
import Constants from "../Constants.js";
import { getNewDossierServiceInstance } from "../../service/NewDossierExplorerServiceWallet.js";

export default class NewFolderController extends WebcController {
    constructor(element, history) {
        super(element, history);
        
        this._init()
    }

    async _init(){
        this.feedbackController = new FeedbackController(this.model);
        this.dossierService = await getNewDossierServiceInstance();

        this._initListeners();
    }

    _initListeners() {
        this.onTagClick('create', this._createNewFolder);
        this.onTagClick('cancel', () => {
            this.responseCallback(undefined);
        });

        //this.model.onChange("folderNameInput.value", this._validateInput);
    }

    _createNewFolder = (event) => {
        // event.preventDefault();
        // event.stopImmediatePropagation();
        const value = document.querySelector("#folder-name").value;
        if(!this._validateInput(value)){
            return;
        }
       

        let wDir = this.model.currentPath || '/';
        if (wDir == '/') {
            wDir = '';
        }

        const folderName = value;
        this.feedbackController.setLoadingState(true);
        this.dossierService.readDirDetailed(wDir, (err, { folders }) => {
            if (err) {
                this.feedbackController.setLoadingState();
                this.feedbackController.updateDisplayedMessage(Constants.ERROR, err);
            } else {
                if (folders.find((el) => el === folderName)) {
                    this.feedbackController.setLoadingState();
                    this.feedbackController.updateDisplayedMessage(Constants.ERROR, this.model.error.labels.entryExists);
                } else {
                    // If the name is not used, create the folder
                    this._createFolder(wDir, folderName);
                }
            }
        });
    }

    _createFolder = (path, folderName) => {
        const folderPath = `${path}/${folderName}`;
        const tempFilePath = `${folderPath}/temp.txt`;
        this.DSUStorage.setItem(tempFilePath, 'temporary text', (err) => {
            this.feedbackController.setLoadingState();
            if (err) {
                console.error(err);
                return this.feedbackController.updateDisplayedMessage(Constants.ERROR, err);
            }

            this.dossierService.deleteFileFolder(tempFilePath, (err) => {
                if (err) {
                    console.error(err);
                    return this.feedbackController.updateDisplayedMessage(Constants.ERROR, err);
                }

                this.responseCallback(undefined, {
                    path: folderPath,
                    name: folderName
                });
            });
        });
    }

    _validateInput = (value) => {
        // this.feedbackController.updateDisplayedMessage(Constants.ERROR);
        const isEmptyName = value.trim().length === 0;
        this.model.setChainValue('buttons.createFolderButton.disabled', isEmptyName);

        if (isEmptyName) {
            this.feedbackController.updateDisplayedMessage(Constants.ERROR, this.model.error.labels.nameNotValid);
            return false;
        }

        return true;
    };

}