console.log("Loaded from domain.js");
const EDFS_ENDPOINT = "http://localhost:8080";
const EDFS = require("edfs");
const edfs = EDFS.attachToEndpoint(EDFS_ENDPOINT);

const commons = require('./commons');
const constants = require('./constants');

$$.swarms.describe('readDir', {
    readDir: function (path, options) {
        if (rawDossier) {
            return rawDossier.readDir(path, options, this.return);
        }

        this.return(new Error("Raw Dossier is not available."));
    },
    start: function (path) {
        if (rawDossier) {
            return rawDossier.readDir(path, constants.WITH_FILE_TYPES, (err, content) => {
                if (err) {
                    return this.return(err);
                }

                this.path = path === '/' ? '' : path;
                this.content = {
                    ...content,
                    applications: []
                };
                this.checkForApplications();
            });
        }

        this.return(new Error("Raw Dossier is not available."));
    },
    checkForApplications: function () {
        const mounts = this.content.mounts;
        const numberOfMounts = mounts.length;
        if (!numberOfMounts ||
            (numberOfMounts === 1 && mounts[0] === constants.CODE)) {
            return this.return(undefined, this.content);
        }

        let sequence = Promise.resolve();
        mounts.forEach((mount) => {
            sequence = sequence.then(()=>{
                return new Promise((resolve)=>{
					if (mount !== constants.CODE) {
						return this.checkForAppFolder(mount, resolve);
					}
					resolve();
                })
            })
        });

		sequence.then(()=>{
			this.updateMountsList();
        })
	},
    updateMountsList: function () {
        const { mounts, applications } = this.content;
        const filteredMountPoints = mounts.filter((mountPoint) => {
            let remove = false;
            applications.forEach((appName) => {
                remove = remove || appName === mountPoint;
            });

            return !remove;
        });

        this.content.mounts = filteredMountPoints;
        this.return(undefined, this.content);
    },
    checkForAppFolder: function (mountPoint, callback) {
        const wDir = `${this.path}/${mountPoint}`;
        rawDossier.readDir(wDir, constants.WITH_FILE_TYPES, (err, mountPointContent) => {
            if (err) {
                return this.return(err);
            }

            const { folders, mounts } = mountPointContent;
            if (!folders || !folders.length) {
               return this.checkForCodeDossier(mounts, mountPoint, callback);
            }

            const hasAppFolder = folders.findIndex((fName) => fName === constants.APP) !== -1;
            if (!hasAppFolder) {
                return this.checkForIndexHTML(mountPoint, callback);
            }

            this.content.applications.push(mountPoint);

            callback();

        });
    },
    checkForCodeDossier: function (mounts, mountPoint, callback) {
        const hasCodeFolder = mounts.findIndex(mPoint => mPoint === constants.CODE) !== -1;
        if (hasCodeFolder) {
            return this.checkForIndexHTML(mountPoint, callback);
        }

        callback();
    },
    checkForIndexHTML: function (mountPoint, callback) {
        const wDir = `${this.path}/${mountPoint}`;
        rawDossier.readDir(`${wDir}/${constants.CODE}`, constants.WITH_FILE_TYPES, (err, codeContent) => {
            if (err) {
                return this.return(err);
            }

            const { files, folders } = codeContent;
            if (!files || !files.length) {
				return callback();
            }

            const hasIndexHtml = files.findIndex((fName) => fName === constants.INDEX_HTML) !== -1;
            if (!hasIndexHtml) {
                const hasAppFolder = folders.findIndex((fName) => fName === constants.APP) !== -1;
                if (hasAppFolder) {
                    this.path = wDir;
                    return this.checkForAppFolder(constants.CODE, callback);
                }

                return this.checkForCodeDossier(mounts, mountPoint, callback);
            }

            this.content.applications.push(mountPoint);

            callback();
        });
    }
});

$$.swarms.describe('move', {
    start: function (oldPath, newPath) {
        if (rawDossier) {
            this.return(undefined, {
                from: oldPath,
                to: newPath
            });
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

                    if (parentDossierSeed !== rawDossier.getSeed()) {
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

                    if (parentDossierSeed !== rawDossier.getSeed()) {
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
    getMountedDossier:function(path){
		commons.getParentDossier(rawDossier, path, (err, parentDossierSeed, relativePath) => {
		    if(err){
                return this.return(err);
            }
			this.return(undefined, relativePath);
		})
    },
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
