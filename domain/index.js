console.log("Loaded from domain.js");
const EDFS_ENDPOINT = "http://localhost:8080";
const EDFS = require("edfs");
const edfs = EDFS.attachToEndpoint(EDFS_ENDPOINT);

const commons = require('./commons');

$$.swarms.describe('readDir', {
    readDir: function(path, options) {
        if (rawDossier) {
            return rawDossier.readDir(path, options, this.return);
        }

        this.return(new Error("Raw Dossier is not available."));
    },
    start: function(path, options) {
        if (rawDossier) {
            return rawDossier.readDir(path, options, (err, content) => {
                if (err) {
                    return this.return(err);
                }

                this.path = path === '/' ? '' : path;
                this.content = content;
                this.checkForApplications();
            });
        }

        this.return(new Error("Raw Dossier is not available."));
    },
    checkForApplications: function() {
        const mounts = this.content.mounts;
        const mountsLength = mounts.length;
        if (!mountsLength) {
            return this.return(undefined, this.content);
        }

        mounts.forEach((mount, index) => {
            rawDossier.readDir(`${this.path}/${mount}`, { withFileTypes: true }, (err, mountContent) => {
                if (err) {
                    return this.return(err);
                }

                const folders = mountContent.folders;
                if (!folders || !folders.length) {
                    this.content.mounts[index] = {
                        name: mount,
                        isApplication: false
                    };

                    if (mountsLength === index + 1) {
                        this.return(undefined, this.content);
                    }
                } else {
                    const hasAppFolder = folders.findIndex((fName) => fName === "app") !== -1;
                    if (!hasAppFolder) {
                        this.checkForCodeHTML(mount, index, mountsLength);
                    } else {
                        this.content.mounts[index] = {
                            name: mount,
                            isApplication: hasAppFolder
                        };

                        if (mountsLength === index + 1) {
                            this.return(undefined, this.content);
                        }
                    }
                }
            });
        });
    },
    checkForCodeHTML: function(mount, index, mountsLength) {
        rawDossier.readDir(`${this.path}/${mount}/code`, { withFileTypes: true }, (err, codeContent) => {
            if (err) {
                return this.return(err);
            }

            const files = codeContent.files;
            if (!files || !files.length) {
                this.content.mounts[index] = {
                    name: mount,
                    isApplication: false
                };
            } else {
                const hasIndexHtml = files.findIndex((fName) => fName === 'index.html') !== -1;
                this.content.mounts[index] = {
                    name: mount,
                    isApplication: hasIndexHtml
                };
            }

            if (mountsLength === index + 1) {
                this.return(undefined, this.content);
            }
        });
    }
});

$$.swarms.describe('move', {
    start: function(oldPath, newPath) {
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
    newDossier: function(path, dossierName) {
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
    fromSeed: function(path, dossierName, SEED) {
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
    fileFolder: function(path) {
        if (rawDossier) {
            return rawDossier.delete(path, this.return);
        }

        this.return(new Error("Raw Dossier is not available."))
    },
    dossier: function(path) {
        if (rawDossier) {
            return rawDossier.unmount(path, this.return);
        }

        this.return(new Error("Raw Dossier is not available."))
    }
});

$$.swarms.describe('listDossiers', {
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