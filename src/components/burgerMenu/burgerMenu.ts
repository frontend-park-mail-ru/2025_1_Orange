import './burgerMenu.sass';
import template from './burgerMenu.handlebars';
import { logger } from '../../utils/logger';

export class BurgerMenu {
    readonly #parent: HTMLElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly #component: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly #data: any = null;
    #button: HTMLElement | null = null;
    #page: HTMLElement | null = null;

    /**
     * Конструктор класса
     * @param {HTMLElement} parent - родительский элемент
     * @param {any} component - компонент который будем показывать
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(parent: HTMLElement, component: any, data: any = null) {
        this.#parent = parent;
        this.#component = component;
        this.#data = data;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById(`burger`) as HTMLElement;
    }

    /**
     * Навешивание обработчиков
     */
    readonly #addEventListeners = () => {
        this.#button = this.self.querySelector('.burger__button');
        this.#page = this.self.querySelector('.burger__page');
        if (this.#button) {
            this.#button.addEventListener('click', () => {
                if (this.#page && this.#page.innerHTML === '') {
                    this.#page.classList.add('burger__page--open');
                    if (this.#button)
                        this.#button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
</svg>`;
                    try {
                        if (this.#data !== null) {
                            const component = new this.#component(this.#page, this.#data);
                            component.render();
                        } else {
                            const component = new this.#component(this.#page);
                            component.render();
                        }
                    } catch {
                        this.#page.textContent = 'не могу отрендерить компонент';
                    }
                } else if (this.#page) {
                    this.#page.classList.remove('burger__page--open');
                    if (this.#button)
                        if (this.#data !== null)
                            this.#button.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-dots"
                viewBox="0 0 16 16">
                <path
                    d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                <path
                    d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2" />
            </svg>
                        `;
                        else
                            this.#button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-funnel-fill"
            viewBox="0 0 16 16">
            <path
                d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z" />
        </svg>`;
                    this.#page.innerHTML = '';
                }
            });
        }
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('BurgerMenu render method called');
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                isChat: this.#data != null,
            }),
        );
        this.#addEventListeners();
    };

    /**
     * Удаление компонента
     */
    remove = () => {
        logger.info('BurgerMenu remove method called');
        this.self.remove();
    };
}
