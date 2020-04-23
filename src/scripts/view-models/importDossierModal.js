const importDossierModal = {
  title: "Import Dossier",
  isDossierNameStep: true,
  dossierNameInput: {
    label: "Name the imported dossier",
    value: "",
  },
  dossierSeedInput: {
    label: "Enter your SEED",
    value: ""
  },
  buttons: {
    continueButton: {
      disabled: true,
      label: "Continue",
      eventName: "import-dossier-name",
      buttonClass: "btn-confirm-primary",
    },
    finishButton: {
      label: "Finish",
      eventName: "import-dossier-seed",
      buttonClass: "btn-confirm-primary",
    }
  },
  error: {
    hasError: false,
    errorMessage: "",
    errorLabels: {
      fileExistsLabel: "A file with the same name already exists!",
      nameNotEmptyLabel: "The file name cannot be empty or only with empty spaces!"
    }
  },
};

export default importDossierModal;