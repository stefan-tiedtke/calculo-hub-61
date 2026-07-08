# Dark Mode: fehlende Design-Tokens ergänzen

## Ursache
In `src/styles.css` sind im `:root`-Block (Light-Mode) die Tokens
`--surface`, `--surface-muted`, `--brand` und `--brand-foreground`
definiert. Im `.dark`-Block fehlen sie komplett. Dadurch behalten alle
Elemente, die `bg-surface`, `bg-surface-muted`, `bg-brand`, `text-brand`,
`from-surface` usw. verwenden, ihren hellen Wert – u. a.:

- Footer (`bg-surface` → weißer Balken am Seitenende)
- Hero-Verlauf auf der Startseite (`from-surface to-background`)
- Kategorie-Kacheln und Icon-Boxen (`bg-surface-muted`)
- Rechner-Cards, FAQ, Formelbox (`bg-surface`, `open:bg-surface/40`)
- Ergebnis-Karten (`bg-surface-muted`, `bg-brand/10`)

## Fix
Nur `src/styles.css` bearbeiten – im `.dark`-Block passende Dark-Werte
für die vier Tokens ergänzen:

- `--surface`: leicht heller als `--background` (dunkles Slate-Panel)
- `--surface-muted`: eine Stufe darüber für Chips/Icon-Boxen
- `--brand`: hellere, im Dunklen gut lesbare Blau-Variante
- `--brand-foreground`: dunkler Text auf `--brand`

Keine Komponenten- oder Logikänderungen; alle Klassen bleiben wie sie
sind und ziehen automatisch die neuen Werte.

## Verifikation
Nach dem Fix mit Playwright im Dark-Mode Startseite, eine Kategorie-Seite
und einen Rechner (TDEE, Brutto-Netto) screenshotten und prüfen, dass
Footer, Hero, Kacheln und Ergebnis-Karten durchgängig dunkel sind.