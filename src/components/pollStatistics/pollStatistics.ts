import "./pollStatistics.sass"
import { router } from "../../router"
import { logger } from "../../utils/logger"
import template from "./pollStatistics.handlebars"
import type { PollStatistic, RatingStatistic } from "../../api/interfaces"

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
   * @param stars {number} - количество заполненных звезд
   * @returns {string} - HTML строка со звездами
   */
  #generateStarsHtml(stars: number): string {
    let html = ""

    // Добавляем заполненные звезды
    for (let i = 0; i < stars; i++) {
      html += `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FFD700" class="bi bi-star-fill" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
              </svg>`
    }

    // Добавляем пустые звезды
    for (let i = stars; i < 5; i++) {
      html += `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FFD700" class="bi bi-star" viewBox="0 0 16 16">
                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
              </svg>`
    }

    return html
  }

  /**
   * Подготавливает данные для отображения
   * @param statistics {RatingStatistic[]} - статистика рейтингов
   * @returns {RatingStatistic[]} - подготовленная статистика с HTML для звезд
   */
  #prepareStatisticsData(statistics: RatingStatistic[]): (RatingStatistic & { starsHtml: string })[] {
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
    try {
      // В реальном приложении здесь будет запрос к API
      // this.#pollStatistics = await api.polls.getStatistics();

      // Используем моковые данные для демонстрации
      this.#pollStatistics = [
        {
          id: 1,
          question: "Насколько вы удовлетворены удобством ResuMatch?",
          averageRating: 4.8,
          statistics: [
            { stars: 5, percentage: 91, votes: 18 },
            { stars: 4, percentage: 4, votes: 18 },
            { stars: 3, percentage: 2, votes: 18 },
            { stars: 2, percentage: 2, votes: 18 },
            { stars: 1, percentage: 1, votes: 18 },
          ],
        },
        {
          id: 2,
          question: "Насколько вы удовлетворены удобством ResuMatch?",
          averageRating: 4.8,
          statistics: [
            { stars: 5, percentage: 91, votes: 18 },
            { stars: 4, percentage: 4, votes: 18 },
            { stars: 3, percentage: 2, votes: 18 },
            { stars: 2, percentage: 2, votes: 18 },
            { stars: 1, percentage: 1, votes: 18 },
          ],
        },
      ]

      // Подготавливаем данные для отображения
      this.#pollStatistics = this.#pollStatistics.map((poll) => ({
        ...poll,
        statistics: this.#prepareStatisticsData(poll.statistics),
      })) as PollStatistic[]
    } catch (error) {
      logger.error("Не удалось загрузить статистику опросов", error)
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
