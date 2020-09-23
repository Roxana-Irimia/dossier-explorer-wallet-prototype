import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import { getDossierServiceInstance } from "../service/DossierExplorerService.js"

const DossierExplorerService = getDossierServiceInstance();
const APPS_FOLDER = "/apps";

export default class SSAppController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        this.ssappName = element.getAttribute('data-ssapp-name');

        DossierExplorerService.printDossierSeed(APPS_FOLDER, this.ssappName, (err, keySSI) => {
            if (err) {
                return console.error(err);
            }
            this.model = this.setModel({keySSI:keySSI});
        });
    }


}
