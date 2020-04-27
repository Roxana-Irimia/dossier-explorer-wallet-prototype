const renameDossierModal = {
  title: "Rename",
  fileName: {
    label: "Enter the new name",
    value: "",
  },
  buttons: {
    renameButton: {
      label: "Rename",
      eventName: "confirm-rename",
      buttonClass: "btn-confirm-primary",
    },
  },
  error: {
    hasError: 0,
    errorMessage: "",
  }
};

export default renameDossierModal;