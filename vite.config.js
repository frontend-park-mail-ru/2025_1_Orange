import { defineConfig } from 'vite';
import handlebarsPlugin from '@yoichiro/vite-plugin-handlebars';
import { resolve } from 'path';
import babel from 'vite-plugin-babel';
import path from 'path';

export default defineConfig({
    plugins: [
        babel(),
        handlebarsPlugin({
            templateFileExtension: '.handlebars',
            // eslint-disable-next-line no-undef
            partialsDirectoryPath: path.resolve(__dirname, 'src'),
        }),
    ],
    server: {
        port: 8001,
        open: true,
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
