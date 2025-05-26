import { Api } from './api';
import { NotificationWS } from './interfaces';

export class NotificationService {
    readonly #api: Api;

    constructor(api: Api) {
        this.#api = api;
    }

    /**
     * Получение списка всех уведомлений
     * @returns {Promise<NotificationWS[]>}
     */
    async all(): Promise<NotificationWS[]> {
        return this.#api.request(`/notification/user`, 'GET');
    }

    /**
     * Прочитать уведомление
     * @param {number} id - идентификатор уведомления
     * @returns {Promise<void>}
     */
    async read(id: number): Promise<void> {
        return this.#api.request(`/notification/read/${id}`, 'PUT');
    }

    /**
     * Прочитать все уведомления
     * @returns {Promise<void>}
     */
    async readAll(): Promise<void> {
        return this.#api.request(`/notification/readAll`, 'PUT');
    }

    /**
     * Удаление всех уведомлений
     * @returns {Promise<void>}
     */
    async clear(): Promise<void> {
        await this.#api.request(`/notification/clear`, 'DELETE');
    }
}
