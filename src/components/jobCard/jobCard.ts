import './jobCard.sass';
import { logger } from '../../utils/logger';
import template from './jobCard.handlebars';
import templateButton from '../../partials/jobCardResponded.handlebars';
import { VacancyShort } from '../../api/interfaces';
import { router } from '../../router';
import { employmentTranslations, workFormatTranslations } from '../../api/translations';
import { api } from '../../api/api';

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
                const error = this.self.querySelector('.job__error')
                if (error) {
                    error.textContent = ''
                }
                logger.info('resume');
                try {
                    await api.vacancy.response(this.#props.id);
                    if (this.#resumeButton) {
                        const buttonsContainer = this.self.querySelector('.job__buttons')
                        if (buttonsContainer) {
                            buttonsContainer.innerHTML = ''
                            buttonsContainer.insertAdjacentHTML(
                                'beforeend',
                                template({}),
                            );
                        }

                        // Убираем обработчик события после успешного действия
                        this.#resumeButton.removeEventListener('click', handleResumeClick);
                    }
                } catch {
                    if (error) error.textContent = 'Ошибка при отправке отклика';
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
     *
     * @returns {number} - количество дней с момента создания вакансии
     */
    readonly #days_created = (): number => {
        const created_date = new Date(this.#props.created_at).getTime();
        const now = Date.now();
        return Math.floor((now - created_date) / (1000 * 60 * 60 * 24));
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
        this.#parent.insertAdjacentHTML(
            'beforeend',
            template({
                ...this.#props,
                workFormatTranslations,
                employmentTranslations,
                days_created: this.#days_created,
            }),
        );

        this.#resumeButton = document.getElementById(
            `vacancy_${this.#props.id}_resume`,
        ) as HTMLElement;

        this.#addEventListeners();
    };
}
