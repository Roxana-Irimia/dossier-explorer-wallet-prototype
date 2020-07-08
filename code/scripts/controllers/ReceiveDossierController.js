import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";
import FeedbackController from "./FeedbackController.js";
import {
    getDossierServiceInstance
} from "../service/DossierExplorerService.js";

export default class ReceiveDossierController extends ModalController {
    constructor(element, history) {
        super(element, history);

        this.dossierService = getDossierServiceInstance();
        this.feedbackController = new FeedbackController(this.model);

        this._initListeners();
    }

    _initListeners = () => {
        this.on('receive-dossier-name', this._setNameForImportedDossier);
        this.on('receive-dossier-seed', this._importDossierFromSeed);

        this.model.onChange("dossierNameInput.value", this._validateInput);
        this.model.onChange("dossierSeedInput.value", () => {
            this._validateSEED(this.model.dossierSeedInput.value);
        });
        this.model.onChange("qrCode.data", () => {
            this._validateSEED(this.model.qrCode.data);
        });
    };

    _setNameForImportedDossier = (event) => {
        event.stopImmediatePropagation();

        this.feedbackController.updateErrorMessage();

        if (!this._validateInput()) {
            return;
        }

        const wDir = this.model.currentPath || '/';
        this.dossierName = this.model.dossierNameInput.value;
        this.dossierService.readDir(wDir, (err, dirContent) => {
            if (err) {
                this.feedbackController.updateErrorMessage(err);
            } else {
                if (dirContent.find((el) => el === this.dossierName)) {
                    this.feedbackController.updateErrorMessage(this.model.error.errorLabels.fileExistsLabel);
                } else {
                    // Go to the next step, where the user provides the SEED for the dossier
                    const nextStep = event.data;
                    const scanQrCode = nextStep === 'qr-code';
                    const enterSeed = !scanQrCode;

                    this.model.conditionalExpressions.isDossierNameStep = false;
                    this.model.conditionalExpressions.isDossierSeedStep = enterSeed;
                    this.model.conditionalExpressions.isScanQrCodeStep = scanQrCode;
                }
            }
        });
    };

    _importDossierFromSeed = (event) => {
        event.stopImmediatePropagation();

        let wDir = this.model.currentPath || '/';
        if (wDir == '/') {
            wDir = '';
        }
        this.feedbackController.setLoadingState(true);

        this.dossierService.importDossier(wDir, this.dossierName, this.SEED, (err) => {
            this.feedbackController.setLoadingState();
            if (err) {
                console.log(err);
                this.feedbackController.updateErrorMessage(err);
            } else {
                this.responseCallback(undefined, {
                    success: true
                });
            }
        });
    };

    _validateInput = () => {
        this.feedbackController.updateErrorMessage();

        const value = this.model.dossierNameInput.value;
        const isEmptyName = value.trim().length === 0;
        const hasWhiteSpaces = value.replace(/\s/g, '') !== value;
        const disabledButton = isEmptyName || hasWhiteSpaces;
        this.model.setChainValue('buttons.scanQrCodeButton.disabled', disabledButton);
        this.model.setChainValue('buttons.enterSeedButton.disabled', disabledButton);

        if (disabledButton) {
            this.feedbackController.updateErrorMessage(this.model.error.errorLabels.nameNotValidLabel);
            return false;
        }

        return true;
    };

    _validateSEED = (SEED) => {
        this.feedbackController.updateErrorMessage();
        let isEmptySeed = SEED.trim().length === 0;

        this.model.setChainValue('buttons.finishButton.disabled', isEmptySeed);

        if (isEmptySeed) {
            this.feedbackController.updateErrorMessage(this.model.error.errorLabels.seedNotEmptyLabel);
        } else {
            this.SEED = SEED;
        }
    }
}