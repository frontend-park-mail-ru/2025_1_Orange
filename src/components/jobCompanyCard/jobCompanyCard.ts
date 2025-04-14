import { EmployerShort } from '../../api/interfaces';
import { router } from '../../router';
import { logger } from '../../utils/logger';
import template from './jobCompanyCard.handlebars';
import './jobCompanyCard.sass';

export class JobCompanyCard {
    readonly #parent: HTMLElement;
    readonly #props: EmployerShort;

    constructor(parent: HTMLElement, company: EmployerShort) {
        this.#parent = parent;
        this.#props = company;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById(`companyCard-${this.#props.id.toString()}`) as HTMLElement;
    }

    /**
     * Навешивание обработчиков
     */
    readonly #addEventListeners = () => {
        this.self.addEventListener('click', () => router.go(`/profileCompany/${this.#props.id}`));
    };

    render = () => {
        this.#parent.insertAdjacentHTML('beforeend', template(this.#props));
        logger.info('JobCompanyCard rendered:', this.#props.company_name);
        this.#addEventListeners();
    };
}
