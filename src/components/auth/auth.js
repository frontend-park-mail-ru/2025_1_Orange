import { RegistrationEmail } from '../registrationEmail/registrationEmail';
import { store } from '../../store';
import { RegistrationPassword } from '../registrationPassword/registrationPassword';
import { RegistrationCompany } from '../registrationCompany/registrationCompany';
import { RegistrationUser } from '../registrationUser/registrationUser';
import { Login } from '../login/login';
import { router } from '../../router.js';
import { Api } from '../../api/api.js';
import { logger } from '../../utils/logger.js';

export class Auth {
    #parent;
    #regEmail;
    #regPassword;
    #regUser;
    #regCompany;
    #login;
    #history;
    #api;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     */
    constructor(parent) {
        this.#history = [];
        this.#parent = parent;
        this.#api = new Api();
    }

    get self() {
        return document.getElementById('auth');
    }

    /**
     * Логика открытия следующих форм
     */
    #nextCallback = async () => {
        this.#history.push(store.page);
        if (store.page === 'regEmail' || store.page === 'auth') {
            this.#regEmail.remove();
            console.log('FETCH');
            try {
                await this.#api.getUser(store.auth.email);
                store.page = 'login';
                this.render();
            } catch {
                store.page = 'regPassword';
                this.render();
            }
            return;
        }
        if (store.page === 'regPassword') {
            this.#regPassword.remove();
            if (store.auth.isEmployer) {
                store.page = 'regCompany';
            } else {
                store.page = 'regUser';
            }
            this.render();
            return;
        }
        if (store.page === 'regCompany') {
            try {
                await this.#api.register(store.auth);
                this.#regCompany.remove();
                store.page = 'login';
                this.render();
            } catch {
                const error = document.querySelector('.form__error');
                error.hidden = false;
                error.textContent = 'Ошибка при регистрации';
            }
            return;
        }
        if (store.page === 'regUser') {
            try {
                await this.#api.register(store.auth);
                this.#regUser.remove();
                store.page = 'login';
                this.render();
            } catch {
                const error = document.querySelector('.form__error');
                error.hidden = false;
                error.textContent = 'Ошибка при регистрации';
            }
            return;
        }

        if (store.page === 'login') {
            try {
                await this.#api.login({ email: store.auth.email, password: store.auth.password });
                this.#login.remove();
                store.page = 'catalog';
                router('catalog');
            } catch {
                const error = document.querySelector('.form__error');
                error.hidden = false;
                error.textContent = 'Ошибка при авторизации';
            }
        }
    };

    /**
     * Логика открытия предыдущих форм
     */
    #prevCallback = () => {
        console.log(store.page);
        if (store.page === 'regEmail' || store.page === 'auth' || store.page === undefined) {
            this.#regEmail.remove();
            router('catalog');
            return;
        }
        if (store.page === 'regPassword') {
            this.#regPassword.remove();
        }
        if (store.page === 'regCompany') {
            this.#regCompany.remove();
        }
        if (store.page === 'regUser') {
            this.#regUser.remove();
        }
        if (store.page === 'login') {
            this.#login.remove();
        }
        store.page = this.#history.pop();
        this.render();
    };

    /**
     * Очистка
     */
    remove() {
        logger.info('Auth remove method called');
        this.self.remove();
    }

    /**
     * Рендеринг формы
     */
    render() {
        logger.info('Auth render method called');
        if (this.self === null) {
            // eslint-disable-next-line no-undef
            const template = Handlebars.templates['auth/auth'];
            this.#parent.insertAdjacentHTML('beforeend', template());
        }
        if (store.page === 'regEmail' || store.page === 'auth') {
            this.#regEmail = new RegistrationEmail(
                this.self,
                this.#nextCallback,
                this.#prevCallback,
            );
            this.#regEmail.render();
        }
        if (store.page === 'regPassword') {
            this.#regPassword = new RegistrationPassword(
                this.self,
                this.#nextCallback,
                this.#prevCallback,
            );
            this.#regPassword.render();
        }
        if (store.page === 'regCompany') {
            this.#regCompany = new RegistrationCompany(
                this.self,
                this.#nextCallback,
                this.#prevCallback,
            );
            this.#regCompany.render();
        }
        if (store.page === 'regUser') {
            this.#regUser = new RegistrationUser(this.self, this.#nextCallback, this.#prevCallback);
            this.#regUser.render();
        }
        if (store.page === 'login') {
            this.#login = new Login(this.self, this.#nextCallback, this.#prevCallback);
            this.#login.render();
        }
    }
}
