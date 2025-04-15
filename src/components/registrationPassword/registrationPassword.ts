import { store } from '../../store';
import { logger } from '../../utils/logger';
import template from './registrationPassword.handlebars';
import { router } from '../../router';
import './registrationPassword.sass';

export class RegistrationPassword {
    readonly #parent;
    #submitBtn: HTMLButtonElement | null = null;
    #password: HTMLInputElement | null = null;
    #repeatPassword: HTMLInputElement | null = null;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     */
    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLFormElement {
        return document.forms.namedItem('registration_password') as HTMLFormElement;
    }

    /**
     * Проверяет пароль на соответствие английским символам и цифрам
     * @param {string} str - пароль для валидации
     * @returns {boolean}
     */
    #checkPassword(str: string): boolean {
        // Регулярное выражение для проверки, содержит ли строка только латинские буквы и цифры
        const passwordRegex = /^[a-zA-Z0-9_!@#$%^&*]+$/;
        return passwordRegex.test(str);
    }

    /**
     * Валидация введенных данных
     * @returns {boolean}
     */
    readonly #passwordValidate = (): boolean => {
        const errorElement = this.self.querySelector('.form__error') as HTMLElement;

        if (!this.#password || !this.#repeatPassword || !errorElement) {
            return false;
        }

        const minLength = 10;

        this.#password.classList.remove('form__input_error', 'form__input_valid');
        this.#repeatPassword.classList.remove('form__input_error', 'form__input_valid');

        if (this.#password.value.length < minLength) {
            errorElement.hidden = false;
            errorElement.textContent = 'Пароль должен содержать минимум 10 символов';
            this.#password.classList.add('form__input_error');
            return false;
        }

        if (!this.#checkPassword(this.#password.value)) {
            errorElement.hidden = false;
            errorElement.textContent =
                'Пароль может содержать только латинские буквы, цифры и спецсимволы';
            this.#password.classList.add('form__input_error');
            return false;
        }

        if (this.#password.value !== this.#repeatPassword.value) {
            errorElement.hidden = false;
            errorElement.textContent = 'Пароли не совпадают';
            this.#repeatPassword.classList.add('form__input_error');
            return false;
        }

        // Если все проверки пройдены успешно
        errorElement.hidden = true;
        this.#password.classList.add('form__input_valid');
        this.#repeatPassword.classList.add('form__input_valid');
        return true;
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
    readonly #addEventListeners = () => {
        const form = this.self;
        this.#password = form.elements.namedItem('password') as HTMLInputElement;
        this.#repeatPassword = form.elements.namedItem('repeat_password') as HTMLInputElement;
        this.#submitBtn = form.elements.namedItem('submit') as HTMLButtonElement;

        form.querySelector('.form__back')?.addEventListener('click', router.back);

        this.#password.addEventListener('input', this.#passwordValidate);
        this.#repeatPassword.addEventListener('input', this.#passwordValidate);
        const togglePasswordIcons = this.self.querySelectorAll('.form__toggle-password');
        togglePasswordIcons.forEach((icon) => {
            icon.addEventListener('click', this.#togglePasswordVisibility);
        });

        this.#submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.#passwordValidate() === true) {
                store.data.auth.request.password = this.#password?.value ?? '';
                store.data.auth.request.repeatPassword = this.#repeatPassword?.value ?? '';
                if (store.data.auth.type === 'applicant') {
                    router.go('/registrationApplicant');
                } else {
                    router.go('/registrationEmployer');
                }
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
