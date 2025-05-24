import './notificationContainerWS.sass';
import { logger } from '../../utils/logger';
import template from './notificationContainerWS.handlebars';
import type { NotificationWS } from '../../api/interfaces';
import { NotificationCardWS } from '../notificationCardWS/notificationCardWS';

export class NotificationContainerWS {
    readonly #parent: HTMLElement;
    #notifications: NotificationWS[] = [];
    #notificationCards: NotificationCardWS[] = [];
    #element: HTMLElement | null = null;
    #closeButton: HTMLElement | null = null;
    #readAllButton: HTMLElement | null = null;
    #deleteAllButton: HTMLElement | null = null;
    #notificationsList: HTMLElement | null = null;
    #emptyState: HTMLElement | null = null;
    #actions: HTMLElement | null = null;
    #onClose?: () => void;
    #onBadgeUpdate?: () => void;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     * @param notifications {NotificationWS[]} - массив уведомлений
     * @param onClose {() => void} - колбэк для закрытия контейнера
     * @param onBadgeUpdate {() => void} - колбэк для обновления бейджа
     */
    constructor(
        parent: HTMLElement,
        notifications: NotificationWS[] = [],
        onClose?: () => void,
        onBadgeUpdate?: () => void,
    ) {
        this.#parent = parent;
        this.#notifications = notifications;
        this.#onClose = onClose;
        this.#onBadgeUpdate = onBadgeUpdate;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        if (!this.#element) {
            this.#element = document.getElementById('notifications-container') as HTMLElement;
        }
        return this.#element;
    }

    /**
     * Получение количества непрочитанных уведомлений
     */
    get unreadCount(): number {
        return this.#notifications.filter((n) => !n.is_viewed).length;
    }

    /**
     * Обработчики событий
     */
    readonly #addEventListeners = () => {
        this.#closeButton = this.self.querySelector('.close-btn');
        this.#readAllButton = this.self.querySelector('.read-all');
        this.#deleteAllButton = this.self.querySelector('.delete-all');
        this.#notificationsList = this.self.querySelector('#notificationsList');
        this.#emptyState = this.self.querySelector('#emptyState');
        this.#actions = this.self.querySelector('#actions');

        this.#closeButton?.addEventListener('click', this.#handleClose);
        this.#readAllButton?.addEventListener('click', this.#handleReadAll);
        this.#deleteAllButton?.addEventListener('click', this.#handleDeleteAll);

        // Предотвращаем закрытие при клике внутри контейнера
        this.self.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    };

    /**
     * Обработчик закрытия контейнера
     */
    readonly #handleClose = () => {
        logger.info('NotificationContainerWS close');
        this.#onClose?.();
    };

    /**
     * Обработчик "Прочитать все"
     */
    readonly #handleReadAll = () => {
        logger.info('NotificationContainerWS read all');

        this.#notificationCards.forEach((card) => {
            card.markAsRead();
        });

        this.#notifications.forEach((notification) => {
            notification.is_viewed = true;
        });

        // Обновляем бейдж
        this.#onBadgeUpdate?.();

        // Здесь можно добавить API вызов для отметки всех уведомлений как прочитанных
    };

    /**
     * Обработчик "Удалить все"
     */
    readonly #handleDeleteAll = () => {
        logger.info('NotificationContainerWS delete all');

        if (confirm('Удалить все уведомления?')) {
            this.#clearNotifications();
            this.#updateEmptyState();
            this.#onBadgeUpdate?.(); // Обновляем бейдж

            // Здесь можно добавить API вызов для удаления всех уведомлений
        }
    };

    /**
     * Очистка всех уведомлений
     */
    readonly #clearNotifications = () => {
        this.#notificationCards.forEach((card) => card.remove());
        this.#notificationCards = [];
        this.#notifications = [];

        // Очищаем DOM
        if (this.#notificationsList) {
            this.#notificationsList.innerHTML = '';
        }
    };

    /**
     * Обновление состояния пустого списка
     */
    readonly #updateEmptyState = () => {
        const hasNotifications = this.#notifications.length > 0;

        if (this.#notificationsList) {
            this.#notificationsList.classList.toggle('hidden', !hasNotifications);
        }

        if (this.#emptyState) {
            this.#emptyState.classList.toggle('hidden', hasNotifications);
        }

        if (this.#actions) {
            this.#actions.classList.toggle('hidden', !hasNotifications);
        }

        logger.info(
            `Notifications state updated: ${hasNotifications ? 'has notifications' : 'empty'}`,
            this.#notifications.length,
        );
    };

    /**
     * Добавление нового уведомления
     */
    addNotification = (notification: NotificationWS) => {
        this.#notifications.unshift(notification);

        if (this.#notificationsList) {
            const card = new NotificationCardWS(this.#notificationsList, notification, this.#onBadgeUpdate);
            card.render();
            this.#notificationCards.unshift(card);
        }

        this.#updateEmptyState();
    };

    /**
     * Рендеринг уведомлений
     */
    readonly #renderNotifications = () => {
        if (!this.#notificationsList) return;

        this.#notifications.forEach((notification) => {
            const card = new NotificationCardWS(this.#notificationsList!, notification, this.#onBadgeUpdate);
            card.render();
            this.#notificationCards.push(card);
        });
    };

    /**
     * Очистка
     */
    remove = () => {
        logger.info('NotificationContainerWS remove method called');
        this.#notificationCards.forEach((card) => card.remove());
        this.self.remove();
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('NotificationContainerWS render method called');

        this.#parent.insertAdjacentHTML('beforeend', template({}));
        this.#addEventListeners();
        this.#renderNotifications();
        this.#updateEmptyState();
    };
}
