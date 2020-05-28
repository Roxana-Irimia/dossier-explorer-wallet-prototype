const basePagesPath = "/pages/Wallet/";

const pageLoader = {
  walletGridContent: `${basePagesPath}wallet-content-grid.html`,
  walletListContent: `${basePagesPath}wallet-content-list.html`,
  addDossierMenu: `${basePagesPath}add-dossier-menu.html`,
  rightIconsMenu: `${basePagesPath}right-icons-menu.html`,
  switchLayout: `${basePagesPath}switch-layout.html`
};

const rootModel = {
  pageLoader: {
    ...pageLoader
  },
  content: [],
  selectedItem: {
    selected: false,
    item: []
  },
  navigationLinks: [],
  pageTitle: "Explorer",
  sectionTitle: "Dashboard",
  signOutLabel: "Exit",
  currentPath: '/',
  dateFormatOptions: { // Currently not used. 
    // To be used when extending the DateFormat to allow masked formats
    date: 'dd-mm-yyyy',
    time: 'HH:MM',
    fullTime: 'dd-mm-yyyy and HH:MM'
  },
  dossierContentLabels: {
    homeLabel: "My Wallet",
    lastModifiedLabel: "Last modification",
    typeLabel: "Type",
    nameLabel: "Name",
    runAppLabel: "Run",
    noItemsLabel: "There are no items in the current folder/dossier. You can add some by using the Add button.",
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
  iconsMenuMoreOptions: [{
      label: "Move",
      eventName: 'move-dossier'
    },
    {
      label: "Rename",
      eventName: 'rename-dossier'
    }
  ],
  error: {
    hasError: false,
    errorMessage: '',
    noFileUploadedLabel: 'No file or folder was uploaded',
    genericErrorLabel: "There was an unknown problem, please try again. If the error persists, please contact the support team!",
    manifestRenameError: "manifest file cannot be renamed!"
  },
  conditionalExpressions: {
    isLoading: false,
    isGridLayout: false,
  }
};

export default rootModel;