import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import {
    getDossierServiceInstance
} from "../service/DossierExplorerService.js";
import FeedbackController from "./FeedbackController.js";
import DateFormat from "./libs/DateFormat.js";

import walletContentViewModel from '../view-models/walletContentViewModel.js';

export default class ExplorerNavigatorController extends ContainerController {
    constructor(element, model) {
        super(element);

        this.model = model;
        this.dossierService = getDossierServiceInstance();
        this.feedbackController = new FeedbackController(this.model);

        this.listWalletContent();
        this._initNavigationLinks();
        this._initListeners();
    }

    listWalletContent = () => {
        let wDir = this.model.currentPath || '/';
        this.dossierService.readDir(wDir, {
            withFileTypes: true
        }, this._updateWalletContent);
    }

    changeDirectoryHandler = (event) => {
        event.stopImmediatePropagation();

        let path = event.data || '/';
        this.model.setChainValue('currentPath', path);
    };

    selectWalletItemHandler = (event) => {
        event.stopImmediatePropagation();

        let selectedItem = event.data || null;
        if (!selectedItem) {
            console.error('An item was not clicked!');
            return;
        }

        let selectedItemViewModel = this.model.content.find((el) => el.name === selectedItem);
        if (!selectedItemViewModel) {
            console.error('The clicked item is not in the view-model!');
            return;
        }

        // Reset the last selected item(if any), as for the moment we support only single selection
        this._resetLastSelected(selectedItemViewModel.name);

        let isSelected = selectedItemViewModel.selected === 'selected';
        if (isSelected) {
            selectedItemViewModel.selected = '';
            this.model.setChainValue('selectedItem', {
                selected: false,
                item: {}
            });
        } else {
            selectedItemViewModel.selected = 'selected';
            let item = {
                ...selectedItemViewModel,
                currentPath: this.model.currentPath,
                isFile: selectedItemViewModel.type === 'file',
                isFolder: selectedItemViewModel.type === 'folder',
                isDossier: selectedItemViewModel.type === 'dossier',
                isApplication: selectedItemViewModel.isApplication
            };

            this.model.setChainValue('selectedItem', {
                selected: true,
                item: JSON.parse(JSON.stringify(item))
            });
        }
    };

    doubleClickHandler = (event) => {
        event.stopImmediatePropagation();

        let clickedItem = event.data;
        if (!clickedItem) {
            console.error(`Clicked item is not valid!`, event);
            return;
        }

        let clickedItemViewModel = this.model.content.find((el) => el.name === clickedItem);
        if (!clickedItemViewModel) {
            console.error(`Clicked item is not present in the model!`);
            return;
        }

        switch (clickedItemViewModel.type) {
            case 'file': {
                clickedItemViewModel.currentPath = this.model.currentPath || '/';
                this.openViewFileModal(clickedItemViewModel);
                break;
            }
            case 'app': {
                // handle double-click or click+enter to run the applicaion
                break;
            }
            case 'folder':
            case 'dossier': {
                let wDir = this.model.currentPath || '/';
                let newWorkingDirectory = wDir === '/' ?
                    `${wDir}${clickedItem}` :
                    `${wDir}/${clickedItem}`;
                this.model.setChainValue('currentPath', newWorkingDirectory);
            }
            default:
                break;
        }
    };

    sortWorkingDirectoryHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        let propertyName = event.data;
        if (!propertyName) {
            console.error(`Sort is not possible. The property name is not ok. Provided: ${propertyName}`);
            return;
        }

        let sortTypeViewModel = this.model.sortedTypes[propertyName];

        if (!sortTypeViewModel) {
            console.error(`Sort is not possible. The property name is not ok. Provided: ${propertyName}`);
            return;
        }

        const reverseSorting = sortTypeViewModel.isSorted && !sortTypeViewModel.descending;
        const content = JSON.parse(JSON.stringify(this.model.content));

        let newContent = [];
        ["dossier", "folder", "file"].forEach((type) => {
            let sortedContent = content.filter(el => el.type === type);
            sortedContent = this._sortByProperty(sortedContent, propertyName, reverseSorting);

            newContent = [...newContent, ...sortedContent];
        });

        /**
         * Reset the view model for sorted types and conditionals and update according to the requested sort option
         */
        let sortedTypesViewModel = JSON.parse(JSON.stringify(walletContentViewModel.defaultSortedViewModel));
        sortedTypesViewModel[propertyName].isSorted = true;
        sortedTypesViewModel[propertyName].descending = reverseSorting;

