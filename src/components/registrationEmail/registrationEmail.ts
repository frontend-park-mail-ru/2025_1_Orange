import { api } from '../../api/api';
import { router } from '../../router';
import { store } from '../../store';
import { logger } from '../../utils/logger';
import template from './registrationEmail.handlebars';

export class RegistrationEmail {
    readonly #parent: HTMLElement;
    #email: HTMLInputElement | null = null;
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
        return document.forms.namedItem('registration_email') as HTMLFormElement;
    }

    /**
     * Смена типа формы с поиска работы на поиск работника и наоборот
     */
    readonly #switch = () => {
        store.data.auth.type = store.data.auth.type === 'applicant' ? 'employer' : 'applicant';
        this.#under_link();
        this.#formNameRender();
    };

    /**
     * Рендер ссылки. Вызывается при смене типа формы
     */
    readonly #under_link = () => {
        const companyLink = document.getElementById('i_need_users');
        const userLink = document.getElementById('i_need_job');
        if (companyLink && userLink) {
            console.log(store.data.auth);
            companyLink.hidden = store.data.auth.type === 'employer';
            userLink.hidden = store.data.auth.type === 'applicant';
        }
    };

    /**
     * Рендер имени формы. Вызывается при смене типа формы
     */
    readonly #formNameRender = () => {
        const formName = this.self.querySelector('.form__name');
        if (formName) {
            formName.textContent =
                store.data.auth.type === 'applicant' ? 'Поиск работы' : 'Поиск сотрудников';
        }
    };

    /**
     * Валидация введенных данных
     * @returns {boolean}
     */
    readonly #emailValidate = (): boolean => {
        const error = this.self.querySelector('.form__error') as HTMLElement;
        if (!this.#email || !error) {
            return false;
        }
        if (this.#email.validity.valid === false) {
            error.hidden = false;
            error.textContent = 'Напишите валидный адрес почты';
            this.#email.classList.add('form__input_error');
            return false;
        }
        if (this.#email.value.split('').indexOf('.') === -1) {
            error.hidden = false;
            error.textContent = 'Напишите валидный адрес почты';
            this.#email.classList.add('form__input_error');
            return false;
        }
        error.hidden = true;
        this.#email.classList.remove('form__input_error');
        return true;
    };

    /**
     * Навешивание обработчиков событий
     */
    readonly #addEventListeners = () => {
        const form = this.self;
        this.#email = form.elements.namedItem('email') as HTMLInputElement;
        this.#submitBtn = form.elements.namedItem('submit') as HTMLButtonElement;

        form.querySelector('.form__back')?.addEventListener('click', router.back);

        document.querySelectorAll('.under_link').forEach((element) => {
            element.addEventListener('click', this.#switch);
        });
        this.#email.addEventListener('input', () => {
            this.#emailValidate();
        });
        this.#submitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (this.#emailValidate() === true) {
                store.data.auth.request.email = this.#email?.value ?? '';
                try {
                    const request = await api.auth.checkEmail(store.data.auth.request.email);
                    store.data.auth.type = request.role as 'applicant' | 'employer'
                    router.go('/login');
                } catch {
                    logger.info('check email ERROR');
                    router.go('/registrationPassword');
                }
            }
        });
    };

    /**
     * Очистка
     */
    remove = () => {
        logger.info('RegistrationEmail remove method called');
        this.self.remove();
        document.querySelectorAll('.under_link').forEach((element) => {
            element.remove();
        });
    };

    /**
     * Рендеринг формы
     */
    render = () => {
        logger.info('RegistrationEmail render method called');

        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                email: store.data.auth.request.email,
            }),
        );
        this.#formNameRender();
        this.#under_link();
        this.#addEventListeners();

        this.#email?.focus();
    };
}
