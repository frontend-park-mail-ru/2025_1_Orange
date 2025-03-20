import { JobCard } from '../jobCard/jobCard';
import './jobCatalog.css';
import { Api } from '../../api/api.js';
import { logger } from '../../utils/logger.js';
import Handlebars from 'handlebars';

export class JobCatalog {
    #parent : HTMLElement;
    #api : Api;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     */
    constructor(parent : HTMLElement) {
        this.#parent = parent;
        this.#api = new Api();
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self() : HTMLElement{
        return document.querySelector('.jobs_list') as HTMLElement;
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
         
        const template = Handlebars.templates['jobCatalog/jobCatalog'];
        this.#parent.insertAdjacentHTML('beforeend', template({}));
        try {
            const jobs = await this.#api.getVacancies();
            for (const element of jobs) {
                const card = new JobCard(this.self, element);
                card.render();
            }
        } catch {
            this.self.textContent = 'Ничего не найдено';
        }
    };
}
