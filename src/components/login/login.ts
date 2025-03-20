import { store } from '../../store';
import { logger } from '../../utils/logger.js';
import Handlebars from 'handlebars';


/**
 * @class
 * @classdesc Форма авторизации. Возникает если при регистрации указать
 */
export class Login {
    #parent: HTMLElement;
    #submitBtn: HTMLButtonElement | null = null;
    #nextCallback: () => void;
    #prevCallback: () => void;
    #password: HTMLInputElement | null = null;

    /**
     * Конструктор класса
     * @constructor
     * @param parent {HTMLElement} - родительский элемент
     * @param nextCallback {function} - калбек на следующую форму
     * @param prevCallback {function} - калбек на предыдущую форму
     */
    constructor(parent: HTMLElement, nextCallback: () => void, prevCallback: () => void) {
        this.#parent = parent;
        this.#nextCallback = nextCallback;
        this.#prevCallback = prevCallback;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self() : HTMLFormElement {
        return document.forms.namedItem('login') as HTMLFormElement;
    }

    /**
     * Рендер поля почты. Рендерится при переходе из формы ввода почты
     */
    #formEmailRender = () : void => {
        const email = this.self.querySelector('.form__email') as HTMLElement;
        email.textContent = store.auth.email;
    };

    /**
     * Валидация введенного пароля на принадлежность к английским буквам и цифрам
     * @param {string} str - пароль для валидации
     * @returns {boolean}
     */
    #checkPassword(str: string): boolean {
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            if (
                !(
                    (48 <= char && char <= 57) ||
                    (65 <= char && char <= 90) ||
                    (97 <= char && char <= 122)
                )
            ) {
                return false;
            }
        }
        return true;
    }

    /**
     * Валидация введенных данных
     * @returns {boolean}
     */
    #passwordValidate = (): boolean => {
        const error = this.self.querySelector('.form__error') as HTMLElement;
        if (!this.#password) {
            return false
        }
        if (this.#password.validity.valid === false) {
            this.#password.classList.remove('form__valid');
            this.#password.classList.add('form__input_error');
            error.hidden = false;
            error.textContent = 'Пароль должен содержать минимум 10 символов';
            return false;
        }
        if (this.#checkPassword(this.#password.value) === false) {
            this.#password.classList.remove('form__valid');
            this.#password.classList.add('form__input_error');
            error.hidden = false;
            error.textContent = 'Пароль может содержать только латинские буквы и цифры';
            return false;
        } else {
            error.hidden = true;
            this.#password.classList.remove('form__input_error');
            this.#password.classList.add('form__valid');
            return true;
        }
    };

    /**
     * Кнопка глазика в поле ввода пароля
     */
    #togglePasswordVisibility = () => {
        const showPasswordIcon = this.self.querySelector('.form__toggle-password--show') as HTMLElement;
        const hidePasswordIcon = this.self.querySelector('.form__toggle-password--hide') as HTMLElement;
        const password = this.self.elements.namedItem('password') as HTMLInputElement

        if (showPasswordIcon.classList.contains('active')) {
            password.type = 'text';

            showPasswordIcon.classList.remove('active');
            hidePasswordIcon.classList.add('active');

            showPasswordIcon.classList.add('hidden');
            hidePasswordIcon.classList.remove('hidden');
        } else if (hidePasswordIcon.classList.contains('active')) {
            password.type = 'password';

            hidePasswordIcon.classList.remove('active');
            showPasswordIcon.classList.add('active');

            hidePasswordIcon.classList.add('hidden');
            showPasswordIcon.classList.remove('hidden');
        }
    };

    /**
     * Навешивание обработчиков событий
     */
    #addEventListeners = () => {
        const form = this.self;
        this.#password = form.elements.namedItem('password') as HTMLInputElement
        this.#submitBtn = form.elements.namedItem('submit') as HTMLButtonElement;

        form.querySelector('.form__back')?.addEventListener('click', this.#prevCallback);

        this.#password.addEventListener('input', this.#passwordValidate);

        const togglePasswordIcons = this.self.querySelector('.form__toggle-password');
        togglePasswordIcons?.addEventListener('click', this.#togglePasswordVisibility);

        this.#submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.#passwordValidate() === true) {
                store.auth.password = this.#password?.value || '';
                this.#nextCallback();
            }
        });
    };

    /**
     * Очистка
     */
    remove = () => {
        logger.info('Login remove method called');
        this.self.remove();
    };

    /**
     * Рендеринг формы
     */
    render = () => {
        logger.info('Login render method called');
         
        const template = Handlebars.templates['login/login'];
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                email: store.auth.email,
            }),
        );
        this.#formEmailRender();
        this.#addEventListeners();

        this.#password?.focus();
    };
}
