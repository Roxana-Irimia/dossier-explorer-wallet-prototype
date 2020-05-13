import Constants from "../controllers/Constants.js";

const deleteDossierModal = {
  title: "Notification",
  notificationMessage: `Are you sure you want to delete ${Constants.DELETE_ITEMS_PLACEHOLDER} items?`,
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
    hasError: 0,
    errorMessage: "",
    noItemsSelectedLabel: "There are no items selected!"
  }
};

export default deleteDossierModal;