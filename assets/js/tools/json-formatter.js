import { copyText } from "../clipboard.js";
import { showToast } from "../toast.js";

const TEMPLATE = `
  <label class="field-label" for="json-input">JSON girdisi</label>
  <textarea class="input textarea" id="json-input" rows="10" spellcheck="false"></textarea>

  <div class="button-row">
    <button type="button" class="button button-primary" id="json-format">Biçimlendir</button>
    <button type="button" class="button" id="json-minify">Küçült</button>
    <button type="button" class="button" id="json-copy">Kopyala</button>
    <button type="button" class="button" id="json-clear">Temizle</button>
  </div>

  <p class="form-message" id="json-message" aria-live="polite"></p>

  <label class="field-label" for="json-output">Sonuç</label>
  <textarea class="input textarea" id="json-output" rows="10" spellcheck="false" readonly></textarea>
`;

export function mount(container, signal) {
    container.innerHTML = TEMPLATE;

    const input = container.querySelector("#json-input");
    const output = container.querySelector("#json-output");
    const message = container.querySelector("#json-message");
    const formatButton = container.querySelector("#json-format");
    const minifyButton = container.querySelector("#json-minify");
    const copyButton = container.querySelector("#json-copy");
    const clearButton = container.querySelector("#json-clear");

    function showMessage(text, stateClass = "") {
        message.textContent = text;
        message.className = `form-message ${stateClass}`;
    }

    function convert(indent) {
        if (input.value.trim() === "") {
            output.value = "";
            showMessage("Önce bir JSON metni gir.", "is-error");
            return;
        }

        try {
            const parsed = JSON.parse(input.value);
            output.value = JSON.stringify(parsed, null, indent);
            showMessage("✓ JSON geçerli.", "is-success");
        } catch (error) {
            output.value = "";
            showMessage(`✕ Geçersiz JSON: ${error.message}`, "is-error");
        }
    }

    formatButton.addEventListener("click", () => convert(2), { signal });
    minifyButton.addEventListener("click", () => convert(0), { signal });

    copyButton.addEventListener("click", () => {
        if (output.value.trim() === "") {
            showToast("Kopyalanacak sonuç yok.", "error");
            return;
        }

        copyText(output.value);
    }, { signal });

    clearButton.addEventListener("click", () => {
        input.value = "";
        output.value = "";
        showMessage("");
        input.focus();
    }, { signal });
}