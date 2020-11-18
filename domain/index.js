console.log("Loaded from domain.js");
const commons = require('./commons');
const constants = require('./constants');

const MARKETPLACE_APP_MANIFEST = "/apps/psk-marketplace-ssapp/manifest";
const CODE_FOLDER = "/code";
const MARKETPLACES_MOUNTING_PATH = "/marketplaces";
const keyssiresolver = require("opendsu").loadApi("resolver");

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
        this.content.mounts = mounts.filter((mountPoint) => {
            let remove = false;
            applications.forEach((appName) => {
                remove = remove || appName === mountPoint;
            });

            return !remove;
        });

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

$$.swarms.describe('applicationsSwarm', {
    start: function (data) {
        if (rawDossier) {
            return this.createApplicationsDossier(data);
        }
        this.return(new Error("Raw Dossier is not available."));
    },

    __createMarketplaceDossier: function (data, callback) {
        const keyssiSpace = require("opendsu").loadApi("keyssi");
        rawDossier.getKeySSI((err, ssi) => {
            if (err) {
                return this.return(err);
            }
            const templateSSI = keyssiSpace.buildSeedSSI(keyssiSpace.parse(ssi).getDLDomain());
            keyssiresolver.createDSU(templateSSI, (err, newDossier) => {
                if (err) {
                    console.error(err);
                    this.return(err);
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

                        rawDossier.readFile(MARKETPLACE_APP_MANIFEST, (err, manifestData) => {
                            if (err) {
                                return callback(err);
                            }

                            try {
                                manifestData = JSON.parse(manifestData.toString());
                            } catch (e) {
                                console.error("[Manifest data parse error]", manifestData);
                                return callback(e);
                            }

                            let codeTemplateSSI = manifestData.mounts && manifestData.mounts["/code"];
                            if (!codeTemplateSSI) {
                                return callback(new Error("Template SSI not found for Marketplace SSApp!"), manifestData);
                            }

                            codeTemplateSSI = codeTemplateSSI.replace(/\s/g, "");
                            newDossier.mount(CODE_FOLDER, codeTemplateSSI, (err) => {
                                if (err) {
                                    return callback(err);
                                }
                                callback(err, keySSI);
                            });
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
            this.mountDossier(rawDossier, MARKETPLACES_MOUNTING_PATH, data.name, keySSI);
        })
    },

    importMarketplace: function (keySSI, name) {
        if(!name || !name.length) {
            const PskCrypto = require("pskcrypto");
            name = PskCrypto.pskHash(keySSI, "hex");
        }

        this.mountDossier(rawDossier, MARKETPLACES_MOUNTING_PATH, name, keySSI);
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

    mountDossier: function (parentDossier, mountingPath, dsuName, keySSI) {
        let path = `${mountingPath}/${dsuName}`;
        parentDossier.mount(path, keySSI, (err) => {
            if (err) {
                console.error(err);
                return this.return(err);
            }
            this.return(undefined, {path: path, seed: keySSI});
        });
    }
});