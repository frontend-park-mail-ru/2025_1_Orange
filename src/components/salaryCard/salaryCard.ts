import './salaryCard.sass';
import { logger } from '../../utils/logger';
import template from './salaryCard.handlebars';
import type { SalarySpecialization } from '../../api/interfaces';

export class SalaryCard {
    readonly #parent: HTMLElement;
    readonly #props: SalarySpecialization;

    /**
     * Конструктор класса
     * @param {HTMLElement} parent  - родительский элемент
     * @param {SalarySpecialization} props - данные для рендера
     */
    constructor(parent: HTMLElement, props: SalarySpecialization) {
        this.#parent = parent;
        this.#props = props;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById(`salaryCard-${this.#props.id.toString()}`) as HTMLElement;
    }

    /**
     * Форматирование числа с разделителями тысяч
     * @param {number} num - число для форматирования
     * @returns {string} отформатированное число
     */
    readonly #formatSalary = (num: number): string => {
        return num.toLocaleString('ru-RU');
    };

    /**
     * Очистка
     */
    remove = () => {
        logger.info('SalaryCard remove method called');
        this.self.remove();
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('SalaryCard render method called');

        const formattedProps = {
            ...this.#props,
            minSalary: this.#formatSalary(this.#props.minSalary),
            maxSalary: this.#formatSalary(this.#props.maxSalary),
            avgSalary: this.#formatSalary(this.#props.avgSalary),
        };

        this.#parent.insertAdjacentHTML('beforeend', template(formattedProps));
    };
}
