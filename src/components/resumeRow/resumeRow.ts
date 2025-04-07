import template from './resumeRow.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';
import { Resume } from '../../api/interfaces';
import './resumeRow.sass';

export class ResumeRow {
    readonly #parent: HTMLElement;
    #data: Resume | null = null;

    constructor(parent: HTMLElement, data: Resume) {
        this.#parent = parent;
        this.#data = data;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return this.#parent;
    }

    /**
     * Очистка
     */
    remove = () => {
        logger.info('ProfileUser remove method called');
        this.self.innerHTML = '';
    };

    /**
     * Рендеринг страницы
     */
    render = () => {
        logger.info('ProfileUser render method called');
        this.#parent.insertAdjacentHTML('beforeend', template(this.#data));
    };
}
