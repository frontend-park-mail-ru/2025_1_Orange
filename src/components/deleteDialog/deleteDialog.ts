import { logger } from '../../utils/logger';
import template from './deleteDialog.handlebars';

interface DeleteData {
    title?: string;
    message?: string;
    delete?: () => void;
}

export class DeleteDialog {
    readonly #parent: HTMLDialogElement;
    readonly #data: DeleteData;
    #deleteButton: HTMLElement | null = null;
    #cancelButton: HTMLElement | null = null;

    /**
     * Конструктор класса
     * @param {HTMLDialogElement} parent  - родительский элемент
     */
    constructor(parent: HTMLDialogElement, data: DeleteData) {
        this.#parent = parent;
        this.#data = data;
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
        this.#deleteButton = this.self.querySelector('.job__button--delete');
        this.#cancelButton = this.self.querySelector('.job__button_second');
        if (this.#deleteButton) {
            this.#deleteButton.addEventListener('click', () => {
                console.log(this.#data);
                if (this.#data.delete) this.#data.delete();
            });
        }
        if (this.#cancelButton) {
            this.#cancelButton.addEventListener('click', () => {
                const dialog = this.#cancelButton?.closest('dialog');
                if (dialog) dialog.close();
            });
        }
    };

    /**
     * Очистка
     */
    remove = () => {
        logger.info('deleteDialog remove method called');
        this.self.innerHTML = '';
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('deleteDialog render method called');
        this.#parent.insertAdjacentHTML('beforeend', template({ ...this.#data }));
        this.#addEventListeners();
    };
}
