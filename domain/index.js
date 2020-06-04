console.log("Loaded from domain.js");
const EDFS_ENDPOINT = "http://localhost:8080";
const EDFS = require("edfs");
const edfs = EDFS.attachToEndpoint(EDFS_ENDPOINT);

const commons = require('./commons');

//Refactor: Create constants file
const WITH_FILE_TYPES = { withFileTypes: true };

$$.swarms.describe('readDir', {
    readDir: function (path, options) {
        if (rawDossier) {
            return rawDossier.readDir(path, options, this.return);
        }

        this.return(new Error("Raw Dossier is not available."));
    },
    start: function (path) {
        if (rawDossier) {
            return rawDossier.readDir(path, WITH_FILE_TYPES, (err, content) => {
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
            (numberOfMounts === 1 && mounts[0] === 'code')) {
            return this.return(undefined, this.content);
        }

        mounts.forEach((mount, index) => {
            if (mount !== 'code') {
                this.checkForAppFolder(mount, index, numberOfMounts);
            }
        });
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
    checkForAppFolder: function (mountPoint, index, numberOfMounts) {
        const wDir = `${this.path}/${mountPoint}`;
        rawDossier.readDir(wDir, WITH_FILE_TYPES, (err, mountPointContent) => {
            if (err) {
                return this.return(err);
            }

            const { folders, mounts } = mountPointContent;
            if (!folders || !folders.length) {
                const hasCodeFolder = mounts.findIndex(mPoint => mPoint === 'code') !== -1;
                if (hasCodeFolder) {
                    return this.checkForCode(mountPoint, index, numberOfMounts);
                }

                if (numberOfMounts === index + 1) {
                    this.updateMountsList();
                }

                return;
            }

            const hasAppFolder = folders.findIndex((fName) => fName === "app") !== -1;
            if (!hasAppFolder) {
                return this.checkForCode(mountPoint, index, numberOfMounts);
            }

            this.content.applications.push(this.content.mounts[index]);

            if (numberOfMounts === index + 1) {
                this.updateMountsList();
            }

        });
    },
    checkForCode: function (mountPoint, index, numberOfMounts) {
        const wDir = `${this.path}/${mountPoint}`;
        rawDossier.readDir(`${wDir}/code`, WITH_FILE_TYPES, (err, codeContent) => {
            if (err) {
                return this.return(err);
            }

            const { files, folders } = codeContent;
            if (!files || !files.length) {
                this.content.mounts[index] = {
                    name: this.content.mounts[index],
                    isApplication: false
                };

                return;
            }

            const hasIndexHtml = files.findIndex((fName) => fName === 'index.html') !== -1;
            if (!hasIndexHtml) {
                const hasAppFolder = folders.findIndex((fName) => fName === 'app') !== -1;
                if (hasAppFolder) {
                    this.path = wDir;
                    return this.checkForAppFolder('code', index, numberOfMounts);
                }
            }

            this.content.applications.push(this.content.mounts[index]);

            if (numberOfMounts === index + 1) {
                this.updateMountsList();
            }
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