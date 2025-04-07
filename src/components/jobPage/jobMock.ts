import { VacancyInfo, SimilarJob } from '../../api/interfaces';
export const mockVacancy: VacancyInfo = {
    id: 1,
    name: 'Фронтенд разработчик',
    salary: '30000 - 40000 рублей в месяц',
    city: 'Москва',
    work_hour: '40 часов в неделю',
    work_type: 'Офис',
    description: `
        Описание:
Мы ищем талантливого Fullstack Web Developer, который поможет развивать наш продукт. Ваша задача — создавать качественный код. Вам предстоит работать как с frontend, так и с backend, разрабатывать API, оптимизировать производительность и участвовать в архитектурных решениях.

Задачи:
- Разработка и поддержка существующих клиентских приложений.
- Разработка логической части с использованием Node.js/TypeScript.
- Разработка серверной логики на Node.js (Express, NestJS) или Python (Django).
- Проектирование и оптимизация REST/GraphQL API.
- Работа с базами данных PostgreSQL, MySQL, MongoDB.
- Администрирование инфраструктуры.
- Оптимизация производительности и безопасности.
- Участие в кодревью, обсуждении архитектуры и технических решений.
- Настройка CI/CD, работа с системами контроля версий (GitLab, GitHub).

Требования:
- Опыт от 1 года работы веб-приложениями.
- Уверенное знание HTML, CSS, SCSS, Tailwind, JavaScript (ES6+), TypeScript.
- Опыт работы с одним из фреймворков React, Vue или Angular.
- Практический опыт использования SSR/SSG (Next.js, Nuxt.js).
- Знание Node.js (Express, NestJS, Fastify) или Python (Django, Flask).
- Опыт работы с базами данных (PostgreSQL, MySQL) и NoSQL (MongoDB, Redis) базами данных.
- Опыт проектирования и разработки API (REST, GraphQL).
- Знакомство с Git/GitOps (Docker, CI/CD), облачными сервисами (AWS, GCP, DigitalOcean).
- Уверенное владение Git (GitHub, GitLab, GitKraken).
- Опыт работы с библиотеками (React, MUI, Cypress).
- Понимание принципов SOLID, OOP, KISS, DRY.

Будет плюсом:
- Опыт работы с WebAssembly.
- Знание Redux, MobX, RxJS, Kafka.
- Навыки работы с микросервисной архитектурой.
- Знание WebAssembly (Wasm).
- Опыт работы с WebGL, трехмерной графикой (Three.js, ethers.js).
- Опыт работы с AI, ML, компьютерного зрения (TensorFlow.js, Hugging Face API).`,
    day_created: 2,
    count: 56,
    years: 'Без опыта',
    skills: [
        { name: 'Python' },
        { name: 'Django' },
        { name: 'Flask' },
        { name: 'REST API' },
        { name: 'SQL' },
    ],
    company: {
        id: 1,
        name: 'ВКонтакте',
        logo: 'https://placehold.co/150x150/EEE/31343C',
        rating: 4.7,
        reviews_count: 1234,
    },
};

export const mockSimilarJobs: SimilarJob[] = [
    {
        id: 2,
        name: 'Стажер Java разработчик',
        salary: '50000 - 65000 рублей в месяц',
        company: {
            id: 2,
            name: 'Сбер',
            logo: 'https://placehold.co/150x150/EEE/31343C',
            rating: 4.5,
            reviews_count: 987,
        },
    },
    {
        id: 3,
        name: 'Frontend разработчик',
        salary: '70000 - 90000 рублей в месяц',
        company: {
            id: 3,
            name: 'Яндекс',
            logo: 'https://placehold.co/150x150/EEE/31343C',
            rating: 4.9,
            reviews_count: 5678,
        },
    },
];
