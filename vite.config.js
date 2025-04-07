import { defineConfig } from 'vite';
import handlebarsPlugin from '@yoichiro/vite-plugin-handlebars';
import { resolve } from 'path';
import babel from 'vite-plugin-babel';

export default defineConfig({
    plugins: [
        babel(),
        handlebarsPlugin({
            templateFileExtension: '.handlebars',
        }),
    ],
    server: {
        port: 8001, // Порт сервера
        open: true, // Автоматически открывать браузер
    },
    css: {
        preprocessorOptions: {
            sass: {
                // eslint-disable-next-line no-undef
                includePaths: [resolve(__dirname, 'src')],
            },
        },
    },
});
