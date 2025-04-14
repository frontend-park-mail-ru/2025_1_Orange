import { emptyApplicant, emptyEmployer } from './empty';
import {
    Static,
    Applicant,
    ApplicantShort,
    Employer,
    EmployerShort,
    Vacancy,
    VacancyShort,
    Resume,
    ResumeShort,
    WorkExperience,
    User,
} from './interfaces';

export const staticMock: Static = {
    id: 12,
    path: 'https://placehold.co/100x100/EEE/31343C',
    created_at: '2025-03-03T14:36:23.281Z',
    updated_at: '2025-03-12T14:36:23.281Z',
};

export const applicantMock: Applicant = {
    id: 12,
    first_name: 'Алексей',
    last_name: 'Ларин',
    middle_name: 'Андреевич',
    city: 'Москва',
    birth_date: '12.01.2004',
    sex: 'male',
    quote: 'hello55 one love',
    avatar: 'https://placehold.co/100x100/EEE/31343C',
    telegram: 't.me/iu5la',
    vk: 'vk.com/iu5la',
    web: 'mario.ru',
    created_at: '2025-01-12T14:36:23.281Z',
    updated_at: '2025-03-02T14:36:23.281Z',
    status: 'actively_searching',
};

export const applicantShortMock: ApplicantShort = {
    id: 12,
    first_name: 'Алексей',
    last_name: 'Ларин',
    middle_name: 'Андреевич',
    birth_date: '12.01.04',
    sex: 'male',
    avatar: 'https://placehold.co/100x100/EEE/31343C',
    created_at: '2025-01-12T14:36:23.281Z',
    updated_at: '2025-03-02T14:36:23.281Z',
};

export const employerMock: Employer = {
    id: 22,
    company_name: 'VK',
    slogan: 'Помогаем людям и компаниям объединяться вокруг того, что действительно важно',
    website: 'vk.com',
    description:
        'VK — крупнейшая российская технологическая компания. Мы помогаем миллионам людей решать повседневные задачи в онлайне. Нашими продуктами и сервисами пользуется больше 95% аудитории рунета.',
    address: 'Москва',
    logo: 'https://placehold.co/100x100/EEE/31343C',
    created_at: '2024-08-22T14:36:23.281Z',
    updated_at: '2025-03-02T14:36:23.281Z',
};

export const employerShortMock: EmployerShort = {
    id: 22,
    company_name: 'VK',
    logo: 'https://placehold.co/100x100/EEE/31343C',
};

export const vacancyMock: Vacancy = {
    id: 3,
    title: 'Фулстек веб разработчик',
    is_active: true,
    employer: employerMock,
    specialization: 'Фулстек веб разработчик',
    city: 'Санкт-Петербург',
    work_format: 'office',
    employment: 'full_time',
    schedule: '5/2',
    working_hours: 8,
    salary_from: 30000,
    salary_to: 50000,
    taxes_included: true,
    experience: '1_3_years',
    skills: ['TypeScript', 'Axios', 'React', 'MUI'],
    description:
        'Мы ищем талантливого Full-Stack Web Developer, который поможет разрабатывать и поддерживать современные веб-приложения. Вам предстоит работать как с frontend, так и с backend, разрабатывать API, оптимизировать производительность и участвовать в архитектурных решениях.',
    tasks: 'Разработка новых и поддержка существующих веб-приложений.\nРазработка клиентской части с использованием React/Vue/Angular.\nРазработка серверной логики на Node.js (Express/NestJS) или Python (Django/FastAPI).\nПроектирование и оптимизация REST/GraphQL API.\nРабота с базами данных PostgreSQL, MySQL, MongoDB.\nИнтеграция с внешними сервисами и API.\nОптимизация производительности и безопасности.\nУчастие в код-ревью, обсуждение архитектуры и технических решений.\nНастройка CI/CD, работа с контейнерами (Docker, Kubernetes).',
    requirements:
        'Опыт от 1 лет в разработке веб-приложений.\nУверенные знания HTML, CSS (SCSS, Tailwind), JavaScript (ES6+), TypeScript.\nОпыт работы с одним из фреймворков: React, Vue.js или Angular.\nПонимание принципов SSR/SSG (Next.js, Nuxt.js).\nЗнание Node.js (Express, NestJS, Fastify) или Python (Django, FastAPI).\nОпыт работы с реляционными (PostgreSQL, MySQL) и NoSQL (MongoDB, Redis) базами данных.\nОпыт проектирования и разработки API (REST, GraphQL).\nПонимание основ DevOps: Docker, CI/CD, облачные сервисы (AWS, GCP, DigitalOcean).\nУверенное владение Git (GitHub/GitLab, GitFlow).\nОпыт написания тестов (Jest, Mocha, Cypress).\nПонимание принципов SOLID, DRY, KISS, MVC.',
    optional_requirements:
        'Опыт работы с WebSockets.\nЗнание Redis, RabbitMQ, Kafka. \nОпыт работы с GraphQL (Apollo, Hasura).\nНавыки написания bash-скриптов.\nОпыт работы с микросервисной архитектурой.\nЗнание WebAssembly (Wasm).\nОпыт в Web3, блокчейн-разработке (Solidity, ethers.js).\nОпыт работы с AI/ML в веб-приложениях (TensorFlow.js, Hugging Face API).',
    created_at: '2025-03-02T14:36:23.281Z',
    updated_at: '2025-03-02T14:36:23.281Z',
};

export const vacancyShortMock: VacancyShort = {
    id: 22,
    title: 'Фулстек веб разработчик',
    employer: employerShortMock,
    specialization: 'Фулстек веб разработчик',
    city: 'Москва',
    work_format: 'office',
    employment: 'full_time',
    working_hours: 8,
    salary_from: 30000,
    salary_to: 50000,
    taxes_included: true,
    created_at: '2025-03-02T14:36:23.281Z',
    updated_at: '2025-03-02T14:36:23.281Z',
};

export const workExperienceMock: WorkExperience = {
    id: 1,
    employer_name: 'ПАО Газпром',
    position: 'Фулстек веб разработчик',
    duties: 'Разрабатывал frontend и backend части веб-приложений на React, Node.js, PostgreSQL.',
    achievements: 'Разработал личный кабинет газодобывающего оборудования',
    start_date: '01.01.2023',
    end_date: '12.09.2024',
    until_now: false,
};

export const resumeMock: Resume = {
    id: 12,
    applicant: applicantMock,
    about_me: 'Full-Stack Web Developer...',
    specialization: 'Фулстек веб разработчик',
    education: 'bachelor',
    educational_institution: 'МГТУ им. Н.Э. Баумана',
    graduation_year: '2026',
    skills: ['PostgreSQL', 'Redis', 'TypeScript', 'React', 'Golang'],
    work_experience: [workExperienceMock],
    worked_experience: 2,
    created_at: '2025-03-02T14:36:23.281Z',
    updated_at: '2025-03-02T14:36:23.281Z',
};

export const resumeShortMock: ResumeShort = {
    id: 12,
    applicant: applicantShortMock,
    specialization: 'Фулстек веб разработчик',
    work_experience: workExperienceMock,
    worked_experience: 2,
    created_at: '2025-03-02T14:36:23.281Z',
    updated_at: '2025-03-02T14:36:23.281Z',
};

export const userApplicantMock: User = {
    type: 'applicant',
    employer: emptyEmployer,
    applicant: applicantMock,
};

export const userEmployerMock: User = {
    type: 'employer',
    employer: employerMock,
    applicant: emptyApplicant,
};
