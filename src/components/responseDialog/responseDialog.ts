import { api } from '../../api/api';
import { Resume } from '../../api/interfaces';
import { store } from '../../store';
import { logger } from '../../utils/logger';
import notification from '../notificationContainer/notificationContainer';
import { ResumeRow } from '../resumeRow/resumeRow';
import template from './responseDialog.handlebars';
import './responseDialog.sass';

export class ResponseDialog {
    readonly #parent: HTMLDialogElement;
    #resumes: Resume[] = [];
    readonly #click: () => void;
    readonly #target: HTMLElement;

    /**
     * Конструктор класса
     * @param {HTMLDialogElement} parent  - родительский элемент
     * @param {Function}
     */
    constructor(parent: HTMLDialogElement, data: { click: () => void; target: HTMLElement }) {
        this.#parent = parent;
        this.#click = data.click;
        this.#target = data.target;
    }

    /**
     * Получение данных
     */
    init = async () => {
        if (store.data.authorized === false) {
            this.#target.dispatchEvent(
                new CustomEvent('no-auth', {
                    bubbles: true,
                    composed: true,
                }),
            );
            throw new Error('NO RESUMES');
        }
        try {
            this.#resumes = await api.resume.all(0, 10);
        } catch {
            notification.add('FAIL', 'Не удалось загрузить резюме соискателя');
            logger.info('Не удалось загрузить');

            return;
        }
        if (this.#resumes.length === 0) {
            this.#target.dispatchEvent(
                new CustomEvent('no-resumes', {
                    bubbles: true,
                    composed: true,
                }),
            );
            throw new Error('NO RESUMES');
        }
    };

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLDialogElement}
     */
    get self(): HTMLDialogElement {
        return this.#parent.closest('dialog') as HTMLDialogElement;
    }

    /**
     * Очистка
     */
    remove = () => {
        logger.info('responseDialog remove method called');
        this.self.innerHTML = '';
    };

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('responseDialog render method called');
        this.#parent.insertAdjacentHTML('beforeend', template({}));
        const resumeContainer = this.self.querySelector('.response_dialog__resumes') as HTMLElement;
        this.#resumes.forEach(async (resume) => {
            const resumeRow = new ResumeRow(resumeContainer, resume, () => {
                store.data.responseResumeId = resume.id;
                this.#click();
                this.self.close();
            });
            resumeRow.render();
        });
    };
}
