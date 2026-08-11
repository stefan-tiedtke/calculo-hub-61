import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutzerklärung – Rechnerio" },
      {
        name: "description",
        content:
          "Informationen zur Verarbeitung personenbezogener Daten auf Rechnerio – gemäß DSGVO.",
      },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "Datenschutzerklärung – Rechnerio" },
      {
        property: "og:description",
        content: "Datenschutzerklärung von Rechnerio nach DSGVO.",
      },
    ],
  }),
  component: DatenschutzPage,
});

function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl font-semibold tracking-tight">
        Datenschutzerklärung
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Diese Website wird von Stefan Tiedtke („wir“) betrieben. Nachfolgend
        informieren wir dich über die Verarbeitung personenbezogener Daten bei der
        Nutzung dieser Website.
      </p>

      <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none text-[15px] leading-relaxed">
        <h2>1. Verantwortlicher</h2>
        <p>
          Verantwortlich für die Datenverarbeitung im Sinne von Art. 4 Nr. 7 DSGVO ist:
          <br />
          Stefan Tiedtke
          <br />
          Herbstweg 3
          <br />
          86899 Landsberg am Lech
          <br />
          E-Mail: steve5000@gmx.de
        </p>

        <h2>2. Allgemeines zur Datenverarbeitung</h2>
        <p>
          Wir verarbeiten personenbezogene Daten unserer Nutzerinnen und Nutzer
          grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen
          Website sowie unserer Inhalte und Leistungen erforderlich ist. Die
          Verarbeitung erfolgt regelmäßig nur nach Einwilligung (Art. 6 Abs. 1 lit. a
          DSGVO) oder auf Grundlage eines berechtigten Interesses (Art. 6 Abs. 1 lit. f
          DSGVO).
        </p>

        <h2>3. Bereitstellung der Website und Server-Logfiles</h2>
        <p>
          Bei jedem Aufruf dieser Website erfasst unser Hosting-Anbieter automatisch
          Daten und Informationen, die dein Browser übermittelt. Dies sind
          insbesondere:
        </p>
        <ul>
          <li>IP-Adresse (in der Regel gekürzt / anonymisiert)</li>
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>aufgerufene URL und HTTP-Statuscode</li>
          <li>übertragene Datenmenge</li>
          <li>Referrer-URL (zuvor besuchte Seite)</li>
          <li>verwendeter Browser und Betriebssystem</li>
        </ul>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse
          liegt im sicheren, stabilen und funktionalen Betrieb der Website. Die Daten
          werden nur so lange gespeichert, wie es für diese Zwecke erforderlich ist,
          und danach gelöscht oder anonymisiert.
        </p>

        <h2>4. Hosting</h2>
        <p>
          Diese Website wird über ChatGPT Sites von OpenAI gehostet. OpenAI und
          gegebenenfalls von OpenAI eingesetzte Hosting-Dienstleister verarbeiten in
          unserem Auftrag die für Hosting, Wartung, Sicherheit und Support
          erforderlichen Daten, einschließlich technischer Zugriffsdaten (siehe
          „Server-Logfiles“). Für diese Verarbeitung gelten die ChatGPT-Sites-Bedingungen
          und die für unser Konto anwendbaren Datenschutz- und
          Auftragsverarbeitungsvereinbarungen mit OpenAI.
        </p>

        <h2>5. Nutzung der Rechner</h2>
        <p>
          Die auf dieser Website angebotenen Rechner arbeiten vollständig im Browser.
          Die von dir eingegebenen Werte (z. B. Gehalt, Alter, Sparbetrag) werden nicht
          an unseren Server übertragen und nicht dauerhaft gespeichert. Sie verlassen
          dein Gerät nicht.
        </p>

        <h2>6. Cookies und lokale Speicherung</h2>
        <p>
          Diese Website setzt nur technisch notwendige Cookies bzw. Einträge im lokalen
          Speicher deines Browsers ein, soweit dies für den Betrieb erforderlich ist
          (z. B. zur Speicherung deiner Theme-Auswahl). Rechtsgrundlage ist § 25 Abs. 2
          Nr. 2 TDDDG sowie Art. 6 Abs. 1 lit. f DSGVO.
        </p>
        <h2>7. Kontaktaufnahme</h2>
        <p>
          Wenn du uns per E-Mail kontaktierst, verarbeiten
          wir die von dir mitgeteilten Daten (z. B. Name, E-Mail-Adresse, Nachricht) zur
          Bearbeitung deiner Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO
          (vorvertragliche Maßnahmen) oder lit. f (berechtigtes Interesse an der
          Beantwortung). Die Daten werden gelöscht, sobald sie zur Erreichung des
          Zweckes ihrer Erhebung nicht mehr erforderlich sind.
        </p>

        <h2>8. Empfänger und Auftragsverarbeiter</h2>
        <p>
          Personenbezogene Daten geben wir nur weiter, wenn dies gesetzlich erlaubt ist
          oder du eingewilligt hast. Auftragsverarbeiter (z. B. Hosting-Anbieter)
          erhalten Daten nur im Rahmen des jeweiligen Auftrags und sind vertraglich zur
          Einhaltung des Datenschutzes verpflichtet.
        </p>
        <h2>9. Deine Rechte</h2>
        <p>
          Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16),
          Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18),
          Datenübertragbarkeit (Art. 20) sowie Widerspruch gegen die Verarbeitung
          (Art. 21 DSGVO). Sofern eine Verarbeitung auf deiner Einwilligung beruht,
          kannst du diese jederzeit mit Wirkung für die Zukunft widerrufen.
        </p>
        <p>
          Zusätzlich hast du das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu
          beschweren (Art. 77 DSGVO), z. B. bei der Aufsichtsbehörde deines
          Bundeslandes.
        </p>

        <h2>10. Speicherdauer</h2>
        <p>
          Wir speichern personenbezogene Daten nur so lange, wie dies für die genannten
          Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.
          Danach werden die Daten gelöscht.
        </p>

        <h2>11. Datensicherheit</h2>
        <p>
          Wir setzen technische und organisatorische Maßnahmen ein, um deine Daten vor
          zufälliger oder vorsätzlicher Manipulation, Verlust und unberechtigtem
          Zugriff zu schützen. Die Datenübertragung erfolgt verschlüsselt über HTTPS.
        </p>

        <h2>12. Änderungen dieser Datenschutzerklärung</h2>
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets
          den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen an
          unseren Leistungen umzusetzen. Für deinen erneuten Besuch gilt dann die neue
          Datenschutzerklärung.
        </p>

        <hr />
        <p className="text-sm text-muted-foreground">
          Stand: August 2026. Diese Datenschutzerklärung wurde an den aktuellen
          technischen Betrieb der Website angepasst. Eine individuelle rechtliche
          Prüfung bleibt empfohlen.
        </p>
      </div>
    </div>
  );
}
