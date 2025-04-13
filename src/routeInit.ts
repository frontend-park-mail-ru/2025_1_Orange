import { JobCatalog } from "./components/jobCatalog/jobCatalog"
import { Header } from "./components/header/header"
import { store } from "./store"
import { JobPage } from "./components/jobPage/jobPage"
import { router } from "./router"
import { logger } from "./utils/logger"
import { RegistrationEmail } from "./components/registrationEmail/registrationEmail"
import { RegistrationPassword } from "./components/registrationPassword/registrationPassword"
import { Login } from "./components/login/login"
import { RegistrationUser } from "./components/registrationUser/registrationUser"
import { RegistrationCompany } from "./components/registrationCompany/registrationCompany"
import { VacancyEdit } from "./components/vacancyEdit/vacancyEdit"
import { ResumePage } from "./components/resumePage/resumePage"
import { ResumeEdit } from "./components/resumeEdit/resumeEdit"
import { ResumeCatalog } from "./components/resumeCatalog/resumeCatalog"

/**
 *
 * @param {string} name - название страницы (возможно legacy)
 * @param {any} Page - класс страницы
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderPage = async (name: string, Page: any) => {
  const app = document.getElementById("app") as HTMLElement
  app.innerHTML = ""

  const header = new Header(app)
  header.render()

  store.data.page = name

  const page = new Page(app)
  if (page.init !== undefined) {
    try {
      await page.init()
    } catch {
      logger.error("Не смог взять данные")
    }
  }
  await page.render()
}

/**
 * Функция для подключения всех страниц
 */
export const routerInit = () => {
  router.add("auth", async () => renderPage("auth", RegistrationEmail))
  router.add("registrationPassword", async () => renderPage("registrationPassword", RegistrationPassword))
  router.add("registrationApplicant", async () => renderPage("registrationApplicant", RegistrationUser))
  router.add("registrationEmployer", async () => renderPage("registrationEmployer", RegistrationCompany))
  router.add("login", async () => renderPage("login", Login))
  router.add("catalog", async () => renderPage("catalog", JobCatalog))
  router.add("", async () => renderPage("catalog", JobCatalog))
  router.add("vacancy", async () => renderPage("job", JobPage))
  router.add("createVacancy", async () => renderPage("createVacancy", VacancyEdit))
  router.add("vacancyEdit", async () => renderPage("vacancy_edit", VacancyEdit))
  router.add("resume", async () => renderPage("resume", ResumePage))
  router.add("resumeEdit", async () => renderPage("resumeEdit", ResumeEdit))
  router.add("resumeCatalog", async () => renderPage("resumeCatalog", ResumeCatalog))
}
