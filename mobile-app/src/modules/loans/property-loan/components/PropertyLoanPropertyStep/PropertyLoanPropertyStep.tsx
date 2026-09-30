import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { LoanPropertyFormData } from "../../../types/loans.types";
import { styles } from "./PropertyLoanPropertyStep.styles";
import {
  PropertyLocationCard,
  PropertyDropdownKey,
} from "./PropertyLocationCard";
import { PropertyLoanDropdownModal } from "../PropertyLoanDropdownModal";

export interface PropertyLoanPropertyStepProps {
  data: LoanPropertyFormData;
  onChange: (field: keyof LoanPropertyFormData, value: string) => void;
  errors?: Record<string, string>;
}

const STATES = [
  "Telangana",
  "Andhra Pradesh",
  "Karnataka",
  "Tamil Nadu",
  "Maharashtra",
  "Delhi NCR",
  "Gujarat",
  "West Bengal",
  "Kerala",
  "Rajasthan",
  "Uttar Pradesh",
];

const PROPERTY_TYPES = [
  "Residential",
  "Commercial",
  "Industrial",
  "Plot / Open Land",
];

const PROPERTY_SUB_TYPES = [
  "Residential Apartment / Flat",
  "Independent House / Villa",
  "Commercial Office Space",
  "Commercial Shop / Showroom",
  "Industrial Warehouse / Factory",
  "Open Plot / Land",
];

const CONSTRUCTION_STATUSES = [
  "Ready to Move",
  "Under Construction",
  "Vacant Plot / Land",
];

const CURRENT_USAGES = ["Self Occupied", "Rented Out / Leased", "Vacant"];

const AREA_TYPES = [
  "Built-up Area",
  "Carpet Area",
  "Plot Area",
  "Super Built-up Area",
];

const PROPERTY_AGES = [
  "New Construction (< 1 Year)",
  "1 - 5 Years",
  "5 - 10 Years",
  "10 - 20 Years",
  "20+ Years",
];

const APPROVING_AUTHORITIES = [
  "Municipal Corporation (GHMC/HMDA/etc.)",
  "Gram Panchayat",
  "DTCP / Urban Development Authority",
  "Unapproved / Others",
];

