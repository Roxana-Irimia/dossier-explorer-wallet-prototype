console.log("Loaded from domain.js");
const commons = require('./commons');
const constants = require('./constants');

const MARKETPLACE_APP_SEED = `/web-wallet/apps/psk-marketplace-ssapp/seed`;
const CODE_FOLDER = "/code";
const INSTALLED_APPLICATIONS_MOUNTING_PATH = "/my-apps";
const IN_REVIEW_APPLICATIONS_MOUNTING_PATH = "/appsInReview";
const AVAILABLE_APPLICATIONS_MOUNTING_PATH = "/availableApps";
const MARKETPLACES_MOUNTING_PATH = "/marketplaces";

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

$$.BDNS.addConfig("default", {
    endpoints: [
        {
            endpoint: "http://localhost:8080",
            type: 'brickStorage'
        },
        {
            endpoint: "http://localhost:8080",
            type: 'anchorService'
        }
    ]
})

$$.swarms.describe('applicationsSwarm', {
    start: function (data) {
        if (rawDossier) {
            return this.createApplicationsDossier(data);
        }
        this.return(new Error("Raw Dossier is not available."));
    },

    __createMarketplaceDossier: function (data, callback) {
        EDFS.createDSU("RawDossier", (err, newDossier) => {
            if (err) {
                console.error(err);
                return callback(err);
            }
            newDossier.writeFile('/manifest', `{"mounts":{}}`, (err, digest) => {
                if (err) {
                    console.error(err);
                    return callback(err);
                }

                newDossier.getKeySSI((err, keySSI) => {
                    if (err) {
                        return callback(err);
                    }
                    data.keySSI = keySSI;
                    newDossier.writeFile('/data', JSON.stringify(data), (err, digest) => {
                        if (err) {
                            console.error(err);
                            return callback(err);
                        }

                        fetch(MARKETPLACE_APP_SEED)
                            .then(response => response.text())
                            .then(seed => {
                                newDossier.mount(CODE_FOLDER, seed, (err) => {
                                    if (err) {
                                        return callback(err);
                                    }
                                    callback(err, keySSI);
                                })
                            });
                    });
                });
            });
        });
    },

    createMarketplaceDossier: function (data) {
        this.__createMarketplaceDossier(data, (err, keySSI) => {
            if (err) {
                console.error(err);
                return this.return(err);
            }
            this.mountDossier(rawDossier, MARKETPLACES_MOUNTING_PATH, keySSI);
        })
    },

    importMarketplace: function (keySSI) {
        this.mountDossier(rawDossier, MARKETPLACES_MOUNTING_PATH, keySSI);
    },

    listMarketplaces: function () {
        this.__listMarketplaces(MARKETPLACES_MOUNTING_PATH, (err, data) => {
            if (err) {
                return this.return(err);
            }
            this.return(err, data);
        });
    },

    __listMarketplaces: function (PATH, callback) {
        if (!rawDossier) {
            this.return(new Error("Raw Dossier is not available."));
        }
        rawDossier.readDir(PATH, (err, marketplaces) => {
            if (err) {
                return callback(err);
            }
            let toBeReturned = [];

            let getMarketplaceData = (marketplace) => {
                let appPath = PATH + '/' + marketplace.path;
                rawDossier.readFile(appPath + '/data', (err, fileContent) => {
                    toBeReturned.push({
                        ...JSON.parse(fileContent),
                        path: appPath,
                        identifier: marketplace.identifier
                    });
                    if (marketplaces.length > 0) {
                        getMarketplaceData(marketplaces.shift())
                    } else {
                        return callback(undefined, toBeReturned);
                    }
                });
            };
            if (marketplaces.length > 0) {
                return getMarketplaceData(marketplaces.shift());
            }
            return callback(undefined, toBeReturned);
        })
    },


    removeMarketplace: function (marketplaceData) {
        rawDossier.unmount(marketplaceData.path, (err, data) => {
            if (err) {
                return this.return(err);
            }
            return this.return(err, data);
        });
    },

    mountDossier: function (parentDossier, mountingPath, seed) {
        const PskCrypto = require("pskcrypto");
        const hexDigest = PskCrypto.pskHash(seed, "hex");
        let path = `${mountingPath}/${hexDigest}`;
        parentDossier.mount(path, seed, (err) => {
            if (err) {
                console.error(err);
                return this.return(err);
            }
            this.return(undefined, {path: path, seed: seed});
        });
    }
});