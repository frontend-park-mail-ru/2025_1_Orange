import template from './resumeExperience.handlebars';
import { WorkExperience } from '../../api/interfaces';
import { logger } from '../../utils/logger';
import './resumeExperience.sass';

export class ResumeExperience {
    readonly #parent: HTMLElement;
    readonly #props: WorkExperience;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     */
    constructor(parent: HTMLElement, props: WorkExperience) {
        this.#parent = parent;
        this.#props = props;
    }

    /**
     * Сколько месяцев отработал на работе
     * @returns {number} - количество проработанных месяцев
     */
    readonly #duration = (): number => {
        const start_date = new Date(this.#props.start_date);
        this.#props.start_date = `${start_date.getDate()}.${start_date.getMonth() + 1}.${start_date.getFullYear()}`
        if (this.#props.until_now) {
            const end_date = new Date();
            const duration = Math.floor(
                (end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 24 * 30),
            );
            if (duration < 0) return 0
            return duration
        }
        const end_date = new Date(this.#props.end_date);
        this.#props.end_date = `${end_date.getDate()}.${end_date.getMonth() + 1}.${end_date.getFullYear()}`
        const duration = Math.floor(
            (end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 24 * 30),
        );
        if (duration < 0) return 0
        return duration
    };

    /**
     * Рендеринг опыта работы
     */
    render = () => {
        const duration = this.#duration()
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...this.#props,
                duration,
            }),
        );
        logger.info('ResumeExperience rendered:', this.#props.position);
    };
}
