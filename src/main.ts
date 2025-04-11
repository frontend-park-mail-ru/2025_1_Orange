import { router } from './router';
import { api } from './api/api';
import { store } from './store';
import './form.sass';
import './variables.sass';
import { logger } from './utils/logger';
import { routerInit } from './routeInit';
import { applicantMock, userApplicantMock, userEmployerMock } from './api/mocks';
import { emptyUser } from './api/empty';

routerInit();

api.auth
    .auth()
    .then((user) => {
        logger.info(user);
        store.data.authorized = true;
        store.data.user = user;
    })
    .catch(() => {
        //store.data.authorized = false;
        //store.data.user = emptyUser;
        store.data.authorized = true;
        store.data.user = userApplicantMock;
    })
    .finally(() => {
        router.go(window.location.pathname);
    });
