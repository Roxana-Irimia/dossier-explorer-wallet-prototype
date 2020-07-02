const importDossierModal = {
    title: "Import Dossier",
    isDossierNameStep: true,
    dossierNameInput: {
        label: "Name the imported dossier",
        value: "",
    },
    dossierSeedInput: {
        label: "Enter the dossier SEED you want to import",
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
            disabled: true,
            label: "Finish",
            eventName: "import-dossier-seed",
            buttonClass: "btn-confirm-primary",
        }
    },
    error: {
        hasError: false,
        errorMessage: "",
        errorLabels: {
            fileExistsLabel: "An entry with the same name already exists!",
            nameNotValidLabel: "The entry name cannot be empty or with empty spaces!",
            seedNotEmptyLabel: "The SEED cannot be empty or only with empty spaces!",
            seedNotValidLabel: "The provided SEED is not in a valid form!"
        }
    },
};

export default importDossierModal;