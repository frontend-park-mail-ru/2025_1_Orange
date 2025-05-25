import { Api } from './api';
import { SalarySpecializationsResponse } from './interfaces';

export class SpecializationService {
    readonly #api: Api;

    constructor(api: Api) {
        this.#api = api;
    }

    /**
     * Получение статистики по специализациям
     * @returns {Promise<SalarySpecializationsResponse>}
     */
    async all(): Promise<SalarySpecializationsResponse> {
        return this.#api.request('/specialization/salaries', 'GET');
    }
}
