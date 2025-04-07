import template from './vacancyEdit.handlebars'; // Шаблон Handlebars
import { logger } from '../../utils/logger';

export interface VacancyInfo {
    name: string;
    specialization: string;
    city: string;
    address: string;
    work_type: string;
    work_timetable: string;
    work_time: number;
    work_mode: string;
    sallary_min: number;
    sallary_max: number;
    sallary_frequency: string;
    tax: boolean;
    experience: string;
    description: string;
    skills: string;
    additional: string[];
}

export class VacancyEdit {
    readonly #parent: HTMLElement;

    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return this.#parent;
    }

    /**
     * Очистка
     */
    remove = () => {
        logger.info('VacancyEdit remove method called');
        this.self.innerHTML = '';
    };

    /**
     * Рендеринг страницы
     */
    render = () => {
        logger.info('VacancyEdit render method called');
        this.#parent.insertAdjacentHTML('beforeend', template());
    };
}
