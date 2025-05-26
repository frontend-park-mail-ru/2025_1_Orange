import template from './resumePage.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';
import { ResumeExperience } from '../resumeExperience/resumeExperience';
import { Resume } from '../../api/interfaces';
import './resumePage.sass';
import { api } from '../../api/api';
import { educationTranslations, statusTranslations } from '../../api/translations';
import { router } from '../../router';
import { store } from '../../store';
import { emptyResume } from '../../api/empty';
import { DialogContainer } from '../dialog/dialog';
import { DeleteDialog } from '../deleteDialog/deleteDialog';
import notification from '../notificationContainer/notificationContainer';

export class ResumePage {
    readonly #parent: HTMLElement;
    #data: Resume = emptyResume;
    #id: number = 0;
    #editButton: NodeListOf<HTMLElement> = [];
    #deleteContainer: HTMLElement | null = null;
    #deleteButton: HTMLElement | null = null;

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
            this.#data.applicant = await api.applicant.get(this.#data.applicant_id);
        } catch {
            notification.add('FAIL', 'Не удалось загрузить резюме');
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
            notification.add('OK', 'Резюме успешно удалено');
            router.go('/catalog');
        } catch {
            notification.add('FAIL', 'Не удалось удалить резюме');
            logger.info('Что-то пошло не так');
        }
    };

    /**
     * Навешивание событий на кнопки
     */
    readonly #addEventListeners = () => {
        this.#deleteContainer = this.self.querySelector('#delete_button') as HTMLElement;
        this.#deleteButton = this.self.querySelector('.job__button--delete');
        this.#editButton = this.self.querySelectorAll('.resume_info__edit');
        this.#editButton.forEach((element) => {
            element.addEventListener('click', () => {
                router.go(`/resumeEdit/${this.#id}`);
            });
        });
        if (this.#deleteButton)
            this.#deleteButton.addEventListener('click', () => {
                if (this.#deleteContainer) {
                    const dialog = new DialogContainer(
                        this.#deleteContainer,
                        'Резюме',
                        DeleteDialog,
                        {
                            title: 'Удалить резюме?',
                            message: 'Резюме удалится навсегда без возможности его восстановления',
                            delete: this.#delete,
                        },
                    );
                    dialog.render();
                }
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
                pdfLink: `http://localhost/api/v1/resume/pdf/${this.#data.id}`,
                hasExp: this.#data.work_experiences.length !== 0 
            }),
        );

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
