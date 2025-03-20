import { router } from './router';
import { Api } from './api/api';
import { store } from './store';
import './style.css';
import { logger } from './utils/logger';

const api = new Api();
api.auth()
    .then((user) => {
        logger.info(user);
        if (user.email !== undefined) {
            store.user = user;
            store.user.authenticated = true;
        }
    })
    .catch(() => {
        store.user.authenticated = false;
    })
    .finally(() => {
        router();
    });
