class IframeTimer {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    #timer: any = null;

    /**
     * Старт таймера
     * @param {function} f - функция которую будет вызывать таймер
     * @param {number} minutes - раз во сколько минут будет вызывать
     */
    start = (f: () => void, minutes : number) => {
        if (this.#timer) clearInterval(this.#timer) 
        this.#timer = setInterval(() => f(), 1000 * 60 * minutes);
    }

    stop = () => {
        clearInterval(this.#timer)
    }
}

export const SuperTimer = new IframeTimer()