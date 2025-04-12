import { emptyResumeCreate, emptySignupRequest, emptyUser, emptyVacancyCreate } from './api/empty';
import { VacancyCreate, ResumeCreate, SignupRequest, User } from './api/interfaces';

interface StoreData {
    csrf: string;
    authorized: boolean;
    page: string;
    auth: {
        type: 'applicant' | 'employer';
        request: SignupRequest;
    };
    user: User;
    vacancy: VacancyCreate;
    resume: ResumeCreate;
}

const emptyData: StoreData = {
    csrf: '',
    authorized: false,
    page: '',
    auth: {
        type: 'applicant',
        request: emptySignupRequest,
    },
    user: emptyUser,
    vacancy: emptyVacancyCreate,
    resume: emptyResumeCreate,
};

class Store {
    data: StoreData;
    constructor() {
        this.data = structuredClone(emptyData);
    }
    reset = () => {
        this.data = structuredClone(emptyData);
    };
}

export const store = new Store();
