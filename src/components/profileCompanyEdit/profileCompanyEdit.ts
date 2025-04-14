import template from './profileCompanyEdit.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';
import { Employer, EmployerEdit } from '../../api/interfaces';
import { store } from '../../store';
import { api } from '../../api/api';
import { router } from '../../router';
import { formValidate } from '../../forms';

export class ProfileCompanyEdit {
    readonly #parent: HTMLElement;

    #form: HTMLFormElement | null = null;
    #data: EmployerEdit | null = null;
    #defaultData: Employer | null = null;
    #id: number = 0;

    #confirm: NodeListOf<HTMLButtonElement> | null = null;
    #back: NodeListOf<HTMLButtonElement> | null = null;

    #avatar: NodeListOf<HTMLImageElement> | null = null;
    #uploadInput: HTMLInputElement | null = null;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById('profile_company_edit') as HTMLElement;
    }

    init = async () => {
        logger.info('profileCompany init method called');
        const url = window.location.href.split('/');
        this.#id = Number.parseInt(url[url.length - 1]);
        if (
            !store.data.authorized ||
            store.data.user.role !== 'employer' ||
            store.data.user.user_id !== this.#id
        )
            router.back();
        try {
            const data = await api.employer.get(this.#id);
            this.#defaultData = data;
        } catch {
            console.log('Не удалось загрузить страницу');
            router.back();
        }
    };

    readonly #inputTranslation: Record<string, string> = {
        company_name: 'Название компании',
        slogan: 'Слоган',
        website: 'Веб-сайт',
        description: 'Описание',
        legal_address: 'Адрес',
    };

    #formGet(form: HTMLFormElement): unknown {
        const formData = new FormData(form);
        const json: Record<string, unknown> = {};

        formData.forEach((value, key) => {
            switch (key) {
                case 'birth_date': {
                    const parts = (value as string).split('-');
                    if (parts.length === 3) {
                        json[key] = `${parts[2]}.${parts[1]}.${parts[0]}`;
                    }
                    break;
                }
                case 'file_input':
                    break;
                default:
                    json[key] = value;
            }
        });
        return json;
    }

    /**
     * Очистка
     */
    remove = () => {
        logger.info('VacancyEdit remove method called');
        this.self.innerHTML = '';
    };

    readonly #addEventListeners = () => {
        if (this.#form) {
            this.#form.addEventListener('input', (e: Event) => {
                if (this.#form) {
                    formValidate(
                        this.#form,
                        e.target as HTMLElement,
                        '.profile__error',
                        this.#inputTranslation,
                    );
                    this.#data = this.#formGet(this.#form) as EmployerEdit;
                }
            });
        }

        if (this.#confirm) {
            this.#confirm.forEach((element) => {
                element.addEventListener('click', async (e: Event) => {
                    e.preventDefault();
                    if (
                        this.#form &&
                        formValidate(
                            this.#form,
                            this.#form as HTMLElement,
                            '.profile__error',
                            this.#inputTranslation,
                        )
                    )
                        return;
                    try {
                        console.log(store.data.vacancy);
                        if (this.#data) await api.employer.update(this.#data);
                    } catch {
                        console.log('Ошибка при обновлении');
                    }
                    if (this.#uploadInput) {
                        const files = this.#uploadInput.files;
                        if (!files || files.length === 0) return;
                        const image = files[0];
                        if (!image.type.startsWith('image/')) return;
                        const formData = new FormData();
                        formData.append('logo', image);
                        try {
                            await api.employer.logo(formData);
                            router.go(`/profileCompany/${store.data.user.user_id}`);
                        } catch {
                            console.log('Загрузка картинки не удалась');
                        }
                    }
                });
            });
        }

        if (this.#back) {
            this.#back.forEach((element) => {
                element.addEventListener('click', async (e: Event) => {
                    e.preventDefault();
                    router.back();
                });
            });
        }

        if (this.#uploadInput) {
            this.#uploadInput.addEventListener('change', () => {
                if (!this.#uploadInput) return;
                const files = this.#uploadInput.files;
                if (!files || files.length === 0) return;
                const image = files[0];
                if (!image.type.startsWith('image/')) return;
                if (this.#avatar) {
                    this.#avatar.forEach((element) => {
                        element.src = URL.createObjectURL(image);
                    });
                }
            });
        }
    };

    /**
     * Рендеринг страницы
     */
    render = () => {
        logger.info('VacancyEdit render method called');
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...this.#defaultData,
            }),
        );

        this.#form = document.forms.namedItem('profile_company_edit') as HTMLFormElement;
        if (this.#form) {
            this.#back = document.querySelectorAll('.job__button_second');
            this.#confirm = document.querySelectorAll('.job__button');
            this.#uploadInput = this.#form.elements.namedItem('file_input') as HTMLInputElement;
        }

        this.#avatar = document.querySelectorAll('.profile__avatar-img');

        this.#addEventListeners();
    };
}
