const DOMAIN = "visual_dashboard_editor";

class VisualDashboardEditorPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.state = {
      files: [],
      selectedFile: "",
      cards: [],
      cardIndex: 0,
      selectedElementPath: null,
      advancedText: "",
      advancedDirty: false,
      dirty: false,
      loading: false,
      status: "Vyber YAML dashboard.",
      error: "",
    };
  }

  set hass(value) {
    this._hass = value;
  }

  get hass() {
    return this._hass;
  }

  connectedCallback() {
    this.render();
    this.loadFiles();
  }

  async callWS(message) {
    if (!this.hass) {
      throw new Error("Home Assistant API jeste neni pripravene.");
    }
    if (this.hass.callWS) {
      return this.hass.callWS(message);
    }
    return this.hass.connection.sendMessagePromise(message);
  }

  async loadFiles() {
    this.state.loading = true;
    this.state.error = "";
    this.render();
    try {
      const result = await this.callWS({ type: `${DOMAIN}/list_files` });
      this.state.files = result.files || [];
      this.state.status = this.state.files.length
        ? "Vyber UI dashboard nebo YAML soubor a nacti preview."
        : "Nenasel jsem zadny UI dashboard ani vhodny YAML soubor.";
    } catch (err) {
      this.state.error = err.message || String(err);
    } finally {
      this.state.loading = false;
      this.render();
    }
  }

  async loadFile(path) {
    if (!path) return;
    this.state.loading = true;
    this.state.error = "";
    this.state.selectedFile = path;
    this.state.selectedElementPath = null;
    this.state.advancedText = "";
    this.state.advancedDirty = false;
    this.render();
    try {
      const result = await this.callWS({
        type: `${DOMAIN}/load_file`,
        path,
      });
      this.state.cards = result.cards || [];
      this.state.cardIndex = 0;
      this.state.dirty = false;
      this.state.status = this.state.cards.length
        ? `Nacteno: ${this.state.cards.length} picture-elements karta/karet.`
        : "Dashboard je nacteny, ale nenasel jsem picture-elements kartu.";
    } catch (err) {
      this.state.error = err.message || String(err);
    } finally {
      this.state.loading = false;
      this.render();
    }
  }

  currentCard() {
    return this.state.cards[this.state.cardIndex] || null;
  }

  currentElement() {
    const card = this.currentCard();
    if (!card || !this.state.selectedElementPath) return null;
    return card.elements.find((element) =>
      this.samePath(element.path, this.state.selectedElementPath)
    );
  }

  samePath(left, right) {
    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
      return false;
    }
    return left.every((part, index) => part === right[index]);
  }

  selectElement(cardIndex, elementIndex) {
    const card = this.state.cards[cardIndex];
    const element = card && card.elements[elementIndex];
    if (!element) return;
    this.state.cardIndex = cardIndex;
    this.state.selectedElementPath = [...element.path];
    this.state.advancedText = element.fragment || "";
    this.state.advancedDirty = false;
    this.state.status = `Vybrano: ${element.label}`;
    this.render();
  }

  updateField(path, value) {
    const element = this.currentElement();
    if (!element) return;
    const parts = path.split(".");
    let target = element.config;
    while (parts.length > 1) {
      const part = parts.shift();
      if (!target[part] || typeof target[part] !== "object") {
        target[part] = {};
      }
      target = target[part];
    }
    const key = parts[0];
    if (value === undefined || value === "") {
      delete target[key];
    } else {
      target[key] = value;
    }
    this.state.dirty = true;
    this.state.status = "Zmeny jsou pripravene k ulozeni.";
    this.render();
  }

  updatePercentField(path, rawValue) {
    const numeric = Number.parseFloat(rawValue);
    this.updateField(path, Number.isFinite(numeric) ? `${numeric}%` : "");
  }

  updateNumberField(path, rawValue) {
    const numeric = Number.parseFloat(rawValue);
    this.updateField(path, Number.isFinite(numeric) ? String(numeric) : "");
  }

  async saveSelected(useAdvanced = false) {
    const element = this.currentElement();
    if (!element || !this.state.selectedFile) return;
    this.state.loading = true;
    this.state.error = "";
    this.render();
    try {
      const payload = {
        type: `${DOMAIN}/save_element`,
        path: this.state.selectedFile,
        element_path: element.path,
      };
      if (useAdvanced) {
        payload.fragment = this.state.advancedText;
      } else {
        payload.element = element.config;
      }
      const result = await this.callWS(payload);
      this.state.cards = result.cards || [];
      this.state.dirty = false;
      this.state.advancedDirty = false;
      this.state.status = result.backup_path
        ? `Ulozeno. Backup: ${result.backup_path}`
        : "Ulozeno.";
      const nextElement = this.currentElement();
      this.state.advancedText = nextElement ? nextElement.fragment || "" : "";
    } catch (err) {
      this.state.error = err.message || String(err);
    } finally {
      this.state.loading = false;
      this.render();
    }
  }

  startDrag(event, cardIndex, elementIndex) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    this.selectElement(cardIndex, elementIndex);

    const stage = this.shadowRoot.querySelector(".plan-stage");
    const card = this.state.cards[cardIndex];
    const element = card && card.elements[elementIndex];
    if (!stage || !element) return;

    const rect = stage.getBoundingClientRect();
    const move = (moveEvent) => {
      const left = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      const top = ((moveEvent.clientY - rect.top) / rect.height) * 100;
      element.config.style = element.config.style || {};
      element.config.style.left = `${this.clamp(left, 0, 100).toFixed(1)}%`;
      element.config.style.top = `${this.clamp(top, 0, 100).toFixed(1)}%`;
      this.state.dirty = true;
      this.state.status = "Prvek posunut, jeste ulozit.";
      this.render();
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  percentToNumber(value) {
    if (value === undefined || value === null) return "";
    const parsed = Number.parseFloat(String(value).replace("%", ""));
    return Number.isFinite(parsed) ? parsed : "";
  }

  escape(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  cssValue(value, fallback = "") {
    return this.escape(value || fallback).replace(/;/g, "");
  }

  imageUrl(value) {
    const url = String(value || "");
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("/") || url.startsWith("media-source://")) {
      return url;
    }
    return `/${url.replace(/^\/+/, "")}`;
  }

  shortLabel(element) {
    const config = element.config || {};
    return (
      config.name ||
      config.title ||
      config.entity ||
      config.icon ||
      config.type ||
      element.label ||
      "element"
    );
  }

  renderElementContent(element) {
    const config = element.config || {};
    const image = config.image || (config.state_image && Object.values(config.state_image)[0]);
    if (config.type === "image" && image) {
      return `<img class="element-image" src="${this.escape(this.imageUrl(image))}" alt="">`;
    }
    const icon = config.icon || (config.type === "state-icon" ? "mdi:circle-medium" : "");
    const iconHtml = icon
      ? `<ha-icon class="ha-like-icon" icon="${this.escape(icon)}"></ha-icon>`
      : "";
    return `${iconHtml}<span>${this.escape(this.shortLabel(element))}</span>`;
  }

  renderPreview() {
    const card = this.currentCard();
    if (!card) {
      return `<div class="empty-state">Vyber UI dashboard nebo YAML soubor s picture-elements kartou.</div>`;
    }
    const image = this.imageUrl(card.image);
    const elements = card.elements
      .map((element, index) => {
        const style = element.config.style || {};
        const isSelected = this.samePath(element.path, this.state.selectedElementPath);
        const width = style.width ? `width:${this.cssValue(style.width)};` : "";
        const height = style.height ? `height:${this.cssValue(style.height)};` : "";
        const opacity = style.opacity ? `opacity:${this.cssValue(style.opacity)};` : "";
        const transform = style.transform
          ? `transform:${this.cssValue(style.transform)};`
          : "transform:translate(-50%, -50%);";
        const left = this.cssValue(style.left, "50%");
        const top = this.cssValue(style.top, "50%");
        return `
          <button
            class="plan-element ${isSelected ? "selected" : ""}"
            style="left:${left};top:${top};${width}${height}${opacity}${transform}"
            data-card-index="${this.state.cardIndex}"
            data-element-index="${index}"
            title="${this.escape(element.label)}"
          >
            ${this.renderElementContent(element)}
          </button>
        `;
      })
      .join("");

    return `
      <div class="preview-toolbar">
        <select id="cardSelect">
          ${this.state.cards
            .map(
              (candidate, index) =>
                `<option value="${index}" ${index === this.state.cardIndex ? "selected" : ""}>
                  ${this.escape(candidate.title)}
                </option>`
            )
            .join("")}
        </select>
        <span>${card.elements.length} prvku</span>
      </div>
      <div class="plan-stage">
        ${
          image
            ? `<img class="plan-bg" src="${this.escape(image)}" alt="">`
            : `<div class="missing-bg">Karta nema obrazek v poli image.</div>`
        }
        ${elements}
      </div>
    `;
  }

  renderInspector() {
    const element = this.currentElement();
    if (!element) {
      return `
        <section class="inspector">
          <h2>Inspector</h2>
          <p class="muted">Klikni na prvek v preview. Tady se objevi jeho pozice, velikost a kodovy fragment.</p>
        </section>
      `;
    }

    const config = element.config || {};
    const style = config.style || {};
    return `
      <section class="inspector">
        <div class="inspector-head">
          <div>
            <h2>${this.escape(element.label)}</h2>
            <p>${this.escape(config.type || "element")}${element.line ? ` · radek ${element.line}` : ""}</p>
          </div>
          <button id="saveElement" class="primary" ${this.state.loading ? "disabled" : ""}>Ulozit</button>
        </div>

        <div class="field-grid">
          <label>
            Entity
            <input data-field="entity" value="${this.escape(config.entity || "")}" placeholder="light.kitchen">
          </label>
          <label>
            Ikona
            <input data-field="icon" value="${this.escape(config.icon || "")}" placeholder="mdi:lightbulb">
          </label>
          <label>
            Left %
            <input data-percent-field="style.left" type="number" step="0.1" value="${this.percentToNumber(style.left)}">
          </label>
          <label>
            Top %
            <input data-percent-field="style.top" type="number" step="0.1" value="${this.percentToNumber(style.top)}">
          </label>
          <label>
            Width %
            <input data-percent-field="style.width" type="number" step="0.1" value="${this.percentToNumber(style.width)}">
          </label>
          <label>
            Height %
            <input data-percent-field="style.height" type="number" step="0.1" value="${this.percentToNumber(style.height)}">
          </label>
          <label>
            Opacity
            <input data-number-field="style.opacity" type="number" step="0.05" min="0" max="1" value="${this.escape(style.opacity || "")}">
          </label>
          <label>
            Z-index
            <input data-number-field="style.z-index" type="number" step="1" value="${this.escape(style["z-index"] || "")}">
          </label>
        </div>

        <label class="wide-field">
          Transform
          <input data-field="style.transform" value="${this.escape(style.transform || "")}" placeholder="translate(-50%, -50%) scale(1.1)">
        </label>

        <label class="wide-field">
          Image
          <input data-field="image" value="${this.escape(config.image || "")}" placeholder="/local/floorplan/light.png">
        </label>

        <details class="advanced" ${this.state.advancedDirty ? "open" : ""}>
          <summary>Pokrocily YAML fragment</summary>
          <textarea id="advancedText" spellcheck="false">${this.escape(this.state.advancedText)}</textarea>
          <button id="saveAdvanced" ${this.state.loading ? "disabled" : ""}>Ulozit YAML fragment</button>
        </details>
      </section>
    `;
  }

  renderFilePicker() {
    return `
      <aside class="files">
        <div class="files-head">
          <h2>Dashboardy</h2>
          <button id="refreshFiles" title="Obnovit seznam">Obnovit</button>
        </div>
        <select id="fileSelect" size="12">
          <option value="">Vyber dashboard...</option>
          ${this.state.files
            .map(
              (file) => {
                const label = file.label || file.path;
                const suffix =
                  file.source === "lovelace"
                    ? file.cards
                      ? ` · ${file.cards} karet`
                      : " · UI"
                    : " · YAML";
                return (
                `<option value="${this.escape(file.path)}" ${
                  file.path === this.state.selectedFile ? "selected" : ""
                }>
                  ${this.escape(label + suffix)}
                </option>`
                );
              }
            )
            .join("")}
        </select>
        <button id="loadFile" class="primary" ${!this.state.selectedFile ? "disabled" : ""}>Nacist</button>
        <p class="muted">Editor umi UI/storage dashboardy a YAML soubory v HA configu. Hleda karty typu picture-elements.</p>
      </aside>
    `;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="shell">
        <header class="topbar">
          <div>
            <h1>Visual Dashboard Editor</h1>
            <p>${this.escape(this.state.status)}</p>
          </div>
          ${this.state.loading ? `<span class="pill">Pracuju...</span>` : ""}
          ${this.state.dirty || this.state.advancedDirty ? `<span class="pill dirty">Neulozeno</span>` : ""}
        </header>
        ${this.state.error ? `<div class="error">${this.escape(this.state.error)}</div>` : ""}
        <main class="layout">
          ${this.renderFilePicker()}
          <section class="preview">
            ${this.renderPreview()}
          </section>
          ${this.renderInspector()}
        </main>
      </div>
    `;
    this.bindEvents();
  }

  bindEvents() {
    const fileSelect = this.shadowRoot.querySelector("#fileSelect");
    fileSelect?.addEventListener("change", (event) => {
      this.state.selectedFile = event.target.value;
      this.render();
    });

    this.shadowRoot
      .querySelector("#refreshFiles")
      ?.addEventListener("click", () => this.loadFiles());
    this.shadowRoot
      .querySelector("#loadFile")
      ?.addEventListener("click", () => this.loadFile(this.state.selectedFile));

    const cardSelect = this.shadowRoot.querySelector("#cardSelect");
    cardSelect?.addEventListener("change", (event) => {
      this.state.cardIndex = Number.parseInt(event.target.value, 10) || 0;
      this.state.selectedElementPath = null;
      this.state.advancedText = "";
      this.state.advancedDirty = false;
      this.render();
    });

    this.shadowRoot.querySelectorAll(".plan-element").forEach((node) => {
      node.addEventListener("pointerdown", (event) => {
        const cardIndex = Number.parseInt(node.dataset.cardIndex, 10);
        const elementIndex = Number.parseInt(node.dataset.elementIndex, 10);
        this.startDrag(event, cardIndex, elementIndex);
      });
      node.addEventListener("click", (event) => {
        event.preventDefault();
        const cardIndex = Number.parseInt(node.dataset.cardIndex, 10);
        const elementIndex = Number.parseInt(node.dataset.elementIndex, 10);
        this.selectElement(cardIndex, elementIndex);
      });
    });

    this.shadowRoot.querySelectorAll("[data-field]").forEach((input) => {
      input.addEventListener("change", (event) => {
        this.updateField(input.dataset.field, event.target.value.trim());
      });
    });
    this.shadowRoot.querySelectorAll("[data-percent-field]").forEach((input) => {
      input.addEventListener("change", (event) => {
        this.updatePercentField(input.dataset.percentField, event.target.value);
      });
    });
    this.shadowRoot.querySelectorAll("[data-number-field]").forEach((input) => {
      input.addEventListener("change", (event) => {
        this.updateNumberField(input.dataset.numberField, event.target.value);
      });
    });

    this.shadowRoot
      .querySelector("#saveElement")
      ?.addEventListener("click", () => this.saveSelected(false));
    this.shadowRoot
      .querySelector("#saveAdvanced")
      ?.addEventListener("click", () => this.saveSelected(true));

    this.shadowRoot.querySelector("#advancedText")?.addEventListener("input", (event) => {
      this.state.advancedText = event.target.value;
      this.state.advancedDirty = true;
      this.state.status = "YAML fragment je upraveny, jeste ulozit.";
    });
  }
}

const styles = `
  :host {
    --vde-bg: var(--primary-background-color, #f6f7f9);
    --vde-panel: var(--card-background-color, #ffffff);
    --vde-text: var(--primary-text-color, #17202a);
    --vde-muted: var(--secondary-text-color, #697386);
    --vde-line: var(--divider-color, #d9dee7);
    --vde-accent: var(--primary-color, #0b6bcb);
    --vde-danger: #b42318;
    display: block;
    min-height: 100vh;
    background: var(--vde-bg);
    color: var(--vde-text);
    font-family: var(--paper-font-body1_-_font-family, system-ui, sans-serif);
  }

  * {
    box-sizing: border-box;
  }

  .shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .topbar {
    min-height: 72px;
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid var(--vde-line);
    background: var(--vde-panel);
  }

  h1,
  h2,
  p {
    margin: 0;
  }

  h1 {
    font-size: 20px;
    font-weight: 700;
  }

  h2 {
    font-size: 15px;
    font-weight: 700;
  }

  .topbar p,
  .muted,
  .inspector-head p {
    color: var(--vde-muted);
    font-size: 13px;
    line-height: 1.45;
  }

  .pill {
    border: 1px solid var(--vde-line);
    border-radius: 999px;
    padding: 6px 10px;
    font-size: 12px;
    white-space: nowrap;
  }

  .pill.dirty {
    border-color: #f5b544;
    background: #fff7e0;
    color: #7a4b00;
  }

  .error {
    margin: 12px 20px 0;
    padding: 10px 12px;
    border-left: 4px solid var(--vde-danger);
    background: #fff1f0;
    color: var(--vde-danger);
  }

  .layout {
    flex: 1;
    display: grid;
    grid-template-columns: 280px minmax(360px, 1fr) 360px;
    min-height: 0;
  }

  .files,
  .inspector {
    min-width: 0;
    background: var(--vde-panel);
    border-right: 1px solid var(--vde-line);
    padding: 16px;
    overflow: auto;
  }

  .inspector {
    border-right: 0;
    border-left: 1px solid var(--vde-line);
  }

  .files-head,
  .inspector-head,
  .preview-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
  }

  select,
  input,
  textarea,
  button {
    font: inherit;
  }

  select,
  input,
  textarea {
    width: 100%;
    border: 1px solid var(--vde-line);
    border-radius: 6px;
    background: var(--vde-panel);
    color: var(--vde-text);
  }

  select,
  input {
    min-height: 36px;
    padding: 7px 9px;
  }

  #fileSelect {
    height: 330px;
    margin-bottom: 12px;
  }

  button {
    min-height: 34px;
    border: 1px solid var(--vde-line);
    border-radius: 6px;
    background: var(--vde-panel);
    color: var(--vde-text);
    padding: 7px 10px;
    cursor: pointer;
  }

  button:hover {
    border-color: var(--vde-accent);
  }

  button.primary {
    background: var(--vde-accent);
    border-color: var(--vde-accent);
    color: white;
  }

  button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .preview {
    min-width: 0;
    padding: 16px;
    overflow: auto;
  }

  .preview-toolbar {
    margin-bottom: 10px;
  }

  .preview-toolbar select {
    max-width: 420px;
  }

  .preview-toolbar span {
    color: var(--vde-muted);
    font-size: 13px;
  }

  .plan-stage {
    position: relative;
    width: min(100%, 1200px);
    min-height: 540px;
    margin: 0 auto;
    border: 1px solid var(--vde-line);
    border-radius: 8px;
    overflow: hidden;
    background:
      linear-gradient(45deg, rgba(0, 0, 0, 0.035) 25%, transparent 25%),
      linear-gradient(-45deg, rgba(0, 0, 0, 0.035) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, rgba(0, 0, 0, 0.035) 75%),
      linear-gradient(-45deg, transparent 75%, rgba(0, 0, 0, 0.035) 75%);
    background-size: 24px 24px;
    background-position: 0 0, 0 12px, 12px -12px, -12px 0;
  }

  .plan-bg {
    display: block;
    width: 100%;
    height: auto;
    min-height: 540px;
    object-fit: contain;
    background: var(--vde-panel);
  }

  .missing-bg,
  .empty-state {
    display: grid;
    min-height: 320px;
    place-items: center;
    color: var(--vde-muted);
    border: 1px dashed var(--vde-line);
    border-radius: 8px;
    background: var(--vde-panel);
  }

  .plan-element {
    position: absolute;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    min-width: 30px;
    min-height: 30px;
    max-width: 220px;
    padding: 4px 6px;
    border: 1px solid rgba(11, 107, 203, 0.5);
    background: rgba(255, 255, 255, 0.75);
    color: #102a43;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.18);
    overflow: hidden;
    touch-action: none;
  }

  .plan-element.selected {
    border: 2px solid #ffb000;
    box-shadow: 0 0 0 3px rgba(255, 176, 0, 0.28);
    z-index: 1000;
  }

  .plan-element span {
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
  }

  .ha-like-icon {
    width: 20px;
    height: 20px;
    flex: 0 0 auto;
  }

  .element-image {
    width: 100%;
    height: 100%;
    min-width: 28px;
    min-height: 28px;
    object-fit: contain;
    pointer-events: none;
  }

  .field-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  label {
    display: grid;
    gap: 5px;
    font-size: 12px;
    color: var(--vde-muted);
  }

  label input {
    color: var(--vde-text);
  }

  .wide-field {
    margin-top: 10px;
  }

  .advanced {
    margin-top: 16px;
    border-top: 1px solid var(--vde-line);
    padding-top: 12px;
  }

  .advanced summary {
    cursor: pointer;
    font-weight: 700;
    margin-bottom: 10px;
  }

  textarea {
    min-height: 260px;
    resize: vertical;
    padding: 10px;
    font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
    font-size: 12px;
    line-height: 1.45;
    white-space: pre;
  }

  .advanced button {
    margin-top: 10px;
  }

  @media (max-width: 1100px) {
    .layout {
      grid-template-columns: 240px 1fr;
    }

    .inspector {
      grid-column: 1 / -1;
      border-left: 0;
      border-top: 1px solid var(--vde-line);
    }
  }

  @media (max-width: 760px) {
    .layout {
      display: block;
    }

    .files,
    .inspector,
    .preview {
      border: 0;
      border-bottom: 1px solid var(--vde-line);
    }

    .plan-stage {
      min-height: 360px;
    }

    .plan-bg {
      min-height: 360px;
    }
  }
`;

customElements.define("visual-dashboard-editor-panel", VisualDashboardEditorPanel);
