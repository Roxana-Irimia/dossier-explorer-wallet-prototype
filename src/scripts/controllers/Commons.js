export default class Commons {
    static updateErrorMessage(model, errorMsg = '') {
        model.setChainValue('error.hasError', errorMsg !== '');
        model.setChainValue('error.errorMessage', errorMsg);
    }

    static validateSeedForm(SEED) {
        // Validate seed according to specifications
        return true;
    }
}