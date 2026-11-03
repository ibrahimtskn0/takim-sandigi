import { updateActiveLink } from "./navigation.js";
import { tools } from "./tools-data.js";
import { renderHome } from "./home.js";
import { renderNotFound, renderTool } from "./views.js";

const APP_NAME = "Takım Sandığı";

function getCurrentPath() {
    return window.location.hash.slice(1) || "/";
}

function renderRoute(main) {
    const path = getCurrentPath();
    const tool = tools.find((item) => `/${item.id}` === path);

    if (path === "/") {
        renderHome(main);
        document.title = APP_NAME;
    } else if (tool) {
        renderTool(main, tool);
        document.title = `${tool.name} | ${APP_NAME}`;
    } else {
        renderNotFound(main);
        document.title = `Sayfa bulunamadı | ${APP_NAME}`;
    }

    updateActiveLink(path);
}

export function initRouter() {
    const main = document.querySelector("#main-content");

    renderRoute(main);

    window.addEventListener("hashchange", () => {
        renderRoute(main);
        window.scrollTo(0, 0);
        main.focus();
    });
}