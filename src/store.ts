import {
    emptyAuthResponse,
    emptyResumeCreate,
    emptyReview,
    emptySignupRequest,
    emptyVacancyCreate,
} from './api/empty';
import {
    VacancyCreate,
    ResumeCreate,
    SignupRequest,
    AuthResponse,
    ReviewResponse,
    NotificationWS,
} from './api/interfaces';

interface StoreData {
    csrf: string;
    authorized: boolean;
    page: string;
    auth: {
        type: 'applicant' | 'employer';
        request: SignupRequest;
    };
    vacancyCategory: string;
    vacancySearch: string;
    resumeSearch: string;
    vacancyLimit: number;
    vacancyOffset: number;
    resumeLimit: number;
    resumeOffset: number;
    user: AuthResponse;
    vacancy: VacancyCreate;
    resume: ResumeCreate;
    review: ReviewResponse;
    notifications: NotificationWS[];
    responseResumeId: number;
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
    vacancyCategory: '',
    vacancySearch: '',
    vacancyLimit: 2,
    vacancyOffset: 0,
    resumeSearch: '',
    resumeLimit: 2,
    resumeOffset: 0,
    notifications: [],
    responseResumeId: 1,
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
