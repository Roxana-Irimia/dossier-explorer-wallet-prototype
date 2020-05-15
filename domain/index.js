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

			edfs.createRawDossier((err, newRawDossier) => {
				console.log(`New dossier called: path: ${path}, new dossier's seed: ${newRawDossier.getSeed()}, wallet dossier seed: ${rawDossier.getSeed()}`);
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
					console.trace(`attach with seed called: path: ${path}, fromSeed: ${SEED}, err:`, err);
					return this.return(err);
				}
				console.log(`New dossier called: path: ${path}, new dossier's seed: ${newRawDossier.getSeed()}, wallet dossier seed: ${rawDossier.getSeed()}`);

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

$$.swarms.describe('listDossiers', {
	printSeed: function (path, dossierName) {
		if (rawDossier) {
			return rawDossier.listMountedDossiers(path, (err, result) => {
				if (err) {
					return this.return(err);
				}

				let dossier = result.find((dsr) => dsr.path === dossierName);
				if (!dossier) {
					return this.return(new Error(`Dossier with the name ${dossierName} was not found in the mounted points!`));
				}

				this.return(null, dossier.identifier);
			});
		}

		this.return(new Error("Raw Dossier is not available."));
	}
});