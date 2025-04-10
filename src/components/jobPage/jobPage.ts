import { logger } from '../../utils/logger';
import template from './jobPage.handlebars';
import { Vacancy, VacancyShort } from '../../api/interfaces';
import { SimilarJobCard } from '../similarJobCard/similarJobCard';
import { JobCompanyCard } from '../jobCompanyCard/jobCompanyCard';
import './jobPage.sass';
import { vacancyMock, vacancyShortMock } from '../../api/mocks';
import {
    employmentTranslations,
    experienceTranslations,
    workFormatTranslations,
} from '../../api/translations';
import { store } from '../../store';
import { emptyVacancy } from '../../api/empty';
import { api } from '../../api/api';
import { router } from '../../router';

export class JobPage {
    readonly #parent: HTMLElement;
    #props: Vacancy = emptyVacancy;
    #similarJob: VacancyShort[] | null = null;
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
            const data = await api.vacancy.get(this.#id);
            this.#props = data;
        } catch {
            console.log('Не удалось загрузить страницу');
            //router.back()
        }
        this.#props = vacancyMock;
        this.#similarJob = [vacancyShortMock];
    };

    readonly #addEventListeners = () => {
        if (this.#resumeButton) {
            this.#resumeButton.addEventListener('click', async () => {
                try {
                await api.vacancy.resume(this.#props.id);
                await this.init()
                this.render()
                } catch {
                    console.log('Ошибка при отправки отклика')
                }
            })
        }

        if (this.#editButton) {
            this.#editButton.addEventListener('click', () => {
                router.go(`/vacancyEdit/${this.#props.id}`)
            })
        }
    }

    remove = () => {
        logger.info('JobPage remove method called');
        this.self.remove();
    };

    render = () => {
        logger.info('JobPage render method called');
        this.#props = vacancyMock;
        //this.#props.company.star_rating = '★'.repeat(Math.round(this.#props.company.rating ?? 0))
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
                'isApplicant': store.data.authorized && store.data.user.type === 'applicant',
                'isOwner': store.data.authorized && store.data.user.type === 'employer' && store.data.user.employer?.id === this.#props.employer.id
            }),
        );
        const companyCard = new JobCompanyCard(
            this.self.querySelector('.vacancy_company_card') as HTMLElement,
            this.#props.employer,
        );
        companyCard.render();

        const similarJobsContainer = this.self.querySelector('.similar_jobs') as HTMLElement;
        if (similarJobsContainer && this.#similarJob) {
            this.#similarJob.forEach((job) => {
                const similarJobCard = new SimilarJobCard(similarJobsContainer, job);
                similarJobCard.render();
            });
        }

        this.#resumeButton = document.getElementById('vacancy_resume_button')
        this.#editButton = document.getElementById('vacancy_edit_button')

        console.log(store.data)

        if (this.#resumeButton) {
            this.#resumeButton.hidden = true
            if (store.data.user.type === 'applicant' && store.data.authorized) this.#resumeButton.hidden = false
        }

        if (this.#editButton) {
            this.#editButton.hidden = true
            if (store.data.user.type === 'employer' && store.data.authorized && store.data.user.employer?.id === this.#props.employer.id) this.#editButton.hidden = false
        }

        this.#addEventListeners()

    };
}
