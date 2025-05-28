import { ChatInfoShort } from '../../api/interfaces';
import { logger } from '../../utils/logger';
import template from './chatPage.handlebars';
import { api } from '../../api/api';
import notification from '../notificationContainer/notificationContainer';
import { router } from '../../router';
import { ChatContainer } from '../chatContainer/chatContainer';
import { ChatItem } from '../chatItem/chatItem';
import './chatPage.sass';
import { ChatList } from '../chatList/chatLIst';
import { BurgerMenu } from '../burgerMenu/burgerMenu';

export class ChatPage {
    readonly #parent: HTMLDialogElement;
    #id: number | null = null;
    #chats: ChatInfoShort[] = [];
    #chatContainer: HTMLElement | null = null;

    /**
     * Получение вакансий
     * @return {Vacancy}
     */
    init = async () => {
        const url = window.location.href.split('/');
        const id = Number.parseInt(url[url.length - 1]);
        if (isNaN(id)) this.#id = null;
        else this.#id = id;
        try {
            this.#chats = await api.chat.all();
        } catch {
            notification.add('FAIL', 'Ошибка при загрузке списка чатов');
            router.back();
        }
    };

    /**
     * Конструктор класса
     * @param {HTMLDialogElement} parent  - родительский элемент
     */
    constructor(parent: HTMLDialogElement) {
        this.#parent = parent;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById('chat_page') as HTMLElement;
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
     * Навешивание обработчиков
     */
    readonly #addEventListeners = () => {
        if (this.self) {
            this.self.addEventListener('chat-change', async (e) => {
                const event = e as CustomEvent<number>;
                if (this.#chatContainer) {
                    this.#chatContainer.innerHTML = '';
                    try {
                        const container = new ChatContainer(this.#chatContainer, event.detail);
                        await container.init();
                        container.render();
                    } catch {
                        console.log('Ошибка при переключении чата');
                    }
                }
            });
        }
    };

    /**
     * Удаление компонента
     */
    remove = () => {
        logger.info('chatPage remove method called');
        this.self.remove();
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('chatPage render method called');
        this.#parent.insertAdjacentHTML('beforeend', template({}));
        this.#chatContainer = this.self.querySelector('.chat__page') as HTMLElement;
        this.#addEventListeners();
        const chatItemContainer = this.self.querySelector('.chat__items') as HTMLElement;
        if (this.#id === null) {
            const chatContainer = new ChatContainer(this.#chatContainer);
            chatContainer.render();
        }
        if (chatItemContainer) {
            this.#chats.forEach((chat) => {
                const chatItem = new ChatItem(chatItemContainer, chat, this.click);
                chatItem.render();
                if (this.#id && chat.id === this.#id) chatItem.chatClick();
            });
        }
        const burger = new BurgerMenu(this.self, ChatList, { id: this.#id, chats: this.#chats });
        burger.render();
    };
}
