# Orientierungsjahr – Gap-Year-Planer

Eine einzelne, vollständig offline lauffähige Web-App zum Organisieren des Orientierungsjahres
nach dem Abi (Juli 2027 bis Juli 2028): Bewerbungs-Tracker, Unternehmensliste, Checkliste, Praktikums-Bewertungen,
Bereichsvergleich und Zeitplan.

## Dateien

| Datei | Zweck |
| --- | --- |
| `index.html` | Eigenständige Version zum lokalen Öffnen im Browser |
| `app.html` | Gleicher Inhalt ohne `<html>`/`<head>`/`<body>`, für die Veröffentlichung als Claude Artifact |
| `test/smoke.mjs` | Playwright-Smoke-Test über alle Kernfunktionen |

`index.html` wird aus `app.html` erzeugt:

```sh
{ printf '<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'; \
  sed -n '1,/^<\/style>$/p' app.html; printf '</head>\n<body>\n'; \
  sed -n '/^<\/style>$/,$p' app.html | tail -n +2; printf '</body>\n</html>\n'; } > index.html
```

## Funktionen

- **Dashboard** mit Gap-Year-Fortschritt, Status-Kennzahlen und nächsten Schritten
- **Bewerbungs-Tracker** mit acht Status, Suche und Filtern (Bereich, Status, Stadt, Zeitraum, Unternehmen)
- **Unternehmen** nach Bereich gruppiert, inklusive Direktanlage einer Bewerbung
- **Checkliste** mit gespeicherten Häkchen und eigenen Punkten/Listen
- **Praktikums-Bewertung** mit sechs Sternekriterien und Freitextfeldern
- **Vergleich** der drei Bereiche, automatisch aus den Bewertungen oder manuell überschrieben
- **Zeitplan** mit anpassbaren Phasenlängen und automatischer Fortschrittsberechnung
- **Daten**: Export/Import per Text sowie Zurücksetzen mit Sicherheitsabfrage
- Dark/Light/System-Design, Sidebar auf Desktop, Tab-Leiste auf dem Smartphone

Der Zeitplan startet standardmäßig am 1. Juli 2027 und lässt sich in der Ansicht „Zeitplan“ frei
verschieben. Alle Daten liegen im `localStorage` des Browsers (Schlüssel `orientierungsjahr.v1`).

## Test

```sh
npm i playwright
node test/smoke.mjs
```
