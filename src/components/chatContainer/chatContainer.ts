import { logger } from '../../utils/logger';
import template from './chatItem.handlebars';

interface ChatItemProps {
    id: number;
    image: string;
    message: string;
    time: string;
}

export class ChatContainer {
    readonly #parent: HTMLDialogElement;
    readonly #data: ChatItemProps;
    readonly #click: () => void;

    /**
     * Конструктор класса
     * @param {HTMLDialogElement} parent  - родительский элемент
     */
    constructor(parent: HTMLDialogElement, data: ChatItemProps, click: () => void) {
        this.#parent = parent;
        this.#data = data;
        this.#click = click;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById(`chat-${this.#data.id}`) as HTMLElement;
    }

    /**
     * Навешивание обработчиков
     */
    readonly #addEventListeners = () => {
        if (this.self) {
            this.self.addEventListener('click', () => {
                const selected = document.querySelectorAll('chat-item--selected');
                selected.forEach((element) => {
                    if (element.id !== `chat-${this.#data.id}`)
                        element.classList.remove('chat-item--selected');
                });
                this.self.classList.add('chat-item--selected');
                this.#click(this.#data.id);
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
