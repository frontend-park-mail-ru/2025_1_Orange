import { store } from '../store';
import { logger } from '../utils/logger';
import { ApplicantService } from './applicant';
import { AuthService } from './auth';
import { EmployerService } from './employer';
import { NotificationService } from './notification';
import { PollService } from './poll';
import { ResumeService } from './resumes';
import { SpecializationService } from './specialization';
import { VacancyService } from './vacansies';

export class Api {
    readonly #baseUrl;
    readonly auth: AuthService;
    readonly vacancy: VacancyService;
    readonly applicant: ApplicantService;
    readonly employer: EmployerService;
    readonly resume: ResumeService;
    readonly poll: PollService;
    readonly specialization: SpecializationService;
    readonly notification: NotificationService;

    /**
     * Конструктор класса api - взаимодействие с бекендом
     * @param {string} baseUrl - url бекенда
     */
    constructor(baseUrl: string = 'http://localhost/api/v1') {
        this.#baseUrl = baseUrl;
        this.auth = new AuthService(this);
        this.vacancy = new VacancyService(this);
        this.applicant = new ApplicantService(this);
        this.employer = new EmployerService(this);
        this.resume = new ResumeService(this);
        this.poll = new PollService(this);
        this.specialization = new SpecializationService(this);
        this.notification = new NotificationService(this);
    }

    /**
     * Базовый метод отправки запроса
     * @param {string} endpoint
     * @param {string} method
     * @param {string | FormDate | null} body
     * @returns {Promise<Object>}
     */
    async request(
        endpoint: string,
        method: string = 'GET',
        body: string | FormData | null = null,
        content_type: string = 'application/json',
        response_type: string = 'application/json',
    ) {
        const url = this.#baseUrl + endpoint;
        const headers = new Headers();
        if (content_type !== 'multipart/form-data') headers.append('Content-Type', content_type);
        if (store.data.csrf !== '') headers.append('X-CSRF-Token', store.data.csrf);

        const init: RequestInit = {
            method,
            headers,
            mode: 'cors',
            credentials: 'include',
            body: body,
        };

        logger.info(url, init);

        logger.info('STORE', store.data.csrf);

        try {
            const response = await fetch(url, init);
            logger.info('API HANDLE', response);
            const csrfToken = response.headers.get('X-CSRF-Token');
            if (csrfToken) {
                store.data.csrf = csrfToken;
            }
            logger.info('REQUEST STATUS', response.status, response.ok);
            if (!response.ok) {
                const error = await response.json();
                logger.error(`error: ${error.message}`);
                throw new Error(error.message || 'Ошибка при выполнении запроса');
            }
            try {
                if (response_type === 'application/json') return await response.json();
                if (response_type === 'application/pdf') return await response.blob();
            } catch {
                return '';
            }
        } catch (error) {
            // Попытка получить CSRF-токен даже в случае ошибки
            if (error instanceof Response) {
                // Проверяем, является ли ошибка объектом Response
                logger.info('NETWORK ERROR ', error);
                const csrfToken = error.headers.get('X-CSRF-Token');
                if (csrfToken) {
                    store.data.csrf = csrfToken;
                }
            }

            logger.error('Network Error or other error');
            throw new Error('Ошибка при выполнении запроса');
        }
    }
}

export const api = new Api();
