console.log("Loaded from domain.js");
const EDFS_ENDPOINT = "http://localhost:8080";
const EDFS = require("edfs");
const edfs = EDFS.attachToEndpoint(EDFS_ENDPOINT);

const commons = require('./commons');

$$.swarms.describe('readDir', {
	start: function (path, options) {
		if (rawDossier) {
			return rawDossier.readDir(path, options, this.return);
		}

		this.return(new Error("Raw Dossier is not available."));
	}
});

$$.swarms.describe('move', {
	start: function (oldPath, newPath) {
		if (rawDossier) {
			this.return(undefined, `
			Received: ${oldPath} - ${newPath}
			`);
		}

		this.return(new Error("Raw Dossier is not available."));
	}
});

$$.swarms.describe("attachDossier", {
	newDossier: function (path, dossierName) {
		if (rawDossier) {
			commons.createNewDossier((err, newDossier) => {
				if (err) {
					return this.return(err);
				}

				commons.getParentDossier(rawDossier, path, (err, parentDossierSeed, relativePath) => {
					if (err) {
						return this.return(err);
					}

					if (parentDossierSeed) {
						return edfs.loadRawDossier(parentDossierSeed, (err, parentRawDossier) => {
							if (err) {
								return this.return(err);
							}

							const mountPoint = `${path.replace(relativePath, '')}/${dossierName}`;
							commons.mountDossier.call(this, parentRawDossier, mountPoint, newDossier.getSeed());
						});
					}

					const mountPoint = `${path}/${dossierName}`;
					commons.mountDossier.call(this, rawDossier, mountPoint, newDossier.getSeed());
				});
			});
		} else {
			this.return(new Error("Raw Dossier is not available."))
		}
	},
	fromSeed: function (path, dossierName, SEED) {
		if (rawDossier) {
			edfs.loadRawDossier(SEED, (err, loadedDossier) => {
				if (err) {
					return this.return(err);
				}

				commons.getParentDossier(rawDossier, path, (err, parentDossierSeed, relativePath) => {
					if (err) {
						return this.return(err);
					}

					if (parentDossierSeed) {
						return edfs.loadRawDossier(parentDossierSeed, (err, parentRawDossier) => {
							if (err) {
								return this.return(err);
							}

							const mountPoint = `${path.replace(relativePath, '')}/${dossierName}`;
							commons.mountDossier.call(this, parentRawDossier, mountPoint, loadedDossier.getSeed());
						});
					}

					const mountPoint = `${path}/${dossierName}`;
					commons.mountDossier.call(this, rawDossier, mountPoint, loadedDossier.getSeed());
				});
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

				this.return(undefined, dossier.identifier);
			});
		}

		this.return(new Error("Raw Dossier is not available."));
	}
});