import { router } from '../../router';
import { logger } from '../../utils/logger';
import template from './registerDialog.handlebars';

export class RegisterDialog {
    readonly #parent: HTMLDialogElement;
    #registerButton: HTMLElement | null = null;
    #loginButton: HTMLElement | null = null;

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
        this.#registerButton = this.self.querySelector('.job__button');
        this.#loginButton = this.self.querySelector('.job__button_second');
        if (this.#registerButton) {
            this.#registerButton.addEventListener('click', () => {
                router.go('/auth');
            });
        }
        if (this.#loginButton) {
            this.#loginButton.addEventListener('click', () => {
                router.go('/auth');
            });
        }
    };

    /**
     * Очистка
     */
    remove = () => {
        logger.info('registerDialog remove method called');
        this.self.innerHTML = '';
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('RegisterDialog render method called');
        this.#parent.insertAdjacentHTML('beforeend', template({}));
        this.#addEventListeners();
    };
}
