import { defineConfig } from 'vite';
import handlebarsPlugin from '@yoichiro/vite-plugin-handlebars';
import { resolve } from 'path';
import babel from 'vite-plugin-babel';
import path from 'path';
import ImageMinimizerPlugin from 'vite-plugin-imagemin';
//import { analyzer } from 'vite-bundle-analyzer'

export default defineConfig({
    plugins: [
        //analyzer(),
        babel(),
        ImageMinimizerPlugin({
            gifsicle: { optimizationLevel: 3 },
            mozjpeg: { quality: 75 },
            pngquant: { quality: 0.6, speed: 4 },
            svgo: {
                plugins: [{ removeViewBox: false }],
            },
        }),
        handlebarsPlugin({
            templateFileExtension: '.handlebars',
            // eslint-disable-next-line no-undef
            partialsDirectoryPath: path.resolve(__dirname, 'src'),
            optimizePartialRegistration: true,
        }),
    ],
    server: {
        port: 80,
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
    build: {
        target: 'es2015',
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Можно было не делать логгер :)
            },
        },
        cssMinify: true,
    },
    optimizeDeps: {
        include: ['handlebars/runtime'],
    },
});
