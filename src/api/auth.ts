import { Api } from './api';
import { SigninRequest, SignupRequest, User } from './interfaces';

export class AuthService {
    readonly #api: Api;

    constructor(api: Api) {
        this.#api = api;
    }

    /**
     * Регистрация аккаунта
     * @param {SignupRequest} body
     * @returns {Promise<User>}
     */
    async register(body: SignupRequest): Promise<User> {
        return this.#api.request('/signup', 'POST', JSON.stringify(body));
    }

    /**
     * Проверка использования почты. Если почта занята, то возвращается 200, иначе 400
     * @param {string} email
     * @returns {Promise<void>}
     */
    async checkEmail(email: string): Promise<void> {
        await this.#api.request('/check-email', 'POST', JSON.stringify({ email }));
    }

    /**
     * Авторизация аккаунта
     * @param {SigninRequest} body
     * @returns {Promise<User>}
     */
    async login(body: SigninRequest): Promise<User> {
        return this.#api.request('/signin', 'POST', JSON.stringify(body));
    }

    /**
     * Проверка на авторизацию. Вызывается при загрузке страницы
     * @returns {Promise<User>}
     */
    async auth(): Promise<User> {
        return this.#api.request('/auth', 'GET');
    }

    /**
     * Выход из аккаунта. Если нет ошибки значит успешно
     * @returns {Promise<void>}
     */
    async logout(): Promise<void> {
        await this.#api.request('/logout', 'POST');
    }
}
