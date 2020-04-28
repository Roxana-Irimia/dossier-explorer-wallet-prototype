const signOutModal = {
  title: "Exit Wallet",
  confirmDeleteSeedDisclaimer: "Would you also like to delete Walled SEED from this device?",
  hasError: 0,
  errorMessage: "Service error",
  checkboxDeleteSeed: {
    checked: false,
    checkboxLabel: "I have a copy of this Wallet SEED",
    value: "unchecked",
  },
  confirmBtn: {
    disabled: true,
    label: "Yes",
    eventName: "sign-out-confirm",
    eventData: "delete-seed",
    buttonClass: "btn-confirm",
  },
  exitBtn: {
    label: "No, just exit",
    eventName: "sign-out-confirm",
    buttonClass: "btn-confirm-primary",
  },
};

export default signOutModal;