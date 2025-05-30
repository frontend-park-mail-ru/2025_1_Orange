import type { NotificationWS } from './interfaces';

export const notificationMocks: NotificationWS[] = [
    {
        id: 1,
        type: 'apply',
        sender_id: 1,
        receiver_id: 2,
        object_id: 1,
        resume_id: 1,
        applicant_name: 'Артем',
        employer_name: 'Вконтакте',
        title: 'Go-разработчик',
        is_viewed: false,
        created_at: '2025-05-24T10:55:57.298448Z',
    },
    {
        id: 2,
        type: 'download_resume',
        sender_id: 2,
        receiver_id: 1,
        object_id: 1,
        resume_id: 1,
        applicant_name: 'Артем',
        employer_name: 'Вконтакте',
        title: 'Backend-разработчик',
        is_viewed: false,
        created_at: '2025-05-24T10:56:41.439935Z',
    },
    {
        id: 3,
        type: 'apply',
        sender_id: 3,
        receiver_id: 2,
        object_id: 2,
        resume_id: 2,
        applicant_name: 'Валерий',
        employer_name: 'Яндекс',
        title: 'Frontend-разработчик',
        is_viewed: true,
        created_at: '2025-05-24T09:30:15.123456Z',
    },
    {
        id: 4,
        type: 'download_resume',
        sender_id: 4,
        receiver_id: 3,
        object_id: 3,
        resume_id: 3,
        applicant_name: 'Мария',
        employer_name: 'Сбер',
        title: 'UX/UI дизайнер',
        is_viewed: false,
        created_at: '2025-05-24T08:15:30.987654Z',
    },
    {
        id: 5,
        type: 'apply',
        sender_id: 5,
        receiver_id: 4,
        object_id: 4,
        resume_id: 4,
        applicant_name: 'Дмитрий',
        employer_name: 'Тинькофф',
        title: 'DevOps инженер',
        is_viewed: true,
        created_at: '2025-05-24T07:45:22.456789Z',
    },
];
