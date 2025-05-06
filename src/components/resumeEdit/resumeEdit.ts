import template from './resumeEdit.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';
import { Resume, ResumeCreate, WorkExperienceCreate } from '../../api/interfaces';
import './resumeEdit.sass';
import { emptyResume, emptyResumeCreate } from '../../api/empty';
import { api } from '../../api/api';
import { store } from '../../store';
import { router } from '../../router';
import { WorkingExperience } from '../workingExperience/workingExperience';
import { fieldValidate, formValidate } from '../../forms';

export class ResumeEdit {
    readonly #parent: HTMLElement;
    #id: number = 0;
    #data: ResumeCreate = emptyResumeCreate;
    #defaultData: Resume = emptyResume;
    #form: HTMLFormElement | null = null;
    #profileEdit: HTMLButtonElement | null = null;

    #education: HTMLSelectElement | null = null;

    #skillsFieldset: HTMLFieldSetElement | null = null;
    #aboutmeFieldset: HTMLFieldSetElement | null = null;
    #educationFieldset: HTMLFieldSetElement | null = null;
    #experienceFieldset: HTMLFieldSetElement | null = null;

    #nextBasicButton: HTMLButtonElement | null = null;
    #nextSkillsButton: HTMLButtonElement | null = null;
    #nextAboutMeButton: HTMLButtonElement | null = null;
    #nextEducationButton: HTMLButtonElement | null = null;
    #submit: HTMLElement | null = null;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     */
    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    /**
     * Перевод полей ввода в форме
     */
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

    /**
     * Валидация формы
     * @param {HTMLElement} element - элемент
     * @returns {boolean} - валидна ли форма?
     */
    #formValidate(element: HTMLElement): boolean {
        const fieldset = element.closest('fieldset') as HTMLFieldSetElement;
        if (fieldset) {
            logger.info(element);
            logger.info(fieldset);
            const errorElement = fieldset.querySelector('.resumeEdit__error') as HTMLElement;
            logger.info(errorElement);
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
     * Получение данных о резюме
     * defaultData = Resume
     * defaultData используется при рендеринге формы
     */
    init = async () => {
        const url = window.location.pathname.split('/');
        const last = url[url.length - 1];
        logger.info('url: ', url);
        if (!isNaN(Number.parseInt(last)) && last !== '') {
            this.#id = Number.parseInt(last);
            try {
                const data = await api.resume.get(this.#id);
                this.#defaultData = data;
                try {
                    this.#defaultData.applicant = await api.applicant.get(store.data.user.user_id);
                } catch {
                    router.back();
                }
            } catch {
                logger.info('Не удалось загрузить резюме');
                this.#id = 0;
                this.#defaultData = emptyResume;
                try {
                    this.#defaultData.applicant = await api.applicant.get(store.data.user.user_id);
                } catch {
                    router.back();
                }
            }
        } else {
            this.#defaultData = emptyResume;
            try {
                this.#defaultData.applicant = await api.applicant.get(store.data.user.user_id);
            } catch {
                router.back();
            }
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

    /**
     * Получение данных из формы
     * @param {HTMLFormElement} form - форма из которой берутся значения
     * @returns {object} - JSON данных из формы
     */
    #get(form: HTMLFormElement): unknown {
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
                case 'graduation_year':
                    json[key] = `${value as string}-01-01`;
                    break;
                case 'until_now':
                    json[key] = (value as string) === 'on';
                    break;
                case 'aboutme':
                    if (typeof value === 'string')
                        json[key] = value
                            .split('\n')
                            .map((line) => line.trim())
                            .filter((line) => line !== '')
                            .join('\n');
                    break;
                default:
                    if (typeof value === 'string') json[key] = value.trim();
                    else json[key] = value;
            }
        });
        return json;
    }

