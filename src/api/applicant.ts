import { Api } from './api';
import {
    Applicant,
    ApplicantEdit,
    AuthResponse,
    SigninRequest,
    SignupRequest,
    Static,
    VacancyShort,
} from './interfaces';

export class ApplicantService {
    readonly #api: Api;

    constructor(api: Api) {
        this.#api = api;
    }

    /**
     * Получение информации о профиле соискателя
     * @returns {Promise<Applicant>}
     */
    async get(id: number): Promise<Applicant> {
        return this.#api.request(`/applicant/profile/${id}`, 'GET');
    }

    /**
     * Обновление информации о профиле соискателя
     * @param {ApplicantEdit} body - новая информация о соискателе
     * @returns {Promise<Applicant>}
     */
    async update(body: ApplicantEdit): Promise<Applicant> {
        return this.#api.request('/applicant/profile', 'PUT', JSON.stringify(body));
    }

    /**
     * Обновление автарки в профиле соискателя
     * @param {FormData} body - новая автарарка соискателя
     * @returns {Promise<Static>}
     */
    async avatar(body: FormData): Promise<Static> {
        return this.#api.request('/applicant/avatar', 'POST', body, 'multipart/form-data');
    }

    /**
     * Авторизация за соискателя
     * @param {SigninRequest} body - почта и пароль для входа
     * @returns {AuthResponse} - id профиля
     */
    async login(body: SigninRequest): Promise<AuthResponse> {
        return this.#api.request('/applicant/login', 'POST', JSON.stringify(body));
    }

    /**
     * Регистрация за соискателя
     * @param {SignupRequest} body - информация для регистрации
     * @returns {AuthResponse} - id профиля
     */
    async register(body: SignupRequest): Promise<AuthResponse> {
        return this.#api.request('/applicant/register', 'POST', JSON.stringify(body));
    }

    /**
     * Получение списка откликов соискателя
     * @param {number} id - id профиля
     * @param {number} offset - с какого отклика выводить
     * @param {number} limit - сколько откликов выводить
     * @returns {VacancyShort}
     */
    async responsed(id: number, offset: number, limit: number): Promise<VacancyShort[]> {
        return this.#api.request(
            `/vacancy/applicant/${id}/vacancies?offset=${offset}&limit=${limit}`,
            'GET',
        );
    }

    /**
     * Получение списка откликов соискателя
     * @param {number} id - id профиля
     * @param {number} offset - с какого отклика выводить
     * @param {number} limit - сколько откликов выводить
     * @returns {VacancyShort}
     */
    async liked(id: number, offset: number, limit: number): Promise<VacancyShort[]> {
        return this.#api.request(
            `/vacancy/applicant/${id}/liked?offset=${offset}&limit=${limit}`,
            'GET',
        );
    }
}
