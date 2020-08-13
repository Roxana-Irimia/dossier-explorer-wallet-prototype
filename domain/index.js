console.log("Loaded from domain.js");
const EDFS = require("edfs");
const commons = require('./commons');
const constants = require('./constants');

function initializeBDNS(callback) {
    rawDossier.getKeySSI((err, keySSI) => {
        if (err) {
            return callback(err);
        }

        const keySSIInstance = require("key-ssi-resolver").KeySSIFactory.create(keySSI);
        $$.BDNS.addConfig("default", {
            endpoints: [
                {
                    endpoint: keySSIInstance.getHint(),
                    type: 'brickStorage'
                },
                {
                    endpoint: keySSIInstance.getHint(),
                    type: 'anchorService'
                }
            ]
        })
        callback(undefined);
    });
}


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
    updateMountsList: function () {
        const {mounts, applications} = this.content;
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

            const {folders, mounts} = mountPointContent;
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

            const {files, folders} = codeContent;
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

$$.swarms.describe('rename', {
    start: function (oldPath, newPath) {
        if (rawDossier) {
            rawDossier.rename(oldPath, newPath, (err) => {
                if (err) {
                    return this.return(new Error(err));
                }

                this.return(undefined, {
                    success: true,
                    oldPath: oldPath,
                    newPath: newPath
                })
            });
        } else {
            this.return(new Error("Raw Dossier is not available."));
        }
    }
});

$$.swarms.describe("attachDossier", {
    newDossier: function (path, dossierName) {
        if (rawDossier) {
            initializeBDNS((err) => {
                if (err) {
                    return this.return(err);
                }

                EDFS.createDSU("RawDossier", (err, newDossier) => {
                    if (err) {
                        return this.return(err);
                    }
                    newDossier.getKeySSI((err, keySSI) => {
                        if (err) {
                            return this.return(err);
                        }

                        this.mountDossier(path, keySSI, dossierName);
                    });
                });
            });
        } else {
            this.return(new Error("Raw Dossier is not available."))
        }
    },
    fromSeed: function (path, dossierName, SEED) {
        if (rawDossier) {
            EDFS.resolveSSI(SEED, "RawDossier", (err, loadedDossier) => {
                if (err) {
                    return this.return(err);
                }

                loadedDossier.getKeySSI((err, keySSI) => {
                    if (err) {
                        return this.return(err);
                    }
                    this.mountDossier(path, keySSI, dossierName);
                });
            });
        } else {
            this.return(new Error("Raw Dossier is not available."))
        }
    },
    mountDossier: function (path, keySSI, dossierName) {
        commons.getParentDossier(rawDossier, path, (err, parentKeySSI, relativePath) => {
            if (err) {
                return this.return(err);
            }

            let mountDossierIn = (parentDossier) => {

                let mountPoint = `${path.replace(relativePath, '')}/${dossierName}`;
                if (!mountPoint.startsWith("/")) {
                    mountPoint = "/" + mountPoint;
                }
                parentDossier.mount(mountPoint, keySSI, (err) => {
                    if (err) {
                        return this.return(err)
                    }
                    this.return(undefined, keySSI);
                });
            }

            //make sure if is the case to work with the current rawDossier instance
            rawDossier.getKeySSI((err, keySSI) => {
                if (err) {
                    return this.return(err);
                }

                if (parentKeySSI !== keySSI) {
                    return EDFS.resolveSSI(parentKeySSI, "RawDossier", (err, parentRawDossier) => {
                        if (err) {
                            return this.return(err);
                        }
                        mountDossierIn(parentRawDossier);
                    });
                }
                mountDossierIn(rawDossier);
            });
        });
    }
});

$$.swarms.describe('add', {
    folder: function (path, folderName) {
        if (rawDossier) {
            const folderPath = `${path}/${folderName}`;

            rawDossier.addFolder(folderPath, folderPath, {ignoreMounts: false}, (err, res) => {
                console.log(folderPath, folderPath, err, res);
                if (!err) {
                    this.return(err, res);
                }
            });
        }

        this.return(new Error("Raw Dossier is not available."));
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
    getMountedDossier: function (path) {
        commons.getParentDossier(rawDossier, path, (err, parentKeySSI, relativePath) => {
            if (err) {
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