class DossierExplorerService {

    constructor() {
        const HostBootScript = require("boot-host").HostBootScript;
        const HostPC = new HostBootScript("dossier-explorer");
    }

    readDir(path, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {
                withFileTypes: false
            };
        }
        $$.interactions
            .startSwarmAs("test/agent/007", "readDir", "start", path, options)
            .onReturn(callback);
    }

    createDossier(path, callback) {
        $$.interactions.startSwarmAs("test/agent/007", "attachDossier", "newDossier", path)
            .onReturn(callback);
    }

    importDossier(path, SEED, callback) {
        $$.interactions.startSwarmAs("test/agent/007", "attachDossier", "fromSeed", path, SEED)
            .onReturn(callback);
    }

    deleteFileFolder(path, callback) {
        $$.interactions.startSwarmAs("test/agent/007", "delete", "fileFolder", path)
            .onReturn(callback);
    }

    deleteDossier(path, callback) {
        $$.interactions.startSwarmAs("test/agent/007", "delete", "dossier", path)
            .onReturn(callback);
    }

    printDossierSeed(path, dossierName, callback) {
        $$.interactions.startSwarmAs("test/agent/007", "listDossiers", "printSeed", path, dossierName)
            .onReturn(callback);
    }

}

let dossierExplorer = new DossierExplorerService();
let getDossierServiceInstance = function () {
    return dossierExplorer;
};

export {
    getDossierServiceInstance
};