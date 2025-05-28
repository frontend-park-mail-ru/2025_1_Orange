import { logger } from '../../utils/logger';
import template from './jobPage.handlebars';
import templateResponded from '../../partials/jobCardResponded.handlebars';
import templateNoResponded from '../../partials/jobCardNoResponded.handlebars';
import { Resume, Vacancy } from '../../api/interfaces';
import { JobCompanyCard } from '../jobCompanyCard/jobCompanyCard';
import './jobPage.sass';
import {
    employmentTranslations,
    experienceTranslations,
    workFormatTranslations,
} from '../../api/translations';
import { store } from '../../store';
import { emptyEmployer, emptyVacancy } from '../../api/empty';
import { api } from '../../api/api';
import { router } from '../../router';
import { DialogContainer } from '../dialog/dialog';
import notification from '../notificationContainer/notificationContainer';
import { ResumeRow } from '../resumeRow/resumeRow';
import emptyTemplate from './../../partials/emptyState.handlebars';
import { DeleteDialog } from '../deleteDialog/deleteDialog';
import { ResponseDialog } from '../responseDialog/responseDialog';
import { RegisterDialog } from '../registerDialog/registerDialog';

export class JobPage {
    readonly #parent: HTMLElement;
    #props: Vacancy = emptyVacancy;
    #editButton: HTMLElement | null = null;
    #buttonsContainer: HTMLElement | null = null;
    #deleteButton: HTMLElement | null = null;
    #deleteContainer: HTMLElement | null = null;
    #favoriteButton: HTMLElement | null = null;
    #id: number = 0;
    #responses: Resume[] = [];

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     */
    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    get self(): HTMLElement {
        return document.getElementById('job_page') as HTMLElement;
    }

