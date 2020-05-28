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
    nameExistsLabel: "An entry with the same name already exists!",
    nameNotEmptyLabel: "The entry name cannot be empty or only with empty spaces!",
    specialCharactersLabel: "The entry name cannot contain special character '/'!"
  }
};

export default renameDossierModal;