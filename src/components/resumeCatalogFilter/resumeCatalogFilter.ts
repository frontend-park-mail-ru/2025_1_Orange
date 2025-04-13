import "./resumeCatalogFilter.sass"
import { logger } from "../../utils/logger"
import template from "./resumeCatalogFilter.handlebars"

export class ResumeCatalogFilter {
  readonly #parent: HTMLElement

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
  get self(): HTMLFormElement {
    return document.forms.namedItem("resume_catalog_filter") as HTMLFormElement
  }

  /**
   * Очистка
   */
  remove = () => {
    logger.info("ResumeCatalogFilter remove method called")
    this.self.remove()
  }

  /**
   * Рендеринг компонента
   */
  render = () => {
    logger.info("ResumeCatalogFilter render method called")

    this.#parent.insertAdjacentHTML("beforeend", template())
  }
}
