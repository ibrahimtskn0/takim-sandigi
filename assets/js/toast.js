import { createElement } from "./utils.js";

export function showToast(message, type = "success") {
    const container = document.querySelector("#toast-container");
    const icon = type === "error" ? "✕" : "✓";
    const toast = createElement("div", `${icon} ${message}`, `toast toast-${type}`);

    container.append(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}