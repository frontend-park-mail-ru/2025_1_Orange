import { Auth } from './components/auth/auth.js';
import { JobCatalog } from './components/jobCatalog/jobCatalog.js';
import { Header } from './components/header/header.js';
import { store } from './store.js';
import { logger } from './utils/logger.js';

/**
 * Удаляет текущую страницу и рендерит указанную страницу.
 * @param {string} page - какую страницу рендерить
 */
export const router = async (page = 'catalog') => {
    logger.info('Router called with route: ', page);
    const app = document.getElementById('app') as HTMLElement;
    app.innerHTML = '';
    const header = new Header(app);
    header.render();
    if (page === 'auth') {
        store.page = 'auth';
        const authPage = new Auth(app);
        authPage.render();
    }
    if (page === 'catalog') {
        store.page = 'catalog';
        const catalogPage = new JobCatalog(app);
        await catalogPage.render();
    }
};
