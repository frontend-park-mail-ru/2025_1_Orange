import { Api } from './api';
import { Resume, ResumeCreate } from './interfaces';

export class ResumeService {
    readonly #api: Api;

    constructor(api: Api) {
        this.#api = api;
    }

    /**
     * Получение списка всех резюме
     * @returns {Promise<Resume[]>}
     */
    async all(): Promise<Resume[]> {
        return this.#api.request('/resume/all', 'GET');
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
}
