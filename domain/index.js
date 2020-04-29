console.log("Loaded from domain.js");
$$.swarms.describe("listDossierFiles", {
	start: function(path){
		if(rawDossier)
		{
			return rawDossier.listFiles(path, this.return);
		}

		this.return(new Error("Dossier is not available."))

	}
});
