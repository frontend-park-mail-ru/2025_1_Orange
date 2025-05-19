import './dialog.sass';
import { logger } from '../../utils/logger';
import template from './dialog.handlebars';

export class DialogContainer {
    readonly #parent: HTMLElement;
    readonly #name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly #component: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly #data: any;
    #content: HTMLElement | null = null;
    #closeButton: HTMLElement | null = null;

    /**
     * Конструктор класса
     * @param {HTMLElement} parent  - родительский элемент
     * @param {string} name - название диалога
     * @param {Object} component - сообщение диалога
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(parent: HTMLElement, name: string, component: any, data: any = null) {
        this.#parent = parent;
        this.#name = name;
        this.#component = component;
        this.#data = data;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLDialogElement}
     */
    get self(): HTMLDialogElement {
        return document.getElementById(`dialog-${this.#name}`) as HTMLDialogElement;
    }

    /**
     * Открытие диалога
     */
    readonly open = () => {
        this.self?.showModal();
    };

    /**
     * Навешивание обработчиков
     */
    readonly #addEventListeners = () => {
        this.#closeButton = this.self.querySelector('.dialog__close');
        if (this.#closeButton) {
            this.#closeButton.addEventListener('click', () => {
                this.self?.close();
            });
        }
        this.self?.addEventListener('click', (event) => {
            if (event.target instanceof Node && !this.#content?.contains(event.target)) {
                this.self?.close();
            }
        });

        this.self?.addEventListener('close', () => {
            // Удаляем элемент из DOM после закрытия диалога
            this.self?.remove();
        });
    };

    /**
     * Очистка
     */
    remove = () => {
        logger.info('Dialog remove method called');
        this.self.remove();
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('Dailog render method called');
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                name: this.#name,
            }),
        );
        this.#content = this.self?.querySelector('.dialog__content');
        if (this.#content && this.self && this.#data) {
            const component = new this.#component(this.#content, this.#data);
            if (component.render) component.render();
            if (component.addEventListener) component.addEventListener();
        } else if (this.#content && this.self) {
            const component = new this.#component(this.#content);
            if (component.render) component.render();
            if (component.addEventListener) component.addEventListener();
        }
        this.#addEventListeners();
        this.open();
    };
}
