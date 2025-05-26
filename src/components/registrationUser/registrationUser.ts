import { api } from '../../api/api';
import { activate } from '../../api/webSocket';
import { customMessage } from '../../forms';
import { router } from '../../router';
import { store } from '../../store';
import { logger } from '../../utils/logger';
import notification from '../notificationContainer/notificationContainer';
import template from './registrationUser.handlebars';

export class RegistrationUser {
    readonly #parent: HTMLElement;
    #firstName: HTMLInputElement | null = null;
    #lastName: HTMLInputElement | null = null;
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
        return document.forms.namedItem('registration_user') as HTMLFormElement;
    }

    /**
     * Валидация введенных данных
     * @returns {boolean}
     */
    readonly #companyValidate = (): boolean => {
        return this.#firstNameValidate() && this.#lastNameValidate();
    };

    readonly #inputTranslation: Record<string, string> = {
        first_name: 'Имя',
        last_name: 'Фамилия',
    };

    /**
     * Валидация имени
     * @returns {boolean}
     */
    readonly #firstNameValidate = (): boolean => {
        if (!this.#error || !this.#firstName) {
            return false;
        }
        this.#firstName.classList.remove('error', 'valid');
        this.#firstName.value = this.#firstName.value.trimStart();
        this.#error.textContent = '';
        if (this.#firstName.validity.valid === false) {
            this.#error.textContent = customMessage(this.#firstName, this.#inputTranslation);
            this.#firstName.classList.add('error');
            return false;
        } else {
            this.#firstName.classList.add('valid');
        }
        return true;
    };

    /**
     * Валидация фамилии
     * @returns {boolean}
     */
    readonly #lastNameValidate = (): boolean => {
        if (!this.#error || !this.#lastName) {
            return false;
        }
        this.#lastName.classList.remove('error', 'valid');
        this.#lastName.value = this.#lastName.value.trimStart();
        this.#error.textContent = '';
        if (this.#lastName.validity.valid === false) {
            this.#error.textContent = customMessage(this.#lastName, this.#inputTranslation);
            this.#lastName.classList.add('error');
            return false;
        } else {
            this.#lastName.classList.add('valid');
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
        this.#error = form.querySelector('.form__error') as HTMLElement;

        form.querySelector('.form__back')?.addEventListener('click', router.back);
        this.#firstName.addEventListener('input', this.#firstNameValidate);
        this.#lastName.addEventListener('input', this.#lastNameValidate);
        this.#submitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (this.#companyValidate() === true) {
                store.data.auth.request.first_name = this.#firstName?.value ?? '';
                store.data.auth.request.last_name = this.#lastName?.value ?? '';
                try {
                    const user = await api.applicant.register(store.data.auth.request);
                    store.data.authorized = true;
                    store.data.user = user;
                    notification.add('OK', 'Соискатель успешно зарегестрирован');
                    await activate();
                    router.go('/catalog');
                } catch {
                    notification.add('FAIL', 'Ошибка при регистрации соискателя');
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
        logger.info('RegistrationUser remove method called');
        this.self.remove();
    };

    /**
     * Рендеринг формы
     */
    render = () => {
        logger.info('RegistrationUser render method caller');
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                firstName: store.data.auth.request.first_name,
                lastName: store.data.auth.request.last_name,
            }),
        );
        this.#addEventListeners();

        this.#firstName?.focus();
    };
}
