import { router } from './router';
import { api } from './api/api';
import { store } from './store';
import './form.sass';
import './variables.sass';
import { logger } from './utils/logger';
import { routerInit } from './routeInit';
import { emptyAuthResponse } from './api/empty';
import { activate } from './api/webSocket';

routerInit();

api.auth
    .auth()
    .then(async (user) => {
        logger.info(user);
        store.data.authorized = true;
        store.data.user = user;
        await activate();
        logger.info(store.data.user);
    })
    .catch(() => {
        store.data.authorized = false;
        store.data.user = emptyAuthResponse;
    })
    .finally(() => {
        router.go(window.location.pathname);
    });
