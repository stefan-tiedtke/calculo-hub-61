import type { CalculatorDef } from "./types";
import BmiCalculator from "./bmi";
import BruttoNettoCalculator from "./brutto-netto";
import ZinseszinsCalculator from "./zinseszins";
import InflationCalculator from "./inflation";
import EntnahmeCalculator from "./entnahme";
import RenteCalculator from "./rente";
import StundenlohnCalculator from "./stundenlohn";
import UeberstundenCalculator from "./ueberstunden";
import KreditCalculator from "./kredit";
import StromkostenCalculator from "./stromkosten";
import KaufMieteCalculator from "./kauf-miete";

/**
 * Central registry for all calculators on the platform.
 *
 * To add a new calculator:
 * 1. Create a component in src/lib/calculators/<slug>.tsx (default export).
 * 2. Add an entry below with slug, name, category, keywords and metadata.
 * 3. That's it — it appears in category pages, search, and sitemap.
 */
export const calculators: CalculatorDef[] = [
  {
    slug: "kaufen-oder-mieten",
    name: "Kauf vs. Miete",
    shortDescription: "Vergleich: Immobilie kaufen oder weiter mieten?",
    description:
      "Vergleiche die langfristigen Kosten von Kauf und Miete – mit Kaufpreis, Kaufnebenkosten, Finanzierung, Instandhaltung, Wertsteigerung, Kaltmiete, Mietsteigerung und der Rendite einer alternativen Geldanlage.",
    category: "immobilien",
    keywords: [
      "kaufen oder mieten",
      "kauf vs miete",
      "mieten vs kaufen",
      "immobilienrechner",
      "vergleichsrechner immobilie",
      "opportunitätskosten",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: KaufMieteCalculator,
    formula: {
      expression:
        "Vermögen_Kauf = Immobilienwert − Restschuld   ·   Vermögen_Miete = EK + Ersparnis, verzinst",
      explanation:
        "Der Rechner simuliert Monat für Monat: Der Käufer zahlt Annuität + Instandhaltung, die Immobilie steigt im Wert und die Restschuld sinkt. Der Mieter zahlt eine mit der Zeit steigende Miete und legt Eigenkapital sowie die monatliche Differenz zur Kaufbelastung mit der angenommenen Rendite an. Verglichen wird das Nettovermögen nach dem gewählten Zeitraum.",
      variables: [
        { symbol: "Kaufpreis", description: "Preis der Immobilie" },
        { symbol: "Nebenkosten", description: "Notar, Makler, Grunderwerbsteuer (8 – 12 %)" },
        { symbol: "Annuität", description: "Zins + Tilgung pro Jahr" },
        { symbol: "Instandhaltung", description: "Rücklage für Reparaturen (~1 %/Jahr)" },
        { symbol: "Wertsteigerung", description: "Erwartete Immobilienpreis-Entwicklung" },
        { symbol: "Rendite", description: "Rendite der alternativen Geldanlage" },
      ],
    },
    examples: [
      {
        title: "Klassisches Szenario",
        inputs: "400.000 € · 80.000 € EK · 3,8 % Zins · 1.400 € Kaltmiete · 15 Jahre",
        result: "Kauf oft leicht im Vorteil bei 2 % Wertsteigerung und 5 % Anlagerendite",
      },
      {
        title: "Hohe Anlagerendite",
        inputs: "gleich, aber 7 % Rendite auf Depot",
        result: "Mieten kann finanziell besser abschneiden",
      },
    ],
    faq: [
      {
        question: "Ist Kaufen immer die bessere Wahl?",
        answer:
          "Nein. Ob Kaufen oder Mieten günstiger ist, hängt von vielen Faktoren ab: Kaufpreis-Miet-Verhältnis, Zinsniveau, Wertsteigerung, Anlagerendite und Zeitraum. In teuren Lagen mit hohen Kaufpreisen ist Mieten häufig günstiger, in günstigen Lagen oft der Kauf.",
      },
      {
        question: "Was sind Opportunitätskosten?",
        answer:
          "Das Eigenkapital, das in die Immobilie fließt, kann nicht anderweitig angelegt werden. Der Rechner berücksichtigt das, indem er für den Mieter das gleiche Eigenkapital plus die monatliche Ersparnis mit einer definierten Rendite anlegt.",
      },
      {
        question: "Warum ist die Wertsteigerung so wichtig?",
        answer:
          "Ein Prozentpunkt mehr oder weniger Wertsteigerung pro Jahr macht über 20 – 30 Jahre einen sehr großen Unterschied. Realistische Annahmen liegen im deutschen Durchschnitt bei etwa 2 – 3 % pro Jahr, in guten Lagen deutlich mehr.",
      },
      {
        question: "Sind Steuern berücksichtigt?",
        answer:
          "Nein. Weder Grundsteuer, Abgeltungssteuer auf Kapitalerträge noch mögliche Vorteile durch selbstgenutztes Wohneigentum werden simuliert. Für einen exakten Vergleich mit deiner Situation solltest du eine steuerliche Beratung hinzuziehen.",
      },
      {
        question: "Warum sind die Nebenkosten der Miete nur zur Info?",
        answer:
          "Umlagefähige Nebenkosten (Heizung, Wasser, Müll) fallen auch beim Eigentümer an. Sie sind für den Vergleich Kauf vs. Miete daher nicht relevant und werden nicht mitgerechnet.",
      },
    ],
    relatedSlugs: ["kreditrechner", "inflationsrechner", "zinseszins-rechner"],
    sources: [
      {
        label: "Deutsche Bundesbank – Wohnimmobilienpreise",
        url: "https://www.bundesbank.de/de/statistiken/geld-und-kapitalmaerkte/wohnimmobilienpreisindikatoren",
      },
    ],
  },
  {
    slug: "stromkostenrechner",
    name: "Stromkostenrechner",
    shortDescription: "Stromkosten pro Jahr, Monat und Gerät berechnen.",
    description:
      "Berechne deine Stromkosten aus Jahresverbrauch, Haushaltsgröße oder Leistung eines einzelnen Geräts – inklusive Arbeitspreis, Grundpreis, monatlicher Kosten und CO₂-Ausstoß.",
    category: "energie",
    keywords: [
      "stromkosten",
      "stromkostenrechner",
      "stromverbrauch",
      "stromrechnung",
      "kwh preis",
      "stromkosten gerät",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: StromkostenCalculator,
    formula: {
      expression: "Kosten = Verbrauch × Arbeitspreis + Grundpreis · 12",
      explanation:
        "Die Jahresstromkosten setzen sich aus dem verbrauchsabhängigen Arbeitspreis (kWh × ct/kWh) und dem festen Grundpreis pro Monat zusammen. Bei Einzelgeräten wird der Verbrauch aus Leistung (Watt) × Nutzungsdauer berechnet: kWh = W × h / 1.000.",
      variables: [
        { symbol: "Verbrauch", description: "Jährlicher Stromverbrauch in kWh" },
        { symbol: "Arbeitspreis", description: "Preis pro Kilowattstunde in ct/kWh" },
        { symbol: "Grundpreis", description: "Feste monatliche Grundgebühr" },
        { symbol: "Watt", description: "Elektrische Leistung eines Geräts" },
      ],
    },
    examples: [
      {
        title: "2-Personen-Haushalt",
        inputs: "2.500 kWh · 35 ct/kWh · 12 €/Monat",
        result: "≈ 1.019 €/Jahr (≈ 84,88 €/Monat)",
      },
      {
        title: "Kühlschrank",
        inputs: "100 W · 24 Std./Tag · 365 Tage · 35 ct/kWh",
        result: "≈ 306,60 €/Jahr",
      },
      {
        title: "Gaming-PC",
        inputs: "400 W · 4 Std./Tag · 300 Tage · 35 ct/kWh",
        result: "≈ 168 €/Jahr",
      },
    ],
    faq: [
      {
        question: "Wie hoch ist der Strompreis aktuell?",
        answer:
          "2025 zahlen Haushalte in Deutschland im Durchschnitt etwa 35 ct/kWh. Der genaue Preis hängt vom Tarif ab – Neukundenangebote liegen oft deutlich darunter, Grundversorgungstarife oft darüber. Den exakten Wert findest du auf deiner Stromrechnung.",
      },
      {
        question: "Wie viel Strom verbraucht ein Haushalt?",
        answer:
          "Grobe Richtwerte pro Jahr: 1 Person ~1.500 kWh, 2 Personen ~2.500 kWh, 3 Personen ~3.500 kWh, 4 Personen ~4.250 kWh. Ein Elektroherd und elektrische Warmwasseraufbereitung erhöhen den Verbrauch deutlich.",
      },
      {
        question: "Was ist der Unterschied zwischen Arbeits- und Grundpreis?",
        answer:
          "Der Arbeitspreis ist der verbrauchsabhängige Preis pro kWh. Der Grundpreis ist eine feste monatliche Gebühr, unabhängig vom Verbrauch. Beide zusammen ergeben die Gesamtkosten.",
      },
      {
        question: "Wie berechne ich den Verbrauch eines Geräts?",
        answer:
          "Verbrauch in kWh = Leistung (Watt) × Nutzungsdauer (Stunden) / 1.000. Beispiel: 2.000-W-Wasserkocher, 5 Minuten am Tag = 2.000 × (5/60) / 1.000 ≈ 0,17 kWh pro Tag.",
      },
      {
        question: "Sind Steuern und Abgaben enthalten?",
        answer:
          "Ja, wenn du den Bruttopreis von deiner Stromrechnung einträgst. Die Preise in Verträgen enthalten üblicherweise Umsatzsteuer, Netzentgelte, Konzessionsabgabe und weitere Umlagen.",
      },
    ],
    relatedSlugs: ["inflationsrechner"],
    sources: [
      {
        label: "Bundesnetzagentur – Strompreise",
        url: "https://www.bundesnetzagentur.de/",
      },
      {
        label: "Umweltbundesamt – CO₂-Emissionen Strommix",
        url: "https://www.umweltbundesamt.de/",
      },
    ],
  },
  {
    slug: "kreditrechner",
    name: "Kreditrechner",
    shortDescription: "Monatsrate, Laufzeit und Zinskosten eines Kredits berechnen.",
    description:
      "Berechne die monatliche Rate eines Annuitätendarlehens aus Kreditbetrag, Sollzins und Laufzeit – oder die Laufzeit aus einer festen Rate. Inklusive Zinskosten, Gesamtrückzahlung und jährlichem Tilgungsplan.",
    category: "finanzen",
    keywords: [
      "kredit",
      "kreditrechner",
      "ratenkredit",
      "annuität",
      "tilgungsplan",
      "monatsrate",
      "darlehensrechner",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: KreditCalculator,
    formula: {
      expression: "Rate = K · i / (1 − (1 + i)^−n)",
      explanation:
        "Beim Annuitätendarlehen bleibt die Monatsrate konstant. i ist der monatliche Zinssatz (Jahreszins / 12), n die Anzahl der Monate. Zu Beginn sind die Zinsen hoch und die Tilgung niedrig – mit sinkender Restschuld dreht sich das Verhältnis.",
      variables: [
        { symbol: "K", description: "Kreditbetrag (Anfangsschuld)" },
        { symbol: "i", description: "Monatlicher Zinssatz (Jahreszins / 12)" },
        { symbol: "n", description: "Anzahl der Monatsraten" },
        { symbol: "Rate", description: "Konstante monatliche Zahlung" },
      ],
    },
    examples: [
      {
        title: "Kleiner Ratenkredit",
        inputs: "10.000 € · 6 % · 4 Jahre",
        result: "≈ 234,85 €/Monat · ≈ 1.273 € Zinsen",
      },
      {
        title: "Autokredit",
        inputs: "25.000 € · 5 % · 6 Jahre",
        result: "≈ 402,62 €/Monat · ≈ 3.989 € Zinsen",
      },
      {
        title: "Feste Rate",
        inputs: "20.000 € · 5 % · 400 €/Monat",
        result: "≈ 4,7 Jahre Laufzeit",
      },
    ],
    faq: [
      {
        question: "Was ist ein Annuitätendarlehen?",
        answer:
          "Ein Kredit mit gleichbleibender Rate. In der Rate stecken Zinsen und Tilgung – ihr Verhältnis verschiebt sich über die Laufzeit: Anfangs zahlst du viel Zinsen, später überwiegt die Tilgung.",
      },
      {
        question: "Ist der Sollzins dasselbe wie der Effektivzins?",
        answer:
          "Nein. Der Sollzins ist der reine Zins auf die Restschuld. Der Effektivzins enthält zusätzlich Gebühren und die Zinsverrechnungsweise. Für einen echten Angebotsvergleich immer den Effektivzins nutzen.",
      },
      {
        question: "Wie senke ich die Zinskosten?",
        answer:
          "Kürzere Laufzeit, höhere Monatsrate oder Sondertilgungen reduzieren die Zinslast deutlich. Auch ein besserer Zinssatz durch Bonität, Vergleich mehrerer Anbieter oder eine zweite kreditnehmende Person hilft.",
      },
      {
        question: "Sind Sondertilgungen berücksichtigt?",
        answer:
          "Nein. Der Rechner geht von einer klassischen Annuität ohne Sondertilgungen aus. Sondertilgungen verkürzen die Laufzeit oder senken die Restschuld zusätzlich – frag deinen Anbieter nach den Konditionen.",
      },
      {
        question: "Warum ist bei fester Rate manchmal keine Berechnung möglich?",
        answer:
          "Wenn die Monatsrate niedriger ist als die im ersten Monat anfallenden Zinsen, wächst die Restschuld statt zu sinken – der Kredit wird nie zurückgezahlt. Erhöhe die Rate oder senke den Zinssatz.",
      },
    ],
    relatedSlugs: ["zinseszins-rechner", "inflationsrechner"],
    sources: [
      {
        label: "BaFin – Verbraucherkredite",
        url: "https://www.bafin.de/",
      },
    ],
  },
  {
    slug: "ueberstundenrechner",
    name: "Überstundenrechner",
    shortDescription: "Vergütung von Überstunden inkl. Zuschlag berechnen.",
    description:
      "Berechne die Bruttovergütung deiner Überstunden – aus Monats- oder Stundenlohn, mit individuellem Zuschlag (25 %, 50 %, 100 %) und Auswertung pro Monat oder Jahr.",
    category: "arbeit",
    keywords: [
      "überstunden",
      "überstundenrechner",
      "überstundenzuschlag",
      "mehrarbeit",
      "überstunden auszahlen",
    ],
    popular: false,
    updatedAt: "2026-07-08",
    component: UeberstundenCalculator,
    formula: {
      expression: "Vergütung = Stundenlohn × (1 + Zuschlag) × Anzahl",
      explanation:
        "Der Grundstundenlohn ergibt sich aus Monatslohn × 12 / (Wochenstunden × 52). Für jede Überstunde wird der Stundenlohn um den Zuschlag erhöht und mit der Anzahl der Überstunden multipliziert.",
      variables: [
        { symbol: "Stundenlohn", description: "Bruttolohn pro vertraglicher Arbeitsstunde" },
        { symbol: "Zuschlag", description: "Prozentualer Aufschlag (z. B. 25 %)" },
        { symbol: "Anzahl", description: "Anzahl der Überstunden im Zeitraum" },
      ],
    },
    examples: [
      {
        title: "10 Überstunden mit 25 %",
        inputs: "3.000 €/Monat · 40 Std./Woche · 10 Überstunden · 25 %",
        result: "≈ 216,35 € brutto",
      },
      {
        title: "Sonntagsarbeit",
        inputs: "20 €/Std. · 8 Überstunden · 50 %",
        result: "= 240 € brutto",
      },
      {
        title: "Jährliche Auswertung",
        inputs: "3.500 €/Monat · 40 Std. · 5 Ü-Std./Monat · 25 %",
        result: "≈ 1.514 € brutto pro Jahr",
      },
    ],
    faq: [
      {
        question: "Muss der Arbeitgeber Überstunden bezahlen?",
        answer:
          "Nur wenn Arbeits- oder Tarifvertrag das vorsehen. Häufig sind Überstunden mit dem Gehalt abgegolten – hier gibt es enge gesetzliche Grenzen. Alternativ ist ein Ausgleich in Freizeit üblich.",
      },
      {
        question: "Wie hoch ist ein üblicher Zuschlag?",
        answer:
          "Typisch sind 25 % an Werktagen, 50 % an Sonntagen und 100 % an gesetzlichen Feiertagen. Verbindlich ist immer die Regelung im Arbeits- oder Tarifvertrag.",
      },
      {
        question: "Wie berechnet sich der Stundenlohn?",
        answer:
          "Aus dem Monatslohn × 12 geteilt durch die vertraglichen Jahresstunden (Wochenstunden × 52). Bei 40 Std./Woche entspricht ein Monatslohn von 3.000 € etwa 17,31 €/Stunde.",
      },
      {
        question: "Sind Steuern berücksichtigt?",
        answer:
          "Nein. Der Rechner zeigt Bruttowerte. Auf ausgezahlte Überstunden fallen die üblichen Lohnsteuer- und Sozialversicherungsabzüge an – Sonntags-, Feiertags- und Nachtzuschläge sind unter bestimmten Grenzen steuerfrei.",
      },
      {
        question: "Was gilt bei Teilzeit?",
        answer:
          "Mehrarbeit von Teilzeitkräften bis zur Vollzeit-Grenze wird meist ohne Zuschlag vergütet. Der Rechner funktioniert für Teilzeit genauso – trage die vertraglichen Wochenstunden ein.",
      },
    ],
    relatedSlugs: ["stundenlohnrechner", "brutto-netto-rechner"],
    sources: [
      {
        label: "Arbeitszeitgesetz (ArbZG)",
        url: "https://www.gesetze-im-internet.de/arbzg/",
      },
    ],
  },
  {
    slug: "stundenlohnrechner",
    name: "Stundenlohnrechner",
    shortDescription: "Stundenlohn aus Monats- oder Jahresgehalt berechnen.",
    description:
      "Berechne deinen Bruttostundenlohn aus Monats- oder Jahresgehalt – oder umgekehrt. Der Rechner berücksichtigt Wochenarbeitszeit, Urlaub, Feiertage und Krankheitstage und zeigt zusätzlich den effektiven Stundenlohn pro tatsächlich gearbeiteter Stunde.",
    category: "arbeit",
    keywords: [
      "stundenlohn",
      "stundenlohnrechner",
      "stundensatz",
      "gehalt umrechnen",
      "stundenlohn berechnen",
      "monatslohn",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: StundenlohnCalculator,
    formula: {
      expression:
        "Stundenlohn = Monatslohn × 12 / (Wochenstunden × 52)",
      explanation:
        "Der vertragliche Stundenlohn ergibt sich aus dem Jahreslohn geteilt durch die vertraglichen Jahresstunden (Wochenstunden × 52). Der effektive Stundenlohn teilt den Jahreslohn stattdessen durch die tatsächlich gearbeiteten Stunden – also ohne Urlaub, Feiertage und Krankheitstage.",
      variables: [
        { symbol: "Monatslohn", description: "Bruttolohn pro Monat" },
        { symbol: "Wochenstunden", description: "Vertragliche Arbeitszeit pro Woche" },
        { symbol: "52", description: "Wochen pro Jahr" },
        { symbol: "Effektivstunden", description: "Jahresstunden abzüglich Urlaub, Feiertage, Krankheit" },
      ],
    },
    examples: [
      {
        title: "Vollzeit 40 Std.",
        inputs: "3.000 €/Monat · 40 Std./Woche",
        result: "≈ 17,31 €/Std. brutto",
      },
      {
        title: "Effektiver Stundenlohn",
        inputs: "42.000 €/Jahr · 40 Std./Woche · 30 Urlaub · 10 Feiertage",
        result: "≈ 20,19 €/Std. vertraglich · ≈ 23,33 €/Std. effektiv",
      },
      {
        title: "Teilzeit",
        inputs: "20 €/Std. · 30 Std./Woche",
        result: "≈ 2.600 €/Monat brutto",
      },
    ],
    faq: [
      {
        question: "Was ist der Unterschied zwischen Stundenlohn und effektivem Stundenlohn?",
        answer:
          "Der vertragliche Stundenlohn teilt dein Gehalt durch alle bezahlten Stunden im Jahr, inklusive Urlaub und Feiertage. Der effektive Stundenlohn zeigt, was du pro tatsächlich gearbeiteter Stunde verdienst – er ist immer höher, weil bezahlte Ausfalltage auf weniger Arbeitsstunden verteilt werden.",
      },
      {
        question: "Wie viele Arbeitsstunden hat ein Monat?",
        answer:
          "Bei 40 Wochenstunden sind es im Durchschnitt rund 173,3 Stunden pro Monat (40 × 52 / 12). In der Lohnabrechnung wird oft mit dieser Zahl gerechnet, unabhängig von der tatsächlichen Länge des Monats.",
      },
      {
        question: "Ist der Wert brutto oder netto?",
        answer:
          "Der Rechner zeigt Bruttowerte vor Lohnsteuer, Solidaritätszuschlag, Kirchensteuer und Sozialversicherung. Für die Netto-Berechnung nutze zusätzlich den Brutto-Netto-Rechner.",
      },
      {
        question: "Wie viele Feiertage sollte ich ansetzen?",
        answer:
          "In Deutschland fallen je nach Bundesland etwa 9 – 13 gesetzliche Feiertage auf Werktage. 10 ist ein üblicher Durchschnittswert. Wer viel am Wochenende arbeitet, kann den Wert anpassen.",
      },
      {
        question: "Sind Überstunden berücksichtigt?",
        answer:
          "Nein. Der Rechner geht von der vertraglichen Arbeitszeit aus. Für einen realistischen Effektivstundenlohn kannst du die tatsächlichen Wochenstunden inkl. Überstunden eintragen.",
      },
    ],
    relatedSlugs: ["brutto-netto-rechner"],
    sources: [
      {
        label: "Bundesministerium für Arbeit und Soziales – Arbeitszeit",
        url: "https://www.bmas.de/",
      },
    ],
  },
  {
    slug: "rentenrechner",
    name: "Rentenrechner",
    shortDescription: "Voraussichtliche gesetzliche Rente und Rentenlücke berechnen.",
    description:
      "Schätze deine voraussichtliche gesetzliche Rente auf Basis deines aktuellen Bruttogehalts, deiner Beitragsjahre und deines geplanten Renteneintritts – inklusive Abschlägen, Rentenanpassung und Kaufkraft in heutigem Geld.",
    category: "finanzen",
    keywords: [
      "rentenrechner",
      "gesetzliche rente",
      "entgeltpunkte",
      "rentenlücke",
      "rente berechnen",
      "altersvorsorge",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: RenteCalculator,
    formula: {
      expression:
        "Monatsrente = Entgeltpunkte × Zugangsfaktor × Rentenwert",
      explanation:
        "Pro Jahr erhältst du Entgeltpunkte im Verhältnis deines Bruttolohns zum Durchschnittsentgelt aller Versicherten (2025: ~50.493 €). Der Zugangsfaktor liegt bei 1,0 bei Regelaltersgrenze (67), sinkt bei früherem Rentenbeginn um 0,3 % pro Monat und steigt bei späterem um 0,5 % pro Monat. Multipliziert mit dem aktuellen Rentenwert (2025: 39,32 €) ergibt sich die monatliche Bruttorente.",
      variables: [
        { symbol: "Entgeltpunkte", description: "Summe aller Beitragsjahre × EP/Jahr" },
        { symbol: "Zugangsfaktor", description: "Ab-/Zuschlag je nach Renteneintrittsalter" },
        { symbol: "Rentenwert", description: "Wert eines Entgeltpunkts, jährlich angepasst" },
      ],
    },
    examples: [
      {
        title: "Durchschnittsverdiener, 40 Jahre",
        inputs: "4.200 €/Monat brutto · 40 Beitragsjahre · Rente mit 67",
        result: "≈ 1.630 € Bruttorente/Monat (in heutiger Kaufkraft)",
      },
      {
        title: "Frührente mit 63",
        inputs: "4.000 €/Monat · 45 Beitragsjahre · Rente mit 63",
        result: "≈ 14,4 % Abschlag auf die Rente",
      },
    ],
    faq: [
      {
        question: "Wie genau ist die Berechnung?",
        answer:
          "Der Rechner ist eine gute Orientierung, ersetzt aber keine offizielle Renteninformation der Deutschen Rentenversicherung. Er nimmt an, dass dein aktuelles Gehalt konstant bleibt (in Relation zum Durchschnittsentgelt) und berücksichtigt keine Kindererziehungszeiten, Zurechnungszeiten bei Erwerbsminderung oder Ost/West-Sonderregeln.",
      },
      {
        question: "Was sind Entgeltpunkte?",
        answer:
          "Ein Entgeltpunkt entspricht einem Jahr, in dem du genau das Durchschnittsentgelt aller Versicherten verdient hast (2025: 50.493 € brutto). Verdienst du mehr, bekommst du mehr Punkte pro Jahr; die Bemessungsgrenze deckelt bei rund 2,1 Punkten pro Jahr.",
      },
      {
        question: "Wie hoch sind die Abschläge bei früherer Rente?",
        answer:
          "Pro Monat, den du vor der Regelaltersgrenze in Rente gehst, wird die Rente um 0,3 % gekürzt – dauerhaft. Zwei Jahre früher bedeuten also 7,2 % weniger, drei Jahre 10,8 %. Bei besonders langjährig Versicherten (45 Jahre) gelten Sonderregeln.",
      },
      {
        question: "Warum wird die Rente in „heutiger Kaufkraft“ angezeigt?",
        answer:
          "Die nominale Rente in 30 Jahren klingt hoch, ist aber weniger wert, weil die Preise gestiegen sind. Der Rechner zeigt zusätzlich, was die Rente in heutigen Euro entspricht – so kannst du sie direkt mit deinen jetzigen Ausgaben vergleichen.",
      },
      {
        question: "Was ist die Rentenlücke?",
        answer:
          "Als Faustregel werden ca. 65 – 80 % des letzten Nettoeinkommens im Ruhestand benötigt. Der Rechner vergleicht deine geschätzte Nettorente mit rund 65 % deines heutigen Bruttos und zeigt die Differenz – ein Anhaltspunkt für zusätzliche private Vorsorge.",
      },
    ],
    relatedSlugs: ["entnahmerechner", "zinseszins-rechner", "inflationsrechner"],
    sources: [
      {
        label: "Deutsche Rentenversicherung – Rechengrößen",
        url: "https://www.deutsche-rentenversicherung.de/",
      },
    ],
  },
  {
    slug: "entnahmerechner",
    name: "Entnahmerechner",
    shortDescription: "FIRE-Zahl, sichere Entnahmerate und monatliche Auszahlung berechnen.",
    description:
      "Berechne dein FIRE-Vermögen nach der 4-%-Regel, die mögliche monatliche Entnahme aus deinem Portfolio und wie lange dein Geld unter Berücksichtigung von Rendite und Inflation reicht.",
    category: "finanzen",
    keywords: [
      "entnahmerechner",
      "fire",
      "4 prozent regel",
      "financial independence",
      "safe withdrawal rate",
      "rente entnahme",
      "kapitalverzehr",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: EntnahmeCalculator,
    formula: {
      expression: "FIRE-Zahl = Jahresausgaben / Entnahmerate   ·   Monatsentnahme = Vermögen × Rate / 12",
      explanation:
        "Nach der 4-%-Regel (Trinity-Studie) gilt eine jährliche Entnahme von 4 % des Startkapitals über 30 Jahre historisch als sicher. Die FIRE-Zahl ist daher rund 25× der jährlichen Ausgaben. Die Reichweite hängt von Rendite und Inflation ab – der Rechner simuliert das Jahr für Jahr mit inflationsangepasster Entnahme.",
      variables: [
        { symbol: "Vermögen", description: "Vorhandenes Anlagekapital" },
        { symbol: "Rate", description: "Entnahmerate pro Jahr (z. B. 4 %)" },
        { symbol: "Jahresausgaben", description: "Benötigte Auszahlung pro Jahr" },
        { symbol: "Rendite", description: "Erwartete jährliche Portfoliorendite" },
        { symbol: "Inflation", description: "Jährliche Steigerung der Entnahme" },
      ],
    },
    examples: [
      {
        title: "Klassisches FIRE",
        inputs: "2.000 €/Monat · 4 % Entnahmerate",
        result: "FIRE-Zahl ≈ 600.000 €",
      },
      {
        title: "500.000 € Portfolio",
        inputs: "500.000 € · 4 % · 6 % Rendite · 2 % Inflation",
        result: "≈ 1.667 €/Monat, nachhaltig über 30+ Jahre",
      },
      {
        title: "Lean FIRE",
        inputs: "1.500 €/Monat · 3,5 % Entnahmerate",
        result: "FIRE-Zahl ≈ 514.000 €",
      },
    ],
    faq: [
      {
        question: "Was ist die 4-%-Regel?",
        answer:
          "Die Trinity-Studie (1998) hat historische US-Marktdaten analysiert und gezeigt: Wer im ersten Jahr 4 % seines Portfolios entnimmt und die Entnahme danach jährlich mit der Inflation erhöht, konnte in der überwiegenden Mehrheit der Fälle 30 Jahre lang leben, ohne das Vermögen aufzubrauchen. Für längere Zeiträume oder mehr Sicherheit werden häufig 3 – 3,5 % empfohlen.",
      },
      {
        question: "Was bedeutet FIRE?",
        answer:
          "FIRE steht für „Financial Independence, Retire Early“. Das Ziel: genug Vermögen aufbauen, damit die Kapitalerträge (bzw. die Entnahme) die Lebenshaltungskosten dauerhaft decken. Die FIRE-Zahl ist das dafür nötige Vermögen – bei 4 % Regel etwa das 25-fache der Jahresausgaben.",
      },
      {
        question: "Warum ist die Inflation so wichtig?",
        answer:
          "Weil deine Ausgaben mit der Zeit steigen. Wer heute 2.000 € braucht, benötigt bei 2 % Inflation in 20 Jahren rund 2.972 €. Der Rechner berücksichtigt das, indem er die Entnahme jedes Jahr an die Inflation anpasst und mit der Rendite verrechnet.",
      },
      {
        question: "Sind Steuern berücksichtigt?",
        answer:
          "Nein. Auf Kapitalerträge fällt in Deutschland Abgeltungssteuer (25 % + Soli + ggf. Kirchensteuer) an. Rechne für eine realistische Netto-Auszahlung mit einer etwas höheren Bruttoentnahme oder ziehe die Steuer von deiner Wunschentnahme wieder hoch.",
      },
      {
        question: "Warum ist die Reichweite manchmal endlich?",
        answer:
          "Wenn die reale Rendite (Rendite − Inflation) niedriger ist als die Entnahmerate, wird das Kapital langsam aufgezehrt. Erhöhe die Rendite-Annahme, senke die Entnahme oder erhöhe das Startkapital, um eine nachhaltige Entnahme zu erreichen.",
      },
    ],
    relatedSlugs: ["zinseszins-rechner", "inflationsrechner"],
    sources: [
      {
        label: "Trinity Study – Sustainable Withdrawal Rates",
        url: "https://en.wikipedia.org/wiki/Trinity_study",
      },
    ],
  },
  {
    slug: "inflationsrechner",
    name: "Inflationsrechner",
    shortDescription: "Was ist mein Geld in einigen Jahren noch wert?",
    description:
      "Berechne, wie viel Kaufkraft ein heutiger Geldbetrag durch Inflation in der Zukunft noch hat – z. B. was 100.000 € in 20 Jahren noch wert sind.",
    category: "finanzen",
    keywords: [
      "inflation",
      "inflationsrechner",
      "kaufkraft",
      "kaufkraftverlust",
      "geldentwertung",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: InflationCalculator,
    formula: {
      expression: "Kaufkraft = Betrag / (1 + i)^n",
      explanation:
        "Die zukünftige Kaufkraft eines heutigen Betrags ergibt sich, indem man ihn durch den Inflationsfaktor (1 + i)^n abzinst. i ist die jährliche Inflationsrate, n die Anzahl der Jahre.",
      variables: [
        { symbol: "Betrag", description: "Heutiger Geldbetrag in Euro" },
        { symbol: "i", description: "Jährliche Inflationsrate (dezimal, z. B. 0,02)" },
        { symbol: "n", description: "Anzahl der Jahre in der Zukunft" },
        { symbol: "Kaufkraft", description: "Wert in heutiger Kaufkraft" },
      ],
    },
    examples: [
      {
        title: "100.000 € in 20 Jahren",
        inputs: "100.000 € · 2,5 % Inflation · 20 Jahre",
        result: "≈ 61.027 € Kaufkraft (~ 39 % Verlust)",
      },
      {
        title: "50.000 € in 10 Jahren",
        inputs: "50.000 € · 3 % Inflation · 10 Jahre",
        result: "≈ 37.204 € Kaufkraft",
      },
    ],
    faq: [
      {
        question: "Welche Inflationsrate sollte ich ansetzen?",
        answer:
          "Die Europäische Zentralbank zielt langfristig auf 2 % pro Jahr. Deutschland lag zwischen 2000 und 2020 im Schnitt bei etwa 1,5 %, in den Jahren 2022–2023 zeitweise über 6 %. Für langfristige Prognosen ist 2 – 3 % ein üblicher Wert.",
      },
      {
        question: "Wie stark entwertet Inflation mein Geld?",
        answer:
          "Bei 2 % Inflation halbiert sich die Kaufkraft eines Betrags in ca. 35 Jahren, bei 3 % in ca. 23 Jahren und bei 5 % bereits in ca. 14 Jahren. Faustformel: 70 / Inflationsrate = Halbierungsdauer in Jahren.",
      },
      {
        question: "Berücksichtigt der Rechner Zinsen oder Rendite?",
        answer:
          "Nein. Er zeigt reine Geldentwertung. Um die reale Rendite einer Anlage zu ermitteln, ziehe die Inflationsrate von deiner Nominalrendite ab – oder nutze zusätzlich den Zinseszins-Rechner.",
      },
      {
        question: "Ist Inflation für alle Menschen gleich hoch?",
        answer:
          "Nein. Der offizielle Verbraucherpreisindex ist ein Durchschnitt. Wer viel Miete, Energie oder Lebensmittel bezahlt, spürt oft eine höhere persönliche Inflation als jemand mit anderer Ausgabenstruktur.",
      },
    ],
    relatedSlugs: ["zinseszins-rechner"],
    sources: [
      {
        label: "Statistisches Bundesamt – Verbraucherpreisindex",
        url: "https://www.destatis.de/DE/Themen/Wirtschaft/Preise/Verbraucherpreisindex/_inhalt.html",
      },
      {
        label: "EZB – Inflationsziel",
        url: "https://www.ecb.europa.eu/mopo/strategy/pricestab/html/index.de.html",
      },
    ],
  },
  {
    slug: "zinseszins-rechner",
    name: "Zinseszins-Rechner",
    shortDescription: "Vermögensaufbau mit Zinseszins und Sparrate berechnen.",
    description:
      "Berechne, wie dein Vermögen durch Zinseszins wächst – mit Startkapital, jährlichem Zinssatz, Anlagedauer und optionaler monatlicher oder jährlicher Sparrate.",
    category: "finanzen",
    keywords: [
      "zinseszins",
      "sparplan",
      "vermögensaufbau",
      "etf sparplan",
      "rendite",
      "zinsen",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: ZinseszinsCalculator,
    formula: {
      expression: "K_n = K_0 · (1 + i)^n + R · ((1 + i)^n − 1) / i",
      explanation:
        "Das Endkapital ergibt sich aus dem verzinsten Startkapital plus dem verzinsten Wert aller regelmäßigen Sparraten. Bei monatlicher Zinsgutschnung wird i durch 12 geteilt und n mit 12 multipliziert.",
      variables: [
        { symbol: "K_0", description: "Startkapital" },
        { symbol: "i", description: "Zinssatz pro Periode (dezimal)" },
        { symbol: "n", description: "Anzahl der Perioden" },
        { symbol: "R", description: "Sparrate pro Periode (nachschüssig)" },
        { symbol: "K_n", description: "Endkapital nach n Perioden" },
      ],
    },
    examples: [
      {
        title: "ETF-Sparplan über 20 Jahre",
        inputs: "0 € Startkapital · 200 €/Monat · 6 % p. a. · 20 Jahre",
        result: "≈ 92.408 € Endkapital (davon ≈ 44.408 € Zinsen)",
        note: "Vor Steuern und Kosten, jährliche Verzinsung.",
      },
      {
        title: "Einmalanlage",
        inputs: "10.000 € · 5 % p. a. · 15 Jahre · keine Sparrate",
        result: "≈ 20.789 € Endkapital",
      },
    ],
    faq: [
      {
        question: "Was ist der Zinseszinseffekt?",
        answer:
          "Beim Zinseszins werden bereits gutgeschriebene Zinsen im nächsten Zeitraum ebenfalls verzinst. Dadurch wächst das Vermögen exponentiell und nicht mehr linear – besonders spürbar bei langen Anlagezeiträumen.",
      },
      {
        question: "Welchen Zinssatz sollte ich ansetzen?",
        answer:
          "Für Tages- oder Festgeld orientierst du dich am aktuellen Marktzins (aktuell meist 2–3 %). Für breit gestreute Aktien-ETFs wird oft mit 5–7 % pro Jahr vor Inflation gerechnet – ohne Garantie, langfristige Durchschnittswerte.",
      },
      {
        question: "Sind Steuern berücksichtigt?",
        answer:
          "Nein. Der Rechner zeigt Bruttowerte vor Abgeltungssteuer, Solidaritätszuschlag und Kirchensteuer. In Deutschland fallen auf Kapitalerträge 25 % Abgeltungssteuer plus Zuschläge an, abzüglich Sparerpauschbetrag.",
      },
      {
        question: "Wie wirkt sich die Zinsgutschnung aus?",
        answer:
          "Eine monatliche statt jährlichen Verzinsung führt zu einem leicht höheren Endkapital, weil Zinsen früher weiterverzinst werden. Der Unterschied ist bei üblichen Zinssätzen jedoch klein.",
      },
    ],
    sources: [
      {
        label: "Bundesbank – Zinsstatistik",
        url: "https://www.bundesbank.de/de/statistiken/geld-und-kapitalmaerkte/zinssaetze-und-renditen",
      },
    ],
  },
  {
    slug: "brutto-netto-rechner",
    name: "Brutto-Netto-Rechner",
    shortDescription: "Nettogehalt aus dem Bruttogehalt berechnen.",
    description:
      "Berechne dein Nettogehalt aus dem Bruttolohn – inklusive Lohnsteuer, Solidaritätszuschlag, Kirchensteuer und Sozialversicherungsbeiträgen (Werte 2025).",
    category: "arbeit",
    keywords: [
      "brutto netto",
      "gehaltsrechner",
      "nettogehalt",
      "lohnsteuer",
      "sozialversicherung",
    ],
    popular: true,
    updatedAt: "2026-07-08",
    component: BruttoNettoCalculator,
    formula: {
      expression:
        "Netto = Brutto − Lohnsteuer − Soli − Kirchensteuer − Sozialversicherung",
      explanation:
        "Vom Bruttolohn werden Lohnsteuer nach Steuerklasse, ggf. Solidaritätszuschlag und Kirchensteuer sowie der Arbeitnehmeranteil zur Sozialversicherung (Kranken-, Pflege-, Renten- und Arbeitslosenversicherung) abgezogen.",
      variables: [
        { symbol: "Brutto", description: "Bruttolohn vor Abzügen" },
        { symbol: "Lohnsteuer", description: "Einkommensteuer je nach Steuerklasse" },
        { symbol: "Soli", description: "5,5 % der Lohnsteuer, oberhalb der Freigrenze" },
        { symbol: "KiSt", description: "8 % (BY, BW) oder 9 % der Lohnsteuer" },
        { symbol: "SV", description: "Kranken-, Pflege-, Renten- und Arbeitslosenversicherung" },
      ],
    },
    examples: [
      {
        title: "Single, Steuerklasse I",
        inputs: "4.000 € brutto/Monat · keine Kirchensteuer · kinderlos",
        result: "≈ 2.560 € netto/Monat",
        note: "Werte gerundet, kassenindividueller Zusatzbeitrag 1,7 %.",
      },
      {
        title: "Verheiratet, Steuerklasse III",
        inputs: "5.500 € brutto/Monat · mit Kindern · 9 % Kirchensteuer",
        result: "≈ 3.900 € netto/Monat",
      },
    ],
    faq: [
      {
        question: "Wie genau ist das Ergebnis?",
        answer:
          "Der Rechner nutzt die offiziellen Rechengrößen 2025 und den Einkommensteuertarif der Grundtabelle. Individuelle Freibeträge (z. B. Kinderfreibetrag, Werbungskosten über Pauschale, geldwerte Vorteile) sind nicht berücksichtigt. Das Ergebnis ist eine gute Orientierung, ersetzt aber keine offizielle Lohnabrechnung.",
      },
      {
        question: "Welche Steuerklasse ist die richtige?",
        answer:
          "Ledige haben Steuerklasse I, Alleinerziehende II. Verheiratete können III/V oder IV/IV wählen, Steuerklasse VI gilt für Nebenjobs. Die Wahl beeinflusst den monatlichen Nettoauszahlungsbetrag, nicht die Jahressteuerlast.",
      },
      {
        question: "Warum wird Solidaritätszuschlag manchmal mit 0 € angezeigt?",
        answer:
          "Seit 2021 gilt eine hohe Freigrenze. Für Alleinstehende fällt Soli erst ab etwa 18.130 € Lohnsteuer pro Jahr an, bei Zusammenveranlagung entsprechend höher.",
      },
      {
        question: "Zählt der Arbeitgeberanteil zur Sozialversicherung mit?",
        answer:
          "Nein. Angezeigt wird nur der Arbeitnehmeranteil, der tatsächlich vom Bruttolohn abgezogen wird. Der Arbeitgeber trägt ungefähr denselben Anteil zusätzlich.",
      },
    ],
    sources: [
      {
        label: "BMF – Rechengrößen der Sozialversicherung 2025",
        url: "https://www.bundesfinanzministerium.de/",
      },
    ],
  },
  {
    slug: "bmi-rechner",
    name: "BMI-Rechner",
    shortDescription: "Body-Mass-Index berechnen und einordnen.",
    description:
      "Berechne deinen Body-Mass-Index (BMI) aus Größe und Gewicht. Mit direkter Einordnung nach WHO-Kategorien.",
    category: "gesundheit",
    keywords: ["bmi", "body mass index", "gewicht", "gesundheit"],
    popular: true,
    updatedAt: "2026-07-08",
    component: BmiCalculator,
    formula: {
      expression: "BMI = Gewicht (kg) / Größe (m)²",
      explanation:
        "Der BMI setzt das Körpergewicht ins Verhältnis zum Quadrat der Körpergröße. Er ist ein grober Richtwert und berücksichtigt weder Muskelmasse noch Körperbau.",
      variables: [
        { symbol: "Gewicht", description: "Körpergewicht in Kilogramm" },
        { symbol: "Größe", description: "Körpergröße in Metern" },
      ],
    },
    examples: [
      {
        title: "Normalgewicht",
        inputs: "175 cm · 70 kg",
        result: "BMI 22,9 – Normalgewicht",
      },
      {
        title: "Übergewicht",
        inputs: "180 cm · 95 kg",
        result: "BMI 29,3 – Übergewicht",
      },
    ],
    faq: [
      {
        question: "Für wen ist der BMI aussagekräftig?",
        answer:
          "Der BMI gilt als Richtwert für Erwachsene zwischen 18 und 65 Jahren. Für Kinder, Schwangere sowie sehr muskulöse Menschen sind andere Werte besser geeignet.",
      },
      {
        question: "Welche BMI-Werte sind normal?",
        answer:
          "Nach WHO-Klassifikation gilt: unter 18,5 Untergewicht, 18,5–24,9 Normalgewicht, 25–29,9 Übergewicht, ab 30 Adipositas.",
      },
      {
        question: "Ist der BMI eine medizinische Diagnose?",
        answer:
          "Nein. Der BMI ersetzt keine ärztliche Untersuchung. Er dient nur als grobe Orientierung.",
      },
    ],
    sources: [
      { label: "WHO – Body Mass Index", url: "https://www.who.int/health-topics/obesity" },
    ],
  },
];

export function getCalculator(slug: string): CalculatorDef | undefined {
  return calculators.find((c) => c.slug === slug);
}

export function getCalculatorsByCategory(categorySlug: string): CalculatorDef[] {
  return calculators.filter((c) => c.category === categorySlug);
}

export function getPopularCalculators(limit = 6): CalculatorDef[] {
  return calculators.filter((c) => c.popular).slice(0, limit);
}