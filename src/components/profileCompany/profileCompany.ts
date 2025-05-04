import template from './profileCompany.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';
import { Employer, VacancyShort } from '../../api/interfaces';
import './profileCompany.sass';
import { JobCard } from '../jobCard/jobCard';
import { router } from '../../router';
import { store } from '../../store';
import { api } from '../../api/api';
import { emptyEmployer } from '../../api/empty';

export class ProfileCompany {
    readonly #parent: HTMLElement;
    #data: Employer | null = null;
    #id: number = 0;
    #vacancies: VacancyShort[] | null = null;
    #vacancyContainer: HTMLElement | null = null;
    #backArrow: HTMLButtonElement | null = null;
    #editButton: HTMLButtonElement | null = null;
    #addVacancy: HTMLButtonElement | null = null;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById('profile_company_page') as HTMLElement;
    }

    /**
     * Очистка
     */
    remove = () => {
        logger.info('ProfileCompany remove method called');
        this.self.remove();
    };

    init = async () => {
        logger.info('profileCompany init method called');
        const url = window.location.href.split('/');
        this.#id = Number.parseInt(url[url.length - 1]);
        if (
            !store.data.authorized ||
            store.data.user.role !== 'employer' ||
            store.data.user.user_id !== this.#id
        )
            router.back();
        try {
            const data = await api.employer.get(this.#id);
            this.#data = data;
        } catch {
            logger.info('Не удалось загрузить страницу');
            router.back();
        }

        try {
            if (this.#data) this.#vacancies = await api.employer.vacancies(this.#data.id)
        } catch {
            this.#vacancies = null;
        }
    };

    /**
     * Навешивание обработчиков
     */
    readonly #addEventListeners = () => {
        const profileActions = this.self.querySelector('.profile__actions') as HTMLElement;
        if (profileActions) {
            this.#addVacancy = profileActions.querySelector('.profile__button-black') as HTMLButtonElement;
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
                router.go(`/profileCompanyEdit/${this.#id}`);
            });
        }
        if (this.#addVacancy) {
            this.#addVacancy.addEventListener('click', (e: Event) => {
                e.preventDefault();
                router.go('/createVacancy');
            });
        }
    };

    /**
     * Рендеринг страницы
     */
    render = () => {
        logger.info('ProfileUser render method called');
        if (!this.#data) router.back();
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...this.#data,
                isOwner:
                    store.data.user.role === 'employer' &&
                    store.data.user.user_id === this.#data?.id,
                vacancyCount: this.#vacancies?.length ?? 0
            }),
        );
        this.#vacancyContainer = document.getElementById('responses-content') as HTMLElement;
        if (this.#vacancies) {
            this.#vacancies.forEach(async (vacancy) => {
                try {
                    vacancy.employer = await api.employer.get(vacancy.employer_id)
                } catch {
                    vacancy.employer = emptyEmployer
                }
                const vacancyCard = new JobCard(this.#vacancyContainer as HTMLElement, vacancy);
                vacancyCard.render();
            });
            if (this.#vacancies.length === 0) {
                this.#vacancyContainer.textContent = 'Нет вакансий'
            }
        } else {
            this.#vacancyContainer.textContent = 'Ошибка при загрузке'
        }

        this.#addEventListeners();
    };
}
