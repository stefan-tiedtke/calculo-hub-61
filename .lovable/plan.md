## Ziel
Alle 9 Kategorien in der Desktop-Navigation oben anzeigen (aktuell nur die ersten 6 via `.slice(0, 6)` in `src/components/site-header.tsx`).

## Umsetzung
- `.slice(0, 6)` in `site-header.tsx` entfernen → alle 9 Kategorien werden gemappt
- Damit die Leiste bei 9 Links nicht überläuft:
  - Gap von `gap-6` auf `gap-4` reduzieren
  - Sichtbarkeit erst ab `lg:flex` statt `md:flex` (auf md/Tablet würde es sonst zu eng, da der Container `max-w-6xl` ist und Logo Platz braucht)
- Keine Änderung am Mobile-Verhalten (bleibt versteckt; Kategorien sind wie bisher über die Startseite erreichbar)

## Nicht enthalten
- Kein neues Burger-Menü für Mobile – separater Wunsch, falls nötig