        this.model.setChainValue('content', newContent);
        this.model.setChainValue('sortedTypes', sortedTypesViewModel);
    }

    openViewFileModal = (viewModel) => {
        let path = viewModel.currentPath || '/';
        if (path === '/') {
            path = '';
        }

        viewModel.title = `${path}/${viewModel.name}`;
        viewModel.path = path;
        this.showModal('viewAsset', viewModel, (err, response) => {
            console.log(err, response);
        });
    }

    /* ############################## INTERNAL METHODS ############################## */

    _initListeners = () => {
        this.on('select-wallet-item', this.selectWalletItemHandler);
        this.on('double-click-item', this.doubleClickHandler);
        this.on('change-directory', this.changeDirectoryHandler);
        this.on('sort-working-directory', this.sortWorkingDirectoryHandler);

        /**
         * Model chain change watchers
         */
        this.model.onChange('currentPath', () => {
            this.listWalletContent();
            this._initNavigationLinks();
        });
    };

    _initNavigationLinks = () => {
        let wDir = this.model.currentPath || '/';
        let links = [{
            label: this.model.myWalletLabel,
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

    _resetLastSelected = (lastSelectedName) => {
        let previouslySelected = this.model.content.find((item) => {
            return item.selected === 'selected' &&
                (lastSelectedName && item.name !== lastSelectedName);
        });
        if (previouslySelected) {
            previouslySelected.selected = '';
            this.model.setChainValue('selectedItem', {
                selected: false,
                item: {}
            });
        }
    }

    _updateWalletContent = (err, dirContent) => {
        let newContent = [];

        if (err) {
            this.feedbackController.updateErrorMessage(err);
            this.model.setChainValue('content', newContent);
            return;
        }

        /** Add dossiers to content model */
        if (dirContent.mounts && dirContent.mounts.length) {
            newContent = this._updateContentForType(newContent,
                dirContent.mounts,
                walletContentViewModel.defaultDossierAttributes);
        }

        /** Add folders to content model */
        if (dirContent.folders && dirContent.folders.length) {
            newContent = this._updateContentForType(newContent,
                dirContent.folders,
                walletContentViewModel.defaultFolderAttributes);
        }

        /** Add files to content model */
        if (dirContent.files && dirContent.files.length) {
            newContent = this._updateContentForType(newContent,
                dirContent.files,
                walletContentViewModel.defaultFileAttributes);
        }

        this.model.setChainValue('content', newContent);
    }

    /**
     * TODO:
     * To be removed after edfs provides the last modified attribute
     */
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    _updateContentForType = (fullContentList, contentToAppend, defaultViewModel) => {
        let mappedContentToAppend = contentToAppend.filter(el => !!el)
            .map(el => {
                let name = el.trim();
                if (name.length && name.charAt(0) === '/') {
                    name = name.replace('/', '');
                }

                let viewModelObject = {
                    ...defaultViewModel,
                    name: name
                };

                const lastModified = this.getRandomInt(1590000000000, new Date().getTime());
                const dateFormat = new DateFormat(lastModified, this.model.dateFormatOptions);
                viewModelObject.lastModifiedTimestamp = lastModified;
                viewModelObject.fullDateHover = dateFormat.getFullDateString();
                viewModelObject.lastModified = dateFormat.isInLastDay() ?
                    dateFormat.getFormattedTime() : dateFormat.getFormattedDate();

                return viewModelObject;
            });

        mappedContentToAppend = this._sortByProperty(mappedContentToAppend, 'name');
        let sortedTypesViewModel = JSON.parse(JSON.stringify(walletContentViewModel.defaultSortedViewModel));;
        sortedTypesViewModel.name.isSorted = true;
        this.model.setChainValue('sortedTypes', sortedTypesViewModel);

        mappedContentToAppend.forEach(el => {
            fullContentList.push(el);
        });

        return fullContentList;
    }

    _sortByProperty = (arr, pName, reverse) => {
        switch (pName) {
            case 'name': {
                arr = arr.sort((a, b) => a.name.localeCompare(b.name));
                break;
            }
            case 'lastModified': {
                arr = arr.sort((a, b) => a.lastModifiedTimestamp - b.lastModifiedTimestamp);
                break;
            }
            default: {
                break;
            }
        }

        if (reverse) {
            arr = arr.reverse();
        }

        return arr;
    }

}