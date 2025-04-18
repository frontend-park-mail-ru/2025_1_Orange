import { JobCard } from '../jobCard/jobCard';
import './jobCatalog.sass';
import { logger } from '../../utils/logger';
import template from './jobCatalog.handlebars';
import { JobCatalogFilter } from '../jobCatalogFilter/jobCatalogFilter';
import { VacancyShort } from '../../api/interfaces';
import { api } from '../../api/api';
import { router } from '../../router';
import { store } from '../../store';
import { emptyEmployer } from '../../api/empty';

export class JobCatalog {
    readonly #parent: HTMLElement;
    #jobs: VacancyShort[]  = [];
    #createResumeLink: HTMLLinkElement | null = null;

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
        try {
            this.#jobs = await api.vacancy.all();
        } catch (error) {
            logger.error('Ошибка при загрузке вакансий:', error);
            this.#jobs = [];
        }
        for (const element of this.#jobs) {
            try {
                const data = await api.employer.get(element.employer_id);
                element.employer = data;
            } catch {
                element.employer = emptyEmployer
            }
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

    #addEventListeners = () => {
        if (this.#createResumeLink) {
            this.#createResumeLink.addEventListener('click', (e: Event) => {
                e.preventDefault();
                if (store.data.authorized && store.data.user.role === 'applicant') router.go('/createResume');
                else if (!store.data.authorized) router.go('/auth')
            });
        }
    };

    /**
     * Рендеринг страницы
     */
    render = async () => {
        logger.info('JobCatalog render method called');
        this.#parent.insertAdjacentHTML('beforeend', template({}));
        const filter = new JobCatalogFilter(this.self.querySelector('.jobs_filter') as HTMLElement);
        filter.render();
        this.#jobs.forEach((element) => {
            const card = new JobCard(this.self.querySelector('.jobs_list') as HTMLElement, element);
            card.render();
        });
        if (this.#jobs.length === 0) {
            const jobContainer = this.self.querySelector('.jobs_list') as HTMLElement;
            jobContainer.textContent = 'Нет вакансий';
        }
        this.#createResumeLink = this.self.querySelector('.info__link') as HTMLLinkElement;

        this.#addEventListeners();
    };
}
