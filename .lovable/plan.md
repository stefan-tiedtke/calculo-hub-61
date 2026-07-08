## Ziel
Ein **TDEE-Rechner (Total Daily Energy Expenditure)** in der Kategorie **Sport**, der den täglichen Kalorienbedarf auf Basis von Grundumsatz (Mifflin-St Jeor) und Aktivitätsniveau berechnet – inkl. Empfehlungen für Abnehmen, Halten und Muskelaufbau.

## Eingaben
- Geschlecht (m / w) – Segmented
- Alter (Jahre)
- Größe (cm)
- Gewicht (kg)
- Aktivitätslevel (Segmented, 5 Stufen):
  - Sitzend (× 1,2) – kaum Bewegung
  - Leicht aktiv (× 1,375) – 1–3× Sport / Woche
  - Aktiv (× 1,55) – 3–5× Sport / Woche
  - Sehr aktiv (× 1,725) – 6–7× Sport / Woche
  - Extrem aktiv (× 1,9) – körperlich harter Job / 2× Training

## Ausgabe (ResultCard)
Hero-Zahl: **TDEE in kcal/Tag** (Erhaltungskalorien)

Aufschlüsselung:
- Grundumsatz (BMR)
- Aktivitätsumsatz (TDEE − BMR)
- **Erhaltung** (= TDEE)

Zusätzliche Tabelle "Zielkalorien":
| Ziel | kcal / Tag |
|---|---|
| Aggressives Defizit (−25 %) | z. B. 1.700 kcal |
| Moderates Defizit (−15 %) | z. B. 1.925 kcal |
| Leichtes Defizit (−10 %) | z. B. 2.040 kcal |
| **Erhaltung** | 2.265 kcal |
| Leichter Aufbau (+10 %) | 2.490 kcal |
| Moderater Aufbau (+20 %) | 2.720 kcal |

Kleiner Makro-Vorschlag bei Erhaltung: Eiweiß 1,8 g/kg · Fett 1,0 g/kg · Rest KH – als Zeile darunter.

## Formel
- BMR (Mifflin-St Jeor):
  - Männer: 10·kg + 6,25·cm − 5·Alter + 5
  - Frauen: 10·kg + 6,25·cm − 5·Alter − 161
- TDEE = BMR × Aktivitätsfaktor

## Umsetzung
- Neue Datei `src/lib/calculators/tdee.tsx`
- Bestehende Komponenten `CalculatorShell`, `NumberField`, `SegmentedControl`, `ResultCard`
- Registry-Eintrag `kalorienbedarf-rechner`, Kategorie `sport`, Slug/Keywords/Beispiele/5 FAQ, `relatedSlugs: [bmi-rechner, pace-rechner]`, Quellen (Mifflin-St Jeor Originalstudie, DGE)

## Nicht enthalten
- Keine Körperfett-basierten Formeln (Katch-McArdle) – hält Eingaben minimal
- Kein Zeitplan-Rechner "in X Wochen abnehmen" – separater Rechner möglich
