import './categoryInfoCard.sass';
import { logger } from '../../utils/logger';
import template from './categoryInfoCard.handlebars';
import { CategoryInfo } from '../../api/interfaces';

export class CategoryInfoCard {
    readonly #parent: HTMLElement;
    readonly #props: CategoryInfo;

    /**
     * Конструктор класса
     * @param {HTMLElement} parent  - родительский элемент
     * @param {VacancyShort} props - данные для рендера
     */
    constructor(parent: HTMLElement, props: CategoryInfo) {
        this.#parent = parent;
        this.#props = props;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById(`category_info-${this.#props.id.toString()}`) as HTMLElement;
    }

    /**
     * Очистка
     */
    remove = () => {
        logger.info('CategoryInfoCard remove method called');
        this.self.remove();
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('CategoryInfoCard render method called');
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...this.#props,
            }),
        );
    };
}
