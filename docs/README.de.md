# Visual Dashboard Editor

**Sprache:** [Čeština](../README.md) | [English](README.en.md) | Deutsch

Visual Dashboard Editor ist eine Home-Assistant-Custom-Integration zum visuellen Bearbeiten von Lovelace-`picture-elements`-Dashboards. Sie ist besonders für Floorplan- und 3D-Plan-Dashboards gedacht, bei denen kleine Positionsänderungen in großen YAML-Dateien mühsam sind.

## Funktionen

- Fügt Home Assistant ein Seitenleisten-Panel `Visual Dashboard Editor` hinzu.
- Findet UI-/Storage-Dashboards und YAML-Dashboards mit editierbaren `picture-elements`-Karten.
- Rendert die echte Lovelace-Dashboard-Vorschau mit einer Editor-Ebene darüber.
- Ermöglicht das Anklicken eines Elements und das Bearbeiten von Position, Größe, Entity, Icon, Bild, Deckkraft, Z-index, Farbe, Hintergrund und Transform.
- Verschiebt das ausgewählte Element per Drag, Nudge-Buttons oder Pfeiltasten.
- Ändert die Größe des ausgewählten Elements per Buttons und kann die gerenderte Größe in responsive Prozentwerte umwandeln.
- Zeigt Klickflächen zur Fehlersuche bei ungenauer Auswahl.
- Unterstützt Undo für die letzte lokale Änderung vor dem Speichern.
- Fügt neue `picture-elements`-Elemente über den `+`-Button hinzu; das Grundformular erstellt eine `custom:button-card`, YAML bleibt für manuelle Snippets verfügbar.
- Löscht das ausgewählte Element und kann es mit `Rückgängig` wiederherstellen.
- Speichert das ausgewählte Element zurück ins Dashboard und erstellt vorher ein Backup.

## Schnellinstallation

[![Open your Home Assistant instance and open this repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Paulee196&repository=visual-dashboard-editor&category=integration)

Nach der Installation und einem Neustart von Home Assistant kann die Integration hier hinzugefügt werden:

[![Open your Home Assistant instance and start setting up Visual Dashboard Editor.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=visual_dashboard_editor)

## Hinweis

Das Home-Assistant-Panel nutzt automatisch die in Home Assistant konfigurierte Sprache. GitHub Markdown kann die sichtbare README-Sprache nicht automatisch umschalten, daher enthält dieses Repository Sprachlinks am Anfang jeder README-Datei.
