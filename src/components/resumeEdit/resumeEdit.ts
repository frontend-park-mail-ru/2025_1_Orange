import template from './resumeEdit.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';
import { Resume, ResumeCreate, WorkExperienceCreate } from '../../api/interfaces';
import './resumeEdit.sass';
import { emptyApplicant, emptyResume, emptyResumeCreate } from '../../api/empty';
import { api } from '../../api/api';
import { store } from '../../store';
import { router } from '../../router';
import { resumeMock } from '../../api/mocks';
import { WorkingExperience } from '../workingExperience/workingExperience';

export class ResumeEdit {
    readonly #parent: HTMLElement;
    #id: number = 0;
    #data: ResumeCreate = emptyResumeCreate;
    #defaultData: Resume = emptyResume;
    #form: HTMLFormElement | null = null;

    #education: HTMLSelectElement | null = null;

    #basicFieldset: HTMLElement | null = null;
    #skillsFieldset: HTMLElement | null = null;
    #aboutmeFieldset: HTMLElement | null = null;
    #educationFieldset: HTMLElement | null = null;
    #experienceFieldset: HTMLElement | null = null;

    #nextBasicButton: HTMLButtonElement | null = null;
    #nextSkillsButton: HTMLButtonElement | null = null;
    #nextAboutMeButton: HTMLButtonElement | null = null;
    #nextEducationButton: HTMLButtonElement | null = null;
    #submit: HTMLElement | null = null;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    readonly #inputTranslation: Record<string, string> = {
        last_name: 'Фамилия',
        first_name: 'Имя',
        middle_name: 'Отчество',
        sex: 'Пол',
        birth_date: 'День рождения',
        phone: 'Телефон',
        skills: 'Навыки',
        specialization: 'Специализация',
        education: 'Образование',
        educational_institution: 'Учебное заведение',
        graduation_year: 'Год выпуска',
        about_me: 'Обо мне',
    };

    #customMessage(field: HTMLInputElement | HTMLSelectElement): string {
        console.log("MESSAGE", field)
        const validity = field.validity;
        if (validity.valueMissing) {
            return `${this.#inputTranslation[field.name] || field.name}: Заполните поле`;
        }
        if (validity.patternMismatch) {
            return field.title;
        }
        if (validity.tooLong) {
            return `Много введённых`;
        }

        if (validity.tooShort) {
            return `Мало введённых данных`;
        }
        return `${this.#inputTranslation[field.name] || field.name}: ${field.validationMessage}`;
    }

    #formValidate(element: HTMLElement): boolean {
        const fieldset = element.closest('fieldset') as HTMLFieldSetElement;
        if (fieldset) {
            const errorElement = fieldset.querySelector('.resumeEdit__error') as HTMLElement;

            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';

                const fields = fieldset.querySelectorAll(
                    'input, select, textarea',
                ) as unknown as Array<HTMLInputElement | HTMLSelectElement>;

                let valid = true;

                fields.forEach((field) => {
                    if (!field.validity.valid) {
                        field.classList.add('form__input_error');
                        errorElement.textContent = this.#customMessage(field);
                        errorElement.style.display = 'block';
                        valid = false;
                    } else {
                        field.classList.remove('form__input_error');
                    }
                });
                return valid;
            }
        }
        return false;
    }

    init = async () => {
        const url = window.location.pathname.split('/');
        const last = url[url.length - 1];
        console.log('url: ', url);
        if (!isNaN(Number.parseInt(last)) && last !== '') {
            this.#id = Number.parseInt(last);
            try {
                //const data = await api.resume.get(this.#id);
                const data = resumeMock
                this.#defaultData = data;
            } catch {
                console.log('Не удалось загрузить резюме');
                this.#id = 0;
                this.#defaultData = emptyResume;
                this.#defaultData.applicant = store.data.user.applicant ?? emptyApplicant;
                //router.back()
            }
        } else {
            this.#defaultData = emptyResume;
            this.#defaultData.applicant = store.data.user.applicant ?? emptyApplicant;
        }
    };

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById('resume_edit_page') as HTMLElement;
    }

    /**
     * Очистка
     */
    remove = () => {
        logger.info('ProfileUser remove method called');
        this.self.innerHTML = '';
    };

    #get(form: HTMLFormElement): unknown {
        const formData = new FormData(form)
        const json: Record<string, unknown> = {};

        formData.forEach((value, key) => {
            switch (key) {
                case 'skills':
                    json[key] = (value as string).split(',').map(skill => skill.trim()).filter(skill => skill !== '');
                    break
                default:
                    json[key] = value
            }
        });
        return json;
    }

    readonly #addEventListeners = () => {
        if (this.#form) {
            this.#form.addEventListener('input', (e: Event) => {
                this.#formValidate(e.target as HTMLElement);
                if (this.#form) this.#data = this.#get(this.#form) as ResumeCreate
            })
        }

        if (this.#nextBasicButton) {
            this.#nextBasicButton.addEventListener('click', (e: Event) => {
                e.preventDefault();
                if (!this.#nextBasicButton) return;
                if (this.#formValidate(this.#nextBasicButton) && this.#skillsFieldset) {
                    this.#nextBasicButton.hidden = true;
                    this.#skillsFieldset.hidden = false;
                }
            });
        }

        if (this.#nextSkillsButton) {
            this.#nextSkillsButton.addEventListener('click', (e: Event) => {
                e.preventDefault();
                if (!this.#nextSkillsButton) return;
                if (this.#formValidate(this.#nextSkillsButton) && this.#educationFieldset) {
                    this.#nextSkillsButton.hidden = true;
                    this.#educationFieldset.hidden = false;
                }
            });
        }

        if (this.#nextEducationButton) {
            this.#nextEducationButton.addEventListener('click', (e: Event) => {
                e.preventDefault();
                if (!this.#nextEducationButton) return;
                if (this.#formValidate(this.#nextEducationButton) && this.#aboutmeFieldset) {
                    this.#nextEducationButton.hidden = true;
                    this.#aboutmeFieldset.hidden = false;
                }
            });
        }

        if (this.#nextAboutMeButton) {
            this.#nextAboutMeButton.addEventListener('click', (e: Event) => {
                e.preventDefault();
                if (!this.#nextAboutMeButton) return;
                if (
                    this.#formValidate(this.#nextAboutMeButton) &&
                    this.#experienceFieldset &&
                    this.#submit
                ) {
                    this.#nextAboutMeButton.hidden = true;
                    this.#experienceFieldset.hidden = false;
                    this.#submit.hidden = false;
                }
            });
        }

        if (this.#submit) {
            this.#submit.addEventListener('click', async (e: Event) => {
                e.preventDefault();
                if (this.#form) this.#data = this.#get(this.#form) as ResumeCreate
                const experience = this.self.querySelectorAll('.resumeEdit__experience')
                this.#data.work_experience = []
                experience.forEach((element) => {
                    if (element.tagName === 'FORM') {
                        const form = element as HTMLFormElement
                        if (form.checkValidity()) {
                            this.#data.work_experience.push(this.#get(form) as WorkExperienceCreate)
                        }
                    }
                })
                console.log(this.#data)
                try {
                    if (this.#id !== 0) {
                        await api.resume.update(this.#id, this.#data);
                    } else {
                        await api.resume.create(this.#data);
                    }
                } catch {
                    console.log('Ошибка при создании');
                }
            });
        }
    };

    /**
     * Рендеринг страницы
     */
    render = () => {
        logger.info('ResumeEdit render method called');
        this.#parent.insertAdjacentHTML('beforeend', template({
            ...this.#defaultData,
            isNew: this.#id === 0,
            isMale: this.#defaultData.applicant.sex === 'male',
            skillsString: this.#defaultData.skills.join(', ')
        }));

        const experiencesContainer = document.getElementById('resume_edit_working_experiences') as HTMLElement
        let max_experience_id = 0
        this.#defaultData.work_experience.forEach((experience) => {
            const work = new WorkingExperience(experiencesContainer, experience.id, experience)
            work.render()
            if (experience.id > max_experience_id)
                max_experience_id = experience.id
        })
        const work = new WorkingExperience(experiencesContainer, max_experience_id + 1)
        work.render()
        this.#form = document.forms.namedItem('resume_edit') as HTMLFormElement;
        if (this.#form) {
            this.#education = this.#form.elements.namedItem('education') as HTMLSelectElement;
            this.#education.value = this.#defaultData.education

            this.#submit = this.self.querySelector('#resume_submit') as HTMLElement;
            if (this.#id !== 0) {
                this.#submit.textContent = 'Изменить вакансию';
            }

            this.#basicFieldset = this.#form.elements.namedItem('fieldset_basic') as HTMLElement;
            this.#skillsFieldset = this.#form.elements.namedItem('fieldset_skills') as HTMLElement;
            this.#educationFieldset = this.#form.elements.namedItem(
                'fieldset_education',
            ) as HTMLElement;
            this.#aboutmeFieldset = this.#form.elements.namedItem(
                'fieldset_aboutme',
            ) as HTMLElement;
            this.#experienceFieldset = this.#form.elements.namedItem(
                'fieldset_experience',
            ) as HTMLElement;

            this.#nextBasicButton = (
                this.#form.elements.namedItem('fieldset_basic') as HTMLElement
            ).querySelector('.job__button') as HTMLButtonElement;
            this.#nextSkillsButton = (
                this.#form.elements.namedItem('fieldset_skills') as HTMLElement
            ).querySelector('.job__button') as HTMLButtonElement;
            this.#nextEducationButton = (
                this.#form.elements.namedItem('fieldset_education') as HTMLElement
            ).querySelector('.job__button') as HTMLButtonElement;
            this.#nextAboutMeButton = (
                this.#form.elements.namedItem('fieldset_aboutme') as HTMLElement
            ).querySelector('.job__button') as HTMLButtonElement;
            // Добавление обработчиков изменений
            this.#addEventListeners();

            if (
                this.#id === 0 &&
                this.#skillsFieldset &&
                this.#educationFieldset &&
                this.#aboutmeFieldset &&
                this.#experienceFieldset &&
                this.#submit
            ) {
                this.#skillsFieldset.hidden = true;
                this.#educationFieldset.hidden = true;
                this.#aboutmeFieldset.hidden = true;
                this.#experienceFieldset.hidden = true;
                this.#submit.hidden = true;
            }

            if (this.#id !== 0 && this.#nextBasicButton && this.#nextSkillsButton && this.#nextEducationButton && this.#nextAboutMeButton) {
                this.#nextBasicButton.hidden = true
                this.#nextSkillsButton.hidden = true
                this.#nextEducationButton.hidden = true
                this.#nextAboutMeButton.hidden = true
            }
        }
    };
}
