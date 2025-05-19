/**
 * Форматирование даты для использование в input
 * @param {Date} date - дата которую надо отформатировать
 * @returns {string}
 */
export const toInputDate = (date: Date) => {
    const year = date.getFullYear();

    // Месяцы в JS начинаются с 0 (январь = 0), поэтому добавляем +1
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};
