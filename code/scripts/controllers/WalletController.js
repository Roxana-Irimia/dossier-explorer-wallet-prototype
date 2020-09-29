import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";

import { getDossierServiceInstance } from "../service/DossierExplorerService.js"
import { getAccountServiceInstance } from "../service/AccountService.js";

import signOutViewModel from "../view-models/modals/signOutViewModel.js";

const DossierExplorerService = getDossierServiceInstance();
const APPS_FOLDER = "/apps/psk-marketplace-ssapp/my-apps";
const MARKETPLACES_FOLDER = "/marketplaces";

const appTemplate = {
	exact: false,
	component: "psk-ssapp",
	componentProps: {}
};

export default class WalletController extends ContainerController {
	constructor(element, history) {
		super(element, history);
		element.addEventListener("sign-out", this._signOutFromWalletHandler);
		element.addEventListener("getSSApps", this._getSSAppsHandler);
	}

	_getSSAppsHandler = (event) => {
		debugger
		if (typeof event.getEventType === "function" &&
			event.getEventType() === "PSK_SUB_MENU_EVT") {

			let callback = event.data.callback;
			let pathPrefix = event.data.pathPrefix;
			if (typeof callback !== "function") {
				throw new Error("Callback should be a function");
			}

			DossierExplorerService.readDirDetailed(APPS_FOLDER, (err, {mounts}) => {
				if (err) {
					return callback(err);
				}
				let auxApps = [];
				let chain = (mounts) => {
					if (mounts.length === 0) {
						return callback(err, auxApps);
					}
					let mountedApp = mounts.shift();
					let path = APPS_FOLDER + '/' + mountedApp;

					let app = JSON.parse(JSON.stringify(appTemplate));
					app.path = pathPrefix + '/' + mountedApp;

					this.DSUStorage.getObject(path + '/data', (err, data) => {
						if (err) {
							console.log(err);
							return;
						}
						app.name = data.name;
						app.componentProps.appName = mountedApp;
						app.componentProps.keySSI = data.keySSI;
						auxApps.push({...app});
						chain(mounts);
					});
				}
				chain(mounts);
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
}
