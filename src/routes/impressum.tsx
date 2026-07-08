import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum – Rechnerio" },
      {
        name: "description",
        content:
          "Impressum von Rechnerio – Anbieterkennzeichnung nach § 5 DDG (früher § 5 TMG).",
      },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "Impressum – Rechnerio" },
      {
        property: "og:description",
        content: "Anbieterkennzeichnung von Rechnerio.",
      },
    ],
  }),
  component: ImpressumPage,
});

function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl font-semibold tracking-tight">Impressum</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG).
      </p>

      <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none text-[15px] leading-relaxed">
        <h2>Anbieter</h2>
        <p>
          [Vor- und Nachname / Firma]
          <br />
          [Straße und Hausnummer]
          <br />
          [PLZ und Ort]
          <br />
          [Land]
        </p>

        <h2>Kontakt</h2>
        <p>
          Telefon: [Telefonnummer]
          <br />
          E-Mail: [E-Mail-Adresse]
          <br />
          Web: [Website-URL]
        </p>

        <h2>Vertretungsberechtigte Person</h2>
        <p>[Vor- und Nachname]</p>

        <h2>Umsatzsteuer-ID</h2>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG:
          <br />
          [USt-IdNr. – z. B. DE123456789 – oder Hinweis: „nicht vorhanden“]
        </p>

        <h2>Handelsregister</h2>
        <p>
          [Registergericht, Registernummer]
          <br />
          (Entfernen, falls nicht anwendbar.)
        </p>

        <h2>
          Redaktionell verantwortlich (§ 18 Abs. 2 MStV)
        </h2>
        <p>
          [Vor- und Nachname]
          <br />
          [Anschrift, wenn abweichend]
        </p>

        <h2>EU-Streitschlichtung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung
          (OS) bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
          .<br />
          Unsere E-Mail-Adresse findest du oben im Impressum.
        </p>

        <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor
          einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <h2>Haftung für Inhalte</h2>
        <p>
          Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für
          die Richtigkeit, Vollständigkeit und Aktualität der Inhalte – insbesondere
          der Rechenergebnisse – kann jedoch keine Gewähr übernommen werden. Alle
          Rechner dienen ausschließlich zu Informationszwecken und ersetzen keine
          fachliche Beratung (z. B. steuerliche, rechtliche oder medizinische
          Beratung).
        </p>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf
          diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10
          DDG sind wir jedoch nicht verpflichtet, übermittelte oder gespeicherte
          fremde Informationen zu überwachen.
        </p>

        <h2>Haftung für Links</h2>
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte
          wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets
          der jeweilige Anbieter oder Betreiber verantwortlich.
        </p>

        <h2>Urheberrecht</h2>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
          unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung,
          Verbreitung und jede Art der Verwertung außerhalb der Grenzen des
          Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors
          bzw. Erstellers.
        </p>

        <hr />
        <p className="text-sm text-muted-foreground">
          Diese Seite ist eine Vorlage und wurde ohne juristische Prüfung erstellt.
          Bitte ersetze die Platzhalter in eckigen Klammern durch deine eigenen Daten
          und lasse den Text ggf. rechtlich prüfen.
        </p>
      </div>
    </div>
  );
}