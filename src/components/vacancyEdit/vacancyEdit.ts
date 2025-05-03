import template from './vacancyEdit.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';
import { Vacancy, VacancyCreate } from '../../api/interfaces';
import { emptyVacancy } from '../../api/empty';
import { api } from '../../api/api';
import { store } from '../../store';
import './vacancyEdit.sass';
import { router } from '../../router';
import { fieldValidate } from '../../forms';

export class VacancyEdit {
    readonly #parent: HTMLElement;
    #defaultData: Vacancy = emptyVacancy;
    #id: number = 0;

    #form: HTMLFormElement | null = null;

    #basicFieldset: HTMLFieldSetElement | null = null;
    #employmentFieldset: HTMLFieldSetElement | null = null;
    #workformatFieldset: HTMLFieldSetElement | null = null;
    #salaryFieldset: HTMLFieldSetElement | null = null;
    #experienceFieldset: HTMLFieldSetElement | null = null;
    #descriptionFieldset: HTMLFieldSetElement | null = null;
    #tasksFieldset: HTMLFieldSetElement | null = null;
    #requirementsFieldset: HTMLFieldSetElement | null = null;
    #optionalFieldset: HTMLFieldSetElement | null = null;
    #skillsFieldset: HTMLFieldSetElement | null = null;

    #basicNext: HTMLButtonElement | null = null;
    #employmentNext: HTMLButtonElement | null = null;
    #workformatNext: HTMLButtonElement | null = null;
    #moneyexperienceNext: HTMLButtonElement | null = null;
    #descriptionNext: HTMLButtonElement | null = null;
    #confirm: HTMLButtonElement | null = null;

