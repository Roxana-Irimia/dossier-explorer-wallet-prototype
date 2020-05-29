const moveDossierModal = {
  title: "Move",
  content: [],
  navigationLinks: [],
  currentPath: '/',
  contentTypesToDisplay: ["mounts", "folders"],
  contentLabels: {
    selectDestinationLabel: 'Select the destination. You can navigate through folders and dossiers.',
    noItemsLabel: "There are no items in the current folder/dossier."
  },
  buttons: {
    moveButton: {
      label: "Move",
      eventName: "confirm-move",
      buttonClass: "btn-confirm-secondary",
    },
    cancelButton: {
      label: "Cancel",
      eventName: "cancel-move",
      buttonClass: "btn-confirm-primary",
    },
  },
  error: {
    hasError: 0,
    errorMessage: "",
    nameNotEmptyLabel: "The entry name cannot be empty or only with empty spaces!",
  }
};

export default moveDossierModal;