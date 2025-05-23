import { router } from './router';
import { api } from './api/api';
import { store } from './store';
import './form.sass';
import './variables.sass';
import { logger } from './utils/logger';
import { routerInit } from './routeInit';
import { emptyAuthResponse } from './api/empty';

routerInit();

api.auth
    .auth()
    .then((user) => {
        logger.info(user);
        store.data.authorized = true;
        store.data.user = user;
        logger.info(store.data.user);
    })
    .catch(() => {
        store.data.authorized = false;
        store.data.user = emptyAuthResponse;
    })
    .finally(() => {
        router.go(window.location.pathname);
    });

navigator.serviceWorker
    .register('/sw.js', { scope: '/' })
    .then(function (registration) {
        // Registration was successful
        logger.info('SW registration OK:', registration);
    })
    .catch(function (err) {
        // registration failed :(
        logger.info('SW registration FAIL:', err);
    });
