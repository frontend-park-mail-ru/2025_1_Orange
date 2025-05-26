import './resumeCatalogFilter.sass';
import { logger } from '../../utils/logger';
import template from './resumeCatalogFilter.handlebars';
import { store } from '../../store';

export class ResumeCatalogFilter {
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
        return document.forms.namedItem('resume_catalog_filter') as HTMLFormElement;
    }

    /**
     * Обработчики событий
     */
    readonly #addEventListeners = () => {
        this.#pagination.forEach((radio) => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    store.data.resumeLimit = Number.parseInt(radio.value);
                }
            });
        });
    };

    /**
     * Очистка
     */
    remove = () => {
        logger.info('ResumeCatalogFilter remove method called');
        this.self.remove();
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('ResumeCatalogFilter render method called');

        this.#parent.insertAdjacentHTML('beforeend', template());

        this.#pagination = document.querySelectorAll('input[name="pagination"]');

        this.#pagination.forEach((radio) => {
            if (radio.value === '' + store.data.resumeLimit) radio.checked = true;
        });
        this.#addEventListeners();
    };
}
