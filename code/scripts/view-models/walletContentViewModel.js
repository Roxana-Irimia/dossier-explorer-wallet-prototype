const walletContentViewModel = {
    defaultFileAttributes: {
        type: 'file',
        gridIcon: 'file',
        isApplication: false
    },
    defaultFolderAttributes: {
        type: 'folder',
        gridIcon: 'folder',
        isApplication: false
    },
    defaultDossierAttributes: {
        type: 'dossier',
        gridIcon: 'lock',
        icon: 'lock',
        isApplication: false
    },
    defaultSortedViewModel: {
        name: {
            isSorted: false,
            descendant: ''
        },
        lastModified: {
            isSorted: false,
            descendant: ''
        }
    }
}

export default walletContentViewModel;