import template from './resumeRow.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';
import { Resume } from '../../api/interfaces';
import './resumeRow.sass';
import { router } from '../../router';

export class ResumeRow {
    readonly #parent: HTMLElement;
    #data: Resume;

    constructor(parent: HTMLElement, data: Resume) {
        this.#parent = parent;
        this.#data = data;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById(`resume-table__row-${this.#data.id}`) as HTMLElement
    }

    /**
     * Очистка
     */
    remove = () => {
        logger.info('ProfileUser remove method called');
        this.self.innerHTML = '';
    };

    /**
     * Навешивание обработчика
     */
    readonly #addEventListeners = () => {
        if (this.self) {
            this.self.addEventListener('click', () => {
                router.go(`/resume/${this.#data.id}`)
            })
        }
    }

    /**
     * Рендеринг страницы
     */
    render = () => {
        if (this.#data) {
            const update_at = new Date(this.#data.updated_at)
            this.#data.updated_at = update_at.toLocaleDateString('ru-RU')
        }

        logger.info('ProfileUser render method called');
        this.#parent.insertAdjacentHTML('beforeend', template(this.#data));
        this.#addEventListeners()
    };
}
