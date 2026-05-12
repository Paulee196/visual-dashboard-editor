const DOMAIN = "visual_dashboard_editor";
const UI_VERSION = "0.2.5";
const ELEMENT_NAME = "visual-dashboard-editor-panel-v2";

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
      elementFilter: "",
      dirty: false,
      loading: false,
      status: "Vyber dashboard.",
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
    this.state.status = `Vybrano: ${this.displayLabel(element)}`;
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
    if (
      url.startsWith("http") ||
      url.startsWith("/") ||
      url.startsWith("data:") ||
      url.startsWith("blob:") ||
      url.startsWith("media-source://")
    ) {
      return url;
    }
    return `/${url.replace(/^\/+/, "")}`;
  }

  shortLabel(element) {
    return this.displayLabel(element);
  }

  displayLabel(element) {
    const config = element.config || {};
    const literal = this.literalLabel(config.name) || this.literalLabel(config.title);
    if (literal) return literal;

    if (config.type === "image") {
      const imageLabel = this.labelFromImage(config.image);
      if (imageLabel) return imageLabel;
    }

    const contentLabel = this.labelFromContent(config);
    if (contentLabel) return contentLabel;

    const entity = this.primaryEntity(config);
    if (entity) return this.friendlyEntityName(entity);

    if (config.icon) return this.labelFromIcon(config.icon);
    if (element.label && !this.isImplementationLabel(element.label)) return element.label;
    return this.labelFromCardType(config.card_type || config.type || "element");
  }

  literalLabel(value) {
    if (typeof value !== "string") return "";
    const text = value.trim();
    if (!text || text.includes("[[[") || text.includes("{{") || text.includes("{%")) return "";
    return text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  isImplementationLabel(value) {
    const text = String(value || "").toLowerCase();
    return (
      text === "custom:hui-element" ||
      text === "custom:button-card" ||
      text === "button card" ||
      text === "hui element" ||
      text.startsWith("custom:")
    );
  }

  labelFromCardType(value) {
    const text = String(value || "element").replace(/^custom:/, "").replace(/-/g, " ");
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  labelFromImage(value) {
    if (!value) return "";
    const image = String(value);
    const lowered = image.toLowerCase();
    if (lowered.startsWith("data:image") && lowered.includes("fill='black'")) {
      return "Levy panel";
    }
    const file = image.split("?")[0].split("/").pop() || "";
    const stem = file.replace(/\.[^.]+$/, "").replace(/^planek[-_]?/i, "");
    return this.humanizeId(stem);
  }

  labelFromIcon(icon) {
    const map = {
      "mdi:robot-vacuum": "Vysavac Bob",
      "mdi:television": "TV",
      "mdi:lock": "Otevirani dveri",
      "mdi:music": "Hudba",
      "mdi:cog": "Nastaveni",
      "mdi:lightning-bolt": "Energie",
      "mdi:washing-machine": "Pracka / susicka",
      "mdi:lightbulb-on": "Svetlo",
      "mdi:lightbulb-outline": "Svetlo",
    };
    return map[icon] || this.humanizeId(String(icon).replace(/^mdi:/, ""));
  }

  labelFromContent(config) {
    const cardType = String(config.card_type || config.type || "");
    const ids = this.entityIdsFromConfig(config);
    const joined = ids.join(" ").toLowerCase();
    const json = JSON.stringify(config).toLowerCase();

    if (config.entity === "sensor.time" || joined.includes("sensor.time")) return "Cas a datum";
    if (cardType.includes("calendar") || joined.includes("calendar.")) return "Kalendar";
    if (joined.includes("vacuum.bob") || json.includes("vacuum.bob")) return "Vysavac Bob";
    if (joined.includes("mhd_skola_snp") || json.includes("skola snp")) return "Skola SNP MHD";
    if (json.includes("stav dom") || json.includes("status-line")) return "Stav domacnosti";
    if (joined.includes("pracka") || joined.includes("susicka")) return "Pracka / susicka";
    if (joined.includes("person.pavel") || joined.includes("person.misa")) return "Osoby";
    if (joined.includes("teplota") || joined.includes("humidity") || joined.includes("vlhkost") || joined.includes("co2")) {
      if (joined.includes("obyvak")) return "Obyvak klima";
      if (joined.includes("loznice")) return "Loznice klima";
      if (joined.includes("fp300") || joined.includes("koupelna")) return "Koupelna klima";
      return "Teplota / klima";
    }

    if (ids.length) return this.friendlyEntityName(ids[0]);
    return "";
  }

  primaryEntity(config) {
    if (typeof config.entity === "string") return config.entity;
    const ids = this.entityIdsFromConfig(config);
    return ids[0] || "";
  }

  entityIdsFromConfig(config) {
    const ids = new Set();
    const visit = (value, key = "") => {
      if (typeof value === "string") {
        if ((key === "entity" || key === "entity_id") && value.includes(".")) ids.add(value);
        for (const match of value.matchAll(/(?:states\[['"]|state_attr\(['"])([a-z_]+\.[^'"]+)['"]/g)) {
          ids.add(match[1]);
        }
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((item) => visit(item, key));
        return;
      }
      if (value && typeof value === "object") {
        Object.entries(value).forEach(([childKey, childValue]) => visit(childValue, childKey));
      }
    };
    visit(config);
    return [...ids];
  }

  friendlyEntityName(entityId) {
    const state = this.hass?.states?.[entityId];
    return state?.attributes?.friendly_name || this.humanizeEntityId(entityId);
  }

  humanizeEntityId(entityId) {
    const objectId = String(entityId || "").split(".").pop().replace(/_group$/, "");
    return this.humanizeId(objectId);
  }

  humanizeId(value) {
    const replacements = {
      obyvak: "Obyvak",
      loznice: "Loznice",
      kuchyn: "Kuchyn",
      koupelna: "Koupelna",
      zachod: "Zachod",
      pracovna: "Pracovna",
      svetla: "Svetla",
      svetlo: "Svetlo",
      vypinac: "Vypinac",
      hosti: "Hoste",
      otevirani: "Otevirani",
      dveri: "dveri",
      mhd: "MHD",
      skola: "Skola",
      snp: "SNP",
      next: "odjezdy",
      time: "Cas",
      vykon: "vykon",
      pracka: "pracka",
      susicka: "susicka",
    };
    return String(value || "")
      .replace(/[^0-9A-Za-zÀ-ž]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => replacements[word.toLowerCase()] || word)
      .join(" ");
  }

  elementSummary(element) {
    const config = element.config || {};
    const style = config.style || {};
    const parts = [];
    const kind = this.elementKind(config);

    if (element.parent) parts.push(element.parent);
    if (config.entity) parts.push(config.entity);
    if (config.card_type) parts.push(config.card_type);
    else if (config.type) parts.push(config.type);
    if (style.left || style.top) parts.push(`${style.left || "-"}, ${style.top || "-"}`);
    if (kind === "hotspot") parts.push("hotspot");

    return parts.filter(Boolean).join(" - ");
  }

  filteredElements() {
    const card = this.currentCard();
    if (!card) return [];
    const query = this.state.elementFilter.trim().toLowerCase();
    return card.elements
      .map((element, index) => ({ element, index }))
      .filter(({ element }) => {
        if (!query) return true;
        const haystack = `${this.displayLabel(element)} ${element.label} ${this.elementSummary(element)}`.toLowerCase();
        return haystack.includes(query);
      });
  }

  hasPosition(style) {
    return Boolean(style && (style.left || style.top));
  }

  isTransparentCard(config) {
    const cardStyles = config.styles && config.styles.card;
    const styleText = Array.isArray(cardStyles)
      ? cardStyles.join(" ").toLowerCase()
      : String(cardStyles || "").toLowerCase();
    return (
      config.type === "custom:button-card" &&
      config.show_name === false &&
      config.show_icon === false &&
      (styleText.includes("transparent") || styleText.includes("rgba(0,0,0,0)"))
    );
  }

  elementKind(config) {
    const type = config.type || "";
    const cardType = config.card_type || "";
    if (type === "image") return "image";
    if (this.isTransparentCard(config)) return "hotspot";
    if (cardType.includes("calendar")) return "calendar";
    if (cardType === "horizontal-stack") return "stack";
    if (config.custom_fields && (config.custom_fields.main || config.custom_fields.body)) {
      return "widget";
    }
    if (config.icon || cardType === "custom:button-card" || type === "custom:hui-element") {
      return "icon";
    }
    return "label";
  }

  elementClasses(element, style) {
    const config = element.config || {};
    const kind = this.elementKind(config);
    const classes = ["plan-element", `element-${kind}`];
    if (this.samePath(element.path, this.state.selectedElementPath)) classes.push("selected");
    if (style.width || style.height) classes.push("has-explicit-size");
    if (element.parent) classes.push("nested-element");
    return classes.join(" ");
  }

  fallbackIcon(config) {
    const cardType = config.card_type || "";
    if (cardType.includes("calendar")) return "mdi:calendar";
    if (cardType === "horizontal-stack") return "mdi:account-group";
    if (config.entity && config.entity.startsWith("sensor.")) return "mdi:chart-line";
    if (config.entity && config.entity.startsWith("media_player.")) return "mdi:music";
    if (config.entity && config.entity.startsWith("light.")) return "mdi:lightbulb-outline";
    return "mdi:vector-point";
  }

  renderElementContent(element) {
    const config = element.config || {};
    const image = config.image || (config.state_image && Object.values(config.state_image)[0]);
    if (config.type === "image" && image) {
      return `<img class="element-image" src="${this.escape(this.imageUrl(image))}" alt="">`;
    }
    const kind = this.elementKind(config);
    const icon = config.icon || (config.type === "state-icon" ? "mdi:circle-medium" : this.fallbackIcon(config));
    const label = this.shortLabel(element);

    if (kind === "hotspot") {
      return `<span class="hotspot-label">${this.escape(label)}</span>`;
    }
    if (kind === "icon") {
      return `<ha-icon class="ha-like-icon" icon="${this.escape(icon)}"></ha-icon>`;
    }
    if (kind === "calendar" || kind === "stack") {
      return `<ha-icon class="ha-like-icon" icon="${this.escape(icon)}"></ha-icon><span>${this.escape(label)}</span>`;
    }
    if (kind === "widget") {
      return `<span class="widget-label">${this.escape(label)}</span>`;
    }
    return `<ha-icon class="ha-like-icon" icon="${this.escape(icon)}"></ha-icon><span>${this.escape(label)}</span>`;
  }

  renderPreview() {
    const card = this.currentCard();
    if (!card) {
      return `<div class="empty-state">Vyber UI dashboard nebo YAML soubor s picture-elements kartou.</div>`;
    }
    const image = this.imageUrl(card.image);
    const visibleCount = card.elements.filter((element) =>
      this.hasPosition((element.config || {}).style || {})
    ).length;
    const elements = card.elements
      .map((element, index) => {
        const style = element.config.style || {};
        if (!this.hasPosition(style)) {
          return "";
        }
        const width = style.width ? `width:${this.cssValue(style.width)};` : "";
        const height = style.height ? `height:${this.cssValue(style.height)};` : "";
        const opacity = style.opacity ? `opacity:${this.cssValue(style.opacity)};` : "";
        const transform = style.transform
          ? `transform:${this.cssValue(style.transform)};`
          : "transform:translate(-50%, -50%);";
        const left = this.cssValue(style.left, "50%");
        const top = this.cssValue(style.top, "50%");
        const classes = this.elementClasses(element, style);
        return `
          <button
            class="${classes}"
            style="left:${left};top:${top};${width}${height}${opacity}${transform}"
            data-card-index="${this.state.cardIndex}"
            data-element-index="${index}"
            title="${this.escape(this.displayLabel(element))}"
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
        <select id="elementSelect">
          <option value="">Vyber prvek...</option>
          ${card.elements
            .map(
              (element, index) =>
                `<option value="${index}" ${
                  this.samePath(element.path, this.state.selectedElementPath) ? "selected" : ""
                }>
                  ${this.escape(this.displayLabel(element))}
                </option>`
            )
            .join("")}
        </select>
        <span>${visibleCount}/${card.elements.length} viditelnych prvku</span>
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
            <h2>${this.escape(this.displayLabel(element))}</h2>
            <p>${this.escape(config.card_type || config.type || "element")}${element.line ? ` - radek ${element.line}` : ""}</p>
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
    const card = this.currentCard();
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
                      ? ` - ${file.cards} karet`
                      : " - UI"
                    : " - YAML";
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
        ${card ? this.renderElementList() : ""}
      </aside>
    `;
  }

  renderElementList() {
    const card = this.currentCard();
    const items = this.filteredElements();
    if (!card) return "";

    return `
      <section class="element-list">
        <div class="element-list-head">
          <h2>Prvky</h2>
          <span>${items.length}/${card.elements.length}</span>
        </div>
        <input
          id="elementFilter"
          class="element-filter"
          value="${this.escape(this.state.elementFilter)}"
          placeholder="Hledat prvek"
        >
        <div class="element-list-items">
          ${items
            .map(({ element, index }) => {
              const selected = this.samePath(element.path, this.state.selectedElementPath);
              const style = element.config?.style || {};
              const hasPosition = this.hasPosition(style);
              return `
                <button
                  class="element-list-item ${selected ? "selected" : ""}"
                  data-card-index="${this.state.cardIndex}"
                  data-element-index="${index}"
                >
                  <span class="element-list-title">${this.escape(this.displayLabel(element))}</span>
                  <span class="element-list-meta">${this.escape(this.elementSummary(element))}</span>
                  ${hasPosition ? "" : `<span class="element-list-badge">bez pozice</span>`}
                </button>
              `;
            })
            .join("")}
        </div>
      </section>
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
          <span class="pill">v${UI_VERSION}</span>
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

    this.shadowRoot.querySelector("#elementFilter")?.addEventListener("change", (event) => {
      this.state.elementFilter = event.target.value;
      this.render();
    });

    const cardSelect = this.shadowRoot.querySelector("#cardSelect");
    cardSelect?.addEventListener("change", (event) => {
      this.state.cardIndex = Number.parseInt(event.target.value, 10) || 0;
      this.state.selectedElementPath = null;
      this.state.advancedText = "";
      this.state.advancedDirty = false;
      this.render();
    });

    const elementSelect = this.shadowRoot.querySelector("#elementSelect");
    elementSelect?.addEventListener("change", (event) => {
      const elementIndex = Number.parseInt(event.target.value, 10);
      if (Number.isFinite(elementIndex)) {
        this.selectElement(this.state.cardIndex, elementIndex);
      }
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

    this.shadowRoot.querySelectorAll(".element-list-item").forEach((node) => {
      node.addEventListener("click", () => {
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
    height: 220px;
    margin-bottom: 12px;
  }

  .element-list {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--vde-line);
  }

  .element-list-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
  }

  .element-list-head span {
    color: var(--vde-muted);
    font-size: 12px;
  }

  .element-filter {
    margin-bottom: 8px;
  }

  .element-list-items {
    display: grid;
    gap: 6px;
    max-height: 420px;
    overflow: auto;
    padding-right: 2px;
  }

  .element-list-item {
    min-height: 48px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 3px 8px;
    align-items: center;
    text-align: left;
    padding: 7px 8px;
    border-radius: 6px;
  }

  .element-list-item.selected {
    border-color: #ffb000;
    box-shadow: inset 0 0 0 1px rgba(255, 176, 0, 0.65);
    background: rgba(255, 176, 0, 0.12);
  }

  .element-list-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 700;
  }

  .element-list-meta {
    grid-column: 1 / -1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--vde-muted);
    font-size: 11px;
  }

  .element-list-badge {
    align-self: start;
    border-radius: 999px;
    padding: 2px 6px;
    background: rgba(105, 115, 134, 0.14);
    color: var(--vde-muted);
    font-size: 10px;
    white-space: nowrap;
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
    padding: 4px 6px;
    border: 1px solid rgba(11, 107, 203, 0.5);
    background: rgba(255, 255, 255, 0.75);
    color: #102a43;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.18);
    overflow: hidden;
    touch-action: none;
  }

  .plan-element.has-explicit-size {
    padding: 0;
  }

  .plan-element.selected {
    border: 2px solid #ffb000;
    box-shadow: 0 0 0 3px rgba(255, 176, 0, 0.28);
    z-index: 1000;
  }

  .plan-element span {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
  }

  .plan-element.element-image {
    border: 1px solid rgba(11, 107, 203, 0.18);
    background: transparent;
    box-shadow: none;
    color: transparent;
  }

  .plan-element.element-image.selected {
    border-color: #ffb000;
  }

  .element-hotspot {
    background: rgba(0, 146, 255, 0.08);
    border: 1px dashed rgba(0, 190, 255, 0.9);
    color: #ffffff;
    box-shadow: inset 0 0 0 1px rgba(0, 70, 120, 0.22);
  }

  .hotspot-label {
    align-self: flex-start;
    justify-self: flex-start;
    max-width: calc(100% - 8px);
    margin: 4px;
    border-radius: 4px;
    padding: 2px 5px;
    background: rgba(0, 0, 0, 0.55);
    color: white;
    font-size: 11px;
    line-height: 1.2;
  }

  .element-icon {
    width: auto;
    height: auto;
    min-width: 38px;
    min-height: 38px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    background: rgba(15, 15, 15, 0.78);
    color: rgba(255, 255, 255, 0.88);
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
  }

  .element-calendar,
  .element-stack,
  .element-widget {
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 8px;
    background: rgba(8, 18, 26, 0.78);
    color: white;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.28);
    padding: 6px 9px;
  }

  .element-widget.has-explicit-size {
    padding: 6px 9px;
  }

  .widget-label {
    font-weight: 700;
  }

  .nested-element::after {
    content: "";
    position: absolute;
    inset: 2px;
    border: 1px solid rgba(255, 176, 0, 0.18);
    pointer-events: none;
  }

  .ha-like-icon {
    width: 20px;
    height: 20px;
    flex: 0 0 auto;
  }

  img.element-image {
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

if (!customElements.get(ELEMENT_NAME)) {
  customElements.define(ELEMENT_NAME, VisualDashboardEditorPanel);
}
