import './resumeCard.sass';
import { logger } from '../../utils/logger';
import template from './resumeCard.handlebars';
import type { Resume, WorkExperience } from '../../api/interfaces';
import { router } from '../../router';
import { statusTranslations } from '../../api/translations';

export class ResumeCard {
    readonly #parent: HTMLElement;
    readonly #props: Resume;
    #detailsToggleMore: HTMLElement | null = null;
    #detailsToggleLess: HTMLElement | null = null;
    #detailsWrapper: HTMLElement | null = null;

    /**
     * Конструктор класса
     * @param {HTMLElement} parent  - родительский элемент
     * @param {Resume} props - данные для рендера
     */
    constructor(parent: HTMLElement, props: Resume) {
        this.#parent = parent;
        this.#props = props;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById(`resumeCard-${this.#props.id.toString()}`) as HTMLElement;
    }

    /**
     * Навешивание обработчиков
     */
    readonly #addEventListeners = () => {
        this.self.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            // Если клик не на кнопке "Подробнее" или "Свернуть"
            if (!target.closest('.resume-card__details-toggle')) {
                router.go(`/resume/${this.#props.id}`);
            }
        });

        // Обработчики для кнопок "Подробнее" и "Свернуть"
        this.#detailsToggleMore = this.self.querySelector('.resume-card__details-toggle--more');
        this.#detailsToggleLess = this.self.querySelector('.resume-card__details-toggle--less');
        this.#detailsWrapper = this.self.querySelector('.resume-card__details-wrapper');

        const toggleDetails = (e: Event) => {
            e.stopPropagation(); // Предотвращаем всплытие события, чтобы не срабатывал клик по карточке
            if (this.#detailsWrapper) {
                this.#detailsWrapper.classList.toggle('resume-card__details-wrapper--expanded');
            }
        };

        this.#detailsToggleMore?.addEventListener('click', toggleDetails);
        this.#detailsToggleLess?.addEventListener('click', toggleDetails);
    };

    /**
     * Очистка
     */
    remove = () => {
        logger.info('ResumeCard remove method called');
        this.self.remove();
    };

    /**
     * Вычисление возраста на основе даты рождения
     * @returns {number} - возраст в годах
     */
    readonly #calculateAge = (): number => {
        const birthDate = new Date(this.#props.applicant.birth_date);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    /**
     * Форматирование даты обновления резюме
     * @returns {string} - форматированная дата
     */
    readonly #formatUpdatedDate = (): string => {
        const updated = new Date(this.#props.updated_at);
        const months = [
            'января',
            'февраля',
            'марта',
            'апреля',
            'мая',
            'июня',
            'июля',
            'августа',
            'сентября',
            'октября',
            'ноября',
            'декабря',
        ];
        return `${updated.getDate()} ${months[updated.getMonth()]}`;
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('ResumeCard render method called');

        // Получаем последний опыт работы, если есть
        let lastExperience : WorkExperience | null = null
        if (this.#props.work_experiences.length !== 0) lastExperience = this.#props.work_experiences[this.#props.work_experiences.length - 1]

        // Форматируем период работы
        let workPeriod = '';
        if (lastExperience) {
            workPeriod = lastExperience.until_now 
                ? `${lastExperience.start_date} — по настоящее время`
                : `${lastExperience.start_date} — ${lastExperience.end_date}`;
        }

        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...this.#props,
                id: this.#props.id,
                fullName: `${this.#props.applicant.first_name} ${this.#props.applicant.last_name}`,
                hasAge: this.#calculateAge() < 200,
                age: this.#calculateAge(),
                updatedDate: this.#formatUpdatedDate(),
                statusText: statusTranslations[this.#props.applicant.status],
                lastExperience,
                workPeriod,
            }),
        );

        this.#addEventListeners();
    };
}
