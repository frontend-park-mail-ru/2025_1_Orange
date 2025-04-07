import { VacancyShort } from '../../api/interfaces';
import { logger } from '../../utils/logger';
import template from './similarJobCard.handlebars';
import './similarJobCard.sass';

export class SimilarJobCard {
    readonly #parent: HTMLElement;
    readonly #job: VacancyShort;

    /**
     *
     * @param {HTMLElement} parent - место в которое будем рендерить
     * @param {VacancyShort} job - значения которые будем рендерить
     */
    constructor(parent: HTMLElement, job: VacancyShort) {
        this.#parent = parent;
        this.#job = job;
    }

    /**
     * Функция рендеринга
     */
    render = () => {
        this.#parent.insertAdjacentHTML('beforeend', template(this.#job));
        logger.info('SimilarJobCard rendered:', this.#job.employer.company_name);
    };
}
