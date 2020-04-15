import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import { rootModel } from "../view-models/rootModel.js";
import { signOutModal } from "../view-models/signOutModal.js"

export default class ExplorerController extends ContainerController {
  constructor(element) {
    super(element);

    this.model = this.setModel(rootModel);
    // let DossierService = getDossierServiceInstance();

    // DossierService.listDossierFiles(function (err, files) {
    //   console.log(err, files);
    // });

    this._initListeners();
  }

  _initListeners = () => {
    this.on("sign-out", this._signOutFromWalletHandler, true);
    this.on("switch-layout", this._handleSwitchLayout, true);
  };

  _signOutFromWalletHandler = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.showModal("signOut", signOutModal,(err, response)=>{
      console.log(err, response);
    });

  };

  _handleSwitchLayout = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.model.isGridLayout = !this.model.isGridLayout;
  };
}
