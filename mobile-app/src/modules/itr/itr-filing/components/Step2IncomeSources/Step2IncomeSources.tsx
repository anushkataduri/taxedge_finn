import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import {
  IncomeSourcesState,
  IncomeSalaryData,
  IncomeHousePropertyData,
  IncomeBusinessData,
  IncomeCapitalGainsData,
  IncomeOtherSourcesData,
  DeterminedFormInfo,
  GstReconciliationSummary,
  ItrCategoryType,
} from "../../types/itrFiling.types";
import { GstReconciliationCard } from "../../../components/GstReconciliationCard";
import { styles } from "./Step2IncomeSources.styles";

interface Step2IncomeSourcesProps {
  sources: IncomeSourcesState;
  determinedForm: DeterminedFormInfo;
  gstReconciliation?: GstReconciliationSummary;
  category?: ItrCategoryType | null;
  onSwitchCategory?: (category: ItrCategoryType) => void;
  onUpdateSalary: (data: Partial<IncomeSalaryData>) => void;
  onUpdateHouseProperty: (data: Partial<IncomeHousePropertyData>) => void;
  onUpdateBusiness: (data: Partial<IncomeBusinessData>) => void;
  onUpdateCapitalGains: (data: Partial<IncomeCapitalGainsData>) => void;
  onUpdateOtherSources: (data: Partial<IncomeOtherSourcesData>) => void;
  onContinue: () => void;
}

