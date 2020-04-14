import {
  DELETE_ITEMS_PLACEHOLDER,
  FILE_DOSSIER_MODAL_TOGGLE_EVENT_NAME,
  DEFAULT_ICON_COLOR,
} from "../../scripts/utils/constants.js";

const createDossierModal = {
  title: "Create Dossier",
  createState: true,
  hasError: false,
  errorMessage: "",
  setNameInput: {
    label: "Name your new dossier",
    value: "",
  },
  seedInput: {
    label: "Dossier with the SEED below has been successfully created!",
    value: "ep8n5buype895ubye8netpmtu9rutepu9teertue58yuet7iy7tijht",
    readOnly: true,
  },
  setNameButton: {
    disabled: true,
    label: "Create Dossier",
    eventName: "name-new-dossier",
    buttonClass: "btn-confirm-primary",
  },
  finishButton: {
    label: "Finish",
    eventName: "new-dossier-seed-received",
    buttonClass: "btn-confirm-primary",
  },
};

const importDossierModal = {
  title: "Import Dossier",
  createState: true,
  hasError: false,
  errorMessage: "",
  setNameInput: {
    label: "Name the imported dossier",
    value: "",
  },
  setSeedInput: {
    label: "Enter your SEED",
    value: "",
  },
  setNameButton: {
    disabled: true,
    label: "Continue",
    eventName: "name-import-dossier",
    buttonClass: "btn-confirm-primary",
  },
  finishButton: {
    label: "Finish",
    eventName: "seed-import-dossier",
    buttonClass: "btn-confirm-primary",
  },
};

const receiveDossierModal = {
  title: "Receive Dossier",
  disclaimer:
    "Once the colaborator sends you the Dossier SEED you can scan the QRcode or enter the URL. After that you will be prompted to choose a place and a name for the new Dossier",
  orLabel: "or",
  createState: true,
  hasError: false,
  errorMessage: "",
  receiveCode: {
    readOnly: true,
    value: "%rt78qtp%$",
  },
  setNameInput: {
    label: "Dossier name",
    value: "",
  },
  selectDestination: {
    label: "Dossier destination",
    value: "",
    selectOptions: "Wallet root, / | Data, /data | New Dossier, /new-dossier",
  },
  nextButton: {
    label: "Next",
    eventName: "next-receive-dossier",
    buttonClass: "btn-confirm-primary",
  },
  finishButton: {
    label: "Finish",
    eventName: "finish-receive-dossier",
    buttonClass: "btn-confirm-primary",
  },
};

const shareDossierModal = {
  title: "Share",
  disclaimer:
    "To share, we need to scan a QR code or enter a Collaborator Secure Code to identify to whom you want to send.",
  loadingDisclaimer:
    "We are waiting for your collaborator to receive the dossier",
  confirmedShareDisclaimer:
    "Your collaborator has received the dossier succesfuly!",
  orLabel: "or",
  useQrCodeLabel: "Use QR Code",
  getIdentityState: 1,
  sendLoading: 0,
  hasError: 0,
  errorMessage: "",
  enterCode: {
    value: "",
    placeholder: "e.g. %rt78qtp%$",
    label: "Enter Secure Code",
  },
  scanBtn: {
    label: "Scan",
    eventName: "scan-identity",
    buttonClass: "btn-confirm-secondary",
  },
  sendBtn: {
    label: "Send",
    eventName: "start-share",
    buttonClass: "btn-confirm-primary",
  },
  finishBtn: {
    disabled: false,
    label: "Finish",
    eventName: "finish-share",
    buttonClass: "btn-confirm-primary",
  },
};

const renameDossierModal = {
  title: "Rename",
  hasError: 0,
  errorMessage: "",
  renameOneFileError: "Only one file can be renamed at a time!",
  setNameInput: {
    label: "Enter the new name",
    value: "",
  },
  setNameButton: {
    label: "Rename",
    eventName: "confirm-rename",
    buttonClass: "btn-confirm-primary",
  },
};

const deleteSelectedItemsModal = {
  title: "Notification",
  notificationMessage: `Are you sure you want to delete ${DELETE_ITEMS_PLACEHOLDER}?`,
  itemsLabel: "items", // will be used in pair with notificationMessage attribute for special design
  hasError: 0,
  errorMessage: "",
  cancelBtn: {
    label: "Cancel",
    eventName: "delete",
    eventData: "cancel-delete",
    buttonClass: "btn-confirm-secondary",
  },
  deleteBtn: {
    label: "Delete",
    eventName: "delete",
    eventData: "confirm-delete",
    buttonClass: "btn-confirm-primary",
  },
};

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

export const explorerModel = {
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
