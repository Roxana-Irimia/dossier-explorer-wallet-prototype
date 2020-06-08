import {getDossierServiceInstance} from "../service/DossierExplorerService.js"
const DossierExplorerService = getDossierServiceInstance();
const APPS_FOLDER = "/apps";

const appTemplate = {
	exact: false,
	component: "psk-ss-app",
	componentProps: {}
};

export default class DossierAppController {
  constructor(element) {

    element.addEventListener("getSSApps", function(event) {
      if (
        typeof event.getEventType === "function" &&
        event.getEventType() === "PSK_SUB_MENU_EVT"
      ) {

        let callback = event.data.callback;
        let pathPrefix = event.data.pathPrefix;
        if (typeof callback !== "function") {
          throw new Error("Callback should be a function");
        }

        DossierExplorerService.readDirDetailed(APPS_FOLDER, (err, {applications})=>{
			if (err) {
				return callback(err);
			}

			let apps = [];
			applications.forEach((mountedApp) => {
				let app = JSON.parse(JSON.stringify(appTemplate));
				app.name = mountedApp;
				app.path = pathPrefix +"/" + mountedApp;
				app.componentProps.appName = mountedApp;
				apps.push(app);
			});

			callback(err, apps);

		});

      }
    });
  }
}
