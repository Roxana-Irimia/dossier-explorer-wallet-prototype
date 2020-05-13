// TODO: Refactor: After adding the feedback component into the application, 
// assign this controller to the component and create a new view-model only with the errors and info messages
export default class FeedbackController {

    constructor(model) {
        this.model = model;
    }

    /**
     * This method updates the error message for the model.
     * The model has to include a proxified object named "error", with at least two fields: "hasError" and "errorMessage".
     * These view-model attributes will be updated and reflected back to UI.
     * @param {string} error - the error message that will be set inside the error model
     */
    updateErrorMessage(error) {
        if (!error) {
            // error cannot be null or undefied when it is assigned to a proxified object
            error = '';
        }

        this.model.setChainValue('error.hasError', error !== '');
        this.model.setChainValue('error.errorMessage', error);
    }

    /**
     * This method is updating the state of the ui-loader, so if the loading state is set to "true", 
     * the loader will be displayed, otherwise, it will not be displayed.
     * The default value is "false"
     * @param {boolean} loadingState 
     */
    setLoadingState(loadingState = false) {
        this.model.setChainValue('conditionalExpressions.isLoading', loadingState);
    }
}