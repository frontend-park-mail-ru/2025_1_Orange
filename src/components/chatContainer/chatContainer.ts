import { ChatInfo, ChatMessage, ChatMessageSend, Employer } from '../../api/interfaces';
import { logger } from '../../utils/logger';
import template from './ChatContainer.handlebars';
import messageTemplate from '../../partials/message.handlebars';
import { store } from '../../store';
import { api } from '../../api/api';
import notification from '../notificationContainer/notificationContainer';
import { ws } from '../../api/webSocket';
import { router } from '../../router';

export class ChatContainer {
    readonly #parent: HTMLElement;
    #data: ChatInfo | null = null;
    #messages: ChatMessage[] | null = null;
    #button: HTMLElement | null = null;
    #messagesContainer: HTMLElement | null = null;
    #employer: Employer | null = null;
    #resumeLink: HTMLElement | null = null;
    #vacancyLink: HTMLElement | null = null;
    readonly #chat_id: number | null = null;

    /**
     * Конструктор класса
     * @param {HTMLElement} parent  - родительский элемент
     * @param {number} chat_id - id чата
     */
    constructor(parent: HTMLElement, chat_id: number | null = null) {
        this.#parent = parent;
        this.#chat_id = chat_id;
    }

    /**
     * Получение ифнормации о чате и сообщений
     */
    init = async () => {
        if (this.#chat_id === null) {
            return;
        }
        try {
            this.#data = await api.chat.get(this.#chat_id);
            this.#messages = await api.chat.messages(this.#chat_id);
            this.#employer = await api.employer.get(this.#data.vacancy.employer_id);
        } catch {
            notification.add('FAIL', 'Ошибка при загрузке чата');
        }
    };

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.querySelector('.chat__page') as HTMLElement;
    }

    /**
     * Навешивание обработчиков
     */
    readonly #addEventListeners = () => {
        this.#resumeLink = document.querySelector('.chat_link--resume');
        this.#vacancyLink = document.querySelector('.chat_link--vacancy');
        const buttonContainer = document.querySelector('.chat__send');
        if (buttonContainer) this.#button = buttonContainer?.querySelector('button');
        const formSendMessage = document.forms.namedItem('chat-send');
        if (this.#button && formSendMessage) {
            formSendMessage.addEventListener('submit', (e) => {
                e.preventDefault();
                const buttonContainer = document.querySelector('.chat__send');
                const input = buttonContainer?.querySelector('input');
                if (buttonContainer && input && this.#data) {
                    const message = {
                        type: 'message',
                        chat_id: this.#data.id,
                        payload: input.value,
                    } as ChatMessageSend;
                    ws.send(message);
                    input.value = '';
                }
            });
        }
        if (this.#resumeLink)
            this.#resumeLink.addEventListener('click', () => {
                router.go(`/resume/${this.#data?.resume.id}`);
            });
        if (this.#vacancyLink)
            this.#vacancyLink.addEventListener('click', () => {
                router.go(`/vacancy/${this.#data?.vacancy.id}`);
            });
        if (this.#messagesContainer) {
            this.#messagesContainer.addEventListener('new-message', (e) => {
                if (!this.#messagesContainer) return;
                notification.add('OK', 'Пришло сообщение');
                const event = e as CustomEvent<ChatMessage>;
                if (event.detail.chat_id !== this.#chat_id) return;
                this.#addMessage(event.detail);
                if (this.#isYou(event.detail))
                    this.#messagesContainer.scrollTo({
                        top: this.#messagesContainer.scrollHeight,
                        behavior: 'smooth',
                    });
            });
        }
    };

    /**
     * Удаление компонента
     */
    remove = () => {
        logger.info('chatContainer remove method called');
        this.self.innerHTML = '';
    };

    /**
     * Форматирование времени
     */
    readonly #formatTime = (mesage: ChatMessage) => {
        const date = new Date(mesage.sent_at);

        const hours = date.getHours();
        const minutes = date.getMinutes();

        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    };

    readonly #isYou = (message: ChatMessage): boolean => {
        if (message.from_applicant && store.data.user.role === 'applicant') return true;
        if (message.from_applicant === false && store.data.user.role === 'employer') return true;
        return false;
    };

    readonly #addMessage = (message: ChatMessage) => {
        const isYou = this.#isYou(message);
        if (this.#messagesContainer) {
            this.#messagesContainer?.insertAdjacentHTML(
                'beforeend',
                messageTemplate({
                    message: message,
                    isYou: isYou,
                    sent_at: this.#formatTime(message),
                }),
            );
        }
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('chatContainer render method called');
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                data: this.#data,
                empty: this.#chat_id === null,
                employer: this.#employer,
            }),
        );
        this.#messagesContainer = document.querySelector('.chat__container');
        if (this.#messagesContainer) {
            this.#messages?.forEach((message) => this.#addMessage(message));
            this.#messagesContainer.scrollTo({
                top: this.#messagesContainer.scrollHeight,
                behavior: 'smooth',
            });
        }
        this.#addEventListeners();
    };
}
