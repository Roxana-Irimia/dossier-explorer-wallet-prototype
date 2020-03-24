const basePagesPath = "http://localhost:8000/pages/";

const pageLoader = {
  walletGridContent: `${basePagesPath}Wallet/wallet-content-grid.html`,
  walletListContent: `${basePagesPath}Wallet/wallet-content-list.html`,
  leftMenu: `${basePagesPath}Wallet/left-menu.html`,
  rightMenu: `${basePagesPath}Wallet/right-menu.html`,
  walletContent: `${basePagesPath}Wallet/wallet-content.html`,
  switchLayout: `${basePagesPath}Wallet/switch-layout.html`,
  signOut: `${basePagesPath}Wallet/sign-out.html`
};

const addItems = {
  addButton: {
    label: "Add",
    icon: "plus",
    iconColor: "#ffffff",
    classes: "add-menu"
  },
  addButtonsList: [
    {
      label: "Add file",
      eventName: "add-file",
      eventData: "{ path: '/' }",
      buttonClass: "btn-menu"
    },
    {
      label: "Add folder",
      eventName: "add-folder",
      eventData: "{ path: '/' }",
      buttonClass: "btn-menu bottom-border"
    },
    {
      label: "Create Dossier",
      eventName: "create-dossier",
      eventData: "{ path: '/' }",
      buttonClass: "btn-menu"
    },
    {
      label: "Import Dossier",
      eventName: "import-dossier",
      eventData: "{ path: '/' }",
      buttonClass: "btn-menu"
    },
    {
      label: "Receive Dossier",
      eventName: "receive-dossier",
      eventData: "{ path: '/' }",
      buttonClass: "btn-menu"
    }
  ]
};

const rightMenu = {
  dotsMenu: {
    icon: "ellipsis-v",
    iconColor: "rgb(92, 12, 78)",
    classes: "dots-menu"
  },
  menuActions: [
    {
      label: "Move",
      eventName: "right-menu-move",
      eventData: "{path: '/'}",
      buttonClass: "btn-menu"
    },
    {
      label: "Rename",
      eventName: "right-menu-rename",
      eventData: "{path: '/'}",
      buttonClass: "btn-menu"
    }
  ],
  viewIcon: {
    icon: "eye",
    iconColor: "rgb(92, 12, 78)",
    iconClass: "right-menu",
    eventData: "{path: '/'}",
    eventName: "right-menu-view",
    buttonClass: "no-btn"
  },
  exportIcon: {
    icon: "download",
    iconColor: "rgb(92, 12, 78)",
    iconClass: "right-menu",
    eventData: "{path: '/'}",
    eventName: "right-menu-export",
    buttonClass: "no-btn"
  },
  shareIcon: {
    icon: "share",
    iconColor: "rgb(92, 12, 78)",
    iconClass: "right-menu",
    eventData: "{path: '/'}",
    eventName: "right-menu-share",
    buttonClass: "no-btn"
  },
  deleteIcon: {
    icon: "trash",
    iconColor: "rgb(92, 12, 78)",
    iconClass: "right-menu",
    eventData: "{path: '/'}",
    eventName: "right-menu-delete",
    buttonClass: "no-btn"
  },
  selectedItems: []
};

const switchLayout = {
  grid: {
    icon: "th",
    iconColor: "rgb(92, 12, 78)",
    iconClass: "right-menu",
    switchHover: "Click to switch to list",
    eventName: "switch-layout"
  },
  list: {
    icon: "th-list",
    iconColor: "rgb(92, 12, 78)",
    iconClass: "right-menu",
    switchHover: "Click to switch to grid",
    eventName: "switch-layout"
  },
  active: "grid",
  buttonClass: "btn-switch"
};

const pagination = {
  loadMore: "Load more"
};

const dossierDetails = {
  sizeLabel: "Size",
  typeLabel: "Type",
  lastModificationLabel: "Last modification",
  nameLabel: "Name",
  items: [
    {
      name: "/assets",
      lastModification: "1584079000",
      type: "folder",
      size: "78563"
    },
    {
      name: "/blockchainkasd  has",
      lastModification: "547856365631313213132132132131",
      type: "file",
      size: "547856365631313213132132132131"
    },
    {
      name: "/app",
      lastModification: "1584079000",
      type: "application",
      size: "2478563",
      action: {
        buttonClass: "btn-run",
        label: "Run",
        eventName: "run-app",
        iconColor: "rgb(92, 12, 78)",
        icon: "play",
        iconClass: "icon-run-app"
      }
    },
    {
      name: "/New Dossier",
      lastModification: "1584079000",
      size: "347856",
      type: "dossier",
      icon: "lock",
      iconColor: "rgb(92, 12, 78)"
    }
  ]
};

const signOut = {
  eventName: "exit",
  buttonClass: "btn-exit",
  icon: "sign-out",
  iconColor: "rgb(92, 12, 78)",
  iconClass: "right-menu",
  label: "Exit",
  modal: {
    opened: false,
    title: "Exit Wallet",
    confirmQuestion: "Would you also like to delete Walled SEED from this device?",
    checkbox: {
      checked: false,
      label: "I have a copy of this Wallet SEED"
    },
    confirmButton: {
      label: "Yes",
      eventName: 'confirm-exit',
      buttonClass: 'btn-confirm'
    },
    justExitButton: {
      label: "No, just exit",
      eventName: 'confirm-exit',
      buttonClass: 'btn-confirm-primary'
    }
  }
};

export const explorerModel = {
  sectionTitle: "Dashboard",
  pageLoader: { ...pageLoader },
  signOut: { ...signOut },
  addItems: { ...addItems },
  rightMenu: { ...rightMenu },
  dossierDetails: { ...dossierDetails },
  switchLayout: { ...switchLayout },
  pagination: { ...pagination }
};
