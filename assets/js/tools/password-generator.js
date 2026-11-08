import { copyText } from "../clipboard.js";
import { showToast } from "../toast.js";

const GROUPS = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()-_=+[]{};:,.?/",
};

function randomInt(max) {
    const limit = Math.floor(2 ** 32 / max) * max;
    const buffer = new Uint32Array(1);

    do {
        crypto.getRandomValues(buffer);
    } while (buffer[0] >= limit);

    return buffer[0] % max;
}

function pick(chars) {
    return chars[randomInt(chars.length)];
}

function shuffle(items) {
    for (let i = items.length - 1; i > 0; i--) {
        const j = randomInt(i + 1);
        [items[i], items[j]] = [items[j], items[i]];
    }

    return items;
}

function generatePassword(length, selectedGroups) {
    const allChars = selectedGroups.join("");
    const chars = selectedGroups.map(pick);

    while (chars.length < length) {
        chars.push(pick(allChars));
    }

    return shuffle(chars).join("");
}

function getStrengthLabel(bits) {
    if (bits < 60) {
        return "Zayıf";
    }

    if (bits < 90) {
        return "Orta";
    }

    return "Güçlü";
}

const TEMPLATE = `
  <div class="narrow">
    <label class="field-label" for="password-output">Şifre</label>
    <input class="input password-output" id="password-output" type="text" readonly spellcheck="false" autocomplete="off">
    <p class="form-message" id="password-message" aria-live="polite"></p>

    <label class="field-label" for="password-length">Uzunluk: <output id="password-length-value"></output></label>
    <input class="range-input" type="range" id="password-length" min="8" max="64" value="16">

    <fieldset class="option-group">
      <legend class="field-label">Karakter türleri</legend>
      <label class="checkbox"><input type="checkbox" name="upper" checked> Büyük harf (A-Z)</label>
      <label class="checkbox"><input type="checkbox" name="lower" checked> Küçük harf (a-z)</label>
      <label class="checkbox"><input type="checkbox" name="numbers" checked> Sayı (0-9)</label>
      <label class="checkbox"><input type="checkbox" name="symbols" checked> Sembol (!@#...)</label>
    </fieldset>

    <div class="button-row">
      <button type="button" class="button button-primary" id="password-generate">Yeni şifre oluştur</button>
      <button type="button" class="button" id="password-copy">Kopyala</button>
    </div>
  </div>
`;

export function mount(container, signal) {
    container.innerHTML = TEMPLATE;

    const output = container.querySelector("#password-output");
    const message = container.querySelector("#password-message");
    const length = container.querySelector("#password-length");
    const lengthValue = container.querySelector("#password-length-value");
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const generateButton = container.querySelector("#password-generate");
    const copyButton = container.querySelector("#password-copy");

    function showMessage(text, stateClass = "") {
        message.textContent = text;
        message.className = `form-message ${stateClass}`;
    }

    function generate() {
        lengthValue.textContent = length.value;

        const selectedGroups = [...checkboxes]
            .filter((box) => box.checked)
            .map((box) => GROUPS[box.name]);

        if (selectedGroups.length === 0) {
            output.value = "";
            showMessage("✕ En az bir karakter türü seç.", "is-error");
            return;
        }

        const passwordLength = Number(length.value);
        output.value = generatePassword(passwordLength, selectedGroups);

        const poolSize = selectedGroups.join("").length;
        const bits = Math.round(passwordLength * Math.log2(poolSize));
        showMessage(`Güç: ${getStrengthLabel(bits)} (yaklaşık ${bits} bit)`);
    }

    container.addEventListener("input", generate, { signal });
    generateButton.addEventListener("click", generate, { signal });

    copyButton.addEventListener("click", () => {
        if (output.value === "") {
            showToast("Kopyalanacak şifre yok.", "error");
            return;
        }

        copyText(output.value);
    }, { signal });

    generate();
}