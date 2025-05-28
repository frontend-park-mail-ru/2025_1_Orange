import notification from '../components/notificationContainer/notificationContainer';
import { store } from '../store';
import { api } from './api';
import { ChatMessage, NotificationWS } from './interfaces';

class WebSocketApi {
    readonly #url: string;
    #ws: WebSocket | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    #events: Record<string, (data: any) => void> = {};
    #hardClose: boolean = false
    #retry: number = 3

    /**
     * Конструктор класса
     * @param {string} url - URL до ручки WS на бекенде
     */
    constructor(url: string) {
        this.#url = url;
    }

    /**
     * Создание соединения
     */
    public create() {
        if (this.#ws) {
            notification.add('FAIL', 'Соединение уже установлено');
            return;
        }

        this.#ws = new WebSocket(this.#url);

        this.#ws.addEventListener('open', () => {
            this.#retry = 3
            console.log('WS: соединение установлено');
        });

        this.#ws.addEventListener('message', (event) => {
            try {
                const message = JSON.parse(event.data);

                if (message && message.type && message.payload) {
                    if (this.#events[message.type] !== null) {
                        this.#events[message.type](message.payload);
                    } else {
                        console.log(`WS: не найдено событие type=${message.type}`);
                    }
                }
            } catch {
                console.log('WS: ошибка при получении сообщения');
            }
        });

        this.#ws.addEventListener('close', () => {
            if (this.#hardClose === false && this.#retry > 0) {
                this.#ws = null;
                this.#retry -= 1;
                this.create()
            }
            console.log('WS: Закрыто');
        });

        this.#ws.addEventListener('error', (err) => {
            console.log('WS:', `Ошибка ${err}`);
        });
    }

    /**
     * Отправка сообщения
     * @param {any} payload - объект на отправку
     * @returns {void}
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public send(payload: any) {
        if (this.#ws === null) {
            return;
        }
        try {
            const message = JSON.stringify(payload);
            this.#ws.send(message);
        } catch (err) {
            console.log('WS:', `Ошибка ${err}`);
        }
    }

    /**
     * Закрытие WS
     */
    public close(): void {
        if (this.#ws) {
            this.#hardClose = true;
            this.#ws.close();
            this.#events = {};
            this.#ws = null;
        } else {
            console.log('Нет активного соединения');
        }
    }

    /**
     * Добавление обработчика на сообщение
     * @param {string} type - тип сообщения (события)
     * @param {Function} handler - что делать при сообщении
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public add(type: string, handler: (data: any) => void) {
        this.#events[type] = handler;
    }

    /**
     * Удаление обработчика
     * @param type - тип сообщения
     */
    public delete(type: string): void {
        this.#events.delete(type);
    }
}

export const ws = new WebSocketApi('ws://localhost:8000/api/v1/ws/connect');

const addNotification = (data: NotificationWS) => {
    store.data.notifications.unshift(data);
    const nContainer = document.getElementById('notifications-container');
    const nHeader = document.querySelector('.header');
    const event = new CustomEvent('notification', { detail: data });
    if (nContainer) nContainer.dispatchEvent(event);
    if (nHeader) nHeader.dispatchEvent(event);
};

const addMessage = (data: ChatMessage) => {
    const messageContainer = document.querySelector('.chat__container') as HTMLElement;
    if (messageContainer) {
        notification.add('OK', 'WS принято');
        const event = new CustomEvent('new-message', { detail: data });
        messageContainer.dispatchEvent(event);
    }
};

export const activate = async () => {
    const data = await api.notification.all();
    if (data) store.data.notifications = data;

    ws.create();
    ws.add('notification', addNotification);
    ws.add('message', addMessage);
};
