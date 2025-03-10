import './jobCard.css';
import { logger } from '../../utils/logger.js';

export class JobCard {
    #parent;
    #props;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     * @param props
     * {id: number,
     * profession: string,
     * salary: string,
     * company: string,
     * city: string,
     * badges: [{name: string}],
     * day_created: number,
     * count: number} - данные для рендера
     */
    constructor(parent, props) {
        this.#parent = parent;
        this.#props = props;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self() {
        return document.getElementById(this.#props.id);
    }

    /**
     * Очистка
     */
    remove = () => {
        logger.info('JobCard remove method called');
        this.self.remove();
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('JobCard render method called');
        // eslint-disable-next-line no-undef
        const template = Handlebars.templates['jobCard/jobCard'];
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                p: this.#props,
            }),
        );
    };
}
