import template from './profileUser.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';
import './profileUser.sass';
import { ResumeRow } from '../resumeRow/resumeRow';
import { Applicant, Resume, VacancyShort } from '../../api/interfaces';
import { store } from '../../store';
import { api } from '../../api/api';
import { router } from '../../router';
import { JobCard } from '../jobCard/jobCard';
import { emptyApplicant, emptyEmployer } from '../../api/empty';

export class ProfileUser {
    readonly #parent: HTMLElement;
    #resumes: Resume[] | null = null;
    #id: number = 0;
    #data: Applicant | null = null;
    #vacancies: VacancyShort[] | null = null;
    #resumeContainer: HTMLElement | null = null;
    #vacancyContainer: HTMLElement | null = null;
    #favoriteButton: HTMLElement | null = null;
    #resumesButton: HTMLElement | null = null;
    #responsesButton: HTMLElement | null = null;
    #addResume: HTMLButtonElement | null = null;
    #editButton: HTMLButtonElement | null = null;
    #backArrow: HTMLButtonElement | null = null;
    // #resumeTableRendering: boolean = false;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    init = async () => {
        logger.info('profileUser init method called');
        const url = window.location.href.split('/');
        this.#id = Number.parseInt(url[url.length - 1]);
        if (
            !store.data.authorized ||
            store.data.user.role !== 'applicant' ||
            store.data.user.user_id !== this.#id
        )
            router.back();
        try {
            const data = await api.applicant.get(this.#id);
            this.#data = data;
        } catch {
            logger.info('Не удалось загрузить страницу');
            router.back();
        }
    };

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
        const profileActions = this.self.querySelector('.profile__actions') as HTMLElement;
        if (profileActions) {
            this.#addResume = profileActions.querySelector('.profile__button-black') as HTMLButtonElement;
            this.#editButton = profileActions.querySelector(
                '.profile__button-white',
            ) as HTMLButtonElement;
        }
        this.#backArrow = this.self.querySelector('.profile__back') as HTMLButtonElement;
        if (this.#backArrow) {
            this.#backArrow.addEventListener('click', (e: Event) => {
                e.preventDefault();
                router.go('/catalog');
            });
        }
        if (this.#editButton) {
            this.#editButton.addEventListener('click', (e: Event) => {
                e.preventDefault();
                router.go(`/profileUserEdit/${this.#id}`);
            });
        }
        if (this.#addResume) {
            this.#addResume.addEventListener('click', (e: Event) => {
                e.preventDefault();
                router.go('/createResume');
            });
        }

        this.#resumeContainer = document.getElementById('resume-content');
        this.#vacancyContainer = document.getElementById('vacancy-content');
        this.#resumesButton = document.getElementById('profile-resumes');
        this.#responsesButton = document.getElementById('profile-responses');
        this.#favoriteButton = document.getElementById('profile-favorites');

        this.#resumesButton?.addEventListener('click', () =>
            this.#handleButton(this.#resumesButton as HTMLElement, this.#renderResumes),
        );

        this.#responsesButton?.addEventListener('click', () => {
            this.#handleButton(this.#responsesButton as HTMLElement, this.#renderResponses);
        });

        this.#favoriteButton?.addEventListener('click', () => {
            this.#handleButton(this.#favoriteButton as HTMLElement, this.#renderFavorites);
        });
    };

    readonly #handleButton = (button: HTMLElement, callback: () => void) => {
        if (button.classList.contains('profile__tab--active')) return;

        [this.#responsesButton, this.#resumesButton, this.#favoriteButton].forEach(btn => {
            if (btn) {
                btn.classList.remove('profile__tab--active');
            }
        });

        button.classList.add('profile__tab--active');
        callback();
    };

    readonly #renderResponses = async () => {
        if (!this.#vacancyContainer) return
        if (this.#vacancyContainer) this.#vacancyContainer.textContent = ''
        if (this.#resumeContainer) this.#resumeContainer.textContent = ''
        try {
            if (this.#data) this.#vacancies = await api.applicant.responsed(this.#data.id)
            if (!this.#vacancies) {
                this.#vacancyContainer.textContent = 'Ничего нету'
                return
            }
            this.#vacancies.forEach(async (vacancy) => {
                try {
                    vacancy.employer = await api.employer.get(vacancy.employer_id)
                } catch {
                    vacancy.employer = emptyEmployer
                }
                const response = new JobCard(this.#vacancyContainer as HTMLElement, vacancy)
                response.render()
            })
        } catch {
            if (this.#vacancyContainer) this.#vacancyContainer.textContent = 'При загрузке откликов произошла ошибка'
        }
    };

    // TODO реализовать обработчик
    readonly #renderFavorites = () => {
        console.log('Favorite tab clicked - add logic later');
    };

    /**
     * Рендеринг списка резюме
     */
    readonly #renderResumes = async (): Promise<void> => {

        if (this.#vacancyContainer) this.#vacancyContainer.textContent = ''
        if (this.#resumeContainer) this.#resumeContainer.textContent = ''
        logger.info('Rendering Resumes...');
        if (!this.#resumeContainer) {
            return;
        }
        this.#resumeContainer.innerHTML = ''; // Очищаем контейнер перед рендерингом
        try {
            this.#resumes = await api.resume.all();
        } catch {
            logger.info('Не удалось загрузить');
            return;
        }

        // Используем данные из resumesMock
        this.#resumes.forEach(async (resume) => {
            try {
                resume.applicant = await api.applicant.get(resume.applicant_id)
            } catch {
                resume.applicant = emptyApplicant
            }
            const resumeRow = new ResumeRow(this.#resumeContainer as HTMLElement, resume);
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
        if (!store.data.authorized || store.data.user.role !== 'applicant') router.back();
        if (!this.#data) router.back();
        if (this.#data && this.#data.birth_date === '0001-01-01T00:00:00Z') {
            this.#data.birth_date = '';
        } else if (this.#data) {
            const birth_date = new Date(this.#data.birth_date);
            logger.info(birth_date);
            this.#data.birth_date = `${birth_date.getUTCDate()}.${birth_date.getUTCMonth()}.${birth_date.getFullYear()}`;
        }
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...this.#data,
            }),
        );
        this.addEventListeners();
        this.#handleButton(this.#resumesButton as HTMLElement, this.#renderResumes);
    };
}
