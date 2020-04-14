export const createDossierModal = {
  title: "Create Dossier",
  createState: true,
  hasError: false,
  errorMessage: "",
  setNameInput: {
    label: "Name your new dossier",
    value: "",
  },
  seedInput: {
    label: "Dossier with the SEED below has been successfully created!",
    value: "ep8n5buype895ubye8netpmtu9rutepu9teertue58yuet7iy7tijht",
    readOnly: true,
  },
  setNameButton: {
    disabled: true,
    label: "Create Dossier",
    eventName: "name-new-dossier",
    buttonClass: "btn-confirm-primary",
  },
  finishButton: {
    label: "Finish",
    eventName: "new-dossier-seed-received",
    buttonClass: "btn-confirm-primary",
  },
};
