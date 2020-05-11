class AccountService {

	/**
	 * implement a mechanism to talk with loader and communicate that it have to unregister the service worker
	 * @param preferences
	 */
	signOut(preferences){
		if(preferences.deleteSeed){
			this.forgetWallet();
		}
		window.location.reload();
	}

	forgetWallet(){
		localStorage.clear();
	}
}


let accountService = new AccountService();
let getAccountServiceInstance = function () {
	return accountService;
};

export {
	getAccountServiceInstance
};
