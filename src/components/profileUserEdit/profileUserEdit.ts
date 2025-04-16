import template from './profileUserEdit.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';
import { Applicant, ApplicantEdit } from '../../api/interfaces';
import { store } from '../../store';
import { api } from '../../api/api';
import { router } from '../../router';
import { formValidate } from '../../forms';

export class ProfileUserEdit {
    readonly #parent: HTMLElement;
    #defaultData: Applicant | null = null;
    #data: ApplicantEdit | null = null;
    #id: number = 0;

    #form: HTMLFormElement | null = null;
    #sex: HTMLSelectElement | null = null;

    #confirm: NodeListOf<HTMLButtonElement> | null = null;
    #back: NodeListOf<HTMLButtonElement> | null = null;
    #uploadInput: HTMLInputElement | null = null;
    #avatar: NodeListOf<HTMLImageElement> | null = null;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById('profile_user_edit') as HTMLElement;
    }

    init = async () => {
        logger.info('profileUser init method called');
        const url = window.location.href.split('/');
        this.#id = Number.parseInt(url[url.length - 1]);
        if (
            !store.data.authorized ||
            store.data.user.role !== 'applicant' ||
            store.data.user.user_id !== this.#id
        )
            router.back();
        try {
            logger.info('INIT FETCH');
            const data = await api.applicant.get(this.#id);
            this.#defaultData = data;
        } catch {
            logger.info('Не удалось загрузить страницу');
            router.back();
        }
    };

    readonly #inputTranslation: Record<string, string> = {
        first_name: 'Имя',
        last_name: 'Фамилия',
        middle_name: 'Отчество',
        quote: 'Цитата',
        avatar: 'Аватар',
        sex: 'Пол',
        city: 'Адрес',
        birth_date: 'День рождения',
        vk: 'Вконтакте',
        tg: 'Телеграмм',
        facebook: 'Веб страница',
    };

    #formGet(form: HTMLFormElement): unknown {
        const formData = new FormData(form);
        const json: Record<string, unknown> = {};

        formData.forEach((value, key) => {
            switch (key) {
                case 'birth_date': {
                    const date = new Date(value as string);
                    json[key] = date.toISOString();
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
        logger.info('ProfileUserEdit remove method called');
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
                    this.#data = this.#formGet(this.#form) as Applicant;
                }
            });
        }

        if (this.#confirm) {
            this.#confirm.forEach((element) => {
                element.addEventListener('click', async (e: Event) => {
                    e.preventDefault();
                    if (
                        !this.#form ||
                        !formValidate(
                            this.#form,
                            this.#form as HTMLElement,
                            '.profile__error',
                            this.#inputTranslation,
                        )
                    )
                        return;
                    let error: HTMLElement | null = null;
                    if (this.#confirm) error = document.getElementById('profile_submit_error') as HTMLElement
                    if (error) {
                        error.textContent = ''
                    }
                    try {
                        logger.info(this.#data);
                        if (this.#data) {
                            await api.applicant.update(this.#data);
                            if (this.#uploadInput) {
                                const files = this.#uploadInput.files;
                                if (!files || files.length === 0)
                                    router.go(`/profileUser/${store.data.user.user_id}`);
                            }
                        }
                    } catch {
                        if (error) {
                            error.textContent += 'Ошибка при обновлении информации\n'
                        }
                    }
                    if (this.#uploadInput) {
                        const files = this.#uploadInput.files;
                        if (!files || files.length === 0) return;
                        const image = files[0];
                        if (!image.type.startsWith('image/')) return;
                        const formData = new FormData();
                        formData.append('avatar', image);
                        try {
                            await api.applicant.avatar(formData);
                            router.go(`/profileUser/${store.data.user.user_id}`);
                        } catch {
                            if (error) {
                                error.textContent += 'Ошибка при загрузке картинки'
                            }
                        }
                    }
                });
            });
        }

        if (this.#back) {
            this.#back.forEach((element) => {
                element.addEventListener('click', async (e: Event) => {
                    e.preventDefault();
                    router.go(`/profileUser/${this.#id}`);
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
        logger.info('ProfileUserEdit render method called');
        if (this.#defaultData && this.#defaultData.birth_date === '0001-01-01T00:00:00Z') {
            this.#defaultData.birth_date = '';
        } else if (this.#defaultData) {
            const birth_date = new Date(this.#defaultData.birth_date);
            const year = birth_date.getFullYear();
            const month = String(birth_date.getMonth() + 1).padStart(2, '0'); // Месяцы нумеруются с 0
            const day = String(birth_date.getDate()).padStart(2, '0');
            this.#defaultData.birth_date = `${year}-${month}-${day}`;
        }
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...this.#defaultData,
            }),
        );

        this.#form = document.forms.namedItem('profile_user_edit') as HTMLFormElement;
        if (this.#form) {
            this.#sex = this.#form.elements.namedItem('sex') as HTMLSelectElement;
            this.#back = document.querySelectorAll('.job__button_second');
            this.#confirm = document.querySelectorAll('.job__button');
            this.#uploadInput = this.#form.elements.namedItem('file_input') as HTMLInputElement;
        }

        if (this.#sex) {
            this.#sex.value = this.#data?.sex ?? 'M';
        }

        this.#avatar = document.querySelectorAll('.profile__avatar-img');

        this.#addEventListeners();

        this.#data = this.#formGet(this.#form) as Applicant;
    };
}
