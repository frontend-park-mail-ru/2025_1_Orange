import './jobCatalogFilter.sass';
import { logger } from '../../utils/logger';
import template from './jobCatalogFilter.handlebars';
import { store } from '../../store';

export class JobCatalogFilter {
    readonly #parent: HTMLElement;
    #pagination: NodeListOf<HTMLInputElement> = [];
    #employment: NodeListOf<HTMLInputElement> = [];
    #experience: NodeListOf<HTMLInputElement> = [];
    #minSallary: NodeListOf<HTMLInputElement> = [];
    // Какой ужас а не тип >:(
    // Такой тип был написан в гайде в интернете
    #inputTimer: ReturnType<typeof setTimeout> | null = null;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     */
    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLFormElement {
        return document.forms.namedItem('job_catalog_filter') as HTMLFormElement;
    }

    /**
     * Очистка
     */
    remove = () => {
        logger.info('JobCatalogFilter remove method called');
        this.self.remove();
    };

    /**
     * Обработчики событий
     */
    readonly #addEventListeners = () => {
        this.#minSallary = document.querySelectorAll('input[name="min_salary"]');
        this.#pagination.forEach((radio) => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    store.data.vacancyLimit = Number.parseInt(radio.value);
                }
            });
        });
        this.#employment.forEach(input => {
            input.addEventListener('change', () => {
                store.data.vacancyFilter.employment = this.#getCheckbox(this.#employment)
                this.#newFilters()
            })
        });
        this.#experience.forEach(input => {
            input.addEventListener('change', () => {
                store.data.vacancyFilter.experience = this.#getCheckbox(this.#experience)
                this.#newFilters()
            })
        });
        this.#minSallary.forEach((input) => {
            input.addEventListener('input', () => {
                if (!input) return
                store.data.vacancyFilter.min_salary = input.value
                // Debouncing (Смайлик с солнечными очками)
                // Умное слово сказано в лекции а реализации не было :(
                // Тут проверка на null - первый запуск
                if (this.#inputTimer !== null) {
                    clearTimeout(this.#inputTimer)
                }
                this.#inputTimer = setTimeout(() => {
                    this.#newFilters();
                }, 2000);
            })
        })

        this.self.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.#inputTimer !== null) {
                clearTimeout(this.#inputTimer)
            }
            this.#newFilters();
        })
    };

    /**
     * Установка значений из стор для checkbox
     */
    #setCheckbox = (inputs: NodeListOf<HTMLInputElement>, values: string[]) => {
        inputs.forEach(input => {
            if (values.includes(input.value))
                input.checked = true
        });
    }

    /**
     * Отправка уведомления контейнеру работ о новых фильтрах
     */
    #newFilters = () => {
        const jobContainer = document.querySelector('.jobs_list')
        if (jobContainer) {
            const event = new CustomEvent('new-filters');
            jobContainer.dispatchEvent(event);
        }
    }

    /**
     * Получение значений из checkbox
     * @param {NodeListOf<HTMLInputElement>} inputs - чекбоксы с которых получаем данные
     */
    #getCheckbox = (inputs: NodeListOf<HTMLInputElement>): string[] => {
        const result: string[] = []
        inputs.forEach(input => {
            if (input.checked)
                result.push(input.value)
        });
        return result
    }

    /**
     * Рендеринг компонента
     */
    render = () => {
        logger.info('JobCatalogFilter render method called');

        this.#parent.insertAdjacentHTML('beforeend', template({
            minSalary: store.data.vacancyFilter.min_salary
        }));

        this.#pagination = this.self.querySelectorAll('input[name="pagination"]');

        this.#pagination.forEach((radio) => {
            if (radio.value === '' + store.data.vacancyLimit) radio.checked = true;
        });

        this.#employment = document.querySelectorAll('input[name="employment"]');
        this.#experience = document.querySelectorAll('input[name="experience"]');
        this.#setCheckbox(this.#employment, store.data.vacancyFilter.employment)
        this.#setCheckbox(this.#experience, store.data.vacancyFilter.experience)
        this.#addEventListeners();
    };
}
