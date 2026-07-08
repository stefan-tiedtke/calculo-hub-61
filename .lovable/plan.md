## Ziel
Ein "Was bleibt mir wirklich?"-Rechner in der Kategorie **Finanzen**, der zeigt, wie sich eine **Gehaltserhöhung** tatsächlich aufs Netto auswirkt – der psychologisch wichtige Grenz-Netto-Effekt, den die reine Brutto-Netto-Sicht verschleiert.

## Kernidee
Der Nutzer gibt sein aktuelles Bruttogehalt ein und die geplante Erhöhung. Der Rechner berechnet Netto für **beide Szenarien** (vorher / nachher) mit derselben vereinfachten Lohnsteuer- und Sozialversicherungslogik wie der bestehende Brutto-Netto-Rechner und zeigt die **Differenz** als Hauptergebnis.

## Eingaben
- Aktuelles Bruttogehalt (€, Monat/Jahr umschaltbar)
- Gehaltserhöhung (€, im gleichen Zeitraum) – auch als schneller Slider mit Presets 100 / 250 / 500 / 1.000 €
- Steuerklasse (I–VI)
- Kirchensteuer ja/nein + Bundesland (BY/BW 8 % oder Rest 9 %)
- Kinder (für Pflegeversicherungs-Zuschlag)
- KV-Zusatzbeitrag (%)

## Ausgabe (Ergebnis-Karte)
Hero-Zahl: **"Netto mehr"** (grün, +XXX €)

Aufschlüsselung als 4 Zeilen mit Vorzeichen und Farbcode:
- Brutto mehr &nbsp; **+500 €**
- Steuern &nbsp; **−146 €** (Lohnsteuer + Soli + Kirchensteuer)
- Sozialabgaben &nbsp; **−67 €** (RV + AV + KV + PV)
- **Netto mehr** &nbsp; **+287 €**

Zusätzlich:
- Netto-Quote der Erhöhung ("Von jedem zusätzlichen Euro bleiben dir X ct")
- Kleiner Vergleichsblock: "Vorher: 2.634 € netto → Nachher: 2.921 € netto"
- Hinweis auf mögliche Sprünge bei Überschreiten der Beitragsbemessungsgrenze bzw. Soli-Freigrenze

## Interaktivität
- Preset-Buttons **+100 / +250 / +500 / +1.000 €** neben dem Erhöhungsfeld – ein Klick setzt den Wert
- Segment "Zeitraum" (Monat/Jahr) gilt für beide Beträge
- Ergebnis aktualisiert sich live beim Tippen

## Umsetzung
- Neue Datei `src/lib/calculators/gehaltserhoehung-netto.tsx`
- Berechnungslogik (Lohnsteuertarif 2025, SV-Beiträge, BBG, Soli-Freigrenze, Kirchensteuer) aus `brutto-netto.tsx` in eine reine Helper-Funktion `computeNetto(brutto, opts)` extrahiert und in beiden Rechnern genutzt – **Refactor ohne Verhaltensänderung** für den bestehenden Rechner
  - Neue Datei: `src/lib/calculators/lohnsteuer.ts` (reine Funktionen, kein React)
- Registry-Eintrag `was-bleibt-rechner` mit Slug, Kategorie `finanzen`, Beschreibung, Keywords, Formel, 3 Beispielen, 5 FAQ, `relatedSlugs: [brutto-netto-rechner, stundenlohn-rechner, ueberstundenrechner]`, Quellen (BMF, § 32a EStG)
- Nutzt bestehende Komponenten `CalculatorShell`, `NumberField`, `SegmentedControl`, `ResultCard` – kein neues Design-System-Element

## Nicht enthalten (bewusst)
- Kein Progressionsdiagramm – bleibt einfach und schnell
- Kein Bonus/Einmalzahlungs-Sondermodus – kann später kommen
- Kein Vergleich zweier Personen – klarer Solo-Use-Case
