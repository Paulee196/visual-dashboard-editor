const DOMAIN = "visual_dashboard_editor";
const UI_VERSION = "0.3.1";
const ELEMENT_NAME = "visual-dashboard-editor-panel-v22";

const TRANSLATIONS = {
  cs: {
    "status.selectDashboard": "Vyber dashboard.",
    "status.selectAndLoad": "Vyber dashboard a načti náhled.",
    "status.noDashboardsFound": "Nenašel jsem žádný dashboard s kartou picture-elements.",
    "status.loadedCards": "Načteno: {count} picture-elements karta/karet.",
    "status.loadedNoPicture": "Dashboard je načtený, ale nenašel jsem picture-elements kartu.",
    "status.selected": "Vybráno: {name}",
    "status.changesReady": "Změny jsou připravené k uložení.",
    "status.savedWithBackup": "Uloženo. Backup: {path}",
    "status.saved": "Uloženo.",
    "status.moved": "Prvek posunut, ještě uložit.",
    "status.resized": "Velikost upravena, ještě uložit.",
    "status.responsiveSized": "Aktuální velikost je uložená jako responzivní procenta.",
    "status.undo": "Vráceno: {name}",
    "status.undoEmpty": "Není co vrátit.",
    "status.deleted": "Prvek smazán: {name}. Můžeš ho vrátit tlačítkem Zpět.",
    "status.yamlDirty": "YAML fragment je upravený, ještě uložit.",
    "status.added": "Prvek přidán: {name}",
    "status.realRenderFailed": "Reálné vykreslení se nepovedlo, používám nouzový náhled: {error}",
    "error.apiNotReady": "Home Assistant API ještě není připravené.",
    "ui.working": "Pracuji...",
    "ui.unsaved": "Neuloženo",
    "ui.previewSize": "Velikost náhledu",
    "ui.previewOrientation": "Orientace náhledu",
    "ui.portrait": "Na výšku",
    "ui.landscape": "Na šířku",
    "ui.previewScale": "Měřítko náhledu",
    "ui.fitWhole": "Vejít celé",
    "ui.actualCssPx": "1:1 CSS px",
    "ui.showHitboxes": "Zobrazit klikací plochy",
    "ui.showHitboxesTitle": "Zobrazí reálné neviditelné plochy, které editor používá pro klikání.",
    "ui.positionedCount": "{width} x {height} CSS px - {count} prvků s pozicí",
    "ui.officialPreview": "Oficiální náhled dashboardu",
    "ui.missingImage": "Karta nemá obrázek v poli image.",
    "ui.emptyDashboard": "Vyber dashboard s kartou picture-elements.",
    "ui.inspector": "Inspector",
    "ui.inspectorHelp": "Klikni na prvek v náhledu. Tady se objeví jeho pozice, velikost a kódový fragment.",
    "ui.line": "řádek {line}",
    "ui.save": "Uložit",
    "ui.undo": "Zpět",
    "ui.undoTitle": "Vrátit poslední změnu",
    "ui.delete": "Smazat",
    "ui.deleteTitle": "Smazat vybraný prvek",
    "ui.deleteConfirm": "Opravdu smazat prvek \"{name}\"? Půjde vrátit tlačítkem Zpět.",
    "ui.entity": "Entity",
    "ui.icon": "Ikona",
    "ui.leftPercent": "Vlevo %",
    "ui.topPercent": "Nahoře %",
    "ui.widthPercent": "Šířka %",
    "ui.heightPercent": "Výška %",
    "ui.opacity": "Průhlednost",
    "ui.zIndex": "Z-index",
    "ui.color": "Barva textu / ikony",
    "ui.background": "Barva pozadí",
    "ui.colorPlaceholder": "#ffffff, red nebo var(...)",
    "ui.addElement": "Přidat prvek",
    "ui.addElementTitle": "Přidat nový prvek do aktuální picture-elements karty",
    "ui.addElementHelp": "Nový prvek se po uložení vloží na konec pole elements aktuální karty.",
    "ui.basic": "Základní",
    "ui.yaml": "YAML",
    "ui.elementType": "Typ prvku",
    "ui.name": "Popis / název",
    "ui.createElement": "Vytvořit prvek",
    "ui.initialYaml": "YAML nového prvku",
    "ui.addWithYaml": "Vytvořit z YAML",
    "ui.transform": "Transform",
    "ui.image": "Image",
    "ui.nudge": "Posun",
    "ui.nudgeFine": "Jemně 0,1 %",
    "ui.nudgeCoarse": "Rychle 1 %",
    "ui.nudgeLeft": "Posunout vlevo",
    "ui.nudgeRight": "Posunout vpravo",
    "ui.nudgeUp": "Posunout nahoru",
    "ui.nudgeDown": "Posunout dolů",
    "ui.keyboardNudgeHelp": "Šipky posouvají o 0,1 %, Shift + šipky o 1 %.",
    "ui.sizeTools": "Velikost",
    "ui.sizeHelp": "Mění width/height v procentech. Pro floorplan se procenta škálují s plánkem na mobilu i monitoru.",
    "ui.sizeFine": "Jemně 0,1 %",
    "ui.sizeCoarse": "Rychle 1 %",
    "ui.sizeAll": "Celek",
    "ui.sizeWidth": "Šířka",
    "ui.sizeHeight": "Výška",
    "ui.shrink": "Zmenšit",
    "ui.grow": "Zvětšit",
    "ui.responsivePercent": "Aktuální velikost jako %",
    "ui.responsivePercentTitle": "Převede aktuálně vykreslenou šířku a případnou explicitní výšku na procenta vůči plánku, aby se prvek škáloval s dashboardem.",
    "ui.advancedYaml": "Pokročilý YAML fragment",
    "ui.expandEditor": "Zvětšit editor",
    "ui.saveYamlFragment": "Uložit YAML fragment",
    "ui.close": "Zavřít",
    "ui.dashboards": "Dashboardy",
    "ui.refreshList": "Obnovit",
    "ui.refreshListTitle": "Obnovit seznam",
    "ui.chooseDashboard": "Vyber dashboard...",
    "ui.load": "Načíst",
    "ui.dashboardHelp": "Editor zobrazuje jen dashboardy, ve kterých našel kartu picture-elements.",
    "ui.elements": "Prvky",
    "ui.searchElement": "Hledat prvek",
    "filter.all": "Vše",
    "filter.visible": "Viditelné teď",
    "filter.hotspots": "Hotspoty",
    "filter.widgets": "Text/widgety",
    "filter.images": "Obrázky",
    "filter.conditional": "Podmíněné",
    "file.cards": "{count} karet",
    "file.ui": "UI",
    "file.uiDashboard": "UI dashboard",
    "file.yamlDashboard": "YAML dashboard",
    "group.phones": "Telefony",
    "group.tablets": "Tablety",
    "group.displays": "Obrazovky",
    "preset.compactTablet": "kompaktní tablet",
    "preset.notebook": "notebook",
    "preset.monitorFullHd": "monitor Full HD",
    "preset.monitorQhd": "monitor QHD",
    "preset.monitor4k": "monitor 4K",
    "label.leftPanel": "Levý panel",
    "label.vacuumBob": "Vysavač Bob",
    "label.tv": "TV",
    "label.doorOpening": "Otevírání dveří",
    "label.music": "Hudba",
    "label.settings": "Nastavení",
    "label.energy": "Energie",
    "label.washerDryer": "Pračka / sušička",
    "label.light": "Světlo",
    "label.timeDate": "Čas a datum",
    "label.calendar": "Kalendář",
    "label.householdStatus": "Stav domácnosti",
    "label.transit": "Škola SNP MHD",
    "label.persons": "Osoby",
    "label.livingClimate": "Obývák klima",
    "label.bedroomClimate": "Ložnice klima",
    "label.bathroomClimate": "Koupelna klima",
    "label.temperatureClimate": "Teplota / klima",
    "label.outdoorClimate": "Venkovní klima",
    "label.batteries": "Baterie",
    "label.availability": "Dostupnost zařízení",
    "label.guestSettings": "Nastavení hostů",
    "summary.hotspot": "hotspot",
    "summary.conditionPrefix": "Podmínka:",
  },
  en: {
    "status.selectDashboard": "Select a dashboard.",
    "status.selectAndLoad": "Select a dashboard and load the preview.",
    "status.noDashboardsFound": "No dashboard with a picture-elements card was found.",
    "status.loadedCards": "Loaded: {count} picture-elements card(s).",
    "status.loadedNoPicture": "Dashboard loaded, but no picture-elements card was found.",
    "status.selected": "Selected: {name}",
    "status.changesReady": "Changes are ready to save.",
    "status.savedWithBackup": "Saved. Backup: {path}",
    "status.saved": "Saved.",
    "status.moved": "Element moved, save still needed.",
    "status.resized": "Size changed, save still needed.",
    "status.responsiveSized": "Current size is stored as responsive percentages.",
    "status.undo": "Restored: {name}",
    "status.undoEmpty": "Nothing to undo.",
    "status.deleted": "Element deleted: {name}. You can restore it with Undo.",
    "status.yamlDirty": "YAML fragment edited, save still needed.",
    "status.added": "Element added: {name}",
    "status.realRenderFailed": "Real rendering failed, using fallback preview: {error}",
    "error.apiNotReady": "Home Assistant API is not ready yet.",
    "ui.working": "Working...",
    "ui.unsaved": "Unsaved",
    "ui.previewSize": "Preview size",
    "ui.previewOrientation": "Preview orientation",
    "ui.portrait": "Portrait",
    "ui.landscape": "Landscape",
    "ui.previewScale": "Preview scale",
    "ui.fitWhole": "Fit whole",
    "ui.actualCssPx": "1:1 CSS px",
    "ui.showHitboxes": "Show click areas",
    "ui.showHitboxesTitle": "Shows the real invisible areas the editor uses for clicking.",
    "ui.positionedCount": "{width} x {height} CSS px - {count} positioned elements",
    "ui.officialPreview": "Official dashboard preview",
    "ui.missingImage": "The card has no image field.",
    "ui.emptyDashboard": "Select a dashboard with a picture-elements card.",
    "ui.inspector": "Inspector",
    "ui.inspectorHelp": "Click an element in the preview. Its position, size and code fragment will appear here.",
    "ui.line": "line {line}",
    "ui.save": "Save",
    "ui.undo": "Undo",
    "ui.undoTitle": "Undo the last change",
    "ui.delete": "Delete",
    "ui.deleteTitle": "Delete the selected element",
    "ui.deleteConfirm": "Delete element \"{name}\"? You can restore it with Undo.",
    "ui.entity": "Entity",
    "ui.icon": "Icon",
    "ui.leftPercent": "Left %",
    "ui.topPercent": "Top %",
    "ui.widthPercent": "Width %",
    "ui.heightPercent": "Height %",
    "ui.opacity": "Opacity",
    "ui.zIndex": "Z-index",
    "ui.color": "Text / icon color",
    "ui.background": "Background color",
    "ui.colorPlaceholder": "#ffffff, red or var(...)",
    "ui.addElement": "Add element",
    "ui.addElementTitle": "Add a new element to the current picture-elements card",
    "ui.addElementHelp": "The new element is saved at the end of the current card's elements list.",
    "ui.basic": "Basic",
    "ui.yaml": "YAML",
    "ui.elementType": "Element type",
    "ui.name": "Description / name",
    "ui.createElement": "Create element",
    "ui.initialYaml": "New element YAML",
    "ui.addWithYaml": "Create from YAML",
    "ui.transform": "Transform",
    "ui.image": "Image",
    "ui.nudge": "Nudge",
    "ui.nudgeFine": "Fine 0.1%",
    "ui.nudgeCoarse": "Fast 1%",
    "ui.nudgeLeft": "Move left",
    "ui.nudgeRight": "Move right",
    "ui.nudgeUp": "Move up",
    "ui.nudgeDown": "Move down",
    "ui.keyboardNudgeHelp": "Arrow keys move by 0.1%, Shift + arrows by 1%.",
    "ui.sizeTools": "Size",
    "ui.sizeHelp": "Changes width/height in percentages. In floorplans, percentages scale with the plan on phones and monitors.",
    "ui.sizeFine": "Fine 0.1%",
    "ui.sizeCoarse": "Fast 1%",
    "ui.sizeAll": "Whole",
    "ui.sizeWidth": "Width",
    "ui.sizeHeight": "Height",
    "ui.shrink": "Shrink",
    "ui.grow": "Grow",
    "ui.responsivePercent": "Current size as %",
    "ui.responsivePercentTitle": "Converts the currently rendered width and any explicit height to percentages relative to the plan so the element scales with the dashboard.",
    "ui.advancedYaml": "Advanced YAML fragment",
    "ui.expandEditor": "Expand editor",
    "ui.saveYamlFragment": "Save YAML fragment",
    "ui.close": "Close",
    "ui.dashboards": "Dashboards",
    "ui.refreshList": "Refresh",
    "ui.refreshListTitle": "Refresh list",
    "ui.chooseDashboard": "Select dashboard...",
    "ui.load": "Load",
    "ui.dashboardHelp": "The editor shows only dashboards where it found a picture-elements card.",
    "ui.elements": "Elements",
    "ui.searchElement": "Search element",
    "filter.all": "All",
    "filter.visible": "Visible now",
    "filter.hotspots": "Hotspots",
    "filter.widgets": "Text/widgets",
    "filter.images": "Images",
    "filter.conditional": "Conditional",
    "file.cards": "{count} cards",
    "file.ui": "UI",
    "file.uiDashboard": "UI dashboard",
    "file.yamlDashboard": "YAML dashboard",
    "group.phones": "Phones",
    "group.tablets": "Tablets",
    "group.displays": "Displays",
    "preset.compactTablet": "compact tablet",
    "preset.notebook": "notebook",
    "preset.monitorFullHd": "Full HD monitor",
    "preset.monitorQhd": "QHD monitor",
    "preset.monitor4k": "4K monitor",
    "label.leftPanel": "Left panel",
    "label.vacuumBob": "Vacuum Bob",
    "label.tv": "TV",
    "label.doorOpening": "Door opening",
    "label.music": "Music",
    "label.settings": "Settings",
    "label.energy": "Energy",
    "label.washerDryer": "Washer / dryer",
    "label.light": "Light",
    "label.timeDate": "Time and date",
    "label.calendar": "Calendar",
    "label.householdStatus": "Household status",
    "label.transit": "School SNP transit",
    "label.persons": "People",
    "label.livingClimate": "Living room climate",
    "label.bedroomClimate": "Bedroom climate",
    "label.bathroomClimate": "Bathroom climate",
    "label.temperatureClimate": "Temperature / climate",
    "label.outdoorClimate": "Outdoor climate",
    "label.batteries": "Batteries",
    "label.availability": "Device availability",
    "label.guestSettings": "Guest settings",
    "summary.hotspot": "hotspot",
    "summary.conditionPrefix": "Condition:",
  },
  de: {
    "status.selectDashboard": "Dashboard auswählen.",
    "status.selectAndLoad": "Dashboard auswählen und Vorschau laden.",
    "status.noDashboardsFound": "Kein Dashboard mit einer picture-elements-Karte gefunden.",
    "status.loadedCards": "Geladen: {count} picture-elements-Karte(n).",
    "status.loadedNoPicture": "Dashboard geladen, aber keine picture-elements-Karte gefunden.",
    "status.selected": "Ausgewählt: {name}",
    "status.changesReady": "Änderungen sind zum Speichern bereit.",
    "status.savedWithBackup": "Gespeichert. Backup: {path}",
    "status.saved": "Gespeichert.",
    "status.moved": "Element verschoben, Speichern ist noch nötig.",
    "status.resized": "Größe geändert, Speichern ist noch nötig.",
    "status.responsiveSized": "Aktuelle Größe ist als responsive Prozentwerte gespeichert.",
    "status.undo": "Wiederhergestellt: {name}",
    "status.undoEmpty": "Nichts zum Rückgängig machen.",
    "status.deleted": "Element gelöscht: {name}. Du kannst es mit Rückgängig wiederherstellen.",
    "status.yamlDirty": "YAML-Fragment geändert, Speichern ist noch nötig.",
    "status.added": "Element hinzugefügt: {name}",
    "status.realRenderFailed": "Echtes Rendering fehlgeschlagen, Fallback-Vorschau wird verwendet: {error}",
    "error.apiNotReady": "Die Home Assistant API ist noch nicht bereit.",
    "ui.working": "Arbeite...",
    "ui.unsaved": "Nicht gespeichert",
    "ui.previewSize": "Vorschaugröße",
    "ui.previewOrientation": "Vorschauausrichtung",
    "ui.portrait": "Hochformat",
    "ui.landscape": "Querformat",
    "ui.previewScale": "Vorschaumaßstab",
    "ui.fitWhole": "Ganz einpassen",
    "ui.actualCssPx": "1:1 CSS px",
    "ui.showHitboxes": "Klickflächen anzeigen",
    "ui.showHitboxesTitle": "Zeigt die echten unsichtbaren Flächen, die der Editor zum Klicken verwendet.",
    "ui.positionedCount": "{width} x {height} CSS px - {count} positionierte Elemente",
    "ui.officialPreview": "Offizielle Dashboard-Vorschau",
    "ui.missingImage": "Die Karte hat kein image-Feld.",
    "ui.emptyDashboard": "Wähle ein Dashboard mit einer picture-elements-Karte.",
    "ui.inspector": "Inspektor",
    "ui.inspectorHelp": "Klicke ein Element in der Vorschau an. Position, Größe und Codefragment erscheinen hier.",
    "ui.line": "Zeile {line}",
    "ui.save": "Speichern",
    "ui.undo": "Rückgängig",
    "ui.undoTitle": "Letzte Änderung rückgängig machen",
    "ui.delete": "Löschen",
    "ui.deleteTitle": "Ausgewähltes Element löschen",
    "ui.deleteConfirm": "Element \"{name}\" löschen? Du kannst es mit Rückgängig wiederherstellen.",
    "ui.entity": "Entität",
    "ui.icon": "Icon",
    "ui.leftPercent": "Links %",
    "ui.topPercent": "Oben %",
    "ui.widthPercent": "Breite %",
    "ui.heightPercent": "Höhe %",
    "ui.opacity": "Deckkraft",
    "ui.zIndex": "Z-index",
    "ui.color": "Text-/Icon-Farbe",
    "ui.background": "Hintergrundfarbe",
    "ui.colorPlaceholder": "#ffffff, red oder var(...)",
    "ui.addElement": "Element hinzufügen",
    "ui.addElementTitle": "Neues Element zur aktuellen picture-elements-Karte hinzufügen",
    "ui.addElementHelp": "Das neue Element wird am Ende der elements-Liste der aktuellen Karte gespeichert.",
    "ui.basic": "Basis",
    "ui.yaml": "YAML",
    "ui.elementType": "Elementtyp",
    "ui.name": "Beschreibung / Name",
    "ui.createElement": "Element erstellen",
    "ui.initialYaml": "YAML für neues Element",
    "ui.addWithYaml": "Aus YAML erstellen",
    "ui.transform": "Transform",
    "ui.image": "Image",
    "ui.nudge": "Verschieben",
    "ui.nudgeFine": "Fein 0,1 %",
    "ui.nudgeCoarse": "Schnell 1 %",
    "ui.nudgeLeft": "Nach links verschieben",
    "ui.nudgeRight": "Nach rechts verschieben",
    "ui.nudgeUp": "Nach oben verschieben",
    "ui.nudgeDown": "Nach unten verschieben",
    "ui.keyboardNudgeHelp": "Pfeiltasten verschieben um 0,1 %, Shift + Pfeiltasten um 1 %.",
    "ui.sizeTools": "Größe",
    "ui.sizeHelp": "Ändert width/height in Prozent. Bei Floorplans skalieren Prozentwerte mit dem Plan auf Telefon und Monitor.",
    "ui.sizeFine": "Fein 0,1 %",
    "ui.sizeCoarse": "Schnell 1 %",
    "ui.sizeAll": "Ganzes Element",
    "ui.sizeWidth": "Breite",
    "ui.sizeHeight": "Höhe",
    "ui.shrink": "Verkleinern",
    "ui.grow": "Vergrößern",
    "ui.responsivePercent": "Aktuelle Größe als %",
    "ui.responsivePercentTitle": "Wandelt die aktuell gerenderte Breite und eine explizite Höhe in Prozent relativ zum Plan um, damit das Element mit dem Dashboard skaliert.",
    "ui.advancedYaml": "Erweitertes YAML-Fragment",
    "ui.expandEditor": "Editor vergrößern",
    "ui.saveYamlFragment": "YAML-Fragment speichern",
    "ui.close": "Schließen",
    "ui.dashboards": "Dashboards",
    "ui.refreshList": "Aktualisieren",
    "ui.refreshListTitle": "Liste aktualisieren",
    "ui.chooseDashboard": "Dashboard auswählen...",
    "ui.load": "Laden",
    "ui.dashboardHelp": "Der Editor zeigt nur Dashboards, in denen eine picture-elements-Karte gefunden wurde.",
    "ui.elements": "Elemente",
    "ui.searchElement": "Element suchen",
    "filter.all": "Alle",
    "filter.visible": "Jetzt sichtbar",
    "filter.hotspots": "Hotspots",
    "filter.widgets": "Text/Widgets",
    "filter.images": "Bilder",
    "filter.conditional": "Bedingt",
    "file.cards": "{count} Karten",
    "file.ui": "UI",
    "file.uiDashboard": "UI-Dashboard",
    "file.yamlDashboard": "YAML-Dashboard",
    "group.phones": "Telefone",
    "group.tablets": "Tablets",
    "group.displays": "Bildschirme",
    "preset.compactTablet": "kompaktes Tablet",
    "preset.notebook": "Notebook",
    "preset.monitorFullHd": "Full-HD-Monitor",
    "preset.monitorQhd": "QHD-Monitor",
    "preset.monitor4k": "4K-Monitor",
    "label.leftPanel": "Linkes Panel",
    "label.vacuumBob": "Staubsauger Bob",
    "label.tv": "TV",
    "label.doorOpening": "Türöffnung",
    "label.music": "Musik",
    "label.settings": "Einstellungen",
    "label.energy": "Energie",
    "label.washerDryer": "Waschmaschine / Trockner",
    "label.light": "Licht",
    "label.timeDate": "Uhrzeit und Datum",
    "label.calendar": "Kalender",
    "label.householdStatus": "Haushaltsstatus",
    "label.transit": "Schule SNP ÖPNV",
    "label.persons": "Personen",
    "label.livingClimate": "Wohnzimmer Klima",
    "label.bedroomClimate": "Schlafzimmer Klima",
    "label.bathroomClimate": "Badezimmer Klima",
    "label.temperatureClimate": "Temperatur / Klima",
    "label.outdoorClimate": "Außenklima",
    "label.batteries": "Batterien",
    "label.availability": "Geräteverfügbarkeit",
    "label.guestSettings": "Gäste-Einstellungen",
    "summary.hotspot": "Hotspot",
    "summary.conditionPrefix": "Bedingung:",
  },
};

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
      addElementOpen: false,
      addElementMode: "basic",
      addElementYaml: "",
      elementFilter: "",
      elementTypeFilter: "visible",
      previewSize: "display-24",
      previewOrientation: "landscape",
      previewScaleMode: "fit",
      showHitboxes: false,
      undoStack: [],
      dirty: false,
      loading: false,
      statusKey: "status.selectDashboard",
      statusParams: {},
      error: "",
    };
    this._locallyEditedElementKeys = new Set();
    this._locallyStyledElementKeys = new Set();
    this._renderedElementIndexesByKey = new Map();
  }

  set hass(value) {
    const previousLanguage = this.languageCode();
    this._hass = value;
    if (this._realCard) {
      this._realCard.hass = value;
    }
    const nextLanguage = this.languageCode();
    if (this.isConnected && previousLanguage && previousLanguage !== nextLanguage) {
      this.render();
    }
  }

  get hass() {
    return this._hass;
  }

  languageCode() {
    const raw =
      this.hass?.locale?.language ||
      this.hass?.language ||
      this.hass?.selectedLanguage ||
      navigator.language ||
      "cs";
    const code = String(raw).toLowerCase().replace("_", "-").split("-")[0];
    if (code === "cz") return "cs";
    return TRANSLATIONS[code] ? code : "en";
  }

  t(key, params = {}) {
    const language = this.languageCode();
    const text = TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || TRANSLATIONS.cs[key] || key;
    return text.replace(/\{(\w+)\}/g, (_match, name) => String(params[name] ?? ""));
  }

  setStatus(key, params = {}) {
    this.state.statusKey = key;
    this.state.statusParams = params;
  }

  statusText() {
    return this.t(this.state.statusKey || "status.selectDashboard", this.state.statusParams || {});
  }

  connectedCallback() {
    this._onResize = () => this.syncPreviewFit();
    this._onKeyDown = (event) => this.handleKeyDown(event);
    window.addEventListener("resize", this._onResize);
    window.addEventListener("keydown", this._onKeyDown);
    this.render();
    this.loadFiles();
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this._onResize);
    window.removeEventListener("keydown", this._onKeyDown);
    this._frameResizeObserver?.disconnect();
    this._overlaySyncTimer && clearInterval(this._overlaySyncTimer);
  }

  async callWS(message) {
    if (!this.hass) {
      throw new Error(this.t("error.apiNotReady"));
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
      this.setStatus(
        this.state.files.length ? "status.selectAndLoad" : "status.noDashboardsFound"
      );
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
    this.state.addElementOpen = false;
    this.clearLocalEditTracking();
    this.render();
    try {
      const result = await this.callWS({
        type: `${DOMAIN}/load_file`,
        path,
      });
      this.state.cards = result.cards || [];
      this.state.cardIndex = 0;
      this.state.undoStack = [];
      this.state.dirty = false;
      this.setStatus(
        this.state.cards.length ? "status.loadedCards" : "status.loadedNoPicture",
        { count: this.state.cards.length }
      );
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

  pathKey(path) {
    return Array.isArray(path) ? path.map((part) => String(part)).join("\u001f") : "";
  }

  clearLocalEditTracking() {
    this._locallyEditedElementKeys = new Set();
    this._locallyStyledElementKeys = new Set();
    this._renderedElementIndexesByKey = new Map();
  }

  markElementLocallyEdited(element) {
    const key = this.pathKey(element?.path);
    if (key) this._locallyEditedElementKeys.add(key);
  }

  isElementLocallyEdited(element) {
    const key = this.pathKey(element?.path);
    return Boolean(key && this._locallyEditedElementKeys?.has(key));
  }

  markElementLocallyStyled(element) {
    const key = this.pathKey(element?.path);
    if (key) this._locallyStyledElementKeys.add(key);
  }

  isElementLocallyStyled(element) {
    const key = this.pathKey(element?.path);
    return Boolean(key && this._locallyStyledElementKeys?.has(key));
  }

  styleFieldAffectsGeometry(path) {
    return ["style.left", "style.top", "style.width", "style.height", "style.transform"].includes(path);
  }

  rememberRenderedElementIndex(element, index) {
    const key = this.pathKey(element?.path);
    if (key && Number.isInteger(index)) {
      this._renderedElementIndexesByKey.set(key, index);
    }
  }

  rememberedRenderedElementIndex(element) {
    const key = this.pathKey(element?.path);
    return key ? this._renderedElementIndexesByKey?.get(key) : undefined;
  }

  setSelectedElement(cardIndex, elementIndex) {
    const card = this.state.cards[cardIndex];
    const element = card && card.elements[elementIndex];
    if (!element) return null;
    this.state.cardIndex = cardIndex;
    this.state.selectedElementPath = [...element.path];
    this.state.advancedText = element.fragment || "";
    this.state.advancedDirty = false;
    this.setStatus("status.selected", { name: this.displayLabel(element) });
    return element;
  }

  selectElement(cardIndex, elementIndex) {
    const element = this.setSelectedElement(cardIndex, elementIndex);
    if (!element) return;
    this.render();
  }

  updateField(path, value) {
    const element = this.currentElement();
    if (!element) return;
    this.pushUndo(element);
    const isStyleField = path.startsWith("style.");
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
    this.setStatus("status.changesReady");
    if (isStyleField) {
      this.markElementLocallyStyled(element);
      if (this.styleFieldAffectsGeometry(path)) {
        this.markElementLocallyEdited(element);
      }
      this.updateSelectedElementDom(element);
      return;
    }
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

  undoSnapshot(element = this.currentElement(), action = "update") {
    if (!element) return null;
    return {
      action,
      path: [...element.path],
      config: this.cloneConfig(element.config),
      advancedText: element.fragment || "",
      label: this.displayLabel(element),
    };
  }

  pushUndoSnapshot(snapshot) {
    if (!snapshot) return;
    const signature = JSON.stringify(snapshot);
    const last = this.state.undoStack[this.state.undoStack.length - 1];
    if (last?.signature === signature) return;
    this.state.undoStack = [
      ...this.state.undoStack,
      { ...snapshot, signature },
    ].slice(-30);
  }

  pushUndo(element = this.currentElement(), action = "update") {
    this.pushUndoSnapshot(this.undoSnapshot(element, action));
  }

  async undoLastChange() {
    const snapshot = this.state.undoStack.pop();
    if (!snapshot) {
      this.setStatus("status.undoEmpty");
      this.render();
      return;
    }

    if (snapshot.action === "delete") {
      await this.restoreDeletedElement(snapshot);
      return;
    }

    const card = this.currentCard();
    const element = card?.elements?.find((candidate) =>
      this.samePath(candidate.path, snapshot.path)
    );
    if (!element) {
      this.setStatus("status.undoEmpty");
      this.render();
      return;
    }

    element.config = this.cloneConfig(snapshot.config);
    element.fragment = snapshot.advancedText || "";
    this.state.selectedElementPath = [...snapshot.path];
    this.state.advancedText = element.fragment || "";
    this.state.advancedDirty = false;
    this.state.dirty = true;
    this.markElementLocallyEdited(element);
    this.markElementLocallyStyled(element);
    this.setStatus("status.undo", { name: snapshot.label || this.displayLabel(element) });
    this.render();
  }

  async deleteSelectedElement() {
    const element = this.currentElement();
    if (!element || !this.state.selectedFile) return;

    const label = this.displayLabel(element);
    if (!window.confirm(this.t("ui.deleteConfirm", { name: label }))) return;

    const snapshot = this.undoSnapshot(element, "delete");
    this.state.loading = true;
    this.state.error = "";
    this.render();

    try {
      const result = await this.callWS({
        type: `${DOMAIN}/delete_element`,
        path: this.state.selectedFile,
        element_path: element.path,
      });
      this.state.cards = result.cards || [];
      this.state.selectedElementPath = null;
      this.state.advancedText = "";
      this.state.advancedDirty = false;
      this.state.dirty = false;
      this.clearLocalEditTracking();
      this.pushUndoSnapshot(snapshot);
      this.setStatus("status.deleted", { name: label });
    } catch (err) {
      this.state.error = err.message || String(err);
    } finally {
      this.state.loading = false;
      this.render();
    }
  }

  async restoreDeletedElement(snapshot) {
    if (!snapshot || !this.state.selectedFile) {
      this.setStatus("status.undoEmpty");
      this.render();
      return;
    }

    this.state.loading = true;
    this.state.error = "";
    this.render();

    try {
      const result = await this.callWS({
        type: `${DOMAIN}/restore_element`,
        path: this.state.selectedFile,
        element_path: snapshot.path,
        element: snapshot.config,
      });
      this.state.cards = result.cards || [];
      this.state.selectedElementPath = Array.isArray(result.element_path)
        ? [...result.element_path]
        : [...snapshot.path];
      const element = this.currentElement();
      this.state.advancedText = element ? element.fragment || "" : snapshot.advancedText || "";
      this.state.advancedDirty = false;
      this.state.dirty = false;
      this.clearLocalEditTracking();
      this.setStatus("status.undo", {
        name: snapshot.label || (element ? this.displayLabel(element) : ""),
      });
    } catch (err) {
      this.state.undoStack = [...this.state.undoStack, snapshot].slice(-30);
      this.state.error = err.message || String(err);
    } finally {
      this.state.loading = false;
      this.render();
    }
  }

  nudgeSelected(dx, dy, step = 0.1) {
    const element = this.currentElement();
    if (!element) return;
    this.pushUndo(element);
    this.applyNudge(element, dx * step, dy * step);
  }

  applyNudge(element, dx, dy) {
    const style = element.config.style || {};
    const currentLeft = Number.parseFloat(this.percentToNumber(style.left));
    const currentTop = Number.parseFloat(this.percentToNumber(style.top));
    const left = Number.isFinite(currentLeft) ? currentLeft : 50;
    const top = Number.isFinite(currentTop) ? currentTop : 50;
    const leftText = `${this.clamp(left + dx, 0, 100).toFixed(1)}%`;
    const topText = `${this.clamp(top + dy, 0, 100).toFixed(1)}%`;

    element.config.style = element.config.style || {};
    element.config.style.left = leftText;
    element.config.style.top = topText;
    this.state.dirty = true;
    this.markElementLocallyEdited(element);
    this.markElementLocallyStyled(element);
    this.setStatus("status.moved");
    this.updateSelectedElementDom(element);
  }

  resizeSelected(target, direction, step = 0.1) {
    const element = this.currentElement();
    if (!element) return;
    this.pushUndo(element);
    this.applyResize(element, target, direction * step);
  }

  applyResize(element, target, delta) {
    const style = element.config.style || {};
    const measured = this.measuredSelectedSizePercent(element);
    const keys =
      target === "width"
        ? ["width"]
        : target === "height"
          ? ["height"]
          : ["width", "height"];

    element.config.style = element.config.style || {};
    for (const key of keys) {
      const current = this.sizePercentValue(style[key], measured[key]);
      if (key === "height" && target === "both" && !style.height && style.height !== 0) {
        continue;
      }
      element.config.style[key] = `${this.clamp(current + delta, 0.1, 300).toFixed(1)}%`;
    }

    this.state.dirty = true;
    this.markElementLocallyEdited(element);
    this.markElementLocallyStyled(element);
    this.setStatus("status.resized");
    this.updateSelectedElementDom(element);
  }

  sizePercentValue(value, measuredValue) {
    const parsed = Number.parseFloat(this.percentToNumber(value));
    if (Number.isFinite(parsed)) return parsed;
    if (Number.isFinite(measuredValue) && measuredValue > 0) return measuredValue;
    return 10;
  }

  applyResponsiveSelectedSize() {
    const element = this.currentElement();
    if (!element) return;
    const measured = this.measuredSelectedSizePercent(element);
    if (!Number.isFinite(measured.width) && !Number.isFinite(measured.height)) return;

    this.pushUndo(element);
    element.config.style = element.config.style || {};
    if (Number.isFinite(measured.width)) {
      element.config.style.width = `${this.clamp(measured.width, 0.1, 300).toFixed(2)}%`;
    }
    const currentHeight = String(element.config.style.height || "").trim().toLowerCase();
    if (Number.isFinite(measured.height) && currentHeight && currentHeight !== "auto") {
      element.config.style.height = `${this.clamp(measured.height, 0.1, 300).toFixed(2)}%`;
    }
    this.state.dirty = true;
    this.markElementLocallyEdited(element);
    this.markElementLocallyStyled(element);
    this.setStatus("status.responsiveSized");
    this.updateSelectedElementDom(element);
  }

  measuredSelectedSizePercent(element) {
    const cardIndex = this.state.cardIndex;
    const card = this.currentCard();
    const elementIndex = card?.elements?.findIndex((candidate) =>
      this.samePath(candidate.path, element.path)
    );
    const node = this.shadowRoot.querySelector(
      `.plan-element[data-card-index="${cardIndex}"][data-element-index="${elementIndex}"]`
    );
    const overlay = this.shadowRoot.querySelector(".edit-overlay");
    if (!node || !overlay) return {};

    const nodeRect = node.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    return {
      width: overlayRect.width > 0 ? (nodeRect.width / overlayRect.width) * 100 : undefined,
      height: overlayRect.height > 0 ? (nodeRect.height / overlayRect.height) * 100 : undefined,
    };
  }

  updateSelectedElementDom(element) {
    const cardIndex = this.state.cardIndex;
    const card = this.currentCard();
    const elementIndex = card?.elements?.findIndex((candidate) =>
      this.samePath(candidate.path, element.path)
    );
    if (!Number.isInteger(elementIndex) || elementIndex < 0) return;

    const node = this.shadowRoot.querySelector(
      `.plan-element[data-card-index="${cardIndex}"][data-element-index="${elementIndex}"]`
    );
    if (node) {
      this.applyLocalOverlayStyle(node, element);
      const rendered = this.renderedElementForOverlayNode(node, element);
      if (rendered) this.applyLocalRenderedStyle(rendered, element);
    }
    const style = element.config.style || {};
    const leftInput = this.shadowRoot.querySelector('[data-percent-field="style.left"]');
    const topInput = this.shadowRoot.querySelector('[data-percent-field="style.top"]');
    const widthInput = this.shadowRoot.querySelector('[data-percent-field="style.width"]');
    const heightInput = this.shadowRoot.querySelector('[data-percent-field="style.height"]');
    if (leftInput) leftInput.value = this.percentToNumber(style.left);
    if (topInput) topInput.value = this.percentToNumber(style.top);
    if (widthInput) widthInput.value = this.percentToNumber(style.width);
    if (heightInput) heightInput.value = this.percentToNumber(style.height);
    const status = this.shadowRoot.querySelector(".topbar p");
    if (status) status.textContent = this.statusText();
    const undo = this.shadowRoot.querySelector("#undoChange");
    if (undo) undo.disabled = !this.state.undoStack.length;
  }

  renderedElementForOverlayNode(node, element) {
    const indexFromNode = Number.parseInt(node?.dataset?.renderedIndex || "", 10);
    const remembered = this.rememberedRenderedElementIndex(element);
    const targetIndex = Number.isInteger(indexFromNode) ? indexFromNode : remembered;
    if (!Number.isInteger(targetIndex)) return null;

    const iframe = this.shadowRoot?.querySelector(".dashboard-frame");
    const info = iframe ? this.renderedPictureCardInfoFromIframe(iframe) : null;
    const host = this.shadowRoot?.querySelector("#realCardHost");
    const card = info?.card || host?.firstElementChild;
    if (!card) return null;

    return this.renderedElementInfos(card).find((item) => item.index === targetIndex)?.element || null;
  }

  applyLocalOverlayStyle(node, element) {
    const style = element.config.style || {};
    node.style.left = this.cleanCssValue(style.left, "50%");
    node.style.top = this.cleanCssValue(style.top, "50%");
    node.style.transform = this.cleanCssValue(style.transform, "translate(-50%, -50%)");
    this.setOptionalStyle(node, "width", style.width);
    this.setOptionalStyle(node, "height", style.height);
    this.setOptionalStyle(node, "z-index", style["z-index"] ?? style.zIndex);
    node.dataset.styleLeft = style.left || "";
    node.dataset.styleTop = style.top || "";
    node.dataset.styleWidth = style.width || "";
    node.dataset.styleHeight = style.height || "";
    node.dataset.styleTransform = style.transform || "";
    node.dataset.measuredHitbox = "false";
    node.classList.remove("rendered-hitbox");
  }

  applyLocalRenderedStyle(renderedNode, element) {
    const style = element.config.style || {};
    this.setRenderedStyle(renderedNode, "left", style.left);
    this.setRenderedStyle(renderedNode, "top", style.top);
    this.setRenderedStyle(renderedNode, "width", style.width);
    this.setRenderedStyle(renderedNode, "height", style.height);
    this.setRenderedStyle(renderedNode, "transform", style.transform);
    this.setRenderedStyle(renderedNode, "opacity", style.opacity);
    this.setRenderedStyle(renderedNode, "color", style.color);
    this.setRenderedStyle(renderedNode, "background", style.background);
    this.setRenderedStyle(renderedNode, "background-color", style["background-color"]);
    this.setRenderedStyle(renderedNode, "z-index", style["z-index"] ?? style.zIndex);
  }

  setOptionalStyle(node, property, value) {
    if (!node) return;
    if (value === undefined || value === null || value === "") {
      node.style.removeProperty(property);
      return;
    }
    node.style.setProperty(property, this.cleanCssValue(value));
  }

  setRenderedStyle(node, property, value) {
    if (!node || value === undefined || value === null || value === "") return;
    node.style.setProperty(property, this.cleanCssValue(value));
  }

  handleKeyDown(event) {
    if (!this.currentElement()) return;
    if (this.isTextEditingTarget(event.target)) return;

    const arrows = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const delta = arrows[event.key];
    if (!delta) return;

    event.preventDefault();
    this.nudgeSelected(delta[0], delta[1], event.shiftKey ? 1 : 0.1);
  }

  isTextEditingTarget(target) {
    const tag = String(target?.tagName || "").toLowerCase();
    return (
      tag === "input" ||
      tag === "textarea" ||
      tag === "select" ||
      target?.isContentEditable
    );
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
      this.state.undoStack = [];
      this.clearLocalEditTracking();
      this.setStatus(
        result.backup_path ? "status.savedWithBackup" : "status.saved",
        { path: result.backup_path || "" }
      );
      const nextElement = this.currentElement();
      this.state.advancedText = nextElement ? nextElement.fragment || "" : "";
    } catch (err) {
      this.state.error = err.message || String(err);
    } finally {
      this.state.loading = false;
      this.render();
    }
  }

  defaultNewElementYaml() {
    return [
      "type: state-icon",
      "entity: light.example",
      "style:",
      "  left: 50%",
      "  top: 50%",
      "  transform: translate(-50%, -50%)",
    ].join("\n");
  }

  buildNewElementFromForm() {
    const root = this.shadowRoot;
    const type = root.querySelector("#newElementType")?.value || "state-icon";
    const entity = root.querySelector("#newElementEntity")?.value.trim();
    const name = root.querySelector("#newElementName")?.value.trim();
    const icon = root.querySelector("#newElementIcon")?.value.trim();
    const image = root.querySelector("#newElementImage")?.value.trim();
    const left = root.querySelector("#newElementLeft")?.value.trim() || "50";
    const top = root.querySelector("#newElementTop")?.value.trim() || "50";
    const width = root.querySelector("#newElementWidth")?.value.trim();
    const height = root.querySelector("#newElementHeight")?.value.trim();
    const color = root.querySelector("#newElementColorText")?.value.trim();
    const background = root.querySelector("#newElementBackgroundText")?.value.trim();
    const transform = root.querySelector("#newElementTransform")?.value.trim() || "translate(-50%, -50%)";

    const style = {
      left: this.percentText(left, "50%"),
      top: this.percentText(top, "50%"),
      transform,
    };
    if (width) style.width = this.percentText(width, width);
    if (height) style.height = this.percentText(height, height);
    if (color) style.color = color;
    if (background) style.background = background;

    if (type === "state-icon" || type === "state-label" || type === "state-badge") {
      const element = { type, style };
      if (entity) element.entity = entity;
      if (icon && type === "state-icon") element.icon = icon;
      if (name) element.title = name;
      return element;
    }

    if (type === "image") {
      const element = {
        type: "image",
        image: image || "/local/example.png",
        style,
      };
      if (entity) element.entity = entity;
      if (name) element.title = name;
      return element;
    }

    if (type === "custom:button-card") {
      const element = {
        type: "custom:button-card",
        show_name: Boolean(name),
        show_state: false,
        style,
      };
      if (entity) element.entity = entity;
      if (name) element.name = name;
      if (icon) element.icon = icon;
      return element;
    }

    const element = {
      type: "custom:hui-element",
      card_type: type === "custom:hui-element" ? "tile" : type,
      style,
    };
    if (entity) element.entity = entity;
    if (name) element.name = name;
    if (icon) element.icon = icon;
    return element;
  }

  percentText(value, fallback = "") {
    const text = String(value || "").trim();
    if (!text) return fallback;
    return /[a-z%()]/i.test(text) ? text : `${text}%`;
  }

  async addElement(useYaml = false) {
    const card = this.currentCard();
    if (!card || !this.state.selectedFile) return;

    const payload = {
      type: `${DOMAIN}/add_element`,
      path: this.state.selectedFile,
      card_path: card.path,
    };
    if (useYaml) {
      payload.fragment = this.state.addElementYaml || this.defaultNewElementYaml();
    } else {
      payload.element = this.buildNewElementFromForm();
    }

    this.state.loading = true;
    this.state.error = "";
    this.render();
    try {
      const result = await this.callWS(payload);
      this.state.cards = result.cards || [];
      this.state.dirty = false;
      this.state.advancedDirty = false;
      this.state.undoStack = [];
      this.clearLocalEditTracking();
      this.state.addElementOpen = false;
      this.state.addElementYaml = "";
      if (Array.isArray(result.element_path)) {
        this.state.selectedElementPath = [...result.element_path];
      }
      const nextElement = this.currentElement();
      this.state.advancedText = nextElement ? nextElement.fragment || "" : "";
      this.setStatus("status.added", {
        name: nextElement ? this.displayLabel(nextElement) : this.t("ui.addElement"),
      });
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

    const stage = this.shadowRoot.querySelector(".plan-stage");
    const overlay = this.shadowRoot.querySelector(".edit-overlay");
    const card = this.state.cards[cardIndex];
    const element = card && card.elements[elementIndex];
    if (!stage || !element) return;

    this.setSelectedElement(cardIndex, elementIndex);

    const rect = (overlay || stage).getBoundingClientRect();
    const style = element.config.style || {};
    const parsedLeft = this.percentToNumber(style.left);
    const parsedTop = this.percentToNumber(style.top);
    const startLeft = Number.isFinite(parsedLeft) ? parsedLeft : 50;
    const startTop = Number.isFinite(parsedTop) ? parsedTop : 50;
    const startPointer = this.pointerToStagePercent(event, rect);
    const startClientX = event.clientX;
    const startClientY = event.clientY;
    let dragging = false;

    const move = (moveEvent) => {
      const distance = Math.hypot(moveEvent.clientX - startClientX, moveEvent.clientY - startClientY);
      if (!dragging && distance < 4) return;
      if (!dragging) this.pushUndo(element);
      dragging = true;

      const pointer = this.pointerToStagePercent(moveEvent, rect);
      const left = startLeft + pointer.left - startPointer.left;
      const top = startTop + pointer.top - startPointer.top;
      const leftText = `${this.clamp(left, 0, 100).toFixed(1)}%`;
      const topText = `${this.clamp(top, 0, 100).toFixed(1)}%`;
      element.config.style = element.config.style || {};
      element.config.style.left = leftText;
      element.config.style.top = topText;
      this.state.dirty = true;
      this.markElementLocallyEdited(element);
      this.markElementLocallyStyled(element);
      this.setStatus("status.moved");
      this.updateSelectedElementDom(element);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      this.render();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  pointerToStagePercent(event, rect) {
    const width = rect.width || 1;
    const height = rect.height || 1;
    return {
      left: ((event.clientX - rect.left) / width) * 100,
      top: ((event.clientY - rect.top) / height) * 100,
    };
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

  cleanCssValue(value, fallback = "") {
    return String(value || fallback).replace(/;/g, "");
  }

  colorPickerValue(value) {
    const raw = String(value || "").trim();
    const full = raw.match(/^#([0-9a-f]{6})$/i);
    if (full) return raw;
    const short = raw.match(/^#([0-9a-f]{3})$/i);
    if (short) {
      return `#${short[1].split("").map((char) => `${char}${char}`).join("")}`;
    }
    return "#ffffff";
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

  dashboardPreviewUrl(value) {
    const url = String(value || "");
    if (!url) return "";
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}kiosk`;
  }

  shortLabel(element) {
    return this.displayLabel(element);
  }

  previewPresets() {
    return [
      { key: "phone-61", group: this.t("group.phones"), label: '6,1" iPhone / Galaxy S', width: 390, height: 844 },
      { key: "phone-63", group: this.t("group.phones"), label: '6,3" iPhone Pro / Galaxy S', width: 402, height: 874 },
      { key: "phone-65", group: this.t("group.phones"), label: '6,5" iPhone / Samsung', width: 414, height: 896 },
      { key: "phone-67", group: this.t("group.phones"), label: '6,7" iPhone Plus / Galaxy+', width: 430, height: 932 },
      { key: "phone-68", group: this.t("group.phones"), label: '6,8" Galaxy S22/S23/S24 Ultra', width: 412, height: 915 },
      { key: "phone-69", group: this.t("group.phones"), label: '6,9" iPhone Max / Galaxy S25 Ultra', width: 440, height: 956 },
      { key: "tablet-89", group: this.t("group.tablets"), label: `8,9" ${this.t("preset.compactTablet")}`, width: 768, height: 1024 },
      { key: "tablet-10", group: this.t("group.tablets"), label: '10" tablet', width: 800, height: 1280 },
      { key: "tablet-11", group: this.t("group.tablets"), label: '11" iPad / Galaxy Tab', width: 834, height: 1194 },
      { key: "tablet-13", group: this.t("group.tablets"), label: '13" iPad Pro / Galaxy Tab', width: 1024, height: 1366 },
      { key: "display-13", group: this.t("group.displays"), label: `13" ${this.t("preset.notebook")}`, width: 1280, height: 800 },
      { key: "display-156", group: this.t("group.displays"), label: `15,6" ${this.t("preset.notebook")}`, width: 1366, height: 768 },
      { key: "display-24", group: this.t("group.displays"), label: `24" ${this.t("preset.monitorFullHd")}`, width: 1920, height: 1080 },
      { key: "display-27", group: this.t("group.displays"), label: `27" ${this.t("preset.monitorQhd")}`, width: 2560, height: 1440 },
      { key: "display-32", group: this.t("group.displays"), label: `32" ${this.t("preset.monitor4k")}`, width: 3840, height: 2160 },
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
    if (element.label && !this.isImplementationLabel(element.label)) {
      return this.localizedBackendLabel(element.label);
    }
    return this.labelFromCardType(config.card_type || config.type || "element");
  }

  localizedBackendLabel(value) {
    const text = String(value || "");
    const normalized = this.normalizedSearchText(text).replace(/[^0-9a-z]+/g, " ").trim();
    const known = {
      "levy panel pozadi": "label.leftPanel",
      "levy panel": "label.leftPanel",
      "vysavac bob": "label.vacuumBob",
      tv: "label.tv",
      "otevirani dveri": "label.doorOpening",
      hudba: "label.music",
      nastaveni: "label.settings",
      energie: "label.energy",
      "pracka susicka": "label.washerDryer",
      svetlo: "label.light",
      "cas datum": "label.timeDate",
      kalendar: "label.calendar",
      "stav domacnosti": "label.householdStatus",
      "skola snp mhd": "label.transit",
      osoby: "label.persons",
      "obyvak klima": "label.livingClimate",
      "loznice klima": "label.bedroomClimate",
      "koupelna klima": "label.bathroomClimate",
      "teplota klima": "label.temperatureClimate",
      "venkovni klima": "label.outdoorClimate",
      baterie: "label.batteries",
      "dostupnost zarizeni": "label.availability",
      "nastaveni hostu": "label.guestSettings",
    };
    if (known[normalized]) return this.t(known[normalized]);
    return this.localizedElementParent(text);
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
      return this.t("label.leftPanel");
    }
    const file = image.split("?")[0].split("/").pop() || "";
    const stem = file.replace(/\.[^.]+$/, "").replace(/^planek[-_]?/i, "");
    return this.humanizeId(stem);
  }

  labelFromIcon(icon) {
    const map = {
      "mdi:robot-vacuum": this.t("label.vacuumBob"),
      "mdi:television": this.t("label.tv"),
      "mdi:lock": this.t("label.doorOpening"),
      "mdi:music": this.t("label.music"),
      "mdi:cog": this.t("label.settings"),
      "mdi:lightning-bolt": this.t("label.energy"),
      "mdi:washing-machine": this.t("label.washerDryer"),
      "mdi:lightbulb-on": this.t("label.light"),
      "mdi:lightbulb-outline": this.t("label.light"),
    };
    return map[icon] || this.humanizeId(String(icon).replace(/^mdi:/, ""));
  }

  labelFromContent(config) {
    const cardType = String(config.card_type || config.type || "");
    const ids = this.entityIdsFromConfig(config);
    const joined = ids.join(" ").toLowerCase();
    const json = JSON.stringify(config).toLowerCase();

    if (config.entity === "sensor.time" || joined.includes("sensor.time")) return this.t("label.timeDate");
    if (cardType.includes("calendar") || joined.includes("calendar.")) return this.t("label.calendar");
    if (
      json.includes("stav dom") ||
      json.includes("status-line") ||
      json.includes("trackedavailability") ||
      json.includes("messages.push")
    ) {
      return this.t("label.householdStatus");
    }
    if (json.includes("outside-row")) return this.t("label.outdoorClimate");
    if (json.includes("batteryids")) return this.t("label.batteries");
    if (json.includes("availabilityids")) return this.t("label.availability");
    if (json.includes("hosti_pin")) return this.t("label.guestSettings");
    if (joined.includes("mhd_skola_snp") || json.includes("skola snp")) return this.t("label.transit");
    if (joined.includes("vacuum.bob") || json.includes("vacuum.bob")) return this.t("label.vacuumBob");
    if (joined.includes("pracka") || joined.includes("susicka")) return this.t("label.washerDryer");
    if (joined.includes("person.pavel") || joined.includes("person.misa")) return this.t("label.persons");
    if (joined.includes("teplota") || joined.includes("humidity") || joined.includes("vlhkost") || joined.includes("co2")) {
      if (joined.includes("obyvak")) return this.t("label.livingClimate");
      if (joined.includes("loznice")) return this.t("label.bedroomClimate");
      if (joined.includes("fp300") || joined.includes("koupelna")) return this.t("label.bathroomClimate");
      return this.t("label.temperatureClimate");
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
    const replacements = this.humanizeReplacements();
    return String(value || "")
      .replace(/[^0-9A-Za-zÀ-ž]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => replacements[word.toLowerCase()] || word)
      .join(" ");
  }

  humanizeReplacements() {
    const language = this.languageCode();
    const dictionaries = {
      cs: {
        obyvak: "Obývák",
        loznice: "Ložnice",
        kuchyn: "Kuchyň",
        koupelna: "Koupelna",
        zachod: "Záchod",
        pracovna: "Pracovna",
        svetla: "Světla",
        svetlo: "Světlo",
        vypinac: "Vypínač",
        hosti: "Hosté",
        otevirani: "Otevírání",
        dveri: "dveří",
        mhd: "MHD",
        skola: "Škola",
        snp: "SNP",
        next: "odjezdy",
        time: "Čas",
        vykon: "výkon",
        pracka: "pračka",
        susicka: "sušička",
      },
      en: {
        obyvak: "Living room",
        loznice: "Bedroom",
        kuchyn: "Kitchen",
        koupelna: "Bathroom",
        zachod: "Toilet",
        pracovna: "Office",
        svetla: "Lights",
        svetlo: "Light",
        vypinac: "Switch",
        hosti: "Guests",
        otevirani: "Opening",
        dveri: "doors",
        mhd: "Transit",
        skola: "School",
        snp: "SNP",
        next: "departures",
        time: "Time",
        vykon: "power",
        pracka: "washer",
        susicka: "dryer",
      },
      de: {
        obyvak: "Wohnzimmer",
        loznice: "Schlafzimmer",
        kuchyn: "Küche",
        koupelna: "Badezimmer",
        zachod: "Toilette",
        pracovna: "Büro",
        svetla: "Lichter",
        svetlo: "Licht",
        vypinac: "Schalter",
        hosti: "Gäste",
        otevirani: "Öffnung",
        dveri: "Türen",
        mhd: "ÖPNV",
        skola: "Schule",
        snp: "SNP",
        next: "Abfahrten",
        time: "Uhrzeit",
        vykon: "Leistung",
        pracka: "Waschmaschine",
        susicka: "Trockner",
      },
    };
    return dictionaries[language] || dictionaries.en;
  }

  elementSummary(element) {
    const config = element.config || {};
    const style = config.style || {};
    const parts = [];
    const kind = this.elementKind(config);

    if (element.parent) parts.push(this.localizedElementParent(element.parent));
    if (config.entity) parts.push(config.entity);
    if (config.card_type) parts.push(config.card_type);
    else if (config.type) parts.push(config.type);
    if (style.left || style.top) parts.push(`${style.left || "-"}, ${style.top || "-"}`);
    if (kind === "hotspot") parts.push(this.t("summary.hotspot"));

    return parts.filter(Boolean).join(" - ");
  }

  localizedElementParent(value) {
    const text = String(value || "");
    if (!text.toLowerCase().startsWith("podmínka:")) return text;
    return text.replace(/^Podmínka:/i, this.t("summary.conditionPrefix"));
  }

  filteredElements() {
    const card = this.currentCard();
    if (!card) return [];
    const query = this.state.elementFilter.trim().toLowerCase();
    return card.elements
      .map((element, index) => ({ element, index }))
      .filter(({ element }) => this.hasPosition((element.config || {}).style || {}))
      .filter(({ element }) => this.elementMatchesTypeFilter(element))
      .filter(({ element }) => {
        if (!query) return true;
        const haystack = `${this.displayLabel(element)} ${element.label} ${this.elementSummary(element)}`.toLowerCase();
        return haystack.includes(query);
      });
  }

  elementMatchesTypeFilter(element) {
    const filter = this.state.elementTypeFilter || "visible";
    const config = element.config || {};
    const style = config.style || {};
    const kind = this.elementKind(config);
    const conditional = Boolean(element.parent || config.type === "conditional");

    if (filter === "all") return true;
    if (filter === "visible") return this.isElementConditionActive(element);
    if (filter === "hotspots") return kind === "hotspot";
    if (filter === "widgets") {
      return ["widget", "calendar", "stack", "label", "icon"].includes(kind) && !this.isTransparentCard(config);
    }
    if (filter === "images") return kind === "image";
    if (filter === "conditional") return conditional || !this.isElementConditionActive(element);
    return this.hasPosition(style);
  }

  hasPosition(style) {
    return Boolean(style && (style.left || style.top));
  }

  isElementConditionActive(element) {
    const groups = this.ancestorConditionGroups(element);
    if (!groups.length) return true;
    return groups.every((conditions) =>
      conditions.every((condition) => this.conditionMatches(condition))
    );
  }

  ancestorConditionGroups(element) {
    const card = this.currentCard();
    if (!card || !Array.isArray(card.path) || !Array.isArray(element.path)) return [];
    if (!card.path.every((part, index) => element.path[index] === part)) return [];
    const relativePath = element.path.slice(card.path.length);
    let node = card.config;
    const groups = [];

    for (const part of relativePath) {
      if (
        node &&
        typeof node === "object" &&
        !Array.isArray(node) &&
        node.type === "conditional" &&
        Array.isArray(node.conditions)
      ) {
        groups.push(node.conditions);
      }
      node = node?.[part];
    }
    return groups;
  }

  conditionMatches(condition) {
    if (!condition || typeof condition !== "object" || !condition.entity) return true;
    if (!this.hass?.states) return true;
    const state = this.hass?.states?.[condition.entity]?.state;
    if (condition.state !== undefined) return state === String(condition.state);
    if (condition.state_not !== undefined) return state !== String(condition.state_not);
    return true;
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
    if (!this.isElementConditionActive(element)) classes.push("not-rendered");
    if (this.isClickThrough(style) && config.type !== "image") classes.push("click-through");
    return classes.join(" ");
  }

  isClickThrough(style) {
    return String(style?.["pointer-events"] || "").trim().toLowerCase() === "none";
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

    const label = this.normalizedSearchText(this.displayLabel(element));
    if (label.includes("cas") || label.includes("time") || label.includes("datum") || label.includes("date") || label.includes("uhrzeit")) return "mdi:chart-line";
    if (label.includes("klima") || label.includes("climate") || label.includes("teplota") || label.includes("temperature") || label.includes("temperatur")) return "mdi:thermometer";
    if (label.includes("kalendar") || label.includes("calendar") || label.includes("kalender")) return "mdi:calendar";
    if (label.includes("osob") || label.includes("people") || label.includes("person")) return "mdi:account-group";
    if (label.includes("vysavac") || label.includes("vacuum") || label.includes("staubsauger")) return "mdi:robot-vacuum";
    if (label.includes("energie") || label.includes("energy")) return "mdi:lightning-bolt";
    if (label.includes("hudba") || label.includes("music") || label.includes("musik")) return "mdi:music";
    if (label.includes("stav dom") || label.includes("household status") || label.includes("haushaltsstatus")) return "mdi:format-list-bulleted";
    if (config.type === "image") return "mdi:image-outline";
    if (this.isTransparentCard(config)) return "mdi:gesture-tap";
    return config.type === "state-icon" ? "mdi:circle-medium" : this.fallbackIcon(config);
  }

  normalizedSearchText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
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
    if (this.state.previewScaleMode === "actual") {
      stage.style.setProperty("--preview-scale", "1");
      fit.style.height = `${Math.ceil(rawHeight)}px`;
      return;
    }

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

    if (card?.preview_url) {
      stage?.classList.add("real-ready");
      stage?.classList.remove("real-failed");
      requestAnimationFrame(() => this.syncPreviewFit());
      this.scheduleOverlaySync();
      setTimeout(() => this.syncPreviewFit(), 200);
      return;
    }

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
      this.scheduleOverlaySync();
      setTimeout(() => this.syncPreviewFit(), 80);
      setTimeout(() => this.syncPreviewFit(), 400);
    } catch (err) {
      host.replaceChildren();
      stage.classList.remove("real-ready");
      stage.classList.add("real-failed");
      stage.style.height = "";
      if (error) {
        error.textContent = this.t("status.realRenderFailed", { error: err?.message || err });
      }
      requestAnimationFrame(() => this.syncPreviewFit());
      this.resetOverlayBounds();
    }
  }

  scheduleOverlaySync() {
    this._overlaySyncTimer && clearInterval(this._overlaySyncTimer);
    const run = () => this.syncOverlayToRenderedCard();
    requestAnimationFrame(run);
    setTimeout(run, 80);
    setTimeout(run, 250);
    setTimeout(run, 700);
    this._overlaySyncTimer = setInterval(run, 1200);
  }

  syncOverlayToRenderedCard() {
    const stage = this.shadowRoot?.querySelector(".plan-stage");
    const overlay = this.shadowRoot?.querySelector(".edit-overlay");
    if (!stage || !overlay) return;

    const iframe = this.shadowRoot.querySelector(".dashboard-frame");
    if (iframe) {
      const info = this.renderedPictureCardInfoFromIframe(iframe);
      if (info) {
        this.applyOverlayBounds(
          overlay,
          info.rect.left,
          info.rect.top,
          info.rect.width,
          info.rect.height
        );
        this.syncElementHitboxesFromRenderedCard(overlay, info);
        return;
      }
    }

    const host = this.shadowRoot.querySelector("#realCardHost");
    const renderedCard = host?.firstElementChild;
    if (renderedCard) {
      const stageRect = stage.getBoundingClientRect();
      const info = this.pictureCardRenderInfo(renderedCard);
      const scale = this.previewStageScale(stage);
      if (info) {
        this.applyOverlayBounds(
          overlay,
          (info.rect.left - stageRect.left) / scale,
          (info.rect.top - stageRect.top) / scale,
          info.rect.width / scale,
          info.rect.height / scale
        );
        this.syncElementHitboxesFromRenderedCard(overlay, info, scale);
        return;
      }
    }

    this.resetOverlayBounds();
  }

  previewStageScale(stage) {
    const value = Number.parseFloat(
      getComputedStyle(stage).getPropertyValue("--preview-scale")
    );
    return Number.isFinite(value) && value > 0 ? value : 1;
  }

  renderedPictureCardInfoFromIframe(iframe) {
    let doc;
    try {
      doc = iframe.contentDocument;
    } catch (_err) {
      return null;
    }
    if (!doc) return null;

    const target = this.deepQuery(doc, "hui-picture-elements-card");
    return this.pictureCardRenderInfo(target);
  }

  pictureCardRenderInfo(card) {
    if (!card) return null;
    const root =
      card.shadowRoot?.querySelector("#root") ||
      card.shadowRoot?.querySelector("ha-card") ||
      card;
    const rect = root.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return null;
    return { card, root, rect };
  }

  syncElementHitboxesFromRenderedCard(overlay, info, scale = 1) {
    const nodes = Array.from(overlay.querySelectorAll(".plan-element"));
    const renderedElements = this.renderedElementInfos(info.card);
    if (!nodes.length || !renderedElements.length) return;

    nodes.forEach((node) => {
      node.classList.remove("rendered-hitbox", "not-rendered");
    });

    const used = new Set();
    const card = this.currentCard();
    for (const node of nodes) {
      const elementIndex = Number.parseInt(node.dataset.elementIndex, 10);
      const element = card?.elements?.[elementIndex];
      if (element && !this.isElementConditionActive(element)) {
        node.classList.add("not-rendered");
        continue;
      }

      if (element && this.isElementLocallyEdited(element)) {
        const remembered = Number.parseInt(
          node.dataset.renderedIndex || `${this.rememberedRenderedElementIndex(element) ?? ""}`,
          10
        );
        const rendered = renderedElements.find((item) => item.index === remembered);
        if (rendered) {
          used.add(rendered.index);
          node.dataset.renderedIndex = `${rendered.index}`;
          this.applyLocalRenderedStyle(rendered.element, element);
        }
        this.applyLocalOverlayStyle(node, element);
        continue;
      }

      const match = this.bestRenderedElementMatch(node, renderedElements, used);
      if (!match) {
        if (node.classList.contains("nested-element")) {
          node.classList.add("not-rendered");
        }
        continue;
      }

      used.add(match.index);
      node.dataset.renderedIndex = `${match.index}`;
      this.rememberRenderedElementIndex(element, match.index);
      const rect = match.rect;
      const left = (rect.left - info.rect.left) / scale;
      const top = (rect.top - info.rect.top) / scale;
      const width = rect.width / scale;
      const height = rect.height / scale;
      if (width < 4 || height < 4) continue;

      node.style.left = `${this.roundCssPx(left)}px`;
      node.style.top = `${this.roundCssPx(top)}px`;
      node.style.width = `${this.roundCssPx(width)}px`;
      node.style.height = `${this.roundCssPx(height)}px`;
      node.style.transform = "none";
      node.dataset.measuredHitbox = "true";
      node.classList.add("rendered-hitbox");
      if (element && this.isElementLocallyStyled(element)) {
        this.applyLocalRenderedStyle(match.element, element);
      }
    }
  }

  renderedElementInfos(card) {
    const root = card?.shadowRoot || card;
    return this.deepQueryAll(root, ".element")
      .map((element, index) => {
        const rect = element.getBoundingClientRect();
        return {
          index,
          element,
          rect,
          left: element.style.left || "",
          top: element.style.top || "",
          width: element.style.width || "",
          height: element.style.height || "",
          transform: element.style.transform || "",
        };
      })
      .filter((item) => item.rect.width >= 4 && item.rect.height >= 4);
  }

  bestRenderedElementMatch(node, renderedElements, used) {
    const left = node.dataset.styleLeft || "";
    const top = node.dataset.styleTop || "";
    if (!left && !top) return null;

    let best = null;
    let bestScore = Number.POSITIVE_INFINITY;
    for (const item of renderedElements) {
      if (used.has(item.index)) continue;
      const positionScore =
        this.styleValueDistance(left, item.left) * 20 +
        this.styleValueDistance(top, item.top) * 20;
      if (positionScore > 8) continue;

      const sizeScore =
        this.styleValueDistance(node.dataset.styleWidth || "", item.width) +
        this.styleValueDistance(node.dataset.styleHeight || "", item.height);
      const transformScore = this.normalizedCssValue(node.dataset.styleTransform || "") ===
        this.normalizedCssValue(item.transform || "")
        ? 0
        : 0.5;
      const score = positionScore + sizeScore + transformScore;
      if (score < bestScore) {
        best = item;
        bestScore = score;
      }
    }
    return best;
  }

  styleValueDistance(left, right) {
    const a = this.normalizedCssValue(left);
    const b = this.normalizedCssValue(right);
    if (!a && !b) return 0;
    if (a === b) return 0;

    const aNum = this.percentToNumber(a);
    const bNum = this.percentToNumber(b);
    if (Number.isFinite(aNum) && Number.isFinite(bNum)) {
      return Math.abs(aNum - bNum);
    }
    return a && b ? 6 : 12;
  }

  normalizedCssValue(value) {
    return String(value || "").replace(/\s+/g, "").trim().toLowerCase();
  }

  roundCssPx(value) {
    return Math.round(value * 10) / 10;
  }

  deepQuery(root, selector) {
    const direct = root.querySelector?.(selector);
    if (direct) return direct;

    const nodes = root.querySelectorAll?.("*") || [];
    for (const node of nodes) {
      if (node.shadowRoot) {
        const found = this.deepQuery(node.shadowRoot, selector);
        if (found) return found;
      }
    }
    return null;
  }

  deepQueryAll(root, selector, seen = new Set()) {
    const matches = [];
    const add = (node) => {
      if (!seen.has(node)) {
        seen.add(node);
        matches.push(node);
      }
    };

    root.querySelectorAll?.(selector).forEach(add);
    const nodes = root.querySelectorAll?.("*") || [];
    for (const node of nodes) {
      if (node.shadowRoot) {
        this.deepQueryAll(node.shadowRoot, selector, seen).forEach(add);
      }
    }
    return matches;
  }

  applyOverlayBounds(overlay, left, top, width, height) {
    overlay.style.left = `${this.roundCssPx(left)}px`;
    overlay.style.top = `${this.roundCssPx(top)}px`;
    overlay.style.width = `${this.roundCssPx(width)}px`;
    overlay.style.height = `${this.roundCssPx(height)}px`;
  }

  resetOverlayBounds() {
    const overlay = this.shadowRoot?.querySelector(".edit-overlay");
    if (!overlay) return;
    overlay.style.left = "0";
    overlay.style.top = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
  }

  renderPreview() {
    const card = this.currentCard();
    if (!card) {
      return `<div class="empty-state">${this.escape(this.t("ui.emptyDashboard"))}</div>`;
    }
    const image = this.imageUrl(card.image);
    const dashboardUrl = this.dashboardPreviewUrl(card.preview_url);
    const visibleCount = card.elements.filter((element) =>
      this.hasPosition((element.config || {}).style || {}) &&
      this.isElementConditionActive(element)
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
        const zIndexValue = style["z-index"] || style.zIndex;
        const zIndex = zIndexValue ? `z-index:${this.cssValue(zIndexValue)};` : "";
        const transform = style.transform
          ? `transform:${this.cssValue(style.transform)};`
          : "transform:translate(-50%, -50%);";
        const left = this.cssValue(style.left, "50%");
        const top = this.cssValue(style.top, "50%");
        const classes = this.elementClasses(element, style);
        return `
          <button
            class="${classes}"
            style="left:${left};top:${top};${width}${height}${opacity}${zIndex}${transform}"
            data-card-index="${this.state.cardIndex}"
            data-element-index="${index}"
            data-style-left="${this.escape(style.left || "")}"
            data-style-top="${this.escape(style.top || "")}"
            data-style-width="${this.escape(style.width || "")}"
            data-style-height="${this.escape(style.height || "")}"
            data-style-transform="${this.escape(style.transform || "")}"
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
        <select id="previewSize" title="${this.escape(this.t("ui.previewSize"))}">
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
        <select id="previewOrientation" title="${this.escape(this.t("ui.previewOrientation"))}">
          <option value="portrait" ${this.state.previewOrientation === "portrait" ? "selected" : ""}>${this.escape(this.t("ui.portrait"))}</option>
          <option value="landscape" ${this.state.previewOrientation === "landscape" ? "selected" : ""}>${this.escape(this.t("ui.landscape"))}</option>
        </select>
        <select id="previewScaleMode" title="${this.escape(this.t("ui.previewScale"))}">
          <option value="fit" ${this.state.previewScaleMode === "fit" ? "selected" : ""}>${this.escape(this.t("ui.fitWhole"))}</option>
          <option value="actual" ${this.state.previewScaleMode === "actual" ? "selected" : ""}>${this.escape(this.t("ui.actualCssPx"))}</option>
        </select>
        <label class="hitbox-toggle" title="${this.escape(this.t("ui.showHitboxesTitle"))}">
          <input id="showHitboxes" type="checkbox" ${this.state.showHitboxes ? "checked" : ""}>
          ${this.escape(this.t("ui.showHitboxes"))}
        </label>
        <span>${this.escape(this.t("ui.positionedCount", { width: dimensions.width, height: dimensions.height, count: visibleCount }))}</span>
      </div>
      <div class="preview-frame scale-${this.escape(this.state.previewScaleMode)}">
        <div id="previewFit" class="preview-fit">
          <div class="plan-stage ${this.state.showHitboxes ? "show-hitboxes" : ""}" style="width:${dimensions.width}px;--preview-height:${dimensions.height}px;" data-viewport="${dimensions.width}x${dimensions.height}">
            ${
              dashboardUrl
                ? `<iframe class="dashboard-frame" src="${this.escape(dashboardUrl)}" title="${this.escape(this.t("ui.officialPreview"))}"></iframe>`
                : `<div id="realCardHost" class="real-card-host"></div>`
            }
            <div class="fallback-preview">
              ${
                image
                  ? `<img class="plan-bg" src="${this.escape(image)}" alt="">`
                  : `<div class="missing-bg">${this.escape(this.t("ui.missingImage"))}</div>`
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
          <div class="inspector-head">
            <div>
              <h2>${this.escape(this.t("ui.inspector"))}</h2>
            </div>
            <div class="inspector-actions">
              <button id="undoChange" type="button" title="${this.escape(this.t("ui.undoTitle"))}" ${this.state.undoStack.length ? "" : "disabled"}>${this.escape(this.t("ui.undo"))}</button>
            </div>
          </div>
          <p class="muted">${this.escape(this.t("ui.inspectorHelp"))}</p>
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
            <p>${this.escape(config.card_type || config.type || "element")}${element.line ? ` - ${this.escape(this.t("ui.line", { line: element.line }))}` : ""}</p>
          </div>
          <div class="inspector-actions">
            <button id="undoChange" type="button" title="${this.escape(this.t("ui.undoTitle"))}" ${this.state.undoStack.length ? "" : "disabled"}>${this.escape(this.t("ui.undo"))}</button>
            <button id="deleteElement" class="danger" type="button" title="${this.escape(this.t("ui.deleteTitle"))}" ${this.state.loading ? "disabled" : ""}>${this.escape(this.t("ui.delete"))}</button>
            <button id="saveElement" class="primary" ${this.state.loading ? "disabled" : ""}>${this.escape(this.t("ui.save"))}</button>
          </div>
        </div>

        <div class="field-grid">
          <label>
            ${this.escape(this.t("ui.entity"))}
            <input data-field="entity" value="${this.escape(config.entity || "")}" placeholder="light.kitchen">
          </label>
          <label>
            ${this.escape(this.t("ui.icon"))}
            <input data-field="icon" value="${this.escape(config.icon || "")}" placeholder="mdi:lightbulb">
          </label>
          <label>
            ${this.escape(this.t("ui.leftPercent"))}
            <input data-percent-field="style.left" type="number" step="0.1" value="${this.percentToNumber(style.left)}">
          </label>
          <label>
            ${this.escape(this.t("ui.topPercent"))}
            <input data-percent-field="style.top" type="number" step="0.1" value="${this.percentToNumber(style.top)}">
          </label>
          <label>
            ${this.escape(this.t("ui.widthPercent"))}
            <input data-percent-field="style.width" type="number" step="0.1" value="${this.percentToNumber(style.width)}">
          </label>
          <label>
            ${this.escape(this.t("ui.heightPercent"))}
            <input data-percent-field="style.height" type="number" step="0.1" value="${this.percentToNumber(style.height)}">
          </label>
          <label>
            ${this.escape(this.t("ui.opacity"))}
            <input data-number-field="style.opacity" type="number" step="0.05" min="0" max="1" value="${this.escape(style.opacity || "")}">
          </label>
          <label>
            ${this.escape(this.t("ui.zIndex"))}
            <input data-number-field="style.z-index" type="number" step="1" value="${this.escape(style["z-index"] || "")}">
          </label>
          <label>
            ${this.escape(this.t("ui.color"))}
            <div class="color-field">
              <input data-color-field="style.color" type="color" value="${this.escape(this.colorPickerValue(style.color))}">
              <input data-field="style.color" value="${this.escape(style.color || "")}" placeholder="${this.escape(this.t("ui.colorPlaceholder"))}">
            </div>
          </label>
          <label>
            ${this.escape(this.t("ui.background"))}
            <div class="color-field">
              <input data-color-field="style.background" type="color" value="${this.escape(this.colorPickerValue(style.background))}">
              <input data-field="style.background" value="${this.escape(style.background || "")}" placeholder="${this.escape(this.t("ui.colorPlaceholder"))}">
            </div>
          </label>
        </div>

        <section class="nudge-panel">
          <div class="nudge-head">
            <h3>${this.escape(this.t("ui.nudge"))}</h3>
            <p>${this.escape(this.t("ui.keyboardNudgeHelp"))}</p>
          </div>
          ${this.renderNudgeGroup("0.1", this.t("ui.nudgeFine"))}
          ${this.renderNudgeGroup("1", this.t("ui.nudgeCoarse"))}
        </section>

        <section class="nudge-panel">
          <div class="nudge-head">
            <h3>${this.escape(this.t("ui.sizeTools"))}</h3>
            <p>${this.escape(this.t("ui.sizeHelp"))}</p>
          </div>
          ${this.renderResizeGroup("0.1", this.t("ui.sizeFine"))}
          ${this.renderResizeGroup("1", this.t("ui.sizeCoarse"))}
          <button id="responsiveSize" class="wide-button" type="button" title="${this.escape(this.t("ui.responsivePercentTitle"))}">
            ${this.escape(this.t("ui.responsivePercent"))}
          </button>
        </section>

        <label class="wide-field">
          ${this.escape(this.t("ui.transform"))}
          <input data-field="style.transform" value="${this.escape(style.transform || "")}" placeholder="translate(-50%, -50%) scale(1.1)">
        </label>

        <label class="wide-field">
          ${this.escape(this.t("ui.image"))}
          <input data-field="image" value="${this.escape(config.image || "")}" placeholder="/local/floorplan/light.png">
        </label>

        <details class="advanced" ${this.state.advancedDirty ? "open" : ""}>
          <summary>${this.escape(this.t("ui.advancedYaml"))}</summary>
          <textarea id="advancedText" spellcheck="false">${this.escape(this.state.advancedText)}</textarea>
          <div class="advanced-actions">
            <button id="openAdvancedModal" type="button">${this.escape(this.t("ui.expandEditor"))}</button>
            <button id="saveAdvanced" type="button" ${this.state.loading ? "disabled" : ""}>${this.escape(this.t("ui.saveYamlFragment"))}</button>
          </div>
        </details>
      </section>
    `;
  }

  renderNudgeGroup(step, label) {
    const buttons = [
      ["ui.nudgeLeft", "mdi:arrow-left", -1, 0],
      ["ui.nudgeUp", "mdi:arrow-up", 0, -1],
      ["ui.nudgeDown", "mdi:arrow-down", 0, 1],
      ["ui.nudgeRight", "mdi:arrow-right", 1, 0],
    ];
    return `
      <div class="nudge-group">
        <span>${this.escape(label)}</span>
        <div class="nudge-buttons">
          ${buttons
            .map(
              ([titleKey, icon, dx, dy]) => `
                <button
                  class="icon-button"
                  type="button"
                  title="${this.escape(this.t(titleKey))}"
                  data-nudge-step="${this.escape(step)}"
                  data-nudge-x="${dx}"
                  data-nudge-y="${dy}"
                >
                  <ha-icon icon="${icon}"></ha-icon>
                </button>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  renderAdvancedModal() {
    const element = this.currentElement();
    if (!this.state.advancedExpanded || !element) return "";

    return `
      <div id="advancedModalBackdrop" class="modal-backdrop">
        <section class="yaml-modal" role="dialog" aria-modal="true" aria-label="${this.escape(this.t("ui.advancedYaml"))}">
          <div class="yaml-modal-head">
            <div>
              <h2>${this.escape(this.displayLabel(element))}</h2>
              <p>${this.escape(this.t("ui.advancedYaml"))}</p>
            </div>
            <button id="closeAdvancedModal" type="button">${this.escape(this.t("ui.close"))}</button>
          </div>
          <textarea id="advancedModalText" spellcheck="false">${this.escape(this.state.advancedText)}</textarea>
          <div class="yaml-modal-actions">
            <button id="saveAdvancedModal" class="primary" type="button" ${this.state.loading ? "disabled" : ""}>${this.escape(this.t("ui.saveYamlFragment"))}</button>
          </div>
        </section>
      </div>
    `;
  }

  renderResizeGroup(step, label) {
    const buttons = [
      ["width", -1, "mdi:arrow-collapse-horizontal", `${this.t("ui.shrink")} ${this.t("ui.sizeWidth")}`],
      ["width", 1, "mdi:arrow-expand-horizontal", `${this.t("ui.grow")} ${this.t("ui.sizeWidth")}`],
      ["both", -1, "mdi:minus", `${this.t("ui.shrink")} ${this.t("ui.sizeAll")}`],
      ["both", 1, "mdi:plus", `${this.t("ui.grow")} ${this.t("ui.sizeAll")}`],
      ["height", -1, "mdi:arrow-collapse-vertical", `${this.t("ui.shrink")} ${this.t("ui.sizeHeight")}`],
      ["height", 1, "mdi:arrow-expand-vertical", `${this.t("ui.grow")} ${this.t("ui.sizeHeight")}`],
    ];
    return `
      <div class="nudge-group size-group">
        <span>${this.escape(label)}</span>
        <div class="nudge-buttons">
          ${buttons
            .map(
              ([target, direction, icon, title]) => `
                <button
                  class="icon-button"
                  type="button"
                  title="${this.escape(title)}"
                  data-resize-step="${this.escape(step)}"
                  data-resize-target="${this.escape(target)}"
                  data-resize-direction="${direction}"
                >
                  <ha-icon icon="${icon}"></ha-icon>
                </button>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  renderAddElementModal() {
    if (!this.state.addElementOpen || !this.currentCard()) return "";
    const yaml = this.state.addElementYaml || this.defaultNewElementYaml();
    const isYaml = this.state.addElementMode === "yaml";

    return `
      <div id="addElementBackdrop" class="modal-backdrop">
        <section class="add-modal" role="dialog" aria-modal="true" aria-label="${this.escape(this.t("ui.addElement"))}">
          <div class="yaml-modal-head">
            <div>
              <h2>${this.escape(this.t("ui.addElement"))}</h2>
              <p>${this.escape(this.t("ui.addElementHelp"))}</p>
            </div>
            <button id="closeAddElement" type="button">${this.escape(this.t("ui.close"))}</button>
          </div>

          <div class="add-mode-tabs">
            <button type="button" data-add-mode="basic" class="${!isYaml ? "selected" : ""}">${this.escape(this.t("ui.basic"))}</button>
            <button type="button" data-add-mode="yaml" class="${isYaml ? "selected" : ""}">${this.escape(this.t("ui.yaml"))}</button>
          </div>

          ${isYaml ? `
            <label class="wide-field">
              ${this.escape(this.t("ui.initialYaml"))}
              <textarea id="newElementYaml" spellcheck="false">${this.escape(yaml)}</textarea>
            </label>
            <div class="yaml-modal-actions">
              <button id="createElementYaml" class="primary" type="button" ${this.state.loading ? "disabled" : ""}>${this.escape(this.t("ui.addWithYaml"))}</button>
            </div>
          ` : `
            <div class="field-grid add-field-grid">
              <label>
                ${this.escape(this.t("ui.elementType"))}
                <select id="newElementType">
                  <option value="state-icon">state-icon</option>
                  <option value="state-label">state-label</option>
                  <option value="state-badge">state-badge</option>
                  <option value="image">image</option>
                  <option value="custom:button-card">custom:button-card</option>
                  <option value="custom:hui-element">custom:hui-element / tile</option>
                </select>
              </label>
              <label>
                ${this.escape(this.t("ui.entity"))}
                <input id="newElementEntity" placeholder="light.kitchen">
              </label>
              <label>
                ${this.escape(this.t("ui.name"))}
                <input id="newElementName" placeholder="${this.escape(this.t("ui.addElement"))}">
              </label>
              <label>
                ${this.escape(this.t("ui.icon"))}
                <input id="newElementIcon" placeholder="mdi:lightbulb">
              </label>
              <label>
                ${this.escape(this.t("ui.image"))}
                <input id="newElementImage" placeholder="/local/floorplan/item.png">
              </label>
              <label>
                ${this.escape(this.t("ui.leftPercent"))}
                <input id="newElementLeft" type="number" step="0.1" value="50">
              </label>
              <label>
                ${this.escape(this.t("ui.topPercent"))}
                <input id="newElementTop" type="number" step="0.1" value="50">
              </label>
              <label>
                ${this.escape(this.t("ui.widthPercent"))}
                <input id="newElementWidth" type="text" placeholder="10 / 10%">
              </label>
              <label>
                ${this.escape(this.t("ui.heightPercent"))}
                <input id="newElementHeight" type="text" placeholder="auto">
              </label>
              <label>
                ${this.escape(this.t("ui.color"))}
                <div class="color-field">
                  <input id="newElementColor" type="color" value="#ffffff">
                  <input id="newElementColorText" value="" placeholder="${this.escape(this.t("ui.colorPlaceholder"))}">
                </div>
              </label>
              <label>
                ${this.escape(this.t("ui.background"))}
                <div class="color-field">
                  <input id="newElementBackground" type="color" value="#000000">
                  <input id="newElementBackgroundText" value="" placeholder="${this.escape(this.t("ui.colorPlaceholder"))}">
                </div>
              </label>
              <label>
                ${this.escape(this.t("ui.transform"))}
                <input id="newElementTransform" value="translate(-50%, -50%)">
              </label>
            </div>
            <div class="yaml-modal-actions">
              <button id="createElementBasic" class="primary" type="button" ${this.state.loading ? "disabled" : ""}>${this.escape(this.t("ui.createElement"))}</button>
            </div>
          `}
        </section>
      </div>
    `;
  }

  renderFilePicker() {
    const card = this.currentCard();
    return `
      <aside class="files">
        <div class="files-head">
          <h2>${this.escape(this.t("ui.dashboards"))}</h2>
          <button id="refreshFiles" title="${this.escape(this.t("ui.refreshListTitle"))}">${this.escape(this.t("ui.refreshList"))}</button>
        </div>
        <select id="fileSelect" size="12">
          <option value="">${this.escape(this.t("ui.chooseDashboard"))}</option>
          ${this.state.files
            .map(
              (file) => {
                const label = this.localizedFileLabel(file.label || file.path);
                const suffix =
                  file.source === "lovelace"
                    ? file.cards
                      ? ` - ${this.t("file.cards", { count: file.cards })}`
                      : ` - ${this.t("file.ui")}`
                    : file.cards
                      ? ` - ${this.t("file.cards", { count: file.cards })}`
                      : ` - ${this.t("file.yamlDashboard")}`;
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
        <button id="loadFile" class="primary" ${!this.state.selectedFile ? "disabled" : ""}>${this.escape(this.t("ui.load"))}</button>
        <p class="muted">${this.escape(this.t("ui.dashboardHelp"))}</p>
        ${card ? this.renderElementList() : ""}
      </aside>
    `;
  }

  localizedFileLabel(value) {
    return String(value || "").replace(/\(UI dashboard\)/i, `(${this.t("file.uiDashboard")})`);
  }

  elementTypeFilterOptions() {
    return [
      ["visible", this.t("filter.visible")],
      ["all", this.t("filter.all")],
      ["hotspots", this.t("filter.hotspots")],
      ["widgets", this.t("filter.widgets")],
      ["images", this.t("filter.images")],
      ["conditional", this.t("filter.conditional")],
    ];
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
          <h2>${this.escape(this.t("ui.elements"))}</h2>
          <span>${items.length}/${totalPositioned}</span>
        </div>
        <input
          id="elementFilter"
          class="element-filter"
          value="${this.escape(this.state.elementFilter)}"
          placeholder="${this.escape(this.t("ui.searchElement"))}"
        >
        <div class="element-filter-tabs">
          ${this.elementTypeFilterOptions()
            .map(
              ([value, label]) => `
                <button
                  class="${this.state.elementTypeFilter === value ? "selected" : ""}"
                  type="button"
                  data-element-type-filter="${this.escape(value)}"
                >
                  ${this.escape(label)}
                </button>
              `
            )
            .join("")}
        </div>
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
            <p>${this.escape(this.statusText())}</p>
          </div>
          <span class="pill">v${UI_VERSION}</span>
          ${this.state.loading ? `<span class="pill">${this.escape(this.t("ui.working"))}</span>` : ""}
          ${this.state.dirty || this.state.advancedDirty ? `<span class="pill dirty">${this.escape(this.t("ui.unsaved"))}</span>` : ""}
        </header>
        ${this.state.error ? `<div class="error">${this.escape(this.state.error)}</div>` : ""}
        <main class="layout">
          ${this.renderFilePicker()}
          <section class="preview">
            ${this.renderPreview()}
          </section>
          ${this.renderInspector()}
        </main>
        ${this.currentCard() ? `
          <button id="openAddElement" class="add-fab" type="button" title="${this.escape(this.t("ui.addElementTitle"))}">
            <ha-icon icon="mdi:plus"></ha-icon>
            <span>${this.escape(this.t("ui.addElement"))}</span>
          </button>
        ` : ""}
        ${this.renderAdvancedModal()}
        ${this.renderAddElementModal()}
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

    this.shadowRoot.querySelectorAll("[data-element-type-filter]").forEach((node) => {
      node.addEventListener("click", () => {
        this.state.elementTypeFilter = node.dataset.elementTypeFilter || "visible";
        this.render();
      });
    });

    const cardSelect = this.shadowRoot.querySelector("#cardSelect");
    cardSelect?.addEventListener("change", (event) => {
      this.state.cardIndex = Number.parseInt(event.target.value, 10) || 0;
      this.state.selectedElementPath = null;
      this.state.advancedText = "";
      this.state.advancedDirty = false;
      this.state.addElementOpen = false;
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

    const previewScaleMode = this.shadowRoot.querySelector("#previewScaleMode");
    previewScaleMode?.addEventListener("change", (event) => {
      this.state.previewScaleMode = event.target.value;
      this.render();
    });

    this.shadowRoot.querySelector("#showHitboxes")?.addEventListener("change", (event) => {
      this.state.showHitboxes = event.target.checked;
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
    this.shadowRoot.querySelectorAll("[data-color-field]").forEach((input) => {
      input.addEventListener("change", (event) => {
        const field = input.dataset.colorField;
        const value = event.target.value;
        const pairedText = this.shadowRoot.querySelector(`input[data-field="${field}"]`);
        if (pairedText) pairedText.value = value;
        this.updateField(field, value);
      });
    });

    this.shadowRoot
      .querySelector("#saveElement")
      ?.addEventListener("click", () => this.saveSelected(false));
    this.shadowRoot
      .querySelector("#undoChange")
      ?.addEventListener("click", () => this.undoLastChange());
    this.shadowRoot
      .querySelector("#deleteElement")
      ?.addEventListener("click", () => this.deleteSelectedElement());
    this.shadowRoot
      .querySelector("#saveAdvanced")
      ?.addEventListener("click", () => this.saveSelected(true));

    this.shadowRoot.querySelectorAll("[data-nudge-step]").forEach((node) => {
      node.addEventListener("click", () => {
        const dx = Number.parseFloat(node.dataset.nudgeX || "0");
        const dy = Number.parseFloat(node.dataset.nudgeY || "0");
        const step = Number.parseFloat(node.dataset.nudgeStep || "0.1");
        this.nudgeSelected(dx, dy, Number.isFinite(step) ? step : 0.1);
      });
    });

    this.shadowRoot.querySelectorAll("[data-resize-step]").forEach((node) => {
      node.addEventListener("click", () => {
        const target = node.dataset.resizeTarget || "both";
        const direction = Number.parseFloat(node.dataset.resizeDirection || "0");
        const step = Number.parseFloat(node.dataset.resizeStep || "0.1");
        this.resizeSelected(target, Number.isFinite(direction) ? direction : 0, Number.isFinite(step) ? step : 0.1);
      });
    });
    this.shadowRoot
      .querySelector("#responsiveSize")
      ?.addEventListener("click", () => this.applyResponsiveSelectedSize());

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
      this.setStatus("status.yamlDirty");
    });
    this.shadowRoot.querySelector("#advancedModalText")?.addEventListener("input", (event) => {
      this.state.advancedText = event.target.value;
      this.state.advancedDirty = true;
      this.setStatus("status.yamlDirty");
      const inline = this.shadowRoot.querySelector("#advancedText");
      if (inline) inline.value = event.target.value;
    });

    this.shadowRoot.querySelector("#openAddElement")?.addEventListener("click", () => {
      this.state.addElementOpen = true;
      this.state.addElementMode = "basic";
      this.state.addElementYaml = this.state.addElementYaml || this.defaultNewElementYaml();
      this.render();
    });
    this.shadowRoot.querySelector("#closeAddElement")?.addEventListener("click", () => {
      this.state.addElementOpen = false;
      this.render();
    });
    this.shadowRoot.querySelector("#addElementBackdrop")?.addEventListener("click", (event) => {
      if (event.target.id === "addElementBackdrop") {
        this.state.addElementOpen = false;
        this.render();
      }
    });
    this.shadowRoot.querySelectorAll("[data-add-mode]").forEach((node) => {
      node.addEventListener("click", () => {
        this.state.addElementMode = node.dataset.addMode || "basic";
        this.state.addElementYaml = this.shadowRoot.querySelector("#newElementYaml")?.value || this.state.addElementYaml || this.defaultNewElementYaml();
        this.render();
      });
    });
    this.shadowRoot.querySelector("#newElementYaml")?.addEventListener("input", (event) => {
      this.state.addElementYaml = event.target.value;
    });
    this.shadowRoot.querySelector("#createElementBasic")?.addEventListener("click", () => {
      this.addElement(false);
    });
    this.shadowRoot.querySelector("#createElementYaml")?.addEventListener("click", () => {
      const textarea = this.shadowRoot.querySelector("#newElementYaml");
      if (textarea) this.state.addElementYaml = textarea.value;
      this.addElement(true);
    });
    const addColor = this.shadowRoot.querySelector("#newElementColor");
    const addColorText = this.shadowRoot.querySelector("#newElementColorText");
    addColor?.addEventListener("change", (event) => {
      if (addColorText) addColorText.value = event.target.value;
    });
    const addBackground = this.shadowRoot.querySelector("#newElementBackground");
    const addBackgroundText = this.shadowRoot.querySelector("#newElementBackgroundText");
    addBackground?.addEventListener("change", (event) => {
      if (addBackgroundText) addBackgroundText.value = event.target.value;
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

  h3 {
    margin: 0;
    font-size: 13px;
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

  .element-filter-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 10px;
  }

  .element-filter-tabs button {
    min-height: 28px;
    padding: 4px 7px;
    border-radius: 999px;
    font-size: 11px;
  }

  .element-filter-tabs button.selected {
    border-color: var(--vde-accent);
    background: color-mix(in srgb, var(--vde-accent) 14%, transparent);
    color: var(--vde-text);
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

  button.danger {
    background: color-mix(in srgb, var(--vde-danger) 14%, var(--vde-panel));
    border-color: color-mix(in srgb, var(--vde-danger) 52%, var(--vde-line));
    color: var(--vde-danger);
  }

  button.danger:hover {
    border-color: var(--vde-danger);
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

  #previewScaleMode {
    flex: 0 0 128px;
  }

  .hitbox-toggle {
    min-height: 36px;
    display: inline-flex;
    grid-template-columns: none;
    align-items: center;
    gap: 7px;
    white-space: nowrap;
    color: var(--vde-text);
  }

  .hitbox-toggle input {
    width: auto;
    min-height: 0;
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

  .preview-frame.scale-fit {
    overflow: hidden;
  }

  .preview-frame.scale-actual {
    overflow: auto;
    max-height: calc(100vh - 152px);
    padding-bottom: 12px;
  }

  .preview-fit {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    min-height: 220px;
  }

  .preview-frame.scale-actual .preview-fit {
    justify-content: flex-start;
    width: max-content;
    min-width: 100%;
  }

  .plan-stage {
    position: relative;
    flex: 0 0 auto;
    max-width: none;
    height: var(--preview-height, auto);
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

  .preview-frame.scale-actual .plan-stage {
    margin: 0;
    transform-origin: top left;
  }

  .real-card-host {
    position: relative;
    z-index: 1;
    pointer-events: none;
  }

  .dashboard-frame {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
    height: 100%;
    min-height: 220px;
    border: 0;
    background: var(--vde-panel);
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
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
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

  .plan-element.click-through {
    pointer-events: none;
  }

  .plan-element.not-rendered {
    pointer-events: none;
  }

  .plan-element.has-explicit-size {
    padding: 0;
  }

  .plan-element.selected {
    z-index: 1000 !important;
  }

  .plan-stage.show-hitboxes .plan-element:not(.click-through):not(.not-rendered) {
    background: rgba(0, 153, 255, 0.14);
    outline: 1px solid rgba(0, 176, 255, 0.72);
    outline-offset: -1px;
    border-radius: 5px;
  }

  .plan-stage.show-hitboxes .plan-element.selected:not(.click-through):not(.not-rendered) {
    background: rgba(255, 176, 0, 0.16);
    outline-color: rgba(255, 176, 0, 0.9);
  }

  .plan-stage.show-hitboxes .plan-element .element-chip {
    opacity: 0.88;
    transform: translateY(0);
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

  .inspector-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 0 0 auto;
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

  .color-field {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr);
    gap: 6px;
    align-items: center;
  }

  .color-field input[type="color"] {
    width: 44px;
    min-width: 44px;
    height: 34px;
    padding: 2px;
  }

  .wide-field {
    margin-top: 10px;
  }

  .nudge-panel {
    margin-top: 12px;
    padding: 10px;
    border: 1px solid var(--vde-line);
    border-radius: 8px;
    background: color-mix(in srgb, var(--vde-panel) 92%, var(--vde-accent));
  }

  .nudge-head {
    display: grid;
    gap: 2px;
    margin-bottom: 8px;
  }

  .nudge-head p {
    color: var(--vde-muted);
    font-size: 11px;
    line-height: 1.35;
  }

  .nudge-group {
    display: grid;
    grid-template-columns: minmax(82px, 1fr) auto;
    gap: 8px;
    align-items: center;
    margin-top: 8px;
  }

  .nudge-group > span {
    color: var(--vde-muted);
    font-size: 12px;
  }

  .nudge-buttons {
    display: flex;
    gap: 5px;
  }

  .size-group .nudge-buttons {
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .icon-button {
    width: 34px;
    min-height: 34px;
    display: inline-grid;
    place-items: center;
    padding: 0;
  }

  .icon-button ha-icon {
    width: 18px;
    height: 18px;
  }

  .wide-button {
    width: 100%;
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

  .add-modal {
    width: min(760px, 92vw);
    max-height: min(820px, 88vh);
    overflow: auto;
    display: grid;
    gap: 14px;
    padding: 18px;
    border: 1px solid var(--vde-line);
    border-radius: 10px;
    background: var(--vde-panel);
    color: var(--vde-text);
    box-shadow: 0 22px 70px rgba(0, 0, 0, 0.35);
  }

  .add-mode-tabs {
    display: inline-flex;
    width: fit-content;
    padding: 3px;
    border: 1px solid var(--vde-line);
    border-radius: 8px;
    background: color-mix(in srgb, var(--vde-panel) 88%, var(--vde-bg));
  }

  .add-mode-tabs button {
    min-height: 30px;
    border: 0;
    border-radius: 6px;
    background: transparent;
  }

  .add-mode-tabs button.selected {
    background: var(--vde-accent);
    color: white;
  }

  .add-field-grid {
    align-items: end;
  }

  .add-modal textarea {
    min-height: 340px;
  }

  .add-fab {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 20;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    padding: 0 16px 0 12px;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--vde-accent) 60%, transparent);
    background: var(--vde-accent);
    color: white;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.24);
  }

  .add-fab ha-icon {
    width: 22px;
    height: 22px;
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
