import { Api } from './api';
import { Vacancy, VacancyCreate } from './interfaces';

export class VacancyService {
    readonly #api: Api;

    constructor(api: Api) {
        this.#api = api;
    }

    /**
     * Получение списка всех вакансий
     * @param {number} offset - с какой вакансии по счёту выводить
     * @param {number} limit - сколько выводить вакансий
     * @returns {Promise<Vacancy[]>}
     */
    async all(offset: number, limit: number): Promise<Vacancy[]> {
        return this.#api.request(`/vacancy/vacancies?offset=${offset}&limit=${limit}`, 'GET');
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

    /**
     * Получение списка вакансий по категории
     * @param {string[]} categories - выбранные категории
     * @param {number} offset - с какой вакансии по счёту выводить
     * @param {number} limit - сколько выводить вакансий
     * @returns {Promise<Vacancy[]>}
     */
    async category(categories: string[], offset: number, limit: number): Promise<Vacancy[]> {
        return this.#api.request(
            `/vacancy/search/specializations?offset=${offset}&limit=${limit}`,
            'POST',
            JSON.stringify({ specializations: categories }),
        );
    }

    /**
     * Получение списка вакансий по полям вакансии
     * @param {string} query - строку которую будем искать
     * @param {number} offset - с какой вакансии по счёту выводить
     * @param {number} limit - сколько выводить вакансий
     * @returns {Promise<Vacancy[]>}
     */
    async search(query: string, offset: number, limit: number): Promise<Vacancy[]> {
        return this.#api.request(
            `/vacancy/search?query=${query}&offset=${offset}&limit=${limit}`,
            'GET',
        );
    }

    /**
     * Получение списка вакансий по категории и по введённому выражению
     * @param {string[]} categories - выбранные категории
     * @param {string} query - выражение которое будем искать в вакансиях
     * @param {number} offset - с какой вакансии по счёту выводить
     * @param {number} limit - сколько выводить вакансий
     * @returns {Promise<Vacancy[]>}
     */
    async combined(
        categories: string[],
        query: string,
        offset: number,
        limit: number,
    ): Promise<Vacancy[]> {
        return this.#api.request(
            `/vacancy/search/combined?query=${query}&offset=${offset}&limit=${limit}`,
            'POST',
            JSON.stringify({ specializations: categories }),
        );
    }

    /**
     * Откклик на вакансию
     * @param {number} id - идентификатор вакансии
     * @return {Promise<void>}
     */
    async response(id: number): Promise<void> {
        await this.#api.request(`/vacancy/vacancy/${id}/response`, 'POST');
    }

    /**
     * Добавить вакансию в избранное
     * @param {number} id - идентификатор вакансии
     * @return {Promise<void>}
     */
    async favorite(id: number): Promise<void> {
        await this.#api.request(`/vacancy/vacancy/${id}/like`, 'POST');
    }
}
