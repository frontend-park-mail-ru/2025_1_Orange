import { Api } from './api';
import { Employer, EmployerEdit } from './interfaces';

export class EmployerService {
    readonly #api: Api;

    constructor(api: Api) {
        this.#api = api;
    }

    /**
     * Получение информации о профиле компании
     * @returns {Promise<Employer>}
     */
    async get(): Promise<Employer> {
        return this.#api.request('/employer', 'GET');
    }

    /**
     * Обновление информации о профиле компании
     * @param {EmployerEdit} body -новая информация о компании
     * @returns {Promise<Employer>}
     */
    async update(body: EmployerEdit): Promise<Employer> {
        return this.#api.request('/employer', 'PUT', JSON.stringify(body));
    }
}
