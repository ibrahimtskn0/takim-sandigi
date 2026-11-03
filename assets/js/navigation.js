import { tools } from "./tools-data.js";
import { createElement } from "./utils.js";

export function renderNavigation() {
    const list = document.querySelector("#nav-list");

    const items = tools.map((tool) => {
        const item = document.createElement("li");
        const link = createElement("a", tool.name, "nav-link");
        link.href = `#/${tool.id}`;
        item.append(link);
        return item;
    });

    list.replaceChildren(...items);
}

export function updateActiveLink(path) {
    document.querySelectorAll(".nav-link").forEach((link) => {
        if (link.getAttribute("href") === `#${path}`) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}