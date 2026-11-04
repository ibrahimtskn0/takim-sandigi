import { createElement } from "./utils.js";

export async function renderTool(container, tool, signal) {
    const body = document.createElement("div");

    container.replaceChildren(
        createElement("h1", tool.name),
        createElement("p", tool.description),
        body
    );

    if (!tool.load) {
        return;
    }

    try {
        const module = await tool.load();

        if (signal.aborted) {
            return;
        }

        module.mount(body, signal);
    } catch (error) {
        console.error(error);
        body.replaceChildren(
            createElement("p", "Araç yüklenemedi. Sayfayı yenileyip tekrar dene.", "empty-state")
        );
    }
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