import { logger } from '../../utils/logger';
import template from './jobPage.handlebars';
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
import { vacancyMock } from '../../api/mocks';

export class JobPage {
    readonly #parent: HTMLElement;
    #props: Vacancy = emptyVacancy;
    #editButton: HTMLElement | null = null;
    #resumeButton: HTMLElement | null = null;
    #id: number = 0;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    get self(): HTMLElement {
        return document.getElementById('job_page') as HTMLElement;
    }

    init = async () => {
        logger.info('ResumePage init method called');
        const url = window.location.href.split('/');
        this.#id = Number.parseInt(url[url.length - 1]);
        console.log('resumePage');
        try {
            //const data = await api.vacancy.get(this.#id);
            const data = vacancyMock
            this.#props = data;
        } catch {
            console.log('Не удалось загрузить страницу');
            router.back();
        }
        try {
            const data = await api.employer.get(this.#props.employer_id);
            this.#props.employer = data;
        } catch {
            this.#props.employer = emptyEmployer
        }
    };

    readonly #addEventListeners = () => {
        if (this.#resumeButton) {
            this.#resumeButton.addEventListener('click', async () => {
                try {
                    //await api.vacancy.resume(this.#props.id);
                    vacancyMock.resume = true
                    await this.init();
                    this.render();
                } catch {
                    console.log('Ошибка при отправки отклика');
                }
            });
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
        } catch {
            console.log('Что-то пошло не так');
        }
    };

    remove = () => {
        logger.info('JobPage remove method called');
        this.self.remove();
    };

    render = () => {
        logger.info('JobPage render method called');
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...this.#props,
                tasks: this.#props.tasks.split('\n'),
                requirements: this.#props.requirements.split('\n'),
                optional_requirements: this.#props.optional_requirements.split('\n'),
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

        console.log(store.data);

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
                const deleteButton = new DeleteButton(deleteContainer, this.#delete);
                deleteButton.render();
            }
        }
    };
}
