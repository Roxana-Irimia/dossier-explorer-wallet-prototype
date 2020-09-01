import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";

import { getDossierServiceInstance } from "../service/DossierExplorerService.js"
import { getAccountServiceInstance } from "../service/AccountService.js";

import signOutViewModel from "../view-models/modals/signOutViewModel.js";

const DossierExplorerService = getDossierServiceInstance();
const APPS_FOLDER = "/apps";
const DOSSIER_EXPLORER_SSAPP = "dossier-explorer-ssapp";

const appTemplate = {
    exact: false,
    component: "psk-ssapp",
    componentProps: {}
};

export default class DossierExplorerWalletController extends ContainerController {
    constructor(element, history) {
        super(element, history);

        element.addEventListener("sign-out", this._signOutFromWalletHandler);
        element.addEventListener("getSSApps", this._getSSAppsHandler);

        this.model = this.setModel({});
        this._setKeySSI();
    }

    _getSSAppsHandler = (event) => {
        if (typeof event.getEventType === "function" &&
            event.getEventType() === "PSK_SUB_MENU_EVT") {

            let callback = event.data.callback;
            let pathPrefix = event.data.pathPrefix;
            if (typeof callback !== "function") {
                throw new Error("Callback should be a function");
            }

            DossierExplorerService.readDirDetailed(APPS_FOLDER, (err, { applications }) => {
                if (err) {
                    return callback(err);
                }

                let apps = [];
                applications.forEach((mountedApp) => {
                    let app = JSON.parse(JSON.stringify(appTemplate));
                    app.name = mountedApp;
                    app.path = pathPrefix + "/" + mountedApp;
                    app.componentProps.appName = mountedApp;
                    apps.push(app);
                });

                callback(err, apps);

            });

        }
    }

    _signOutFromWalletHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        this.showModal("signOutModal", signOutViewModel, (err, preferences) => {
            if (!err) {
                getAccountServiceInstance().signOut(preferences);
            }
        });
    };

    _setKeySSI = () => {
        DossierExplorerService.printDossierSeed(APPS_FOLDER, DOSSIER_EXPLORER_SSAPP, (err, keySSI) => {
            if (err) {
                return console.error(err);
            }

            this.model.setChainValue("keySSI", keySSI);
        });
    }
}