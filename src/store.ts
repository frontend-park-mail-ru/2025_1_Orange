import {
    emptyAuthResponse,
    emptyResumeCreate,
    emptyReview,
    emptySignupRequest,
    emptyVacancyCreate,
} from './api/empty';
import { VacancyCreate, ResumeCreate, SignupRequest, AuthResponse, ReviewResponse } from './api/interfaces';


interface StoreData {
    csrf: string;
    authorized: boolean;
    page: string;
    auth: {
        type: 'applicant' | 'employer';
        request: SignupRequest;
    };
    user: AuthResponse;
    vacancy: VacancyCreate;
    resume: ResumeCreate;
    review: ReviewResponse;
}

const emptyData: StoreData = {
    csrf: '',
    authorized: false,
    page: '',
    auth: {
        type: 'applicant',
        request: emptySignupRequest,
    },
    user: emptyAuthResponse,
    vacancy: emptyVacancyCreate,
    resume: emptyResumeCreate,
    review: emptyReview,
};

class Store {
    data: StoreData;
    constructor() {
        this.data = structuredClone(emptyData);
    }
    reset = () => {
        const csrfToken = this.data.csrf;
        this.data = structuredClone(emptyData);
        this.data.csrf = csrfToken;
    };
}

export const store = new Store();
