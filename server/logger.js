/**
 * Класс для логирования сообщений в консоль.
 * Сообщения выводятся только в режиме разработки (development).
 * Поддерживает уровни логирования: info, warn, error, debug.
 */
class Logger {
    /**
     * Приватное поле для хранения режима разработки.
     * @type {boolean}
     */
    #dev;

    /**
     * Приватное поле для хранения уровней логирования.
     * @type {Object}
     */
    #levels;

    /**
     * Приватное поле для текущего уровня логирования.
     * @type {number}
     */
    #currentLevel;

    /**
     * Создает экземпляр Logger.
     */
    constructor() {
        this.#dev = this.#inDevelopment();
        this.#levels = {
            info: 1,
            warn: 2,
            error: 3,
            debug: 4,
        };
        this.#currentLevel = this.#levels.info; // Уровень по умолчанию
    }

    /**
     * Определяет, находится ли приложение в режиме разработки.
     * @returns {boolean} - true, если режим разработки, иначе false.
     */
    #inDevelopment() {
        // eslint-disable-next-line no-undef
        return import.meta.env?.DEV || process.env.NODE_ENV === 'development';
    }

    /**
     * Устанавливает текущий уровень логирования.
     * @param {string} level - Уровень логирования ('info', 'warn', 'error', 'debug').
     */
    setLevel(level) {
        if (this.#levels[level]) {
            this.#currentLevel = this.#levels[level];
        } else {
            console.warn(`Уровень логирования "${level}" не найден. Установлен уровень "info".`);
            this.#currentLevel = this.#levels.info;
        }
    }

    /**
     * Логирует информационное сообщение.
     * @param {...any} args - Аргументы для вывода в консоль.
     */
    info(...args) {
        if (this.#dev && this.#currentLevel >= this.#levels.info) {
            console.log('[INFO]', ...args);
        }
    }

    /**
     * Логирует предупреждение.
     * @param {...any} args - Аргументы для вывода в консоль.
     */
    warn(...args) {
        if (this.#dev && this.#currentLevel >= this.#levels.warn) {
            console.warn('[WARN]', ...args);
        }
    }

    /**
     * Логирует ошибку.
     * @param {...any} args - Аргументы для вывода в консоль.
     */
    error(...args) {
        if (this.#dev && this.#currentLevel >= this.#levels.error) {
            console.error('[ERROR]', ...args);
        }
    }

    /**
     * Логирует отладочное сообщение.
     * @param {...any} args - Аргументы для вывода в консоль.
     */
    debug(...args) {
        if (this.#dev && this.#currentLevel >= this.#levels.debug) {
            console.debug('[DEBUG]', ...args);
        }
    }
}

export const logger = new Logger();
