const DOMAIN = "visual_dashboard_editor";
const UI_VERSION = "0.2.11";
const ELEMENT_NAME = "visual-dashboard-editor-panel-v8";

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
      advancedExpanded: false,
      elementFilter: "",
      previewSize: "display-24",
      previewOrientation: "landscape",
      dirty: false,
      loading: false,
      status: "Vyber dashboard.",
      error: "",
    };
  }

  set hass(value) {
    this._hass = value;
    if (this._realCard) {
      this._realCard.hass = value;
    }
  }

  get hass() {
    return this._hass;
  }

  connectedCallback() {
    this._onResize = () => this.syncPreviewFit();
    window.addEventListener("resize", this._onResize);
    this.render();
    this.loadFiles();
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this._onResize);
    this._frameResizeObserver?.disconnect();
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
      const leftText = `${this.clamp(left, 0, 100).toFixed(1)}%`;
      const topText = `${this.clamp(top, 0, 100).toFixed(1)}%`;
      element.config.style = element.config.style || {};
      element.config.style.left = leftText;
      element.config.style.top = topText;
      this.state.dirty = true;
      this.state.status = "Prvek posunut, jeste ulozit.";

      const node = this.shadowRoot.querySelector(
        `.plan-element[data-card-index="${cardIndex}"][data-element-index="${elementIndex}"]`
      );
      if (node) {
        node.style.left = leftText;
        node.style.top = topText;
      }
      const leftInput = this.shadowRoot.querySelector('[data-percent-field="style.left"]');
      const topInput = this.shadowRoot.querySelector('[data-percent-field="style.top"]');
      if (leftInput) leftInput.value = Number.parseFloat(leftText);
      if (topInput) topInput.value = Number.parseFloat(topText);
      const status = this.shadowRoot.querySelector(".topbar p");
      if (status) status.textContent = this.state.status;
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      this.render();
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

  previewPresets() {
    return [
      { key: "phone-61", group: "Telefony", label: '6,1" iPhone / Galaxy S', width: 390, height: 844 },
      { key: "phone-63", group: "Telefony", label: '6,3" iPhone Pro / Galaxy S', width: 402, height: 874 },
      { key: "phone-65", group: "Telefony", label: '6,5" iPhone / Samsung', width: 414, height: 896 },
      { key: "phone-67", group: "Telefony", label: '6,7" iPhone Plus / Galaxy+', width: 430, height: 932 },
      { key: "phone-68", group: "Telefony", label: '6,8" Galaxy S22/S23/S24 Ultra', width: 412, height: 915 },
      { key: "phone-69", group: "Telefony", label: '6,9" iPhone Max / Galaxy S25 Ultra', width: 440, height: 956 },
      { key: "tablet-89", group: "Tablety", label: '8,9" kompaktni tablet', width: 768, height: 1024 },
      { key: "tablet-10", group: "Tablety", label: '10" tablet', width: 800, height: 1280 },
      { key: "tablet-11", group: "Tablety", label: '11" iPad / Galaxy Tab', width: 834, height: 1194 },
      { key: "tablet-13", group: "Tablety", label: '13" iPad Pro / Galaxy Tab', width: 1024, height: 1366 },
      { key: "display-13", group: "Obrazovky", label: '13" notebook', width: 1280, height: 800 },
      { key: "display-156", group: "Obrazovky", label: '15,6" notebook', width: 1366, height: 768 },
      { key: "display-24", group: "Obrazovky", label: '24" monitor Full HD', width: 1920, height: 1080 },
      { key: "display-27", group: "Obrazovky", label: '27" monitor QHD', width: 2560, height: 1440 },
      { key: "display-32", group: "Obrazovky", label: '32" monitor 4K', width: 3840, height: 2160 },
    ];
  }

  previewPreset() {
    return (
      this.previewPresets().find((preset) => preset.key === this.state.previewSize) ||
      this.previewPresets()[0]
    );
  }

  previewDimensions() {
    const preset = this.previewPreset();
    if (this.state.previewOrientation === "landscape") {
      return {
        width: Math.max(preset.width, preset.height),
        height: Math.min(preset.width, preset.height),
      };
    }
    return {
      width: Math.min(preset.width, preset.height),
      height: Math.max(preset.width, preset.height),
    };
  }

  displayLabel(element) {
    const config = element.config || {};
    const literal = this.literalLabel(config.name) || this.literalLabel(config.title);
    if (literal) return literal;

    const customTitle = this.literalLabel(config.custom_fields?.title);
    if (customTitle) return customTitle;

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
    if (
      json.includes("stav dom") ||
      json.includes("status-line") ||
      json.includes("trackedavailability") ||
      json.includes("messages.push")
    ) {
      return "Stav domacnosti";
    }
    if (joined.includes("mhd_skola_snp") || json.includes("skola snp")) return "Skola SNP MHD";
    if (joined.includes("vacuum.bob") || json.includes("vacuum.bob")) return "Vysavac Bob";
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
      .filter(({ element }) => this.hasPosition((element.config || {}).style || {}))
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

  isAreaElement(config, style) {
    if (!style || (!style.width && !style.height)) return false;
    if (config.type === "image") return true;
    if (this.isTransparentCard(config)) return true;

    const width = String(style.width || "");
    const height = String(style.height || "");
    return (
      width.includes("%") ||
      height.includes("%") ||
      width.includes("clamp") ||
      height.includes("clamp") ||
      width.includes("fit-content") ||
      height.includes("fit-content")
    );
  }

  elementClasses(element, style) {
    const config = element.config || {};
    const kind = this.elementKind(config);
    const classes = [
      "plan-element",
      `element-${kind}`,
      this.isAreaElement(config, style) ? "element-area" : "element-marker",
    ];
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

  previewIcon(element) {
    const config = element.config || {};
    if (config.icon) return config.icon;

    const label = this.displayLabel(element).toLowerCase();
    if (label.includes("cas") || label.includes("datum")) return "mdi:chart-line";
    if (label.includes("klima") || label.includes("teplota")) return "mdi:thermometer";
    if (label.includes("kalendar")) return "mdi:calendar";
    if (label.includes("osob")) return "mdi:account-group";
    if (label.includes("vysavac")) return "mdi:robot-vacuum";
    if (label.includes("energie")) return "mdi:lightning-bolt";
    if (label.includes("hudba")) return "mdi:music";
    if (label.includes("stav dom")) return "mdi:format-list-bulleted";
    if (config.type === "image") return "mdi:image-outline";
    if (this.isTransparentCard(config)) return "mdi:gesture-tap";
    return config.type === "state-icon" ? "mdi:circle-medium" : this.fallbackIcon(config);
  }

  renderElementContent(element) {
    const label = this.displayLabel(element);
    const icon = this.previewIcon(element);
    return `
      <span class="element-chip">
        <ha-icon class="chip-icon" icon="${this.escape(icon)}"></ha-icon>
        <span class="chip-label">${this.escape(label)}</span>
      </span>
    `;
  }

  cloneConfig(config) {
    return JSON.parse(JSON.stringify(config || {}));
  }

  syncPreviewFit() {
    const frame = this.shadowRoot?.querySelector(".preview-frame");
    const fit = this.shadowRoot?.querySelector("#previewFit");
    const stage = this.shadowRoot?.querySelector(".plan-stage");
    if (!frame || !fit || !stage) return;

    const dimensions = this.previewDimensions();
    const frameRect = frame.getBoundingClientRect();
    const fitRect = fit.getBoundingClientRect();
    const availableWidth = Math.max(280, frame.clientWidth || frameRect.width || dimensions.width);
    const availableHeight = Math.max(280, window.innerHeight - fitRect.top - 26);
    const rawHeight = Math.max(stage.scrollHeight, stage.offsetHeight, dimensions.height, 220);
    const maxUpscale = dimensions.width <= 520 ? 2.1 : dimensions.width <= 1100 ? 1.45 : 1;
    const scale = Math.min(maxUpscale, availableWidth / dimensions.width, availableHeight / rawHeight);

    stage.style.setProperty("--preview-scale", String(scale));
    fit.style.height = `${Math.ceil(rawHeight * scale)}px`;
  }

  async mountRealCard() {
    const host = this.shadowRoot.querySelector("#realCardHost");
    const stage = this.shadowRoot.querySelector(".plan-stage");
    const error = this.shadowRoot.querySelector("#previewRenderError");
    const card = this.currentCard();
    const cardIndex = this.state.cardIndex;
    this._realCard = null;

    if (!host || !stage || !card?.config || !this.hass) return;
    this._frameResizeObserver?.disconnect();
    this._frameResizeObserver = null;

    try {
      const config = this.cloneConfig(card.config);
      let element;
      if (window.loadCardHelpers) {
        const helpers = await window.loadCardHelpers();
        element = helpers.createCardElement(config);
      } else {
        element = document.createElement("hui-picture-elements-card");
        element.setConfig(config);
      }
      if (!host.isConnected || this.state.cardIndex !== cardIndex) return;
      element.hass = this.hass;
      element.classList.add("real-card");
      host.replaceChildren(element);
      this._realCard = element;
      stage.classList.add("real-ready");
      stage.classList.remove("real-failed");
      stage.style.height = "";
      if (error) error.textContent = "";
      requestAnimationFrame(() => this.syncPreviewFit());
      setTimeout(() => this.syncPreviewFit(), 80);
      setTimeout(() => this.syncPreviewFit(), 400);
    } catch (err) {
      host.replaceChildren();
      stage.classList.remove("real-ready");
      stage.classList.add("real-failed");
      stage.style.height = "";
      if (error) {
        error.textContent = `Realne vykresleni se nepovedlo, pouzivam nouzovy nahled: ${
          err?.message || err
        }`;
      }
      requestAnimationFrame(() => this.syncPreviewFit());
    }
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
    const dimensions = this.previewDimensions();
    const presetGroups = this.previewPresets().reduce((groups, preset) => {
      groups[preset.group] = groups[preset.group] || [];
      groups[preset.group].push(preset);
      return groups;
    }, {});
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
        <select id="previewSize" title="Velikost nahledu">
          ${Object.entries(presetGroups)
            .map(([group, presets]) => {
              const options = presets
                .map(
                  (item) =>
                    `<option value="${item.key}" ${item.key === this.state.previewSize ? "selected" : ""}>
                      ${this.escape(item.label)}
                    </option>`
                )
                .join("");
              return `<optgroup label="${this.escape(group)}">${options}</optgroup>`;
            })
            .join("")}
        </select>
        <select id="previewOrientation" title="Orientace nahledu">
          <option value="portrait" ${this.state.previewOrientation === "portrait" ? "selected" : ""}>Na vysku</option>
          <option value="landscape" ${this.state.previewOrientation === "landscape" ? "selected" : ""}>Na sirku</option>
        </select>
        <span>${visibleCount} prvku s pozici</span>
      </div>
      <div class="preview-frame">
        <div id="previewFit" class="preview-fit">
          <div class="plan-stage" style="width:${dimensions.width}px;" data-viewport="${dimensions.width}x${dimensions.height}">
            <div id="realCardHost" class="real-card-host"></div>
            <div class="fallback-preview">
              ${
                image
                  ? `<img class="plan-bg" src="${this.escape(image)}" alt="">`
                  : `<div class="missing-bg">Karta nema obrazek v poli image.</div>`
              }
            </div>
            <div class="edit-overlay">
              ${elements}
            </div>
          </div>
        </div>
        <div id="previewRenderError" class="preview-render-error"></div>
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
          <div class="advanced-actions">
            <button id="openAdvancedModal" type="button">Zvetsit editor</button>
            <button id="saveAdvanced" type="button" ${this.state.loading ? "disabled" : ""}>Ulozit YAML fragment</button>
          </div>
        </details>
      </section>
    `;
  }

  renderAdvancedModal() {
    const element = this.currentElement();
    if (!this.state.advancedExpanded || !element) return "";

    return `
      <div id="advancedModalBackdrop" class="modal-backdrop">
        <section class="yaml-modal" role="dialog" aria-modal="true" aria-label="Pokrocily YAML fragment">
          <div class="yaml-modal-head">
            <div>
              <h2>${this.escape(this.displayLabel(element))}</h2>
              <p>Pokrocily YAML fragment</p>
            </div>
            <button id="closeAdvancedModal" type="button">Zavrit</button>
          </div>
          <textarea id="advancedModalText" spellcheck="false">${this.escape(this.state.advancedText)}</textarea>
          <div class="yaml-modal-actions">
            <button id="saveAdvancedModal" class="primary" type="button" ${this.state.loading ? "disabled" : ""}>Ulozit YAML fragment</button>
          </div>
        </section>
      </div>
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
    const totalPositioned = card.elements.filter((element) =>
      this.hasPosition((element.config || {}).style || {})
    ).length;

    return `
      <section class="element-list">
        <div class="element-list-head">
          <h2>Prvky</h2>
          <span>${items.length}/${totalPositioned}</span>
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
              return `
                <button
                  class="element-list-item ${selected ? "selected" : ""}"
                  data-card-index="${this.state.cardIndex}"
                  data-element-index="${index}"
                >
                  <span class="element-list-title">${this.escape(this.displayLabel(element))}</span>
                  <span class="element-list-meta">${this.escape(this.elementSummary(element))}</span>
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
        ${this.renderAdvancedModal()}
      </div>
    `;
    this.bindEvents();
    this.mountRealCard();
    this.syncPreviewFit();
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

    const previewSize = this.shadowRoot.querySelector("#previewSize");
    previewSize?.addEventListener("change", (event) => {
      this.state.previewSize = event.target.value;
      this.render();
    });

    const previewOrientation = this.shadowRoot.querySelector("#previewOrientation");
    previewOrientation?.addEventListener("change", (event) => {
      this.state.previewOrientation = event.target.value;
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

    this.shadowRoot.querySelector("#openAdvancedModal")?.addEventListener("click", () => {
      this.state.advancedExpanded = true;
      this.render();
    });
    this.shadowRoot.querySelector("#closeAdvancedModal")?.addEventListener("click", () => {
      this.state.advancedExpanded = false;
      this.render();
    });
    this.shadowRoot.querySelector("#advancedModalBackdrop")?.addEventListener("click", (event) => {
      if (event.target.id === "advancedModalBackdrop") {
        this.state.advancedExpanded = false;
        this.render();
      }
    });
    this.shadowRoot
      .querySelector("#saveAdvancedModal")
      ?.addEventListener("click", () => this.saveSelected(true));

    this.shadowRoot.querySelector("#advancedText")?.addEventListener("input", (event) => {
      this.state.advancedText = event.target.value;
      this.state.advancedDirty = true;
      this.state.status = "YAML fragment je upraveny, jeste ulozit.";
    });
    this.shadowRoot.querySelector("#advancedModalText")?.addEventListener("input", (event) => {
      this.state.advancedText = event.target.value;
      this.state.advancedDirty = true;
      this.state.status = "YAML fragment je upraveny, jeste ulozit.";
      const inline = this.shadowRoot.querySelector("#advancedText");
      if (inline) inline.value = event.target.value;
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
    max-height: 460px;
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
    flex: 0 1 420px;
    max-width: 420px;
  }

  #previewSize {
    flex: 0 0 260px;
  }

  #previewOrientation {
    flex: 0 0 120px;
  }

  .preview-toolbar span {
    color: var(--vde-muted);
    font-size: 13px;
    margin-left: auto;
    white-space: nowrap;
  }

  .preview-frame {
    max-width: 100%;
    overflow: hidden;
    padding-bottom: 8px;
  }

  .preview-fit {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    min-height: 220px;
  }

  .plan-stage {
    position: relative;
    flex: 0 0 auto;
    max-width: none;
    min-height: 220px;
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
    transform: scale(var(--preview-scale, 1));
    transform-origin: top center;
  }

  .real-card-host {
    position: relative;
    z-index: 1;
    pointer-events: none;
  }

  .real-card-host > * {
    display: block;
    width: 100%;
  }

  .fallback-preview {
    position: relative;
    z-index: 1;
  }

  .plan-stage.real-ready .fallback-preview {
    display: none;
  }

  .plan-bg {
    display: block;
    width: 100%;
    height: auto;
    object-fit: contain;
    background: var(--vde-panel);
  }

  .edit-overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
  }

  .preview-render-error {
    margin-top: 8px;
    color: var(--vde-muted);
    font-size: 12px;
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
    align-items: flex-start;
    justify-content: flex-start;
    min-width: 28px;
    min-height: 28px;
    padding: 0;
    border: 0;
    background: transparent;
    color: white;
    box-shadow: none;
    overflow: visible;
    touch-action: none;
    pointer-events: auto;
  }

  .plan-element.has-explicit-size {
    padding: 0;
  }

  .plan-element.selected {
    z-index: 1000;
  }

  .element-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    min-height: 24px;
    max-width: 170px;
    padding: 4px 8px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 6px;
    background: rgba(8, 18, 26, 0.88);
    color: #ffffff;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.28);
    opacity: 0;
    pointer-events: none;
    transform: translateY(-3px);
    transition: opacity 120ms ease, transform 120ms ease;
  }

  .chip-icon {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
  }

  .chip-label {
    min-width: 0;
    max-width: 130px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 11px;
    font-weight: 700;
    line-height: 1.15;
  }

  .element-area {
    min-width: 38px;
    min-height: 28px;
    border: 0;
    border-radius: 5px;
    background: transparent;
    box-shadow: none;
  }

  .element-area .element-chip {
    margin: 4px;
    max-width: calc(100% - 8px);
  }

  .element-area .chip-label {
    max-width: calc(100% - 24px);
  }

  .element-marker {
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    box-shadow: none;
  }

  .element-marker .element-chip {
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translate(-50%, 3px);
  }

  .plan-element:hover .element-chip,
  .plan-element.selected .element-chip {
    opacity: 1;
    transform: translateY(0);
  }

  .element-marker:hover .element-chip,
  .element-marker.selected .element-chip {
    transform: translate(-50%, 5px);
  }

  .element-area:hover {
    background: transparent;
  }

  .element-marker.selected .element-chip,
  .element-area.selected .element-chip {
    border-color: rgba(59, 130, 246, 0.78);
    box-shadow: 0 3px 14px rgba(59, 130, 246, 0.2);
  }

  .nested-element::after {
    content: none;
  }

  .ha-like-icon {
    width: 20px;
    height: 20px;
    flex: 0 0 auto;
  }

  img.element-image {
    display: none;
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

  .advanced-actions,
  .yaml-modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 10px;
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: grid;
    place-items: center;
    padding: 28px;
    background: rgba(0, 0, 0, 0.58);
  }

  .yaml-modal {
    width: min(1180px, 94vw);
    height: min(820px, 88vh);
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    border: 1px solid var(--vde-line);
    border-radius: 8px;
    background: var(--vde-panel);
    color: var(--vde-text);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.42);
    padding: 16px;
  }

  .yaml-modal-head {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 12px;
  }

  .yaml-modal-head p {
    color: var(--vde-muted);
    font-size: 13px;
  }

  #advancedModalText {
    min-height: 0;
    height: 100%;
    resize: none;
    font-size: 13px;
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
