export const explorerModel = {
  sectionTitle: "Dashboard",
  signOut: {
    eventName: "exit",
    buttonClass: "btn-exit",
    icon: "sign-out",
    iconColor: "rgb(92, 12, 78)",
    label: "Exit"
  },
  addItems: {
    addButton: {
      label: "Add",
      icon: "plus",
      iconColor: "#ffffff",
      eventName: "open-add-menu"
    },
    addFile: {
      label: "Add file",
      eventName: "add-file"
    },
    addFolder: {
      label: "Add folder",
      eventName: "add-folder"
    },
    createDossier: {
      label: "Create Dossier",
      eventName: "create-dossier"
    },
    importDossier: {
      label: "Import Dossier",
      eventName: "import-dossier"
    },
    receiveDossier: {
      label: "Receive Dossier",
      eventName: "receive-dossier"
    }
  },
  dossierDetails: {
    sizeLabel: "Size",
    lastModificationLabel: "Last modification",
    nameLabel: "Name",
    items: [
      {
        name: "/assets",
        lastModification: "1584079000",
        size: "78563"
      },
      {
        name:
          "/blockchainkasd laksjd laksjdhjakljsd lashdl jkasjf ljasdjkf has",
        lastModification: "547856365631313213132132132131",
        size: "547856365631313213132132132131"
      },
      {
        name: "/app",
        lastModification: "1584079000",
        size: "2478563",
        action: {
          buttonClass: "btn-run",
          label: "Run",
          eventName: "run-app",
          iconColor: "rgb(92, 12, 78)",
          icon: "play"
        }
      },
      {
        name: "/New Dossier",
        lastModification: "1584079000",
        size: "347856",
        icon: "lock",
        iconColor: "rgb(92, 12, 78)"
      }
    ]
  },
  switchLayout: {
    grid: {
      icon: "th",
      iconColor: "rgb(92, 12, 78)",
      switchHover: "Click to switch to list",
      eventName: "switch-layout"
    },
    list: {
      icon: "th-list",
      iconColor: "rgb(92, 12, 78)",
      switchHover: "Click to switch to grid",
      eventName: "switch-layout"
    },
    active: "grid",
    buttonClass: "btn-switch"
  },
  pagination: {
    loadMore: "Load more"
  }
};
