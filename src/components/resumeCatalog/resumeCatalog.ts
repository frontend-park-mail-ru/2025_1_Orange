import { ResumeCard } from '../resumeCard/resumeCard';
import './resumeCatalog.sass';
import { logger } from '../../utils/logger';
import template from './resumeCatalog.handlebars';
import { ResumeCatalogFilter } from '../resumeCatalogFilter/resumeCatalogFilter';
import type { Resume } from '../../api/interfaces';
import { api } from '../../api/api';
import { store } from '../../store';
import { router } from '../../router';
import { BurgerMenu } from '../burgerMenu/burgerMenu';

export class ResumeCatalog {
    readonly #parent: HTMLElement;
    #resumes: Resume[] = [];
    #resumeContainer: HTMLElement | null = null;
    #searchForm: HTMLFormElement | null = null;
    #paginationButton: HTMLElement | null = null;

    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     */
    constructor(parent: HTMLElement) {
        this.#parent = parent;
    }

    /**
     * Получение первоначальных данных для страницы
     */
    init = async () => {
        store.data.vacancyOffset = 0
        store.data.vacancyLimit = 10
        await this.#getResume()

    };

    /**
     * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
     * @returns {HTMLElement}
     */
    get self(): HTMLElement {
        return document.getElementById('resume_catalog_page') as HTMLElement;
    }

    /**
     * Очистка
     */
    remove = () => {
        logger.info('ResumeCatalog remove method called');
        this.self.remove();
    };

    /**
     * Получение резюме
     * Данные кладутся в приватную переменную #resumes
     */
    #getResume = async () => {
        try {
            if (store.data.resumeSearch !== '') this.#resumes = await api.resume.search(store.data.resumeSearch, store.data.resumeOffset, store.data.resumeLimit);
            else this.#resumes = await api.resume.all(store.data.resumeOffset, store.data.resumeLimit);
        } catch (error) {
            logger.error('Ошибка при загрузке резюме:', error);
            this.#resumes = [];
        }
    }

    /**
     * Функция поиска резюме
     * @param query - строка для поиска
     * @returns {void}
     */
    #searchResume = async (query: string) => {
        if (query === store.data.resumeSearch) return
        store.data.resumeSearch = query
        router.go('/resumeCatalog')
    }

    /**
     * Рендеринг карточек резюме на основе #resumes
     */
    #renderResume = () => {
        if (this.#resumeContainer) {
            if (this.#resumes.length === 0 && store.data.resumeOffset === 0) {
                this.#resumeContainer.textContent = 'Нету резюме';
            }
            this.#paginationButton = document.getElementById('pagination_button') as HTMLElement
            if (this.#resumes.length < store.data.resumeLimit) this.#paginationButton?.remove()
            this.#resumes.forEach((resume) => {
                const card = new ResumeCard(
                    this.#resumeContainer as HTMLElement,
                    resume,
                );
                card.render();
            });
        }
    }

    /**
     * Навешивание обработчиков
     */
    #addEventListeners = () => {
        this.#searchForm = document.forms.namedItem('resume_search')
        this.#paginationButton = document.getElementById('pagination_button')

        if (this.#searchForm) {
            this.#searchForm.addEventListener('submit', (e: Event) => {
                e.preventDefault()
                if (this.#searchForm) {
                    const searchField = this.#searchForm.elements.namedItem('search') as HTMLInputElement
                    const value = searchField.value.trim()
                    this.#searchResume(value)
                }
            })
        }
        this.#paginationButton = document.getElementById('pagination_button') as HTMLElement
        if (this.#paginationButton) {
            this.#paginationButton.addEventListener('click', async () => {
                store.data.resumeOffset += store.data.resumeLimit
                try {
                    await this.#getResume()
                } catch {
                    this.#paginationButton?.remove()
                }
                this.#renderResume()
            })
        }
    };

    /**
     * Рендеринг страницы
     */
    render = async () => {
        logger.info('ResumeCatalog render method called');
        this.#parent.insertAdjacentHTML('beforeend', template({
            search: store.data.resumeSearch
        }));
        const filter = new ResumeCatalogFilter(
            this.self.querySelector('.resume_filter') as HTMLElement,
        );
        filter.render();
        this.#resumeContainer = this.self.querySelector('.resume_list') as HTMLElement
        this.#renderResume()
        this.#addEventListeners()
        const burger = new BurgerMenu(this.self, ResumeCatalogFilter)
        burger.render()
    };
}
