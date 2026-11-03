import { getItem, setItem } from "./storage.js";

const STORAGE_KEY = "takim-sandigi-theme";
const DEFAULT_THEME = "dark";

function getSavedTheme() {
    const savedTheme = getItem(STORAGE_KEY);
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : DEFAULT_THEME;
}

function applyTheme(theme, button) {
    document.documentElement.dataset.theme = theme;
    button.textContent = theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç";
}

export function initTheme() {
    const button = document.querySelector("#theme-toggle");
    applyTheme(getSavedTheme(), button);

    button.addEventListener("click", () => {
        const currentTheme = document.documentElement.dataset.theme;
        const nextTheme = currentTheme === "dark" ? "light" : "dark";

        applyTheme(nextTheme, button);
        setItem(STORAGE_KEY, nextTheme);
    });
}