# Visual Dashboard Editor

**Jazyk / Language / Sprache:** Čeština | [English](docs/README.en.md) | [Deutsch](docs/README.de.md)

Vizuální editor pro Home Assistant dashboardy. Cíl je jednoduchý: místo hledání v tisících řádků YAML kódu klikneš na prvek ve floorplanu nebo 3D plánu a upravíš jeho základní parametry přímo v UI.

Aktuální verze je zaměřená na karty typu `picture-elements`, protože právě ty se často používají pro 3D floorplan dashboardy. Editor umí načítat UI/storage dashboardy vytvořené v Home Assistantu a také YAML dashboardy, které opravdu obsahují editovatelnou kartu `picture-elements`.

## Rychlá Instalace

[![Open your Home Assistant instance and open this repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Paulee196&repository=visual-dashboard-editor&category=integration)

Po instalaci a restartu můžeš integraci rovnou přidat tady:

[![Open your Home Assistant instance and start setting up Visual Dashboard Editor.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=visual_dashboard_editor)

## Co To Umí Teď

- přidá do Home Assistantu sidebar panel `Visual Dashboard Editor`
- najde UI/storage dashboardy v Home Assistantu
- najde YAML dashboardy s kartou `picture-elements`
- vykreslí reálný náhled Lovelace dashboardu s editovací vrstvou
- po kliknutí na prvek zobrazí inspector
- umí upravit `entity`, `icon`, `image`, `style.left`, `style.top`, `style.width`, `style.height`, `style.opacity`, `style.z-index`, `style.color`, `style.background` a `style.transform`
- umí prvek posouvat myší přímo v náhledu
- umí zobrazit reálné klikací plochy pro ladění výběru prvků
- umí jemně posouvat vybraný prvek tlačítky nebo klávesovými šipkami
- umí vrátit poslední lokální změnu před uložením
- umí přidat nový `picture-elements` prvek přes tlačítko `+`, buď základním formulářem, nebo přímým YAML zápisem
- umí filtrovat seznam prvků podle viditelnosti, hotspotů, widgetů, obrázků a podmínek
- umí zobrazit a uložit YAML fragment vybraného prvku
- před uložením dělá backup do `.visual_dashboard_editor_backups`

## Instalace Pro Test

### Přes HACS Jako Custom Repository

1. Klikni na tlačítko v sekci `Rychlá Instalace`, nebo v HACS přidej repozitář jako `Integration`.
2. Nainstaluj `Visual Dashboard Editor`.
3. Restartuj Home Assistant.
4. V `Nastavení -> Zařízení a služby -> Přidat integraci` přidej `Visual Dashboard Editor`.
5. V sidebaru otevři `Visual Dashboard Editor`.

### Ručně

1. Zkopíruj složku `custom_components/visual_dashboard_editor` do `/config/custom_components/visual_dashboard_editor`.
2. Restartuj Home Assistant.
3. Přidej integraci v UI, nebo do `configuration.yaml` vlož:

```yaml
visual_dashboard_editor:
```

4. Restartuj Home Assistant.

## Jak To Použít

1. Otevři sidebar panel `Visual Dashboard Editor`.
2. Vyber UI dashboard nebo YAML dashboard.
3. Klikni na `Načíst`.
4. Vyber `picture-elements` kartu, pokud jich je v dashboardu víc.
5. Klikni na prvek ve floorplanu.
6. Uprav hodnoty v inspectoru nebo prvek posuň myší.
7. Klikni na `Uložit`.

## Důležité Limity

- Storage dashboardy se ukládají přes Home Assistant Lovelace runtime. Backup se ukládá jako JSON.
- YAML dashboardy se v seznamu zobrazují jen tehdy, když obsahují kartu `picture-elements`.
- Ukládání YAML souboru se snaží zachovat zbytek souboru přes `ruamel.yaml`, ale upravený element může ztratit část ručního formátování nebo komentářů přímo uvnitř daného elementu.
- Zatím nehledá prvek kliknutím v normálním dashboardu. Je to samostatný editor panel. Floating tlačítko do běžného dashboardu je další možný krok.

## Proč Takhle

Home Assistant umí vlastní panely a vlastní karty přes frontend custom elements. Custom karty mají vlastní grafické editory, ale ty fungují pro jednu konkrétní kartu. Tenhle editor jde jinou cestou: backend načte existující dashboard, najde `picture-elements` konfiguraci a frontend nad ní postaví specializovaný visual inspector.

## Plán Dalších Kroků

- přesnější měření mobilních viewportů
- resize handles přímo v náhledu
- redo
- diff před uložením
- vyhledávání prvků podle entity
- podpora `custom:config-template-card`
- volitelný frontend resource, který přidá malé `Visual edit` tlačítko přímo do dashboardu

## Pomoc Přes AI

Pro asistenty je v repozitáři připravený krátký návod: [AI_ASSISTANT_GUIDE.md](docs/AI_ASSISTANT_GUIDE.md). Popisuje, jaké informace si má AI od uživatele vyžádat a jak bezpečně pomáhat s úpravami jednotlivých prvků.
