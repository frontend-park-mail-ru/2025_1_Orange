import './deleteButton.sass';
import { logger } from '../../utils/logger';
import template from './deleteButton.handlebars';
import confirmTemplate from './deleteConfirm.handlebars';

export class DeleteButton {
    readonly #parent: HTMLElement;
    #deleteButton: HTMLElement | null = null;
    #cancelButton: HTMLElement | null = null;
    readonly #callback: () => void;

    constructor(parent: HTMLElement, callback: () => void) {
        this.#parent = parent;
        this.#callback = callback;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return this.#parent.querySelector('.delete__action') as HTMLElement;
    }

    /**
     * Рендеринг шаблона подтверждения
     */
    #confirm(): void {
        logger.info('DeleteButton confirm method called');
        this.#parent.innerHTML = ''; // Очистка содержимого родителя
        this.#parent.insertAdjacentHTML('beforeend', confirmTemplate({}));

        // Навешиваем обработчики на кнопки "Отмена" и "Удалить"
        this.#cancelButton = this.#parent.querySelector('.job__button_second');
        if (this.#cancelButton) {
            this.#cancelButton.addEventListener('click', (e: Event) => {
                e.preventDefault()
                this.render()
        }); // Возвращаемся к начальному шаблону
        }

        this.#deleteButton = this.#parent.querySelector('.button__delete');
        if (this.#deleteButton) {
            this.#deleteButton.addEventListener('click', (e: Event) => {
                e.preventDefault()
                this.#handleDelete()
            });
        }
    }

    /**
     * Обработка удаления
     */
    readonly #handleDelete = () => {
        this.#callback();
    };

    /**
     * Очистка
     */
    remove = (): void => {
        logger.info('DeleteButton remove method called');
        this.self.remove();
    };

    /**
     * Рендеринг компонента
     */
    render = (): void => {
        logger.info('DeleteButton render method called');
        this.#parent.innerHTML = '';
        this.#parent.insertAdjacentHTML('beforeend', template({}));

        this.#deleteButton = this.#parent.querySelector('.button__delete');
        if (this.#deleteButton) {
            this.#deleteButton.addEventListener('click', (e: Event) => {
                e.preventDefault()
                this.#confirm()
            });
        }
    };
}
