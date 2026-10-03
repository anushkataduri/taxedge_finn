import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
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
import {
  BusinessIncomeForm,
  CapitalGainsIncomeForm,
} from "./components/Step2BusinessAndCapitalGains";
import { OtherSourcesIncomeForm } from "./components/Step2OtherSources";

interface Step2IncomeSourcesProps {
  isEditing?: boolean;
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

export const Step2IncomeSources: React.FC<Step2IncomeSourcesProps> = ({ isEditing, 
  sources,
  determinedForm,
  gstReconciliation,
  onUpdateSalary,
  onUpdateHouseProperty,
  onUpdateBusiness,
  onUpdateCapitalGains,
  onUpdateOtherSources,
  onContinue,
}) => {
  const handleProceed = () => {
    const hasAnyIncome =
      sources.salary.enabled ||
      sources.houseProperty.enabled ||
      sources.business.enabled ||
      sources.capitalGains.enabled ||
      sources.otherSources.enabled;

    if (!hasAnyIncome) {
      Alert.alert(
        "Income Source Required",
        "Please select at least one income source to proceed.",
      );
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
            <Text style={styles.determinationTitle}>
              Applicable Return Form
            </Text>
          </View>
          <View style={styles.formBadge}>
            <Text style={styles.formBadgeText}>{determinedForm.form}</Text>
          </View>
        </View>

        <Text style={styles.determinationRationale}>
          {determinedForm.rationale}
        </Text>

        {/* Dynamic Criteria Checks */}
        {determinedForm.criteriaChecks &&
          determinedForm.criteriaChecks.length > 0 && (
            <View style={styles.determinationCriteriaList}>
              {determinedForm.criteriaChecks.map((check) => (
                <View key={check.id} style={styles.determinationCriteriaRow}>
                  <Ionicons name="checkmark-circle" size={13} color="#1D4ED8" />
                  <Text style={styles.determinationCriteriaText}>
                    {check.label}
                  </Text>
                </View>
              ))}
            </View>
          )}
      </View>

      <Text style={styles.sectionTitle}>Income Sources & Activity</Text>
      <Text style={styles.sectionSubtitle}>
        Select all sources of income you earned this year. Fields will adjust
        automatically.
      </Text>

      {/* Income Source Selector Chips */}
      <View style={styles.sourceSelectorCard}>
        <Text style={styles.sourceSelectorTitle}>
          Select your income sources:
        </Text>
        <View style={styles.sourceChipsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.sourceChip,
              sources.salary.enabled && styles.sourceChipActive,
            ]}
            onPress={() => onUpdateSalary({ enabled: !sources.salary.enabled })}
          >
            <Ionicons
              name={
                sources.salary.enabled
                  ? "checkmark-circle"
                  : "add-circle-outline"
              }
              size={16}
              color={
                sources.salary.enabled ? BrandColors.PRIMARY_ORANGE : "#64748B"
              }
            />
            <Text
              style={[
                styles.sourceChipText,
                sources.salary.enabled && styles.sourceChipTextActive,
              ]}
            >
              Salary / Pension
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.sourceChip,
              sources.houseProperty.enabled && styles.sourceChipActive,
            ]}
            onPress={() =>
              onUpdateHouseProperty({ enabled: !sources.houseProperty.enabled })
            }
          >
            <Ionicons
              name={
                sources.houseProperty.enabled
                  ? "checkmark-circle"
                  : "add-circle-outline"
              }
              size={16}
              color={
                sources.houseProperty.enabled
                  ? BrandColors.PRIMARY_ORANGE
                  : "#64748B"
              }
            />
            <Text
              style={[
                styles.sourceChipText,
                sources.houseProperty.enabled && styles.sourceChipTextActive,
              ]}
            >
              House Property
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.sourceChip,
              sources.business.enabled && styles.sourceChipActive,
            ]}
            onPress={() =>
              onUpdateBusiness({ enabled: !sources.business.enabled })
            }
          >
            <Ionicons
              name={
                sources.business.enabled
                  ? "checkmark-circle"
                  : "add-circle-outline"
              }
              size={16}
              color={
                sources.business.enabled
                  ? BrandColors.PRIMARY_ORANGE
                  : "#64748B"
              }
            />
            <Text
              style={[
                styles.sourceChipText,
                sources.business.enabled && styles.sourceChipTextActive,
              ]}
            >
              Business / Profession
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.sourceChip,
              sources.capitalGains.enabled && styles.sourceChipActive,
            ]}
            onPress={() =>
              onUpdateCapitalGains({ enabled: !sources.capitalGains.enabled })
            }
          >
            <Ionicons
              name={
                sources.capitalGains.enabled
                  ? "checkmark-circle"
                  : "add-circle-outline"
              }
              size={16}
              color={
                sources.capitalGains.enabled
                  ? BrandColors.PRIMARY_ORANGE
                  : "#64748B"
              }
            />
            <Text
              style={[
                styles.sourceChipText,
                sources.capitalGains.enabled && styles.sourceChipTextActive,
              ]}
            >
              Capital Gains
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.sourceChip,
              sources.otherSources.enabled && styles.sourceChipActive,
            ]}
            onPress={() =>
              onUpdateOtherSources({ enabled: !sources.otherSources.enabled })
            }
          >
            <Ionicons
              name={
                sources.otherSources.enabled
                  ? "checkmark-circle"
                  : "add-circle-outline"
              }
              size={16}
              color={
                sources.otherSources.enabled
                  ? BrandColors.PRIMARY_ORANGE
                  : "#64748B"
              }
            />
            <Text
              style={[
                styles.sourceChipText,
                sources.otherSources.enabled && styles.sourceChipTextActive,
              ]}
            >
              Other Sources
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 1. Salary Income */}
      {sources.salary.enabled && (
        <View style={[styles.card, styles.cardActive]}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.sourceHeaderRow}
            onPress={() => onUpdateSalary({ enabled: !sources.salary.enabled })}
          >
            <View style={styles.sourceHeaderLeft}>
              <View style={[styles.sourceIconBox, styles.sourceIconBoxActive]}>
                <Ionicons
                  name="briefcase-outline"
                  size={20}
                  color={BrandColors.PRIMARY_ORANGE}
                />
              </View>
              <View style={styles.sourceTitleCol}>
                <View style={styles.sourceTitleRow}>
                  <Text style={styles.sourceTitle}>Salary Income</Text>
                  {sources.salary.isVerified &&
                    sources.salary.source === "FORM_16" && (
                      <View style={styles.sourceTagVerified}>
                        <Ionicons
                          name="shield-checkmark"
                          size={10}
                          color="#166534"
                        />
                        <Text style={styles.sourceTagVerifiedText}>
                          Form 16 Imported
                        </Text>
                      </View>
                    )}
                </View>
                <Text style={styles.sourceSubtitle}>
                  Employer Form 16, payslips, TDS credits
                </Text>
              </View>
            </View>
            <View style={styles.checkboxBtn}>
              <Ionicons
                name="checkbox"
                size={22}
                color={BrandColors.PRIMARY_ORANGE}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.expandedForm}>
            {/* Form 16 Import Snapshot Card */}
            {sources.salary.isVerified &&
              sources.salary.source === "FORM_16" &&
              Boolean(sources.salary.employerName) && (
                <View style={styles.form16Card}>
                  <View style={styles.form16TopRow}>
                    <Text style={styles.form16Title}>
                      Detected from Form 16
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        Alert.alert(
                          "Form 16 Details",
                          `Employer: ${sources.salary.employerName}\nGross Salary: ₹${Number(sources.salary.grossSalary || 0).toLocaleString("en-IN")}\nAllowances u/s 10: ₹${Number(sources.salary.allowances || 0).toLocaleString("en-IN")}\nTDS Deducted: ₹${Number(sources.salary.tdsDeducted || 0).toLocaleString("en-IN")}`,
                        )
                      }
                    >
                      <Text style={styles.sourceSubtitle}>View Details</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.form16StatsRow}>
                    <Text style={styles.form16StatLabel}>Employer</Text>
                    <Text style={styles.form16StatValue}>
                      {sources.salary.employerName}
                    </Text>
                  </View>
                  <View style={styles.form16StatsRow}>
                    <Text style={styles.form16StatLabel}>
                      TDS Deducted (Tax Credit)
                    </Text>
                    <Text style={styles.form16StatValue}>
                      ₹{" "}
                      {Number(sources.salary.tdsDeducted || 0).toLocaleString(
                        "en-IN",
                      )}
                    </Text>
                  </View>
                </View>
              )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Employer Legal Name</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Acme Technologies Ltd"
                  placeholderTextColor="#94A3B8"
                  value={sources.salary.employerName}
                  onChangeText={(employerName) =>
                    onUpdateSalary({ employerName })
                  }
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
                      onUpdateSalary({
                        grossSalary: val.replace(/[^0-9]/g, ""),
                      })}
                    maxLength={12}
                  />
                </View>
              </View>

              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>
                  Exempt Allowances (HRA, LTA)
                </Text>
                <View style={styles.inputBox}>
                  <Text style={styles.currencyPrefix}>₹</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    placeholder="e.g. 50,000"
                    placeholderTextColor="#94A3B8"
                    value={sources.salary.allowances}
                    onChangeText={(val) =>
                      onUpdateSalary({ allowances: val.replace(/[^0-9]/g, "") })}
                    maxLength={12}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>TDS Deducted by Employer</Text>
              <View style={styles.inputBox}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  placeholder="e.g. 45,000"
                  placeholderTextColor="#94A3B8"
                  value={sources.salary.tdsDeducted}
                  onChangeText={(val) =>
                    onUpdateSalary({ tdsDeducted: val.replace(/[^0-9]/g, "") })}
                  maxLength={12}
                />
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 2. House Property Income */}
      {sources.houseProperty.enabled && (
        <View style={[styles.card, styles.cardActive]}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.sourceHeaderRow}
            onPress={() =>
              onUpdateHouseProperty({ enabled: !sources.houseProperty.enabled })
            }
          >
            <View style={styles.sourceHeaderLeft}>
              <View style={[styles.sourceIconBox, styles.sourceIconBoxActive]}>
                <Ionicons
                  name="home-outline"
                  size={20}
                  color={BrandColors.PRIMARY_ORANGE}
                />
              </View>
              <View style={styles.sourceTitleCol}>
                <Text style={styles.sourceTitle}>House Property</Text>
                <Text style={styles.sourceSubtitle}>
                  Self-occupied home loan or rental income
                </Text>
              </View>
            </View>
            <View style={styles.checkboxBtn}>
              <Ionicons
                name="checkbox"
                size={22}
                color={BrandColors.PRIMARY_ORANGE}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.expandedForm}>
            <Text style={styles.inputLabel}>Property Classification</Text>
            <View style={styles.pillRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.pill,
                  sources.houseProperty.propertyType === "self_occupied" &&
                    styles.pillSelected,
                ]}
                onPress={() =>
                  onUpdateHouseProperty({ propertyType: "self_occupied" })
                }
              >
                <Text
                  style={[
                    styles.pillText,
                    sources.houseProperty.propertyType === "self_occupied" &&
                      styles.pillTextSelected,
                  ]}
                >
                  Self-Occupied
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.pill,
                  sources.houseProperty.propertyType === "let_out" &&
                    styles.pillSelected,
                ]}
                onPress={() =>
                  onUpdateHouseProperty({ propertyType: "let_out" })
                }
              >
                <Text
                  style={[
                    styles.pillText,
                    sources.houseProperty.propertyType === "let_out" &&
                      styles.pillTextSelected,
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
                        onUpdateHouseProperty({
                          annualRentReceived: val.replace(/[^0-9]/g, ""),
                        })}
                      maxLength={12}
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
                        onUpdateHouseProperty({
                          municipalTaxesPaid: val.replace(/[^0-9]/g, ""),
                        })}
                      maxLength={12}
                    />
                  </View>
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Home Loan Interest Paid (Sec 24b)
              </Text>
              <View style={styles.inputBox}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  placeholder="Max ₹2,00,000 for self-occupied"
                  placeholderTextColor="#94A3B8"
                  value={sources.houseProperty.homeLoanInterest}
                  onChangeText={(val) =>
                    onUpdateHouseProperty({
                      homeLoanInterest: val.replace(/[^0-9]/g, ""),
                    })}
                  maxLength={12}
                />
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 3. Business / Profession & GST Bridge */}
      <BusinessIncomeForm
        business={sources.business}
        gstReconciliation={gstReconciliation}
        onUpdateBusiness={onUpdateBusiness}
      />

      {/* 4. Capital Gains & Trading Activity */}
      <CapitalGainsIncomeForm
        capitalGains={sources.capitalGains}
        onUpdateCapitalGains={onUpdateCapitalGains}
      />

      {/* 5. Other Sources Income */}
      <OtherSourcesIncomeForm
        otherSources={sources.otherSources}
        onUpdateOtherSources={onUpdateOtherSources}
      />

      {/* Continue Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.continueButton}
        onPress={handleProceed}
      >
        <Text style={styles.continueButtonText}>
          Confirm & Continue to Deductions
        </Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};
