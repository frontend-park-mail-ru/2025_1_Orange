import { api } from '../../api/api';
import { router } from '../../router';
import { store } from '../../store';
import { logger } from '../../utils/logger';
import template from './registrationCompany.handlebars';

export class RegistrationCompany {
    readonly #parent: HTMLElement;
    #companyName: HTMLInputElement | null = null;
    #companyAddress: HTMLInputElement | null = null;
    #submitBtn: HTMLButtonElement | null = null;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     * @param nextCallback {function} - Вызов следующей формы
     * @param prevCallback {function} - Вызов предыдущей формы
     */
    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLFormElement {
        return document.forms.namedItem('registration_company') as HTMLFormElement;
    }

    /**
     * Валидация введенных данных
     * @returns {boolean}
     */
    readonly #companyValidate = (): boolean => {
        return this.#companyNameValidate() && this.#companyAddressValidate();
    };

    /**
     * Валидация имени компании
     * @returns {boolean}
     */
    readonly #companyNameValidate = (): boolean => {
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
            this.#companyName.classList.add('form__input_valid');
            error.hidden = true;
        }
        return true;
    };

    /**
     * Валидация адреса компании
     * @returns {boolean}
     */
    readonly #companyAddressValidate = () => {
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
            this.#companyAddress.classList.add('form__input_valid');
            error.hidden = true;
        }
        return true;
    };

    /**
     * Навешивание обработчиков событий
     */
    readonly #addEventListeners = () => {
        const form = this.self;
        this.#companyAddress = form.elements.namedItem('company_address') as HTMLInputElement;
        this.#companyName = form.elements.namedItem('company_name') as HTMLInputElement;
        this.#submitBtn = form.elements.namedItem('submit') as HTMLButtonElement;

        form.querySelector('.form__back')?.addEventListener('click', router.back);
        this.#companyName.addEventListener('input', this.#companyNameValidate);
        this.#companyAddress.addEventListener('input', this.#companyAddressValidate);
        this.#submitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (this.#companyValidate() === true) {
                store.data.auth.request.company_name = this.#companyName?.value ?? '';
                store.data.auth.request.legal_address = this.#companyAddress?.value ?? '';
                try {
                    const user = await api.employer.register(store.data.auth.request);
                    store.data.authorized = true;
                    store.data.user = user;
                    router.go('/catalog');
                } catch {
                    const error = document.querySelector('.form__error') as HTMLElement;
                    if (error) {
                        error.hidden = false;
                        error.textContent = 'Ошибка при регистрации';
                    }
                }
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
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                companyName: store.data.auth.request.companyName,
                companyAddress: store.data.auth.request.companyAddress,
            }),
        );
        this.#addEventListeners();

        this.#companyName?.focus();
    };
}
