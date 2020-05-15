const shareDossierModal = {
  title: "Share",
  disclaimer: "To share, we need to scan a QR code or enter a Collaborator Secure Code to identify to whom you want to send.",
  loadingDisclaimer: "We are waiting for your collaborator to receive the dossier",
  confirmedShareDisclaimer: "Your collaborator has received the dossier succesfuly!",
  orLabel: "or",
  useQrCodeLabel: "Use QR Code",
  dossierSEEDInput: {
    label: "Dossier SEED",
    value: '',
    readOnly: true
  },
  identitySecureCodeInput: {
    value: "",
    placeholder: "e.g. %rt78qtp%$",
    label: "Enter Secure Code",
  },
  buttons: {
    scanIdentityButton: {
      label: "Scan",
      eventName: "scan-identity",
      buttonClass: "btn-confirm-secondary",
    },
    sendDossierButton: {
      label: "Send",
      eventName: "start-share",
      buttonClass: "btn-confirm-primary",
    },
    finishButton: {
      disabled: false,
      label: "Finish",
      eventName: "finish-share",
      buttonClass: "btn-confirm-primary",
    },
  },
  error: {
    hasError: 0,
    errorMessage: ""
  },
  conditionalExpressions: {
    isIdentitySelectionStep: true,
    isSendDossierStep: false,
    isLoading: false,
  }
};

export default shareDossierModal;