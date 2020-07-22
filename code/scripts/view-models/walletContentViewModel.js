const walletContentViewModel = {
    files: {
        type: 'file',
        icon: 'file',
        dataType: 'file'
    },
    folders: {
        type: 'folder',
        icon: 'folder',
        dataType: 'folder'
    },
    mounts: {
        type: 'dossier',
        icon: 'lock',
        dataType: 'mount'
    },
    applications: {
        type: 'application',
        icon: 'cog',
        dataType: 'mount'
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