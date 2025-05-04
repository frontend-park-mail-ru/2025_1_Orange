import template from './pollForm.handlebars';
import starTemplate from '../../partials/star.handlebars';
import { logger } from '../../utils/logger';
import './pollForm.sass';
import { store } from '../../store';
import { api } from '../../api/api';
import { router } from '../../router';
import { emptyReview } from '../../api/empty';
import { ReviewMock } from '../../api/mocks';

export class PollForm {
    readonly #parent: HTMLElement;
    #closeButton: HTMLButtonElement | null = null;
    #submitButton: HTMLButtonElement | null = null;
    #stars: number = 1;
    #starsButtons: NodeListOf<HTMLElement> = [];

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    // init = async () => {
    //     logger.info('pollForm init method called');
    //     if (
    //         !store.data.authorized
    //     )
    //         router.back();
    //     try {
    //         if (store.data.review.id === 0) {
    //         //const data = await api.applicant.get(1);
    //         //console.log("API", data)
    //         store.data.review = ReviewMock
    //         console.log("STORE UPDATED", store.data.review)
    //         }
    //     } catch {
    //         logger.info('Не удалось загрузить страницу');
    //         router.back();
    //     }
    // };

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
                    window.parent.postMessage("CLOSE", '*');
                })
            }
            if (this.#submitButton) {
                this.#submitButton.addEventListener('click', (e: Event) => {
                    e.preventDefault();
                    console.log("POLL FORM: SUBMIT", this.#stars)
                    window.parent.postMessage({
                        poll_id: store.data.review.poll_id,
                        answer: this.#stars
                    }, '*');
                })
            }

            console.log("STARS ", this.#starsButtons)
            this.#starsButtons.forEach((element) => {
                element.addEventListener('click', () => {
                    console.log("STAR CLICKED", element)
                    if (element.id) {
                        const splittedId = element.id.split('_')
                        const id = Number.parseInt(splittedId[splittedId.length - 1]) || 0
                        this.#stars = id;
                        this.#renderStars()
                    } else console.log("POLL FORM: CANT FIND ID", element)
                })
            })
        }

        window.addEventListener('message', function (event) {
            console.log("IFRAME GET", event.data)
            if (event.data.poll_id && event.data.name) {
                store.data.review.name = event.data.name
                store.data.review.poll_id = event.data.poll_id
                router.go('/review')
            }
        });
    };

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
