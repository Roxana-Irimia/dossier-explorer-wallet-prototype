console.log("Loaded from domain.js");
const commons = require('./commons');
const constants = require('./constants');
function initializeBDNS(callback) {
    rawDossier.getKeySSI((err, keySSI) => {
        if (err) {
            return callback(err);
        }
        callback(undefined);
    });
}


$$.swarms.describe('readDir', {
    readDir: function(path, options) {
        if (rawDossier) {
            return rawDossier.readDir(path, options, this.return);
        }

        this.return(new Error("Raw Dossier is not available."));
    },
    start: function(path) {
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
    checkForApplications: function() {
        const mounts = this.content.mounts;
        const numberOfMounts = mounts.length;
        if (!numberOfMounts ||
            (numberOfMounts === 1 && mounts[0] === constants.CODE)) {
            return this.return(undefined, this.content);
        }

        let sequence = Promise.resolve();
        mounts.forEach((mount) => {
            sequence = sequence.then(() => {
                return new Promise((resolve) => {
                    if (mount !== constants.CODE) {
                        return this.checkForAppFolder(mount, resolve);
                    }
                    resolve();
                })
            })
        });

        sequence.then(() => {
            this.updateMountsList();
        })
    },
    updateMountsList: function() {
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
    checkForAppFolder: function(mountPoint, callback) {
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
    checkForCodeDossier: function(mounts, mountPoint, callback) {
        const hasCodeFolder = mounts.findIndex(mPoint => mPoint === constants.CODE) !== -1;
        if (hasCodeFolder) {
            return this.checkForIndexHTML(mountPoint, callback);
        }

        callback();
    },
    checkForIndexHTML: function(mountPoint, callback) {
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


$$.swarms.describe('listDossiers', {
    getMountedDossier: function(path) {
        commons.getParentDossier(rawDossier, path, (err, parentKeySSI, relativePath) => {
            if (err) {
                return this.return(err);
            }
            this.return(undefined, relativePath);
        })
    },
    printSeed: function(path, dossierName) {
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
