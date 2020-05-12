import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";
import FileDownloader from "./FileDownloader.js";

export default class ViewFileController extends ModalController {
    constructor(element) {
        super(element);

        this.fileName = this.model.name;
        this.path = this.model.path;

        this._downloadFile();
    }

    _downloadFile = () => {
        let fileDownloader = new FileDownloader(this.path, this.fileName);
        fileDownloader.downloadFile((downloadedFile) => {
            this.rawBlob = downloadedFile.rawBlob;
            this.mimeType = downloadedFile.contentType;
            this.blob = new Blob([this.rawBlob], {
                type: this.mimeType
            });

            this._initFile();
        });
    }

    _displayFile = () => {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            const file = new File([this.rawBlob], this.fileName);
            window.navigator.msSaveOrOpenBlob(file);
            return;
        }

        window.URL = window.URL || window.webkitURL;
        const fileType = this.mimeType.split('/')[0];
        switch (fileType) {
            case 'image': {
                this._loadImageFile();
                break;
            }
            case 'audio':
            case 'video': {
                this._loadAudioVideoFile(fileType);
                break;
            }
            default: {
                this._loadOtherFile();
                break;
            }
        }


    }

    _loadBlob = (callback) => {
        const reader = new FileReader();
        reader.readAsDataURL(this.blob);
        reader.onloadend = function () {
            callback(reader.result);
        }
    }

    _loadImageFile = () => {
        this._loadBlob((base64Blob) => {
            const img = document.createElement('img');
            img.src = base64Blob;
            img.alt = this.path;

            this._appendAsset(img);
        });
    }

    _loadAudioVideoFile = (fileType) => {
        this._loadBlob((base64Blob) => {
            const elm = document.createElement(fileType),
                source = document.createElement('source');
            source.type = this.mimeType;
            source.src = base64Blob;
            elm.append(source);
            elm.controls = 'true';

            this._appendAsset(elm);
        });
    }

    _loadOtherFile = () => {
        this._loadBlob((base64Blob) => {
            const obj = document.createElement('object');
            obj.width = '100%';
            obj.height = '100%';
            obj.type = this.mimeType;
            obj.data = base64Blob;

            this._appendAsset(obj);
        });
    }

    _appendAsset = (assetObject) => {
        let assetContent = this.element.querySelector('.asset-content');
        if (assetContent) {
            assetContent.append(assetObject);
        }
    }
}