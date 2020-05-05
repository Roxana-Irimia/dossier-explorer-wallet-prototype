console.log("Loaded from domain.js");
const EDFS_ENDPOINT = "http://127.0.0.1:8080";

$$.swarms.describe("listDossierFiles", {
	start: function (path) {
		if (rawDossier) {
			return rawDossier.listFiles(path, this.return);
		}

		this.return(new Error("Dossier is not available."))
	}
});

$$.swarms.describe("listDossierFolders", {
	start: function (path) {
		if (rawDossier) {
			return rawDossier.listFolders(path, this.return);
		}

		this.return(new Error("Dossier is not available."))
	}
});

$$.swarms.describe("listMountedDossiers", {
	start: function (path) {
		if (rawDossier) {
			return rawDossier.listMountedDossiers(path, this.return);
		}

		this.return(new Error("Dossier is not available."))
	}
});

$$.swarms.describe('readDir', {
	start: function (path, options) {
		if (rawDossier) {
			return rawDossier.readDir(path, options, this.return);
		}

		this.return(new Error("Dossier is not available."))
	}
});

$$.swarms.describe("createDossier", {
	start: function (path, dossierName, SEED) {
		if (rawDossier) {
			const EDFS = require("edfs");
			const edfs = EDFS.attachToEndpoint(EDFS_ENDPOINT);

			let newRawDossier;
			if (SEED) {
				newRawDossier = edfs.loadRawDossier(SEED);
			} else {
				newRawDossier = edfs.createRawDossier();
			}

			return rawDossier.mount(path, dossierName, newRawDossier.getSeed(), (err) => {
				console.log(err, newRawDossier.getSeed());
				if (!err) {
					this.return(undefined, newRawDossier.getSeed());
				} else {
					this.return(err);
				}
			});
		}

		this.return(new Error("Dossier is not available."))
	}
});