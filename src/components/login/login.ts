import { api } from '../../api/api';
import { activate } from '../../api/webSocket';
import { router } from '../../router';
import { store } from '../../store';
import { logger } from '../../utils/logger';
import notification from '../notificationContainer/notificationContainer';
import template from './login.handlebars';

/**
 * @class
 * @classdesc Форма авторизации. Возникает если при регистрации указать
 */
export class Login {
    readonly #parent: HTMLElement;
    #submitBtn: HTMLButtonElement | null = null;
    #password: HTMLInputElement | null = null;

    /**
     * Конструктор класса
     * @constructor
     * @param parent {HTMLElement} - родительский элемент
     * @param nextCallback {function} - калбек на следующую форму
     * @param prevCallback {function} - калбек на предыдущую форму
     */
    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLFormElement {
        return document.forms.namedItem('login') as HTMLFormElement;
    }

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
    readonly #passwordValidate = (): boolean => {
        const error = this.self.querySelector('.form__error') as HTMLElement;
        if (!this.#password) {
            return false;
        }
        if (this.#password.validity.valid === false) {
            this.#password.classList.remove('form__input_valid');
            this.#password.classList.add('form__input_error');
            error.hidden = false;
            error.textContent = 'Пароль должен содержать минимум 10 символов';
            return false;
        }
        if (this.#checkPassword(this.#password.value) === false) {
            this.#password.classList.remove('form__input_valid');
            this.#password.classList.add('form__input_error');
            error.hidden = false;
            error.textContent = 'Пароль может содержать только латинские буквы и цифры';
            return false;
        } else {
            error.hidden = true;
            this.#password.classList.remove('form__input_error');
            this.#password.classList.add('form__input_valid');
            return true;
        }
    };

    /**
     * Кнопка глазика в поле ввода пароля
     */
    readonly #togglePasswordVisibility = () => {
        const showPasswordIcon = this.self.querySelector(
            '.form__toggle-password--show',
        ) as HTMLElement;
        const hidePasswordIcon = this.self.querySelector(
            '.form__toggle-password--hide',
        ) as HTMLElement;
        const password = this.self.elements.namedItem('password') as HTMLInputElement;

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
    readonly #addEventListeners = () => {
        const form = this.self;
        this.#password = form.elements.namedItem('password') as HTMLInputElement;
        this.#submitBtn = form.elements.namedItem('submit') as HTMLButtonElement;

        form.querySelector('.form__back')?.addEventListener('click', router.back);

        this.#password.addEventListener('input', this.#passwordValidate);

        const togglePasswordIcons = this.self.querySelector('.form__toggle-password');
        togglePasswordIcons?.addEventListener('click', this.#togglePasswordVisibility);

        this.#submitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (this.#passwordValidate() === true) {
                store.data.auth.request.password = this.#password?.value ?? '';
                try {
                    if (store.data.auth.type === 'applicant')
                        store.data.user = await api.applicant.login({
                            email: store.data.auth.request.email,
                            password: store.data.auth.request.password,
                        });
                    else
                        store.data.user = await api.employer.login({
                            email: store.data.auth.request.email,
                            password: store.data.auth.request.password,
                        });
                    store.data.authorized = true;
                    notification.add('OK', 'Вы успешно зашли в аккаунт');
                    await activate();
                    router.go('/catalog');
                } catch {
                    const error = document.querySelector('.form__error') as HTMLElement;
                    if (error) {
                        error.hidden = false;
                        error.textContent = 'Неверный пароль';
                        notification.add('FAIL', 'Неверный пароль');
                    }
                }
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
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                email: store.data.auth.request.email,
            }),
        );
        this.#addEventListeners();

        this.#password?.focus();
    };
}
