import template from './resumePage.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';
import { ResumeExperience } from '../resumeExperience/resumeExperience';
import { Resume } from '../../api/interfaces';
import './resumePage.sass';
import { api } from '../../api/api';
import { resumeMock } from '../../api/mocks';
import { educationTranslations, statusTranslations } from '../../api/translations';
import { DeleteButton } from '../deleteButton/deleteButton';
import { router } from '../../router';
import { store } from '../../store';

export class ResumePage {
    readonly #parent: HTMLElement;
    #data: Resume | null = null;
    #id: number = 0;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById('resume_page') as HTMLElement;
    }

    init = async () => {
        logger.info('ResumePage init method called');
        const url = window.location.href.split('/');
        this.#id = Number.parseInt(url[url.length - 1]);
        console.log('resumePage');
        try {
            const data = await api.resume.get(this.#id);
            this.#data = data;
        } catch {
            console.log('Не удалось загрузить страницу');
            //router.back()
        }
        this.#data = resumeMock;
    };

    /**
     * Очистка
     */
    remove = () => {
        logger.info('ResumePage remove method called');
        this.self.remove();
    };

    /**
     * Обработчик удаления вакансии
     */
    readonly #delete = async () => {
        try {
            await api.resume.delete(this.#id);
            router.go('/catalog');
        } catch {
            console.log('Что-то пошло не так');
        }
    };

    /**
     * Навешивание событий на кнопки
     */
    readonly #addEventListeners = () => {
        const editButton = this.self
            .querySelector('.resume_sidebar__actions')
            ?.querySelector('.job__button_second') as HTMLElement;
        if (this.#data?.applicant.id === store.data.user.applicant?.id) {
            editButton.addEventListener('click', () => {
                router.go(`/resumeEdit/${this.#id}`);
            });
        } else {
            editButton.hidden = true;
        }
    };

    /**
     * Рендеринг страницы
     */
    render = () => {
        logger.info('ResumePage render method called');
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...this.#data,
                educationTranslations,
                statusTranslations,
            }),
        );

        if (this.#data?.applicant.id === store.data.user.applicant?.id) {
            const deleteContainer = this.self.querySelector('#delete_button') as HTMLElement;
            if (deleteContainer) {
                const deleteButton = new DeleteButton(deleteContainer, this.#delete);
                deleteButton.render();
            }
        }

        const experienceContainer = this.self.querySelector(
            '.resume_info__experience',
        ) as HTMLElement;
        if (experienceContainer && this.#data) {
            this.#data.work_experience.forEach((experienceItem) => {
                const experienceCard = new ResumeExperience(experienceContainer, experienceItem);
                experienceCard.render();
            });
        }
        this.#addEventListeners();
    };
}
