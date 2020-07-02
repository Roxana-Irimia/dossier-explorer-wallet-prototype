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
    buttons: {
        confirmButton: {
            disabled: true,
            label: "Yes",
            eventName: "sign-out-confirm",
            eventData: "delete-seed",
            buttonClass: "btn-confirm-primary",
        },
        exitButton: {
            label: "No, just exit",
            eventName: "sign-out-confirm",
            buttonClass: "btn-confirm-secondary",
        },
    }
};

export default signOutModal;