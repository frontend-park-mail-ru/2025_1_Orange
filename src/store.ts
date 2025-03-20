let store = {
    page: '',
    auth: {
        isEmployer: false,
        email: '',
        password: '',
        repeatPassword: '',
        firstName: '',
        lastName: '',
        companyName: '',
        companyAddress: '',
    },
    user: {
        authenticated: false,
        email: '',
        firstName: '',
        lastName: '',
        companyName: '',
        companyAddress: '',
    },
};

// Начальное состояние store
const defaultStore = {
    page: 'regEmail',
    auth: {
        isEmployer: false,
        email: '',
        password: '',
        repeatPassword: '',
        firstName: '',
        lastName: '',
        companyName: '',
        companyAddress: '',
    },
    user: {
        authenticated: false,
        email: '',
        firstName: '',
        lastName: '',
        companyName: '',
        companyAddress: '',
    },
};

/**
 * Сбрасывает стор. Вызывается при выходе
 */
function resetStore() {
    store = structuredClone(defaultStore);
}

export { store, resetStore };
