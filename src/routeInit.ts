import { JobCatalog } from './components/jobCatalog/jobCatalog';
import { Header } from './components/header/header';
import { store } from './store';
import { JobPage } from './components/jobPage/jobPage';
import { router } from './router';
import { logger } from './utils/logger';
import { RegistrationEmail } from './components/registrationEmail/registrationEmail';
import { RegistrationPassword } from './components/registrationPassword/registrationPassword';
import { Login } from './components/login/login';
import { RegistrationUser } from './components/registrationUser/registrationUser';
import { RegistrationCompany } from './components/registrationCompany/registrationCompany';
import { VacancyEdit } from './components/vacancyEdit/vacancyEdit';
import { ResumePage } from './components/resumePage/resumePage';
import { ResumeEdit } from './components/resumeEdit/resumeEdit';
import { ResumeCatalog } from './components/resumeCatalog/resumeCatalog';
import { ProfileUser } from './components/profileUser/profileUser';
import { ProfileCompany } from './components/profileCompany/profileCompany';
import { ProfileUserEdit } from './components/profileUserEdit/profileUserEdit';
import { ProfileCompanyEdit } from './components/profileCompanyEdit/profileCompanyEdit';
import { PollForm } from './components/pollForm/pollForm';
import { ReviewMock } from './api/mocks';
import { SuperTimer } from './iframeTimer';
import { emptyReview } from './api/empty';
import { PollStatistics } from './components/pollStatistics/pollStatistics';
import { api } from './api/api';

/**
 *
 * @param {string} name - название страницы (возможно legacy)
 * @param {any} Page - класс страницы
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderPage = async (name: string, Page: any) => {

    const app = document.getElementById('app') as HTMLElement;

    if (app.parentNode && !document.getElementById('review_frame')) {
        const frame = document.createElement('iframe')
        frame.id = 'review_frame'
        frame.src = 'http://localhost:8001/review'
        frame.hidden = true
        app.parentNode.appendChild(frame)
        SuperTimer.start(async () => {
            const frame = document.getElementById('review_frame') as HTMLIFrameElement
            if (frame) {
                if (!store.data.authorized) frame.hidden = true
                if (store.data.review.poll_id === 0 && store.data.authorized) {
                    try {
                        store.data.review = await api.poll.get()
                        frame.contentWindow?.postMessage(ReviewMock, '*');
                        frame.hidden = false
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        }, 1)
        window.addEventListener('message', async (event) => {
            if (event.data === 'CLOSE') {
                SuperTimer.stop()
                frame.hidden = true
            }
            if (event.data.poll_id && event.data.answer) {
                console.log("SEND REVIEW")
                try {
                    await api.poll.answer({
                        poll_id: event.data.poll_id,
                        answer: event.data.poll_id
                    })
                    store.data.review = emptyReview
                    frame.hidden = true
                } catch {
                    const frame = document.getElementById('review_frame') as HTMLIFrameElement
                    if (frame) {
                        frame.contentWindow?.postMessage("ERROR", '*');
                    }
                }
            }
            console.log("IFRAME DATA", event.data); // присланные данные
            console.log("IFRAME SOURCE", event.source); // ссылка на окно-отправитель сообщения
        });
    }

    store.data.page = name;

    const page = new Page(app);
    if (page.init !== undefined) {
        try {
            await page.init();
        } catch {
            logger.error('Не смог взять данные');
        }
    }

    app.innerHTML = '';

    const header = new Header(app);
    header.render();

    await page.render();
    document.title = store.data.page;
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderReview = async (name: string, Page: any) => {
    const app = document.getElementById('app') as HTMLElement;
    app.style = 'padding-top: 0px;'

    const page = new Page(app)
    if (page.init !== undefined) {
        try {
            await page.init()
        } catch {
            logger.error("Не смог взять данные")
        }
    }

    app.innerHTML = ""

    await page.render()
}

/**
 * Функция для подключения всех страниц
 */
export const routerInit = () => {
    router.add("auth", async () => renderPage("Авторизация", RegistrationEmail))
    router.add("registrationPassword", async () => renderPage("Регистрация", RegistrationPassword))
    router.add("registrationApplicant", async () => renderPage("Регистрация соискателя", RegistrationUser))
    router.add("registrationEmployer", async () => renderPage("Регистрация работадателя", RegistrationCompany))
    router.add("login", async () => renderPage("Логин", Login))
    router.add("catalog", async () => renderPage("Вакансии", JobCatalog))
    router.add("", async () => renderPage("Каталог вакансий", JobCatalog))
    router.add("vacancy", async () => renderPage("Страница вакансии", JobPage))
    router.add("createVacancy", async () => renderPage("Создание вакансии", VacancyEdit))
    router.add("vacancyEdit", async () => renderPage("Редактирование вакансии", VacancyEdit))
    router.add("resume", async () => renderPage("Резюме", ResumePage))
    router.add("resumeEdit", async () => renderPage("Редактирование резюме", ResumeEdit))
    router.add("createResume", async () => renderPage("Создание резюме", ResumeEdit))
    router.add("resumeCatalog", async () => renderPage("Каталог резюме", ResumeCatalog))
    router.add("profileUser", async () => renderPage("Профиль", ProfileUser))
    router.add("profileCompany", async () => renderPage("Профиль", ProfileCompany))
    router.add("profileUserEdit", async () => renderPage("Редактирование профиля", ProfileUserEdit))
    router.add("profileCompanyEdit", async () => renderPage("Редактирование профиля", ProfileCompanyEdit))
    router.add("review", async () => renderReview("Оценка сайта", PollForm))
    router.add("pollStatistics", async () => renderPage("Статистика опросов", PollStatistics))
}
