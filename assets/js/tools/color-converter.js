import { copyText } from "../clipboard.js";
import { showToast } from "../toast.js";

const DEFAULT_COLOR = "#3cc8c0";

function parseHex(value) {
    const match = value.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);

    if (!match) {
        return null;
    }

    let hex = match[1];

    if (hex.length === 3) {
        hex = [...hex].map((char) => char + char).join("");
    }

    return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
    };
}

function parseRgb(value) {
    const match = value.trim().match(/^(?:rgb\()?\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)?$/i);

    if (!match) {
        return null;
    }

    const [r, g, b] = match.slice(1).map(Number);

    if ([r, g, b].some((channel) => channel > 255)) {
        return null;
    }

    return { r, g, b };
}

function parseHsl(value) {
    const match = value.trim().match(/^(?:hsl\()?\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*\)?$/i);

    if (!match) {
        return null;
    }

    const [h, s, l] = match.slice(1).map(Number);

    if (h > 360 || s > 100 || l > 100) {
        return null;
    }

    return hslToRgb({ h, s, l });
}

function rgbToHex({ r, g, b }) {
    return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsl({ r, g, b }) {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const delta = max - min;
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;

    if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1));

        if (max === red) {
            h = ((green - blue) / delta) % 6;
        } else if (max === green) {
            h = (blue - red) / delta + 2;
        } else {
            h = (red - green) / delta + 4;
        }

        h *= 60;

        if (h < 0) {
            h += 360;
        }
    }

    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb({ h, s, l }) {
    const saturation = s / 100;
    const lightness = l / 100;
    const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lightness - chroma / 2;
    let rgb;

    if (h < 60) {
        rgb = [chroma, x, 0];
    } else if (h < 120) {
        rgb = [x, chroma, 0];
    } else if (h < 180) {
        rgb = [0, chroma, x];
    } else if (h < 240) {
        rgb = [0, x, chroma];
    } else if (h < 300) {
        rgb = [x, 0, chroma];
    } else {
        rgb = [chroma, 0, x];
    }

    const [r, g, b] = rgb.map((channel) => Math.round((channel + m) * 255));
    return { r, g, b };
}

function formatRgb({ r, g, b }) {
    return `rgb(${r}, ${g}, ${b})`;
}

function formatHsl({ h, s, l }) {
    return `hsl(${h}, ${s}%, ${l}%)`;
}

const FORMATS = {
    hex: { label: "HEX", parse: parseHex, example: "#3cc8c0" },
    rgb: { label: "RGB", parse: parseRgb, example: "rgb(60, 200, 192)" },
    hsl: { label: "HSL", parse: parseHsl, example: "hsl(177, 56%, 51%)" },
};

const TEMPLATE = `
  <div class="color-layout">
    <div class="color-swatch" id="color-swatch" role="img" aria-label="Renk önizlemesi"></div>

    <div>
      <label class="field-label" for="color-picker">Renk seç</label>
      <input class="color-input" type="color" id="color-picker">

      <label class="field-label" for="color-hex">HEX</label>
      <div class="input-row">
        <input class="input" id="color-hex" data-format="hex" spellcheck="false" autocomplete="off">
        <button type="button" class="button" data-copy="hex" aria-label="HEX değerini kopyala">Kopyala</button>
      </div>

      <label class="field-label" for="color-rgb">RGB</label>
      <div class="input-row">
        <input class="input" id="color-rgb" data-format="rgb" spellcheck="false" autocomplete="off">
        <button type="button" class="button" data-copy="rgb" aria-label="RGB değerini kopyala">Kopyala</button>
      </div>

      <label class="field-label" for="color-hsl">HSL</label>
      <div class="input-row">
        <input class="input" id="color-hsl" data-format="hsl" spellcheck="false" autocomplete="off">
        <button type="button" class="button" data-copy="hsl" aria-label="HSL değerini kopyala">Kopyala</button>
      </div>

      <p class="form-message" id="color-message" aria-live="polite"></p>
    </div>
  </div>
`;

export function mount(container, signal) {
    container.innerHTML = TEMPLATE;

    const swatch = container.querySelector("#color-swatch");
    const picker = container.querySelector("#color-picker");
    const message = container.querySelector("#color-message");
    const fields = {
        hex: container.querySelector("#color-hex"),
        rgb: container.querySelector("#color-rgb"),
        hsl: container.querySelector("#color-hsl"),
    };

    function showMessage(text, stateClass = "") {
        message.textContent = text;
        message.className = `form-message ${stateClass}`;
    }

    function setColor(rgb, source) {
        const hex = rgbToHex(rgb);
        const values = {
            hex,
            rgb: formatRgb(rgb),
            hsl: formatHsl(rgbToHsl(rgb)),
        };

        for (const [format, field] of Object.entries(fields)) {
            if (format !== source) {
                field.value = values[format];
            }

            field.removeAttribute("aria-invalid");
        }

        picker.value = hex;
        swatch.style.background = hex;
        showMessage("");
    }

    container.addEventListener("input", (event) => {
        const target = event.target;

        if (target === picker) {
            setColor(parseHex(picker.value), "picker");
            return;
        }

        const format = target.dataset.format;

        if (!format) {
            return;
        }

        const { label, parse, example } = FORMATS[format];
        const rgb = parse(target.value);

        if (!rgb) {
            target.setAttribute("aria-invalid", "true");
            showMessage(`✕ Geçersiz ${label} değeri. Örnek: ${example}`, "is-error");
            return;
        }

        setColor(rgb, format);
    }, { signal });

    container.addEventListener("click", (event) => {
        const button = event.target.closest("[data-copy]");

        if (!button) {
            return;
        }

        const field = fields[button.dataset.copy];

        if (field.getAttribute("aria-invalid") === "true") {
            showToast("Önce geçerli bir değer gir.", "error");
            return;
        }

        copyText(field.value);
    }, { signal });

    setColor(parseHex(DEFAULT_COLOR), null);
}