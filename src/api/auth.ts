import { Api } from './api';
import { AuthResponse } from './interfaces';

export class AuthService {
    readonly #api: Api;

    constructor(api: Api) {
        this.#api = api;
    }

    /**
     * Проверка использования почты. Если почта занята, то возвращается 200, иначе 400
     * @param {string} email
     * @returns {Promise<void>}
     */
    async checkEmailApplicant(email: string): Promise<{ role: string }> {
        return await this.#api.request('/applicant/emailExists', 'POST', JSON.stringify({ email }));
    }

    /**
     * Проверка использования почты. Если почта занята, то возвращается 200, иначе 400
     * @param {string} email
     * @returns {Promise<void>}
     */
    async checkEmailEmployer(email: string): Promise<{ role: string }> {
        return await this.#api.request('/employer/emailExists', 'POST', JSON.stringify({ email }));
    }

    /**
     * Проверка на авторизацию. Вызывается при загрузке страницы
     * @returns {Promise<AuthResponse>}
     */
    async auth(): Promise<AuthResponse> {
        return this.#api.request('/auth/isAuth', 'GET');
    }

    /**
     * Выход из аккаунта. Если нет ошибки значит успешно
     * @returns {Promise<void>}
     */
    async logout(): Promise<void> {
        await this.#api.request('/auth/logout', 'POST');
    }
}
