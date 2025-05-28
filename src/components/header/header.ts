import { store } from '../../store';
import './header.sass';
import { router } from '../../router';
import { logger } from '../../utils/logger';
import template from './header.handlebars';
import { api } from '../../api/api';
import notification from '../notificationContainer/notificationContainer';
import { NotificationContainerWS } from '../notificationContainerWS/notificationContainerWS';
import { ws } from '../../api/webSocket';

export class Header {
    readonly #parent: HTMLElement;
    #dropdownVisible = false;
    #notificationsVisible = false;
    #loginButton: HTMLElement | null = null;
    #logoutButton: HTMLElement | null = null;
    #profileIcon: HTMLElement | null = null;
    #dropdownItems: NodeListOf<HTMLElement> | null = null;
    #logoLink: HTMLElement | null = null;
    #createButton: HTMLElement | null = null;
    #editProfileLink: HTMLElement | null = null;
    #pollStatisticsLink: HTMLElement | null = null;
    #profileLink: HTMLElement | null = null;
    #mobileVacancy: HTMLElement | null = null;
    #mobileResume: HTMLElement | null = null;
    #mobileCreate: HTMLElement | null = null;
    #notificationsBell: HTMLElement | null = null;
    #notificationsBadge: HTMLElement | null = null;
    #notificationsContainer: NotificationContainerWS | null = null;
    #chatButton: HTMLElement | null = null;

