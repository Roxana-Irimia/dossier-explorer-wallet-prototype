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

	let mntApps;

    element.addEventListener("getSSApps", function(event) {
      if (
        typeof event.getEventType === "function" &&
        event.getEventType() === "PSK_SUB_MENU_EVT"
      ) {
        let callback = event.data;
        if (typeof callback !== "function") {
          throw new Error("Callback should be a function");
        }

        DossierExplorerService.getInstalledApps(APPS_FOLDER, (err, mountedApps)=>{

			if (err) {
				return callback(err);
			}

			let apps = [];
			mntApps = mountedApps;
			mountedApps.forEach((mountedApp) => {
				let app = JSON.parse(JSON.stringify(appTemplate));
				app.name = mountedApp.path;
				app.path = "/my-apps/" + mountedApp.path;
				app.componentProps.appName = mountedApp.path;
				apps.push(app);
			});

			callback(err, apps);

		});

      }
    });


    element.addEventListener("giveMeSeed",(evt)=>{

    	let appName = evt.detail.appName;
    	let callback = evt.detail.callback;

    	for(let i = 0; i<mntApps.length; i++){
    		if(mntApps[i].path === appName){
    			return callback(undefined, mntApps[i].identifier);
			}
		}

		callback(new Error("No seed for app "+appName));


	})
  }
}
