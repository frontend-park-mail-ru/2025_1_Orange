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
                    try {
                    const component = new this.#component(this.#page)
                    component.render()
                    } catch {
                        this.#page.textContent = 'не могу отрендерить компонент'
                    }
                    
                } else if (this.#page) {
                    this.#page.classList.remove('burger__page--open')
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