console.log("Loaded from domain.js");
$$.swarms.describe("listDossierFiles", {
	start: function(path){
		console.log("Listing files from domain.js");
		rawDossier.listFiles(path, this.return);
	}
});
