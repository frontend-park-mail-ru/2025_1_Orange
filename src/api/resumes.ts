import { Api } from './api';
import { Resume, ResumeCreate, ResumeShort } from './interfaces';

export class ResumeService {
    readonly #api: Api;

    constructor(api: Api) {
        this.#api = api;
    }

    /**
     * Получение списка всех резюме
     * @param {number} offset - с какого резюме выводить
     * @param {number} limit - сколько резюме выводить
     * @returns {Promise<ResumeShort[]>}
     */
    async all(offset: number, limit: number): Promise<ResumeShort[]> {
        return this.#api.request(`/resume/all?offset=${offset}&limit=${limit}`, 'GET');
    }

    /**
     * Создание нового резюме
     * @param {ResumeCreate} body - информация нового резюме
     * @returns {Promise<Resume>}
     */
    async create(body: ResumeCreate): Promise<Resume> {
        return this.#api.request('/resume/create', 'POST', JSON.stringify(body));
    }

    /**
     * Получение резюме по ID
     * @param {number} id - идентификатор резюме
     * @returns {Promise<Resume>}
     */
    async get(id: number): Promise<Resume> {
        return this.#api.request(`/resume/${id}`, 'GET');
    }

    /**
     * Обновление резюме
     * @param {number} id - идентификатор резюме
     * @param {ResumeCreate} body - новая инфомация резюме
     * @returns {Promise<Resume>}
     */
    async update(id: number, body: ResumeCreate): Promise<Resume> {
        return this.#api.request(`/resume/${id}`, 'PUT', JSON.stringify(body));
    }

    /**
     * Удаление резюме
     * @param {number} id - идентификатор резюме
     * @returns {Promise<void>}
     */
    async delete(id: number): Promise<void> {
        await this.#api.request(`/resume/${id}`, 'DELETE');
    }

    /**
     * Поиск резюме по введённой строке
     * @param {string} query - строка которую будем искать в резюме
     * @param {number} offset - с какого резюме выводить
     * @param {number} limit - сколько резюме выводить
     * @returns {Promise<ResumeShort[]>}
     */
    async search(query: string, offset: number, limit: number): Promise<ResumeShort[]> {
        return this.#api.request(
            `/resume/search?profession=${query}&offset=${offset}&limit=${limit}`,
            'GET',
        );
    }

    async pdf(id: number): Promise<Blob> {
        return this.#api.request(
            `/resume/pdf/${id}`,
            'GET',
            null,
            'application/json',
            'applicaion/pdf',
        );
    }
}
