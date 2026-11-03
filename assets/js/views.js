import { createElement } from "./utils.js";

export function renderTool(container, tool) {
    container.replaceChildren(
        createElement("h1", tool.name),
        createElement("p", tool.description)
    );
}

export function renderNotFound(container) {
    const link = createElement("a", "Ana Sayfaya Dön");
    link.href = `#/`;
    container.replaceChildren(
        createElement("h1", "Sayfa bulunamadı."),
        createElement("p", "Aradığın sayfa aslında yok."),
        link
    );
}