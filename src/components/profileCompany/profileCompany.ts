import template from './profileCompany.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';
import { Employer, Vacancy } from '../../api/interfaces';
import './profileCompany.sass';
import { JobCard } from '../jobCard/jobCard';
import { employerMock, vacancyMock } from '../../api/mocks';
import { router } from '../../router';
import { store } from '../../store';

export class ProfileCompany {
    readonly #parent: HTMLElement;
    #data: Employer | null = null;
    #vacancies: Vacancy[] | null = null;
    #vacancyContainer: HTMLElement | null = null;
    #backArrow: HTMLElement | null = null;
    #editButton: HTMLElement | null = null;
    #addVacancy: HTMLElement | null = null;

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
        logger.info('ProfileUser remove method called');
        this.self.remove();
    };

    /**
     * Навешивание обработчиков
     */
    readonly #addEventListeners = () => {
        const profileActions = this.self.querySelector('.profile__actions') as HTMLElement
        if (profileActions) {
            this.#addVacancy = profileActions.querySelector('.job__button') as HTMLElement
            this.#editButton = profileActions.querySelector('.job__button_second') as HTMLElement
        }
        this.#backArrow = this.self.querySelector('.profile__back') as HTMLElement;
        if (this.#backArrow) {
            this.#backArrow.addEventListener('click', () => {router.back()});
        }
        if (this.#editButton) {
            this.#editButton.addEventListener('click', () => {router.go('/profileCompanyEdit')} )
        }
        if (this.#addVacancy) {
            this.#addVacancy.addEventListener('click', () => {router.go('/createVacancy')})
        }
    };

    /**
     * Рендеринг страницы
     */
    render = () => {
        logger.info('ProfileUser render method called');
        this.#data = employerMock;
        this.#parent.insertAdjacentHTML('beforeend', template({
            ...this.#data,
            'isOwner': store.data.user.type === 'employer' && store.data.user.employer?.id === this.#data.id
        }));
        this.#vacancyContainer = document.getElementById('responses-content') as HTMLElement;
        this.#vacancies = [vacancyMock];
        this.#vacancies.forEach((vacancy) => {
            const vacancyCard = new JobCard(this.#vacancyContainer as HTMLElement, vacancy);
            vacancyCard.render();
        });

        this.#addEventListeners();
    };
}
