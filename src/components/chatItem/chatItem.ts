import { ChatInfoShort } from '../../api/interfaces';
import { logger } from '../../utils/logger';
import template from './chatItem.handlebars';
import './chatItem.sass';

export class ChatItem {
    readonly #parent: HTMLElement;
    readonly #click: (id: number) => void;
    readonly #data: ChatInfoShort;

    /**
     * Конструктор класса
     * @param {HTMLElement} parent  - родительский элемент
     */
    constructor(parent: HTMLElement, data: ChatInfoShort, click: (id: number) => void) {
        this.#parent = parent;
        this.#data = data;
        this.#click = click;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return this.#parent.querySelector(`#chat-${this.#data.id}`) as HTMLElement;
    }

    /**
     * Навешивание обработчиков
     */
    readonly #addEventListeners = () => {
        if (this.self) {
            this.self.addEventListener('click', this.chatClick);
            const burger = document.querySelector('.burger__button.burger__button--open');
            if (burger) burger.dispatchEvent(new CustomEvent('click'));
        }
    };

    /**
     * Клик на чат
     */
    chatClick = () => {
        const selected = document.querySelectorAll('.chat-item--selected');
        selected.forEach((element) => {
            if (element.id !== `chat-${this.#data.id}`)
                element.classList.remove('chat-item--selected');
        });
        this.self.classList.add('chat-item--selected');
        this.self.setAttribute('data-chatid', this.#data.id + '');
        this.#click(this.#data.id);
    };

    /**
     * Очистка
     */
    remove = () => {
        logger.info('chatItem remove method called');
        this.self.innerHTML = '';
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('chatItem render method called');
        this.#parent.insertAdjacentHTML('beforeend', template({ ...this.#data }));
        this.#addEventListeners();
    };
}
