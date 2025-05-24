import "./salaryCarousel.sass"
import { logger } from "../../utils/logger"
import template from "./salaryCarousel.handlebars"
import { SalaryCard } from "../salaryCard/salaryCard"
import type { SalarySpecialization } from "../../api/interfaces"

export class SalaryCarousel {
  readonly #parent: HTMLElement
  #slidesContainer: HTMLElement | null = null
  #prevBtn: HTMLElement | null = null
  #nextBtn: HTMLElement | null = null
  #specializations: SalarySpecialization[] = []
  #scrollAmount = 340

  /**
   * Конструктор класса
   * @param {HTMLElement} parent - родительский элемент
   */
  constructor(parent: HTMLElement) {
    this.#parent = parent
  }

  /**
   * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
   * @returns {HTMLElement}
   */
  get self(): HTMLElement {
    return document.getElementById("salary_carousel") as HTMLElement
  }

  /**
   * Установка данных специализаций
   * @param {SalarySpecialization[]} specializations - массив специализаций
   */
  setSpecializations = (specializations: SalarySpecialization[]) => {
    this.#specializations = specializations
  }

  /**
   * Обновление размера прокрутки в зависимости от размера экрана
   */
  readonly #updateScrollAmount = () => {
    if (window.innerWidth <= 480) {
      this.#scrollAmount = 265 // 250px + 15px gap
    } else if (window.innerWidth <= 768) {
      this.#scrollAmount = 295 // 280px + 15px gap
    } else if (window.innerWidth <= 1200) {
      this.#scrollAmount = 320 // 300px + 20px gap
    } else {
      this.#scrollAmount = 340 // 320px + 20px gap
    }
  }

  /**
   * Обновление состояния кнопок навигации
   */
  readonly #updateButtons = () => {
    if (!this.#slidesContainer || !this.#prevBtn || !this.#nextBtn) return

    const isAtStart = this.#slidesContainer.scrollLeft <= 0
    const isAtEnd =
      this.#slidesContainer.scrollLeft >= this.#slidesContainer.scrollWidth - this.#slidesContainer.clientWidth - 1
    ;(this.#prevBtn as HTMLButtonElement).disabled = isAtStart
    ;(this.#nextBtn as HTMLButtonElement).disabled = isAtEnd
  }

  /**
   * Навешивание обработчиков событий
   */
  readonly #addEventListeners = () => {
    this.#slidesContainer = document.getElementById("salary_carousel_slides") as HTMLElement
    this.#prevBtn = document.getElementById("salary_carousel_prev") as HTMLElement
    this.#nextBtn = document.getElementById("salary_carousel_next") as HTMLElement

    if (!this.#slidesContainer || !this.#prevBtn || !this.#nextBtn) return

    // Обработчики кнопок навигации
    this.#prevBtn.addEventListener("click", () => {
      this.#slidesContainer?.scrollBy({
        left: -this.#scrollAmount,
        behavior: "smooth",
      })
    })

    this.#nextBtn.addEventListener("click", () => {
      this.#slidesContainer?.scrollBy({
        left: this.#scrollAmount,
        behavior: "smooth",
      })
    })

    // Обновление состояния кнопок при прокрутке
    this.#slidesContainer.addEventListener("scroll", this.#updateButtons)

    // Обновление размеров при изменении размера окна
    window.addEventListener("resize", () => {
      this.#updateScrollAmount()
      this.#updateButtons()
    })

    // Инициализация
    this.#updateScrollAmount()
    this.#updateButtons()
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
    this.#addEventListeners()
    this.#renderCards()
  }
}
