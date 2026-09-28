const measurementScale = {
    interval: "measurementScale:interval",
    ordinal: "measurementScale:ordinal",
    nominal: "measurementScale:nominal",
} as const

const independentVariableScale = {
    interval: "independentVariableScale:interval",
    ordinal: "independentVariableScale:ordinal",
    nominal: "independentVariableScale:nominal",
} as const

const researchQuestion = {
    difference: "researchQuestion:difference",
    relationship: "researchQuestion:relationship",
    equivalence: "researchQuestion:equivalence",
} as const

const populationVariance = {
    known: "populationVariance:known",
    unknown: "populationVariance:unknown",
} as const

const sampleDependency = {
    dependent: "sampleDependency:dependent",
    independent: "sampleDependency:independent",
} as const

const groupCount = {
    one: "groupCount:one",
    two: "groupCount:two",
    moreThanTwo: "groupCount:moreThanTwo",
    oneVsPopulationValue: "groupCount:oneVsPopulationValue",
} as const

const testFamily = {
    parametric: "testFamily:parametric",
    nonparametric: "testFamily:nonparametric",
} as const

const rankTies = {
    present: "rankTies:present",
    absent: "rankTies:absent",
} as const

const varianceHomogeneity = {
    homogeneous: "varianceHomogeneity:homogeneous",
    heterogeneous: "varianceHomogeneity:heterogeneous",
} as const

const differenceRegarding = {
    mean: "differenceRegarding:mean",
    variance: "differenceRegarding:variance",
    distribution: "differenceRegarding:distribution",
} as const

const categoryCount = {
    dichotomous: "categoryCount:dichotomous",
    polytomous: "categoryCount:polytomous",
} as const

const marginalProbability = {
    known: "marginalProbability:known",
    unknown: "marginalProbability:unknown",
} as const

const equivalenceEstablished = {
    yes: "equivalenceEstablished:yes",
    no: "equivalenceEstablished:no",
} as const

const correlationHypothesis = {
    zero: "correlationHypothesis:zero",
    nonzero: "correlationHypothesis:nonzero",
} as const

const factorCount = {
    one: "factorCount:one",
    two: "factorCount:two",
} as const

const dataSeriesCount = {
    two: "dataSeriesCount:two",
} as const

interface Test {
    id: string
    name: string
    info: string
    tags: string[]
    minN?: number
    maxN?: number
    aka?: string
}

