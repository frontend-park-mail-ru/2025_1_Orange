import notification from "../components/notificationContainer/notificationContainer";
import { store } from "../store";
import { NotificationWS } from "./interfaces";

class WebSocketApi {
    readonly #url: string;
    #ws: WebSocket | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    #events: Record<string, (data: any) => void> = {};

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
            notification.add('FAIL','Соединение уже установлено');
            return;
        }

        this.#ws = new WebSocket(this.#url);

        this.#ws.addEventListener('open', () => {
            console.log('WS: соединение установлено');
        });

        this.#ws.addEventListener('message', (event) => {
            try {
                const message = JSON.parse(event.data);

                if (message && message.type && message.data) {

                    if (this.#events[message.type] !== null) {
                        this.#events[message.type](message.data);
                    } else {
                        console.log(`WS: не найдено событие type=${message.type}`);
                    }
                }
            } catch {
                console.log('WS: ошибка при получении сообщения');
            }
        });

        this.#ws.addEventListener('close', () => {
            console.log('WS: Закрыто');
        });

        this.#ws.addEventListener('error', (err) => {
            console.log('WS:', `Ошибка ${err}`);
        });
    }

    /**
     * Закрытие WS
     */
    public close(): void {
        if (this.#ws) {
            this.#ws.close();
            this.#events = {};
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
    public add(type: string, handler: (data:any) => void) {
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

export const ws = new WebSocketApi('ws://localhost:8000/api/v1/notification/ws');

const addNotification = (notification: NotificationWS) => {
    if (store.data.authorized) {
        store.data.notifications.push(notification)
    }
}

const addMessage = () => {
    if (store.data.authorized && store.data.page === 'chat') {
        console.log('TODO ADD')
    }
}

export const activate = () => {
    ws.create()
    ws.add('notification', addNotification)
    ws.add('message', addMessage)
}