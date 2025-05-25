import "./salaryCarousel.sass"
import { logger } from "../../utils/logger"
import template from "./salaryCarousel.handlebars"
import { SalaryCard } from "../salaryCard/salaryCard"
import type { SalarySpecialization } from "../../api/interfaces"
import { api } from "../../api/api"
import notification from "../notificationContainer/notificationContainer"

export class SalaryCarousel {
  readonly #parent: HTMLElement
  #slidesContainer: HTMLElement | null = null
  #category: string | null = null
  #specializations: SalarySpecialization[] = []

  /**
   * Конструктор класса
   * @param {HTMLElement} parent - родительский элемент
   */
  constructor(parent: HTMLElement, category: string | null = null) {
    this.#parent = parent
    this.#category = category
  }

  init = async () => {
    logger.info('salaryCarousel init method called');
    logger.info('resumePage');
    try {
      if (this.#category === null) {
        this.#specializations = (await api.specialization.all()).specializations
      }
    } catch {
      notification.add('FAIL', 'Не удалось загрузить статистику по категориям')
      logger.info('Не удалось загрузить страницу');
    }
  };

  /**
   * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
   * @returns {HTMLElement}
   */
  get self(): HTMLElement {
    return document.getElementById("salary_carousel") as HTMLElement
  }

  /**
   * Рендеринг карточек специализаций
   */
  readonly #renderCards = () => {
    if (!this.#slidesContainer) return

    this.#specializations.forEach((specialization) => {
      const card = new SalaryCard(this.#slidesContainer as HTMLElement, specialization)
      card.render()
    })
  }

  /**
   * Очистка
   */
  remove = () => {
    logger.info("SalaryCarousel remove method called")
    this.self.remove()
  }

  /**
   * Рендеринг компонента
   */
  render = () => {
    logger.info("SalaryCarousel render method called")

    this.#parent.insertAdjacentHTML("beforeend", template({}))
    this.#renderCards()
  }
}
