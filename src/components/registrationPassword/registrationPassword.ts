import './registrationPassword.css';
import { store } from '../../store.js';
import { logger } from '../../utils/logger.js';
import Handlebars from 'handlebars';

export class RegistrationPassword {
    readonly #parent;
    #submitBtn: HTMLButtonElement | null = null;
    readonly #nextCallback;
    readonly #prevCallback;
    #password: HTMLInputElement | null = null;
    #repeatPassword: HTMLInputElement |null = null;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
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
    get self() : HTMLFormElement{
        return document.forms.namedItem('registration_password') as HTMLFormElement;
    }

    /**
     * Рендер почты. Вызывается при переходе из формы ввода почты
     */
    readonly #formEmailRender = () => {
        const email = this.self.querySelector('.form__email');
        if (email) {
            email.textContent = store.auth.email;
        }
    };

    /**
     * Проверяет пароль на соответсвие английским символам и цифрам
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
        if (!this.#password || !this.#repeatPassword || !error) {
            return false;
        }
        if (this.#password.validity.valid === false) {
            this.#password.classList.add('form__input_error');
            error.hidden = false;
            error.textContent = 'Пароль должен содержать минимум 10 символов';
            return false;
        }
        if (this.#checkPassword(this.#password.value) === false) {
            this.#password.classList.add('form__input_error');
            error.hidden = false;
            error.textContent = 'Пароль может содержать только латинские буквы и цифры';
            return false;
        }
        if (this.#repeatPassword.value !== this.#password.value) {
            this.#repeatPassword.classList.add('form__input_error');
            error.hidden = false;
            error.textContent = 'Пароли не совпадают';
            return false;
        } else {
            error.hidden = true;
            this.#password.classList.remove('form__input_error');
            this.#repeatPassword.classList.remove('form__input_error');
            this.#password.classList.add('form__valid');
            this.#repeatPassword.classList.add('form__valid');
            return true;
        }
    };

    /**
     * Кнопка глазика в поле ввода пароля
     */
    readonly #togglePasswordVisibility = () => {
        const showPasswordIcons = this.self.querySelectorAll('.form__toggle-password--show');
        const hidePasswordIcons = this.self.querySelectorAll('.form__toggle-password--hide');

        showPasswordIcons.forEach((showPasswordIcon, i) => {
            const hidePasswordIcon = hidePasswordIcons[i];

            if (showPasswordIcon.classList.contains('active')) {
                if (!this.#password || !this.#repeatPassword) {
                    return;
                }
                this.#password.type = 'text';
                this.#repeatPassword.type = 'text';

                showPasswordIcon.classList.remove('active');
                hidePasswordIcon.classList.add('active');

                showPasswordIcon.classList.add('hidden');
                hidePasswordIcon.classList.remove('hidden');
            } else if (hidePasswordIcon.classList.contains('active')) {
                if (!this.#password || !this.#repeatPassword) {
                    return;
                }
                this.#password.type = 'password';
                this.#repeatPassword.type = 'password';

                hidePasswordIcon.classList.remove('active');
                showPasswordIcon.classList.add('active');

                hidePasswordIcon.classList.add('hidden');
                showPasswordIcon.classList.remove('hidden');
            }
        });
    };

    /**
     * Навешивание обработчиков событий формы
     */
    #addEventListeners = () => {
        const form = this.self;
        this.#password = form.elements.namedItem('password') as HTMLInputElement;
        this.#repeatPassword = form.elements.namedItem('repeat_password') as HTMLInputElement;
        this.#submitBtn = form.elements.namedItem('submit') as HTMLButtonElement;

        form.querySelector('.form__back')?.addEventListener('click', this.#prevCallback);

        this.#password.addEventListener('input', this.#passwordValidate);
        this.#repeatPassword.addEventListener('input', this.#passwordValidate);
        const togglePasswordIcons = this.self.querySelectorAll('.form__toggle-password');
        togglePasswordIcons.forEach((icon) => {
            icon.addEventListener('click', this.#togglePasswordVisibility);
        });

        this.#submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.#passwordValidate() === true) {
                store.auth.password = this.#password?.value ?? '';
                store.auth.repeatPassword = this.#repeatPassword?.value ?? '';
                this.#nextCallback();
            }
        });
    };

    /**
     * Очистка
     */
    remove = () => {
        logger.info('RegistrationPassword remove method called');
        this.self.remove();
    };

    /**
     * Рендеринг формы
     */
    render = () => {
        logger.info('RegistrationPassword render method called');
         
        const template = Handlebars.templates['registrationPassword/registrationPassword'];
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
