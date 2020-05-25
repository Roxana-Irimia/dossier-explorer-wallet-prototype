const getParentDossier = function (rawDossier, path, callback) {
    if (path === '' || path === '/') {
        return callback(undefined);
    }

    let paths = path.split('/');
    let wDir = paths.pop();
    let remainingPath = paths.join('/');

    rawDossier.listMountedDossiers(remainingPath, (err, mountPoints) => {
        if (err) {
            console.error(err);
            return callback(err);
        }

        let dossier = mountPoints.find((dsr) => {
            return dsr.path === wDir || dsr.path.indexOf(wDir) !== -1;
        });

        if (!dossier) {
            return getParentDossier(rawDossier, remainingPath, callback);
        }

        callback(undefined, dossier.identifier, `${remainingPath}/${wDir}`);
    });
};

const createNewDossier = function (callback) {
    edfs.createRawDossier((err, newDossier) => {
        if (err) {
            console.error(err);
            return callback(err);
        }

        newDossier.writeFile('/manifest', `{"mounts":{}}`, (err, digest) => {
            if (err) {
                console.error(err);
                return callback(err);
            }

            callback(undefined, newDossier);
        });
    });
}

const mountDossier = function (rawDossier, mountPoint, seed) {
    rawDossier.mount(mountPoint, seed, (err) => {
        if (err) {
            console.error(err);
            return this.return(err);
        }

        this.return(undefined, seed);
    });
}

module.exports = {
    createNewDossier,
    mountDossier,
    getParentDossier
};