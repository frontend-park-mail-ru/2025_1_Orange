import { Api } from './api';
import { Static } from './interfaces';

export class FileService {
    readonly #api: Api;

    constructor(api: Api) {
        this.#api = api;
    }

    /**
     * Загрузка файла
     * @param {File} file - файл на отправку
     * @returns {Promise<Static>}
     */
    async upload(file: File): Promise<Static> {
        const formData = new FormData();
        formData.append('file', file);

        // Здесь предполагается, что ваша библиотека поддерживает отправку FormData
        return this.#api.request('/upload', 'POST', formData, 'multipart/form-data');
    }
}
