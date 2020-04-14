import {
  DELETE_ITEMS_PLACEHOLDER,
  FILE_DOSSIER_MODAL_TOGGLE_EVENT_NAME,
  DEFAULT_ICON_COLOR,
} from "../utils/constants.js";

const rightMenu = {
  dotsMenu: {
    icon: "ellipsis-v",
    iconColor: DEFAULT_ICON_COLOR,
    classes: "dots-menu",
  },
  menuActions: [
    {
      label: "Move",
      eventName: FILE_DOSSIER_MODAL_TOGGLE_EVENT_NAME,
      eventData: '{ "modalName": "move-dossier", "getList": "true" }',
      buttonClass: "btn-menu",
    },
    {
      label: "Rename",
      eventName: FILE_DOSSIER_MODAL_TOGGLE_EVENT_NAME,
      eventData: '{ "modalName": "rename-dossier", "getList": "true" }',
      buttonClass: "btn-menu",
    },
  ],
  viewIcon: {
    icon: "eye",
    iconColor: DEFAULT_ICON_COLOR,
    iconClass: "right-menu",
    eventData: '{ "modalName": "view-dossier", "getList": "true" }',
    eventName: FILE_DOSSIER_MODAL_TOGGLE_EVENT_NAME,
    buttonClass: "no-btn",
  },
  exportIcon: {
    icon: "download",
    iconColor: DEFAULT_ICON_COLOR,
    iconClass: "right-menu",
    eventData: '{ "modalName": "export-dossier", "getList": "true" }',
    eventName: FILE_DOSSIER_MODAL_TOGGLE_EVENT_NAME,
    buttonClass: "no-btn",
  },
  shareIcon: {
    icon: "share",
    iconColor: DEFAULT_ICON_COLOR,
    iconClass: "right-menu",
    eventData: '{ "modalName": "share-dossier", "getList": "true" }',
    eventName: FILE_DOSSIER_MODAL_TOGGLE_EVENT_NAME,
    buttonClass: "no-btn",
  },
  deleteIcon: {
    icon: "trash",
    iconColor: DEFAULT_ICON_COLOR,
    iconClass: "right-menu",
    eventData: '{ "modalName": "delete-dossier", "getList": "true" }',
    eventName: FILE_DOSSIER_MODAL_TOGGLE_EVENT_NAME,
    buttonClass: "no-btn",
  },
};

const basePagesPath = "http://localhost:8000/pages/";

const pageLoader = {
  walletGridContent: `${basePagesPath}Wallet/wallet-content-grid.html`,
  walletListContent: `${basePagesPath}Wallet/wallet-content-list.html`,
  leftMenu: `${basePagesPath}Wallet/left-menu.html`,
  rightMenu: `${basePagesPath}Wallet/right-menu.html`,
  switchLayout: `${basePagesPath}Wallet/switch-layout.html`,
  signOut: `${basePagesPath}Wallet/sign-out.html`,
  // signOutModal: `${basePagesPath}Wallet/modals/sign-out-modal.html`,
  fileDossierModals: `${basePagesPath}Wallet/modals/file-dossier-modals.html`,
  createDossierModal: `${basePagesPath}Wallet/modals/new-dossier-modal.html`,
  importDossierModal: `${basePagesPath}Wallet/modals/import-dossier-modal.html`,
  receiveDossierModal: `${basePagesPath}Wallet/modals/receive-dossier-modal.html`,
  shareDossierModal: `${basePagesPath}Wallet/modals/share-dossier-modal.html`,
  deleteItemsModal: `${basePagesPath}Wallet/modals/delete-selected-items-modal.html`,
  renameDossierModal: `${basePagesPath}Wallet/modals/rename-dossier-modal.html`,
};

export const rootModel = {
  pageLoader: { ...pageLoader },

  isGridLayout: true,
  sectionTitle: "Dashboard",
  signOutLabel: "Exit",
  modals: {},
  dossierContent: {
    homeLabel: "My Wallet",
    currentPath: "/",
    sizeLabel: "Size",
    typeLabel: "Type",
    lastModifiedLabel: "Last modification",
    nameLabel: "Name",
    runAppLabel: "Run",
    noItemsLabel:
      "There are no items in the current folder/dossier. You can add some by using the Add button.",
  },
  addMenuLabels: {
    addLabel: "Add",
    addFileLabel: "Add file",
    addFolderLabel: "Add folder",
    createDossierLabel: "Create Dossier",
    importDossierLabel: "Import Dossier",
    receiveDossierLabel: "Receive Dossier",
  },
  hoverLabels: {
    switchGridHover: "Click to switch to list",
    switchListHover: "Click to switch to grid",
  },
};
