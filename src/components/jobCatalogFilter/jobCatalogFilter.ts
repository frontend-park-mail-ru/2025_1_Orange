import './jobCatalogFilter.sass';
import { logger } from '../../utils/logger';
import template from './jobCatalogFilter.handlebars';
import { store } from '../../store';

export class JobCatalogFilter {
    readonly #parent: HTMLElement;
    #pagination: NodeListOf<HTMLInputElement> = [];

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
    get self(): HTMLFormElement {
        return document.forms.namedItem('job_catalog_filter') as HTMLFormElement;
    }

    /**
     * Очистка
     */
    remove = () => {
        logger.info('JobCatalogFilter remove method called');
        this.self.remove();
    };

    /**
     * Обработчики событий
     */
    readonly #addEventListeners = () => {
        this.#pagination.forEach((radio) => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    store.data.vacancyLimit = Number.parseInt(radio.value);
                }
            });
        });
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('JobCatalogFilter render method called');

        this.#parent.insertAdjacentHTML('beforeend', template());

        this.#pagination = document.querySelectorAll('input[name="pagination"]');

        this.#pagination.forEach((radio) => {
            if (radio.value === '' + store.data.vacancyLimit) radio.checked = true;
        });
        this.#addEventListeners();
    };
}
