const feedbackViewModel = {
    success: {
        isDisplayed: false,
        message: '',
        labels: {
            fileCreated: "File with the name [NAME] has beed created at [PATH]",
            folderCreated: "Folder with the name [NAME] has beed created at [PATH]",
            dossierMounted: "Dossier with the name [NAME] has beed created at [PATH]"
        }
    },
    error: {
        isDisplayed: false,
        message: '',
        labels: {
            genericError: "There was an unknown problem, please try again. If the error persists, please contact the support team!",
            noFileUploaded: 'No file or folder was uploaded',
            manifestManipulationError: "manifest file is not available for this kind of operation!",
            entryExists: "An entry with the same name already exists!",
            specialCharactersLabel: "The entry name cannot contain special character '/'!",
            nameNotValid: "The entry name cannot be empty or with empty spaces!",
            seedNotEmpty: "The SEED cannot be empty or only with empty spaces!",
            seedNotValid: "The provided SEED is not in a valid form!",
        }
    },
}

export default feedbackViewModel;