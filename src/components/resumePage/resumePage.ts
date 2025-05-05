import template from './resumePage.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';
import { ResumeExperience } from '../resumeExperience/resumeExperience';
import { Resume } from '../../api/interfaces';
import './resumePage.sass';
import { api } from '../../api/api';
import { educationTranslations, statusTranslations } from '../../api/translations';
import { DeleteButton } from '../deleteButton/deleteButton';
import { router } from '../../router';
import { store } from '../../store';
import { emptyResume } from '../../api/empty';

export class ResumePage {
    readonly #parent: HTMLElement;
    #data: Resume = emptyResume;
    #id: number = 0;
    #editButton: NodeListOf<HTMLElement> = [];

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
        logger.info('resumePage');
        try {
            const data = await api.resume.get(this.#id);
            this.#data = data;
            try {
                this.#data.applicant = await api.applicant.get(this.#data.applicant_id);
            } catch {
                router.back();
            }
        } catch {
            logger.info('Не удалось загрузить страницу');
            router.back();
        }
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
            logger.info('Что-то пошло не так');
        }
    };

    /**
     * Навешивание событий на кнопки
     */
    readonly #addEventListeners = () => {
        this.#editButton = this.self.querySelectorAll('.job__button_second');
        this.#editButton.forEach((element) => {
            element.addEventListener('click', () => {
                router.go(`/resumeEdit/${this.#id}`);
            });
        });
    };

    /**
     * Рендеринг страницы
     */
    render = () => {
        if (this.#data) {
            if (this.#data.applicant.birth_date !== '0001-01-01T00:00:00Z') {
                const birth_date = new Date(this.#data.applicant.birth_date);
                this.#data.applicant.birth_date = birth_date.toLocaleDateString('ru-RU');
            } else {
                this.#data.applicant.birth_date = '';
            }
            this.#data.graduation_year = this.#data.graduation_year.split('-')[0];
        }

        logger.info('ResumePage render method called');
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...this.#data,
                educationTranslations,
                statusTranslations,
                owner:
                    store.data.authorized &&
                    store.data.user.role === 'applicant' &&
                    this.#data.applicant.id === store.data.user.user_id,
                hasSocialLinks:
                    this.#data.applicant.facebook !== '' ||
                    this.#data.applicant.vk !== '' ||
                    this.#data.applicant.telegram !== '',
            }),
        );

        if (
            store.data.user.role === 'applicant' &&
            this.#data.applicant.id === store.data.user.user_id
        ) {
            const deleteContainer = this.self.querySelector('#delete_button') as HTMLElement;
            if (deleteContainer) {
                const deleteButton = new DeleteButton(deleteContainer, 'Резюме', this.#delete);
                deleteButton.render();
            }
        }

        const experienceContainer = this.self.querySelector(
            '.resume_info__experience',
        ) as HTMLElement;
        if (experienceContainer && this.#data) {
            this.#data.work_experiences.forEach((experienceItem) => {
                const experienceCard = new ResumeExperience(experienceContainer, experienceItem);
                experienceCard.render();
            });
        }
        this.#addEventListeners();
    };
}
