import { copyText } from "../clipboard.js";
import { showToast } from "../toast.js";

const TEMPLATE = `
  <label class="field-label" for="text-input">Metin</label>
  <textarea class="input textarea" id="text-input" rows="10"></textarea>

  <dl class="stats">
    <div><dt>Kelime</dt><dd id="stat-words">0</dd></div>
    <div><dt>Karakter</dt><dd id="stat-chars">0</dd></div>
    <div><dt>Boşluksuz karakter</dt><dd id="stat-chars-no-space">0</dd></div>
    <div><dt>Satır</dt><dd id="stat-lines">0</dd></div>
  </dl>

  <div class="button-row">
    <button type="button" class="button" data-action="upper">BÜYÜK HARF</button>
    <button type="button" class="button" data-action="lower">küçük harf</button>
    <button type="button" class="button" data-action="title">Başlık Biçimi</button>
    <button type="button" class="button" data-action="clean">Boşlukları temizle</button>
    <button type="button" class="button button-primary" data-action="copy">Kopyala</button>
    <button type="button" class="button" data-action="clear">Temizle</button>
  </div>
`;

function countWords(text) {
    const words = text.trim().split(/\s+/);
    return words[0] === "" ? 0 : words.length;
}

function countChars(text) {
    return [...text].length;
}

function countLines(text) {
    return text === "" ? 0 : text.split("\n").length;
}

function toTitleCase(text) {
    return text
        .toLocaleLowerCase("tr")
        .replace(/(^|\s)(\S)/g, (match, space, letter) => space + letter.toLocaleUpperCase("tr"));
}

function cleanSpaces(text) {
    return text
        .split("\n")
        .map((line) => line.trim().replace(/\s+/g, " "))
        .join("\n")
        .trim();
}

// `/\s+/` Bir veya daha fazla boşluk, sekme ya da satır sonu anlamına gelir.
// [...text].lenght Metni karakterlere ayırıp sayar. Bazı emojiler 2 karakter sayıldığı için düz text.lenght kullanmadık. Kullanılan
// yöntem Unicode farkındalığı yaratıyor.
// (^|\s)(\S) Metnin başındaki veya boşluktan sonra gelen ilk harfi yakalar ve büyütür.
// TRANSFORMS Düğmenin data-action değerini doğru fonksiyona bağlayan bir tablodur. Böylece uzun bir if zinciri yazmayız.

const TRANSFORMS = {
    upper: (text) => text.toLocaleUpperCase("tr"),
    lower: (text) => text.toLocaleLowerCase("tr"),
    title: toTitleCase,
    clean: cleanSpaces,
};

export function mount(container, signal) {
    container.innerHTML = TEMPLATE;

    const input = container.querySelector("#text-input");
    const words = container.querySelector("#stat-words");
    const chars = container.querySelector("#stat-chars");
    const chrasNoSpace = container.querySelector("#stat-chars-no-space");
    const lines = container.querySelector("#stat-lines");

    function updateStats() {
        const text = input.value;
        words.textContent = countWords(text);
        chars.textContent = countChars(text);
        chrasNoSpace.textContent = countChars(text.replace(/\s/g, ""));
        lines.textContent = countLines(text);
    }

    input.addEventListener("input", updateStats, { signal });

    container.addEventListener("click", (e) => {
        const button = e.target.closest("[data-action]");

        if (!button) {
            return;
        }

        const action = button.dataset.action;

        if (action === "copy") {
            if (input.value === "") {
                showToast("Kopyalanacak metin yok.", "error");
                return;
            }

            copyText(input.value);
            return;
        }

        if (action === "clear") {
            input.value = "";
            updateStats();
            input.focus();
            return;
        }

        if (input.value.trim() === "") {
            showToast("Önce bir metin yaz.", "error");
            return;
        }

        input.value = TRANSFORMS[action](input.value);
        updateStats();
    }, { signal });

    updateStats();
}