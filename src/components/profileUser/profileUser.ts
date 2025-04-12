import template from './profileUser.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';
import './profileUser.sass';
import { ResumeRow } from '../resumeRow/resumeRow';
import { Resume } from '../../api/interfaces';
import { store } from '../../store';
import { api } from '../../api/api';
import { router } from '../../router';

export class ProfileUser {
    readonly #parent: HTMLElement;
    #resumes: Resume[] | null = null;
    //#vacancies: Vacancy[] | null = null;
    #resumeContainer: HTMLElement | null = null;
    #vacancyContainer: HTMLElement | null = null;
    #favoriteButton: HTMLElement | null = null;
    #resumesButton: HTMLElement | null = null;
    #responsesButton: HTMLElement | null = null;
    #addResume: HTMLElement | null = null;
    #editButton: HTMLElement | null = null;
    #backArrow: HTMLElement | null = null;

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
        const profileActions = this.self.querySelector('.profile__actions') as HTMLElement
        if (profileActions) {
            this.#addResume = profileActions.querySelector('.job__button') as HTMLElement
            this.#editButton = profileActions.querySelector('.job__button_second') as HTMLElement
        }
        this.#backArrow = this.self.querySelector('.profile__back') as HTMLElement;
        if (this.#backArrow) {
            this.#backArrow.addEventListener('click', () => {router.back()});
        }
        if (this.#editButton) {
            this.#editButton.addEventListener('click', () => {router.go('/profileUserEdit')} )
        }
        if (this.#addResume) {
            this.#addResume.addEventListener('click', () => {router.go('/createResume')})
        }

        this.#resumeContainer = document.getElementById('resume-content');
        this.#vacancyContainer = document.getElementById('vacancy-content');
        this.#resumesButton = document.getElementById('profile-resumes');
        this.#responsesButton = document.getElementById('profile-responses');
        this.#favoriteButton = document.getElementById('profile-favorites');
        this.#resumesButton?.addEventListener('click', () =>
            this.#handleButton(this.#resumesButton as HTMLElement, this.#renderResumes),
        );
        // this.#responsesButton.addEventListener('click', () =>
        //     this.#handleButton(this.#responsesButton as HTMLElement, this.#renderResponses),
        // );
        // this.#favoriteButton.addEventListener('click', () =>
        //     this.#handleButton(this.#favoriteButton as HTMLElement, this.#renderFavorites),
        // );
    };

    readonly #handleButton = (button: HTMLElement, callback: () => void) => {
        if (button && button.className === 'job__button_second') {
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
    readonly #renderResumes = async (): Promise<void> => {
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
        try {
            this.#resumes = await api.resume.all();
        } catch {
            console.log('Не удалось загрузить')
            return
        }

        // Используем данные из resumesMock
        this.#resumes.forEach((resume) => {
            const resumeRow = new ResumeRow(this.#resumeContainer as HTMLElement, resume);
            resumeRow.render();
        });
    };

    /**
     * Рендеринг списка откликов
     */
    // #renderResponses = (): void => {
    //     logger.info('Rendering Responses...');
    //     if (!this.#vacancyContainer) {
    //         return;
    //     }
    //     if (this.#resumeContainer) {
    //         this.#resumeContainer.hidden = true;
    //     }
    //     if (this.#vacancyContainer) {
    //         this.#vacancyContainer.hidden = false;
    //     }
    //     this.#vacancyContainer.innerHTML = ''; // Очищаем контейнер перед рендерингом

    //     this.#vacancies = vacancyListMock;

    //     this.#vacancies.forEach((vacancy) => {
    //         const resumeRow = new JobCard(this.#vacancyContainer as HTMLElement, vacancy);
    //         resumeRow.render();
    //     });
    // };

    /**
     * Рендеринг списка любимых вакансий
     */
    // #renderFavorites = (): void => {
    //     logger.info('Rendering Favorites...');
    //     if (!this.#vacancyContainer) {
    //         return;
    //     }
    //     if (this.#resumeContainer) {
    //         this.#resumeContainer.hidden = true;
    //     }
    //     if (this.#vacancyContainer) {
    //         this.#vacancyContainer.hidden = false;
    //     }
    //     this.#vacancyContainer.innerHTML = ''; // Очищаем контейнер перед рендерингом

    //     this.#vacancies = vacancyListMock;

    //     this.#vacancies.forEach((vacancy) => {
    //         const resumeRow = new JobCard(this.#vacancyContainer as HTMLElement, vacancy);
    //         resumeRow.render();
    //     });
    // };

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
        if (!store.data.authorized || store.data.user.type !== 'applicant') router.back()
        this.#parent.insertAdjacentHTML('beforeend', template(store.data.user.applicant));
        this.addEventListeners();
        this.#handleButton(this.#resumesButton as HTMLElement, this.#renderResumes)
    };
}
