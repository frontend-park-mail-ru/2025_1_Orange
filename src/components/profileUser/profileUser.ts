import template from './profileUser.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';
import { Profile, Resume, Vacancy } from '../../api/interfaces';
import { resumePageMock } from '../resumePage/resumePageMock';
import './profileUser.sass';
import { resumesMock } from './resumesMock';
import { ResumeRow } from '../resumeRow/resumeRow';
import { vacancyListMock } from '../jobCatalog/jobsMock';
import { JobCard } from '../jobCard/jobCard';

export class ProfileUser {
    readonly #parent: HTMLElement;
    #data: Profile | null = null;
    #resumes: Resume[] | null = null;
    #vacancies: Vacancy[] | null = null;
    #resumeContainer: HTMLElement | null = null;
    #vacancyContainer: HTMLElement | null = null;
    #favoriteButton: HTMLElement | null = null;
    #resumesButton: HTMLElement | null = null;
    #responsesButton: HTMLElement | null = null;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById('profile_user_page') as HTMLElement;
    }

    /**
     * Добавление обработчиков событий
     */
    addEventListeners = () => {
        this.#resumeContainer = document.getElementById('resume-content') as HTMLElement;
        this.#vacancyContainer = document.getElementById('vacancy-content') as HTMLElement;
        this.#resumesButton = document.getElementById('profile-resumes') as HTMLElement;
        this.#responsesButton = document.getElementById('profile-responses') as HTMLElement;
        this.#favoriteButton = document.getElementById('profile-favorites') as HTMLElement;
        this.#resumesButton.addEventListener('click', () =>
            this.#handleButton(this.#resumesButton as HTMLElement, this.#renderResumes),
        );
        this.#responsesButton.addEventListener('click', () =>
            this.#handleButton(this.#responsesButton as HTMLElement, this.#renderResponses),
        );
        this.#favoriteButton.addEventListener('click', () =>
            this.#handleButton(this.#favoriteButton as HTMLElement, this.#renderFavorites),
        );
    };

    #handleButton = (button: HTMLElement, callback: () => void) => {
        if (button.className === 'job__button_second') {
            if (this.#responsesButton) {
                this.#responsesButton.className = 'job__button_second';
            }
            if (this.#resumesButton) {
                this.#resumesButton.className = 'job__button_second';
            }
            if (this.#favoriteButton) {
                this.#favoriteButton.className = 'job__button_second';
            }
            button.className = 'job__button';
            callback();
        }
    };

    /**
     * Рендеринг списка резюме
     */
    #renderResumes = (): void => {
        if (this.#resumeContainer) {
            this.#resumeContainer.hidden = false;
        }
        if (this.#vacancyContainer) {
            this.#vacancyContainer.hidden = true;
        }
        logger.info('Rendering Resumes...');
        if (!this.#resumeContainer) {
            return;
        }
        this.#resumeContainer.innerHTML = ''; // Очищаем контейнер перед рендерингом

        this.#resumes = resumesMock;

        // Используем данные из resumesMock
        this.#resumes.forEach((resume) => {
            const resumeRow = new ResumeRow(this.#resumeContainer as HTMLElement, resume);
            resumeRow.render();
        });
    };

    /**
     * Рендеринг списка откликов
     */
    #renderResponses = (): void => {
        logger.info('Rendering Responses...');
        if (!this.#vacancyContainer) {
            return;
        }
        if (this.#resumeContainer) {
            this.#resumeContainer.hidden = true;
        }
        if (this.#vacancyContainer) {
            this.#vacancyContainer.hidden = false;
        }
        this.#vacancyContainer.innerHTML = ''; // Очищаем контейнер перед рендерингом

        this.#vacancies = vacancyListMock;

        this.#vacancies.forEach((vacancy) => {
            const resumeRow = new JobCard(this.#vacancyContainer as HTMLElement, vacancy);
            resumeRow.render();
        });
    };

    /**
     * Рендеринг списка любимых вакансий
     */
    #renderFavorites = (): void => {
        logger.info('Rendering Favorites...');
        if (!this.#vacancyContainer) {
            return;
        }
        if (this.#resumeContainer) {
            this.#resumeContainer.hidden = true;
        }
        if (this.#vacancyContainer) {
            this.#vacancyContainer.hidden = false;
        }
        this.#vacancyContainer.innerHTML = ''; // Очищаем контейнер перед рендерингом

        this.#vacancies = vacancyListMock;

        this.#vacancies.forEach((vacancy) => {
            const resumeRow = new JobCard(this.#vacancyContainer as HTMLElement, vacancy);
            resumeRow.render();
        });
    };

    /**
     * Очистка
     */
    remove = () => {
        logger.info('ProfileUser remove method called');
        this.self.remove();
    };

    /**
     * Рендеринг страницы
     */
    render = () => {
        logger.info('ProfileUser render method called');
        this.#data = resumePageMock.profile;
        this.#parent.insertAdjacentHTML('beforeend', template(this.#data));
        this.addEventListeners();
    };
}
