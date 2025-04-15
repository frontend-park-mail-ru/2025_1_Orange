import template from './workingExperience.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';
import { WorkExperience } from '../../api/interfaces';
import { emptyWorkExperience } from '../../api/empty';

export class WorkingExperience {
    readonly #parent: HTMLElement;
    readonly #defaultData: WorkExperience;
    #form: HTMLFormElement | null = null;

    #newExperience: HTMLButtonElement | null = null;
    #untilNow: HTMLInputElement | null = null;
    #end_date: HTMLInputElement | null = null;
    #start_date: HTMLInputElement | null = null;

    constructor(
        parent: HTMLElement,
        id: number,
        default_data: WorkExperience = emptyWorkExperience,
    ) {
        this.#parent = parent;
        this.#defaultData = default_data;
        if (default_data === emptyWorkExperience) {
            this.#defaultData.id = id;
        }

        let parts = this.#defaultData.start_date.split('.');
        console.log(parts);
        if (parts.length === 3) {
            this.#defaultData.start_date = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        parts = this.#defaultData.end_date.split('.');
        if (parts.length === 3) {
            this.#defaultData.end_date = `${parts[2]}-${parts[1]}-${parts[0]}`;
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

    #fieldValidate(
        field: HTMLInputElement | HTMLSelectElement,
        errorElement: HTMLElement,
    ): boolean {
        field.classList.remove('error');
        field.classList.remove('valid');
        if (!field.validity.valid) {
            if (document.activeElement === field && field.value !== '' && field.value !== '0')
                field.classList.add('error');
            errorElement.textContent = this.#customMessage(field);
            errorElement.style.display = 'block';
            return false;
        }
        if (field.validity.valid) field.classList.add('valid');
        return true;
    }

    #formValidate(element: HTMLElement): boolean {
        const fieldset = element.closest('form') as HTMLFormElement;
        if (fieldset) {
            const errorElement = fieldset.querySelector('.resumeEdit__error') as HTMLElement;

            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';

                if (['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)) {
                    if (!this.#fieldValidate(element as HTMLInputElement, errorElement)) {
                        return false;
                    }
                }

                const fields = fieldset.querySelectorAll(
                    'input, select, textarea',
                ) as unknown as Array<HTMLInputElement | HTMLSelectElement>;

                let valid = true;

                fields.forEach((field) => {
                    if (valid && !this.#fieldValidate(field, errorElement)) {
                        valid = false;
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
        return document.forms.namedItem(`experience_${this.#defaultData.id}`) as HTMLElement;
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
                e.preventDefault();
                if (this.#formValidate(this.#form as HTMLElement) && this.#newExperience) {
                    this.#newExperience.hidden = true;
                    const newExperience = new WorkingExperience(
                        this.#parent,
                        this.#defaultData.id + 1,
                    );
                    newExperience.render();
                }
            });
        }

        if (this.#untilNow) {
            this.#untilNow.addEventListener('click', () => {
                if (this.#untilNow && this.#untilNow.checked && this.#form && this.#end_date) {
                    this.#end_date.required = false;
                } else if (this.#untilNow && this.#form && this.#end_date) {
                    this.#end_date.required = true;
                }
            });
        }

        if (this.#end_date && this.#start_date) {
            this.#end_date.addEventListener('input', () => {
                if (this.#start_date?.value === '' || this.#end_date?.value === '') return;
                if (!this.#start_date || !this.#end_date) return;
                const end = new Date(this.#end_date.value);
                const start = new Date(this.#start_date.value);
                if (end.getTime() - start.getTime() < 0 && this.#untilNow && !this.#untilNow.checked) {
                    this.#end_date.setCustomValidity('Конец работы раньше начала работы');
                } else {
                    this.#end_date.setCustomValidity('');
                    this.#start_date.setCustomValidity('');
                }
            });
            this.#start_date.addEventListener('input', () => {
                if (this.#start_date?.value === '' || this.#end_date?.value === '') return;
                if (!this.#start_date || !this.#end_date) return;
                const end = new Date(this.#end_date.value);
                const start = new Date(this.#start_date.value);
                if (end.getTime() - start.getTime() < 0) {
                    this.#end_date.setCustomValidity('Конец работы раньше начала работы');
                } else {
                    this.#end_date.setCustomValidity('');
                    this.#start_date.setCustomValidity('');
                }
            });
        }
    };

    /**
     * Рендеринг страницы
     */
    render = () => {
        logger.info('ResumeEdit render method called');
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...this.#defaultData,
                isNew: this.#defaultData === emptyWorkExperience,
            }),
        );
        this.#form = this.self as HTMLFormElement;
        if (this.#form) {
            this.#untilNow = this.#form.elements.namedItem('until_now') as HTMLInputElement;
            this.#end_date = this.#form.elements.namedItem('end_date') as HTMLInputElement;
            this.#start_date = this.#form.elements.namedItem('start_date') as HTMLInputElement;
            this.#newExperience = this.#form.elements.namedItem(
                'new_experience',
            ) as HTMLButtonElement;
        }

        this.#addEventListeners();

        if (this.#defaultData.until_now && this.#untilNow) this.#untilNow.checked = true;

        if (this.#defaultData === emptyWorkExperience) {
            const first = this.#form.elements[0] as HTMLInputElement
            first.focus()
        }
    };
}
