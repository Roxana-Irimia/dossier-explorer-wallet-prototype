import {
  DELETE_ITEMS_PLACEHOLDER,
  FILE_DOSSIER_MODAL_TOGGLE_EVENT_NAME,
  DEFAULT_ICON_COLOR,
} from "../../scripts/utils/constants.js";

const basePagesPath = "http://localhost:8000/pages/";

const pageLoader = {
  walletGridContent: `${basePagesPath}Wallet/wallet-content-grid.html`,
  walletListContent: `${basePagesPath}Wallet/wallet-content-list.html`,
  leftMenu: `${basePagesPath}Wallet/left-menu.html`,
  rightMenu: `${basePagesPath}Wallet/right-menu.html`,
  walletContent: `${basePagesPath}Wallet/wallet-content.html`,
  switchLayout: `${basePagesPath}Wallet/switch-layout.html`,
  signOut: `${basePagesPath}Wallet/sign-out.html`,
  signOutModal: `${basePagesPath}Wallet/modals/sign-out-modal.html`,
  fileDossierModals: `${basePagesPath}Wallet/modals/file-dossier-modals.html`,
  createDossierModal: `${basePagesPath}Wallet/modals/new-dossier-modal.html`,
  importDossierModal: `${basePagesPath}Wallet/modals/import-dossier-modal.html`,
  receiveDossierModal: `${basePagesPath}Wallet/modals/receive-dossier-modal.html`,
  shareDossierModal: `${basePagesPath}Wallet/modals/share-dossier-modal.html`,
  deleteSelectedItemsModal: `${basePagesPath}Wallet/modals/delete-selected-items-modal.html`,
  renameDossierModal: `${basePagesPath}Wallet/modals/rename-dossier-modal.html`,
};

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

const addItems = {
  addButton: {
    label: "Add",
    icon: "plus",
    iconColor: "#ffffff",
    classes: "add-menu",
  },
  selectedModal: "",
  addFileLabel: "Add file",
  addFolderLabel: "Add folder",
  createDossierLabel: "Create Dossier",
  importDossierLabel: "Import Dossier",
  receiveDossierLabel: "Receive Dossier",
  createDossierEventData: '{ "modalName": "create-dossier" }',
  importDossierEventData: '{ "modalName": "import-dossier" }',
  receiveDossierEventData: '{ "modalName": "receive-dossier" }',
  dossierEventName: FILE_DOSSIER_MODAL_TOGGLE_EVENT_NAME,
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

const switchLayout = {
  grid: {
    icon: "th",
    iconColor: DEFAULT_ICON_COLOR,
    iconClass: "right-menu",
    switchHover: "Click to switch to list",
    eventName: "switch-layout",
  },
  list: {
    icon: "th-list",
    iconColor: DEFAULT_ICON_COLOR,
    iconClass: "right-menu",
    switchHover: "Click to switch to grid",
    eventName: "switch-layout",
  },
  active: "grid",
  buttonClass: "btn-switch",
};

const pagination = {
  loadMore: "Load more",
};

const dossierDetails = {
  homeLabel: "My Wallet",
  currentPath: "/",
  sizeLabel: "Size",
  typeLabel: "Type",
  lastModifiedLabel: "Last modification",
  nameLabel: "Name",
  // Array to be removed after switched to interactions (displayedItems)
  displayedItems: [],
  noItemsLabel:
    "There are no items in the current folder/dossier. You can add some by using the Add button.",
  items: [
    {
      name: "assets",
      lastModified: "1584079000",
      type: "folder",
      iconColor: DEFAULT_ICON_COLOR,
      gridIcon: "folder",
      size: "78563",
    },
    {
      name: "blockchain",
      lastModified: "547856365631313213132132132131",
      type: "file",
      iconColor: DEFAULT_ICON_COLOR,
      gridIcon: "file",
      size: "547856365631313213132132132131",
    },
    {
      name: "app",
      lastModified: "1584079000",
      type: "application",
      size: "2478563",
      iconColor: DEFAULT_ICON_COLOR,
      gridIcon: "cog",
      action: {
        buttonClass: "btn-run",
        label: "Run",
        eventName: "run-app",
        iconColor: DEFAULT_ICON_COLOR,
        icon: "play",
        iconClass: "icon-run-app",
      },
    },
    {
      name: "New Dossier",
      lastModified: "1584079000",
      size: "347856",
      type: "dossier",
      icon: "lock",
      iconColor: DEFAULT_ICON_COLOR,
      gridIcon: "lock",
      items: [
        {
          name: "inside new dossier",
          size: "213124",
          type: "file",
          iconColor: DEFAULT_ICON_COLOR,
          gridIcon: "file",
        },
      ],
    },
  ],
};

const signOut = {
  eventName: "exit",
  buttonClass: "btn-exit",
  icon: "sign-out",
  iconColor: DEFAULT_ICON_COLOR,
  iconClass: "right-menu",
  label: "Exit",
  modal: {
    opened: false,
    title: "Exit Wallet",
    confirmQuestion:
      "Would you also like to delete Walled SEED from this device?",
    checkbox: {
      checked: false,
      checkboxLabel: "I have a copy of this Wallet SEED",
      value: "unchecked",
    },
    confirmButton: {
      disabled: true,
      label: "Yes",
      eventName: "confirm-exit",
      buttonClass: "btn-confirm",
    },
    justExitButton: {
      label: "No, just exit",
      eventName: "confirm-exit",
      buttonClass: "btn-confirm-primary",
    },
    error: {
      hasError: true,
      errorMessage: "Service error",
    },
  },
};

export const explorerModel = {
  sectionTitle: "Dashboard",
  pageLoader: { ...pageLoader },
  signOut: { ...signOut },
  addItems: { ...addItems },
  rightMenu: { ...rightMenu },
  dossierDetails: { ...dossierDetails },
  switchLayout: { ...switchLayout },
  pagination: { ...pagination },
  createDossierModal: { ...createDossierModal },
  importDossierModal: { ...importDossierModal },
  receiveDossierModal: { ...receiveDossierModal },
  shareDossierModal: { ...shareDossierModal },
  deleteSelectedItemsModal: { ...deleteSelectedItemsModal },
  renameDossierModal: { ...renameDossierModal },
};
