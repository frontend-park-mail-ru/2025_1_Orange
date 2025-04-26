import { Api } from './api';
import { ReviewRequest, ReviewResponse } from './interfaces';


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
}