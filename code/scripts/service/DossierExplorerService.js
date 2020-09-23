class DossierExplorerService {

    constructor() {
        const HostBootScript = require("boot-host").HostBootScript;
        const HostPC = new HostBootScript("dossier-explorer");
    }

    readDirDetailed(path, callback) {
        $$.interactions
            .startSwarmAs("test/agent/007", "readDir", "start", path)
            .onReturn(callback);
    }


    printDossierSeed(path, dossierName, callback) {
        $$.interactions.startSwarmAs("test/agent/007", "listDossiers", "printSeed", path, dossierName)
            .onReturn(callback);
    }

}

let dossierExplorer = new DossierExplorerService();
let getDossierServiceInstance = function() {
    return dossierExplorer;
};

export {
    getDossierServiceInstance
};
