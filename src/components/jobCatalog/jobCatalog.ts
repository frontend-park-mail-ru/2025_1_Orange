import { JobCard } from '../jobCard/jobCard';
import './jobCatalog.sass';
import { logger } from '../../utils/logger';
import template from './jobCatalog.handlebars';
import { JobCatalogFilter } from '../jobCatalogFilter/jobCatalogFilter';
import { VacancyShort } from '../../api/interfaces';
import { vacancyShortMock } from '../../api/mocks';
import { api } from '../../api/api';

export class JobCatalog {
    readonly #parent: HTMLElement;
    #jobs: VacancyShort[] | null = null;

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
            this.#jobs = null;
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
     * Рендеринг страницы
     */
    render = async () => {
        logger.info('JobCatalog render method called');
        this.#parent.insertAdjacentHTML('beforeend', template({}));
        const filter = new JobCatalogFilter(this.self.querySelector('.jobs_filter') as HTMLElement);
        filter.render();
        this.#jobs = [vacancyShortMock];
        this.#jobs?.forEach((element) => {
            const card = new JobCard(this.self.querySelector('.jobs_list') as HTMLElement, element);
            card.render();
        });
        // this.init().then(() => {
        //     if (!this.#jobs) {
        //         const jobsList = this.self.querySelector('.jobs_list') as HTMLElement
        //         jobsList.textContent = "Вакансий не найдено"
        //     }
        //     this.#jobs?.forEach(element => {
        //         const card = new JobCard(this.self.querySelector('.jobs_list') as HTMLElement, element);
        //         card.render();
        //     });
        // })
    };
}
