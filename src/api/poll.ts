import { Api } from './api';
import { PollStatistic, ReviewRequest, ReviewResponse } from './interfaces';


export class PollService {
    readonly #api: Api;

    constructor(api: Api) {
        this.#api = api;
    }

    /**
     * Получение нового опроса
     * @returns {Promise<ReviewResponse>}
     */
    async get(): Promise<ReviewResponse> {
        return this.#api.request(`/poll/new`, 'GET');
    }

    /**
     * Отпрака оценки опроса
     * @param {ReviewRequest} body - оценка опроса
     * @returns {Promise<Void>}
     */
    async answer(body: ReviewRequest): Promise<void> {
        return this.#api.request('/poll/vote', 'POST', JSON.stringify(body));
    }

    /**
     * Получаем статискику ответов
     * @returns {Promise<PollStatistic[]>} - Список статистики
     */
    async statics(): Promise<PollStatistic[]> {
        return this.#api.request('/poll/stats', 'GET')
    }
}