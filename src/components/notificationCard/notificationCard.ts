import './notificationCard.sass';
import { logger } from '../../utils/logger';
import template from './notificationCard.handlebars';

export class NotificationCard {
    readonly #parent: HTMLElement;
    readonly #status: 'OK' | 'FAIL';
    readonly #header: string;
    readonly #message: string | null;
    #closeButton: HTMLElement | null = null;
    readonly #id: number;

    /**
     * Конструктор класса
     * @param {HTMLElement} parent  - родительский элемент
     * @param {'OK' | 'FAIL'} status - статус уведомления
     * @param {string} header - заголовок уведомления
     * @param {string | null} message - текст уведомления
     * @param {number}
     */
    constructor(
        parent: HTMLElement,
        status: 'OK' | 'FAIL',
        header: string,
        message: string | null = null,
    ) {
        this.#parent = parent;
        this.#status = status;
        this.#header = header;
        this.#message = message;
        this.#id = Date.now();
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById(`notification-${this.#id}`) as HTMLElement;
    }

    /**
     * Навешивание обработчиков
     */
    readonly #addEventListeners = () => {
        this.#closeButton = this.self.querySelector('.notification__close');
        if (this.#closeButton) {
            this.#closeButton.addEventListener('click', () => {
                this.remove();
            });
        }
    };

    /**
     * Очистка
     */
    remove = () => {
        logger.info('JobCard remove method called');
        this.self.remove();
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('NotificationCard render method called');
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                status: this.#status === 'OK',
                header: this.#header,
                message: this.#message,
                id: this.#id,
            }),
        );
        setTimeout(() => this.remove(), 1000 * 10);
        this.#addEventListeners();
    };
}
