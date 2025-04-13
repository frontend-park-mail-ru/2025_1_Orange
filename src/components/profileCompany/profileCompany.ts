import template from './profileCompany.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';
import { Employer, Vacancy } from '../../api/interfaces';
import './profileCompany.sass';
import { JobCard } from '../jobCard/jobCard';
import { employerMock, vacancyMock } from '../../api/mocks';
import { router } from '../../router';
import { store } from '../../store';
import { api } from '../../api/api';

export class ProfileCompany {
    readonly #parent: HTMLElement;
    #data: Employer | null = null;
    #id: number = 0;
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
        logger.info('ProfileCompany remove method called');
        this.self.remove();
    };

    init = async () => {
        logger.info('profileCompany init method called');
        const url = window.location.href.split('/');
        this.#id = Number.parseInt(url[url.length - 1]);
        if (!store.data.authorized || store.data.user.role !== 'employer' || store.data.user.user_id !== this.#id) router.back()
        try {
            const data = await api.employer.get(this.#id);
            this.#data = data;
        } catch {
            console.log('Не удалось загрузить страницу');
            router.back()
        }
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
            this.#backArrow.addEventListener('click', () => { router.back() });
        }
        if (this.#editButton) {
            this.#editButton.addEventListener('click', () => { router.go(`/profileCompanyEdit/${this.#id}`) })
        }
        if (this.#addVacancy) {
            this.#addVacancy.addEventListener('click', () => { router.go('/createVacancy') })
        }
    };

    /**
     * Рендеринг страницы
     */
    render = () => {
        logger.info('ProfileUser render method called');
        if (!this.#data) router.back()
        this.#parent.insertAdjacentHTML('beforeend', template({
            ...this.#data,
            'isOwner': store.data.user.role === 'employer' && store.data.user.user_id === this.#data?.id
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