export const PropertyLoanPropertyStep: React.FC<PropertyLoanPropertyStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const [activePicker, setActivePicker] = useState<PropertyDropdownKey | null>(null);

  const getPickerOptions = (): string[] => {
    switch (activePicker) {
      case "state":
        return STATES;
      case "propertyType":
        return PROPERTY_TYPES;
      case "propertySubType":
        return PROPERTY_SUB_TYPES;
      case "constructionStatus":
        return CONSTRUCTION_STATUSES;
      case "currentUsage":
        return CURRENT_USAGES;
      case "areaType":
        return AREA_TYPES;
      case "propertyAge":
        return PROPERTY_AGES;
      case "approvingAuthority":
        return APPROVING_AUTHORITIES;
      default:
        return [];
    }
  };

  const getPickerTitle = (): string => {
    switch (activePicker) {
      case "state":
        return "Select State";
      case "propertyType":
        return "Select Property Type";
      case "propertySubType":
        return "Select Property Sub-Type";
      case "constructionStatus":
        return "Select Construction Status";
      case "currentUsage":
        return "Select Current Usage";
      case "areaType":
        return "Select Area Type";
      case "propertyAge":
        return "Select Property Age";
      case "approvingAuthority":
        return "Select Approving Authority";
      default:
        return "Select Option";
    }
  };

  const handleSelectOption = (value: string) => {
    if (activePicker) {
      onChange(activePicker, value);
    }
    setActivePicker(null);
  };

  return (
    <View style={styles.container}>
      {/* 1. Property Location */}
      <PropertyLocationCard
        data={data}
        onChange={onChange}
        onOpenPicker={(key) => setActivePicker(key)}
        errors={errors}
      />

      {/* 2. Property Type & Usage */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Property Type & Usage</Text>
        <Text style={styles.sectionSubtitle}>
          Specify the characteristics of the property.
        </Text>

        {/* Property Type Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Property Type <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownSelector,
              Boolean(data.propertyType) && styles.dropdownSelectorActive,
              errors.propertyType ? styles.inputError : null,
            ]}
            onPress={() => setActivePicker("propertyType")}
            activeOpacity={0.8}
          >
            <Text
              style={
                data.propertyType
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {data.propertyType || "Select property type..."}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={data.propertyType ? BrandColors.PRIMARY_ORANGE : "#64748B"}
            />
          </TouchableOpacity>
          {errors.propertyType ? (
            <Text style={styles.errorText}>{errors.propertyType}</Text>
          ) : null}
        </View>

        {/* Property Sub-Type Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Property Sub-Type <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownSelector,
              Boolean(data.propertySubType) && styles.dropdownSelectorActive,
              errors.propertySubType ? styles.inputError : null,
            ]}
            onPress={() => setActivePicker("propertySubType")}
            activeOpacity={0.8}
          >
            <Text
              style={
                data.propertySubType
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {data.propertySubType || "Select property sub-type..."}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={
                data.propertySubType ? BrandColors.PRIMARY_ORANGE : "#64748B"
              }
            />
          </TouchableOpacity>
          {errors.propertySubType ? (
            <Text style={styles.errorText}>{errors.propertySubType}</Text>
          ) : null}
        </View>

        {/* Construction Status Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Construction Status <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownSelector,
              Boolean(data.constructionStatus) && styles.dropdownSelectorActive,
              errors.constructionStatus ? styles.inputError : null,
            ]}
            onPress={() => setActivePicker("constructionStatus")}
            activeOpacity={0.8}
          >
            <Text
              style={
                data.constructionStatus
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {data.constructionStatus || "Select construction status..."}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={
                data.constructionStatus
                  ? BrandColors.PRIMARY_ORANGE
                  : "#64748B"
              }
            />
          </TouchableOpacity>
          {errors.constructionStatus ? (
            <Text style={styles.errorText}>{errors.constructionStatus}</Text>
          ) : null}
        </View>

        {/* Current Usage Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Current Usage <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownSelector,
              Boolean(data.currentUsage) && styles.dropdownSelectorActive,
              errors.currentUsage ? styles.inputError : null,
            ]}
            onPress={() => setActivePicker("currentUsage")}
            activeOpacity={0.8}
          >
            <Text
              style={
                data.currentUsage
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {data.currentUsage || "Select current usage..."}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={
                data.currentUsage ? BrandColors.PRIMARY_ORANGE : "#64748B"
              }
            />
          </TouchableOpacity>
          {errors.currentUsage ? (
            <Text style={styles.errorText}>{errors.currentUsage}</Text>
          ) : null}
        </View>

        {/* Area Type Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Area Type <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownSelector,
              Boolean(data.areaType) && styles.dropdownSelectorActive,
              errors.areaType ? styles.inputError : null,
            ]}
            onPress={() => setActivePicker("areaType")}
            activeOpacity={0.8}
          >
            <Text
              style={
                data.areaType
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {data.areaType || "Select area type..."}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={data.areaType ? BrandColors.PRIMARY_ORANGE : "#64748B"}
            />
          </TouchableOpacity>
          {errors.areaType ? (
            <Text style={styles.errorText}>{errors.areaType}</Text>
          ) : null}
        </View>

        {/* Area Input with sq. ft. suffix */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Area <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View
            style={[
              styles.inputWithIcon,
              errors.area ? styles.inputError : null,
            ]}
          >
            <View style={styles.iconBoxLeft}>
              <Ionicons name="resize-outline" size={18} color="#64748B" />
            </View>
            <TextInput
              style={styles.inputFlex}
              placeholder="Enter area"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              value={data.area}
              onChangeText={(text) => onChange("area", text.replace(/\D/g, ""))}
            />
            <View style={styles.suffixBox}>
              <Text style={styles.suffixText}>sq. ft.</Text>
            </View>
          </View>
          {errors.area ? (
            <Text style={styles.errorText}>{errors.area}</Text>
          ) : null}
        </View>

        {/* Property Age Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Property Age <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownSelector,
              Boolean(data.propertyAge) && styles.dropdownSelectorActive,
              errors.propertyAge ? styles.inputError : null,
            ]}
            onPress={() => setActivePicker("propertyAge")}
            activeOpacity={0.8}
          >
            <Text
              style={
                data.propertyAge
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {data.propertyAge || "Select property age..."}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={
                data.propertyAge ? BrandColors.PRIMARY_ORANGE : "#64748B"
              }
            />
          </TouchableOpacity>
          {errors.propertyAge ? (
            <Text style={styles.errorText}>{errors.propertyAge}</Text>
          ) : null}
        </View>

        {/* Approving Authority Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Approving Authority <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownSelector,
              Boolean(data.approvingAuthority) && styles.dropdownSelectorActive,
              errors.approvingAuthority ? styles.inputError : null,
            ]}
            onPress={() => setActivePicker("approvingAuthority")}
            activeOpacity={0.8}
          >
            <Text
              style={
                data.approvingAuthority
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {data.approvingAuthority || "Select approving authority..."}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={
                data.approvingAuthority
                  ? BrandColors.PRIMARY_ORANGE
                  : "#64748B"
              }
            />
          </TouchableOpacity>
          {errors.approvingAuthority ? (
            <Text style={styles.errorText}>{errors.approvingAuthority}</Text>
          ) : null}
        </View>
      </View>

      {/* 3. Property Value */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Property Value</Text>
        <Text style={styles.sectionSubtitle}>
          Enter the estimated value of the property.
        </Text>

        {/* Estimated Market Value */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Estimated Market Value <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View
            style={[
              styles.inputWithIcon,
              errors.estimatedMarketValue ? styles.inputError : null,
            ]}
          >
            <View style={styles.iconBoxLeft}>
              <Text style={styles.currencySymbolText}>
                ₹
              </Text>
            </View>
            <TextInput
              style={styles.inputFlex}
              placeholder="Enter estimated market value"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              value={data.estimatedMarketValue}
              onChangeText={(text) =>
                onChange("estimatedMarketValue", text.replace(/\D/g, ""))
              }
            />
          </View>
          {errors.estimatedMarketValue ? (
            <Text style={styles.errorText}>{errors.estimatedMarketValue}</Text>
          ) : null}
          <View style={styles.helperTextRow}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#64748B"
            />
            <Text style={styles.helperText}>
              The lender confirms this through a technical valuation visit.
            </Text>
          </View>
        </View>
      </View>

      {/* Modal Selection */}
      <PropertyLoanDropdownModal
        visible={activePicker !== null}
        title={getPickerTitle()}
        options={getPickerOptions()}
        selectedValue={activePicker ? data[activePicker] : undefined}
        onSelect={handleSelectOption}
        onClose={() => setActivePicker(null)}
      />
    </View>
  );
};

export default PropertyLoanPropertyStep;
