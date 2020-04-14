export const importDossierModal = {
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
