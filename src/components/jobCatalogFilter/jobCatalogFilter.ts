import './jobCatalogFilter.sass';
import { logger } from '../../utils/logger';
import template from './jobCatalogFilter.handlebars';

export class JobCatalogFilter {
    readonly #parent: HTMLElement;

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
     * Рендеринг компонента
     */
    render = () => {
        logger.info('JobCatalogFilter render method called');

        this.#parent.insertAdjacentHTML('beforeend', template());
    };
}
