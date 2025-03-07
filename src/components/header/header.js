import {store, resetStore} from "../../store";
import './header.css'
import {router} from "../../router.js";


export class Header {
    #parent;
    #dropdownVisible = false;
    #loginButton;
    #logoutButton;
    #profileIcon;
    #dropdownItems;
    #logoLink;


    /**
     * Конструктор класса
     * @param parent {HTMLElement} - родительский элемент
     */
    constructor(parent) {
        this.#parent = parent;
    }

    get self() {
        return document.querySelector(".header")
    }

    /**
     * Очистка
     */
    remove = () => {
        this.self.remove();
    }

    /**
     * Обработчик клика на документе для закрытия дропдауна
     */
    handleDocumentClick = (e) => {
        const profileElement = this.self.querySelector(".header__profile");
        if (profileElement && !profileElement.contains(e.target) && this.#dropdownVisible) {
            this.toggleDropdown(false);
        }
    }

    /**
     * Переключение видимости дропдауна
     * @param {boolean|undefined} state - принудительное состояние (true - показать, false - скрыть)
     */
    toggleDropdown = (state = undefined) => {
        const dropdown = this.self.querySelector(".header__dropdown");
        if (!dropdown) return;

        if (state !== undefined) {
            this.#dropdownVisible = state;
        } else {
            this.#dropdownVisible = !this.#dropdownVisible;
        }

        dropdown.style.display = this.#dropdownVisible ? "block" : "none";
    }

    /**
     * Обработчики кнопок
     */
    addEventListeners = () => {
        this.#loginButton = this.self.querySelector(".header__login");
        this.#logoutButton = this.self.querySelector(".header__logout");
        this.#profileIcon = this.self.querySelector(".header__profile-icon");
        this.#dropdownItems = this.self.querySelectorAll(".header__dropdown__item");
        this.#logoLink = this.self.querySelector(".header__name");

        this.#logoLink.addEventListener("click", () => {
            router("catalog");
        });

        if (this.#loginButton) {
            this.#loginButton.addEventListener("click", () => {
                router("auth");
            });
        }

        if (this.#logoutButton) {
            this.#logoutButton.addEventListener("click", () => {
                router("catalog")
            });
        }

        if (this.#profileIcon) {
            this.#profileIcon.addEventListener("click", (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });
        }

        this.#dropdownItems.forEach(item => {
            if (item.classList.contains("header__dropdown__item--logout")) {
                item.addEventListener("click", () => {
                    this.toggleDropdown(false);
                    resetStore()
                    router("catalog");
                });
            } else {
                item.addEventListener("click", () => {
                    // тут пока заглушка
                    console.log("Clicked menu item:", item.textContent);
                    this.toggleDropdown(false);
                });
            }
        });

        document.addEventListener("click", this.handleDocumentClick);
    };

    /**
     * Рендеринг формы
     */
    render = () => {
        console.log("header render");
        console.log(store)
        // eslint-disable-next-line no-undef
        const template = Handlebars.templates["header/header"]
        this.#parent.insertAdjacentHTML(
            "beforeend",
            template(store)
        );
        this.addEventListeners();
    }
}