    #workFormatInput: RadioNodeList | null = null;
    #employmentInput: RadioNodeList | null = null;
    #scheduleInput: HTMLInputElement | null = null;
    #taxesIncludedInput: RadioNodeList | null = null;
    #experienceInput: RadioNodeList | null = null;
    #skillsInput: HTMLInputElement | null = null;
    #salaryFrom: HTMLInputElement | null = null;
    #salaryTo: HTMLInputElement | null = null;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById('vacancy_edit_page') as HTMLElement;
    }

    /**
     * Получение значений если надо
     */
    init = async () => {
        logger.info('VACANCY EDIT INIT')
        if (!store.data.authorized || store.data.user.role === 'applicant') router.back()
        const url = window.location.pathname.split('/');
        const last = url[url.length - 1];
        logger.info('url: ', url);
        if (!isNaN(Number.parseInt(last)) && last !== '') {
            this.#id = Number.parseInt(last);
            try {
                const data = await api.vacancy.get(this.#id);
                this.#defaultData = data;
            } catch {
                logger.info('Не удалось загрузить вакансию');
                this.#id = 0;
                this.#defaultData = emptyVacancy;
                 try {
                     this.#defaultData.employer = await api.employer.get(store.data.user.user_id);
                 } catch {
                     router.back();
                 }
            }
        } else {
            this.#defaultData = emptyVacancy;
             try {
                 this.#defaultData.employer = await api.employer.get(store.data.user.user_id);
             } catch {
                 router.back();
             }
        }
    };

    readonly #inputTranslation: Record<string, string> = {
        title: 'Название',
        specialization: 'Специализация',
        city: 'Город',
        schedule: 'График работы',
        working_hours: 'Время работы',
        salary_from: 'Зарплата от',
        salary_to: 'Зарплата до',
        description: 'Описание',
        tasks: 'Задачи',
        requirements: 'Требования',
        optional_requirements: 'Будет плюсом',
        skills : 'Навыки',
    };

    #formValidate(element: HTMLElement): boolean {
        const fieldset = element.closest('fieldset') as HTMLFieldSetElement;
        if (fieldset) {
            const errorElement = fieldset.querySelector('.vacancyEdit__error') as HTMLElement;

            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';

                if (['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)) {
                    if (
                        !fieldValidate(
                            element as HTMLInputElement,
                            this.#inputTranslation,
                        )
                    ) {
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

    #formGet(form: HTMLFormElement): unknown {
        const formData = new FormData(form);
        const json: Record<string, unknown> = {};

        formData.forEach((value, key) => {
            switch (key) {
                case 'skills':
                    json[key] = (value as string)
                        .split(',')
                        .map((skill) => skill.trim())
                        .filter((skill) => skill !== '');
                    break;
                case 'taxes_included':
                    json[key] = value === 'true'
                    break;
                case 'salary_from':
                case 'salary_to':
                case 'working_hours':
                    json[key] = parseInt(value as string) || 0;
                    break;
                case 'description':
                case 'tasks':
                case 'requirements':
                case 'optional_requirements':
                    if (typeof value === 'string')
                    json[key] = value.split('\n').map(line => line.trim()).filter(line => line !== '').join('\n')
                    break
                default:
                    console.log(key, typeof value)
                    if (typeof value === 'string') json[key] = value.trim()
                    else json[key] = value;
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
            });
        }

        // Проверяем и настраиваем каждую кнопку "Далее"
        if (this.#basicNext) {
            this.#basicNext.addEventListener('click', (e: Event) => {
                e.preventDefault();
                if (this.#basicFieldset && !this.#formValidate(this.#basicFieldset)) return;
                if (this.#employmentFieldset && this.#basicNext) {
                    this.#employmentFieldset.hidden = false;
                    const first = this.#employmentFieldset.elements[0] as HTMLInputElement
                    first.focus()
                    this.#basicNext.hidden = true;
                }
            });
        }

        if (this.#employmentNext) {
            this.#employmentNext.addEventListener('click', (e: Event) => {
                e.preventDefault();
                if (this.#basicFieldset && !this.#formValidate(this.#basicFieldset)) return;
                if (this.#employmentFieldset && !this.#formValidate(this.#employmentFieldset))
                    return;

                if (this.#workformatFieldset && this.#employmentNext) {
                    this.#workformatFieldset.hidden = false;
                    const first = this.#workformatFieldset.elements[0] as HTMLInputElement
                    first.focus()
                    this.#employmentNext.hidden = true;
                }
            });
        }

        if (this.#workformatNext) {
            this.#workformatNext.addEventListener('click', (e: Event) => {
                e.preventDefault();
                if (this.#basicFieldset && !this.#formValidate(this.#basicFieldset)) return;
                if (this.#employmentFieldset && !this.#formValidate(this.#employmentFieldset))
                    return;
                if (this.#workformatFieldset && !this.#formValidate(this.#workformatFieldset))
                    return;

                if (this.#salaryFieldset && this.#experienceFieldset && this.#workformatNext) {
                    this.#salaryFieldset.hidden = false;
                    const first = this.#salaryFieldset.elements[0] as HTMLInputElement
                    first.focus()
                    this.#experienceFieldset.hidden = false;
                    this.#workformatNext.hidden = true;
                }
            });
        }

        if (this.#moneyexperienceNext) {
            this.#moneyexperienceNext.addEventListener('click', (e: Event) => {
                e.preventDefault();
                if (this.#basicFieldset && !this.#formValidate(this.#basicFieldset)) return;
                if (this.#employmentFieldset && !this.#formValidate(this.#employmentFieldset))
                    return;
                if (this.#workformatFieldset && !this.#formValidate(this.#workformatFieldset))
                    return;
                if (
                    this.#salaryFieldset &&
                    this.#experienceFieldset &&
                    !this.#formValidate(this.#salaryFieldset) &&
                    !this.#formValidate(this.#experienceFieldset)
                )
                    return;

                if (
                    this.#descriptionFieldset &&
                    this.#requirementsFieldset &&
                    this.#tasksFieldset &&
                    this.#optionalFieldset &&
                    this.#moneyexperienceNext
                ) {
                    this.#descriptionFieldset.hidden = false;
                    const first = this.#descriptionFieldset.elements[0] as HTMLInputElement
                    first.focus()
                    this.#requirementsFieldset.hidden = false;
                    this.#tasksFieldset.hidden = false;
                    this.#optionalFieldset.hidden = false;
                    this.#moneyexperienceNext.hidden = true;
                }
            });
        }

        if (this.#descriptionNext) {
            this.#descriptionNext.addEventListener('click', (e: Event) => {
                e.preventDefault();
                if (this.#basicFieldset && !this.#formValidate(this.#basicFieldset)) return;
                if (this.#employmentFieldset && !this.#formValidate(this.#employmentFieldset))
                    return;
                if (this.#workformatFieldset && !this.#formValidate(this.#workformatFieldset))
                    return;
                if (
                    this.#salaryFieldset &&
                    this.#experienceFieldset &&
                    !this.#formValidate(this.#salaryFieldset) &&
                    !this.#formValidate(this.#experienceFieldset)
                )
                    return;
                if (this.#descriptionFieldset && !this.#formValidate(this.#descriptionFieldset))
                    return;

                if (this.#skillsFieldset && this.#descriptionNext && this.#confirm) {
                    this.#skillsFieldset.hidden = false;
                    const first = this.#skillsFieldset.elements[0] as HTMLInputElement
                    first.focus()
                    this.#descriptionNext.hidden = true;
                    this.#confirm.hidden = false;
                }
            });
        }

        if (this.#confirm) {
            this.#confirm.addEventListener('click', async (e: Event) => {
                e.preventDefault();
                if (!this.#form) return;
                if (this.#basicFieldset && !this.#formValidate(this.#basicFieldset)) return;
                if (this.#employmentFieldset && !this.#formValidate(this.#employmentFieldset))
                    return;
                if (this.#workformatFieldset && !this.#formValidate(this.#workformatFieldset))
                    return;
                if (
                    this.#salaryFieldset &&
                    this.#experienceFieldset &&
                    !this.#formValidate(this.#salaryFieldset) &&
                    !this.#formValidate(this.#experienceFieldset)
                )
                    return;
                if (this.#descriptionFieldset && !this.#formValidate(this.#descriptionFieldset))
                    return;
                if (this.#skillsFieldset && !this.#formValidate(this.#skillsFieldset)) return;
                let error: HTMLElement | null = null;
                if (this.#confirm) error = this.#confirm.parentNode?.querySelector('.vacancyEdit__error') as HTMLElement
                if (error) {
                    error.textContent = ''
                }
                try {
                    store.data.vacancy = this.#formGet(this.#form) as VacancyCreate;
                    logger.info(store.data.vacancy);
                    if (this.#id !== 0) {
                        const data = await api.vacancy.update(this.#id, store.data.vacancy);
                        router.go(`/vacancy/${data.id}`)
                    } else {
                        const data = await api.vacancy.create(store.data.vacancy);
                        router.go(`/vacancy/${data.id}`)
                    }
                } catch {
                    if (this.#id !== 0 && error) error.textContent = 'Ошибка при обновлении вакансии'
                    else if (error) error.textContent = 'Ошибка при создании вакансии'
                }
            });
        }

        if (this.#salaryFrom && this.#salaryTo) {
            this.#salaryFrom.addEventListener('input', () => {
                if (!this.#salaryFrom || !this.#salaryTo) return;
                if (
                    Number.parseInt(this.#salaryTo.value) -
                    Number.parseInt(this.#salaryFrom.value) <
                    0
                ) {
                    logger.info(
                        Number.parseInt(this.#salaryTo.value) -
                        Number.parseInt(this.#salaryFrom.value),
                    );
                    this.#salaryFrom.setCustomValidity('Неправильно задан диапазон зарплаты');
                } else {
                    this.#salaryFrom.setCustomValidity('');
                    this.#salaryTo.setCustomValidity('')
                }
            });
            this.#salaryTo.addEventListener('input', () => {
                if (!this.#salaryFrom || !this.#salaryTo) return;
                if (
                    Number.parseInt(this.#salaryTo.value) -
                    Number.parseInt(this.#salaryFrom.value) <
                    0
                ) {
                    logger.info(
                        Number.parseInt(this.#salaryTo.value) -
                        Number.parseInt(this.#salaryFrom.value),
                    );
                    this.#salaryTo.setCustomValidity('Неправильно задан диапазон зарплаты');
                } else {
                    this.#salaryTo.setCustomValidity('');
                    this.#salaryFrom.setCustomValidity('');
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
                isEdit: this.#id !== 0,
            }),
        );

        this.#form = document.forms.namedItem('vacancy_edit') as HTMLFormElement;

        this.#basicFieldset = document.getElementById('basic_fieldset') as HTMLFieldSetElement;
        this.#employmentFieldset = document.getElementById(
            'employment_fieldset',
        ) as HTMLFieldSetElement;
        this.#workformatFieldset = document.getElementById(
            'workformat_fieldset',
        ) as HTMLFieldSetElement;
        this.#salaryFieldset = document.getElementById('salary_fieldset') as HTMLFieldSetElement;
        this.#experienceFieldset = document.getElementById(
            'experience_fieldset',
        ) as HTMLFieldSetElement;
        this.#descriptionFieldset = document.getElementById(
            'description_fieldset',
        ) as HTMLFieldSetElement;
        this.#tasksFieldset = document.getElementById('tasks_fieldset') as HTMLFieldSetElement;
        this.#requirementsFieldset = document.getElementById(
            'requirements_fieldset',
        ) as HTMLFieldSetElement;
        this.#optionalFieldset = document.getElementById(
            'optional_fieldset',
        ) as HTMLFieldSetElement;
        this.#skillsFieldset = document.getElementById('skills_fieldset') as HTMLFieldSetElement;

        this.#basicNext = document.getElementById('basic_next') as HTMLButtonElement;
        this.#employmentNext = document.getElementById('employment_next') as HTMLButtonElement;
        this.#workformatNext = document.getElementById('workformat_next') as HTMLButtonElement;
        this.#moneyexperienceNext = document.getElementById(
            'moneyexperience_next',
        ) as HTMLButtonElement;
        this.#descriptionNext = document.getElementById('description_next') as HTMLButtonElement;
        this.#confirm = document.getElementById('vacancy_edit_confirm') as HTMLButtonElement;
        if (this.#id !== 0) {
            this.#confirm.textContent = 'Изменить вакансию';
        }

        if (this.#form) {
            this.#workFormatInput = this.#form.elements.namedItem('work_format') as RadioNodeList;
            this.#employmentInput = this.#form.elements.namedItem('employment') as RadioNodeList;
            this.#scheduleInput = this.#form.elements.namedItem('schedule') as HTMLInputElement;
            this.#taxesIncludedInput = this.#form.elements.namedItem(
                'taxes_included',
            ) as RadioNodeList;
            this.#experienceInput = this.#form.elements.namedItem('experience') as RadioNodeList;
            this.#skillsInput = this.#form.elements.namedItem('skills') as HTMLInputElement;
            this.#salaryFrom = this.#form.elements.namedItem('salary_from') as HTMLInputElement;
            this.#salaryTo = this.#form.elements.namedItem('salary_to') as HTMLInputElement;
        }

        this.#addEventListeners();

        if (this.#id === 0) {
            this.#employmentFieldset.hidden = true;
            this.#workformatFieldset.hidden = true;
            this.#salaryFieldset.hidden = true;
            this.#experienceFieldset.hidden = true;
            this.#descriptionFieldset.hidden = true;
            this.#tasksFieldset.hidden = true;
            this.#requirementsFieldset.hidden = true;
            this.#optionalFieldset.hidden = true;
            this.#skillsFieldset.hidden = true;
            this.#confirm.hidden = true;
            const first = this.#basicFieldset.elements[0] as HTMLInputElement
            first.focus()
        }

        if (
            this.#id !== 0 &&
            this.#workFormatInput &&
            this.#employmentInput &&
            this.#scheduleInput &&
            this.#taxesIncludedInput &&
            this.#experienceInput &&
            this.#skillsInput
        ) {
            this.#workFormatInput.value = this.#defaultData.work_format;
            this.#employmentInput.value = this.#defaultData.employment;
            this.#scheduleInput.value = this.#defaultData.schedule;
            this.#taxesIncludedInput.value = this.#defaultData.taxes_included ? 'true' : 'false';
            this.#experienceInput.value = this.#defaultData.experience;
            this.#skillsInput.value = this.#defaultData.skills.join(', ');
        }
        if (
            this.#id !== 0 &&
            this.#basicNext &&
            this.#employmentNext &&
            this.#workformatNext &&
            this.#descriptionNext &&
            this.#moneyexperienceNext
        ) {
            this.#basicNext.hidden = true;
            this.#employmentNext.hidden = true;
            this.#workformatNext.hidden = true;
            this.#descriptionNext.hidden = true;
            this.#moneyexperienceNext.hidden = true;
        }

        this.#formGet(this.#form);
    };
}
