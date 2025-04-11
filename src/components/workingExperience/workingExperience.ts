import template from './workingExperience.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';
import { WorkExperience, } from '../../api/interfaces';
import { emptyWorkExperience } from '../../api/empty';

export class WorkingExperience {
    readonly #parent: HTMLElement;
    readonly #defaultData: WorkExperience;
    #form: HTMLFormElement | null = null;

    #newExperience: HTMLButtonElement | null = null;

    constructor(parent: HTMLElement, id: number, default_data: WorkExperience = emptyWorkExperience) {
        this.#parent = parent;
        this.#defaultData = default_data;
        if (default_data === emptyWorkExperience) {
            this.#defaultData.id = id
        }

        let parts = this.#defaultData.start_date.split('.')
        console.log(parts)
        if (parts.length === 3) {
            this.#defaultData.start_date = `${parts[2]}-${parts[1]}-${parts[0]}`
        }
        parts = this.#defaultData.end_date.split('.')
        if (parts.length === 3) {
            this.#defaultData.end_date = `${parts[2]}-${parts[1]}-${parts[0]}`
        }
    }

    readonly #inputTranslation: Record<string, string> = {
        employer_name: 'Компания',
        position: 'Должность',
        duties: 'Обязаности и достижения',
        start_date: 'Начало работы',
        end_date: 'Окончание работы',
    };

    #customMessage(field: HTMLInputElement | HTMLSelectElement): string {
        const validity = field.validity;
        if (validity.valueMissing) {
            return `${this.#inputTranslation[field.name]}: Заполните поле`;
        }
        if (validity.patternMismatch) {
            return `${this.#inputTranslation[field.name]}: ${field.title}`;
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


    #formValidate(element: HTMLElement): boolean {
        if (this.#form) {
            const errorElement = this.#form.querySelector('.resumeEdit__error') as HTMLElement;

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

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.forms.namedItem(`experience_${this.#defaultData.id}`) as HTMLElement
    }

    /**
     * Очистка
     */
    remove = () => {
        logger.info('ProfileUser remove method called');
        this.self.innerHTML = '';
    };

    readonly #addEventListeners = () => {
        if (this.#form) {
            this.#form.addEventListener('input', (e: Event) => {
                this.#formValidate(e.target as HTMLElement);
            });
        }

        if (this.#newExperience) {
            this.#newExperience.addEventListener('click', (e: Event) => {
                e.preventDefault()
                if (this.#formValidate(this.#form as HTMLElement) && this.#newExperience) {
                    this.#newExperience.hidden = true
                    const newExperience = new WorkingExperience(this.#parent, this.#defaultData.id + 1)
                    newExperience.render()
                }
            })
        }
    };

    /**
     * Рендеринг страницы
     */
    render = () => {
        logger.info('ResumeEdit render method called');
        this.#parent.insertAdjacentHTML('beforeend', template({
            ...this.#defaultData,
            'isNew': this.#defaultData === emptyWorkExperience,
        }));
        this.#form = document.forms.namedItem('resume_edit') as HTMLFormElement;

        this.#addEventListeners()
    };
}
