class DossierExplorerService {

    constructor() {
        const HostBootScript = require("boot-host").HostBootScript;
        const HostPC = new HostBootScript("dossier-explorer");
    }

    readDir(path, callback) {
        $$.interactions
            .startSwarmAs("test/agent/007", "readDir", "start", path, {
                withFileTypes: true
            })
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

    createDossier(path, dossierName, callback) {
        $$.interactions.startSwarmAs("test/agent/007", "createDossier", "start", path, dossierName)
            .onReturn(callback);
    }

}

// let dossierExplorerInstance = new DossierExplorerService();
// Object.freeze(dossierExplorerInstance);

// export default dossierExplorerInstance;

let dossierExplorer = new DossierExplorerService();
let getDossierServiceInstance = function () {
    return dossierExplorer;
};

export {
    getDossierServiceInstance
};