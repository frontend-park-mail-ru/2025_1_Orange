import { logger } from '../../utils/logger';
import template from './jobPage.handlebars';
import templateButton from '../../partials/jobCardResponded.handlebars';
import { Vacancy } from '../../api/interfaces';
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
import { DeleteButton } from '../deleteButton/deleteButton';
import { DialogContainer } from '../dialog/dialog';
import { NoResumeDialog } from '../noResumeDialog/noResumeDialog';
import notification from '../notificationContainer/notificationContainer';

export class JobPage {
    readonly #parent: HTMLElement;
    #props: Vacancy = emptyVacancy;
    #editButton: HTMLElement | null = null;
    #resumeButton: HTMLElement | null = null;
    #id: number = 0;

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
            notification.add('FAIL', 'Не удалось загрузить вакансию')
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
        if (this.#resumeButton) {
            const handleResumeClick = async () => {
                const error = this.self.querySelector('.job__error') as HTMLElement;
                if (error) {
                    error.hidden = true;
                    error.textContent = '';
                }
                try {
                    await api.vacancy.response(this.#props.id);
                    const buttonsContainer = this.self.querySelector('.vacancy__buttons');
                    if (buttonsContainer) {
                        buttonsContainer.innerHTML = '';
                        buttonsContainer.insertAdjacentHTML('beforeend', templateButton({}));
                    }
                    notification.add(
                        'OK',
                        `Успешный отклик на вакансию`,
                        `Вы откликнулсь на вакансию ${this.#props.title}`,
                    );
                } catch {
                    if (!store.data.authorized) {
                        const dialog = new DialogContainer(this.#parent, 'НеАвторизован', RegisterDialog);
                        dialog.render();
                    } else {
                        const dialog = new DialogContainer(this.#parent, 'НетРезюме', NoResumeDialog);
                        dialog.render();
                    }
                }
            };
            this.#resumeButton.addEventListener('click', handleResumeClick);
        }

        if (this.#editButton) {
            this.#editButton.addEventListener('click', () => {
                router.go(`/vacancyEdit/${this.#props.id}`);
            });
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
    render = () => {
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
                isApplicant: store.data.authorized && store.data.user.role === 'applicant',
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

        this.#resumeButton = document.getElementById('vacancy_resume_button');
        this.#editButton = document.getElementById('vacancy_edit_button');

        logger.info(store.data);

        if (this.#resumeButton) {
            this.#resumeButton.hidden = true;
            if (store.data.user.role === 'applicant' && store.data.authorized)
                this.#resumeButton.hidden = false;
        }

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

        if (
            store.data.user.role === 'employer' &&
            store.data.authorized &&
            store.data.user.user_id === this.#props.employer.id
        ) {
            const deleteContainer = this.self.querySelector('#delete_button') as HTMLElement;
            if (deleteContainer) {
                const deleteButton = new DeleteButton(deleteContainer, 'Вакансию', this.#delete);
                deleteButton.render();
            }
        }
    };
}
