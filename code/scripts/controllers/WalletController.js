import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";

import {getDossierServiceInstance} from "../service/DossierExplorerService.js"
import {getAccountServiceInstance} from "../service/AccountService.js";

import signOutViewModel from "../view-models/modals/signOutViewModel.js";

export default class WalletController extends ContainerController {
    constructor(element, history) {
        super(element, history);

        this.APPS_FOLDER = "/apps";
        this.DossierExplorerService = getDossierServiceInstance();
        this.DEFAULT_MARKETPLACE = "Default marketplace";
        this.MARKETPLACE_SSAPP = "psk-marketplace-ssapp";
        this.EXCLUDED_APPS_FOR_REGISTER = [this.MARKETPLACE_SSAPP, "dossier-explorer-ssapp"];
        this.AVAILABLE_APPLICATIONS_MARKETPLACE = "/availableApps";

        element.addEventListener("sign-out", this._signOutFromWalletHandler);
        element.addEventListener("getSSApps", this._getSSAppsHandler);

        this._registerDefaultMarketplace();
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

    _getApplicationTemplate() {
        return {
            exact: false,
            component: "psk-ssapp",
            componentProps: {}
        };
    }

    _getMaketplaceAppTemplate() {
        return {
            name: "",
            description: "",
            keySSI: "",
            image: "",
            visible: true,
            installed: true
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

    _registerDefaultMarketplace() {
        const defaultMarketplacePath = `${this.APPS_FOLDER}/${this.MARKETPLACE_SSAPP}${this.AVAILABLE_APPLICATIONS_MARKETPLACE}`;
        this.DossierExplorerService.readDir(defaultMarketplacePath, (err, defaultMarketplaceContent) => {
            if (err) {
                return console.error(err);
            }

            if (!defaultMarketplaceContent.length) {
                const defaultMarketplaceData = {
                    name: this.DEFAULT_MARKETPLACE,
                    description: this.DEFAULT_MARKETPLACE
                };

                this._setDefaultMarketplace(defaultMarketplaceData);
            }
        });
    }

    _setDefaultMarketplace(marketplaceData) {
        this.DossierExplorerService.printDossierSeed(this.APPS_FOLDER, this.MARKETPLACE_SSAPP, (err, keySSI) => {
            if (err) {
                return console.error(err);
            }

            this.DossierExplorerService.importMarketplace(keySSI, (err, marketplaceInformation) => {
                if (err) {
                    return console.error(err);
                }

                marketplaceData.keySSI = keySSI;
                const dataPath = `${this.APPS_FOLDER}/${this.MARKETPLACE_SSAPP}/data`;
                this.DSUStorage.setObject(dataPath, marketplaceData, (err) => {
                    if (err) {
                        return console.error(err);
                    }

                    this._addDefaultApplications(marketplaceInformation.path);
                });
            });
        });
    }

    _addDefaultApplications(marketplacePath) {
        this.DossierExplorerService.readDirDetailed(this.APPS_FOLDER, (err, {applications}) => {
            let chain = (appNamesList) => {
                if (!appNamesList.length) {
                    return;
                }

                let appName = appNamesList.pop();
                if (this.EXCLUDED_APPS_FOR_REGISTER.indexOf(appName) !== -1) {
                    return chain(appNamesList);
                }

                this.DossierExplorerService.getDSUSReadSSI(this.APPS_FOLDER, appName, (err, sReadSSI) => {
                    if (err) {
                        console.error(err);
                        return chain(appNamesList);
                    }

                    this._registerApp(marketplacePath, appName, sReadSSI, (err) => {
                        if (err) {
                            console.error(err, appName);
                        }

                        chain(appNamesList);
                    });
                });
            };

            chain(applications);
        });
    }

    _registerApp(marketplacePath, appName, sReadSSI, callback) {
        const appTemplate = this._getMaketplaceAppTemplate();
        appTemplate.name = appName;
        appTemplate.description = appName;
        appTemplate.keySSI = sReadSSI;
        appTemplate.image = "assets/images/" + appName;

        const availableAppsPath = marketplacePath + this.AVAILABLE_APPLICATIONS_MARKETPLACE;
        this.DossierExplorerService.createDossier(availableAppsPath, appName, (err) => {
            if (err) {
                return callback(err);
            }

            const dataPath = `${availableAppsPath}/${appName}/data`;
            this.DSUStorage.setObject(dataPath, appTemplate, (err) => {
                callback(err);
            });
        });
    }
}
