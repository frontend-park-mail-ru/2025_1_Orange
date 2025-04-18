import { logger } from "./utils/logger";

export function customMessage(
    field: HTMLInputElement | HTMLSelectElement,
    inputTranslation: Record<string, string>,
): string {
    const validity = field.validity;
    if (validity.valueMissing) {
        return `Заполните поле ${inputTranslation[field.name]}`;
    }
    if (validity.patternMismatch) {
        return field.title || `${inputTranslation[field.name]}: Неверный формат данных`;
    }
    if (validity.tooLong && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) {
        return `${inputTranslation[field.name]}: Слишком много данных (максимум ${field.maxLength})`;
    }
    if (validity.tooShort && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) {
        return `${inputTranslation[field.name]}: Слишком мало данных (минимум ${field.minLength})`;
    }
    if (validity.rangeOverflow && field instanceof HTMLInputElement) {
        return `${inputTranslation[field.name]}: Слишком большое значение (максимум ${field.max})`;
    }
    if (validity.rangeUnderflow && field instanceof HTMLInputElement) {
        return `${inputTranslation[field.name]}: Слишком маленькое значение (минимум ${field.min})`;
    }
    // Для почты и сайта
    if (validity.typeMismatch) {
        return `${inputTranslation[field.name]}: Неверный тип данных`;
    }
    return `${inputTranslation[field.name]}: ${field.validationMessage}`;
}

export function fieldValidate(
    field: HTMLInputElement | HTMLSelectElement,
    inputTranslation: Record<string, string>,
): boolean {
    const error = field.closest('fieldset')?.querySelector('[class$="__error"]') as HTMLElement;
    logger.info(error)
    field.classList.remove('error');
    field.classList.remove('valid');
    if (!field.validity.valid) {
        logger.info(field);
        if (document.activeElement === field && field.value !== '' && field.value !== '0')
            field.classList.add('error');
        if (error) {
            error.textContent = customMessage(field, inputTranslation);
            error.style.display = 'block';
        }
        return false;
    }
    if (field.validity.valid) field.classList.add('valid');
    return true;
}

export function formValidate(
    form: HTMLFormElement,
    element: HTMLElement,
    errorClass: string,
    inputTranslation: Record<string, string>,
): boolean {
    let fieldset = element.closest('fieldset') as HTMLFieldSetElement;
    if (element.tagName === 'FORM') fieldset = element as HTMLFieldSetElement;
    if (fieldset) {
        const errorElement = fieldset.querySelector(errorClass) as HTMLElement;

        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';

            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)) {
                if (!fieldValidate(element as HTMLInputElement, inputTranslation)) {
                    return false;
                }
            }

            const fields = fieldset.querySelectorAll('input, select, textarea') as unknown as Array<
                HTMLInputElement | HTMLSelectElement
            >;

            let valid = true;

            fields.forEach((field) => {
                if (valid && !fieldValidate(field, inputTranslation)) {
                    valid = false;
                }
            });
            return valid;
        }
    }
    return false;
}
