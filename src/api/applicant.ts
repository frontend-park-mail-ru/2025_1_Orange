import { Api } from './api';
import { Applicant, ApplicantEdit } from './interfaces';

export class ApplicantService {
    readonly #api: Api;

    constructor(api: Api) {
        this.#api = api;
    }

    /**
     * Получение информации о профиле соискателя
     * @returns {Promise<Applicant>}
     */
    async get(): Promise<Applicant> {
        return this.#api.request('/applicant', 'GET');
    }

    /**
     * Обновление информации о профиле соискателя
     * @param {ApplicantEdit} body - новая информация о соискателе
     * @returns {Promise<Applicant>}
     */
    async update(body: ApplicantEdit): Promise<Applicant> {
        return this.#api.request('/applicant', 'PUT', JSON.stringify(body));
    }
}
