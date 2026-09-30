import { RepaymentScheduleRow } from "../types/projectFinance.types";

export const parseNumericValue = (val?: string): number => {
  if (!val) return 0;
  const cleaned = val.replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
};

export const formatIndianCurrency = (num: number): string => {
  if (isNaN(num) || num <= 0) return "0";
  return Math.round(num).toLocaleString("en-IN");
};

export const calculateSuggestedLoan = (
  totalCostStr?: string,
  ownContributionStr?: string
): string => {
  const totalCost = parseNumericValue(totalCostStr);
  const ownContribution = parseNumericValue(ownContributionStr);
  if (!totalCost && !ownContribution) return "";
  const suggested = Math.max(0, totalCost - ownContribution);
  return suggested > 0 ? formatIndianCurrency(suggested) : "";
};

export const calculateRepaymentSchedule = (
  loanAmountStr?: string,
  interestRateStr?: string,
  tenureYearsStr?: string
): { schedule: RepaymentScheduleRow[]; calculatedEmi: string } => {
  const p = parseNumericValue(loanAmountStr);
  const annualRate = parseNumericValue(interestRateStr);
  const tenureYears = parseInt((tenureYearsStr || "").replace(/[^0-9]/g, ""), 10);

  if (!p || !annualRate || !tenureYears) {
    return {
      schedule: [],
      calculatedEmi: "",
    };
  }

  const r = annualRate / 100 / 12;
  const n = Math.max(1, tenureYears * 12);

  const monthlyEmi =
    r > 0 ? (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : p / n;

  const yearIndices = Array.from({ length: tenureYears }, (_, i) => i + 1);

  const scheduleResult = yearIndices.reduce(
    (acc, year) => {
      const openingBalance = acc.balance;
      const monthIndices = Array.from({ length: 12 }, (_, i) => i);

      const yearCalc = monthIndices.reduce(
        (mAcc) => {
          if (mAcc.balance <= 0) return mAcc;
          const monthInterest = mAcc.balance * r;
          const monthPrincipal = Math.min(monthlyEmi - monthInterest, mAcc.balance);
          return {
            balance: Math.max(0, mAcc.balance - monthPrincipal),
            yearlyInterest: mAcc.yearlyInterest + monthInterest,
            yearlyPrincipal: mAcc.yearlyPrincipal + monthPrincipal,
          };
        },
        { balance: openingBalance, yearlyInterest: 0, yearlyPrincipal: 0 }
      );

      const totalPayment = yearCalc.yearlyPrincipal + yearCalc.yearlyInterest;
      const closingBalance = Math.max(0, yearCalc.balance);

      const row: RepaymentScheduleRow = {
        year: `Year ${year}`,
        openingBalance: formatIndianCurrency(openingBalance),
        principal: formatIndianCurrency(yearCalc.yearlyPrincipal),
        interest: formatIndianCurrency(yearCalc.yearlyInterest),
        totalPayment: formatIndianCurrency(totalPayment),
        closingBalance: formatIndianCurrency(closingBalance),
      };

      return {
        balance: closingBalance,
        rows: [...acc.rows, row],
      };
    },
    { balance: p, rows: [] as RepaymentScheduleRow[] }
  );

  return {
    schedule: scheduleResult.rows,
    calculatedEmi: formatIndianCurrency(Math.round(monthlyEmi)),
  };
};

export const calculateAutoDSCR = (
  operatingCashFlowStr?: string,
  annualDebtServiceStr?: string
): string => {
  const ocf = parseNumericValue(operatingCashFlowStr);
  const ds = parseNumericValue(annualDebtServiceStr);
  if (ocf > 0 && ds > 0) {
    return (ocf / ds).toFixed(2);
  }
  return "";
};
