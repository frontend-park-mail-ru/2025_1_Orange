import { ResumeCard } from '../resumeCard/resumeCard';
import './resumeCatalog.sass';
import { logger } from '../../utils/logger';
import template from './resumeCatalog.handlebars';
import { ResumeCatalogFilter } from '../resumeCatalogFilter/resumeCatalogFilter';
import type { Resume } from '../../api/interfaces';
import { api } from '../../api/api';
import { router } from '../../router';
import { emptyApplicant } from '../../api/empty';

export class ResumeCatalog {
    readonly #parent: HTMLElement;
    #resumes: Resume[] = [];

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     */
    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    /**
     * Получение резюме
     * @return {Resume[]}
     */
    init = async () => {
        try {
            this.#resumes = await api.resume.all();
        } catch (error) {
            logger.error('Ошибка при загрузке резюме:', error);
            this.#resumes = [];
        }
    };

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById('resume_catalog_page') as HTMLElement;
    }

    /**
     * Очистка
     */
    remove = () => {
        logger.info('ResumeCatalog remove method called');
        this.self.remove();
    };

    /**
     * Рендеринг страницы
     */
    render = async () => {
        logger.info('ResumeCatalog render method called');
        this.#parent.insertAdjacentHTML('beforeend', template({}));
        const filter = new ResumeCatalogFilter(
            this.self.querySelector('.resume_filter') as HTMLElement,
        );
        filter.render();
        if (this.#resumes.length === 0) {
            const jobContainer = this.self.querySelector('.resume_list') as HTMLElement;
            jobContainer.textContent = 'Нету резюме';
        }
        for (const element of this.#resumes) {
            try {
                const data = await api.applicant.get(element.applicant_id);
                element.applicant = data;
            } catch {
                element.applicant = emptyApplicant
            }
        }

        this.#resumes?.forEach((element) => {
            const card = new ResumeCard(
                this.self.querySelector('.resume_list') as HTMLElement,
                element,
            );
            card.render();
        });
    };
}
