import Commons from "./Commons.js";

export default class FileDownloader {
    constructor(path, fileName) {
        this.path = path;
        this.fileName = fileName;

        if (this.path === '/') {
            this.path = '';
        }
    }

    downloadFile() {
        Commons.fetchFile(this.path, this.fileName, (blob) => {
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                const file = new File([blob], this.fileName);
                window.navigator.msSaveOrOpenBlob(file);
                return;
            }

            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = this.fileName;
            link.click();
        });
    }
}