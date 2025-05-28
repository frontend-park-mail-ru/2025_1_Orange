import { Api } from './api';
import { ChatInfo, ChatInfoShort, ChatMessage } from './interfaces';

export class ChatService {
    readonly #api: Api;

    constructor(api: Api) {
        this.#api = api;
    }

    /**
     * Получение списка всех чатов
     * @returns {Promise<ChatInfoShort[]>}
     */
    async all(): Promise<ChatInfoShort[]> {
        return this.#api.request(`/chat/user`, 'GET');
    }

    /**
     * Создание нового чата
     * @param {number} vacancy_id - id вакансии
     * @returns {Promise<ChatInfo>}
     */
    async create(vacancy_id: number): Promise<ChatInfo> {
        return this.#api.request(`/chat/vacancy/${vacancy_id}`, 'POST');
    }

    /**
     * Получение чата по ID
     * @param {number} id - идентификатор чата
     * @returns {Promise<ChatInfo>}
     */
    async get(id: number): Promise<ChatInfo> {
        return this.#api.request(`/chat/${id}`, 'GET');
    }

    /**
     * Получение сообщений чата
     * @param {number} id - идентификатор чата
     * @returns {Promise<ChatMessage[]>}
     */
    async messages(id: number): Promise<ChatMessage[]> {
        return this.#api.request(`/chat/${id}/messages`, 'GET');
    }
}
