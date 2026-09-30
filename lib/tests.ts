import type { Accepts } from "./dimensions";

/**
 * The Catalog, keyed by test id. Keying by id is what makes a duplicate id a
 * compile error, and what lets `TestId` be derived as a literal union. Ids are
 * the deep-link surface: renaming one breaks every link to that test.
 *
 * `satisfies` rather than a type annotation, so the literal keys survive.
 */
export const catalog = withIds({
  "gauss-test": {
    name: "Gauss-Test",
    info: "z-Test\n\nMittelwert der GG bekannt\n\nStandardabweichung der GG bekannt: SP-Größe egal\n\nStandardabweichung der GG unbekannt: n > 30 \n\n*z.B. bei Intelligenz\n*Stammt die Stichprobe aus der Grundgesamtheit mit gegebenem mü_0 und SD?",
    accepts: {
      populationVariance: ["known", "unknown"],
      groupCount: ["one"],
      differenceRegarding: ["mean"],
      measurementScale: ["interval"],
      researchQuestion: ["difference"],
    },
    aka: "Z-Test",
  },
  "one-sample-t-test": {
    name: "1-Stichproben t-Test",
    info: "Mittelwert der GG bekannt\n\n nStandardabweichung der GG unbekannt + n < 30\n-->SD-Schätzer Stichprobe berechnen\n\nStammt die Stichprobe aus der Grundgesamtheit mit gegebenem mü_0?",
    accepts: {
      testFamily: ["parametric"],
      populationVariance: ["unknown"],
      groupCount: ["one"],
      differenceRegarding: ["mean"],
      measurementScale: ["interval"],
      researchQuestion: ["difference"],
    },
    maxN: 29,
  },
  "two-sample-t-test": {
    name: "2-Stichproben t-Test",
    info: "Vergleich von 2 unabhängige Stichproben\n\nMesswerte in ihren GGs normalverteilt (bei kleinen Stichproben)\n\nStammen beide Stichproben aus derselben Grundgesamtheit?\n\n\nSonderfall: Test auf Mittelwertunterschied\n*a != 0 (spezifische Hypothese)\n*H1: mü1-mü2 != alpha\n*H0: mü1-mü2 = alpha",
    accepts: {
      testFamily: ["parametric"],
      varianceHomogeneity: ["homogeneous"],
      sampleDependency: ["independent"],
      groupCount: ["two"],
      dataSeriesCount: ["two"],
      differenceRegarding: ["mean"],
      measurementScale: ["interval"],
      researchQuestion: ["difference"],
    },
  },
  "welchs-t-test": {
    name: "Welch-t-Test",
    info: "Messwerte in ihren GGs normalverteilt (bei kleinen Stichproben)\n\nStammen beide Stichproben aus derselben Grundgesamtheit bzw. unterscheiden sie sich?",
    accepts: {
      testFamily: ["parametric"],
      varianceHomogeneity: ["heterogeneous"],
      sampleDependency: ["independent"],
      groupCount: ["two"],
      dataSeriesCount: ["two"],
      differenceRegarding: ["mean"],
      measurementScale: ["interval"],
      researchQuestion: ["difference"],
    },
    aka: "Welchtest",
  },
  "paired-t-test": {
    name: "t-Test für abhängige Stichproben",
    info: "Vergleich von 2 abhängige Stichproben (Vorher-Nacher-Vergleich)\n\nd_quer ist bei steigenden Werten negativ, bei sinkenden Werten positiv\n\nGibt es eine Veränderung von Messung 1 zu Messung 2?\n\n\nNormalfall: H0: mü_d = 0; Mü_d fällt weg",
    accepts: {
      testFamily: ["parametric"],
      sampleDependency: ["dependent"],
      groupCount: ["two"],
      dataSeriesCount: ["two"],
      differenceRegarding: ["mean"],
      measurementScale: ["interval"],
      researchQuestion: ["difference"],
    },
  },
  "one-way-anova": {
    name: "ANOVA einfaktoriell",
    info: "*ANOVA = Analysis of Variance= Varianzanalyse\nVergleich von mehr als 2 unabhängigen Stichproben\n\nVarianzhomogenität\n-->( ANOVA ist robust gegen Verletzung der letzten 2 Annahmen, wenn die Gesamtzahl der VP über 30 ist und die Stichproben gleich groß sind\n\nn-sollte klein werden, wenn es kaum Mittelwertsunterschiede gibt (𝐻0)\n-sollte groß werden, wenn es große\n\n*z.B. Marker für Heilung des Patienten\n*z.B. Medikament: Standard, Neu, Placebo\n\ngleich große Stichproben vs. ungleiche Stichproben\n--> Unterschiede in Berechnung auch von den Kontrasten!",
    accepts: {
      factorCount: ["one"],
      groupCount: ["moreThanTwo"],
      differenceRegarding: ["mean"],
      measurementScale: ["interval"],
      researchQuestion: ["difference"],
    },
  },
  "multi-factor-anova": {
    name: "ANOVA mehrfaktoriell",
    info: "Vergleich von mehr als 2 unabhängigen Stichproben\n\nNormalverteilung\n\nVarianzhomogenität\n\n2 polytome UVs (Faktoren)\n*UV1 (z.B. Medikament: Standard, Neu, Placebo)\n*UV2 (z.B. Stadium Krankheit: beginnend, fortgeschritten)\n--> mindestens 4 gleich große Stichproben\n\nEinseitig rechts\n*𝐻1: Zwischen den Faktoren besteht eine Interaktion; mindestens ein Mittelwert weicht ab\n*𝐻0: Zwischen den Faktoren besteht keine Interaktion; Mittelwerte innerhalb der Faktoren weichen nicht ab",
    accepts: {
      factorCount: ["two"],
      groupCount: ["moreThanTwo"],
      differenceRegarding: ["mean"],
      measurementScale: ["interval"],
      researchQuestion: ["difference"],
    },
  },
  "chi-square-test-variance": {
    name: "Chi^2 Test (X^2 Test)",
    info: "Messwerte in der GG normalverteilt\nStichprobe mit Anzahl n und Varianzschätzer\nVarianz der GG bekannt\n\nStammt die Stichprobe aus der Grundgesamtheit mit der gegeben Streuung?\n\n\nEinseitig links: am häufigsten soll Streuung geringer werden",
    accepts: {
      groupCount: ["one"],
      differenceRegarding: ["variance"],
      measurementScale: ["interval"],
      researchQuestion: ["difference"],
    },
  },
  "f-test": {
    name: "F-Test",
    info: "2 unabhängige Stichproben\n\nMesswerte in den GGs normalverteilt\n\nVarianzhomogenität\n\nVarianzschätzer der beiden Stichproben und beide Anzahlen 𝒏𝟏 und 𝒏𝟐 bekannt\n\nÜberprüfung der Homogenität von Varianzen\n\nIst die Streuung in SP1 geringer/höher/anders als in SP2?",
    accepts: {
      testFamily: ["parametric"],
      groupCount: ["two"],
      differenceRegarding: ["variance"],
      measurementScale: ["interval"],
      researchQuestion: ["difference"],
    },
  },
  "chi-square-goodness-of-fit-normal-polytomous": {
    name: "Chi^2 Anpassungstest (polytom) auf Normalverteilung",
    info: "Besteht Normalverteilung?",
    accepts: {
      differenceRegarding: ["distribution"],
      measurementScale: ["interval"],
      researchQuestion: ["difference"],
    },
  },
  "wilcoxon-signed-rank-normal-approx": {
    name: "Wilcoxon-Test (NV-Approximation)",
    info: "2 abhängige Stichproben\n\nKeine Rangbindungen\n\n\nd_quer ist bei steigenden Werten negativ, bei sinkenden Werten positiv\n\nDifferenzen bilden, 0-Werte ignorieren, ggf. 𝒏 anpassen",
    accepts: {
      testFamily: ["nonparametric"],
      dataSeriesCount: ["two"],
      groupCount: ["one"],
      sampleDependency: ["dependent"],
      measurementScale: ["ordinal"],
      researchQuestion: ["difference"],
    },
    minN: 26,
  },
  "wilcoxon-signed-rank-tied-rank-approx": {
    name: "Wilcoxon-Test (Rangbindungs-Approximation)",
    info: "2 abhängige Stichproben\n\n Rangbindungen\n\n\nT=Summe der Ränge jener Differenzen, deren Vorzeichen das seltenere ist (+/−)\n\n*n = Anzahl der Differenzen, die nicht 0 sind\n*k = Anzahl der Rangbindungen\n*ti = Anzahl Personen auf Rang i",
    accepts: {
      testFamily: ["nonparametric"],
      rankTies: ["present"],
      dataSeriesCount: ["two"],
      groupCount: ["one"],
      sampleDependency: ["dependent"],
      measurementScale: ["ordinal"],
      researchQuestion: ["difference"],
    },
    maxN: 25,
  },
  "wilcoxon-signed-rank-exact": {
    name: "Wilcoxon-Test",
    info: "2 abhängige Stichproben\n\nKeine Rangbindungen\n\n\nd_quer ist bei steigenden Werten negativ, bei sinkenden Werten positiv\n\nDifferenzen bilden, 0-Werte ignorieren, ggf. 𝒏 anpassen\n\n Kritischen Wert für T oder T‘ aus Tabelle ablesen",
    accepts: {
      rankTies: ["absent"],
      dataSeriesCount: ["two"],
      groupCount: ["one"],
      sampleDependency: ["dependent"],
      measurementScale: ["ordinal"],
      researchQuestion: ["difference"],
    },
    maxN: 25,
  },
  "sign-test": {
    name: "Vorzeichentest",
    info: "2 abhängige Stichproben\n\nKeine Rangbindungen\n\n\nd_quer ist bei steigenden Werten negativ, bei sinkenden Werten positiv\n\n0-Werte ignorieren, ggf. 𝒏 anpassen\n\nDie Vorzeichen sind binominalverteilt, Basiswahrscheinlichkeit 0,5\n\nTestwahrscheinlichkeit 𝒑 berechnen",
    accepts: {
      dataSeriesCount: ["two"],
      groupCount: ["one"],
      sampleDependency: ["dependent"],
      measurementScale: ["ordinal"],
      researchQuestion: ["difference"],
    },
  },
  "sign-test-normal-approx": {
    name: "Vorzeichentest (NV-Approximation)",
    info: "2 abhängige Stichproben\n\nKeine Rangbindungen",
    accepts: {
      dataSeriesCount: ["two"],
      groupCount: ["one"],
      sampleDependency: ["dependent"],
      measurementScale: ["ordinal"],
      researchQuestion: ["difference"],
    },
    minN: 36,
  },
  "mann-whitney-u-normal-approx": {
    name: "Mann-Whitney-U-Test (NV-Approximation)",
    info: "GGs der Stichproben sollen:\n*symmetrisch sein\n*dieselbe Form haben (Test ist aber gegen Verletzung dieser Voraussetzung robust)",
    accepts: {
      testFamily: ["nonparametric"],
      dataSeriesCount: ["two"],
      groupCount: ["two"],
      sampleDependency: ["independent"],
      measurementScale: ["ordinal"],
      researchQuestion: ["difference"],
    },
    minN: 21,
  },
  "mann-whitney-u-tied-rank-approx": {
    name: "Mann-Whitney-U-Test (Rangbindungs- Approximation)",
    info: "Rangbindungen\n\nGGs der Stichproben sollen:\n*symmetrisch sein\n*dieselbe Form haben (Test ist aber gegen Verletzung dieser Voraussetzung robust)\n\n\n*𝑛=𝑛1+𝑛2\n*𝑘=Anzahl Rangbindungen\n*𝑡𝑖=Anzahl Personen auf dem Rang 𝑖\n*Prüfgröße berechnen\n\n\nSP-Größe <= 20",
    accepts: {
      testFamily: ["nonparametric"],
      rankTies: ["present"],
      dataSeriesCount: ["two"],
      groupCount: ["two"],
      sampleDependency: ["independent"],
      measurementScale: ["ordinal"],
      researchQuestion: ["difference"],
    },
    maxN: 20,
  },
  "mann-whitney-u-exact": {
    name: "Mann-Whitney-U-Test",
    info: "GGs der Stichproben sollen:\n*symmetrisch sein\n*dieselbe Form haben (Test ist aber gegen Verletzung dieser Voraussetzung robust)\n\n\nU‘=n1*n2-U\n\nU heißt: Wie oft werden Personen in SP1 von Personen in SP2 im Rang übertroffen?\n\nKritischen Wert in Bortz-Tabelle nachschlagen:  U oder U‘, je nachdem was kleiner ist!",
    accepts: {
      testFamily: ["nonparametric"],
      rankTies: ["absent"],
      dataSeriesCount: ["two"],
      groupCount: ["two"],
      sampleDependency: ["independent"],
      measurementScale: ["ordinal"],
      researchQuestion: ["difference"],
    },
    maxN: 20,
  },
  "binomial-test-normal-approx": {
    name: "Binomialtest mit NV-Approximation",
    info: "*beobachtete Treffer =𝑏1\n*Mittelwert = Anzahl ∗erwartete Wsk = 𝑛∗𝜋\n*SD =𝑛∗𝜋∗(1−𝜋)\n\nevtl. Kontinuitätskorrektur",
    accepts: {
      normalApproximationValid: ["yes"],
      categoryCount: ["dichotomous"],
      groupCount: ["one"],
      sampleDependency: ["independent"],
      measurementScale: ["nominal"],
      researchQuestion: ["difference"],
    },
  },
  "binomial-test-exact": {
    name: "Binomialtest exakt",
    info: "erwartete Hkt: e <= 10\n--> e = p*n = Wahrscheinlichkeit∗Anzahl\n\nBeobachtete Treffer: laut 𝐻1 kleinere Anzahl\n\nErwartete Wahrscheinlichkeit entsprechend zugehörig wählen\n\n2 abhängige Datenreihen/Stichproben --> vorher/nachher-Vergleich",
    accepts: {
      expectedCellFrequency: ["atMost10"],
      normalApproximationValid: ["no"],
      categoryCount: ["dichotomous"],
      groupCount: ["one"],
      sampleDependency: ["independent", "dependent"],
      measurementScale: ["nominal"],
      researchQuestion: ["difference"],
    },
    maxN: 20,
  },
  "chi-square-goodness-of-fit-dichotomous": {
    name: "X²-Anpassungstest dichotom",
    info: "erwartete Hkt: e > 10\n--> e = p*n = Wahrscheinlichkeit∗Anzahl\n\nBeobachtete Häufigkeiten: 𝑏1 und 𝑏2\n\nWahrscheinlichkeit bzw. relative Häufigkeit in der GG 𝜋\n\nErwartete Häufigkeiten 𝑒1 und 𝑒2 > 10, ansonsten Binomialtest rechnen",
    accepts: {
      expectedCellFrequency: ["above10"],
      categoryCount: ["dichotomous"],
      sampleDependency: ["independent"],
      groupCount: ["one"],
      measurementScale: ["nominal"],
      researchQuestion: ["difference"],
    },
    minN: 10,
  },
  "chi-square-goodness-of-fit-polytomous": {
    name: "Χ² -Anpassungstest (polytom)",
    info: "Alle erwarteten Häufigkeiten 𝑒>5\n\nBeobachtete Häufigkeiten 𝑏1,𝑏2,𝑏3,…𝑏\n\n𝑘mit 𝑘=Anzahl Kategorien (z.B. Blutgruppen)\n\nAnpassung z.B. an Gleichverteilung, Normalverteilung oder bekannter Verteilung\n\nHypothesen: Zweiseitig\n*𝐻0:beobachtete Häufigkeiten passen zu den erwarteten Häufigkeiten\n*𝐻1:beobachtete Häufigkeiten weichen von den erwarteten Häufigkeiten ab\n\n\nPrüfgröße bei Gleichverteilung und bekannter Verteilung:\n*Bei bekannter Verteilung gemäß Angabe in der Aufgabe\n*Bei Gleichverteilung 𝑒𝑘=𝑛𝑘 mit 𝑘=Anzahl Kategorien\n\nEntspricht die Verteilung einer GG-Verteilung, die ich unter 𝐻0 erwartet?\n\n!Abweichende Berechnung bei Prüfung auf Normalverteilung!",
    accepts: {
      categoryCount: ["polytomous"],
      sampleDependency: ["independent"],
      groupCount: ["one"],
      measurementScale: ["nominal"],
      researchQuestion: ["difference"],
    },
  },
  "mcnemars-test": {
    name: "Mc-Nemar-Test",
    info: "2 abhängige Datenreihen/Stichproben --> vorher/nachher-Vergleich\n\nBeobachtete Häufigkeiten sollten alle > 5 sein\n\n 𝒃+𝒄 ≤ 𝟐𝟎: exakter Binominaltest:\n*=BINOM.VERT(x; b+c; 0,5; 1)\n*x=kleinere Zahl von b und c",
    accepts: {
      dataSeriesCount: ["two"],
      sampleDependency: ["dependent"],
      groupCount: ["one"],
      measurementScale: ["nominal"],
      researchQuestion: ["difference"],
    },
    minN: 30,
  },
  "mcnemars-test-continuity-correction": {
    name: "Mc-Nemar-Test (Kontinuitätskorrektur)",
    info: "2 abhängige Datenreihen/Stichproben --> vorher/nachher-Vergleich\n\nBeobachtete Häufigkeiten sollten alle > 5 sein\n\nHat sich zwischen den Messzeitpunkten die Verteilungen in den Kategorien signifikant verändert?",
    accepts: {
      dataSeriesCount: ["two"],
      sampleDependency: ["dependent"],
      groupCount: ["one"],
      measurementScale: ["nominal"],
      researchQuestion: ["difference"],
    },
    minN: 20,
    maxN: 30,
  },
  "cochrans-q-test": {
    name: "Cochran's Q Test",
    info: "mehr als 2 abhängige Stichproben\n\nHypothesen: Zweiseitig\n*𝐻1: Anteilsverteilung ändert sich\n*𝐻0: Anteilsverteilung bleibt gleich",
    accepts: {
      dataSeriesCount: ["two"],
      sampleDependency: ["dependent"],
      groupCount: ["one"],
      measurementScale: ["nominal"],
      researchQuestion: ["difference"],
    },
  },
  "2x2-chi-square-goodness-of-fit": {
    name: "4-Felder-X²-Anpassungstest",
    info: "2 dichotome Merkmale\n\nkeine Messwiederholung --> Unabhängigkeit der Daten\n\nalle erwarteten Häufigkeiten 𝑒>5\n\nHypothesen\n*𝐻1: Verteilungen nicht gleich bzw. Zeilen− und Spaltenvariable sind abhängig\n*𝐻0: Verteilungen gleich bzw. Zeilen− und Spaltenvariable sind unabhängig\n\nUnabhängigkeitstests= chi-square test for independence\n\n*Sind die Verteilungen auf dem einen Merkmal identisch, wenn man die Stichprobe nach dem zweiten Merkmal unterteilt?\n*Sind die beiden Merkmale unabhängig verteilt?\n*z.B.: Hängt das Bestehen der Statistikklausur vom Geschlecht ab?",
    accepts: {
      dataSeriesCount: ["two"],
      marginalProbability: ["known"],
      groupCount: ["two"],
      measurementScale: ["nominal"],
      researchQuestion: ["difference"],
    },
  },
  "2x2-chi-square-independence": {
    name: "4-Felder-X²-Unabhängigkeitstest",
    info: "2 dichotome Merkmale\n\nkeine Messwiederholung --> Unabhängigkeit der Daten\n\nalle erwarteten Häufigkeiten 𝑒>5\n\nHypothesen\n*𝐻1: Verteilung in Zeilen/ Spalten unterscheidet sich von GG\n*𝐻0: gleiche Verteilung in Zeilen/Spalten wie in GG\n\nAnpassungstests = chi-square test for goodness of fit\n\nEntspricht die Verteilung einer GG-Verteilung, die ich unter 𝐻0 erwarte?",
    accepts: {
      dataSeriesCount: ["two"],
      marginalProbability: ["unknown"],
      groupCount: ["two"],
      measurementScale: ["nominal"],
      researchQuestion: ["difference"],
    },
  },
  "rxc-chi-square-test": {
    name: "rxc-X²-Test",
    info: "2 polytome Merkmale, also mit mehr als 2 Ausprägungen \n\nkeine Messwiederholung --> Unabhängigkeit der Daten\n\nalle erwarteten Häufigkeiten 𝑒>5\n\nHypothesen: Zweiseitig\n*𝐻1: Verteilungen nicht gleich bzw. Zeilen− und Spaltenvariable sind abhängig\n*𝐻0: Verteilungen gleich bzw. Zeilen− und Spaltenvariable sind unabhängig\n\nUnabhängigkeitstests= chi-square test for independence\n\nSind die Verteilungen auf dem einen Merkmal identisch, wenn man die Stichprobe nach dem zweiten Merkmal unterteilt?",
    accepts: {
      groupCount: ["moreThanTwo"],
      measurementScale: ["nominal"],
      researchQuestion: ["difference"],
    },
  },
  "correlation-test-deviation-from-zero": {
    name: "Korrelations-Test Abweichung von 0",
    info: "AV und UV intervallskaliert\n\n2 mindestens intervallskalierte Datenreihen \n\np = 0\n*𝝆 ist die „wahre Korrelation in der Population\n\nKorrelation 𝒓und Anzahl 𝒏 gegeben oder berechenbar\n*𝐻1: „Die SP-Korrelation weicht signifikant von 0 ab“\n*Je größer die Stichprobe, desto kleinere Korrelationen werden signifikant\n\nSignifikanztest für den Steigungsparameter 𝑏 einer Regressionsgeraden ist äquivalent",
    accepts: {
      correlationHypothesis: ["zero"],
      groupCount: ["one"],
      measurementScale: ["interval"],
      researchQuestion: ["relationship"],
    },
  },
  "correlation-test-deviation-from-nonzero-value": {
    name: "Korrelations-Test Abweichung von Wert ≠ 0",
    info: "AV und UV intervallskaliert\n\n2 mindestens intervallskalierte Datenreihen \n\n Feste Korrelation einer Population 𝒑_𝟎 != 𝟎 gegeben\n*𝝆 ist die „wahre Korrelation in der Population\n\nKorrelation 𝒓und Anzahl 𝒏 gegeben oder berechenbar\n\n𝐻1: „Die SP-Korrelation weicht signifikant von einer gegebenen GG-Korrelation ab, die nicht 0 ist“",
    accepts: {
      correlationHypothesis: ["nonzero"],
      groupCount: ["one"],
      measurementScale: ["interval"],
      researchQuestion: ["relationship"],
    },
  },
  "two-sample-correlation-test": {
    name: "2-Stichproben-Korrelations-Test",
    info: "AV und UV intervallskaliert\n\n2 unabhängige Stichproben mit je 2 mindestens intervallskalierte Datenreihen\n\nKorrelationen 𝒓𝟏und 𝒓𝟐; Anzahlen 𝒏𝟏 und 𝒏𝟐 gegeben oder berechenbar\n\n𝐻1: „Korrelation 1 weicht signifikant von Korrelation 2 ab“",
    accepts: {
      groupCount: ["two"],
      measurementScale: ["interval"],
      researchQuestion: ["relationship"],
    },
  },
  "spearman-correlation-test": {
    name: "Spearman-Korrelations-Test",
    info: "AV und UV ordinalskaliert \n\n2 mindestens ordinalskalierte Datenreihen, also Ränge\n\nKorrelation 𝒓_𝒔𝒑 und Anzahl 𝒏 gegeben oder berechenbar\n\n𝐻1: „Korrelation weicht signifikant von 0 ab“\n\n*< 20% Rangbindungen: =KORREL(Matrix1; Matrix2)\n*Mit mehr als 20% Rangbindungen: Formel Bortz S. 179 verwenden",
    accepts: {
      measurementScale: ["ordinal"],
      researchQuestion: ["relationship"],
    },
  },
  "phi-coefficient": {
    name: "Punkt-4-Felder-Korrelation (Phi-Koeffizient)",
    info: "AV und UV nominalskaliert \n\nKorrelation von 2 dichotomen Merkmalen\n\nZunächst: Berechnung eines 4-Felder-𝑿𝟐-Unabhängigkeitstests\n--> Wird dieser signifikant, ist es der 𝛷-Koeffizient auch",
    accepts: {
      categoryCount: ["dichotomous"],
      measurementScale: ["nominal"],
      researchQuestion: ["relationship"],
    },
  },
  "contingency-coefficient-c": {
    name: "Kontingenz-Koeffizient C , über rxc-X²-Test",
    info: "AV und UV polychotom\n\nKorrelation von 2 polytomen Merkmalen\n\nZunächst: Berechnung eines rxc-Tests\n--> Wird dieser signifikant, ist es der Kontingenz-Koeffizient auch\n\nNicht von der Produkt-Moment-Korrelation abgeleitet\n*deshalb nicht gut mit PM-Korrelationskoeffizienten vergleichbar\n*𝐂² ist nicht der „Anteil aufgeklärter Varianz“\n*Deshalb besser: Cramer‘s Index",
    accepts: {
      categoryCount: ["polytomous"],
      measurementScale: ["nominal"],
      researchQuestion: ["relationship"],
    },
  },
  "cramers-v": {
    name: "Cramer's Index CI, über rxc-X²-Test",
    info: "AV und UV polychotom\n\nKorrelation von 2 polytomen Merkmalen\n\nZunächst: Berechnung eines rxc-Tests\n--> Wird dieser signifikant, ist es der Cramer’s Index auch\n\n𝑹: das Minimum der Anzahl von Reihen (rows) und Spalten (columns)\n--> schauen was kleiner ist\n\n*Besser mit Produkt-Moment-Korrelationen vergleichbar als der Kontingenz-Koeffizient 𝐶\n*Bei 𝑟=2 oder 𝑐=2 identisch zum 𝛷-Koeffizienten",
    accepts: {
      categoryCount: ["polytomous"],
      measurementScale: ["nominal"],
      researchQuestion: ["relationship"],
    },
  },
  "point-biserial-correlation": {
    name: "Punkt-biserialer Korrelations-Test",
    info: "2 unabhängige Stichproben\n\n 2 intervallskalierten Datenreihen\n\nUnterteilt nach einem dichotomen Merkmal (z.B. m/w)\n\nKorrelation 𝒓_𝒑𝒃 und Anzahl 𝒏 gegeben oder berechenbar\n\nÄquivalent zum t-Test für unabhängige Stichproben\n\ndichotome Variable mit 0/1 kodieren und =KORREL",
    accepts: {
      measurementScale: ["interval"],
      independentVariableScale: ["nominal"],
      researchQuestion: ["relationship"],
    },
  },
  "equivalence-test-independent-samples": {
    name: "Äquivalenztest für unabh. Stichproben",
    info: "Vom Experten festgelegter Äquivalenzbereich ±𝜟\n\n man möchte, dass die 𝐻0 nicht verworfen wird (aus unserem bisherigen Standpunkt)\n\n*z.B. Generikum wirkt genau wie das Markenmedikament\n*z.B. Therapien sind gleich gut\n\nIn der Klausur kann beides drankommen, nicht immer ist ein Äquivalenztest möglich:\n*nur wenn ein Äquivalenzbereich definiert ist\n*und wenn die Daten Intervallskalenniveau haben\n*Jeder (Nicht-Äquivalenz-) Test kann ein Krückentest sein\n\n*𝐻1 --> möglichst kleine Mittelwertsdifferenz\n*𝐻0 --> große Mittelwertsdifferenz",
    accepts: {
      sampleDependency: ["independent"],
      equivalenceEstablished: ["yes"],
      measurementScale: ["interval"],
      researchQuestion: ["equivalence"],
    },
  },
  "equivalence-test-dependent-samples": {
    name: "Äquivalenztest für abhängige Stichproben",
    info: "abhängige Stichproben --> Messwiederholung, VPs werden zu 2 Zeitpunkten untersucht\n\nVom Experten festgelegter Äquivalenzbereich ±𝜟\n\nman möchte, dass die 𝐻0 nicht verworfen wird (aus unserem bisherigen Standpunkt)\n\n*z.B. Generikum wirkt genau wie das Markenmedikament\n*z.B. Therapien sind gleich gut\n\nIn der Klausur kann beides drankommen, nicht immer ist ein Äquivalenztest möglich:\n*nur wenn ein Äquivalenzbereich definiert ist\n*und wenn die Daten Intervallskalenniveau haben\n*Jeder (Nicht-Äquivalenz-) Test kann ein Krückentest sein",
    accepts: {
      sampleDependency: ["dependent"],
      equivalenceEstablished: ["yes"],
      measurementScale: ["interval"],
      researchQuestion: ["equivalence"],
    },
  },
  // No measurementScale entry: the source listed every scale, which is the
  // same as not caring.
  "crutch-test-alpha-02": {
    name: "Krückentest mit α = 0,2",
    info: "einfach 𝜶 beim Nullhypothesentest auf 20% vergrößern mit dem Ziel die Nullhypothese beizubehalten\n\nman möchte, dass die 𝐻0 nicht verworfen wird (aus unserem bisherigen Standpunkt)\n\n*z.B. Generikum wirkt genau wie das Markenmedikament\n*z.B. Therapien sind gleich gut\n\n\noder:\n\nordinal- oder nominalskaliert",
    accepts: {
      equivalenceEstablished: ["no"],
      researchQuestion: ["equivalence"],
    },
  },
}) satisfies Record<string, Test>;

/** The id of a test in the Catalog. */
export type TestId = keyof typeof catalog;

/** The Catalog as a list, in authoring order, for the matching engine. */
export const allTests: Test[] = Object.values(catalog);

/** One Catalog entry. Its id is the key it is filed under in `catalog`. */
export interface Test {
  name: string;
  info: string;
  id: string;
  order: number;
  accepts: Accepts;
  minN?: number;
  maxN?: number;
  aka?: string;
}

function withIds<T extends Record<string, Omit<Test, "id" | "order">>>(
  entries: T,
): { [K in keyof T]: T[K] & { id: K; order: number } } {
  return Object.fromEntries(
    Object.entries(entries).map(([id, entry], idx) => [
      id,
      { ...entry, id, order: idx },
    ]),
  ) as { [K in keyof T]: T[K] & { id: K; order: number } };
}
