const URLS = ['./index.html'];
// index.html - html в бандлере
// assets - папка где хранится js и css

self.addEventListener('install', (event) => {
    console.log('SW: INSTALLED!');

    event.waitUntil(
        caches
            .open('MY-CACHE')
            .then((cache) => {
                return cache.addAll(URLS);
            })
            .catch((err) => {
                console.log(err);
                throw err;
            }),
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(async () => {
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
                console.log('SW ERROR');
            }
        } catch {
            console.log('NETWORK ERROR');
        }
        return new Response();
    });
});
