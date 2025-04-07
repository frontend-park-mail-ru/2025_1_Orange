import { RegistrationEmail } from '../registrationEmail/registrationEmail';
import { store } from '../../store';
import { RegistrationPassword } from '../registrationPassword/registrationPassword';
import { RegistrationCompany } from '../registrationCompany/registrationCompany';
import { RegistrationUser } from '../registrationUser/registrationUser';
import { Login } from '../login/login';
import { router } from '../../router';
import { Api } from '../../api/api';
import { logger } from '../../utils/logger';
import template from './auth.handlebars';

export class Auth {
    readonly #parent: HTMLElement;
    #regEmail: RegistrationEmail | null = null;
    #regPassword: RegistrationPassword | null = null;
    #regUser: RegistrationUser | null = null;
    #regCompany: RegistrationCompany | null = null;
    #login: Login | null = null;
    readonly #history: Array<string>;
    readonly #api: Api;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     */
    constructor(parent: HTMLElement) {
        this.#history = [];
        this.#parent = parent;
        this.#api = new Api();
    }

    get self(): HTMLElement {
        return document.getElementById('auth') as HTMLElement;
    }

    /**
     * Логика открытия следующих форм
     */
    readonly #nextCallback = async () => {
        this.#history.push(store.page);
        switch (store.page) {
            case 'regEmail':
            case 'auth':
                logger.info('FETCH');
                try {
                    const request = await this.#api.auth.checkEmail(store.auth.email);
                    logger.info(request);
                    store.page = 'login';
                    this.render();
                } catch {
                    logger.info('check email ERROR');
                    store.page = 'regPassword';
                    this.render();
                }
                break;
            case 'regPassword':
                if (store.auth.isEmployer) {
                    store.page = 'regCompany';
                } else {
                    store.page = 'regUser';
                }
                this.render();
                break;
            case 'regCompany':
                store.page = 'login';
                this.render();
                break;
            case 'regUser':
                store.page = 'login';
                this.render();
                break;
            case 'login':
                store.user.authenticated = true;
                store.page = 'catalog';
                router.go('/catalog');
                break;
        }
    };

    /**
     * Логика открытия предыдущих форм
     */
    readonly #prevCallback = () => {
        // logger.info(store.page);
        // if (store.page === 'regEmail' || store.page === 'auth' || store.page === undefined) {
        //     this.#regEmail?.remove();
        //     router.go('catalog');
        //     return;
        // }
        // if (store.page === 'regPassword') {
        //     this.#regPassword?.remove();
        // }
        // if (store.page === 'regCompany') {
        //     this.#regCompany?.remove();
        // }
        // if (store.page === 'regUser') {
        //     this.#regUser?.remove();
        // }
        // if (store.page === 'login') {
        //     this.#login?.remove();
        // }
        const currentPage = this.#history.pop();
        if (currentPage) {
            store.page = currentPage;
        }
        this.render();
    };

    /**
     * Очистка
     */
    remove() {
        logger.info('Auth remove method called');
        this.self?.remove();
    }

    /**
     * Рендеринг формы
     */
    render() {
        logger.info('Auth render method called');
        if (this.self) {
            this.remove();
        }
        this.#parent.insertAdjacentHTML('beforeend', template({}));
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
