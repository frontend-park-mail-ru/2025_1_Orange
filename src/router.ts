import { logger } from './utils/logger';

/**
 * Класс роутинга страничек. Может работать только с 1 уровнем ссылки
 * /catalog/1234 - поддерживается (обработка числа в компоненте)
 * /auth/email/ - уже не поддерживается
 */
class Router {
    #routes: Record<string, () => void> = {};
    /**
     * @constructor
     * Конструктор роутера. Накладывает обработчик на переход по страницам
     * Переход не обычный а от пользователя или history.back()
     */
    constructor() {
        window.addEventListener('popstate', () => {
            this.#navigate();
        });
    }

    /**
     * Метод добавления пути в роутер
     * @param {stirng} route - путь до странички
     * @param {Function} callback - функция рендеринга
     */
    add = (route: string, callback: () => void) => {
        this.#routes[route] = callback;
    };

    /**
     * Обёртка для перехода на страничку. Используется в компонентах
     * @param {string} url - путь до странички
     */
    go = (url: string) => {
        // По MDN 2 параметр отвечает за заголовок страницы,
        // но его никто кроме safari не поддерживает :)
        // и в документации сказано использовать ''
        history.pushState(null, '', url);
        this.#navigate();
    };

    /**
     * Реальный метод перехода на страничку. Парсит путь и
     * вызывает функцию рендеринга
     */
    readonly #navigate = () => {
        const url = window.location.pathname;
        console.log(url);
        // /catalog -> '', 'catalog'
        console.log(url.split('/'));
        const parsed = url.split('/')[1];

        if (this.#routes[parsed]) {
            logger.info(`Маршрут ${parsed} найден`);
            this.#routes[parsed]();
        } else {
            this.go('/catalog')
            logger.warn(`Маршрут ${parsed} не найден`);
        }
    };

    /**
     * Функция для кнопок назад на сайте.
     * Сами берём и кликаем за пользователя.
     * Вызовет eventListner('popstate')
     */
    readonly back = () => window.history.back();
}

// Синглтончик :)
export const router = new Router();
