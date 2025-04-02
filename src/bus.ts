class EventBus {
    #listeners: Record<string, Array<() => void>> = {}
   
    /**
     * Регистрирует события и листнеров
     * 
     * @param {string} event - название события
     * @param {Function} listener - функция которая будет вызываться
     */
    on = (event: string, listener: () => void) => {
        // Если нету такого события (1 листнер), 
        // то создаём пустой список и только потом добавляем его
        if (!this.#listeners[event]) {
            this.#listeners[event] = []
        }
        this.#listeners[event].push(listener)
    }
   
    /**
     * Отвязываем слушателя от события - обычно когда удаляем элемент
     * 
     * @param {string} event - название события
     * @param {Function} listener - функция которая будет вызываться
     * (уже не будет :( )
     */
    off = (event: string, listener: () => void) => {
        // Тут проверка если мы захотим отвязать несуществующее событие
      if (this.#listeners[event]) {
        // Тут очень умный фильтр: если нужный слушатель есть, то он его уберёт, 
        // а если его нету то ничего не произойдёт
        this.#listeners[event] = this.#listeners[event].filter(x => x !== listener)
      }
    }
   
    /**
     * Вываем всех слушателей события
     * 
     * @param {string} - событие которые вызываем
     */
    emit = (event: string) => {
      if (this.#listeners[event]) {
        this.#listeners[event].forEach((listener) => listener())
      }
    }
  }

export const Bus = new EventBus()