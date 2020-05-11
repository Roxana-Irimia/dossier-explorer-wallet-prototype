import Commons from "./Commons.js";

export default class FileDownloader {

    constructor(path, fileName) {
        this.path = path;
        this.fileName = fileName;

        if (this.path === '/') {
            this.path = '';
        }
    }

    downloadFile(callback) {
        if (!callback || typeof callback !== 'function') {
            callback = this._defaultDownloadCallback;
        }

        Commons.fetchFile(this.path, this.fileName, callback);
    }

    _defaultDownloadCallback = (downloadedFile) => {
        window.URL = window.URL || window.webkitURL;
        let blob = downloadedFile.rawBlob;

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            const file = new File([blob], this.fileName);
            window.navigator.msSaveOrOpenBlob(file);
            return;
        }

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = this.fileName;
        link.click();
    }
}