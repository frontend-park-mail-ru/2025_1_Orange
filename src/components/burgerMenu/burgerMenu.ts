import './burgerMenu.sass';
import template from './burgerMenu.handlebars';
import { logger } from '../../utils/logger';

export class BurgerMenu {
    readonly #parent: HTMLElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly #component: any;
    #button: HTMLElement | null = null;
    #page: HTMLElement | null = null;

    /**
     * Конструктор класса
     * @param {HTMLElement} parent - родительский элемент
     * @param {any} component - компонент который будем показывать
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(parent: HTMLElement, component: any) {
        this.#parent = parent;
        this.#component = component;
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
        this.#button = this.self.querySelector('.burger__button')
        this.#page = this.self.querySelector('.burger__page')
        if (this.#button) {
            this.#button.addEventListener('click', () => {
                if (this.#page && this.#page.innerHTML === '') {
                    this.#page.classList.add('burger__page--open')
                    if (this.#button) this.#button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
</svg>`
                    try {
                    const component = new this.#component(this.#page)
                    component.render()
                    } catch {
                        this.#page.textContent = 'не могу отрендерить компонент'
                    }
                    
                } else if (this.#page) {
                    this.#page.classList.remove('burger__page--open')
                    if (this.#button) this.#button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-funnel-fill"
            viewBox="0 0 16 16">
            <path
                d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z" />
        </svg>`
                    this.#page.innerHTML = ''
                }
            })
        }
    }

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('BurgerMenu render method called');
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({}),
        );
        this.#addEventListeners()
    }

    /**
     * Удаление компонента
     */
    remove = () => {
        logger.info('BurgerMenu remove method called');
        this.self.remove();
    };
}