# Visual Dashboard Editor

Prvni prototyp vizualniho editoru pro YAML dashboardy v Home Assistantu. Cil je jednoduchy: misto hledani v tisicich radku YAMLu kliknes na prvek ve floorplanu/3D planu a upravis jeho zakladni parametry v UI.

Aktualni MVP je zamerene na karty typu `picture-elements`, protoze prave ty se casto pouzivaji pro 3D floorplan dashboardy.

## Rychla instalace

[![Open your Home Assistant instance and open this repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Paulee196&repository=visual-dashboard-editor&category=integration)

Po instalaci a restartu muzes integraci rovnou pridat tady:

[![Open your Home Assistant instance and start setting up Visual Dashboard Editor.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=visual_dashboard_editor)

## Co to umi ted

- prida do Home Assistantu sidebar panel `Visual Dashboard Editor`
- najde YAML soubory v HA config slozce
- vyhleda v nich `picture-elements` karty
- vykresli zjednodusene preview s pozicemi prvku
- po kliknuti na prvek zobrazi inspector
- umi upravit `entity`, `icon`, `image`, `style.left`, `style.top`, `style.width`, `style.height`, `style.opacity`, `style.z-index` a `style.transform`
- umi prvek posouvat mysi primo v preview
- umi zobrazit a ulozit YAML fragment vybraneho prvku
- pred ulozenim dela backup do `.visual_dashboard_editor_backups`

## Instalace pro test

### Pres HACS jako custom repository

1. Klikni na tlacitko v sekci `Rychla instalace`, nebo v HACS pridej repozitar jako `Integration`.
2. Nainstaluj `Visual Dashboard Editor`.
3. Restartuj Home Assistant.
4. V `Settings -> Devices & services -> Add integration` pridej `Visual Dashboard Editor`.
5. V sidebaru otevri `Visual Dashboard Editor`.

### Rucne

1. Zkopiruj slozku `custom_components/visual_dashboard_editor` do `/config/custom_components/visual_dashboard_editor`.
2. Restartuj Home Assistant.
3. Pridej integraci v UI, nebo do `configuration.yaml` vloz:

```yaml
visual_dashboard_editor:
```

4. Restartuj Home Assistant.

## Jak to pouzit

1. Otevri sidebar panel `Visual Dashboard Editor`.
2. Vyber YAML soubor dashboardu.
3. Klikni `Nacist`.
4. Vyber `picture-elements` kartu, pokud jich je v souboru vic.
5. Klikni na prvek ve floorplanu.
6. Uprav hodnoty v inspectoru nebo prvek posun mysi.
7. Klikni `Ulozit`.

## Dulezite limity MVP

- Podporuje jen YAML soubory v HA config adresari, ne storage dashboardy ulozene jen v `.storage`.
- Preview je zjednodusene. Neni to plny Home Assistant renderer, takze custom card vnorene uvnitr prvku se zatim nevykresli dokonale.
- Ukladani se snazi zachovat zbytek souboru pres `ruamel.yaml`, ale upraveny element muze ztratit cast rucniho formatovani nebo komentaru primo uvnitr daneho elementu.
- Zatim nehleda prvek kliknutim v normalnim dashboardu. Je to samostatny editor panel. Floating tlacitko do bezneho dashboardu je dalsi krok.

## Proc takhle

Home Assistant umi vlastni panely a vlastni karty pres frontend custom elements. Custom karty maji vlastni graficke editory, ale ty funguji pro jednu konkretni kartu. Tohle MVP jde jinou cestou: backend nacte existujici YAML, najde `picture-elements` konfiguraci a frontend nad ni postavi specializovany visual inspector.

## Plan dalsich kroku

- presnejsi preview se skutecnym pomerem stran obrazku
- resize handles primo v preview
- undo/redo
- diff pred ulozenim
- vyhledavani prvku podle entity
- podpora `custom:config-template-card`
- volitelny frontend resource, ktery prida male `Visual edit` tlacitko primo do dashboardu
- podpora storage dashboardu pres Lovelace API
