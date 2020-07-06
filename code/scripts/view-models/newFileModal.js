const newFileModal = {
    title: "Create new file",
    fileNameInput: {
        placeholder: 'Enter file name...',
        label: "File name",
        required: true
    },
    fileContentInput: {
        label: "Initial content for file (optional). This can be added or edited later."
    },
    buttons: {
        cancelButton: {
            label: "Cancel",
            eventName: "new-file-cancel",
            buttonClass: "btn-confirm-primary",
        },
        createFileButton: {
            label: "Create file",
            eventName: "new-file-create",
            buttonClass: "btn-confirm-secondary",
        },
    },
    conditionalExpressions: {
        isLoading: false
    },
    error: {
        hasError: false,
        errorMessage: "",
        errorLabels: {
            fileExistsLabel: "An entry with the same name already exists!",
            nameNotValidLabel: "The entry name cannot be empty or with empty spaces!"
        }
    },
};

export default newFileModal;