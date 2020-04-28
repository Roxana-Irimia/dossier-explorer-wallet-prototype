const lazyItemsModel = [
  {
    name: "App1",
    path: "/my-apps/path1",
    exact: true,
    icon: "fa-home",
    component: "psk-page-loader",
    componentProps: {
      pageUrl: "http://localhost:8000/pages/nested-menu/item1.html"
    }
  },
  {
    name: "App2",
    path: "/my-apps/path2",
    icon: "fa-home",
    exact: true,
    componentProps: {
      pageUrl: "http://localhost:8000/pages/nested-menu/item1.html"
    }
  }
];

export default class DossierAppController {
  constructor(element) {
    element.addEventListener("getSSApps", function(event) {
      if (
        typeof event.getEventType === "function" &&
        event.getEventType() === "PSK_SUB_MENU_EVT"
      ) {
        let callback = event.data;
        if (typeof callback !== "function") {
          throw new Error("Callback should be a function");
        }
        setTimeout(() => {
          callback(undefined, lazyItemsModel);
        }, 500);
      }
    });
  }
}
