

function path(root: string, sublink: string) {
    return `${root}${sublink}`;
}

const ROOTS_AUTH = '';
const ROOTS_APP = '';

export const PATH_AUTH = {
    login: path(ROOTS_AUTH, '/'),
}

export const PATH_APP = {
    root: ROOTS_APP,
    general: {
        landing: path(ROOTS_APP, 'landing'),
    },
};
