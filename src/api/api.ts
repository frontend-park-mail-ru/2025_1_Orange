import { logger } from '../utils/logger';
import { ApplicantService } from './applicant';
import { AuthService } from './auth';
import { EmployerService } from './employer';
import { ResumeService } from './resumes';
import { VacancyService } from './vacansies';

export class Api {
    readonly #baseUrl;
    readonly auth: AuthService;
    readonly vacancy: VacancyService;
    readonly applicant: ApplicantService;
    readonly employer: EmployerService;
    readonly resume: ResumeService;

    /**
     * Конструктор класса api - взаимодействие с бекендом
     * @param {string} baseUrl - url бекенда
     */
    constructor(baseUrl: string = 'http://localhost:8000') {
        this.#baseUrl = baseUrl;
        this.auth = new AuthService(this);
        this.vacancy = new VacancyService(this);
        this.applicant = new ApplicantService(this);
        this.employer = new EmployerService(this);
        this.resume = new ResumeService(this);
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
    ) {
        const url = this.#baseUrl + endpoint;
        const headers = new Headers();
        headers.append('Content-Type', content_type);

        const init: RequestInit = {
            method,
            headers,
            mode: 'cors',
            credentials: 'include',
            body: body,
        };

        logger.info(url, init);

        try {
            const response = await fetch(url, init);
            if (!response.ok) {
                const error = await response.json();
                logger.error(`error: ${error.message}`);
                throw new Error(error.message || 'Ошибка при выполнении запроса');
            }

            return response.json();
        } catch {
            logger.error('Network Error');
            throw new Error('Ошибка при выполнении запроса');
        }
    }
}

export const api = new Api();
