import { Resume } from '../../api/interfaces';
export const resumePageMock: Resume = {
    id: 1,
    profile: {
        id: 1,
        avatar: 'https://placehold.co/150x150/EEE/31343C',
        name: 'Анна Петрова',
        quote: 'Стремлюсь к развитию в сфере разработки программного обеспечения',
        city: 'г. Москва',
        birthday: '29 августа 2005г',
    },
    name: 'Software Developer',
    about: 'Опытный разработчик с навыками в области backend-разработки на Node.js и баз данных PostgreSQL. Умею работать с микросервисной архитектурой и RESTful API.',
    education: {
        name: 'Московский государственный университет им. М.В. Ломоносова',
        faculty: 'Факультет вычислительной математики и кибернетики',
        type: 'Магистратура',
        date: '2019-2021',
    },
    skills: [
        { name: 'Python' },
        { name: 'Django' },
        { name: 'Flask' },
        { name: 'REST API' },
        { name: 'SQL' },
    ],
    experience: [
        {
            start_date: 'Июнь 2021',
            end_date: 'Ноябрь 2023',
            duration: '2 года 6 месяцев',
            name: 'Backend Developer',
            company_name: 'Tech Solutions Ltd.',
            description:
                'Разработка микросервисов на Node.js, создание и оптимизация баз данных PostgreSQL, интеграция сторонних API.',
        },
        {
            start_date: 'Август 2019',
            end_date: 'Май 2021',
            duration: '1 год 10 месяцев',
            name: 'Junior Backend Developer',
            company_name: 'Startup Inc.',
            description:
                'Обучение и поддержка существующих проектов, работа с базами данных MySQL, написание unit-тестов.',
        },
    ],
    created_date: '22 января 2023 года в 18:11',
    updated_date: '28 января 2024 года в 11:58',
    contacts: [
        {
            name: 'vk',
            logo: 'https://placehold.co/150x150/EEE/31343C',
            data: '@vvvrmsd',
        },
        {
            name: 'vk',
            logo: 'https://placehold.co/150x150/EEE/31343C',
            data: 'github.com/user/hello-larin',
        },
        {
            name: 'vk',
            logo: 'https://placehold.co/150x150/EEE/31343C',
            data: '@sdfhweu_qwew',
        },
        {
            name: 'vk',
            logo: 'https://placehold.co/150x150/EEE/31343C',
            data: '@дададада',
        },
    ],
    status: 'Активно ищу работу',
};
