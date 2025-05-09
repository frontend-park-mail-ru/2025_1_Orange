import logger from './src/utils/logger';

const URLS = ['/index.html', '/assets'];
// index.html - html в бандлере
// assets - папка где хранится js и css

this.addEventListener('install', (event) => {
    logger.info('SW: INSTALLED!');

    event.waitUntil(
        caches
            .open('MY-CACHE')
            .then((cache) => {
                return cache.addAll(URLS);
            })
            .catch((err) => {
                logger.info(err);
                throw err;
            }),
    );
});

this.addEventListener('fetch', (event) => {
    event.waitUntil(async () => {
        const request = new URL(event.request.url);
        // Проверяем, есть ли запрашиваемый ресурс в кэше
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Если запрос не найден в кэше, выполняем его и сохраняем результат в кэш
        try {
            const response = await fetch(request);
            if (response.status !== 200) {
                return response; // Если не 200 не сохраняем
            }
            try {
                const cache = await caches.open('MY-CACHE');
                cache.put(request, response);
                return response;
            } catch {
                logger.info('SW ERROR');
            }
        } catch {
            logger.info('NETWORK ERROR');
        }
    });
});
