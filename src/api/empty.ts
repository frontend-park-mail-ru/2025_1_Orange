import {
    SignupRequest,
    SigninRequest,
    Static,
    Applicant,
    ApplicantShort,
    Employer,
    EmployerShort,
    Vacancy,
    VacancyShort,
    WorkExperience,
    Resume,
    ResumeShort,
    User,
    ApplicantEdit,
    EmployerEdit,
    ResumeCreate,
    VacancyCreate,
    WorkExperienceCreate,
    AuthResponse,
} from './interfaces';

export const emptySignupRequest: SignupRequest = {
    email: '',
    password: '',
    repeatPassword: '',
    first_name: '',
    last_name: '',
    company_name: '',
    legal_address: '',
};

export const emptySigninRequest: SigninRequest = {
    email: '',
    password: '',
};

export const emptyStatic: Static = {
    id: 0,
    path: '',
    created_at: '',
    updated_at: '',
};

export const emptyApplicant: Applicant = {
    id: 0,
    first_name: '',
    last_name: '',
    middle_name: '',
    city: '',
    birth_date: '',
    sex: 'M',
    quote: '',
    avatar: '',
    telegram: '',
    vk: '',
    facebook: '',
    created_at: '',
    updated_at: '',
    status: 'actively_searching',
};

export const emptyApplicantShort: ApplicantShort = {
    id: 0,
    first_name: '',
    last_name: '',
    middle_name: '',
    birth_date: '',
    sex: 'M',
    avatar: '',
    created_at: '',
    updated_at: '',
};

export const emptyEmployer: Employer = {
    id: 0,
    company_name: '',
    slogan: '',
    website: '',
    description: '',
    legal_address: '',
    logo: '',
    created_at: '',
    updated_at: '',
};

export const emptyEmployerShort: EmployerShort = {
    id: 0,
    company_name: '',
    logo: '',
};

export const emptyVacancy: Vacancy = {
    resume: false,
    id: 0,
    title: '',
    is_active: false,
    employer: emptyEmployer,
    specialization: '',
    city: '',
    work_format: 'office',
    employment: 'full_time',
    schedule: '5/2',
    working_hours: 0,
    salary_from: 0,
    salary_to: 0,
    taxes_included: false,
    experience: 'no_matter',
    skills: [],
    description: '',
    tasks: '',
    requirements: '',
    optional_requirements: '',
    created_at: '',
    updated_at: '',
};

export const emptyVacancyShort: VacancyShort = {
    resume: false,
    id: 0,
    title: '',
    employer: emptyEmployerShort,
    specialization: '',
    city: '',
    work_format: 'office',
    employment: 'full_time',
    working_hours: 0,
    salary_from: 0,
    salary_to: 0,
    taxes_included: false,
    created_at: '',
    updated_at: '',
};

export const emptyWorkExperience: WorkExperience = {
    id: 0,
    employer_name: '',
    position: '',
    duties: '',
    achievements: '',
    start_date: '',
    end_date: '',
    until_now: false,
};

export const emptyResume: Resume = {
    id: 0,
    applicant: emptyApplicant,
    about_me: '',
    specialization: '',
    education: 'secondary_school',
    educational_institution: '',
    graduation_year: '',
    skills: [],
    work_experience: [],
    worked_experience: 0,
    created_at: '',
    updated_at: '',
};

export const emptyResumeShort: ResumeShort = {
    id: 0,
    applicant: emptyApplicantShort,
    specialization: '',
    work_experience: emptyWorkExperience,
    worked_experience: 0,
    created_at: '',
    updated_at: '',
};

export const emptyUser: User = {
    type: 'applicant',
    employer: emptyEmployer,
    applicant: emptyApplicant,
};

export const emptyWorkExperienceCreate: WorkExperienceCreate = {
    employer_name: '',
    position: '',
    duties: '',
    achievements: '',
    start_date: '',
    end_date: '',
    until_now: false,
};

export const emptyResumeCreate: ResumeCreate = {
    about_me: '',
    specialization: '',
    education: 'secondary_school',
    educational_institution: '',
    graduation_year: '',
    skills: [],
    work_experience: [],
};

export const emptyVacancyCreate: VacancyCreate = {
    title: '',
    specialization: '',
    city: '',
    work_format: 'office',
    employment: 'full_time',
    schedule: '5/2',
    working_hours: 0,
    salary_from: 0,
    salary_to: 0,
    taxes_included: false,
    experience: 'no_experience',
    skills: [],
    description: '',
    tasks: '',
    requirements: '',
    optional_requirements: '',
};

export const emptyEmployerEdit: EmployerEdit = {
    company_name: '',
    slogan: '',
    website: '',
    description: '',
    legal_address: '',
};

export const emptyApplicantEdit: ApplicantEdit = {
    first_name: '',
    last_name: '',
    middle_name: '',
    city: '',
    birth_date: '',
    sex: 'M',
    quote: '',
    avatar: '',
    telegram: '',
    vk: '',
    facebook: '',
};

export const emptyAuthResponse : AuthResponse = {
    role: 'applicant',
    user_id: 0
}