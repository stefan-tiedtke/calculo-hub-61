# Badge "Edit with Lovable" entfernen

Das Popup unten rechts ist das offizielle Lovable-Badge, das auf veröffentlichten Deployments automatisch eingefügt wird. Es lässt sich über eine Projekteinstellung ausblenden — es ist keine Code-Änderung nötig.

## Schritt
1. `publish_settings--set_badge_visibility` mit `hide_badge: true` aufrufen, um das Badge auf allen veröffentlichten Deployments (rechnerio.com etc.) zu verstecken.

## Hinweis
Das Ausblenden des Badges erfordert einen **Pro-Plan oder höher**. Falls der aktuelle Plan darunter liegt, schlägt der Aufruf fehl und ich melde das zurück, damit du ggf. upgraden kannst. Im lokalen Vorschau-Editor bleibt das Badge unabhängig davon sichtbar — die Änderung wirkt nur auf die veröffentlichte Seite.