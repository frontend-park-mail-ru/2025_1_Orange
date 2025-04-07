import { CompanyInfo } from '../../api/interfaces';

export const companyMock: CompanyInfo = {
    id: 1,
    name: 'Яндекс',
    logo: 'https://placehold.co/150x150/EEE/31343C',
    rating: 4.9,
    star_rating: '★★★★★',
    reviews_count: 5678,
    skills: [
        { name: 'JavaScript' },
        { name: 'React' },
        { name: 'Node.js' },
        { name: 'AWS' },
        { name: 'Docker' },
    ],
    description:
        'Яндекс — одна из крупнейших компаний в сфере интернет-технологий. Компания занимается разработкой поисковых систем, облачных технологий, сервисов для бизнеса и многого другого. Мы стремимся создавать удобные и эффективные решения для пользователей и партнеров.',
    quote: 'Мы верим в силу команды и постоянно развиваем наши технологии для лучшего обслуживания клиентов.',
    city: 'Москва',
    avtive_vacancy: 3,
};
