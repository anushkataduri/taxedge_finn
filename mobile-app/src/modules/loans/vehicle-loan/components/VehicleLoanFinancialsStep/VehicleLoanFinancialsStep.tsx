import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { VehicleLoanDetailsFormData } from "../../types/vehicleLoan.types";
import { styles } from "./VehicleLoanFinancialsStep.styles";

export interface VehicleLoanFinancialsStepProps {
  data: VehicleLoanDetailsFormData;
  onChange: (field: keyof VehicleLoanDetailsFormData, value: any) => void;
  errors?: Record<string, string>;
}

const VEHICLE_PURPOSES = [
  "New Car (Passenger)",
  "Pre-Owned / Used Car",
  "Electric Vehicle (EV - 2W / 4W)",
  "Two-Wheeler / Superbike",
  "Commercial Vehicle / Truck",
  "Fleet Purchase",
  "Balance Transfer & Top-Up",
  "Others",
];

const TENURE_OPTIONS = [
  { label: "3 M (3 Months)", value: "3" },
  { label: "6 M (6 Months)", value: "6" },
  { label: "9 M (9 Months)", value: "9" },
  { label: "12 M (1 Yr)", value: "12" },
  { label: "18 M (1.5 Yrs)", value: "18" },
  { label: "24 M (2 Yrs)", value: "24" },
  { label: "36 M (3 Yrs)", value: "36" },
  { label: "48 M (4 Yrs)", value: "48" },
  { label: "60 M (5 Yrs)", value: "60" },
  { label: "72 M (6 Yrs)", value: "72" },
  { label: "84 M (7 Yrs)", value: "84" },
  { label: "Other / Custom Tenure", value: "Other" },
];

const VEHICLE_MODELS = [
  "Maruti Suzuki Swift",
  "Maruti Suzuki Baleno",
  "Maruti Suzuki Brezza",
  "Maruti Suzuki Ertiga",
  "Hyundai Creta",
  "Hyundai Venue",
  "Hyundai i20",
  "Hyundai Verna",
  "Tata Nexon",
  "Tata Punch",
  "Tata Harrier / Safari",
  "Tata Nexon EV",
  "Mahindra Thar",
  "Mahindra Scorpio-N",
  "Mahindra XUV700",
  "Kia Seltos",
  "Kia Sonet",
  "Toyota Innova Crysta / Hycross",
  "Toyota Fortuner",
  "Honda City / Elevate",
  "Electric: MG ZS EV / Ola S1 / Ather 450X",
  "Two-Wheeler: Honda Activa / TVS Jupiter",
  "Two-Wheeler: Royal Enfield / Bajaj Pulsar",
  "Commercial: Tata Ace / Mahindra Bolero Pik-Up",
  "Other (Specify Custom Vehicle Model)",
];

const AMOUNT_PRESETS = [
  { label: "₹3 Lakhs", value: "300000" },
  { label: "₹5 Lakhs", value: "500000" },
  { label: "₹8 Lakhs", value: "800000" },
  { label: "₹12 Lakhs", value: "1200000" },
  { label: "₹20 Lakhs", value: "2000000" },
];

const VEHICLE_CONDITIONS: ("New Vehicle" | "Pre-Owned / Used Vehicle")[] = [
  "New Vehicle",
  "Pre-Owned / Used Vehicle",
];

