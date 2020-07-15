const newFolderModal = {
    title: "Create new folder",
    folderNameInput: {
        placeholder: 'Enter folder name...',
        label: "Folder name",
        required: true
    },
    buttons: {
        cancelButton: {
            label: "Cancel",
            eventName: "new-folder-cancel",
            buttonClass: "btn-confirm-primary",
        },
        createFolderButton: {
            label: "Create folder",
            eventName: "new-folder-create",
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
            entryExistsLabel: "An entry with the same name already exists!",
            nameNotValidLabel: "The entry name cannot be empty or with empty spaces!"
        }
    },
};

export default newFolderModal;