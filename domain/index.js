console.log("Loaded from domain.js");
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