export const VehicleLoanFinancialsStep: React.FC<VehicleLoanFinancialsStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const [isPurposeModalOpen, setIsPurposeModalOpen] = useState(false);
  const [isTenureModalOpen, setIsTenureModalOpen] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isCustomTenure, setIsCustomTenure] = useState(() => {
    if (!data.preferredTenureMonths) return false;
    return !TENURE_OPTIONS.some((t) => t.value === data.preferredTenureMonths && t.value !== "Other");
  });
  const [isCustomModel, setIsCustomModel] = useState(() => {
    if (!data.vehicleMakeModel) return false;
    return !VEHICLE_MODELS.some((m) => m === data.vehicleMakeModel && !m.startsWith("Other"));
  });

  const isOthersSelected = data.purpose === "Others";
  const isUsedVehicle = data.vehicleCondition === "Pre-Owned / Used Vehicle";

  const handleSelectPurpose = (item: string) => {
    onChange("purpose", item);
    setIsPurposeModalOpen(false);
    if (item !== "Others") {
      onChange("customPurpose", "");
    }
    // Auto-sync condition if explicitly choosing Pre-Owned / Used Car
    if (item === "Pre-Owned / Used Car" && !data.vehicleCondition) {
      onChange("vehicleCondition", "Pre-Owned / Used Vehicle");
    } else if (item === "New Car (Passenger)" && !data.vehicleCondition) {
      onChange("vehicleCondition", "New Vehicle");
    }
  };

  const handleSelectTenure = (val: string) => {
    setIsTenureModalOpen(false);
    if (val === "Other") {
      setIsCustomTenure(true);
      onChange("preferredTenureMonths", "");
    } else {
      setIsCustomTenure(false);
      onChange("preferredTenureMonths", val);
    }
  };

  const handleSelectModel = (model: string) => {
    setIsModelModalOpen(false);
    if (model.startsWith("Other")) {
      setIsCustomModel(true);
      onChange("vehicleMakeModel", "");
    } else {
      setIsCustomModel(false);
      onChange("vehicleMakeModel", model);
    }
  };

  const getTenureLabel = (val?: string) => {
    if (!val) return "Select Repayment Tenure...";
    const found = TENURE_OPTIONS.find((t) => t.value === val);
    if (found && found.value !== "Other") return found.label;
    return `${val} Months (Custom)`;
  };

  return (
    <View style={styles.container}>
      {/* 1. Required Auto Loan Amount Card */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons
              name="cash-outline"
              size={20}
              color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
            />
            <Text style={styles.cardTitle}>Required Vehicle Loan Amount</Text>
          </View>
        </View>
        <Text style={styles.cardDescription}>
          Enter your required loan amount or select one of the quick presets below.
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Amount (₹) <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.requiredAmount && styles.inputError]}
            placeholder="Enter required loan amount (₹)"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={data.requiredAmount}
            onChangeText={(text) => onChange("requiredAmount", text)}
          />
          {errors.requiredAmount && (
            <Text style={styles.errorText}>{errors.requiredAmount}</Text>
          )}

          <View style={styles.chipRow}>
            {AMOUNT_PRESETS.map((item) => {
              const isSelected =
                Boolean(data.requiredAmount) && data.requiredAmount === item.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  activeOpacity={0.7}
                  onPress={() => onChange("requiredAmount", item.value)}
                  style={[styles.chip, isSelected && styles.chipActive]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* 2. Vehicle Category & Purpose Card */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons
              name="car-outline"
              size={20}
              color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
            />
            <Text style={styles.cardTitle}>Vehicle Category & Usage</Text>
          </View>
        </View>
        <Text style={styles.cardDescription}>
          Select your automobile category. Select "Others" if your specific requirement is not listed.
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Select Category / Purpose <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownSelector,
              Boolean(data.purpose) && styles.dropdownSelectorActive,
              errors.purpose && styles.inputError,
            ]}
            onPress={() => setIsPurposeModalOpen(true)}
            activeOpacity={0.8}
          >
            <Text
              style={
                data.purpose ? styles.dropdownText : styles.dropdownPlaceholder
              }
            >
              {data.purpose || "Select Vehicle Category / Purpose..."}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={
                data.purpose
                  ? BrandColors.PRIMARY_ORANGE || "#EA580C"
                  : "#64748B"
              }
            />
          </TouchableOpacity>
          {errors.purpose && (
            <Text style={styles.errorText}>{errors.purpose}</Text>
          )}

          {/* Conditional input if Others is selected */}
          {isOthersSelected && (
            <View style={styles.customInputContainer}>
              <Text style={styles.label}>
                Specify Custom Vehicle Purpose <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errors.customPurpose && styles.inputError,
                ]}
                placeholder="Enter custom vehicle purpose"
                placeholderTextColor="#94A3B8"
                value={data.customPurpose || ""}
                onChangeText={(text) => onChange("customPurpose", text)}
              />
              {errors.customPurpose && (
                <Text style={styles.errorText}>{errors.customPurpose}</Text>
              )}
            </View>
          )}
        </View>
      </View>

      {/* 3. Repayment Tenure Card with Dropdown & Extended Options */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons
              name="time-outline"
              size={20}
              color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
            />
            <Text style={styles.cardTitle}>Repayment Tenure</Text>
          </View>
        </View>
        <Text style={styles.cardDescription}>
          Select your intended loan tenure. Choose from short-term (below 1 year) to long-term (up to 7 years) or specify custom months.
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Select Tenure <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownSelector,
              Boolean(data.preferredTenureMonths) && styles.dropdownSelectorActive,
              errors.preferredTenureMonths && styles.inputError,
            ]}
            onPress={() => setIsTenureModalOpen(true)}
            activeOpacity={0.8}
          >
            <Text
              style={
                data.preferredTenureMonths
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {getTenureLabel(data.preferredTenureMonths)}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={
                data.preferredTenureMonths
                  ? BrandColors.PRIMARY_ORANGE || "#EA580C"
                  : "#64748B"
              }
            />
          </TouchableOpacity>
          {errors.preferredTenureMonths && (
            <Text style={styles.errorText}>{errors.preferredTenureMonths}</Text>
          )}

          {/* Quick preset chips */}
          <View style={[styles.chipRow, { marginTop: 10 }]}>
            {[
              { label: "6 M", value: "6" },
              { label: "1 Yr", value: "12" },
              { label: "2 Yrs", value: "24" },
              { label: "3 Yrs", value: "36" },
              { label: "5 Yrs", value: "60" },
              { label: "7 Yrs", value: "84" },
            ].map((item) => {
              const isSelected = data.preferredTenureMonths === item.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  activeOpacity={0.7}
                  onPress={() => handleSelectTenure(item.value)}
                  style={[styles.chip, isSelected && styles.chipActive]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom Tenure Months input if Other selected */}
          {isCustomTenure && (
            <View style={styles.customInputContainer}>
              <Text style={styles.label}>
                Specify Custom Tenure (in Months) <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errors.preferredTenureMonths && styles.inputError,
                ]}
                placeholder="Enter tenure in months (e.g. 15)"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={data.preferredTenureMonths || ""}
                onChangeText={(text) => onChange("preferredTenureMonths", text)}
              />
            </View>
          )}
        </View>
      </View>

      {/* 4. Vehicle Details & Valuation Card */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons
              name="speedometer-outline"
              size={20}
              color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
            />
            <Text style={styles.cardTitle}>Vehicle Details & Valuation</Text>
          </View>
        </View>
        <Text style={styles.cardDescription}>
          Vehicle condition, model selection, estimated on-road price, and margin contribution.
        </Text>

        {/* Vehicle Condition */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Vehicle Condition <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View style={styles.conditionRow}>
            {VEHICLE_CONDITIONS.map((cond) => {
              const isSelected = data.vehicleCondition === cond;
              return (
                <TouchableOpacity
                  key={cond}
                  activeOpacity={0.7}
                  onPress={() => onChange("vehicleCondition", cond)}
                  style={[
                    styles.conditionPill,
                    isSelected && styles.conditionPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.conditionPillText,
                      isSelected && styles.conditionPillTextActive,
                    ]}
                  >
                    {cond}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.vehicleCondition && (
            <Text style={styles.errorText}>{errors.vehicleCondition}</Text>
          )}
        </View>

        {/* Make & Model Dropdown with Custom option */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Vehicle Make & Model <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownSelector,
              Boolean(data.vehicleMakeModel) && styles.dropdownSelectorActive,
              errors.vehicleMakeModel && styles.inputError,
            ]}
            onPress={() => setIsModelModalOpen(true)}
            activeOpacity={0.8}
          >
            <Text
              style={
                data.vehicleMakeModel
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {data.vehicleMakeModel || "Select Vehicle Make & Model..."}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={
                data.vehicleMakeModel
                  ? BrandColors.PRIMARY_ORANGE || "#EA580C"
                  : "#64748B"
              }
            />
          </TouchableOpacity>
          {errors.vehicleMakeModel && (
            <Text style={styles.errorText}>{errors.vehicleMakeModel}</Text>
          )}

          {/* Conditional input if Other Model is chosen */}
          {isCustomModel && (
            <View style={styles.customInputContainer}>
              <Text style={styles.label}>
                Specify Custom Make & Model <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errors.vehicleMakeModel && styles.inputError,
                ]}
                placeholder="Enter custom make & model (e.g. Skoda Kushaq Style)"
                placeholderTextColor="#94A3B8"
                value={data.vehicleMakeModel || ""}
                onChangeText={(text) => onChange("vehicleMakeModel", text)}
              />
            </View>
          )}
        </View>

        {/* Estimated On-Road Price */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Estimated On-Road Price / Valuation (₹) <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.onRoadPrice && styles.inputError]}
            placeholder="Enter total on-road price / valuation (₹)"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={data.onRoadPrice || ""}
            onChangeText={(text) => onChange("onRoadPrice", text)}
          />
          {errors.onRoadPrice && (
            <Text style={styles.errorText}>{errors.onRoadPrice}</Text>
          )}
        </View>

        {/* Expected Down Payment */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Expected Down Payment / Margin Money (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter expected down payment / margin amount (₹)"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={data.downPayment || ""}
            onChangeText={(text) => onChange("downPayment", text)}
          />
        </View>

        {/* If Used / Pre-Owned: Reg Number & Manufacturing Year */}
        {isUsedVehicle && (
          <>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Vehicle Registration Number (RTO)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter registration number (e.g. MH02AB1234)"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                value={data.registrationNumber || ""}
                onChangeText={(text) =>
                  onChange("registrationNumber", text.toUpperCase())
                }
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Manufacturing / Registration Year</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter manufacturing year (e.g. 2021)"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                maxLength={4}
                value={data.registrationYear || ""}
                onChangeText={(text) => onChange("registrationYear", text)}
              />
            </View>
          </>
        )}
      </View>

      {/* Dropdown Modal for Purpose */}
      <Modal
        visible={isPurposeModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPurposeModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsPurposeModalOpen(false)}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Select Vehicle Category / Purpose</Text>
              <TouchableOpacity onPress={() => setIsPurposeModalOpen(false)}>
                <Ionicons name="close-circle" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {VEHICLE_PURPOSES.map((purpose) => {
                const isSelected = data.purpose === purpose;
                return (
                  <TouchableOpacity
                    key={purpose}
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemActive,
                    ]}
                    onPress={() => handleSelectPurpose(purpose)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextActive,
                      ]}
                    >
                      {purpose}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Dropdown Modal for Repayment Tenure */}
      <Modal
        visible={isTenureModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsTenureModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsTenureModalOpen(false)}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Select Repayment Tenure</Text>
              <TouchableOpacity onPress={() => setIsTenureModalOpen(false)}>
                <Ionicons name="close-circle" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Below 1 Year Header */}
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: "#64748B",
                  marginTop: 8,
                  marginBottom: 4,
                  textTransform: "uppercase",
                }}
              >
                Below 1 Year (Short Term)
              </Text>
              {TENURE_OPTIONS.filter((t) => ["3", "6", "9"].includes(t.value)).map(
                (item) => {
                  const isSelected = data.preferredTenureMonths === item.value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.optionItem,
                        isSelected && styles.optionItemActive,
                      ]}
                      onPress={() => handleSelectTenure(item.value)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                      {isSelected && (
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
                        />
                      )}
                    </TouchableOpacity>
                  );
                }
              )}

              {/* 1 Year and Above Header */}
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: "#64748B",
                  marginTop: 14,
                  marginBottom: 4,
                  textTransform: "uppercase",
                }}
              >
                1 Year & Above
              </Text>
              {TENURE_OPTIONS.filter(
                (t) => !["3", "6", "9"].includes(t.value)
              ).map((item) => {
                const isSelected =
                  item.value === "Other"
                    ? isCustomTenure
                    : data.preferredTenureMonths === item.value;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemActive,
                    ]}
                    onPress={() => handleSelectTenure(item.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Dropdown Modal for Vehicle Make & Model */}
      <Modal
        visible={isModelModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModelModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModelModalOpen(false)}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Select Vehicle Make & Model</Text>
              <TouchableOpacity onPress={() => setIsModelModalOpen(false)}>
                <Ionicons name="close-circle" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {VEHICLE_MODELS.map((model) => {
                const isSelected =
                  model.startsWith("Other")
                    ? isCustomModel
                    : data.vehicleMakeModel === model;
                return (
                  <TouchableOpacity
                    key={model}
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemActive,
                    ]}
                    onPress={() => handleSelectModel(model)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextActive,
                      ]}
                    >
                      {model}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={BrandColors.PRIMARY_ORANGE || "#EA580C"}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default VehicleLoanFinancialsStep;
