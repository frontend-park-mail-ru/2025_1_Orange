import { logger } from '../utils/logger.js';

interface Register {
    isEmployer: boolean;
    email: string;
    password: string;
    repeatPassword: string;
    firstName: string;
    lastName: string;
    companyName: string;
    companyAddress: string;
}

export class Api {
    readonly #baseUrl;

    /**
     * Конструктор класса api - взаимодействие с бекендом
     * @param {string} baseUrl - url бекенда
     */
    constructor(baseUrl = 'http://localhost:8000') {
        this.#baseUrl = baseUrl;
    }

    /**
     * Базовый метод отправки запроса
     * @param {string} endpoint
     * @param {string} method
     * @param {string|null} body
     * @returns
     */
    async request(endpoint: string, method : string = 'GET', body: unknown = null) {
        const url = this.#baseUrl + endpoint;
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const init: RequestInit = {
            method,
            headers,
            mode: 'cors',
            credentials: 'include',
            body: body !== null ? JSON.stringify(body) : null,
        };
        logger.info(url, init);
        try {
            const response = await fetch(url, init);
            if (!response.ok) {
                //Получаем json ошибки, если есть. Если тела нет, то пишем заглушку
                const error = await response.json();
                logger.error(`error: ${error.message}`);
                throw new Error(error.message || 'Ошибка при выполнении запроса');
            }

            return response.json();
        } catch {
            logger.error('Network Error while trying to send request');
            throw new Error('Ошибка при выполнении запроса');
        }
    }

    /**
     * Возвращает список вакансий
     * @returns {Object}
     */
    async getVacancies() {
        return this.request('/vacancies', 'GET');
    }

    /**
     * Регистрация аккаунта
     * @param {Object} body
     * @returns {Object}
     */
    async register(body : Register) {
        return this.request('/signup', 'POST', body);
    }

    /**
     * Проверка использования почты. Если почта занята, то возвращается 200, иначе 400
     * @param {string} email
     * @returns {null}
     */
    async getUser(email: string) {
        return this.request('/check-email', 'POST', { email });
    }

    /**
     * Авторзация аккаунта
     * @param {string} email
     * @param {string} password
     * @returns {Object}
     */
    async login(body: { email: string; password: string; }) {
        return this.request('/signin', 'POST', body);
    }

    /**
     * Проверка на авторизацию. Вызывается при загрузки страницы
     * @return {Object}
     */
    async auth() {
        return this.request('/auth', 'GET');
    }

    /**
     * Выход из аккаунта. Если нет ошибки значит успешно
     * @returns {null}
     */
    async logout() {
        return this.request('/logout', 'POST');
    }
}
