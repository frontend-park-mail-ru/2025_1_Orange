export interface SignupRequest {
    email: string;
    password: string;
    repeatPassword: string;
    first_name?: string;
    last_name?: string;
    company_name?: string;
    legal_address?: string;
}

export interface SigninRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    role: 'applicant' | 'employer';
    user_id: number;
}

export interface Static {
    id: number;
    path: string;
    created_at: string;
    updated_at: string;
}

export interface Applicant {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string;
    city: string;
    birth_date: string;
    sex: 'M' | 'F';
    quote: string;
    avatar_path: string;
    telegram: string;
    vk: string;
    facebook: string;
    created_at: string;
    updated_at: string;
    status:
        | 'actively_searching'
        | 'open_to_offer'
        | 'considering_offer'
        | 'starting_soon'
        | 'not_searching';
}

export interface ApplicantShort {
    id: number;
    first_name: string;
    last_name: string;
    middle_name: string;
    birth_date: string;
    sex: 'M' | 'F';
    avatar_path: string;
    created_at: string;
    updated_at: string;
    status:
        | 'actively_searching'
        | 'open_to_offer'
        | 'considering_offer'
        | 'starting_soon'
        | 'not_searching';
}

export interface Employer {
    id: number;
    company_name: string;
    slogan: string;
    website: string;
    description: string;
    legal_address: string;
    logo: string;
    telegram: string;
    vk: string;
    facebook: string;
    created_at: string;
    updated_at: string;
}

export interface EmployerShort {
    id: number;
    company_name: string;
    logo: string;
}

export interface Vacancy {
    resume: boolean;
    id: number;
    title: string;
    is_active: boolean;
    employer_id: number;
    employer: Employer;
    specialization: string;
    city: string;
    work_format: 'office' | 'remote' | 'hybrid' | 'traveling';
    employment: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance' | 'watch';
    schedule: '5/2' | '2/2' | '6/1' | '3/3' | 'on_weekend' | 'by_agreement';
    working_hours: number;
    salary_from: number;
    salary_to: number;
    taxes_included: boolean;
    experience: 'no_matter' | 'no_experience' | '1_3_years' | '3_6_years' | '6_plus_years';
    skills: string[];
    description: string;
    tasks: string;
    requirements: string;
    optional_requirements: string;
    responded: boolean;
    created_at: string;
    updated_at: string;
}

export interface VacancyShort {
    resume: boolean;
    id: number;
    title: string;
    employer_id: number;
    employer: EmployerShort;
    specialization: string;
    city: string;
    work_format: 'office' | 'remote' | 'hybrid' | 'traveling';
    employment: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance' | 'watch';
    working_hours: number;
    salary_from: number;
    salary_to: number;
    taxes_included: boolean;
    responded: boolean;
    created_at: string;
    updated_at: string;
}

export interface Resume {
    id: number;
    applicant_id: number;
    applicant: Applicant;
    about_me: string;
    specialization: string;
    profession: string;
    education: 'secondary_school' | 'incomplete_higher' | 'higher' | 'bachelor' | 'master' | 'phd';
    educational_institution: string;
    graduation_year: string;
    skills: string[];
    work_experiences: WorkExperience[];
    worked_experience: number;
    created_at: string;
    updated_at: string;
}

export interface ResumeShort {
    id: number;
    applicant_id: number;
    applicant: ApplicantShort;
    specialization: string;
    profession: string;
    work_experiences: WorkExperience;
    worked_experience: number;
    created_at: string;
    updated_at: string;
}

export interface WorkExperience {
    id: number;
    employer_name: string;
    position: string;
    duties: string;
    achievements: string;
    start_date: string;
    end_date: string;
    until_now: boolean;
}

export interface User {
    type: 'applicant' | 'employer';
    employer?: Employer;
    applicant?: Applicant;
}
export interface WorkExperienceCreate {
    employer_name: string;
    position: string;
    duties: string;
    achievements: string;
    start_date: string;
    end_date: string;
    until_now: boolean;
}

export interface ResumeCreate {
    about_me: string;
    specialization: string;
    profession: string;
    education: 'secondary_school' | 'incomplete_higher' | 'higher' | 'bachelor' | 'master' | 'phd';
    educational_institution: string;
    graduation_year: string;
    skills: string[];
    work_experiences: WorkExperienceCreate[];
    telegram: string;
    vk: string;
    facebook: string;
}

export interface VacancyCreate {
    title: string;
    specialization: string;
    city: string;
    work_format: 'office' | 'remote' | 'hybrid' | 'traveling';
    employment: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance' | 'watch';
    schedule: '5/2' | '2/2' | '6/1' | '3/3' | 'on_weekend' | 'by_agreement';
    working_hours: number;
    salary_from: number;
    salary_to: number;
    taxes_included: boolean;
    experience: 'no_experience' | '1_3_years' | '3_5_years' | 'more_than_5_years';
    skills: string[];
    description: string;
    tasks: string;
    requirements: string;
    optional_requirements: string;
}

export interface EmployerEdit {
    company_name: string;
    slogan: string;
    website: string;
    description: string;
    legal_address: string;
}

export interface ApplicantEdit {
    first_name: string;
    last_name: string;
    middle_name: string;
    city: string;
    birth_date: string;
    sex: 'M' | 'F';
    quote: string;
    avatar_path: string;
    telegram: string;
    vk: string;
    facebook: string;
}

export interface ReviewRequest {
    poll_id: number;
    answer: number;
}

export interface ReviewResponse {
    poll_id: number;
    name: string;
}

/**
 * Интерфейс для статистики по одному рейтингу (звезды)
 */
export interface RatingStatistic {
    stars: number;
    percentage: number;
    votes: number;
}

/**
 * Интерфейс для статистики по одному опросу
 */
export interface PollStatistic {
    id: number;
    question: string;
    rating: number;
    stars: RatingStatistic[];
}

/**
 * Интерфейс для специализации с зарплатными вилками
 */
export interface SalarySpecialization {
    id: number;
    name: string;
    minSalary: number;
    maxSalary: number;
    avgSalary: number;
}

/**
 * Интерфейс для ответа API с зарплатными вилками
 */
export interface SalarySpecializationsResponse {
    specializations: SalarySpecialization[];
}

/**
 * Интерфейс для уведомления
 */
export interface NotificationWS {
    id: number;
    type: 'apply' | 'download_resume';
    sender_id: number;
    receiver_id: number;
    object_id: number;
    resume_id: number;
    applicant_name: string;
    employer_name: string;
    title: string;
    is_viewed: boolean;
    created_at: string;
}

/**
 * Интерфейс для ответа API с уведомлениями
 */
export interface NotificationsResponse {
    notifications: NotificationWS[];
}
