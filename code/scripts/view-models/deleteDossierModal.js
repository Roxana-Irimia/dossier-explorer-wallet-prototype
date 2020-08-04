import Constants from "../controllers/Constants.js";

const deleteDossierModal = {
    title: "Notification",
    notificationMessage: `Are you sure you want to delete ${Constants.DELETE_ITEMS_PLACEHOLDER}?`,
    buttons: {
        cancelButton: {
            label: "Cancel",
            eventName: "delete",
            eventData: "cancel-delete",
            buttonClass: "btn-confirm-secondary",
        },
        deleteButton: {
            label: "Delete",
            eventName: "delete",
            eventData: "confirm-delete",
            buttonClass: "btn-confirm-primary",
        },
    },
    error: {
        hasError: false,
        errorMessage: ""
    },
    conditionalExpressions: {
        isLoading: false,
    }
};

export default deleteDossierModal;