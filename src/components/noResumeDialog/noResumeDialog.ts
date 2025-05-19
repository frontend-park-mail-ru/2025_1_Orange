import { router } from '../../router';
import { logger } from '../../utils/logger';
import template from './noResumeDialog.handlebars';

export class NoResumeDialog {
    readonly #parent: HTMLDialogElement;
    #createButton: HTMLElement | null = null;

    /**
     * Конструктор класса
     * @param {HTMLDialogElement} parent  - родительский элемент
     */
    constructor(parent: HTMLDialogElement) {
        this.#parent = parent;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLDialogElement}
     */
    get self(): HTMLDialogElement {
        return this.#parent;
    }

    /**
     * Навешивание обработчиков
     */
    readonly #addEventListeners = () => {
        this.#createButton = this.self.querySelector('.job__button');
        if (this.#createButton) {
            this.#createButton.addEventListener('click', () => {
                router.go('/createResume');
            });
        }
    };

    /**
     * Очистка
     */
    remove = () => {
        logger.info('noResumeDialog remove method called');
        this.self.innerHTML = '';
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('noResumeDialog render method called');
        this.#parent.insertAdjacentHTML('beforeend', template({}));
        this.#addEventListeners();
    };
}
