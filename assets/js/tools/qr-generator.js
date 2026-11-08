import { showToast } from "../toast.js";

let libraryPromise = null;

function loadLibrary() {
    if (!libraryPromise) {
        libraryPromise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "assets/vendor/qrcode.js";
            script.onload = () => resolve(window.qrcode);
            script.onerror = () => {
                libraryPromise = null;
                reject(new Error("QR kütüphanesi yüklenemedi."));
            };
            document.head.append(script);
        });
    }

    return libraryPromise;
}

const TEMPLATE = `
  <label class="field-label" for="qr-input">Metin veya bağlantı</label>
  <textarea class="input textarea" id="qr-input" rows="4" spellcheck="false" placeholder="https://..."></textarea>

  <label class="field-label" for="qr-size">Boyut</label>
  <select class="input" id="qr-size">
    <option value="4">Küçük</option>
    <option value="8" selected>Orta</option>
    <option value="12">Büyük</option>
  </select>

  <p class="form-message" id="qr-message" aria-live="polite"></p>

  <div class="qr-preview" id="qr-preview" hidden>
    <canvas id="qr-canvas" role="img" aria-label="Oluşturulan QR kod"></canvas>
    <p class="qr-content">İçerik: <span id="qr-content-text"></span></p>
  </div>

  <div class="button-row">
    <button type="button" class="button button-primary" id="qr-download">PNG indir</button>
    <button type="button" class="button" id="qr-clear">Temizle</button>
  </div>
`;

export async function mount(container, signal) {
    container.innerHTML = TEMPLATE;

    const input = container.querySelector("#qr-input");
    const size = container.querySelector("#qr-size");
    const message = container.querySelector("#qr-message");
    const preview = container.querySelector("#qr-preview");
    const canvas = container.querySelector("#qr-canvas");
    const contentText = container.querySelector("#qr-content-text");
    const downloadButton = container.querySelector("#qr-download");
    const clearButton = container.querySelector("#qr-clear");

    function showMessage(text, stateClass = "") {
        message.textContent = text;
        message.className = `form-message ${stateClass}`;
    }

    let qrcode;

    try {
        qrcode = await loadLibrary();
    } catch {
        showMessage("✕ QR kütüphanesi yüklenemedi. Sayfayı yenileyip tekrar dene.", "is-error");
        return;
    }

    if (signal.aborted) {
        return;
    }

    qrcode.stringToBytes = qrcode.stringToBytesFuncs["UTF-8"];

    function draw(qr, scale) {
        const modules = qr.getModuleCount();
        const quietZone = 4;
        const pixelSize = (modules + quietZone * 2) * scale;
        const context = canvas.getContext("2d");

        canvas.width = pixelSize;
        canvas.height = pixelSize;

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, pixelSize, pixelSize);
        context.fillStyle = "#000000";

        for (let row = 0; row < modules; row++) {
            for (let col = 0; col < modules; col++) {
                if (qr.isDark(row, col)) {
                    context.fillRect((col + quietZone) * scale, (row + quietZone) * scale, scale, scale);
                }
            }
        }
    }

    function update() {
        const text = input.value;

        if (text.trim() === "") {
            preview.hidden = true;
            showMessage("QR kod için metin veya bağlantı gir.");
            return;
        }

        try {
            const qr = qrcode(0, "M");
            qr.addData(text);
            qr.make();
            draw(qr, Number(size.value));
            contentText.textContent = text;
            preview.hidden = false;
            showMessage("");
        } catch {
            preview.hidden = true;
            showMessage("✕ Bu metin bir QR koda sığmayacak kadar uzun.", "is-error");
        }
    }

    container.addEventListener("input", update, { signal });

    downloadButton.addEventListener("click", () => {
        if (preview.hidden) {
            showToast("İndirilecek QR kod yok.", "error");
            return;
        }

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "takim-sandigi-qr.png";
        link.click();
    }, { signal });

    clearButton.addEventListener("click", () => {
        input.value = "";
        update();
        input.focus();
    }, { signal });

    update();
}