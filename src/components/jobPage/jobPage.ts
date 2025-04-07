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

export class JobPage {
    readonly #parent: HTMLElement;
    #props: Vacancy | null = null;
    #similarJob: VacancyShort[] | null = null;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    get self(): HTMLElement {
        return document.getElementById('job_page') as HTMLElement;
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
            }),
        );
        const companyCard = new JobCompanyCard(
            this.self.querySelector('.vacancy_company_card') as HTMLElement,
            this.#props.employer,
        );
        companyCard.render();

        this.#similarJob = [vacancyShortMock];
        const similarJobsContainer = this.self.querySelector('.similar_jobs') as HTMLElement;
        if (similarJobsContainer) {
            this.#similarJob.forEach((job) => {
                const similarJobCard = new SimilarJobCard(similarJobsContainer, job);
                similarJobCard.render();
            });
        }
    };
}
