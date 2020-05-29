const moveDossierModal = {
  title: "Move",
  content: [],
  navigationLinks: [],
  destinationPath: '/',
  selectDestinationLabel: 'Select the destination. You can navigate through folders and dossiers.',
  buttons: {
    moveButton: {
      label: "Move",
      eventName: "confirm-move",
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