export const tests: Test[] = [
    {
        id: "gauss-test",
        name: "Gauss-Test",
        info: "Das ist der Gauss Test, er Gausst sehr viel und ist auch sonst echt toll",
        tags: [populationVariance.known, populationVariance.unknown, groupCount.one, differenceRegarding.mean, measurementScale.interval, researchQuestion.difference],
        aka: "Z-Test",
    },
    {
        id: "one-sample-t-test",
        name: "1-Stichproben t-Test",
        info: "",
        tags: [testFamily.parametric, populationVariance.unknown, groupCount.one, differenceRegarding.mean, measurementScale.interval, researchQuestion.difference],
        maxN: 29,
    },
    {
        id: "two-sample-t-test",
        name: "2-Stichproben t-Test",
        info: "",
        tags: [testFamily.parametric, varianceHomogeneity.homogeneous, sampleDependency.independent, groupCount.two, dataSeriesCount.two, differenceRegarding.mean, measurementScale.interval, researchQuestion.difference],
    },
    {
        id: "welchs-t-test",
        name: "Welch-t-Test",
        info: "",
        tags: [testFamily.parametric, varianceHomogeneity.heterogeneous, sampleDependency.independent, groupCount.two, dataSeriesCount.two, differenceRegarding.mean, measurementScale.interval, researchQuestion.difference],
        aka: "Welchtest",
    },
    {
        id: "paired-t-test",
        name: "t-Test für abhängige Stichproben",
        info: "",
        tags: [testFamily.parametric, sampleDependency.dependent, groupCount.two, dataSeriesCount.two, differenceRegarding.mean, measurementScale.interval, researchQuestion.difference],
    },
    {
        id: "one-way-anova",
        name: "ANOVA einfaktoriell",
        info: "",
        tags: [factorCount.one, groupCount.moreThanTwo, differenceRegarding.mean, measurementScale.interval, researchQuestion.difference],
    },
    {
        id: "multi-factor-anova",
        name: "ANOVA mehrfaktoriell",
        info: "",
        tags: [factorCount.two, groupCount.moreThanTwo, differenceRegarding.mean, measurementScale.interval, researchQuestion.difference],
    },
    {
        id: "chi-square-test-variance",
        name: "Chi^2 Test (X^2 Test)",
        info: "",
        tags: [groupCount.one, differenceRegarding.variance, measurementScale.interval, researchQuestion.difference],
    },
    {
        id: "f-test",
        name: "F-Test",
        info: "",
        tags: [testFamily.parametric, groupCount.two, differenceRegarding.variance, measurementScale.interval, researchQuestion.difference],
    },
    {
        id: "chi-square-goodness-of-fit-normal-polytomous",
        name: "Chi^2 Anpassungstest (polytom) auf Normalverteilung",
        info: "",
        tags: [differenceRegarding.distribution, measurementScale.interval, researchQuestion.difference],
    },
    {
        id: "wilcoxon-signed-rank-normal-approx",
        name: "Wilcoxon-Test (NV-Approximation)",
        info: "",
        tags: [testFamily.nonparametric, dataSeriesCount.two, groupCount.one, sampleDependency.dependent, measurementScale.ordinal, researchQuestion.difference],
        minN: 26,
    },
    {
        id: "wilcoxon-signed-rank-tied-rank-approx",
        name: "Wilcoxon-Test (Rangbindungs-Approximation)",
        info: "2 Datenreihen",
        tags: [testFamily.nonparametric, rankTies.present, dataSeriesCount.two, groupCount.one, sampleDependency.dependent, measurementScale.ordinal, researchQuestion.difference],
        maxN: 25,
    },
    {
        id: "wilcoxon-signed-rank-exact",
        name: "Wilcoxon-Test",
        info: "2 Datenreihen",
        tags: [rankTies.absent, dataSeriesCount.two, groupCount.one, sampleDependency.dependent, measurementScale.ordinal, researchQuestion.difference],
        maxN: 25,
    },
    {
        id: "sign-test",
        name: "Vorzeichentest",
        info: "2 Datenreihen",
        tags: [dataSeriesCount.two, groupCount.one, sampleDependency.dependent, measurementScale.ordinal, researchQuestion.difference],
    },
    {
        id: "sign-test-normal-approx",
        name: "Vorzeichentest (NV-Approximation)",
        info: "2 Datenreihen",
        tags: [dataSeriesCount.two, groupCount.one, sampleDependency.dependent, measurementScale.ordinal, researchQuestion.difference],
        minN: 36,
    },
    {
        id: "mann-whitney-u-normal-approx",
        name: "Mann-Whitney-U-Test (NV-Approximation)",
        info: "2 Datenreihen",
        tags: [testFamily.nonparametric, dataSeriesCount.two, groupCount.two, sampleDependency.independent, measurementScale.ordinal, researchQuestion.difference],
        minN: 21,
    },
    {
        id: "mann-whitney-u-tied-rank-approx",
        name: "Mann-Whitney-U-Test (Rangbindungs- Approximation)",
        info: "2 Datenreihen",
        tags: [testFamily.nonparametric, rankTies.present, dataSeriesCount.two, groupCount.two, sampleDependency.independent, measurementScale.ordinal, researchQuestion.difference],
        maxN: 20,
    },
    {
        id: "mann-whitney-u-exact",
        name: "Mann-Whitney-U-Test",
        info: "2 Datenreihen",
        tags: [testFamily.nonparametric, rankTies.absent, dataSeriesCount.two, groupCount.two, sampleDependency.independent, measurementScale.ordinal, researchQuestion.difference],
        maxN: 20,
    },
    {
        id: "binomial-test-normal-approx",
        name: "Binomialtest mit NV-Approximation",
        info: "",
        tags: ["npTimesPqGreaterThan9", categoryCount.dichotomous, groupCount.one, sampleDependency.independent, measurementScale.nominal, researchQuestion.difference],
    },
    {
        // NOTE: carries both sampleDependency tags — under our matching rules that means
        // this test doesn't care about dependency, not a bug. Kept as-is (see Q18/Q19 discussion).
        id: "binomial-test-exact",
        name: "Binomialtest exakt",
        info: "",
        tags: ["expectedFrequencyAtMost10", categoryCount.dichotomous, groupCount.one, sampleDependency.independent, sampleDependency.dependent, measurementScale.nominal, researchQuestion.difference],
        maxN: 20,
    },
    {
        id: "chi-square-goodness-of-fit-dichotomous",
        name: "X²-Anpassungstest dichotom",
        info: "",
        tags: ["expectedFrequencyAbove10", categoryCount.dichotomous, sampleDependency.independent, groupCount.one, measurementScale.nominal, researchQuestion.difference],
        minN: 10,
    },
    {
        id: "chi-square-goodness-of-fit-polytomous",
        name: "Χ² -Anpassungstest (polytom)",
        info: "",
        tags: [categoryCount.polytomous, sampleDependency.independent, groupCount.one, measurementScale.nominal, researchQuestion.difference],
    },
    {
        id: "mcnemars-test",
        name: "Nc-Nemar-Test",
        info: "2 Datenreihen",
        tags: [dataSeriesCount.two, sampleDependency.dependent, groupCount.one, measurementScale.nominal, researchQuestion.difference],
        minN: 30,
    },
    {
        id: "mcnemars-test-continuity-correction",
        name: "Nc-Nemar-Test (Kontinuitätskorrektur)",
        info: "2 Datenreihen",
        tags: [dataSeriesCount.two, sampleDependency.dependent, groupCount.one, measurementScale.nominal, researchQuestion.difference],
        minN: 20,
        maxN: 30,
    },
    {
        id: "cochrans-q-test",
        name: "Cochran's Q Test",
        info: "2 Datenreihen",
        tags: [dataSeriesCount.two, sampleDependency.dependent, groupCount.one, measurementScale.nominal, researchQuestion.difference],
    },
    {
        id: "2x2-chi-square-goodness-of-fit",
        name: "4-Felder-X²-Anpassungstest",
        info: "",
        tags: [dataSeriesCount.two, marginalProbability.known, groupCount.two, measurementScale.nominal, researchQuestion.difference],
    },
    {
        id: "2x2-chi-square-independence",
        name: "4-Felder-X²-Unabhängigkeitstest",
        info: "",
        tags: [dataSeriesCount.two, marginalProbability.unknown, groupCount.two, measurementScale.nominal, researchQuestion.difference],
    },
    {
        id: "rxc-chi-square-test",
        name: "rxc-X²-Test",
        info: "",
        tags: [groupCount.moreThanTwo, measurementScale.nominal, researchQuestion.difference],
    },
    {
        id: "correlation-test-deviation-from-zero",
        name: "Korrelations-Test Abweichung von 0",
        info: "",
        tags: [correlationHypothesis.zero, groupCount.one, measurementScale.interval, researchQuestion.relationship],
    },
    {
        id: "correlation-test-deviation-from-nonzero-value",
        name: "Korrelations-Test Abweichung von Wert ≠ 0",
        info: "",
        tags: [correlationHypothesis.nonzero, groupCount.one, measurementScale.interval, researchQuestion.relationship],
    },
    {
        id: "two-sample-correlation-test",
        name: "2-Stichproben-Korrelations-Test",
        info: "",
        tags: [groupCount.two, measurementScale.interval, researchQuestion.relationship],
    },
    {
        id: "spearman-correlation-test",
        name: "Spearman-Korrelations-Test",
        info: "",
        tags: [measurementScale.ordinal, researchQuestion.relationship],
    },
    {
        id: "phi-coefficient",
        name: "Punkt-4-Felder-Korrelation (Phi-Koeffizient)",
        info: "",
        tags: [categoryCount.dichotomous, measurementScale.nominal, researchQuestion.relationship],
    },
    {
        id: "contingency-coefficient-c",
        name: "Kontingenz-Koeffizient C , über rxc-X²-Test",
        info: "",
        tags: [categoryCount.polytomous, measurementScale.nominal, researchQuestion.relationship],
    },
    {
        id: "cramers-v",
        name: "Cramer's Index CI, über rxc-X²-Test",
        info: "",
        tags: [categoryCount.polytomous, measurementScale.nominal, researchQuestion.relationship],
    },
    {
        id: "point-biserial-correlation",
        name: "Punkt-biserialer Korrelations-Test",
        info: "",
        tags: [measurementScale.interval, independentVariableScale.nominal, researchQuestion.relationship],
    },
    {
        id: "equivalence-test-independent-samples",
        name: "Äquivalenztest für unabh. Stichproben",
        info: "",
        tags: [sampleDependency.independent, equivalenceEstablished.yes, measurementScale.interval, researchQuestion.equivalence],
    },
    {
        id: "equivalence-test-dependent-samples",
        name: "Äquivalenztest für abhängige Stichproben",
        info: "",
        tags: [sampleDependency.dependent, equivalenceEstablished.yes, measurementScale.interval, researchQuestion.equivalence],
    },
    {
        // NOTE: original tags enumerated all three measurementScale values (interval listed twice,
        // plus nominal and ordinal) — under our rules that's equivalent to having no scale tag at all
        // (a dimension with every value listed excludes nothing), so it's omitted here.
        id: "crutch-test-alpha-02",
        name: "Krückentest mit α = 0,2",
        info: "",
        tags: [equivalenceEstablished.no, researchQuestion.equivalence],
    },
]
