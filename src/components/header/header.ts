import { store } from '../../store';
import './header.sass';
import { router } from '../../router';
import { logger } from '../../utils/logger';
import template from './header.handlebars';
import { api } from '../../api/api';

export class Header {
    readonly #parent: HTMLElement;
    #dropdownVisible: boolean = false;
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
        this.#logoutButton = document.getElementById('logout_profile_link');
        this.#profileIcon = this.self.querySelector('.header__profile-icon');
        this.#dropdownItems = this.self.querySelectorAll('.header__dropdown__item');
        this.#logoLink = this.self.querySelector('.header__name');
        this.#profileLink = document.getElementById('profile_page_link');
        this.#editProfileLink = document.getElementById('edit_profile_page_link');
        this.#pollStatisticsLink = document.getElementById('poll_statistics_page_link');
        this.#mobileVacancy = document.getElementById('mobile_vacancy');
        this.#mobileResume = document.getElementById('mobile_resume');
        this.#mobileCreate = document.getElementById('mobile_create')

        this.#vacancyCatalogLink = document.getElementById('vacancy_catalog_link');
        this.#resumeCatalogLink = document.getElementById('resume_catalog_link');

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
                store.reset();
                const frame = document.getElementById('review_frame')
                if (frame) frame.hidden = true
                router.go('/catalog');
            } catch {
                logger.info('ERROR LOGOUT');
                router.go('/catalog');
            }
        });

        this.#profileIcon?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(undefined);
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
            })
        }
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('Header render method called');

        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...store.data,
                isEmployer: store.data.user.role === 'employer',
            }),
        );
        this.addEventListeners();
    };
}