    /**
     * Получение ваканси
     * props = Vacancy
     * @return {void}
     */
    init = async () => {
        logger.info('JobPage init method called');
        const url = window.location.href.split('/');
        this.#id = Number.parseInt(url[url.length - 1]);
        try {
            const data = await api.vacancy.get(this.#id);
            this.#props = data;
        } catch {
            notification.add('FAIL', 'Не удалось загрузить вакансию');
            logger.info('Не удалось загрузить страницу');
            router.back();
        }
        try {
            const data = await api.employer.get(this.#props.employer_id);
            this.#props.employer = data;
        } catch {
            this.#props.employer = emptyEmployer;
        }
    };

    /**
     * Навешивание обработчиков
     */
    readonly #addEventListeners = () => {
        this.#editButton = document.getElementById('vacancy_edit_button');
        this.#deleteContainer = this.self.querySelector('#delete_button') as HTMLElement;
        this.#deleteButton = this.self.querySelector('.job__button--delete');
        this.#buttonsContainer = this.self.querySelector('.vacancy__buttons');
        this.#favoriteButton = this.self.querySelector('.job__favorite');
        if (this.#buttonsContainer) {
            this.#buttonsContainer.addEventListener('click', (e: Event) => {
                e.preventDefault();
                const element = (e.target as HTMLElement).closest(
                    '.job__button, .job__button_second',
                );
                if (store.data.authorized === false) {
                    const dialog = new DialogContainer(
                        this.#parent,
                        'НеАвторизован',
                        RegisterDialog,
                    );
                    dialog.render();
                    return;
                }
                if (element && element.id === `vacancy_${this.#props.id}_resume`) {
                    const dialog = new DialogContainer(this.#parent, 'Отклик', ResponseDialog, {
                        click: this.#handleResumeClick,
                        target: this.self,
                    });
                    dialog.render();
                } else if (element && element.id === `vacancy_${this.#props.id}_unresume`) {
                    this.#handleUnresumeClick();
                }
            });
        }
        if (this.#favoriteButton) {
            this.#favoriteButton.addEventListener('click', async () => {
                if (store.data.authorized === false) {
                    const dialog = new DialogContainer(
                        this.#parent,
                        'НеАвторизован',
                        RegisterDialog,
                    );
                    dialog.render();
                    return;
                }
                if (this.#favoriteButton) {
                    const favoriteIcon = this.#favoriteButton.querySelector('img');
                    try {
                        await api.vacancy.favorite(this.#props.id);
                        if (favoriteIcon && favoriteIcon.src.endsWith('/heart-fill.svg')) {
                            favoriteIcon.src = '/heart-empty.svg';
                            notification.add('OK', 'Вы успешно удалили вакансию из избранного');
                        } else if (favoriteIcon) {
                            favoriteIcon.src = '/heart-fill.svg';
                            notification.add('OK', 'Вы успешно добавили вакансию в избранное');
                        }
                    } catch {
                        if (favoriteIcon && favoriteIcon.src.endsWith('/heart-fill.svg')) {
                            notification.add('FAIL', 'Не удалось убрать лайк с вакансии');
                        } else if (favoriteIcon) {
                            notification.add('FAIL', 'Не удалось лайкнуть вакансию');
                        }
                    }
                }
            });
        }

        if (this.#editButton) {
            this.#editButton.addEventListener('click', () => {
                router.go(`/vacancyEdit/${this.#props.id}`);
            });
        }

        if (this.#deleteButton)
            this.#deleteButton.addEventListener('click', () => {
                if (this.#deleteContainer) {
                    const dialog = new DialogContainer(
                        this.#deleteContainer,
                        'УдалениеВакансии',
                        DeleteDialog,
                        {
                            title: 'Удалить вакансию?',
                            message: 'Ваканси удалится навсегда без возможности его восстановления',
                            delete: this.#delete,
                        },
                    );
                    dialog.render();
                }
            });
    };

    /**
     * Отмена отклика вакансии
     */
    readonly #handleUnresumeClick = async () => {
        logger.info('resume');
        try {
            await api.vacancy.response(this.#props.id, store.data.responseResumeId);
            const buttonsContainer = this.self.querySelector('.job__buttons');
            if (buttonsContainer) {
                buttonsContainer.innerHTML = templateNoResponded({ id: this.#props.id });
            }
            notification.add('OK', `Успешный отмена отклика`);
        } catch {
            notification.add('FAIL', `Ошибка отмене отклика на вакансию`);
        }
    };

    /**
     * Отклик на вакансию
     */
    readonly #handleResumeClick = async () => {
        logger.info('resume');
        try {
            await api.vacancy.response(this.#props.id, store.data.responseResumeId);
            const buttonsContainer = this.self.querySelector('.job__buttons');
            if (buttonsContainer) {
                buttonsContainer.innerHTML = templateResponded({ id: this.#props.id });
            }
            notification.add(
                'OK',
                `Успешный отклик на вакансию`,
                `Вы откликнулсь на вакансию ${this.#props.title}`,
            );
        } catch {
            notification.add('FAIL', `Ошибка при отклике на вакансию`);
        }
    };

    /**
     * Обработчик удаления вакансии
     */
    readonly #delete = async () => {
        try {
            await api.vacancy.delete(this.#id);
            router.back();
            notification.add('OK', `Успешно удалили вакансию ${this.#props.title}`);
        } catch {
            notification.add('FAIL', `Ошибка при удалении вакансии ${this.#props.title}`);
            logger.info('Что-то пошло не так');
        }
    };

    /**
     * Удаление компонента
     */
    remove = () => {
        logger.info('JobPage remove method called');
        this.self.remove();
    };

    /**
     * Рендеринг компонента
     */
    render = async () => {
        logger.info('JobPage render method called');
        const created_date = new Date(this.#props.created_at);
        this.#props.created_at = created_date.toLocaleDateString('ru-RU');
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...this.#props,
                tasks: this.#props.tasks !== '' ? this.#props.tasks.split('\n') : null,
                requirements:
                    this.#props.requirements !== '' ? this.#props.requirements.split('\n') : null,
                optional_requirements:
                    this.#props.optional_requirements !== ''
                        ? this.#props.optional_requirements.split('\n')
                        : null,
                experienceTranslations,
                workFormatTranslations,
                employmentTranslations,
                isApplicant:
                    (store.data.authorized && store.data.user.role === 'applicant') ||
                    store.data.authorized === false,
                isOwner:
                    store.data.authorized &&
                    store.data.user.role === 'employer' &&
                    store.data.user.user_id === this.#props.employer.id,
            }),
        );
        const companyCard = new JobCompanyCard(
            this.self.querySelector('.vacancy_company_card') as HTMLElement,
            this.#props.employer,
        );
        companyCard.render();

        logger.info(store.data);

        if (this.#editButton) {
            this.#editButton.hidden = true;
            if (
                store.data.user.role === 'employer' &&
                store.data.authorized &&
                store.data.user.user_id === this.#props.employer.id
            )
                this.#editButton.hidden = false;
        }

        this.#addEventListeners();

        const resumeContainer = document.getElementById('resume-content');
        if (resumeContainer) {
            try {
                this.#responses = await api.vacancy.responses(this.#props.id);
            } catch {
                notification.add('FAIL', 'Ошибка при загрузке откликов');
            }
            this.#responses.forEach((data) => {
                const resume = new ResumeRow(resumeContainer, data, () =>
                    router.go(`/resume/${data.id}`),
                );
                resume.render();
            });
            if (this.#responses.length === 0) resumeContainer.innerHTML = emptyTemplate({});
        }
    };
}
