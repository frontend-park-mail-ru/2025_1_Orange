import './jobCard.sass';
import { logger } from '../../utils/logger';
import template from './jobCard.handlebars';
import templateButton from '../../partials/jobCardResponded.handlebars';
import { VacancyShort } from '../../api/interfaces';
import { router } from '../../router';
import { employmentTranslations, workFormatTranslations } from '../../api/translations';
import { api } from '../../api/api';
import { store } from '../../store';

export class JobCard {
    readonly #parent: HTMLElement;
    readonly #props: VacancyShort;
    #resumeButton: HTMLElement | null = null;

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
        this.self.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            // Если клик не на кнопке
            if (target.className !== 'job__button' && target.className !== 'job__button_second') {
                router.go(`/vacancy/${this.#props.id}`);
            }
        });

        if (this.#resumeButton) {
            const handleResumeClick = async () => {
                const error = this.self.querySelector('.job__error') as HTMLElement;
                if (error) {
                    error.hidden = true;
                    error.textContent = '';
                }
                logger.info('resume');
                try {
                    await api.vacancy.response(this.#props.id);
                    if (this.#resumeButton) {
                        const buttonsContainer = this.self.querySelector('.job__buttons');
                        if (buttonsContainer) {
                            buttonsContainer.innerHTML = '';
                            buttonsContainer.insertAdjacentHTML('beforeend', templateButton({}));
                        }

                        // Убираем обработчик события после успешного действия
                        this.#resumeButton.removeEventListener('click', handleResumeClick);
                    }
                } catch {
                    if (error) {
                        error.hidden = false;
                        error.textContent = 'Ошибка при отправке отклика';
                    }
                }
            };
            this.#resumeButton.addEventListener('click', handleResumeClick);
        }
    };

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
        logger.info({
            ...this.#props,
            workFormatTranslations,
            employmentTranslations,
        });
        const created_date = new Date(this.#props.created_at);
        this.#props.created_at = created_date.toLocaleDateString('ru-RU');
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...this.#props,
                workFormatTranslations,
                employmentTranslations,
            }),
        );

        this.#resumeButton = document.getElementById(
            `vacancy_${this.#props.id}_resume`,
        ) as HTMLElement;

        this.#addEventListeners();
    };
}
