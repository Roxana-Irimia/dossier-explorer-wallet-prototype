import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";

const applications = [
    {
        name: "Application Name",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        image: "../../assets/images/dossier-explorer.png"
    },
    {
        name: "Application Name",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        image: "../../assets/images/cat.jpg"
    },
    {
        name: "Application Name",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        image: "../../assets/images/dossier-explorer.png"
    },
    {
        name: "Application Name",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        image: "../../assets/images/cat.jpg"
    }
];

const rootModel = {
    pageLoader: {
        walletContent: `/pages/Wallet/marketplace-content.html`
    },
    content: [],
    applications: [],
    pageTitle: "E-wallet",
    conditionalExpressions: {
        isLoading: false,
        isGridLayout: false,
    },
    hoverLabels: {
        switchGridHover: "Click to switch to list",
        switchListHover: "Click to switch to grid",
    },

    searchBox: {
        name: 'searchBar',
        required: false,
        placeholder: 'Search for an app',
        value: ''
    },
    contentLabels: {
        noItemsLabel: "There are no applications.",
        myWalletLabel: "Markeplace"
    }
};

export default class MarketplaceController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        this.model = this.setModel(this._getCleanProxyObject(rootModel));

        this.model.setChainValue('content', applications);
        this.model.setChainValue('applications', applications);
        this._initNavigationLinks();
        this._initListeners();
    }

    _initListeners = () => {
        this.on('openFeedback', (evt) => {
            this.feedbackEmitter = evt.detail;
        });

        this.on("switch-layout", this._handleSwitchLayout);
        this.on("marketplace-application-manager-on-click", this._handleAppManager);

        this.model.onChange('currentPath', () => {
            this._initNavigationLinks();
        });

        this.model.onChange('searchBox', () => {
            this._handleSearchChange();
        });
    };

    _handleAppManager = (event) => {
        console.log("Pressed", event.data);
    }

    _handleSwitchLayout = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        this.model.isGridLayout = !this.model.isGridLayout;
    };

    _handleSearchChange = () => {
        let searchTerm = this.model.searchBox.value.toLowerCase();
        let matchedApps = this.model.applications.filter(app => this.__lowTextContainsLowTerm(app.name, searchTerm) || this.__lowTextContainsLowTerm(app.description, searchTerm))
        this.model.setChainValue('content', matchedApps);
    };

    __lowTextContainsLowTerm(lowText, lowTerm) {
        return lowText.toLowerCase().includes(lowTerm.toLowerCase());
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

    _getCleanProxyObject = (obj) => {
        return obj ? JSON.parse(JSON.stringify(obj)) : null;
    }
}