export default class FileUploader {

    constructor(wDir, filesArray) {
        this.wDir = wDir;
        this.filesArray = filesArray;
    }

    startUpload(callback) {
        const formData = new FormData();
        for (const f of this.filesArray) {
            // Use array notation in the key to indicate multiple files
            formData.append('files[]', f);
        }

        let folderName = this.filesArray[0].webkitRelativePath.replace(`/${this.filesArray[0].name}`, '');
        const url = `/upload?path=${this.wDir}&input=files[]&preventOverwrite=true&filename=${folderName}`;
        fetch(url, {
                method: "POST",
                body: formData
            })
            .then(this._getResponseJSON)
            .then((responseJSON) => {
                this._parseResultJSON(responseJSON, callback);
            })
            .catch((err) => {
                callback(err);
            });
    }

    _getResponseJSON = (response) => {
        // More validations needed for error cases
        if (response.ok) {
            console.log('Upload OK!');
        } else {
            console.log('Upload FAILED!');
        }
        return response.json();
    }

    /**
     * This method will be responsable with parsing the result for each uploaded file 
     * and to create proper object which will be passed to feedback-ui component
     * @param {object} responseJSON
     * @param {Function} callback
     */
    _parseResultJSON = (responseJSON, callback) => {
        let errorMessages = null;

        callback(errorMessages, responseJSON);
    }

}