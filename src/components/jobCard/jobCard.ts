import './jobCard.sass';
import { logger } from '../../utils/logger';
import template from './jobCard.handlebars';
import templateResponded from '../../partials/jobCardResponded.handlebars';
import templateNoResponded from '../../partials/jobCardNoResponded.handlebars';
import { VacancyShort } from '../../api/interfaces';
import { router } from '../../router';
import { employmentTranslations, workFormatTranslations } from '../../api/translations';
import { api } from '../../api/api';
import { store } from '../../store';
import { DialogContainer } from '../dialog/dialog';
import { NoResumeDialog } from '../noResumeDialog/noResumeDialog';
import notification from '../notificationContainer/notificationContainer';
import { RegisterDialog } from '../registerDialog/registerDialog';
import { ResponseDialog } from '../responseDialog/responseDialog';

export class JobCard {
    readonly #parent: HTMLElement;
    readonly #props: VacancyShort;
    #buttonsContainer: HTMLElement | null = null;
    #favoriteButton: HTMLElement | null = null;

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
        this.#buttonsContainer = this.self.querySelector('.job__buttons');
        this.#favoriteButton = this.self.querySelector('.job__favorite');
        if (this.#buttonsContainer) {
            this.#buttonsContainer.addEventListener('click', (e: Event) => {
                e.preventDefault();
                const element = (e.target as HTMLElement).closest(
                    '.job__button, .job__button_second',
                );
                if (!element) return;
                if (store.data.authorized === false) {
                    const dialog = new DialogContainer(
                        this.#parent,
                        'НеАвторизован',
                        RegisterDialog,
                    );
                    dialog.render();
                    return;
                }
                if (element.id === `vacancy_${this.#props.id}_resume`) {
                    const dialog = new DialogContainer(this.#parent, 'Отклик', ResponseDialog, {
                        click: this.#handleResumeClick,
                        target: this.self,
                    });
                    dialog.render();
                } else if (element.id === `vacancy_${this.#props.id}_unresume`) {
                    this.#handleUnresumeClick();
                }
            });
        }

        if (this.#favoriteButton) {
            this.#favoriteButton.addEventListener('click', async () => {
                if (this.#favoriteButton) {
                    const favoriteIcon = this.#favoriteButton.querySelector('img');
                    try {
                        await api.vacancy.favorite(this.#props.id);
                        if (favoriteIcon && favoriteIcon.src.endsWith('/heart-fill.svg')) {
                            favoriteIcon.src = '/heart-empty.svg';
                            notification.add('OK', 'Вы успешно удалили вакансию из избранного');
                        } else if (favoriteIcon) {
                            favoriteIcon.src = '/heart-fill.svg';
                            notification.add('OK', 'Вы успешно добавили вакансию в избранное');
                        }
                    } catch {
                        if (favoriteIcon && favoriteIcon.src.endsWith('/heart-fill.svg')) {
                            notification.add('FAIL', 'Не удалось убрать лайк с вакансии');
                        } else if (favoriteIcon) {
                            notification.add('FAIL', 'Не удалось лайкнуть вакансию');
                        }
                    }
                }
            });
        }
        this.self.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            // Если клик не на кнопке
            const inButtons = target.closest('.job__buttons');
            const inFavorite = target.closest('.job__favorite');
            if (inButtons === null && inFavorite === null) router.go(`/vacancy/${this.#props.id}`);
        });

        this.self.addEventListener('no-resumes', () => {
            if (!store.data.authorized) {
                const dialog = new DialogContainer(this.#parent, 'НеАвторизован', RegisterDialog);
                dialog.render();
            } else {
                const dialog = new DialogContainer(this.#parent, 'НетРезюме', NoResumeDialog, {
                    click: this.#handleResumeClick,
                });
                dialog.render();
            }
        });
    };

    /**
     * Отмена отклика вакансии
     */
    readonly #handleUnresumeClick = async () => {
        logger.info('resume');
        try {
            await api.vacancy.response(this.#props.id);
            const buttonsContainer = this.self.querySelector('.job__buttons');
            if (buttonsContainer) {
                buttonsContainer.innerHTML = templateNoResponded({ id: this.#props.id });
            }
            notification.add('OK', `Успешный отмена отклика`);
        } catch {
            notification.add('FAIL', `Ошибка отмене отклика на вакансию`);
        }
    };

    /**
     * Отклик на вакансию
     */
    readonly #handleResumeClick = async () => {
        logger.info('resume');
        try {
            await api.vacancy.response(this.#props.id);
            const buttonsContainer = this.self.querySelector('.job__buttons');
            if (buttonsContainer) {
                buttonsContainer.innerHTML = templateResponded({ id: this.#props.id });
            }
            notification.add(
                'OK',
                `Успешный отклик на вакансию`,
                `Вы откликнулсь на вакансию ${this.#props.title}`,
            );
        } catch {
            notification.add('FAIL', `Ошибка при отклике на вакансию`);
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
                isApplicant:
                    (store.data.authorized && store.data.user.role === 'applicant') ||
                    store.data.authorized === false,
            }),
        );
        this.#addEventListeners();
    };
}
