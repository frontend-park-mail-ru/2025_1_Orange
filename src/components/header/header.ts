import { store, resetStore } from '../../store';
import './header.css';
import { router } from '../../router.js';
import { Api } from '../../api/api.js';
import { logger } from '../../utils/logger.js';
import template from './header.handlebars'

export class Header {
    #parent: HTMLElement;
    #dropdownVisible: boolean = false;
    #loginButton: HTMLElement | null = null;
    #logoutButton: HTMLElement | null = null;
    #profileIcon: HTMLElement | null = null;
    #dropdownItems: NodeListOf<HTMLElement> | null = null;
    #logoLink: HTMLElement | null = null;
    #createButton: HTMLElement | null = null;

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
     * Очистка
     */
    remove = () => {
        logger.info('Header remove method called');
        this.self.remove();
    };

    /**
     * Обработчик клика на документе для закрытия дропдауна
     */
    handleDocumentClick = (e: Event) => {
        const profileElement = this.self.querySelector('.header__profile');
        if (profileElement && !profileElement.contains(e.target as Node) && this.#dropdownVisible) {
            this.toggleDropdown(false);
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
     * Обработчики кнопок
     */
    addEventListeners = () => {
        this.#createButton = this.self.querySelector('.header__button');
        this.#loginButton = this.self.querySelector('.header__login');
        this.#logoutButton = this.self.querySelector('.header__logout');
        this.#profileIcon = this.self.querySelector('.header__profile-icon');
        this.#dropdownItems = this.self.querySelectorAll('.header__dropdown__item');
        this.#logoLink = this.self.querySelector('.header__name');

        this.#logoLink?.addEventListener('click', () => {
            router('catalog');
        });

        this.#loginButton?.addEventListener('click', () => {
            router('auth');
        });

        this.#logoutButton?.addEventListener('click', () => {
            router('catalog');
        });

        this.#profileIcon?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(undefined);
        });

        this.#createButton?.addEventListener('click', () => {
            if (store.user.authenticated === false) {
                router('auth');
            }
        });

        this.#dropdownItems?.forEach((item) => {
            if (item.classList.contains('header__dropdown__item--logout')) {
                item.addEventListener('click', () => {
                    this.toggleDropdown(false);
                    const api = new Api();
                    api.logout()
                        .then(() => {
                            resetStore();
                            router('catalog');
                        })
                        .catch(() => {
                            logger.error('Error occured while logging out');
                        });
                });
            } else {
                item.addEventListener('click', () => {
                    // тут пока заглушка
                    logger.info(`Clicked profile dropdown item: ${item.textContent}`);
                    this.toggleDropdown(false);
                });
            }
        });
        if (store.page === '') {
            document.addEventListener('click', this.handleDocumentClick);
        }
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('Header render method called');
         
        this.#parent.insertAdjacentHTML('beforeend', template(store));
        this.addEventListeners();
    };
}
