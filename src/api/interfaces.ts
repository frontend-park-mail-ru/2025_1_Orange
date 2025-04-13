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
}

export interface Employer {
    id: number;
    company_name: string;
    slogan: string;
    website: string;
    description: string;
    legal_address: string;
    logo: string;
    created_at: string;
    updated_at: string;
}

export interface EmployerShort {
    id: number;
    company_name: string;
    logo: string;
}

export interface Vacancy {
    resume: boolean
    id: number;
    title: string;
    is_active: boolean;
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
    created_at: string;
    updated_at: string;
}

export interface VacancyShort {
    resume: boolean;
    id: number;
    title: string;
    employer: EmployerShort;
    specialization: string;
    city: string;
    work_format: 'office' | 'remote' | 'hybrid' | 'traveling';
    employment: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance' | 'watch';
    working_hours: number;
    salary_from: number;
    salary_to: number;
    taxes_included: boolean;
    created_at: string;
    updated_at: string;
}

export interface Resume {
    id: number;
    applicant: Applicant;
    about_me: string;
    specialization: string;
    education: 'secondary_school' | 'incomplete_higher' | 'higer' | 'bachelor' | 'master' | 'phd';
    educational_institution: string;
    graduation_year: string;
    skills: string[];
    work_experience: WorkExperience[];
    worked_experience: number;
    created_at: string;
    updated_at: string;
}

export interface ResumeShort {
    id: number;
    applicant: ApplicantShort;
    specialization: string;
    work_experience: WorkExperience;
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
    education: 'secondary_school' | 'incomplete_higher' | 'higer' | 'bachelor' | 'master' | 'phd';
    educational_institution: string;
    graduation_year: string;
    skills: string[];
    work_experience: WorkExperienceCreate[];
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
