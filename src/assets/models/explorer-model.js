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
    menuOrientation: "left",
    addButton: {
      label: "Add",
      icon: "plus",
      iconColor: "#ffffff"
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
  },
  rightMenu: {
    menuOrientation: "right",
    icon: "ellipsis-v",
    iconColor: "rgb(92, 12, 78)",
    classes: "dots-menu",
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
      eventData: "{path: '/'}",
      eventName: "right-menu-view",
      buttonClass: "no-btn"
    },
    exportIcon: {
      icon: "download",
      iconColor: "rgb(92, 12, 78)",
      eventData: "{path: '/'}",
      eventName: "right-menu-export",
      buttonClass: "no-btn"
    },
    shareIcon: {
      icon: "share",
      iconColor: "rgb(92, 12, 78)",
      eventData: "{path: '/'}",
      eventName: "right-menu-share",
      buttonClass: "no-btn"
    },
    deleteIcon: {
      icon: "trash",
      iconColor: "rgb(92, 12, 78)",
      eventData: "{path: '/'}",
      eventName: "right-menu-delete",
      buttonClass: "no-btn"
    }
  },
  dossierDetails: {
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
          icon: "play"
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
