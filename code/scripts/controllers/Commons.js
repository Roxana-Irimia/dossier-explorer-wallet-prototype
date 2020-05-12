// Refactor:
export default class Commons {
    static DELETE_ITEMS_PLACEHOLDER = "[DELETE_ITEMS_PLACEHOLDER]";

    /**
     * This method updates the error message for a model.
     * The model has to include a proxified object named "error", with at least two fields: "hasError" and "errorMessage".
     * These view-model attributes will be updated and reflected back to UI.
     * @param {Proxy} model - the model to be updated
     * @param {string} error - the error message that will be set inside the error model
     */
    static updateErrorMessage(error, model) {
        if (!error) {
            // error cannot be null or undefied when it is assigned to a proxified object
            error = '';
        }

        model.setChainValue('error.hasError', error !== '');
        model.setChainValue('error.errorMessage', error);
    }

    static setLoadingState(model, loadingState = false) {
        model.setChainValue('conditionalExpressions.isLoading', loadingState);
    }

    // TBD: if needed or directly try to recover the dossier by seed and send the error if any
    static validateSeedForm(SEED) {
        // Validate seed according to specifications
        return true;
    }

    static getJsonResponseBody(response) {
        return response.json((result) => {
            return result;
        }).catch((err) => {
            return Promise.resolve({});
        });
    }

    static fetchFile(path, fileName, callback) {
        let url = `/download${path}/${fileName}`;
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    response.blob().then((blob) => {
                        callback({
                            contentType: response.headers.get('Content-Type') || '',
                            rawBlob: blob
                        });
                    });
                } else {
                    console.error(`Error on download file ${path}/${fileName}: `, response);
                }
            });
    }
}