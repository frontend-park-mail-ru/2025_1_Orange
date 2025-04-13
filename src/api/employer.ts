import { Api } from './api';
import { AuthResponse, Employer, EmployerEdit, SigninRequest, SignupRequest, Static } from './interfaces';

export class EmployerService {
    readonly #api: Api;

    constructor(api: Api) {
        this.#api = api;
    }

    /**
     * Получение информации о профиле компании
     * @param {number} id - идентификатор компании
     * @returns {Promise<Employer>}
     */
    async get(id: number): Promise<Employer> {
        return this.#api.request(`/employer/profile/${id}`, 'GET');
    }

    /**
     * Обновление информации о профиле компании
     * @param {EmployerEdit} body -новая информация о компании
     * @returns {Promise<Employer>}
     */
    async update(body: EmployerEdit): Promise<Employer> {
        return this.#api.request('/employer/profile', 'PUT', JSON.stringify(body));
    }

    /**
     * Авторизация за работадателя
     * @param {SigninRequest} body - почта и пароль для входа
     * @returns {AuthResponse} - id профиля
     */
    async login(body: SigninRequest): Promise<AuthResponse> {
        return this.#api.request('/employer/login', 'POST', JSON.stringify(body));
    }

    /**
     * Обновление логитпа компании в профиле
     * @param {FormData} body - новый логотип компании
     * @returns {Promise<Static>}
     */
    async logo(body: FormData): Promise<Static> {
        return this.#api.request('/employer/logo', 'POST', body, 'multipart/form-data');
    }

    /**
     * Регистрация за работадателя
     * @param {SignupRequest} body - информация для регистрации
     * @returns {AuthResponse} - id профиля
     */
    async register(body: SignupRequest): Promise<AuthResponse> {
        return this.#api.request('/employer/register', 'POST', JSON.stringify(body));
    }
}
