import { store } from '../../store.js';
import { logger } from '../../utils/logger.js';
import Handlebars from 'handlebars';

export class RegistrationUser {
    #parent: HTMLElement;
    #firstName: HTMLInputElement | null = null;
    #lastName: HTMLInputElement | null = null;
    #submitBtn: HTMLButtonElement | null = null;
    #nextCallback: () => void;
    #prevCallback: () => void;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     * @param nextCallback {function} - Вызов следующей формы
     * @param prevCallback {function} - Вызов предыдущей формы
     */
    constructor(parent: HTMLElement, nextCallback : () => void, prevCallback: () => void) {
        this.#parent = parent;
        this.#nextCallback = nextCallback;
        this.#prevCallback = prevCallback;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self() : HTMLFormElement{
        return document.forms.namedItem('registration_user') as HTMLFormElement;
    }

    /**
     * Валидация введенных данных
     * @returns {boolean}
     */
    readonly #companyValidate = (): boolean => {
        return this.#firstNameValidate() && this.#lastNameValidate();
    };

    /**
     * Валидация имени
     * @returns {boolean}
     */
    readonly #firstNameValidate = (): boolean => {
        const error = this.self.querySelector('.form__error') as HTMLElement;
        if (!error || !this.#firstName) {
            return false
        }
        if (this.#firstName.validity.valid === false) {
            error.hidden = false;
            error.textContent = 'Введите имя';
            this.#firstName.classList.add('form__input_error');
            return false;
        } else {
            this.#firstName.classList.remove('form__input_error');
            this.#firstName.classList.add('form__valid');
            error.hidden = true;
        }
        return true;
    };

    /**
     * Валидация фамилии
     * @returns {boolean}
     */
    readonly #lastNameValidate = (): boolean => {
        const error = this.self.querySelector('.form__error') as HTMLElement;
        if (!error || !this.#lastName) {
            return false
        }
        if (this.#lastName.validity.valid === false) {
            error.hidden = false;
            error.textContent = 'Введите фамилию';
            this.#lastName.classList.add('form__input_error');
            return false;
        } else {
            this.#lastName.classList.remove('form__input_error');
            this.#lastName.classList.add('form__valid');
            error.hidden = true;
        }
        return true;
    };

    /**
     * Навешивание обработчиков событий
     */
    readonly #addEventListeners = () => {
        const form = this.self;
        this.#firstName = form.elements.namedItem('first_name') as HTMLInputElement;
        this.#lastName = form.elements.namedItem('last_name') as HTMLInputElement;
        this.#submitBtn = form.elements.namedItem('submit') as HTMLButtonElement;

        form.querySelector('.form__back')?.addEventListener('click', this.#prevCallback);
        this.#firstName.addEventListener('input', this.#firstNameValidate);
        this.#lastName.addEventListener('input', this.#lastNameValidate);
        this.#submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.#companyValidate() === true) {
                store.auth.firstName = this.#firstName?.value ?? '';
                store.auth.lastName = this.#lastName?.value ?? '';
                this.#nextCallback();
            }
        });
    };

    /**
     * Очистка
     */
    remove = () => {
        logger.info('RegistrationUser remove method called');
        this.self.remove();
    };

    /**
     * Рендеринг формы
     */
    render = () => {
        logger.info('RegistrationUser render method caller');
         
        const template = Handlebars.templates['registrationUser/registrationUser'];
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                firstName: store.auth.firstName,
                lastName: store.auth.lastName,
            }),
        );
        this.#addEventListeners();

        this.#firstName?.focus();
    };
}
