import './notificationCardWS.sass';
import { logger } from '../../utils/logger';
import template from './notificationCardWS.handlebars';
import type { NotificationWS } from '../../api/interfaces';

export class NotificationCardWS {
    readonly #parent: HTMLElement;
    readonly #notification: NotificationWS;
    #element: HTMLElement | null = null;
    #onStatusChange?: () => void;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     * @param notification {NotificationWS} - данные уведомления
     * @param onStatusChange {() => void} - колбэк при изменении статуса прочитанности
     */
    constructor(parent: HTMLElement, notification: NotificationWS, onStatusChange?: () => void) {
        this.#parent = parent;
        this.#notification = notification;
        this.#onStatusChange = onStatusChange;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        if (!this.#element) {
            this.#element = document.querySelector(
                `[data-id="${this.#notification.id}"]`,
            ) as HTMLElement;
        }
        return this.#element;
    }

    /**
     * Получение данных уведомления
     */
    get notification(): NotificationWS {
        return this.#notification;
    }

    /**
     * Обработчики событий
     */
    readonly #addEventListeners = () => {
        this.self.addEventListener('click', this.#handleClick);
    };

    /**
     * Обработчик клика по уведомлению
     */
    readonly #handleClick = (event: Event) => {
        event.stopPropagation(); // Предотвращаем всплытие события
        logger.info('NotificationCardWS click', this.#notification.id);

        // Если уведомление непрочитанное, отмечаем как прочитанное
        if (!this.#notification.is_viewed) {
            this.markAsRead();
            this.#onStatusChange?.(); // Вызываем колбэк для обновления бейджа
        }

        // Здесь можно добавить логику перехода к соответствующей странице
        // Например, к вакансии или резюме
    };

    /**
     * Отметить уведомление как прочитанное
     */
    markAsRead = () => {
        if (this.#notification.is_viewed) return;

        this.#notification.is_viewed = true;

        const indicator = this.self.querySelector('.notification-indicator');
        if (indicator) {
            indicator.innerHTML = `
                <svg class="read-check" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </svg>
            `;
        }

        this.self.setAttribute('data-viewed', 'true');

        // Здесь можно добавить API вызов для отметки уведомления как прочитанного
        logger.info('Notification marked as read', this.#notification.id);
    };

    /**
     * Отметить уведомление как непрочитанное
     */
    markAsUnread = () => {
        if (!this.#notification.is_viewed) return;

        this.#notification.is_viewed = false;

        const indicator = this.self.querySelector('.notification-indicator');
        if (indicator) {
            indicator.innerHTML = '<div class="unread-dot"></div>';
        }

        this.self.setAttribute('data-viewed', 'false');

        logger.info('Notification marked as unread', this.#notification.id);
    };

    /**
     * Переключить состояние прочитанности
     */
    toggleReadStatus = () => {
        if (this.#notification.is_viewed) {
            this.markAsUnread();
        } else {
            this.markAsRead();
        }
        this.#onStatusChange?.(); // Вызываем колбэк для обновления бейджа
    };

    /**
     * Очистка
     */
    remove = () => {
        logger.info('NotificationCardWS remove method called');
        this.self.removeEventListener('click', this.#handleClick);
        this.self.remove();
    };


    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('NotificationCardWS render method called');

        // Подготавливаем данные для шаблона
        const templateData = {
            ...this.#notification,
            eq: (a: any, b: any) => a === b,
        };

        this.#parent.insertAdjacentHTML('beforeend', template(templateData));
        this.#addEventListeners();
    };
}
