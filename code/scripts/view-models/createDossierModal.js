const createDossierModal = {
    title: "Create Dossier",
    dossierNameInput: {
        label: "Name your new dossier",
        value: "",
    },
    dossierSeedOutput: {
        label: "Dossier with the SEED below has been successfully created!",
        value: "",
        readOnly: true,
    },
    buttons: {
        createDossier: {
            disabled: true,
            label: "Create Dossier",
            eventName: "name-new-dossier",
            buttonClass: "btn-confirm-primary",
        },
        finishDossier: {
            label: "Finish",
            eventName: "new-dossier-seed-received",
            buttonClass: "btn-confirm-primary",
        }
    },
    error: {
        hasError: false,
        errorMessage: "",
        errorLabels: {
            fileExistsLabel: "An entry with the same name already exists!",
            nameNotValidLabel: "The entry name cannot be empty or with empty spaces!"
        }
    },
    conditionalExpressions: {
        isLoading: false,
        isDossierNameStep: true,
    }
};

export default createDossierModal;