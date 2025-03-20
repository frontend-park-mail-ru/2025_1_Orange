import { store } from '../../store.js';
import { logger } from '../../utils/logger.js';
import Handlebars from 'handlebars';


export class RegistrationCompany {
    #parent: HTMLElement;
    #companyName: HTMLInputElement | null = null;
    #companyAddress: HTMLInputElement | null = null;
    #submitBtn: HTMLButtonElement | null = null;
    #nextCallback: () => void;
    #prevCallback: () => void;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     * @param nextCallback {function} - Вызов следующей формы
     * @param prevCallback {function} - Вызов предыдущей формы
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
        return document.forms.namedItem('registration_company') as HTMLFormElement;
    }

    /**
     * Валидация введенных данных
     * @returns {boolean}
     */
    #companyValidate = (): boolean => {
        return this.#companyNameValidate() && this.#companyAddressValidate();
    };

    /**
     * Валидация имени компании
     * @returns {boolean}
     */
    #companyNameValidate = (): boolean => {
        const error = this.self.querySelector('.form__error') as HTMLElement;
        if (!this.#companyName || !error) {
            return false;
        }
        if (this.#companyName.validity.valid === false) {
            error.hidden = false;
            error.textContent = 'Минимальная длина названия компании 2 символа';
            this.#companyName.classList.add('form__input_error');
            return false;
        } else {
            this.#companyName.classList.remove('form__input_error');
            this.#companyName.classList.add('form__valid');
            error.hidden = true;
        }
        return true;
    };

    /**
     * Валидация адреса компании
     * @returns {boolean}
     */
    #companyAddressValidate = () => {
        const error = this.self.querySelector('.form__error') as HTMLElement;
        if (!this.#companyAddress || !error) {
            return false;
        }
        if (this.#companyAddress.validity.valid === false) {
            error.hidden = false;
            error.textContent = 'Минимальная длина адреса компании 10 символов';
            this.#companyAddress.classList.add('form__input_error');
            return false;
        } else {
            this.#companyAddress.classList.remove('form__input_error');
            this.#companyAddress.classList.add('form__valid');
            error.hidden = true;
        }
        return true;
    };

    /**
     * Навешивание обработчиков событий
     */
    #addEventListeners = () => {
        const form = this.self;
        this.#companyAddress = form.elements.namedItem('company_address') as HTMLInputElement;
        this.#companyName = form.elements.namedItem('company_name') as HTMLInputElement;
        this.#submitBtn = form.elements.namedItem('submit') as HTMLButtonElement;

        form.querySelector('.form__back')?.addEventListener('click', this.#prevCallback);
        this.#companyName.addEventListener('input', this.#companyNameValidate);
        this.#companyAddress.addEventListener('input', this.#companyAddressValidate);
        this.#submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.#companyValidate() === true) {
                store.auth.companyName = this.#companyName?.value || '';
                store.auth.companyAddress = this.#companyAddress?.value || '';
                this.#nextCallback();
            }
        });
    };

    /**
     * Очистка
     */
    remove = () => {
        logger.info('RegistrationCompany remove method called');
        this.self.remove();
    };

    /**
     * Рендеринг формы
     */
    render = () => {
        logger.info('RegistrationCompany render method called');
         
        const template = Handlebars.templates['registrationCompany/registrationCompany'];
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                companyName: store.auth.companyName,
                companyAddress: store.auth.companyAddress,
            }),
        );
        this.#addEventListeners();

        this.#companyName?.focus();
    };
}
