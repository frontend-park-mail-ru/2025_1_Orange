import template from './workingExperience.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';
import { WorkExperience } from '../../api/interfaces';
import { emptyWorkExperience } from '../../api/empty';
import { fieldValidate } from '../../forms';
import { toInputDate } from '../../utils/date';

export class WorkingExperience {
    readonly #parent: HTMLElement;
    readonly #defaultData: WorkExperience;
    readonly #birth_date: string;
    #form: HTMLFormElement | null = null;

    #newExperience: HTMLButtonElement | null = null;
    #untilNow: HTMLInputElement | null = null;
    #end_date: HTMLInputElement | null = null;
    #start_date: HTMLInputElement | null = null;

    constructor(
        parent: HTMLElement,
        id: number,
        default_data: WorkExperience = emptyWorkExperience,
        birth_date: string = '0001-01-01T00:00:00Z',
    ) {
        this.#parent = parent;
        this.#defaultData = default_data;
        if (default_data === emptyWorkExperience) {
            this.#defaultData.id = id;
        }
        this.#birth_date = birth_date;
    }

    readonly #inputTranslation: Record<string, string> = {
        employer_name: 'Компания',
        position: 'Должность',
        duties: 'Обязаности и достижения',
        start_date: 'Начало работы',
        end_date: 'Окончание работы',
    };

    #formValidate(element: HTMLElement): boolean {
        const fieldset = element.closest('form') as HTMLFormElement;
        if (fieldset) {
            const errorElement = fieldset.querySelector('.resumeEdit__error') as HTMLElement;

            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';

                if (['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)) {
                    if (!fieldValidate(element as HTMLInputElement, this.#inputTranslation)) {
                        return false;
                    }
                }

                const fields = fieldset.querySelectorAll(
                    'input, select, textarea',
                ) as unknown as Array<HTMLInputElement | HTMLSelectElement>;

                let valid = true;

                fields.forEach((field) => {
                    if (valid && !fieldValidate(field, this.#inputTranslation)) {
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
            this.#form.querySelectorAll('textarea').forEach((input) => {
                input.addEventListener('input', () => {
                    input.style.height = 'auto';
                    input.style.height = (input.scrollHeight) + 'px';
                });

                input.dispatchEvent(new Event('input'));
            })
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
                if (
                    end.getTime() - start.getTime() < 0 &&
                    this.#untilNow &&
                    this.#untilNow.checked === false
                ) {
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
                if (
                    end.getTime() - start.getTime() < 0 &&
                    this.#untilNow &&
                    this.#untilNow.checked === false
                ) {
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
        const minWorkDate = new Date(Date.now());
        minWorkDate.setFullYear(minWorkDate.getFullYear() - 10);
        if (this.#defaultData && this.#birth_date !== '0001-01-01T00:00:00Z') {
            const birth_date = new Date(this.#birth_date);
            minWorkDate.setFullYear(birth_date.getFullYear() + 14);
        }
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...this.#defaultData,
                isNew: this.#defaultData === emptyWorkExperience,
                maxDate: toInputDate(new Date(Date.now())),
                minDate: toInputDate(minWorkDate),
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
    };
}
