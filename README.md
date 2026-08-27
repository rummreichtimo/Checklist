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

## Unternehmensdatenbank

`COMPANY_DB` in `app.html` enthält 51 recherchierte Unternehmen (18 VFX/Medien, 17 BWL/Wirtschaft,
16 Technik/Engineering) aus Gifhorn, Wolfsburg, Braunschweig, Hannover und Umgebung.
Recherchiert im August 2026 über die offiziellen Unternehmens- und Karriereseiten.

Regeln für neue Einträge (siehe Kommentar über dem Array):

- Nur belegte Felder füllen, sonst `NA` bzw. `NA_SALARY` („Vergütung: nicht öffentlich angegeben“).
- `status`: `offer` (konkretes Angebot gefunden), `unclear` (Praktika möglich, nichts Konkretes belegt),
  `none` (kein passendes Angebot – Initiativbewerbung).
- `lastVerified` im Format `MM/JJJJ`; älter als sechs Monate erzeugt automatisch einen Hinweis.
- `fit` enthält Profil-Tags; daraus berechnet `fitStars()` die Passung (1–5 Sterne) nach den Gewichten
  in `FIT_W`. `suitabilityReason` und `gapYearNote` bleiben handgeschrieben.

Bewerbungen, die aus der Datenbank übernommen werden, speichern die Unternehmens-ID (`dbId`) und sind
damit dauerhaft mit dem Datensatz verknüpft.

## Funktionen

- **Dashboard** mit Gap-Year-Fortschritt, Status-Kennzahlen, nächsten Schritten und Empfehlungen aus der Datenbank
- **Unternehmen finden**: Suche, Filter (Bereich, Standort, Entfernung ab Gifhorn, Dauer, Vergütung,
  Praktikumsart), Detailansicht, Favoriten und Vergleich von bis zu vier Unternehmen
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