    #vacancyCatalogLink: HTMLElement | null = null;
    #resumeCatalogLink: HTMLElement | null = null;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     */
    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.querySelector('.header') as HTMLElement;
    }

    /**
     * Получение количества непрочитанных уведомлений
     */
    get unreadNotificationsCount(): number {
        return store.data.notifications.filter((n) => !n.is_viewed).length;
    }

    /**
     * Очистка
     */
    remove = () => {
        logger.info('Header remove method called');
        document.removeEventListener('click', this.handleDocumentClick);
        this.self.remove();
    };

    /**
     * Обработчик клика на документе для закрытия дропдауна
     */
    handleDocumentClick = (e: Event) => {
        const profileElement = this.self.querySelector('.header__profile');
        const notificationsElement = this.self.querySelector('.header__notifications');

        if (profileElement && !profileElement.contains(e.target as Node) && this.#dropdownVisible) {
            this.toggleDropdown(false);
        }

        if (
            notificationsElement &&
            !notificationsElement.contains(e.target as Node) &&
            this.#notificationsVisible
        ) {
            this.toggleNotifications(false);
        }
    };

    /**
     * Переключение видимости дропдауна
     * @param {boolean|undefined} state - принудительное состояние (true - показать, false - скрыть)
     */
    toggleDropdown = (state: boolean | undefined) => {
        const dropdown = this.self.querySelector('.header__dropdown') as HTMLElement;
        if (!dropdown) return;

        if (state !== undefined) {
            this.#dropdownVisible = state;
        } else {
            this.#dropdownVisible = !this.#dropdownVisible;
        }

        dropdown.style.display = this.#dropdownVisible ? 'block' : 'none';
    };

    /**
     * Переключение видимости уведомлений
     * @param {boolean|undefined} state - принудительное состояние (true - показать, false - скрыть)
     */
    toggleNotifications = (state: boolean | undefined) => {
        if (state !== undefined) {
            this.#notificationsVisible = state;
        } else {
            this.#notificationsVisible = !this.#notificationsVisible;
        }

        if (this.#notificationsVisible) {
            // Закрываем дропдаун профиля если открыт
            this.toggleDropdown(false);

            // Создаем контейнер уведомлений
            const notificationsElement = this.self.querySelector(
                '.header__notifications',
            ) as HTMLElement;
            this.#notificationsContainer = new NotificationContainerWS(
                notificationsElement,
                () => this.toggleNotifications(false),
                () => this.updateNotificationsBadge(), // Передаем колбэк для обновления бейджа
            );
            this.#notificationsContainer.render();
        } else {
            // Удаляем контейнер уведомлений
            this.#notificationsContainer?.remove();
            this.#notificationsContainer = null;
        }
    };

    /**
     * Обновление бейджа уведомлений
     */
    updateNotificationsBadge = () => {
        if (this.#notificationsBadge) {
            const count = this.unreadNotificationsCount;
            this.#notificationsBadge.textContent = count.toString();
            this.#notificationsBadge.classList.toggle('hidden', count === 0);

            logger.info('Notifications badge updated', count);
        }
    };

    /**
     * Обработчики кнопок
     */
    addEventListeners = () => {
        this.#createButton = this.self.querySelector('.header__button');
        this.#loginButton = this.self.querySelector('.header__login');
        this.#logoutButton = document.getElementById('logout_profile_link');
        this.#profileIcon = this.self.querySelector('.header__profile-icon');
        this.#dropdownItems = this.self.querySelectorAll('.header__dropdown__item');
        this.#logoLink = this.self.querySelector('.header__name');
        this.#profileLink = document.getElementById('profile_page_link');
        this.#editProfileLink = document.getElementById('edit_profile_page_link');
        this.#pollStatisticsLink = document.getElementById('poll_statistics_page_link');
        this.#mobileVacancy = document.getElementById('mobile_vacancy');
        this.#mobileResume = document.getElementById('mobile_resume');
        this.#mobileCreate = document.getElementById('mobile_create');
        this.#notificationsBell = document.getElementById('notifications-bell');
        this.#notificationsBadge = document.getElementById('notifications-badge');

        this.#vacancyCatalogLink = document.getElementById('vacancy_catalog_link');
        this.#resumeCatalogLink = document.getElementById('resume_catalog_link');
        this.#chatButton = document.querySelector('.header__chat');

        this.self.addEventListener('notification', () => {
            this.updateNotificationsBadge();
        });

        this.#logoLink?.addEventListener('click', () => {
            router.go('/catalog');
        });

        this.#pollStatisticsLink?.addEventListener('click', () => {
            router.go('/pollStatistics');
        });

        this.#loginButton?.addEventListener('click', () => {
            router.go('/auth');
        });

        this.#logoutButton?.addEventListener('click', async () => {
            try {
                await api.auth.logout();
                logger.info('LOGOUT SUCCESFULLY');
                notification.add('OK', `Успешно вышли из аккаунта`);
                store.reset();
                ws.close();
                const frame = document.getElementById('review_frame');
                if (frame) frame.hidden = true;
                router.go('/catalog');
            } catch {
                logger.info('ERROR LOGOUT');
                notification.add('FAIL', `Ошибка при выходе из аккаунта`);
                router.go('/catalog');
            }
        });

        this.#profileIcon?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(undefined);
        });

        this.#notificationsBell?.addEventListener('click', async (e) => {
            e.stopPropagation();
            const data = await api.notification.all();
            if (data) store.data.notifications = data;
            this.toggleNotifications(undefined);
        });

        this.#createButton?.addEventListener('click', () => {
            if (store.data.authorized === false) {
                router.go('/auth');
            } else if (store.data.user.role === 'applicant') {
                router.go('/createResume');
            } else {
                router.go('/createVacancy');
            }
        });

        this.#dropdownItems?.forEach((item) => {
            item.addEventListener('click', () => {
                logger.info(`Clicked profile dropdown item: ${item.textContent}`);
                this.toggleDropdown(false);
            });
        });

        this.#chatButton?.addEventListener('click', () => {
            router.go('/chat');
        });

        if (this.#profileLink) {
            this.#profileLink.addEventListener('click', () => {
                if (store.data.user.role === 'applicant')
                    router.go(`/profileUser/${store.data.user.user_id}`);
                else router.go(`/profileCompany/${store.data.user.user_id}`);
            });
        }

        if (this.#editProfileLink) {
            this.#editProfileLink.addEventListener('click', () => {
                if (store.data.user.role === 'applicant')
                    router.go(`/profileUserEdit/${store.data.user.user_id}`);
                else router.go(`/profileCompanyEdit/${store.data.user.user_id}`);
            });
        }

        if (this.#resumeCatalogLink) {
            this.#resumeCatalogLink.addEventListener('click', () => {
                router.go('/resumeCatalog');
            });
        }
        if (this.#vacancyCatalogLink) {
            this.#vacancyCatalogLink.addEventListener('click', () => {
                router.go('/catalog');
            });
        }

        if (this.#mobileResume) {
            this.#mobileResume.addEventListener('click', () => {
                router.go('/resumeCatalog');
            });
        }
        if (this.#mobileVacancy) {
            this.#mobileVacancy.addEventListener('click', () => {
                router.go('/catalog');
            });
        }

        if (this.#mobileCreate) {
            this.#mobileCreate.addEventListener('click', () => {
                if (store.data.authorized === false) {
                    router.go('/auth');
                } else if (store.data.user.role === 'applicant') {
                    router.go('/createResume');
                } else {
                    router.go('/createVacancy');
                }
            });
        }
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('Header render method called');

        const unreadCount = this.unreadNotificationsCount;

        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...store.data,
                isEmployer: store.data.user.role === 'employer',
                unreadCount: unreadCount > 0 ? unreadCount : null,
            }),
        );
        this.addEventListeners();
        this.updateNotificationsBadge();
    };
}
