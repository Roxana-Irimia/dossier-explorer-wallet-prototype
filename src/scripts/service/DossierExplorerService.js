class DossierExplorerService {


    constructor(){

    }


    listDossierFiles(path, callback) {
        if (typeof path === "function") {
            callback = path;
            path = "/";
        }

        setTimeout(
            ()=>{
                const HostBootScript = require("boot-host").HostBootScript;
                const HostPC = new HostBootScript("dossier-explorer");
                console.log("Starting listDosierFiles interactions");
                $$.interactions.startSwarmAs("test/agent/007", "listDossierFiles", "start", path)
                    .onReturn(callback);
            },10000
        );

    }

}

let dossierExplorer = new DossierExplorerService();

let getDossierServiceInstance = function () {
    return dossierExplorer;
};
export {getDossierServiceInstance} ;
