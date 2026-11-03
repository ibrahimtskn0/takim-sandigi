import { tools } from "./tools-data.js";
import { createElement } from "./utils.js";

function normalize(text) {
    return text.toLocaleLowerCase("tr").trim();
}

function createToolCard(tool) {
    const card = createElement("a", "", "tool-card");
    card.href = `#/${tool.id}`;
    card.replaceChildren(
        createElement("h3", tool.name),
        createElement("p", tool.description)
    )
    return card;
}

function renderResults(results, status, query) {
    const search = normalize(query);
    const matches = tools.filter((tool) => normalize(tool.name).includes(search));

    status.textContent = `${matches.length} araç bulundu.`;

    if (matches.length === 0) {
        results.replaceChildren(
            createElement("p", "Bu aramayla eşleşen araç yok.", "empty-state")
        );
        return;
    }

    const categories = [...new Set(matches.map((tool) => tool.category))];

    const sections = categories.map((category) => {
        const section = document.createElement("section");
        const grid = createElement("div", "", "tool-grid");
        const cards = matches
            .filter((tool) => tool.category === category)
            .map((tool) => createToolCard(tool));

        grid.append(...cards);
        section.append(createElement("h2", category), grid);
        return section;
    });

    results.replaceChildren(...sections);
}

export function renderHome(container) {
    const label = createElement("label", "Araç ara", "field-label");
    label.htmlFor = "tool-search";

    const input = createElement("input", "", "input");
    input.type = "search";
    input.id = "tool-search";
    input.placeholder = "Örneğin: JSON";
    input.autocomplete = "off";

    const status = createElement("p", "", "search-status");
    status.setAttribute("aria-live", "polite");

    const results = document.createElement("div");

    input.addEventListener("input", () => {
        renderResults(results, status, input.value);
    });

    container.replaceChildren(
        createElement("h1", "Takım Sandığı"),
        createElement("p", "Pratik araçlar tek yerde, ücretsiz ve reklamsız."),
        label,
        input,
        status,
        results
    );

    renderResults(results, status, "");
}