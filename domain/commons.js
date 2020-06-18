const isSubPath = function (path, subPath) {
    if (path !== '/') {
        path = `${path}/`;
    }

    return path.indexOf(`/${subPath}/`) !== -1;
}

const getParentDossier = function (rawDossier, path, callback) {
    if (path === '' || path === '/') {
        return callback(undefined, rawDossier.getSeed(), "/");
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
            return dsr.path === wDir || isSubPath(path, dsr.path);
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

const mountDossier = function (rawDossier, mountPoint, seed, callback) {
    rawDossier.mount(mountPoint, seed, (err) => {
        if (err) {
            return callback(err)
        }
        callback(undefined, seed);
    });
}

module.exports = {
    createNewDossier,
    mountDossier,
    getParentDossier
};
