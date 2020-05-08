export default class FileDownloader {
    constructor(path, fileName) {
        this.path = path;
        this.fileName = fileName;

        if (this.path === '/') {
            this.path = '';
        }
    }

    downloadFile() {
        this._fetchFile((blob) => {
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

    _fetchFile(callback) {
        let url = `/download${this.path}/${this.fileName}`;
        fetch(url)
            .then((response) => {
                console.log(response);
                return response.blob();
            })
            .then((blob) => {
                console.log(blob);
                callback(blob);
            });
    }
}