    /**
     * Навешивание обработчиков
     */
    readonly #addEventListeners = () => {
        this.#profileEdit = document.getElementById('profile_change') as HTMLButtonElement;
        if (this.#profileEdit) {
            this.#profileEdit.addEventListener('click', (e: Event) => {
                e.preventDefault();
                router.go(`/profileUserEdit/${store.data.user.user_id}`);
            });
        }
        if (this.#form) {
            this.#form.addEventListener('input', (e: Event) => {
                this.#formValidate(e.target as HTMLElement);
            });
        }

        if (this.#nextBasicButton) {
            this.#nextBasicButton.addEventListener('click', (e: Event) => {
                e.preventDefault();
                if (!this.#nextBasicButton) return;
                if (this.#skillsFieldset) {
                    this.#nextBasicButton.hidden = true;
                    this.#skillsFieldset.hidden = false;
                    const first = this.#skillsFieldset.elements[0] as HTMLInputElement;
                    first.focus();
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
                    const first = this.#educationFieldset.elements[0] as HTMLInputElement;
                    first.focus();
                }
            });
        }

        if (this.#nextEducationButton) {
            this.#nextEducationButton.addEventListener('click', (e: Event) => {
                e.preventDefault();
                if (!this.#nextEducationButton) return;
                if (!this.#nextSkillsButton || !this.#formValidate(this.#nextSkillsButton)) return;
                if (this.#formValidate(this.#nextEducationButton) && this.#aboutmeFieldset) {
                    this.#nextEducationButton.hidden = true;
                    this.#aboutmeFieldset.hidden = false;
                    const first = this.#aboutmeFieldset.elements[0] as HTMLInputElement;
                    first.focus();
                }
            });
        }

        if (this.#nextAboutMeButton) {
            this.#nextAboutMeButton.addEventListener('click', (e: Event) => {
                e.preventDefault();
                if (!this.#nextAboutMeButton) return;
                if (!this.#nextSkillsButton || !this.#formValidate(this.#nextSkillsButton)) return;
                if (!this.#nextEducationButton || !this.#formValidate(this.#nextEducationButton))
                    return;
                if (
                    this.#formValidate(this.#nextAboutMeButton) &&
                    this.#experienceFieldset &&
                    this.#submit
                ) {
                    this.#nextAboutMeButton.hidden = true;
                    this.#experienceFieldset.hidden = false;
                    this.#submit.hidden = false;
                    const first = this.#experienceFieldset.elements[0] as HTMLInputElement;
                    first.focus();
                }
            });
        }

        if (this.#submit) {
            this.#submit.addEventListener('click', async (e: Event) => {
                e.preventDefault();
                if (!this.#nextSkillsButton || !this.#formValidate(this.#nextSkillsButton)) return;
                if (!this.#nextEducationButton || !this.#formValidate(this.#nextEducationButton))
                    return;
                if (!this.#aboutmeFieldset || !this.#formValidate(this.#aboutmeFieldset)) return;
                if (this.#form) this.#data = this.#get(this.#form) as ResumeCreate;
                const experience = document.querySelectorAll('.resumeEdit__experience');
                this.#data.work_experiences = [];
                experience.forEach((element) => {
                    logger.info(element);
                    if (element.tagName === 'FORM') {
                        logger.info('TRUE', element);
                        const form = element as HTMLFormElement;
                        if (fieldValidate(form.elements[1] as HTMLInputElement, this.#inputTranslation)) {
                            this.#data.work_experiences.push(
                                this.#get(form) as WorkExperienceCreate,
                            );
                            logger.info('NOW DATA', this.#data.work_experiences);
                        }
                    }
                });
                let error: HTMLElement | null = null;
                if (this.#submit)
                    error = this.#submit.parentNode?.querySelector(
                        '.vacancyEdit__error',
                    ) as HTMLElement;
                if (error) {
                    error.textContent = '';
                }
                try {
                    logger.info(this.#data);
                    if (this.#id !== 0) {
                        const data = await api.resume.update(this.#id, this.#data);
                        router.go(`/resume/${data.id}`);
                    } else {
                        const data = await api.resume.create(this.#data);
                        router.go(`/resume/${data.id}`);
                    }
                } catch {
                    if (this.#id !== 0 && error)
                        error.textContent = 'Ошибка при обновлении вакансии';
                    else if (error) error.textContent = 'Ошибка при создании вакансии';
                }
            });
        }
    };

    /**
     * Рендеринг страницы
     */
    render = () => {
        logger.info('ResumeEdit render method called');
        const minGraduatingDate = new Date();
        const maxGraduatingDate = new Date();
        minGraduatingDate.setFullYear(minGraduatingDate.getFullYear() - 50);
        maxGraduatingDate.setFullYear(maxGraduatingDate.getFullYear() + 5);

        if (
            this.#defaultData &&
            this.#defaultData.applicant.birth_date === '0001-01-01T00:00:00Z'
        ) {
            this.#defaultData.applicant.birth_date = '';
        } else if (this.#defaultData) {
            const birth_date = new Date(this.#defaultData.applicant.birth_date);
            const year = birth_date.getFullYear();
            const month = String(birth_date.getMonth() + 1).padStart(2, '0'); // Месяцы нумеруются с 0
            const day = String(birth_date.getDate()).padStart(2, '0');
            minGraduatingDate.setFullYear(birth_date.getFullYear() + 14);
            this.#defaultData.applicant.birth_date = `${year}-${month}-${day}`;
        }

        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...this.#defaultData,
                isNew: this.#id === 0,
                isMale: this.#defaultData.applicant.sex === 'M',
                skillsString: this.#defaultData.skills.join(', '),
                graduation_year: this.#defaultData.graduation_year.split('-')[0],
                min_year: this.#defaultData.applicant.birth_date,
                minGraduatingDate: minGraduatingDate.getFullYear(),
                maxGraduatingDate: maxGraduatingDate.getFullYear(),
            }),
        );
        this.#form = document.forms.namedItem('resume_edit') as HTMLFormElement;
        if (this.#form) {
            this.#education = this.#form.elements.namedItem('education') as HTMLSelectElement;
            this.#education.value = this.#defaultData.education;

            this.#submit = this.self.querySelector('#resume_submit') as HTMLElement;
            if (this.#id !== 0) {
                this.#submit.textContent = 'Изменить резюме';
            }

            this.#skillsFieldset = this.#form.elements.namedItem(
                'fieldset_skills',
            ) as HTMLFieldSetElement;
            this.#educationFieldset = this.#form.elements.namedItem(
                'fieldset_education',
            ) as HTMLFieldSetElement;
            this.#aboutmeFieldset = this.#form.elements.namedItem(
                'fieldset_aboutme',
            ) as HTMLFieldSetElement;
            this.#experienceFieldset = document.getElementById(
                'resume_edit_working_experiences',
            ) as HTMLFieldSetElement;

            this.#nextBasicButton = document.getElementById('basic_next') as HTMLButtonElement;
            this.#nextSkillsButton = document.getElementById('skills_next') as HTMLButtonElement;
            this.#nextEducationButton = document.getElementById(
                'education_next',
            ) as HTMLButtonElement;
            this.#nextAboutMeButton = document.getElementById('aboutme_next') as HTMLButtonElement;
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
                const experiencesContainer = document.getElementById(
                    'resume_edit_working_experiences',
                ) as HTMLElement;
                const work = new WorkingExperience(experiencesContainer, 1);
                work.render();
            }

            if (
                this.#id !== 0 &&
                this.#nextBasicButton &&
                this.#nextSkillsButton &&
                this.#nextEducationButton &&
                this.#nextAboutMeButton
            ) {
                this.#nextBasicButton.hidden = true;
                this.#nextSkillsButton.hidden = true;
                this.#nextEducationButton.hidden = true;
                this.#nextAboutMeButton.hidden = true;
                const experiencesContainer = document.getElementById(
                    'resume_edit_working_experiences',
                ) as HTMLElement;
                let max_experience_id = 0;
                this.#defaultData.work_experiences?.forEach((experience) => {
                    logger.info('WORK EXPERIENCES ', experience);
                    const work = new WorkingExperience(
                        experiencesContainer,
                        experience.id,
                        experience,
                    );
                    work.render();
                    if (experience.id > max_experience_id) max_experience_id = experience.id;
                });
                const work = new WorkingExperience(experiencesContainer, max_experience_id + 1);
                work.render();
            }
        }
    };
}
