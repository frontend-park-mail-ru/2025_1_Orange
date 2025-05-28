import { ChatInfoShort } from '../../api/interfaces';
import { logger } from '../../utils/logger';
import template from './chatList.handlebars';
import { ChatItem } from '../chatItem/chatItem';
import './chatList.sass';

export class ChatList {
    readonly #parent: HTMLElement;
    #chats: ChatInfoShort[] = [];
    #id: number | null = null;

    /**
     * Конструктор класса
     * @param {HTMLElement} parent  - родительский элемент
     */
    constructor(parent: HTMLElement, data: { id: number | null; chats: ChatInfoShort[] }) {
        this.#parent = parent;
        this.#id = data.id;
        this.#chats = data.chats;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return this.#parent.querySelector('.chat_list') as HTMLElement;
    }

    click = (id: number) => {
        const event = new CustomEvent('chat-change', {
            detail: id,
            bubbles: true,
            cancelable: true,
        });

        this.self.dispatchEvent(event);
    };

    /**
     * Удаление компонента
     */
    remove = () => {
        logger.info('chatList remove method called');
        this.self.remove();
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('chatList render method called');
        this.#parent.insertAdjacentHTML('beforeend', template({}));
        if (this.self) {
            this.#chats.forEach((chat) => {
                const chatItem = new ChatItem(this.self, chat, this.click);
                chatItem.render();
                if (this.#id && chat.id === this.#id) chatItem.chatClick();
            });
        }
    };
}
