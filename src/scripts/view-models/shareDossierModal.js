export const shareDossierModal = {
  title: "Share",
  disclaimer:
    "To share, we need to scan a QR code or enter a Collaborator Secure Code to identify to whom you want to send.",
  loadingDisclaimer:
    "We are waiting for your collaborator to receive the dossier",
  confirmedShareDisclaimer:
    "Your collaborator has received the dossier succesfuly!",
  orLabel: "or",
  useQrCodeLabel: "Use QR Code",
  getIdentityState: 1,
  sendLoading: 0,
  hasError: 0,
  errorMessage: "",
  enterCode: {
    value: "",
    placeholder: "e.g. %rt78qtp%$",
    label: "Enter Secure Code",
  },
  scanBtn: {
    label: "Scan",
    eventName: "scan-identity",
    buttonClass: "btn-confirm-secondary",
  },
  sendBtn: {
    label: "Send",
    eventName: "start-share",
    buttonClass: "btn-confirm-primary",
  },
  finishBtn: {
    disabled: false,
    label: "Finish",
    eventName: "finish-share",
    buttonClass: "btn-confirm-primary",
  },
};
