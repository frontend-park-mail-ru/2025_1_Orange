import './jobCard.sass';
import { logger } from '../../utils/logger';
import template from './jobCard.handlebars';
import { VacancyShort } from '../../api/interfaces';
import { router } from '../../router';
import { employmentTranslations, workFormatTranslations } from '../../api/translations';

export class JobCard {
    readonly #parent: HTMLElement;
    readonly #props: VacancyShort;

    /**
     * Конструктор класса
     * @param {HTMLElement} parent  - родительский элемент
     * @param {VacancyShort} props - данные для рендера
     */
    constructor(parent: HTMLElement, props: VacancyShort) {
        this.#parent = parent;
        this.#props = props;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById(`jobCard-${this.#props.id.toString()}`) as HTMLElement;
    }

    /**
     * Навешивание обработчиков
     */
    readonly #addEventListeners = () => {
        this.self.addEventListener('click', () => router.go(`/vacancy/${this.#props.id}`));
    };

    /**
     * Очистка
     */
    remove = () => {
        logger.info('JobCard remove method called');
        this.self.remove();
    };

    /**
     *
     * @returns {number} - количество дней с момента создания вакансии
     */
    readonly #days_created = (): number => {
        const created_date = new Date(this.#props.created_at);
        const now = new Date();
        return Math.floor((now.getTime() - created_date.getTime()) / (1000 * 60 * 60 * 24));
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('JobCard render method called');
        console.log({
            ...this.#props,
            workFormatTranslations,
            employmentTranslations,
        });
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...this.#props,
                workFormatTranslations,
                employmentTranslations,
                days_created: this.#days_created,
            }),
        );
        this.#addEventListeners();
    };
}
