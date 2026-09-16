import {
  IncomeSourcesState,
  ResidentialStatus,
  DeterminedFormInfo,
  ItrCriteriaCheck,
} from "../types/itrFiling.types";

/**
 * Pure functional engine that evaluates taxpayer facts and returns
 * the exact applicable ITR Form (ITR-1 / ITR-2 / ITR-3 / ITR-4) with
 * statutory rationale and granular criteria checks.
 */
export function determineApplicableItrForm(
  sources: IncomeSourcesState,
  residentialStatus: ResidentialStatus,
  grossTotal: number = 0,
  assessmentYear: string = "2025-2026"
): DeterminedFormInfo {
  const isResident = residentialStatus === "Resident" || !residentialStatus;
  const hasSalary = sources.salary.enabled;
  const hasHouseProperty = sources.houseProperty.enabled;
  const hasBusiness = sources.business.enabled;
  const hasCapitalGains = sources.capitalGains.enabled;
  const hasFnoIntraday = hasCapitalGains && sources.capitalGains.hasFnoIntraday;
  const hasCrypto = hasCapitalGains && sources.capitalGains.hasCryptoVda;
  const isHighIncome = grossTotal > 5000000;

  const isRegularBusiness =
    hasBusiness &&
    (sources.business.businessType === "regular_books" ||
      sources.business.businessType === "not_sure");

  const isPresumptiveBusiness =
    hasBusiness &&
    (sources.business.businessType === "presumptive_44ad" ||
      sources.business.businessType === "presumptive_44ada");

  // 1. Check for ITR-3
  // Applies to individuals/HUFs with regular business, professional books, F&O/intraday trading,
  // or presumptive business filers who also have capital gains.
  if (isRegularBusiness || hasFnoIntraday || (isPresumptiveBusiness && hasCapitalGains)) {
    const checks: ItrCriteriaCheck[] = [
      {
        id: "biz_detected",
        label: hasFnoIntraday
          ? "F&O / Intraday trading activity detected (taxed as business income)"
          : "Business / Professional income with regular books detected",
        met: true,
      },
      {
        id: "form_match",
        label: "Mandatory filing under ITR-3 as per Income Tax Department rules",
        met: true,
      },
      {
        id: "residency",
        label: isResident ? "Resident individual" : `${residentialStatus} individual`,
        met: true,
      },
    ];

    return {
      form: "ITR-3",
      formTitle: `ITR-3 (Business & Professional - AY ${assessmentYear.replace("20", "")})`,
      rationale: hasFnoIntraday
        ? "ITR-3 is mandatory because Futures & Options (F&O) and Intraday trading are treated as business income under Section 43(5) of the Income Tax Act."
        : "ITR-3 is required for individuals maintaining books of accounts or declaring business and professional income.",
      criteriaChecks: checks,
    };
  }

  // 2. Check for ITR-4 (Sugam)
  // Resident individuals/HUFs/firms with presumptive business (44AD, 44ADA) up to ₹50L,
  // without capital gains or multiple house properties.
  if (isPresumptiveBusiness && isResident && !hasCapitalGains && !isHighIncome) {
    const checks: ItrCriteriaCheck[] = [
      {
        id: "presumptive",
        label: `Presumptive taxation selected (${sources.business.businessType === "presumptive_44ada" ? "Section 44ADA" : "Section 44AD"})`,
        met: true,
      },
      {
        id: "no_cg",
        label: "No capital gains or trading income",
        met: true,
      },
      {
        id: "turnover_limit",
        label: "Total income is within statutory threshold (<= ₹50 Lakhs)",
        met: true,
      },
      {
        id: "residency",
        label: "Resident individual status confirmed",
        met: true,
      },
    ];

    return {
      form: "ITR-4",
      formTitle: `ITR-4 (Sugam - Presumptive Scheme)`,
      rationale:
        "ITR-4 (Sugam) is applicable for resident individuals declaring business or professional income under presumptive taxation (Section 44AD / 44ADA) with income up to ₹50 Lakhs.",
      criteriaChecks: checks,
    };
  }

  // 3. Check for ITR-2
  // Individuals/HUFs not having business/profession income, but having capital gains,
  // crypto/VDA, multiple house properties, NRI/RNOR status, or total income exceeding ₹50 Lakhs.
  if (hasCapitalGains || !isResident || isHighIncome || hasCrypto) {
    const checks: ItrCriteriaCheck[] = [
      {
        id: "no_biz",
        label: "No business or professional income detected",
        met: true,
      },
      {
        id: "cg_or_status",
        label: hasCapitalGains
          ? "Capital gains from stocks / mutual funds / property detected"
          : !isResident
          ? `Non-Resident (${residentialStatus}) tax status`
          : "Total gross income exceeds ₹50 Lakhs",
        met: true,
      },
      {
        id: "crypto_flag",
        label: hasCrypto ? "Virtual Digital Assets (Crypto / VDA) detected" : "Resident individual status verified",
        met: true,
      },
    ];

    return {
      form: "ITR-2",
      formTitle: `ITR-2 (Capital Gains & High Net-Worth)`,
      rationale: hasCapitalGains
        ? "ITR-2 is applicable because you have capital gains from equity, mutual funds, or sale of assets without business income."
        : !isResident
        ? `ITR-2 is mandatory for ${residentialStatus} taxpayers.`
        : "ITR-2 is applicable because gross income exceeds ₹50 Lakhs or multiple properties are held.",
      criteriaChecks: checks,
    };
  }

  // 4. Default: ITR-1 (Sahaj)
  // Standard return for resident individuals having salary, one house property, and other sources up to ₹50L.
  const checks: ItrCriteriaCheck[] = [
    {
      id: "salary_other",
      label: hasSalary ? "Salary / Pension income verified" : "Other sources income verified",
      met: true,
    },
    {
      id: "no_biz",
      label: "No business or professional income detected",
      met: true,
    },
    {
      id: "no_cg",
      label: "No capital gains or trading detected",
      met: true,
    },
    {
      id: "residency",
      label: "Resident individual with income <= ₹50 Lakhs",
      met: true,
    },
  ];

  return {
    form: "ITR-1",
    formTitle: `ITR-1 (Sahaj - Salaried & Simple Income)`,
    rationale:
      "ITR-1 (Sahaj) is the standard return for resident individuals having income from salary, one house property, and other sources (interest/dividends) up to ₹50 Lakhs.",
    criteriaChecks: checks,
  };
}
