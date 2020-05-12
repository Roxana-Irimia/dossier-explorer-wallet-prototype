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


// Refactor: Swarmu-ri separate + abstractizare
$$.swarms.describe("createDossier", {
	start: function (path, SEED) {
		if (rawDossier) {
			const EDFS = require("edfs");
			const edfs = EDFS.attachToEndpoint(EDFS_ENDPOINT);

			const mountNewDossier = (newRawDossier) => {
				rawDossier.mount(path, newRawDossier.getSeed(), (err) => {
					if (!err) {
						this.return(undefined, newRawDossier.getSeed());
					} else {
						this.return(err);
					}
				});
			}

			if (SEED) {
				return edfs.loadRawDossier(SEED, (err, newRawDossier) => {
					if (err) {
						return this.return(err);
					}

					mountNewDossier(newRawDossier);
				});
			}

			newRawDossier = edfs.createRawDossier();
			newRawDossier.load((err) => {
				if (err) {
					return this.return(err);
				}

				mountNewDossier(newRawDossier);
			})
		}
		else{
			this.return(new Error("Dossier is not available."))
		}
	}
});

$$.swarms.describe('deleteFileFolder', {
	start: function (path) {
		if (rawDossier) {
			return rawDossier.delete(path, this.return);
		}

		this.return(new Error("Dossier is not available."))
	}
});

$$.swarms.describe('deleteDossier', {
	start: function (path) {
		if (rawDossier) {
			return rawDossier.unmount(path, this.return);
		}

		this.return(new Error("Dossier is not available."))
	}
});
