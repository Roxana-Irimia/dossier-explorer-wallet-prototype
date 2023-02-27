import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import Constants from "./Constants.js";

import { getNewDossierServiceInstance } from "../service/NewDossierExplorerServiceWallet.js";

export default class SSAppController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        this._init(element);
        
    }
    async _init(element){
        this.DossierExplorerService = await getNewDossierServiceInstance();

        this.ssappName = element.getAttribute('data-ssapp-name');
        this.DossierExplorerService.getDSUSeedSSI(Constants.APPS_FOLDER, this.ssappName, (err, keySSI) => {
            if (err) {
                return console.error(err);
            }
            this.model = this.setModel({ keySSI: keySSI });
        });
    }
}