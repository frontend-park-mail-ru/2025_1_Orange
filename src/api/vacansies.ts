import { Api } from './api';
import { Vacancy, VacancyCreate } from './interfaces';

export class VacancyService {
    readonly #api: Api;

    constructor(api: Api) {
        this.#api = api;
    }

    /**
     * Получение списка всех вакансий
     * @returns {Promise<Vacancy[]>}
     */
    async all(): Promise<Vacancy[]> {
        return this.#api.request('/vacancy/vacancies', 'GET');
    }

    /**
     * Создание новой вакансии
     * @param {VacancyCreate} body - значения новой вакансии
     * @returns {Promise<Vacancy>}
     */
    async create(body: VacancyCreate): Promise<Vacancy> {
        return this.#api.request('/vacancy/vacancies', 'POST', JSON.stringify(body));
    }

    /**
     * Получение вакансии по ID
     * @param {number} id - идентификатор вакансии
     * @returns {Promise<Vacancy>}
     */
    async get(id: number): Promise<Vacancy> {
        return this.#api.request(`/vacancy/vacancy/${id}`, 'GET');
    }

    /**
     * Обновление вакансии
     * @param {number} id - идентификатор вакансии
     * @param {VacancyCreate} body - новые значения
     * @returns {Promise<Vacancy>}
     */
    async update(id: number, body: VacancyCreate): Promise<Vacancy> {
        return this.#api.request(`/vacancy/vacancy/${id}`, 'PUT', JSON.stringify(body));
    }

    /**
     * Удаление вакансии
     * @param {number} id - идентификатор вакансии
     * @returns {Promise<void>}
     */
    async delete(id: number): Promise<void> {
        await this.#api.request(`/vacancy/vacancy/${id}`, 'DELETE');
    }

    async response(id: number): Promise<void> {
        await this.#api.request(`/vacancy/vacancy/${id}/response`, 'POST');
    }
}
