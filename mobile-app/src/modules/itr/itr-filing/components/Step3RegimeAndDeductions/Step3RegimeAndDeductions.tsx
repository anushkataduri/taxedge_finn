import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  TaxRegimeType,
  ItrStructuredDeductions,
  TaxCalculationBreakdown,
  AdditionalDeductionItem,
} from "../../types/itrFiling.types";
import { BrandColors } from "@/shared/theme";
import { RegimeComparisonTable } from "../../../components/RegimeComparisonTable";
import { styles } from "./Step3RegimeAndDeductions.styles";

interface Step3RegimeAndDeductionsProps {
  regime: TaxRegimeType;
  onChangeRegime: (regime: TaxRegimeType) => void;
  deductions: ItrStructuredDeductions;
  onChangeDeductions: (deductions: Partial<ItrStructuredDeductions>) => void;
  calculation: TaxCalculationBreakdown;
  assessmentYear: string;
  onContinue: () => void;
}

export const Step3RegimeAndDeductions: React.FC<Step3RegimeAndDeductionsProps> = ({
  regime,
  onChangeRegime,
  deductions,
  onChangeDeductions,
  calculation,
  assessmentYear,
  onContinue,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeductionType, setNewDeductionType] = useState<"80G" | "80TTA" | "80CCD_NPS" | "80DD">("80G");
  const [newDeductionTitle, setNewDeductionTitle] = useState("");
  const [newDeductionAmount, setNewDeductionAmount] = useState("");

  const update80c = (key: keyof typeof deductions.sec80c, val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "");
    onChangeDeductions({
      sec80c: {
        ...deductions.sec80c,
        [key]: cleaned,
      },
    });
  };

  const update80d = (key: keyof typeof deductions.sec80d, val: any) => {
    onChangeDeductions({
      sec80d: {
        ...deductions.sec80d,
        [key]: val,
      },
    });
  };

  const handleAddDeduction = () => {
    if (!newDeductionAmount.trim()) {
      Alert.alert("Amount Required", "Please enter the deduction amount.");
      return;
    }

    const defaultTitle =
      newDeductionType === "80G"
        ? "80G Charitable Donations"
        : newDeductionType === "80TTA"
        ? "80TTA Savings Account Interest"
        : newDeductionType === "80CCD_NPS"
        ? "80CCD(1B) NPS Additional Contribution"
        : "80DD Medical for Disabled Dependent";

    const newItem: AdditionalDeductionItem = {
      id: `ded-${Date.now()}`,
      type: newDeductionType,
      title: newDeductionTitle.trim() || defaultTitle,
      amount: newDeductionAmount.replace(/[^0-9]/g, ""),
    };

    onChangeDeductions({
      otherDeductionsList: [...deductions.otherDeductionsList, newItem],
    });

    setNewDeductionTitle("");
    setNewDeductionAmount("");
    setShowAddModal(false);
  };

  const handleRemoveDeduction = (id: string) => {
    onChangeDeductions({
      otherDeductionsList: deductions.otherDeductionsList.filter((d) => d.id !== id),
    });
  };

  return (
    <View style={styles.container}>
      {/* 1. Transparent Side-by-Side Regime Comparison */}
      <RegimeComparisonTable
        calculation={calculation}
        selectedRegime={regime}
        onChangeRegime={onChangeRegime}
        assessmentYear={assessmentYear}
      />

      {/* 2. Regime-Aware Deductions Filtering */}
      {regime === "new" ? (
        <View style={styles.newRegimeSuppressedCard}>
          <View style={styles.newRegimeSuppressedHeader}>
            <Ionicons name="information-circle" size={18} color="#1E40AF" />
            <Text style={styles.newRegimeSuppressedTitle}>
              Deductions Under New Tax Regime
            </Text>
          </View>
          <Text style={styles.newRegimeSuppressedText}>
            Most Chapter VI-A deductions (Section 80C, 80D, 24b) are not available under the New Tax Regime. Eligible salaried taxpayers receive the applicable standard deduction of ₹75,000 automatically.
          </Text>
        </View>
      ) : (
        /* Old Regime Structured Deductions */
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#083B75" />
              <Text style={styles.cardTitle}>Structured Deductions (Old Regime)</Text>
            </View>
          </View>

          <Text style={styles.cardDescription}>
            Enter eligible investments and insurance expenses. Fields are pre-filled where detected from Form 16 or prior returns.
          </Text>

          {/* Section 80C */}
          <View style={styles.deductionSection}>
            <View style={styles.deductionHeaderRow}>
              <Text style={styles.deductionSectionTitle}>Section 80C Investments</Text>
              <View style={styles.capBadge}>
                <Text style={styles.capBadgeText}>Capped at ₹1,50,000</Text>
              </View>
            </View>

            <View style={styles.inputGrid}>
              <View style={styles.inputRow}>
                <View style={styles.inputGroupHalf}>
                  <Text style={styles.inputLabel}>EPF (Employee Provident)</Text>
                  <View style={styles.inputBox}>
                    <Text style={styles.currencyPrefix}>₹</Text>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="numeric"
                      placeholder="e.g. 45,000"
                      placeholderTextColor="#94A3B8"
                      value={deductions.sec80c.epf}
                      onChangeText={(val) => update80c("epf", val)}
                    />
                  </View>
                </View>

                <View style={styles.inputGroupHalf}>
                  <Text style={styles.inputLabel}>PPF (Public Provident)</Text>
                  <View style={styles.inputBox}>
                    <Text style={styles.currencyPrefix}>₹</Text>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="numeric"
                      placeholder="e.g. 50,000"
                      placeholderTextColor="#94A3B8"
                      value={deductions.sec80c.ppf}
                      onChangeText={(val) => update80c("ppf", val)}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputGroupHalf}>
                  <Text style={styles.inputLabel}>Life Insurance (LIC)</Text>
                  <View style={styles.inputBox}>
                    <Text style={styles.currencyPrefix}>₹</Text>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="numeric"
                      placeholder="e.g. 25,000"
                      placeholderTextColor="#94A3B8"
                      value={deductions.sec80c.lic}
                      onChangeText={(val) => update80c("lic", val)}
                    />
                  </View>
                </View>

                <View style={styles.inputGroupHalf}>
                  <Text style={styles.inputLabel}>ELSS Tax-Saving Funds</Text>
                  <View style={styles.inputBox}>
                    <Text style={styles.currencyPrefix}>₹</Text>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="numeric"
                      placeholder="Mutual fund ELSS"
                      placeholderTextColor="#94A3B8"
                      value={deductions.sec80c.elss}
                      onChangeText={(val) => update80c("elss", val)}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputGroupHalf}>
                  <Text style={styles.inputLabel}>Children Tuition Fees</Text>
                  <View style={styles.inputBox}>
                    <Text style={styles.currencyPrefix}>₹</Text>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="numeric"
                      placeholder="School fees"
                      placeholderTextColor="#94A3B8"
                      value={deductions.sec80c.tuitionFees}
                      onChangeText={(val) => update80c("tuitionFees", val)}
                    />
                  </View>
                </View>

                <View style={styles.inputGroupHalf}>
                  <Text style={styles.inputLabel}>Housing Loan Principal</Text>
                  <View style={styles.inputBox}>
                    <Text style={styles.currencyPrefix}>₹</Text>
                    <TextInput
                      style={styles.textInput}
                      keyboardType="numeric"
                      placeholder="Principal repaid"
                      placeholderTextColor="#94A3B8"
                      value={deductions.sec80c.housingPrincipal}
                      onChangeText={(val) => update80c("housingPrincipal", val)}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Section 80D */}
          <View style={styles.deductionSection}>
            <View style={styles.deductionHeaderRow}>
              <Text style={styles.deductionSectionTitle}>Section 80D Health Insurance</Text>
              <View style={styles.capBadge}>
                <Text style={styles.capBadgeText}>Up to ₹25k / ₹50k</Text>
              </View>
            </View>

            <View style={styles.inputGrid}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Self, Spouse & Dependent Children</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.currencyPrefix}>₹</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    placeholder="Max 25,000"
                    placeholderTextColor="#94A3B8"
                    value={deductions.sec80d.selfSpouseChildren}
                    onChangeText={(val) => update80d("selfSpouseChildren", val.replace(/[^0-9]/g, ""))}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Parents Health Insurance</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.currencyPrefix}>₹</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    placeholder="Max 25,000 (50k for senior)"
                    placeholderTextColor="#94A3B8"
                    value={deductions.sec80d.parents}
                    onChangeText={(val) => update80d("parents", val.replace(/[^0-9]/g, ""))}
                  />
                </View>
              </View>

              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Are your parents Senior Citizens (60+)?</Text>
                <Switch
                  value={deductions.sec80d.isParentSeniorCitizen}
                  onValueChange={(val) => update80d("isParentSeniorCitizen", val)}
                  trackColor={{ false: "#CBD5E1", true: BrandColors.PRIMARY_ORANGE }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>

          {/* Section 24b Home Loan Interest */}
          <View style={styles.deductionSection}>
            <View style={styles.deductionHeaderRow}>
              <Text style={styles.deductionSectionTitle}>Section 24(b) Home Loan Interest</Text>
              <View style={styles.capBadge}>
                <Text style={styles.capBadgeText}>Max ₹2,00,000</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputBox}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  placeholder="Interest paid on self-occupied property"
                  placeholderTextColor="#94A3B8"
                  value={deductions.sec24b}
                  onChangeText={(val) => onChangeDeductions({ sec24b: val.replace(/[^0-9]/g, "") })}
                />
              </View>
            </View>
          </View>

          {/* Additional Deductions List */}
          {deductions.otherDeductionsList.map((item) => (
            <View key={item.id} style={styles.otherDeductionItem}>
              <View style={styles.otherDeductionInfo}>
                <Text style={styles.otherDeductionTitle}>{item.title}</Text>
                <Text style={styles.otherDeductionAmount}>
                  ₹ {Number(item.amount).toLocaleString("en-IN")}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.removeDeductionBtn}
                onPress={() => handleRemoveDeduction(item.id)}
              >
                <Ionicons name="trash-outline" size={18} color="#DC2626" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.addDeductionBtn}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add-circle-outline" size={18} color="#083B75" />
            <Text style={styles.addDeductionBtnText}>Add Other Deduction (80G, 80CCD, 80TTA)</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Continue Button */}
      <TouchableOpacity activeOpacity={0.85} style={styles.continueButton} onPress={onContinue}>
        <Text style={styles.continueButtonText}>Confirm & Continue to Documents</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add Additional Deduction Modal */}
      <Modal visible={showAddModal} transparent animationType="slide" onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Add Additional Deduction</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Deduction Section</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 80G Charitable Donations"
                  placeholderTextColor="#94A3B8"
                  value={newDeductionTitle}
                  onChangeText={setNewDeductionTitle}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount Claimed</Text>
              <View style={styles.inputBox}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  placeholder="Enter amount"
                  placeholderTextColor="#94A3B8"
                  value={newDeductionAmount}
                  onChangeText={setNewDeductionAmount}
                />
              </View>
            </View>

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.actionBtnCancel}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.actionBtnCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.actionBtnSave}
                onPress={handleAddDeduction}
              >
                <Text style={styles.actionBtnSaveText}>Add Deduction</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
