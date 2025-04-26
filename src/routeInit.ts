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

/**
 *
 * @param {string} name - название страницы (возможно legacy)
 * @param {any} Page - класс страницы
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderPage = async (name: string, Page: any) => {

    const app = document.getElementById('app') as HTMLElement;

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

    await page.render();
};

/**
 * Функция для подключения всех страниц
 */
export const routerInit = () => {
    router.add('auth', async () => renderPage('Авторизация', RegistrationEmail));
    router.add('registrationPassword', async () =>
        renderPage('Регистрация', RegistrationPassword),
    );
    router.add('registrationApplicant', async () =>
        renderPage('Регистрация соискателя', RegistrationUser),
    );
    router.add('registrationEmployer', async () =>
        renderPage('Регистрация работадателя', RegistrationCompany),
    );
    router.add('login', async () => renderPage('Логин', Login));
    router.add('catalog', async () => renderPage('Вакансии', JobCatalog));
    router.add('', async () => renderPage('Каталог вакансий', JobCatalog));
    router.add('vacancy', async () => renderPage('Страница вакансии', JobPage));
    router.add('createVacancy', async () => renderPage('Создание вакансии', VacancyEdit));
    router.add('vacancyEdit', async () => renderPage('Редактирование вакансии', VacancyEdit));
    router.add('resume', async () => renderPage('Резюме', ResumePage));
    router.add('resumeEdit', async () => renderPage('Редактирование резюме', ResumeEdit));
    router.add('createResume', async () => renderPage('Создание резюме', ResumeEdit));
    router.add('resumeCatalog', async () => renderPage('Каталог резюме', ResumeCatalog));
    router.add('profileUser', async () => renderPage('Профиль', ProfileUser));
    router.add('profileCompany', async () => renderPage('Профиль', ProfileCompany));
    router.add('profileUserEdit', async () =>
        renderPage('Редактирование профиля', ProfileUserEdit),
    );
    router.add('profileCompanyEdit', async () =>
        renderPage('Редактирование профиля', ProfileCompanyEdit),
    );
    router.add('review', async () =>
        renderReview('Оценка сайта', PollForm),
    );
};
