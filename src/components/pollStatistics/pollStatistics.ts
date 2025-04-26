import "./pollStatistics.sass"
import { router } from "../../router"
import { logger } from "../../utils/logger"
import template from "./pollStatistics.handlebars"
import starTemplate from '../../partials/star.handlebars';
import type { PollStatistic, RatingStatistic } from "../../api/interfaces"
import { api } from "../../api/api";
import { store } from "../../store";

export class PollStatistics {
  readonly #parent: HTMLElement
  #pollStatistics: PollStatistic[] = []

  /**
   * Конструктор класса
   * @param parent {HTMLElement} - родительский элемент
   */
  constructor(parent: HTMLElement) {
    this.#parent = parent
  }

  /**
   * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
   * @returns {HTMLElement}
   */
  get self(): HTMLElement {
    return document.querySelector(".poll-statistics") as HTMLElement
  }

  /**
   * Генерирует HTML для звезд
   * @param {number} stars - количество заполненных звезд
   * @returns {string} - HTML строка со звездами
   */
  #generateStarsHtml(stars: number): string {
    let html = ""

    for (let i = 1; i < 6; i++) {
      let checked = true
      if (i > stars) checked = false
      html += starTemplate({
        checked
      })
    }
    return html
  }

  /**
   * Подготавливает данные для отображения
   * @param statistics {RatingStatistic[]} - статистика рейтингов
   * @returns {RatingStatistic[]} - подготовленная статистика с HTML для звезд
   */
  #prepareStatisticsData(statistics: RatingStatistic[]): (RatingStatistic & { starsHtml: string })[] {
    // Здесь проходимся по статистике по каждому вопросу и добавляем звёздочки
    return statistics.map((stat) => ({
      ...stat,
      starsHtml: this.#generateStarsHtml(stat.stars),
    }))
  }

  /**
   * Инициализация данных
   */
  init = async () => {
    logger.info("PollStatistics init method called")
    if (!store.data.authorized) router.back()
    try {
      this.#pollStatistics = await api.poll.statics();
      // Подготавливаем данные для отображения
      this.#pollStatistics = this.#pollStatistics.map((poll) => ({
        ...poll,
        statistics: this.#prepareStatisticsData(poll.statistics),
      })) as PollStatistic[]
    } catch {
      logger.error("Не удалось загрузить статистику опросов")
      router.back()
    }
  }

  /**
   * Очистка
   */
  remove = () => {
    logger.info("PollStatistics remove method called")
    this.self?.remove()
  }

  /**
   * Рендеринг страницы
   */
  render = () => {
    logger.info("PollStatistics render method called")
    this.#parent.insertAdjacentHTML(
      "beforeend",
      template({
        polls: this.#pollStatistics,
      }),
    )
  }
}
