import { JobCard } from '../jobCard/jobCard';
import './jobCatalog.sass';
import { logger } from '../../utils/logger';
import template from './jobCatalog.handlebars';
import noVacancy from '../../partials/noVacancy.handlebars';
import { JobCatalogFilter } from '../jobCatalogFilter/jobCatalogFilter';
import { VacancyShort } from '../../api/interfaces';
import { api } from '../../api/api';
import { router } from '../../router';
import { store } from '../../store';
import { BurgerMenu } from '../burgerMenu/burgerMenu';
import notification from '../notificationContainer/notificationContainer';
import { SalaryCarousel } from '../salaryCarousel/salaryCarousel';

export class JobCatalog {
    readonly #parent: HTMLElement;
    #jobContainer: HTMLElement | null = null;
    #jobs: VacancyShort[] = [];
    #createResumeLink: HTMLLinkElement | null = null;
    #categories: NodeListOf<HTMLElement> = [];
    #searchForm: HTMLFormElement | null = null;
    #paginationButton: HTMLElement | null = null;
    #salaryCarousel: SalaryCarousel | null = null;
    #noVacancy: boolean = true;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     */
    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    /**
     * Получение вакансий
     * @return {Vacancy}
     */
    init = async () => {
        store.data.vacancyOffset = 0;
        await this.#getVacancy();
        store.data.vacancyOffset += store.data.vacancyLimit;
        if (this.#jobs.length === 0) this.#noVacancy = true
        else this.#noVacancy = false
    };

    readonly #getVacancy = async () => {
        try {
            if (store.data.vacancyCategory !== '')
                this.#jobs = await api.vacancy.combined([store.data.vacancyCategory], store.data.vacancySearch, store.data.vacancyOffset, store.data.vacancyLimit, store.data.vacancyFilter.employment, store.data.vacancyFilter.experience,store.data.vacancyFilter.min_salary)
            else 
                this.#jobs = await api.vacancy.combined([], store.data.vacancySearch, store.data.vacancyOffset, store.data.vacancyLimit, store.data.vacancyFilter.employment, store.data.vacancyFilter.experience,store.data.vacancyFilter.min_salary)
        } catch (error) {
            notification.add('FAIL', 'Ошибка при загрузке вакансий');
            logger.error('Ошибка при загрузке вакансий:', error);
            this.#jobs = [];
        }
    };

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById('job_catalog_page') as HTMLElement;
    }

    /**
     * Очистка
     */
    remove = () => {
        logger.info('JobCatalog remove method called');
        this.self.remove();
    };

    /**
     * Выбор другой категории
     * @param {string} name - название выбранной категории
     * @returns {void}
     */
    readonly #setCategory = async (name: string) => {
        if (this.#categories) {
            this.#categories.forEach((c) => {
                if (c.textContent === name) {
                    c.classList.add('job_category__badge--active');
                    const element = this.self.querySelector(
                        '.job_category__badge--active',
                    ) as HTMLElement;
                    const parent = element.parentElement;
                    parent?.removeChild(c);
                    parent?.insertBefore(element, parent?.firstChild as HTMLElement);
                } else c.classList.remove('job_category__badge--active');
            });
        }
    };

    /**
     * Поиск вакансии
     * @param {string} query - строка для поиска
     * @returns {void}
     */
    readonly #searchVacancy = async (query: string) => {
        if (query === store.data.vacancySearch) return;
        store.data.vacancySearch = query;
        router.go('/catalog');
    };

    /**
     * Рендеринг карточек вакансий хранящихся в #jobs
     */
    readonly #renderVacancy = () => {
        if (this.#jobContainer) {
            this.#jobs.forEach((element) => {
                const card = new JobCard(this.#jobContainer as HTMLElement, element);
                card.render();
            });
            if (this.#noVacancy) {
                this.#jobContainer.insertAdjacentHTML(
            'beforeend',
            noVacancy({
                search: store.data.vacancySearch,
            }),
        );
            }
            this.#paginationButton = document.getElementById('pagination_button') as HTMLElement;
            if (this.#jobs.length < store.data.vacancyLimit) this.#paginationButton?.remove();
        }
    };

    /**
     * Инициализация карусели зарплат
     */
    readonly #initSalaryCarousel = async () => {
        const salaryCarouselContainer = this.self.querySelector(
            '.salary_carousel_container',
        ) as HTMLElement;
        if (salaryCarouselContainer) {
            this.#salaryCarousel = new SalaryCarousel(salaryCarouselContainer);
            try {
                await this.#salaryCarousel.init();
                this.#salaryCarousel.render();
            } catch {
                notification.add('FAIL', 'Ошибка при поиске статистики');
            }
        }
    };

    /**
     * Навешивание обработчиков
     */
    readonly #addEventListeners = () => {
        if (this.#jobContainer) {
            this.#jobContainer.addEventListener('new-filters', async () => {
                await this.init().then(() => {
                    if (this.#jobContainer) this.#jobContainer.innerHTML = ''
                    this.#renderVacancy()
                })

            })
        }
        if (this.#createResumeLink) {
            this.#createResumeLink.addEventListener('click', (e: Event) => {
                e.preventDefault();
                if (store.data.authorized && store.data.user.role === 'applicant')
                    router.go('/createResume');
                else if (!store.data.authorized) router.go('/auth');
            });
        }
        this.#categories = document.querySelectorAll('.job_category__badge');
        if (this.#categories) {
            this.#categories.forEach((category) => {
                category.addEventListener('click', () => {
                    if (category.textContent) {
                        this.#setCategory(category.textContent);
                        if (store.data.vacancyCategory === category.textContent) {
                            store.data.vacancyCategory = '';
                            router.go('/catalog');
                        } else {
                            store.data.vacancyCategory = category.textContent;
                            router.go('/catalog');
                        }
                    }
                });
            });
        }
        this.#searchForm = document.forms.namedItem('vacancy_search') as HTMLFormElement;
        if (this.#searchForm) {
            this.#searchForm.addEventListener('submit', (e: Event) => {
                e.preventDefault();
                if (this.#searchForm) {
                    const searchField = this.#searchForm.elements.namedItem(
                        'search',
                    ) as HTMLInputElement;
                    const value = searchField.value.trim();
                    this.#searchVacancy(value);
                }
            });
        }
        this.#paginationButton = document.getElementById('pagination_button') as HTMLElement;
        if (this.#paginationButton) {
            this.#paginationButton.addEventListener('click', async () => {
                try {
                    await this.#getVacancy();
                    store.data.vacancyOffset += store.data.vacancyLimit;
                } catch {
                    this.#paginationButton?.remove();
                }
                this.#renderVacancy();
            });
        }
    };

    /**
     * Рендеринг страницы
     */
    render = async () => {
        logger.info('JobCatalog render method called');
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                search: store.data.vacancySearch,
                empty: this.#noVacancy
            }),
        );

        const filterContainer = this.self.querySelector('.jobs_filter');
        if (filterContainer) {
            const filter = new JobCatalogFilter(filterContainer as HTMLElement);
            filter.mobile = false;
            filter.render();
        }

        // Инициализация карусели зарплат
        try {
            await this.#initSalaryCarousel();
        } catch {
            logger.info('Ошибка при рендеринге карусели');
        }

        this.#createResumeLink = this.self.querySelector('.info__link') as HTMLLinkElement;
        this.#jobContainer = this.self.querySelector('.jobs_list') as HTMLElement;
        this.#renderVacancy();
        if (store.data.vacancyCategory !== '') {
            this.#categories = document.querySelectorAll('.job_category__badge');
            if (this.#categories) this.#setCategory(store.data.vacancyCategory);
        }
        this.#addEventListeners();
        const burger = new BurgerMenu(this.self, JobCatalogFilter);
        burger.render();
    };
}
