import { ResumeCard } from "../resumeCard/resumeCard"
import "./resumeCatalog.sass"
import { logger } from "../../utils/logger"
import template from "./resumeCatalog.handlebars"
import { ResumeCatalogFilter } from "../resumeCatalogFilter/resumeCatalogFilter"
import type { Resume } from "../../api/interfaces"
import { resumeMock } from "../../api/mocks"
import { api } from "../../api/api"

export class ResumeCatalog {
  readonly #parent: HTMLElement
  #resumes: Resume[] | null = null

  /**
   * Конструктор класса
   * @param parent {HTMLElement} - родительский элемент
   */
  constructor(parent: HTMLElement) {
    this.#parent = parent
  }

  /**
   * Получение резюме
   * @return {Resume[]}
   */
  init = async () => {
    try {
      this.#resumes = await api.resume.all()
    } catch (error) {
      logger.error("Ошибка при загрузке резюме:", error)
      this.#resumes = null
    }
  }

  /**
   * Получение объекта. Это ленивая переменная - значение вычисляется при вызове
   * @returns {HTMLElement}
   */
  get self(): HTMLElement {
    return document.getElementById("resume_catalog_page") as HTMLElement
  }

  /**
   * Очистка
   */
  remove = () => {
    logger.info("ResumeCatalog remove method called")
    this.self.remove()
  }

  /**
   * Рендеринг страницы
   */
  render = async () => {
    logger.info("ResumeCatalog render method called")
    this.#parent.insertAdjacentHTML("beforeend", template({}))
    const filter = new ResumeCatalogFilter(this.self.querySelector(".resume_filter") as HTMLElement)
    filter.render()
    this.#resumes = [resumeMock]
    this.#resumes?.forEach((element) => {
      const card = new ResumeCard(this.self.querySelector(".resume_list") as HTMLElement, element)
      card.render()
    })
    // this.init().then(() => {
    //     if (!this.#resumes) {
    //         const resumesList = this.self.querySelector('.resume_list') as HTMLElement
    //         resumesList.textContent = "Резюме не найдено"
    //     }
    //     this.#resumes?.forEach(element => {
    //         const card = new ResumeCard(this.self.querySelector('.resume_list') as HTMLElement, element);
    //         card.render();
    //     });
    // })
  }
}
