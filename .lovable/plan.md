## Problem
Im TDEE-Rechner sind Alter / Größe / Gewicht in einem festen `grid-cols-3` angeordnet. Die Inputs benutzen `text-lg` und reservieren rechts `pr-14` für die Einheit ("cm", "kg"). Bei schmalen Viewports (< ~768 px, z. B. mobiler Preview) sind die drei Spalten so eng, dass 3‑stellige Werte wie `180` oder `100` links abgeschnitten werden – man sieht nur `80` bzw. `00`.

## Fix
- In `src/lib/calculators/tdee.tsx` das Grid responsive machen:
  - Mobile: `grid-cols-1` (jedes Feld volle Breite) 
  - Ab `sm` (640 px): `grid-cols-3`
- Damit bleibt das kompakte 3-Spalten-Layout auf normalen Bildschirmen erhalten, während auf schmalen Preview-/Handy-Viewports Größe (bis 4-stellig) und Gewicht komplett lesbar sind.

Keine Änderung an `NumberField` selbst (wirkt sonst auf alle Rechner).

## Nicht enthalten
- Kein Refactor anderer Rechner – nur der gemeldete Fall wird behoben. Bei anderen 3-Spalten-Grids kann derselbe Fix bei Bedarf punktuell nachgezogen werden.
