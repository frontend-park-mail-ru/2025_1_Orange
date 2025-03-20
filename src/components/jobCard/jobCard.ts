import './jobCard.css';
import { logger } from '../../utils/logger.js';
import Handlebars from 'handlebars';

interface Badge {
    name: string;
}

interface JobCardProps {
    id: number;
    profession: string;
    salary: string;
    company: string;
    city: string;
    badges: Badge[];
    day_created: number;
    count: number;
}

export class JobCard {
    #parent : HTMLElement;
    #props : JobCardProps;

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
    constructor(parent: HTMLElement, props : JobCardProps) {
        this.#parent = parent;
        this.#props = props;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self() : HTMLElement {
        return document.getElementById(this.#props.id.toString()) as HTMLElement;
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
         
        const template = Handlebars.templates['jobCard/jobCard'];
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                p: this.#props,
            }),
        );
    };
}
