console.log("Loaded from domain.js");
const EDFS_ENDPOINT = "http://localhost:8080";

/**
 * Common function used in more places.
 * TBD: if move to some other place to avoid overcrowding the file in the future
 */
const abstractFunctions = {
	mountDossier: function (rawDossier, path, newDossierSEED) {
		let self = this;
		rawDossier.mount(path, newDossierSEED, (err) => {
			if (err) {
				return self.return(err);
			}

			self.return(undefined, newDossierSEED);
		});
	}
}

$$.swarms.describe('readDir', {
	start: function (path, options) {
		if (rawDossier) {
			return rawDossier.readDir(path, options, this.return);
		}

		this.return(new Error("Raw Dossier is not available."))
	}
});

$$.swarms.describe("attachDossier", {
	newDossier: function (path) {
		if (rawDossier) {
			const EDFS = require("edfs");
			const edfs = EDFS.attachToEndpoint(EDFS_ENDPOINT);

			newRawDossier = edfs.createRawDossier();
			newRawDossier.load((err) => {
				if (err) {
					return this.return(err);
				}

				abstractFunctions.mountDossier
					.call(this, rawDossier, path, newRawDossier.getSeed());
			});
		} else {
			this.return(new Error("Raw Dossier is not available."))
		}
	},
	fromSeed: function (path, SEED) {
		if (rawDossier) {
			const EDFS = require("edfs");
			const edfs = EDFS.attachToEndpoint(EDFS_ENDPOINT);

			edfs.loadRawDossier(SEED, (err, newRawDossier) => {
				if (err) {
					return this.return(err);
				}

				abstractFunctions.mountDossier
					.call(this, rawDossier, path, newRawDossier.getSeed());
			});

		} else {
			this.return(new Error("Raw Dossier is not available."))
		}
	}
});

$$.swarms.describe('delete', {
	fileFolder: function (path) {
		if (rawDossier) {
			return rawDossier.delete(path, this.return);
		}

		this.return(new Error("Raw Dossier is not available."))
	},
	dossier: function (path) {
		if (rawDossier) {
			return rawDossier.unmount(path, this.return);
		}

		this.return(new Error("Raw Dossier is not available."))
	}
});