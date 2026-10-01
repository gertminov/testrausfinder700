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
    name: "One-sample z-test",
    info: "Population mean μ₀ given.\n\n• Population standard deviation known: any sample size\n• Population standard deviation unknown: n > 30\n\nExample: intelligence scores.\n\nQuestion: Does the sample come from a population with the given mean μ₀ and standard deviation?",
    accepts: {
      populationVariance: ["known", "unknown"],
      groupCount: ["one"],
      differenceRegarding: ["mean"],
      measurementScale: ["interval"],
      researchQuestion: ["difference"],
    },
    aka: "Gauss test",
  },
  "one-sample-t-test": {
    name: "One-sample t-test",
    info: "Population mean μ₀ given.\n\nPopulation standard deviation unknown and n < 30 → estimate the standard deviation from the sample.\n\nQuestion: Does the sample come from a population with the given mean μ₀?",
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
    name: "Independent two-sample t-test",
    info: "Compares 2 independent samples.\n\nValues are normally distributed in their populations (matters for small samples).\n\nVariances are equal (homogeneity of variance).\n\nQuestion: Do both samples come from the same population?\n\nSpecial case: testing for a specific mean difference δ ≠ 0 (specific hypothesis)\n• H1: μ₁ − μ₂ ≠ δ\n• H0: μ₁ − μ₂ = δ",
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
    name: "Welch's t-test",
    info: "Compares 2 independent samples with unequal variances.\n\nValues are normally distributed in their populations (matters for small samples).\n\nQuestion: Do both samples come from the same population, i.e. do their means differ?",
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
    aka: "Welch test",
  },
  "paired-t-test": {
    name: "Paired t-test",
    info: "Compares 2 dependent samples (e.g. a before–after comparison).\n\nd̄ is negative when values rise and positive when they fall.\n\nQuestion: Is there a change from measurement 1 to measurement 2?\n\nUsual case: H0: μ_d = 0, so μ_d drops out of the test statistic.",
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
    name: "One-way ANOVA",
    info: "ANOVA = analysis of variance.\n\nCompares more than 2 independent samples.\n\nAssumptions:\n• Values are normally distributed in the populations\n• Homogeneity of variance\nANOVA is robust against violations of both assumptions if the total number of participants is above 30 and the samples are of equal size.\n\nThe F statistic:\n• is small when there are hardly any mean differences (H0)\n• is large when there are large mean differences\n\nExample: a marker of patient recovery under three medications (standard, new, placebo).\n\nEqual vs. unequal sample sizes → the calculations differ, including for contrasts!",
    accepts: {
      factorCount: ["one"],
      groupCount: ["moreThanTwo"],
      differenceRegarding: ["mean"],
      measurementScale: ["interval"],
      researchQuestion: ["difference"],
    },
  },
  "multi-factor-anova": {
    name: "Factorial ANOVA",
    info: "Compares more than 2 independent samples.\n\nAssumptions:\n• Normal distribution\n• Homogeneity of variance\n\n2 polytomous independent variables (factors), e.g.\n• Independent variable 1: medication (standard, new, placebo)\n• Independent variable 2: disease stage (early, advanced)\n→ at least 4 samples of equal size\n\nRight-tailed:\n• H1: the factors interact; at least one mean deviates\n• H0: the factors do not interact; the means within the factors do not deviate",
    accepts: {
      factorCount: ["two"],
      groupCount: ["moreThanTwo"],
      differenceRegarding: ["mean"],
      measurementScale: ["interval"],
      researchQuestion: ["difference"],
    },
  },
  "chi-square-test-variance": {
    name: "Chi-square test for a variance",
    info: "Values are normally distributed in the population.\n\nGiven: a sample of size n with its variance estimate, and the known population variance.\n\nQuestion: Does the sample come from a population with the given variance?\n\nUsually left-tailed: most often the question is whether the variance has decreased.",
    accepts: {
      groupCount: ["one"],
      differenceRegarding: ["variance"],
      measurementScale: ["interval"],
      researchQuestion: ["difference"],
    },
  },
  "f-test": {
    name: "F-test for equality of variances",
    info: "2 independent samples.\n\nValues are normally distributed in the populations.\n\nGiven: the variance estimates of both samples and both sample sizes n₁ and n₂.\n\nTests whether the variances are homogeneous.\n\nQuestion: Is the variance in sample 1 smaller / larger / different than in sample 2?",
    accepts: {
      testFamily: ["parametric"],
      groupCount: ["two"],
      differenceRegarding: ["variance"],
      measurementScale: ["interval"],
      researchQuestion: ["difference"],
    },
  },
  "chi-square-goodness-of-fit-normal-polytomous": {
    name: "Chi-square goodness-of-fit test for normality (polytomous)",
    info: "Question: Are the data normally distributed?\n\nThe calculation differs from the ordinary polytomous chi-square goodness-of-fit test.",
    accepts: {
      differenceRegarding: ["distribution"],
      measurementScale: ["interval"],
      researchQuestion: ["difference"],
    },
  },
  "wilcoxon-signed-rank-normal-approx": {
    name: "Wilcoxon signed-rank test (normal approximation)",
    info: "2 dependent samples.\n\nNo tied ranks.\n\nd̄ is negative when values rise and positive when they fall.\n\nCompute the differences; ignore zero differences and reduce n accordingly.",
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
    name: "Wilcoxon signed-rank test (tie correction)",
    info: "2 dependent samples.\n\nTied ranks present.\n\nT = sum of the ranks of the differences whose sign is the less frequent one (+/−).\n\n• n = number of non-zero differences\n• k = number of tied rank groups\n• tᵢ = number of people sharing rank i",
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
    name: "Wilcoxon signed-rank test (exact)",
    info: "2 dependent samples.\n\nNo tied ranks.\n\nd̄ is negative when values rise and positive when they fall.\n\nCompute the differences; ignore zero differences and reduce n accordingly.\n\nLook up the critical value for T or T′ in the table.",
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
    name: "Sign test",
    info: "2 dependent samples.\n\nd̄ is negative when values rise and positive when they fall.\n\nIgnore zero differences and reduce n accordingly.\n\nThe signs are binomially distributed with base probability 0.5.\n\nCompute the probability p of the observed result.",
    accepts: {
      dataSeriesCount: ["two"],
      groupCount: ["one"],
      sampleDependency: ["dependent"],
      measurementScale: ["ordinal"],
      researchQuestion: ["difference"],
    },
  },
  "sign-test-normal-approx": {
    name: "Sign test (normal approximation)",
    info: "2 dependent samples.\n\nIgnore zero differences and reduce n accordingly.\n\nFor large samples the binomial distribution of the signs is approximated by the normal distribution.",
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
    name: "Mann–Whitney U test (normal approximation)",
    info: "The populations of the samples should:\n• be symmetric\n• have the same shape (the test is robust against violations of this assumption)",
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
    name: "Mann–Whitney U test (tie correction)",
    info: "Tied ranks present.\n\nThe populations of the samples should:\n• be symmetric\n• have the same shape (the test is robust against violations of this assumption)\n\n• n = n₁ + n₂\n• k = number of tied rank groups\n• tᵢ = number of people sharing rank i\nThen compute the test statistic.\n\nSample size ≤ 20.",
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
    name: "Mann–Whitney U test (exact)",
    info: "The populations of the samples should:\n• be symmetric\n• have the same shape (the test is robust against violations of this assumption)\n\nU′ = n₁·n₂ − U\n\nU counts how often people in sample 1 are outranked by people in sample 2.\n\nLook up the critical value in the Bortz table, using U or U′, whichever is smaller!",
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
    name: "Binomial test (normal approximation)",
    info: "• Observed hits = b₁\n• Mean = number × expected probability = n·π\n• Standard deviation = √(n·π·(1−π))\n\nApply a continuity correction if needed.",
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
    name: "Exact binomial test",
    info: "Expected frequency e ≤ 10\n→ e = π·n = probability × number\n\nObserved hits: the smaller count according to H1.\n\nChoose the expected probability to match.\n\nAlso for 2 dependent data series/samples → before–after comparison.",
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
    name: "Chi-square goodness-of-fit test (dichotomous)",
    info: "Expected frequency e > 10\n→ e = π·n = probability × number\n\nObserved frequencies: b₁ and b₂\n\nProbability or relative frequency in the population: π\n\nBoth expected frequencies e₁ and e₂ must be > 10; otherwise use the binomial test.",
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
    name: "Chi-square goodness-of-fit test (polytomous)",
    info: "All expected frequencies e > 5.\n\nObserved frequencies b₁, b₂, b₃, …, b_k with k = number of categories (e.g. blood types).\n\nFit e.g. to a uniform distribution, a normal distribution or another known distribution.\n\nHypotheses (two-sided):\n• H0: the observed frequencies match the expected frequencies\n• H1: the observed frequencies deviate from the expected frequencies\n\nExpected frequencies for the test statistic:\n• Known distribution: as given in the task\n• Uniform distribution: e = n / k, with k = number of categories\n\nQuestion: Does the distribution match the population distribution I expect under H0?\n\nNote: the calculation differs when testing for normality!",
    accepts: {
      categoryCount: ["polytomous"],
      sampleDependency: ["independent"],
      groupCount: ["one"],
      measurementScale: ["nominal"],
      researchQuestion: ["difference"],
    },
  },
  "mcnemars-test": {
    name: "McNemar test",
    info: "2 dependent data series/samples → before–after comparison.\n\nObserved frequencies should all be > 5.\n\nIf b + c ≤ 20, use the exact binomial test:\n• =BINOM.DIST(x, b+c, 0.5, TRUE)\n• x = the smaller of b and c",
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
    name: "McNemar test (continuity correction)",
    info: "2 dependent data series/samples → before–after comparison.\n\nObserved frequencies should all be > 5.\n\nQuestion: Did the distribution across the categories change significantly between the two measurement times?",
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
    name: "Cochran's Q test",
    info: "More than 2 dependent samples (e.g. repeated measurements) with a dichotomous outcome.\n\nHypotheses (two-sided):\n• H1: the proportions change\n• H0: the proportions stay the same",
    accepts: {
      dataSeriesCount: ["moreThanTwo"],
      categoryCount: ["dichotomous"],
      sampleDependency: ["dependent"],
      groupCount: ["one"],
      measurementScale: ["nominal"],
      researchQuestion: ["difference"],
    },
  },
  "2x2-chi-square-goodness-of-fit": {
    name: "2×2 chi-square goodness-of-fit test",
    info: "2 dichotomous characteristics.\n\nNo repeated measures → the data are independent.\n\nAll expected frequencies e > 5.\n\nHypotheses:\n• H1: the distribution in the rows/columns differs from the population\n• H0: the distribution in the rows/columns is the same as in the population\n\nQuestion: Does the distribution match the population distribution I expect under H0?",
    accepts: {
      dataSeriesCount: ["two"],
      marginalProbability: ["known"],
      groupCount: ["two"],
      measurementScale: ["nominal"],
      researchQuestion: ["difference"],
    },
  },
  "2x2-chi-square-independence": {
    name: "2×2 chi-square test of independence",
    info: "2 dichotomous characteristics.\n\nNo repeated measures → the data are independent.\n\nAll expected frequencies e > 5.\n\nHypotheses:\n• H1: the distributions are not equal, i.e. the row and column variables are dependent\n• H0: the distributions are equal, i.e. the row and column variables are independent\n\nQuestions:\n• Is the distribution of one characteristic the same when the sample is split by the second characteristic?\n• Are the two characteristics independently distributed?\n• Example: Does passing the statistics exam depend on gender?",
    accepts: {
      dataSeriesCount: ["two"],
      marginalProbability: ["unknown"],
      groupCount: ["two"],
      measurementScale: ["nominal"],
      researchQuestion: ["difference"],
    },
  },
  "rxc-chi-square-test": {
    name: "r×c chi-square test of independence",
    info: "2 polytomous characteristics, i.e. with more than 2 categories each.\n\nNo repeated measures → the data are independent.\n\nAll expected frequencies e > 5.\n\nHypotheses (two-sided):\n• H1: the distributions are not equal, i.e. the row and column variables are dependent\n• H0: the distributions are equal, i.e. the row and column variables are independent\n\nQuestion: Is the distribution of one characteristic the same when the sample is split by the second characteristic?",
    accepts: {
      groupCount: ["moreThanTwo"],
      measurementScale: ["nominal"],
      researchQuestion: ["difference"],
    },
  },
  "correlation-test-deviation-from-zero": {
    name: "Pearson correlation test (ρ = 0)",
    info: "Dependent and independent variable are interval-scaled.\n\n2 data series, at least interval-scaled.\n\nH0: ρ = 0\n• ρ is the true correlation in the population\n\nCorrelation r and sample size n are given or can be computed.\n• H1: the sample correlation deviates significantly from 0\n• The larger the sample, the smaller the correlations that become significant\n\nEquivalent to the significance test for the slope b of a regression line.",
    accepts: {
      correlationHypothesis: ["zero"],
      groupCount: ["one"],
      measurementScale: ["interval"],
      researchQuestion: ["relationship"],
    },
  },
  "correlation-test-deviation-from-nonzero-value": {
    name: "Pearson correlation test (ρ = ρ₀ ≠ 0)",
    info: "Dependent and independent variable are interval-scaled.\n\n2 data series, at least interval-scaled.\n\nA fixed population correlation ρ₀ ≠ 0 is given.\n• ρ is the true correlation in the population\n\nCorrelation r and sample size n are given or can be computed.\n\nH1: the sample correlation deviates significantly from a given population correlation that is not 0.",
    accepts: {
      correlationHypothesis: ["nonzero"],
      groupCount: ["one"],
      measurementScale: ["interval"],
      researchQuestion: ["relationship"],
    },
  },
  "two-sample-correlation-test": {
    name: "Comparison of two independent correlations",
    info: "Dependent and independent variable are interval-scaled.\n\n2 independent samples, each with 2 data series that are at least interval-scaled.\n\nCorrelations r₁ and r₂ and sample sizes n₁ and n₂ are given or can be computed.\n\nH1: correlation 1 deviates significantly from correlation 2.",
    accepts: {
      groupCount: ["two"],
      measurementScale: ["interval"],
      researchQuestion: ["relationship"],
    },
  },
  "spearman-correlation-test": {
    name: "Spearman rank correlation test",
    info: "Dependent and independent variable are ordinal.\n\n2 data series, at least ordinal, i.e. ranks.\n\nCorrelation r_s and sample size n are given or can be computed.\n\nH1: the correlation deviates significantly from 0.\n\n• Less than 20% tied ranks: =CORREL(array1, array2) on the ranks\n• More than 20% tied ranks: use the formula in Bortz p. 179",
    accepts: {
      measurementScale: ["ordinal"],
      researchQuestion: ["relationship"],
    },
  },
  "phi-coefficient": {
    name: "Phi coefficient",
    info: "Dependent and independent variable are nominal.\n\nCorrelation of 2 dichotomous characteristics.\n\nFirst compute a 2×2 chi-square test of independence → if it is significant, so is the phi coefficient (Φ).",
    accepts: {
      categoryCount: ["dichotomous"],
      measurementScale: ["nominal"],
      researchQuestion: ["relationship"],
    },
  },
  "contingency-coefficient-c": {
    name: "Contingency coefficient C (via r×c chi-square test)",
    info: "Dependent and independent variable are polytomous.\n\nCorrelation of 2 polytomous characteristics.\n\nFirst compute an r×c chi-square test → if it is significant, so is the contingency coefficient.\n\nNot derived from the product-moment correlation:\n• so it is hard to compare with product-moment correlation coefficients\n• C² is not the “proportion of explained variance”\n• Better: Cramér's V",
    accepts: {
      categoryCount: ["polytomous"],
      measurementScale: ["nominal"],
      researchQuestion: ["relationship"],
    },
  },
  "cramers-v": {
    name: "Cramér's V (via r×c chi-square test)",
    info: "Dependent and independent variable are polytomous.\n\nCorrelation of 2 polytomous characteristics.\n\nFirst compute an r×c chi-square test → if it is significant, so is Cramér's V.\n\nR = the smaller of the number of rows and the number of columns.\n\n• Easier to compare with product-moment correlations than the contingency coefficient C\n• Identical to the phi coefficient when r = 2 or c = 2",
    accepts: {
      categoryCount: ["polytomous"],
      measurementScale: ["nominal"],
      researchQuestion: ["relationship"],
    },
  },
  "point-biserial-correlation": {
    name: "Point-biserial correlation test",
    info: "One interval-scaled variable, split by a dichotomous characteristic (e.g. male/female) → 2 independent samples.\n\nCorrelation r_pb and sample size n are given or can be computed.\n\nEquivalent to the t-test for independent samples.\n\nCode the dichotomous variable as 0/1 and use =CORREL.",
    accepts: {
      measurementScale: ["interval"],
      independentVariableScale: ["nominal"],
      researchQuestion: ["relationship"],
    },
  },
  "equivalence-test-independent-samples": {
    name: "Equivalence test for independent samples",
    info: "Equivalence range ±Δ set by an expert.\n\nFrom the standpoint of an ordinary test, you want H0 not to be rejected. The equivalence test reverses the hypotheses:\n• H1: the mean difference is as small as possible (within ±Δ)\n• H0: the mean difference is large (outside ±Δ)\n\nExamples:\n• A generic drug works exactly like the brand-name drug\n• Two therapies are equally good\n\nEither can come up in the exam. An equivalence test is only possible:\n• if an equivalence range is defined\n• and the data are interval-scaled\nOtherwise, any ordinary (non-equivalence) test can serve as a crutch test.",
    accepts: {
      sampleDependency: ["independent"],
      equivalenceEstablished: ["yes"],
      measurementScale: ["interval"],
      researchQuestion: ["equivalence"],
    },
  },
  "equivalence-test-dependent-samples": {
    name: "Equivalence test for dependent samples",
    info: "Dependent samples → repeated measures; participants are tested at 2 points in time.\n\nEquivalence range ±Δ set by an expert.\n\nFrom the standpoint of an ordinary test, you want H0 not to be rejected. The equivalence test reverses the hypotheses:\n• H1: the mean difference is as small as possible (within ±Δ)\n• H0: the mean difference is large (outside ±Δ)\n\nExamples:\n• A generic drug works exactly like the brand-name drug\n• Two therapies are equally good\n\nEither can come up in the exam. An equivalence test is only possible:\n• if an equivalence range is defined\n• and the data are interval-scaled\nOtherwise, any ordinary (non-equivalence) test can serve as a crutch test.",
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
    name: "Crutch test (α = 0.2)",
    info: "Simply raise α of the ordinary null hypothesis test to 20%, with the aim of retaining the null hypothesis.\n\nFor when you want H0 not to be rejected, e.g.\n• a generic drug works exactly like the brand-name drug\n• two therapies are equally good\n\nAlso when the data are ordinal or nominal.",
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
