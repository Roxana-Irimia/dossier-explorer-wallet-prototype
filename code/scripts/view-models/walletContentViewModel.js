const walletContentViewModel = {
    files: {
        type: 'file',
        gridIcon: 'file',
        isApplication: false
    },
    folders: {
        type: 'folder',
        gridIcon: 'folder',
        isApplication: false
    },
    mounts: {
        type: 'dossier',
        gridIcon: 'lock',
        icon: 'lock'
    },
    defaultSortedViewModel: {
        name: {
            isSorted: false,
            descending: false,
        },
        lastModified: {
            isSorted: false,
            descending: false
        }
    }
}

export default walletContentViewModel;