export const deleteDossierModal = {
  title: "Notification",
  notificationMessage: `Are you sure you want to delete ${DELETE_ITEMS_PLACEHOLDER}?`,
  itemsLabel: "items", // will be used in pair with notificationMessage attribute for special design
  hasError: 0,
  errorMessage: "",
  cancelBtn: {
    label: "Cancel",
    eventName: "delete",
    eventData: "cancel-delete",
    buttonClass: "btn-confirm-secondary",
  },
  deleteBtn: {
    label: "Delete",
    eventName: "delete",
    eventData: "confirm-delete",
    buttonClass: "btn-confirm-primary",
  },
};
