import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";

const rootModel = {
    pageTitle: "E-wallet",
    labels: {

    },
    name: {
        label: "Name",
        name: 'name',
        required: false,
        placeholder: 'Application name ...',
        value: ''
    },
    description: {
        label: "Description",
        name: 'description',
        required: false,
        placeholder: 'Application description ...',
        value: ''
    },
    seed: {
        label: "Seed",
        name: 'seed',
        required: false,
        placeholder: 'Application seed ...',
        value: ''
    },
    image: '',
    fileChooserLabel: 'Select image...',
    contentLabels: {
        myWalletLabel: "Submit App"
    }
};

export default class SubmitApplicationController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        this.model = this.setModel(this._getCleanProxyObject(rootModel));

        this._initNavigationLinks();
        this._initListeners();
    }

    _initListeners = () => {
        this.on('openFeedback', (evt) => {
            this.feedbackEmitter = evt.detail;
        });

       // this.on('import-image', this._handleFileFolderUpload);
    };

    _handleAppManager = (event) => {
        console.log("Pressed", event.data);
    }

    _initNavigationLinks = () => {
        let wDir = this.model.currentPath || '/';
        let links = [{
            label: this.model.contentLabels.myWalletLabel,
            path: '/',
            disabled: false
        }];

        // If the current path is root
        if (wDir === '/') {
            links[0].disabled = true;
            this.model.setChainValue('navigationLinks', links);
            return;
        }

        // If anything, but root
        let paths = wDir.split('/');
        // pop out first element as it is the root and create below the My Wallet(Home / Root) Link
        paths.shift();

        paths.forEach((pathSegment) => {
            let path = links[links.length - 1].path;
            if (path === '/') {
                path = `/${pathSegment}`;
            } else {
                path = `${path}/${pathSegment}`;
            }

            links.push({
                label: pathSegment,
                path: path,
                disabled: false
            });
        });

        // Disable the last link as it is the current directory in navigation
        links[links.length - 1].disabled = true;

        // Set the navigation links to view-model
        this.model.setChainValue('navigationLinks', links);
    }

    _handleFileFolderUpload = (event) => {
        event.stopImmediatePropagation();
        //
        // let filesArray = event.data || [];
        // if (!filesArray.length) {
        //     return this.feedbackEmitter(this.model.error.labels.noFileUploaded, null, Constants.ERROR_FEEDBACK_TYPE);
        // }
        //
        // let wDir = this.model.currentPath || '/';
        //
        // this.model.setChainValue('image', wDir);

        // Open the ui-loader
        // this.feedbackController.setLoadingState(true);
        // this.DSUStorage.uploadMultipleFiles(wDir, filesArray, { preventOverwrite: true }, (err, filesUploaded) => {
        //     if (err) {
        //         filesUploaded = err.data;
        //     }
        //
        //     if (!Array.isArray(filesUploaded)) {
        //         filesUploaded = [filesUploaded];
        //     }
        //     filesUploaded.forEach((entry) => {
        //         let name, path, messageTemplate, messageType;
        //
        //         if (entry.error) {
        //             path = entry.file.path;
        //             if (entry.error.code === 30) {
        //                 messageTemplate = this.model[Constants.SUCCESS].fileUploadExists;
        //                 messageType = Constants.ERROR_FEEDBACK_TYPE;
        //             } else {
        //                 messageTemplate = this.model[Constants.SUCCESS].fileUploaded;
        //                 messageType = Constants.SUCCESS_FEEDBACK_TYPE;
        //             }
        //         } else {
        //             path = entry;
        //             messageTemplate = this.model[Constants.SUCCESS].fileUploaded;
        //             messageType = Constants.SUCCESS_FEEDBACK_TYPE;
        //         }
        //
        //         name = path.split('/').pop();
        //         let displayedMessage = messageTemplate
        //             .replace(Constants.NAME_PLACEHOLDER, name)
        //             .replace(Constants.PATH_PLACEHOLDER, path);
        //         this.feedbackEmitter(displayedMessage, null, messageType);
        //     });
        //
        //     // Close the ui-loader as upload is finished
        //     this.feedbackController.setLoadingState(false);
        //     this.explorerNavigator.listWalletContent();
        // })
    };

    _getCleanProxyObject = (obj) => {
        return obj ? JSON.parse(JSON.stringify(obj)) : null;
    }
}