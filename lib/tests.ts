import type { Accepts } from "./dimensions";

/** One Catalog entry. Its id is the key it is filed under in `catalog`. */
interface Test {
  name: string;
  info: string;
  accepts: Accepts;
  minN?: number;
  maxN?: number;
  aka?: string;
}

/**
 * The Catalog, keyed by test id. Keying by id is what makes a duplicate id a
 * compile error, and what lets `TestId` be derived as a literal union. Ids are
 * the deep-link surface: renaming one breaks every link to that test.
 *
 * `satisfies` rather than a type annotation, so the literal keys survive.
 */
export const catalog = {
  "gauss-test": {
    name: "Gauss-Test",
    info: "Das ist der Gauss Test, er Gausst sehr viel und ist auch sonst echt toll",
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
    info: "",
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
    info: "",
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
    info: "",
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
    info: "",
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
    info: "",
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
    info: "",
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
    info: "",
    accepts: {
      groupCount: ["one"],
      differenceRegarding: ["variance"],
      measurementScale: ["interval"],
      researchQuestion: ["difference"],
    },
  },
  "f-test": {
    name: "F-Test",
    info: "",
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
    info: "",
    accepts: {
      differenceRegarding: ["distribution"],
      measurementScale: ["interval"],
      researchQuestion: ["difference"],
    },
  },
  "wilcoxon-signed-rank-normal-approx": {
    name: "Wilcoxon-Test (NV-Approximation)",
    info: "",
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
    info: "2 Datenreihen",
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
    info: "2 Datenreihen",
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
    info: "2 Datenreihen",
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
    info: "2 Datenreihen",
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
    info: "2 Datenreihen",
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
    info: "2 Datenreihen",
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
    info: "2 Datenreihen",
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
    info: "",
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
    info: "",
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
    info: "",
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
    info: "",
    accepts: {
      categoryCount: ["polytomous"],
      sampleDependency: ["independent"],
      groupCount: ["one"],
      measurementScale: ["nominal"],
      researchQuestion: ["difference"],
    },
  },
  "mcnemars-test": {
    name: "Nc-Nemar-Test",
    info: "2 Datenreihen",
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
    name: "Nc-Nemar-Test (Kontinuitätskorrektur)",
    info: "2 Datenreihen",
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
    info: "2 Datenreihen",
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
    info: "",
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
    info: "",
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
    info: "",
    accepts: {
      groupCount: ["moreThanTwo"],
      measurementScale: ["nominal"],
      researchQuestion: ["difference"],
    },
  },
  "correlation-test-deviation-from-zero": {
    name: "Korrelations-Test Abweichung von 0",
    info: "",
    accepts: {
      correlationHypothesis: ["zero"],
      groupCount: ["one"],
      measurementScale: ["interval"],
      researchQuestion: ["relationship"],
    },
  },
  "correlation-test-deviation-from-nonzero-value": {
    name: "Korrelations-Test Abweichung von Wert ≠ 0",
    info: "",
    accepts: {
      correlationHypothesis: ["nonzero"],
      groupCount: ["one"],
      measurementScale: ["interval"],
      researchQuestion: ["relationship"],
    },
  },
  "two-sample-correlation-test": {
    name: "2-Stichproben-Korrelations-Test",
    info: "",
    accepts: {
      groupCount: ["two"],
      measurementScale: ["interval"],
      researchQuestion: ["relationship"],
    },
  },
  "spearman-correlation-test": {
    name: "Spearman-Korrelations-Test",
    info: "",
    accepts: {
      measurementScale: ["ordinal"],
      researchQuestion: ["relationship"],
    },
  },
  "phi-coefficient": {
    name: "Punkt-4-Felder-Korrelation (Phi-Koeffizient)",
    info: "",
    accepts: {
      categoryCount: ["dichotomous"],
      measurementScale: ["nominal"],
      researchQuestion: ["relationship"],
    },
  },
  "contingency-coefficient-c": {
    name: "Kontingenz-Koeffizient C , über rxc-X²-Test",
    info: "",
    accepts: {
      categoryCount: ["polytomous"],
      measurementScale: ["nominal"],
      researchQuestion: ["relationship"],
    },
  },
  "cramers-v": {
    name: "Cramer's Index CI, über rxc-X²-Test",
    info: "",
    accepts: {
      categoryCount: ["polytomous"],
      measurementScale: ["nominal"],
      researchQuestion: ["relationship"],
    },
  },
  "point-biserial-correlation": {
    name: "Punkt-biserialer Korrelations-Test",
    info: "",
    accepts: {
      measurementScale: ["interval"],
      independentVariableScale: ["nominal"],
      researchQuestion: ["relationship"],
    },
  },
  "equivalence-test-independent-samples": {
    name: "Äquivalenztest für unabh. Stichproben",
    info: "",
    accepts: {
      sampleDependency: ["independent"],
      equivalenceEstablished: ["yes"],
      measurementScale: ["interval"],
      researchQuestion: ["equivalence"],
    },
  },
  "equivalence-test-dependent-samples": {
    name: "Äquivalenztest für abhängige Stichproben",
    info: "",
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
    info: "",
    accepts: {
      equivalenceEstablished: ["no"],
      researchQuestion: ["equivalence"],
    },
  },
} satisfies Record<string, Test>;

/** The id of a test in the Catalog. */
export type TestId = keyof typeof catalog;

/** A Catalog entry together with its id — the form the matching engine takes. */
export interface TestWithId extends Test {
  id: TestId;
}

/** The Catalog as a list, in authoring order, for the matching engine. */
export const tests: TestWithId[] = Object.entries(catalog).map(([id, entry]) => ({
  // `Object.entries` widens keys to `string`; they are exactly `TestId`.
  id: id as TestId,
  ...entry,
}));
