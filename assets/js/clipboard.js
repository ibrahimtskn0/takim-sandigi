import { showToast } from "./toast.js";

export async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast("Panoya kopyalandı.");
    } catch {
        showToast("Kopyalanamadı. Metni elle seçip kopyala.", "error");
    }
}