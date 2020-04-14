export const receiveDossierModal = {
  title: "Receive Dossier",
  disclaimer:
    "Once the colaborator sends you the Dossier SEED you can scan the QRcode or enter the URL. After that you will be prompted to choose a place and a name for the new Dossier",
  orLabel: "or",
  createState: true,
  hasError: false,
  errorMessage: "",
  receiveCode: {
    readOnly: true,
    value: "%rt78qtp%$",
  },
  setNameInput: {
    label: "Dossier name",
    value: "",
  },
  selectDestination: {
    label: "Dossier destination",
    value: "",
    selectOptions: "Wallet root, / | Data, /data | New Dossier, /new-dossier",
  },
  nextButton: {
    label: "Next",
    eventName: "next-receive-dossier",
    buttonClass: "btn-confirm-primary",
  },
  finishButton: {
    label: "Finish",
    eventName: "finish-receive-dossier",
    buttonClass: "btn-confirm-primary",
  },
};
