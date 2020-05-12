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

    listDossierFiles(path, callback) {
        if (typeof path === "function") {
            callback = path;
            path = "/";
        }

        $$.interactions.startSwarmAs("test/agent/007", "listDossierFiles", "start", path)
            .onReturn(callback);
    }

    listDossierFolders(path, callback) {
        if (typeof path === "function") {
            callback = path;
            path = "/";
        }

        $$.interactions.startSwarmAs("test/agent/007", "listDossierFolders", "start", path)
            .onReturn(callback);
    }

    listMountedDossiers(path, callback) {
        if (typeof path === "function") {
            callback = path;
            path = "/";
        }

        $$.interactions.startSwarmAs("test/agent/007", "listMountedDossiers", "start", path)
            .onReturn(callback);
    }

    createDossier(path, SEED, callback) {
        if (typeof SEED === 'function') {
            callback = SEED;
            SEED = null;
        }

        $$.interactions.startSwarmAs("test/agent/007", "createDossier", "start", path, SEED)
            .onReturn(callback);
    }

    deleteFileFolder(path, callback) {
        $$.interactions.startSwarmAs("test/agent/007", "deleteFileFolder", "start", path)
            .onReturn(callback);
    }

    deleteDossier(path, callback) {
        $$.interactions.startSwarmAs("test/agent/007", "deleteDossier", "start", path)
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