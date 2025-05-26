import './landingPage.sass';
import { logger } from '../../utils/logger';
import template from './landingPage.handlebars';
import { router } from '../../router';
import { store } from '../../store';

export class LandingPage {
    readonly #parent: HTMLElement;
    #searchJobButton: HTMLElement | null = null;
    #postVacancyButton: HTMLElement | null = null;

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
        return document.getElementById('landing_page') as HTMLElement;
    }

    /**
     * Очистка
     */
    remove = () => {
        logger.info('LandingPage remove method called');
        this.self.remove();
    };

    /**
     * Навешивание обработчиков событий
     */
    readonly #addEventListeners = () => {
        this.#searchJobButton = this.self.querySelector('.landing-page__button--search');
        this.#postVacancyButton = this.self.querySelector('.landing-page__button--post');

        this.#searchJobButton?.addEventListener('click', (e) => {
            e.preventDefault();
            router.go('/catalog');
        });

        this.#postVacancyButton?.addEventListener('click', (e) => {
            e.preventDefault();
            if (store.data.authorized && store.data.user.role === 'applicant')
                router.go('/catalog');
            else if (store.data.authorized) router.go('/createVacancy');
            else router.go('/auth');
        });
    };

    /**
     * Рендеринг страницы
     */
    render = () => {
        logger.info('LandingPage render method called');
        this.#parent.insertAdjacentHTML('beforeend', template({}));
        this.#addEventListeners();
    };
}