export const Step2IncomeSources: React.FC<Step2IncomeSourcesProps> = ({
  sources,
  determinedForm,
  gstReconciliation,
  category,
  onSwitchCategory,
  onUpdateSalary,
  onUpdateHouseProperty,
  onUpdateBusiness,
  onUpdateCapitalGains,
  onUpdateOtherSources,
  onContinue,
}) => {
  const isMultiple = !category || category === "multiple";
  const showSalary = isMultiple || category === "salaried";
  const showHouseProperty = isMultiple || category === "rental";
  const showBusiness =
    isMultiple ||
    category === "business" ||
    category === "professional" ||
    category === "freelancer";
  const showCapitalGains =
    isMultiple || category === "trader_investor" || category === "capital_gains";
  const showOtherSources = isMultiple;
  const handleProceed = () => {
    const hasAnyIncome =
      sources.salary.enabled ||
      sources.houseProperty.enabled ||
      sources.business.enabled ||
      sources.capitalGains.enabled ||
      sources.otherSources.enabled;

    if (!hasAnyIncome) {
      Alert.alert("Income Source Required", "Please select at least one income source to proceed.");
      return;
    }
    onContinue();
  };

  return (
    <View style={styles.container}>
      {/* Dynamic ITR Form Determination Banner */}
      <View style={styles.determinationCard}>
        <View style={styles.determinationHeaderRow}>
          <View style={styles.determinationTitleCol}>
            <Ionicons name="sparkles" size={18} color="#1D4ED8" />
            <Text style={styles.determinationTitle}>Applicable Return Form</Text>
          </View>
          <View style={styles.formBadge}>
            <Text style={styles.formBadgeText}>{determinedForm.form}</Text>
          </View>
        </View>

        <Text style={styles.determinationRationale}>{determinedForm.rationale}</Text>

        {/* Dynamic Criteria Checks */}
        {determinedForm.criteriaChecks && determinedForm.criteriaChecks.length > 0 && (
          <View style={styles.determinationCriteriaList}>
            {determinedForm.criteriaChecks.map((check) => (
              <View key={check.id} style={styles.determinationCriteriaRow}>
                <Ionicons name="checkmark-circle" size={13} color="#1D4ED8" />
                <Text style={styles.determinationCriteriaText}>{check.label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>Income Sources & Activity</Text>
      <Text style={styles.sectionSubtitle}>
        TaxEdge imports data from Form 16, AIS, and GST filings. Verify or modify declared income below.
      </Text>

      {/* 1. Salary Income */}
      {showSalary && (
        <View style={[styles.card, sources.salary.enabled && styles.cardActive]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.sourceHeaderRow}
          onPress={() => onUpdateSalary({ enabled: !sources.salary.enabled })}
        >
          <View style={styles.sourceHeaderLeft}>
            <View style={[styles.sourceIconBox, sources.salary.enabled && styles.sourceIconBoxActive]}>
              <Ionicons
                name="briefcase-outline"
                size={20}
                color={sources.salary.enabled ? BrandColors.PRIMARY_ORANGE : "#64748B"}
              />
            </View>
            <View style={styles.sourceTitleCol}>
              <View style={styles.sourceTitleRow}>
                <Text style={styles.sourceTitle}>Salary Income</Text>
                {sources.salary.isVerified && sources.salary.source === "FORM_16" && (
                  <View style={styles.sourceTagVerified}>
                    <Ionicons name="shield-checkmark" size={10} color="#166534" />
                    <Text style={styles.sourceTagVerifiedText}>Form 16 Imported</Text>
                  </View>
                )}
              </View>
              <Text style={styles.sourceSubtitle}>Employer Form 16, payslips, TDS credits</Text>
            </View>
          </View>
          <View style={styles.checkboxBtn}>
            <Ionicons
              name={sources.salary.enabled ? "checkbox" : "square-outline"}
              size={22}
              color={sources.salary.enabled ? BrandColors.PRIMARY_ORANGE : "#94A3B8"}
            />
          </View>
        </TouchableOpacity>

        {sources.salary.enabled && (
          <View style={styles.expandedForm}>
            {/* Form 16 Import Snapshot Card */}
            {sources.salary.isVerified && sources.salary.source === "FORM_16" && Boolean(sources.salary.employerName) && (
              <View style={styles.form16Card}>
                <View style={styles.form16TopRow}>
                  <Text style={styles.form16Title}>Detected from Form 16</Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() =>
                      Alert.alert(
                        "Form 16 Details",
                        `Employer: ${sources.salary.employerName}\nGross Salary: ₹${Number(sources.salary.grossSalary || 0).toLocaleString("en-IN")}\nAllowances u/s 10: ₹${Number(sources.salary.allowances || 0).toLocaleString("en-IN")}\nTDS Deducted: ₹${Number(sources.salary.tdsDeducted || 0).toLocaleString("en-IN")}`
                      )
                    }
                  >
                    <Text style={styles.sourceSubtitle}>View Details</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.form16StatsRow}>
                  <Text style={styles.form16StatLabel}>Employer</Text>
                  <Text style={styles.form16StatValue}>{sources.salary.employerName}</Text>
                </View>
                <View style={styles.form16StatsRow}>
                  <Text style={styles.form16StatLabel}>TDS Deducted (Tax Credit)</Text>
                  <Text style={styles.form16StatValue}>
                    ₹ {Number(sources.salary.tdsDeducted || 0).toLocaleString("en-IN")}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Employer Legal Name</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Infosys Technologies Ltd"
                  placeholderTextColor="#94A3B8"
                  value={sources.salary.employerName}
                  onChangeText={(employerName) => onUpdateSalary({ employerName })}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>Gross Salary (Annual)</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.currencyPrefix}>₹</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    placeholder="e.g. 8,50,000"
                    placeholderTextColor="#94A3B8"
                    value={sources.salary.grossSalary}
                    onChangeText={(val) =>
                      onUpdateSalary({ grossSalary: val.replace(/[^0-9]/g, "") })
                    }
                  />
                </View>
              </View>

              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>Exempt Allowances</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.currencyPrefix}>₹</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    placeholder="HRA, LTA..."
                    placeholderTextColor="#94A3B8"
                    value={sources.salary.allowances}
                    onChangeText={(val) =>
                      onUpdateSalary({ allowances: val.replace(/[^0-9]/g, "") })
                    }
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>TDS Deducted by Employer (Form 26AS)</Text>
              <View style={styles.inputBox}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  placeholder="e.g. 45,000"
                  placeholderTextColor="#94A3B8"
                  value={sources.salary.tdsDeducted}
                  onChangeText={(val) =>
                    onUpdateSalary({ tdsDeducted: val.replace(/[^0-9]/g, "") })
                  }
                />
              </View>
            </View>
          </View>
        )}
      </View>
      )}

      {/* 2. House Property Income */}
      {showHouseProperty && (
        <View style={[styles.card, sources.houseProperty.enabled && styles.cardActive]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.sourceHeaderRow}
          onPress={() => onUpdateHouseProperty({ enabled: !sources.houseProperty.enabled })}
        >
          <View style={styles.sourceHeaderLeft}>
            <View style={[styles.sourceIconBox, sources.houseProperty.enabled && styles.sourceIconBoxActive]}>
              <Ionicons
                name="home-outline"
                size={20}
                color={sources.houseProperty.enabled ? BrandColors.PRIMARY_ORANGE : "#64748B"}
              />
            </View>
            <View style={styles.sourceTitleCol}>
              <Text style={styles.sourceTitle}>House Property</Text>
              <Text style={styles.sourceSubtitle}>Self-occupied home loan or rental income</Text>
            </View>
          </View>
          <View style={styles.checkboxBtn}>
            <Ionicons
              name={sources.houseProperty.enabled ? "checkbox" : "square-outline"}
              size={22}
              color={sources.houseProperty.enabled ? BrandColors.PRIMARY_ORANGE : "#94A3B8"}
            />
          </View>
        </TouchableOpacity>

        {sources.houseProperty.enabled && (
          <View style={styles.expandedForm}>
            <Text style={styles.inputLabel}>Property Classification</Text>
            <View style={styles.pillRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.pill,
                  sources.houseProperty.propertyType === "self_occupied" && styles.pillSelected,
                ]}
                onPress={() => onUpdateHouseProperty({ propertyType: "self_occupied" })}
              >
                <Text
                  style={[
                    styles.pillText,
                    sources.houseProperty.propertyType === "self_occupied" && styles.pillTextSelected,
                  ]}
                >
                  Self-Occupied
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.pill,
                  sources.houseProperty.propertyType === "let_out" && styles.pillSelected,
                ]}
                onPress={() => onUpdateHouseProperty({ propertyType: "let_out" })}
              >
                <Text
                  style={[
                    styles.pillText,
                    sources.houseProperty.propertyType === "let_out" && styles.pillTextSelected,
                  ]}
                >
                  Let-Out (Rented)
                </Text>
              </TouchableOpacity>
            </View>

            {sources.houseProperty.propertyType === "let_out" && (
              <View style={styles.inputRow}>
                <View style={styles.inputGroupHalf}>
                  <Text style={styles.inputLabel}>Annual Rent Received</Text>
                  <View style={styles.inputBox}>
                    <Text style={styles.currencyPrefix}>₹</Text>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="numeric"
                      placeholder="e.g. 2,40,000"
                      placeholderTextColor="#94A3B8"
                      value={sources.houseProperty.annualRentReceived}
                      onChangeText={(val) =>
                        onUpdateHouseProperty({ annualRentReceived: val.replace(/[^0-9]/g, "") })
                      }
                    />
                  </View>
                </View>

                <View style={styles.inputGroupHalf}>
                  <Text style={styles.inputLabel}>Municipal Taxes Paid</Text>
                  <View style={styles.inputBox}>
                    <Text style={styles.currencyPrefix}>₹</Text>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="numeric"
                      placeholder="e.g. 10,000"
                      placeholderTextColor="#94A3B8"
                      value={sources.houseProperty.municipalTaxesPaid}
                      onChangeText={(val) =>
                        onUpdateHouseProperty({ municipalTaxesPaid: val.replace(/[^0-9]/g, "") })
                      }
                    />
                  </View>
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Home Loan Interest Paid (Sec 24b)</Text>
              <View style={styles.inputBox}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  placeholder="Max 2,00,000"
                  placeholderTextColor="#94A3B8"
                  value={sources.houseProperty.homeLoanInterest}
                  onChangeText={(val) =>
                    onUpdateHouseProperty({ homeLoanInterest: val.replace(/[^0-9]/g, "") })
                  }
                />
              </View>
            </View>
          </View>
        )}
      </View>
      )}

      {/* 3. Business / Profession & GST Bridge */}
      {showBusiness && (
        <View style={[styles.card, sources.business.enabled && styles.cardActive]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.sourceHeaderRow}
          onPress={() => onUpdateBusiness({ enabled: !sources.business.enabled })}
        >
          <View style={styles.sourceHeaderLeft}>
            <View style={[styles.sourceIconBox, sources.business.enabled && styles.sourceIconBoxActive]}>
              <Ionicons
                name="storefront-outline"
                size={20}
                color={sources.business.enabled ? BrandColors.PRIMARY_ORANGE : "#64748B"}
              />
            </View>
            <View style={styles.sourceTitleCol}>
              <View style={styles.sourceTitleRow}>
                <Text style={styles.sourceTitle}>Business / Profession</Text>
                <View style={styles.sourceTagImported}>
                  <Ionicons name="document-text" size={10} color="#083B75" />
                  <Text style={styles.sourceTagImportedText}>GST Connected</Text>
                </View>
              </View>
              <Text style={styles.sourceSubtitle}>Presumptive (44AD/ADA) or Regular Books</Text>
            </View>
          </View>
          <View style={styles.checkboxBtn}>
            <Ionicons
              name={sources.business.enabled ? "checkbox" : "square-outline"}
              size={22}
              color={sources.business.enabled ? BrandColors.PRIMARY_ORANGE : "#94A3B8"}
            />
          </View>
        </TouchableOpacity>

        {sources.business.enabled && (
          <View style={styles.expandedForm}>
            {/* Embedded GST Reconciliation Card */}
            {gstReconciliation && (
              <GstReconciliationCard reconciliation={gstReconciliation} />
            )}

            {/* Scheme Selection: 44AD / 44ADA / Regular / I'm Not Sure */}
            <Text style={styles.inputLabel}>How do you report this business?</Text>
            <View style={styles.schemeRadioGroup}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.schemeRadioCard,
                  sources.business.businessType === "presumptive_44ad" && styles.schemeRadioCardSelected,
                ]}
                onPress={() => onUpdateBusiness({ businessType: "presumptive_44ad" })}
              >
                <Ionicons
                  name={sources.business.businessType === "presumptive_44ad" ? "radio-button-on" : "radio-button-off"}
                  size={16}
                  color={sources.business.businessType === "presumptive_44ad" ? BrandColors.PRIMARY_ORANGE : "#64748B"}
                />
                <View style={styles.schemeRadioTextCol}>
                  <Text style={styles.schemeRadioTitle}>Presumptive Taxation (Section 44AD)</Text>
                  <Text style={styles.schemeRadioSub}>Traders, retailers & small businesses (6%/8% deemed profit)</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.schemeRadioCard,
                  sources.business.businessType === "presumptive_44ada" && styles.schemeRadioCardSelected,
                ]}
                onPress={() => onUpdateBusiness({ businessType: "presumptive_44ada" })}
              >
                <Ionicons
                  name={sources.business.businessType === "presumptive_44ada" ? "radio-button-on" : "radio-button-off"}
                  size={16}
                  color={sources.business.businessType === "presumptive_44ada" ? BrandColors.PRIMARY_ORANGE : "#64748B"}
                />
                <View style={styles.schemeRadioTextCol}>
                  <Text style={styles.schemeRadioTitle}>Presumptive Profession (Section 44ADA)</Text>
                  <Text style={styles.schemeRadioSub}>Doctors, lawyers, engineers, IT consultants (50% deemed profit)</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.schemeRadioCard,
                  sources.business.businessType === "regular_books" && styles.schemeRadioCardSelected,
                ]}
                onPress={() => onUpdateBusiness({ businessType: "regular_books" })}
              >
                <Ionicons
                  name={sources.business.businessType === "regular_books" ? "radio-button-on" : "radio-button-off"}
                  size={16}
                  color={sources.business.businessType === "regular_books" ? BrandColors.PRIMARY_ORANGE : "#64748B"}
                />
                <View style={styles.schemeRadioTextCol}>
                  <Text style={styles.schemeRadioTitle}>Regular Books of Accounts (ITR-3)</Text>
                  <Text style={styles.schemeRadioSub}>P&L, Balance Sheet, and statutory business audit</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.schemeRadioCard,
                  sources.business.businessType === "not_sure" && styles.schemeRadioCardSelected,
                ]}
                onPress={() => onUpdateBusiness({ businessType: "not_sure" })}
              >
                <Ionicons
                  name={sources.business.businessType === "not_sure" ? "radio-button-on" : "radio-button-off"}
                  size={16}
                  color={sources.business.businessType === "not_sure" ? BrandColors.PRIMARY_ORANGE : "#64748B"}
                />
                <View style={styles.schemeRadioTextCol}>
                  <Text style={styles.schemeRadioTitle}>I'm Not Sure</Text>
                  <Text style={styles.schemeRadioSub}>TaxEdge will flag this for your assigned CA to determine</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>Business Turnover</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.currencyPrefix}>₹</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    placeholder="e.g. 24,60,000"
                    placeholderTextColor="#94A3B8"
                    value={sources.business.grossTurnover}
                    onChangeText={(val) =>
                      onUpdateBusiness({ grossTurnover: val.replace(/[^0-9]/g, "") })
                    }
                  />
                </View>
              </View>

              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>Declared Net Profit</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.currencyPrefix}>₹</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    placeholder="e.g. 2,00,000"
                    placeholderTextColor="#94A3B8"
                    value={sources.business.declaredProfit}
                    onChangeText={(val) =>
                      onUpdateBusiness({ declaredProfit: val.replace(/[^0-9]/g, "") })
                    }
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
      )}

      {/* 4. Capital Gains & Trading Activity */}
      {showCapitalGains && (
        <View style={[styles.card, sources.capitalGains.enabled && styles.cardActive]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.sourceHeaderRow}
          onPress={() => onUpdateCapitalGains({ enabled: !sources.capitalGains.enabled })}
        >
          <View style={styles.sourceHeaderLeft}>
            <View style={[styles.sourceIconBox, sources.capitalGains.enabled && styles.sourceIconBoxActive]}>
              <Ionicons
                name="trending-up-outline"
                size={20}
                color={sources.capitalGains.enabled ? BrandColors.PRIMARY_ORANGE : "#64748B"}
              />
            </View>
            <View style={styles.sourceTitleCol}>
              <View style={styles.sourceTitleRow}>
                <Text style={styles.sourceTitle}>Capital Gains & Trading</Text>
                {sources.capitalGains.statementUploaded && (
                  <View style={styles.sourceTagVerified}>
                    <Ionicons name="checkmark-circle" size={10} color="#166534" />
                    <Text style={styles.sourceTagVerifiedText}>Broker Parsed</Text>
                  </View>
                )}
              </View>
              <Text style={styles.sourceSubtitle}>Stocks, mutual funds, F&O, crypto, real estate</Text>
            </View>
          </View>
          <View style={styles.checkboxBtn}>
            <Ionicons
              name={sources.capitalGains.enabled ? "checkbox" : "square-outline"}
              size={22}
              color={sources.capitalGains.enabled ? BrandColors.PRIMARY_ORANGE : "#94A3B8"}
            />
          </View>
        </TouchableOpacity>

        {sources.capitalGains.enabled && (
          <View style={styles.expandedForm}>
            {/* Broker Statement Card */}
            {sources.capitalGains.statementUploaded && Boolean(sources.capitalGains.brokerName) && (
              <View style={styles.brokerStatementCard}>
                <View style={styles.brokerTopRow}>
                  <Text style={styles.brokerTitle}>
                    Parsed: {sources.capitalGains.brokerName} Capital Gains Statement
                  </Text>
                  <View style={styles.sourceTagImported}>
                    <Text style={styles.sourceTagImportedText}>
                      {sources.capitalGains.totalTransactions} Transactions
                    </Text>
                  </View>
                </View>
                <Text style={styles.sourceSubtitle}>
                  Consolidated short-term and long-term gain calculation imported for reconciliation.
                </Text>
              </View>
            )}

            {/* Sub-Asset Filters */}
            <Text style={styles.inputLabel}>Asset Types Traded</Text>
            <View style={styles.tagWrapRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.filterTag, sources.capitalGains.hasEquityMf && styles.filterTagSelected]}
                onPress={() =>
                  onUpdateCapitalGains({ hasEquityMf: !sources.capitalGains.hasEquityMf })
                }
              >
                <Text style={[styles.filterTagText, sources.capitalGains.hasEquityMf && styles.filterTagTextSelected]}>
                  Equity & Mutual Funds
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.filterTag, sources.capitalGains.hasFnoIntraday && styles.filterTagSelected]}
                onPress={() =>
                  onUpdateCapitalGains({ hasFnoIntraday: !sources.capitalGains.hasFnoIntraday })
                }
              >
                <Text style={[styles.filterTagText, sources.capitalGains.hasFnoIntraday && styles.filterTagTextSelected]}>
                  F&O & Intraday Trading
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.filterTag, sources.capitalGains.hasCryptoVda && styles.filterTagSelected]}
                onPress={() =>
                  onUpdateCapitalGains({ hasCryptoVda: !sources.capitalGains.hasCryptoVda })
                }
              >
                <Text style={[styles.filterTagText, sources.capitalGains.hasCryptoVda && styles.filterTagTextSelected]}>
                  Crypto / VDA
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.filterTag, sources.capitalGains.hasPropertyAssets && styles.filterTagSelected]}
                onPress={() =>
                  onUpdateCapitalGains({ hasPropertyAssets: !sources.capitalGains.hasPropertyAssets })
                }
              >
                <Text style={[styles.filterTagText, sources.capitalGains.hasPropertyAssets && styles.filterTagTextSelected]}>
                  Real Estate / Land
                </Text>
              </TouchableOpacity>
            </View>

            {/* F&O Note */}
            {sources.capitalGains.hasFnoIntraday && (
              <View style={styles.fnoWarningBox}>
                <Ionicons name="information-circle" size={16} color="#1D4ED8" />
                <Text style={styles.fnoWarningText}>
                  F&O and intraday trades are treated as business income under Section 43(5). TaxEdge will prepare your return under ITR-3.
                </Text>
              </View>
            )}

            {/* Crypto Note */}
            {sources.capitalGains.hasCryptoVda && (
              <View style={styles.cryptoWarningBox}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                <Text style={styles.cryptoWarningText}>
                  Virtual Digital Assets (VDA) are taxed at a flat 30% u/s 115BBH without standard deductions or loss set-off.
                </Text>
              </View>
            )}

            <View style={styles.inputRow}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>Short-Term Gains (STCG)</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.currencyPrefix}>₹</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    placeholder="e.g. 32,000"
                    placeholderTextColor="#94A3B8"
                    value={sources.capitalGains.shortTermGains}
                    onChangeText={(val) =>
                      onUpdateCapitalGains({ shortTermGains: val.replace(/[^0-9]/g, "") })
                    }
                  />
                </View>
              </View>

              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>Long-Term Gains (LTCG)</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.currencyPrefix}>₹</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    placeholder="e.g. 45,000"
                    placeholderTextColor="#94A3B8"
                    value={sources.capitalGains.longTermGains}
                    onChangeText={(val) =>
                      onUpdateCapitalGains({ longTermGains: val.replace(/[^0-9]/g, "") })
                    }
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
      )}

      {/* 5. Other Sources Income (AIS Table) */}
      {showOtherSources && (
        <View style={[styles.card, sources.otherSources.enabled && styles.cardActive]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.sourceHeaderRow}
          onPress={() => onUpdateOtherSources({ enabled: !sources.otherSources.enabled })}
        >
          <View style={styles.sourceHeaderLeft}>
            <View style={[styles.sourceIconBox, sources.otherSources.enabled && styles.sourceIconBoxActive]}>
              <Ionicons
                name="wallet-outline"
                size={20}
                color={sources.otherSources.enabled ? BrandColors.PRIMARY_ORANGE : "#64748B"}
              />
            </View>
            <View style={styles.sourceTitleCol}>
              <View style={styles.sourceTitleRow}>
                <Text style={styles.sourceTitle}>Income from Other Sources</Text>
                {sources.otherSources.source === "AIS_TIS" && (
                  <View style={styles.sourceTagWarning}>
                    <Ionicons name="alert-circle" size={10} color="#B45309" />
                    <Text style={styles.sourceTagWarningText}>AIS Imported</Text>
                  </View>
                )}
              </View>
              <Text style={styles.sourceSubtitle}>Bank interest, dividends, family pension</Text>
            </View>
          </View>
          <View style={styles.checkboxBtn}>
            <Ionicons
              name={sources.otherSources.enabled ? "checkbox" : "square-outline"}
              size={22}
              color={sources.otherSources.enabled ? BrandColors.PRIMARY_ORANGE : "#94A3B8"}
            />
          </View>
        </TouchableOpacity>

        {sources.otherSources.enabled && (
          <View style={styles.expandedForm}>
            {/* AIS Pre-filled Table */}
            {sources.otherSources.source === "AIS_TIS" &&
              (Number(sources.otherSources.savingsInterest || 0) > 0 ||
                Number(sources.otherSources.fdInterest || 0) > 0 ||
                Number(sources.otherSources.dividendIncome || 0) > 0) && (
                <View style={styles.aisTable}>
                  {Number(sources.otherSources.savingsInterest || 0) > 0 && (
                    <View style={styles.aisRow}>
                      <Text style={styles.aisLabel}>Savings Bank Interest (AIS)</Text>
                      <Text style={styles.aisValue}>
                        ₹ {Number(sources.otherSources.savingsInterest).toLocaleString("en-IN")}
                      </Text>
                    </View>
                  )}
                  {Number(sources.otherSources.fdInterest || 0) > 0 && (
                    <View style={styles.aisRow}>
                      <Text style={styles.aisLabel}>Term Deposit / FD Interest (AIS)</Text>
                      <Text style={styles.aisValue}>
                        ₹ {Number(sources.otherSources.fdInterest).toLocaleString("en-IN")}
                      </Text>
                    </View>
                  )}
                  {Number(sources.otherSources.dividendIncome || 0) > 0 && (
                    <View style={styles.aisRow}>
                      <Text style={styles.aisLabel}>Dividend Income (AIS)</Text>
                      <Text style={styles.aisValue}>
                        ₹ {Number(sources.otherSources.dividendIncome).toLocaleString("en-IN")}
                      </Text>
                    </View>
                  )}

                  <View style={styles.aisNotice}>
                    <Ionicons name="information-circle-outline" size={14} color="#64748B" />
                    <Text style={styles.aisNoticeText}>
                      Please verify these values against your bank account passbooks.
                    </Text>
                  </View>
                </View>
              )}

            <View style={styles.inputRow}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>Savings Interest</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.currencyPrefix}>₹</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    placeholder="e.g. 10,000"
                    placeholderTextColor="#94A3B8"
                    value={sources.otherSources.savingsInterest}
                    onChangeText={(val) =>
                      onUpdateOtherSources({ savingsInterest: val.replace(/[^0-9]/g, "") })
                    }
                  />
                </View>
              </View>

              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>FD / Term Interest</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.currencyPrefix}>₹</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    placeholder="e.g. 25,000"
                    placeholderTextColor="#94A3B8"
                    value={sources.otherSources.fdInterest}
                    onChangeText={(val) =>
                      onUpdateOtherSources({ fdInterest: val.replace(/[^0-9]/g, "") })
                    }
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>Dividend Income</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.currencyPrefix}>₹</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    placeholder="e.g. 5,000"
                    placeholderTextColor="#94A3B8"
                    value={sources.otherSources.dividendIncome}
                    onChangeText={(val) =>
                      onUpdateOtherSources({ dividendIncome: val.replace(/[^0-9]/g, "") })
                    }
                  />
                </View>
              </View>

              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>Other Miscellaneous</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.currencyPrefix}>₹</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    placeholder="e.g. 0"
                    placeholderTextColor="#94A3B8"
                    value={sources.otherSources.otherIncome}
                    onChangeText={(val) =>
                      onUpdateOtherSources({ otherIncome: val.replace(/[^0-9]/g, "") })
                    }
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
      )}

      {/* Switch to Multiple Sources if not already */}
      {!isMultiple && onSwitchCategory && (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.switchCategoryCard}
          onPress={() => onSwitchCategory("multiple")}
        >
          <Ionicons name="add-circle-outline" size={18} color="#083B75" />
          <Text style={styles.switchCategoryText}>
            Have additional income to declare? Tap to switch to Multiple Sources
          </Text>
        </TouchableOpacity>
      )}

      {/* Continue Button */}
      <TouchableOpacity activeOpacity={0.85} style={styles.continueButton} onPress={handleProceed}>
        <Text style={styles.continueButtonText}>Confirm & Continue to Deductions</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};
