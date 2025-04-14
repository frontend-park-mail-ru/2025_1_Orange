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
        if (this.#data) {
            const update_at = new Date(this.#data.updated_at)
            this.#data.updated_at = `${update_at.getUTCDate()}.${update_at.getUTCMonth()+1}.${update_at.getFullYear()}`
        }

        logger.info('ProfileUser render method called');
        this.#parent.insertAdjacentHTML('beforeend', template(this.#data));
    };
}
