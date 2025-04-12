import template from './profileCompanyEdit.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';
import { Employer } from '../../api/interfaces';
import { store } from '../../store';
import { api } from '../../api/api';
import { router } from '../../router';

export class ProfileCompanyEdit {
    readonly #parent: HTMLElement;

    #form: HTMLFormElement | null = null;
    #data: Employer | null = null;

    #confirm: NodeListOf<HTMLButtonElement> | null = null;
    #back: NodeListOf<HTMLButtonElement> | null = null;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById('profile_company_edit') as HTMLElement
    }

    readonly #inputTranslation: Record<string, string> = {
        company_name: 'Название компании',
        slogan: 'Слоган',
        website: 'Веб-сайт',
        description: 'Описание',
        address: 'Адрес'
    };

    #customMessage(field: HTMLInputElement | HTMLSelectElement): string {
        const validity = field.validity;
        if (validity.valueMissing) {
            return `Заполните поле ${this.#inputTranslation[field.name]}`;
        }
        if (validity.patternMismatch) {
            return field.title;
        }
        if (validity.tooLong) {
            return `${this.#inputTranslation[field.name]}: Много введённых данных`;
        }

        if (validity.tooShort) {
            return `${this.#inputTranslation[field.name]}: Мало введённых данных`;
        }
        return `${this.#inputTranslation[field.name]}: ${field.validationMessage}`;
    }

    #fieldValidate(field: HTMLInputElement | HTMLSelectElement, errorElement: HTMLElement): boolean {
        field.classList.remove('error');
        field.classList.remove('valid');
        if (!field.validity.valid) {
            if (document.activeElement !== field && (field.value === '' || field.value === '0'))
                field.classList.add('error');
            errorElement.textContent = this.#customMessage(field);
            errorElement.style.display = 'block';
            return false
        }
        if (field.validity.valid) field.classList.add('valid');
        return true
    }


    #formValidate(element: HTMLElement = this.#form as HTMLElement): boolean {
        if (this.#form) {
            const errorElement = this.#form.querySelector('.vacancyEdit__error') as HTMLElement;

            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';

                if (['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)) {
                    if (!this.#fieldValidate(element as HTMLInputElement, errorElement)) {
                        return false
                    }
                }

                const fields = this.#form.querySelectorAll(
                    'input, select, textarea',
                ) as unknown as Array<HTMLInputElement | HTMLSelectElement>;

                let valid = true;

                fields.forEach((field) => {
                    if (valid && !this.#fieldValidate(field, errorElement)) {
                        valid = false
                    }
                });
                return valid;
            }
        }
        return false;
    }

    #formGet(form: HTMLFormElement): unknown {
        const formData = new FormData(form)
        const json: Record<string, unknown> = {};

        formData.forEach((value, key) => {
            switch (key) {
                case 'birth_date':
                    {
                        const parts = (value as string).split('-')
                        if (parts.length === 3) {
                            json[key] = `${parts[2]}.${parts[1]}.${parts[0]}`
                        }
                        break
                    }
                case 'file_input':
                    break
                default:
                    json[key] = value
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
                this.#formValidate(e.target as HTMLElement);
                if (this.#form) this.#data = this.#formGet(this.#form) as Employer
            });
        }

        if (this.#confirm) {
            this.#confirm.forEach((element) => {
                element.addEventListener('click', async (e: Event) => {
                    e.preventDefault();
                    if (!this.#formValidate()) return
                    try {
                        console.log(store.data.vacancy)
                        if (this.#data) await api.employer.update(this.#data);
                    } catch {
                        console.log('Ошибка при обновлении');
                    }
                });
            })
        }

        if (this.#back) {
            this.#back.forEach((element) => {
                element.addEventListener('click', async (e: Event) => {
                    e.preventDefault();
                    router.back()
                });
            })
        }
    }

    /**
     * Рендеринг страницы
     */
    render = () => {
        logger.info('VacancyEdit render method called');
        if (store.data.authorized && store.data.user.type === 'employer' && store.data.user.employer) {
            this.#data = store.data.user.employer
        } else {
            router.back()
            return
        }
        this.#parent.insertAdjacentHTML('beforeend', template({
            ...this.#data
        }));

        this.#form = document.forms.namedItem('profile_user_edit') as HTMLFormElement
        if (this.#form) {
            this.#back = document.querySelectorAll('.job__button_second')
            this.#confirm = document.querySelectorAll('.job__button')
        }

        this.#addEventListeners()
    };
}
