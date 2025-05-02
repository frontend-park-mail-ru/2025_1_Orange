import template from './pollForm.handlebars';
import starTemplate from '../../partials/star.handlebars';
import { logger } from '../../utils/logger';
import './pollForm.sass';
import { store } from '../../store';
import { router } from '../../router';

export class PollForm {
    readonly #parent: HTMLElement;
    #closeButton: HTMLButtonElement | null = null;
    #submitButton: HTMLButtonElement | null = null;
    #stars: number = 1;
    #starsButtons: NodeListOf<HTMLElement> = [];

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     */
    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById('poll_form') as HTMLElement;
    }

    /**
     * Добавление обработчиков событий
     */
    addEventListeners = () => {
        if (this.self) {
            this.#closeButton = this.self.querySelector('.poll__close')
            this.#submitButton = this.self.querySelector('.job__button')
            this.#starsButtons = this.self.querySelectorAll('.poll__star')
            if (this.#closeButton) {
                this.#closeButton.addEventListener('click', () => {
                    console.log("POLL FORM: CLOSE")
                    // Отправка события о закрытии iframe
                    window.parent.postMessage("CLOSE", '*');
                })
            }
            if (this.#submitButton) {
                this.#submitButton.addEventListener('click', (e: Event) => {
                    e.preventDefault();
                    console.log("POLL FORM: SUBMIT", this.#stars)
                    // Отправка события о отправке голоса
                    window.parent.postMessage({
                        poll_id: store.data.review.poll_id,
                        answer: this.#stars
                    }, '*');
                })
            }

            this.#starsButtons.forEach((element) => {
                element.addEventListener('click', () => {
                    console.log("STAR CLICKED", element)
                    if (element.id) {
                        const splittedId = element.id.split('_')
                        const id = Number.parseInt(splittedId[splittedId.length - 1]) || 0
                        this.#stars = id;
                        this.#renderStars()
                    }
                })
            })
        }

        window.addEventListener('message', function (event) {
            console.log("IFRAME GET", event.data)
            // Событие получения данных об опросе с основного окна
            if (event.data.poll_id && event.data.name) {
                store.data.review.name = event.data.name
                store.data.review.poll_id = event.data.poll_id
                router.go('/review')
            }
            // Событие о ошибке при отправке
            if (event.data === "ERROR")
                console.log("ERROR")
        });
    };

    /**
     * Рендеринг звёзд
     */
    readonly #renderStars = () => {
        for (let i = 1; i < 6; i++) {
            const element = document.getElementById(`poll__star_${i}`)
            if (element) {
                element.innerHTML = ''
                let checked = true
                if (i > this.#stars) checked = false
                element.insertAdjacentHTML(
                    'beforeend',
                    starTemplate({
                        checked
                    }),
                );
            }
        }
    }

    /**
     * Очистка
     */
    remove = () => {
        logger.info('ProfileUser remove method called');
        this.self.remove();
    };

    /**
     * Рендеринг страницы
     */
    render = () => {
        logger.info('pollForm render method called');
        // Если нету вопроса что бы показывать не рендерим
        if (store.data.review.poll_id !== 0) {
            this.#parent.insertAdjacentHTML(
                'beforeend',
                template({
                    ...store.data.review
                }),
            );
        }
        this.#renderStars()
        this.addEventListeners();
    };
}
