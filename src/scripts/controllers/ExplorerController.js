import BindableController from "./base-controllers/BindableController.js";
import { explorerModel } from "../../assets/models/explorer-model.js";

export default class ExplorerController extends BindableController {
  constructor(element) {
    super(element);

    this.model = this.setModel(explorerModel);
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

    console.log(event.data, `Detele SEED: ${event.data.deleteSeed === true}`);
  };

  _handleSwitchLayout = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.model.isGridLayout = !this.model.isGridLayout;
  };
}
