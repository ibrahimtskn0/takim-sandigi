import { copyText } from "../clipboard.js"

const DEFAULTS = {
  color1: "#3cc8c0",
  stop1: "0",
  color2: "#d9a441",
  stop2: "100",
  angle: "90"
}

const TEMPLATE = `
  <div class="gradient-preview" id="gradient-preview" role="img" aria-label="Gradient önizlemesi"></div>

  <div class="gradient-controls">
    <div>
      <label class="field-label" for="gradient-color1">1. renk</label>
      <input class="color-input" type="color" id="gradient-color1">
    </div>
    <div>
      <label class="field-label" for="gradient-stop1">1. renk konumu: <output id="gradient-stop1-value"></output></label>
      <input class="range-input" type="range" id="gradient-stop1" min="0" max="100">
    </div>
    <div>
      <label class="field-label" for="gradient-color2">2. renk</label>
      <input class="color-input" type="color" id="gradient-color2">
    </div>
    <div>
      <label class="field-label" for="gradient-stop2">2. renk konumu: <output id="gradient-stop2-value"></output></label>
      <input class="range-input" type="range" id="gradient-stop2" min="0" max="100">
    </div>
    <div>
      <label class="field-label" for="gradient-angle">Açı: <output id="gradient-angle-value"></output></label>
      <input class="range-input" type="range" id="gradient-angle" min="0" max="360">
    </div>
  </div>

  <label class="field-label" for="gradient-code">CSS kodu</label>
  <textarea class="input textarea" id="gradient-code" rows="3" spellcheck="false" readonly></textarea>

  <div class="button-row">
    <button type="button" class="button button-primary" id="gradient-copy">Kodu kopyala</button>
    <button type="button" class="button" id="gradient-reset">Sıfırla</button>
  </div>
`;

export function mount(container, signal) {
  container.innerHTML = TEMPLATE;

  const preview = container.querySelector("#gradient-preview");
  const code = container.querySelector("#gradient-code");
  const color1 = container.querySelector("#gradient-color1");
  const stop1 = container.querySelector("#gradient-stop1");
  const color2 = container.querySelector("#gradient-color2");
  const stop2 = container.querySelector("#gradient-stop2");
  const angle = container.querySelector("#gradient-angle");
  const stop1Value = container.querySelector("#gradient-stop1-value");
  const stop2Value = container.querySelector("#gradient-stop2-value");
  const angleValue = container.querySelector("#gradient-angle-value");
  const copyButton = container.querySelector("#gradient-copy");
  const resetButton = container.querySelector("#gradient-reset");

  function update() {
    const gradient = `linear-gradient(${angle.value}deg, ${color1.value} ${stop1.value}%, ${color2.value} ${stop2.value}%)`;

    preview.style.background = gradient;
    code.value = `background: ${gradient}`;
    stop1Value.textContent = `%${stop1.value}`;
    stop2Value.textContent = `%${stop2.value}`;
    angleValue.textContent = `${angle.value}°`;
  }

  function reset() {
    color1.value = DEFAULTS.color1;
    stop1.value = DEFAULTS.stop1;
    color2.value = DEFAULTS.color2;
    stop2.value = DEFAULTS.stop2;
    angle.value = DEFAULTS.angle;
    update();
  }

  function keepStopsInOrder(changedInput) {
    if (Number(stop1.value) > Number(stop2.value)) {
      if (changedInput === stop1) {
        stop2.value = stop1.value;
      } else {
        stop1.value = stop2.value;
      }
    }
  }

  container.addEventListener("input", (event) => {
    keepStopsInOrder(event.target);
    update();
  }, { signal });

  copyButton.addEventListener("click", () => copyText(code.value), { signal });
  resetButton.addEventListener("click", reset, { signal });

  reset();
}
