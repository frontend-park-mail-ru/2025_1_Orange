import { api } from '../../api/api';
import { customMessage } from '../../forms';
import { router } from '../../router';
import { store } from '../../store';
import { logger } from '../../utils/logger';
import template from './registrationCompany.handlebars';

export class RegistrationCompany {
    readonly #parent: HTMLElement;
    #companyName: HTMLInputElement | null = null;
    #companyAddress: HTMLInputElement | null = null;
    #submitBtn: HTMLButtonElement | null = null;
    #error: HTMLElement | null = null;

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

    readonly #inputTranslation: Record<string, string> = {
        company_name: 'Название',
        company_address: 'Адрес',
    };

    /**
     * Валидация имени компании
     * @returns {boolean}
     */
    readonly #companyNameValidate = (): boolean => {
        if (!this.#error || !this.#companyName) {
            return false;
        }
        this.#companyName.classList.remove('error', 'valid');
        this.#companyName.value = this.#companyName.value.trimStart();
        this.#error.textContent = '';
        if (this.#companyName.validity.valid === false) {
            this.#error.textContent = customMessage(this.#companyName, this.#inputTranslation);
            this.#companyName.classList.add('error');
            return false;
        } else {
            this.#companyName.classList.add('valid');
        }
        return true;
    };

    /**
     * Валидация адреса компании
     * @returns {boolean}
     */
    readonly #companyAddressValidate = () => {
        if (!this.#error || !this.#companyAddress) {
            return false;
        }
        this.#companyAddress.classList.remove('error', 'valid');
        this.#companyAddress.value = this.#companyAddress.value.trimStart();
        this.#error.textContent = '';
        if (this.#companyAddress.validity.valid === false) {
            this.#error.textContent = customMessage(this.#companyAddress, this.#inputTranslation);
            this.#companyAddress.classList.add('error');
            return false;
        } else {
            this.#companyAddress.classList.add('valid');
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
        this.#error = form.querySelector('.form__error') as HTMLElement;

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
                companyName: store.data.auth.request.company_name,
                companyAddress: store.data.auth.request.company_name,
            }),
        );
        this.#addEventListeners();

        this.#companyName?.focus();
    };
}
