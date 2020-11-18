import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";

import {getDossierServiceInstance} from "../service/DossierExplorerService.js"
import {getAccountServiceInstance} from "../service/AccountService.js";

import signOutViewModel from "../view-models/modals/signOutViewModel.js";

export default class WalletController extends ContainerController {
    constructor(element, history) {
        super(element, history);

        this.APPS_FOLDER = "/apps";
        this.DossierExplorerService = getDossierServiceInstance();

        element.addEventListener("sign-out", this._signOutFromWalletHandler);
        element.addEventListener("getSSApps", this._getSSAppsHandler);
    }

    _getSSAppsHandler = (event) => {
        if (typeof event.getEventType === "function" &&
            event.getEventType() === "PSK_SUB_MENU_EVT") {

            let callback = event.data.callback;
            let pathPrefix = event.data.pathPrefix;
            if (typeof callback !== "function") {
                throw new Error("Callback should be a function");
            }

            this.DossierExplorerService.readDirDetailed(this.APPS_FOLDER, (err, {applications}) => {
                if (err) {
                    return callback(err);
                }

                let mountedApplications = [];
                let chain = (appNamesList) => {
                    if (!appNamesList.length) {
                        return callback(err, mountedApplications);
                    }

                    let appName = appNamesList.pop();
                    this.DossierExplorerService.printDossierSeed(this.APPS_FOLDER, appName, (err, appSSI) => {
                        if (err) {
                            console.error(err);
                            return chain(appNamesList);
                        }

                        let app = this._getApplicationTemplate();
                        app.name = appName;
                        app.path = pathPrefix + "/" + appSSI;
                        app.componentProps.appName = appName;
                        app.componentProps.keySSI = appSSI;
                        mountedApplications.push(app);
                        chain(appNamesList);
                    });
                };

                chain(applications);
            });
        }
    };

    _signOutFromWalletHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        this.showModal("signOutModal", signOutViewModel, (err, preferences) => {
            if (!err) {
                getAccountServiceInstance().signOut(preferences);
            }
        });
    };

    _getApplicationTemplate() {
        return {
            exact: false,
            component: "psk-ssapp",
            componentProps: {}
        };
    }
}
