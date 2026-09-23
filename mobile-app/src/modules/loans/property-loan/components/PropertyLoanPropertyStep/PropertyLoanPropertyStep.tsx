import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import { LoanPropertyFormData } from "../../../types/loans.types";
import { styles } from "./PropertyLoanPropertyStep.styles";

export interface PropertyLoanPropertyStepProps {
  data: LoanPropertyFormData;
  onChange: (field: keyof LoanPropertyFormData, value: any) => void;
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

type DropdownKey =
  | "state"
  | "propertyType"
  | "propertySubType"
  | "constructionStatus"
  | "currentUsage"
  | "areaType"
  | "propertyAge"
  | "approvingAuthority";

export const PropertyLoanPropertyStep: React.FC<PropertyLoanPropertyStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const [activePicker, setActivePicker] = useState<DropdownKey | null>(null);

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
        return "Select Property Sub-type";
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

  const handleFetchPincodeDetails = () => {
    if (data.pincode && data.pincode.length === 6) {
      // Mock fetch details for Telangana/Hyderabad or default
      if (data.pincode.startsWith("50")) {
        onChange("city", "Hyderabad");
        onChange("district", "Hyderabad");
        onChange("state", "Telangana");
      } else if (data.pincode.startsWith("52")) {
        onChange("city", "Vijayawada");
        onChange("district", "Krishna");
        onChange("state", "Andhra Pradesh");
      } else {
        onChange("city", "Bangalore");
        onChange("district", "Bangalore Urban");
        onChange("state", "Karnataka");
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Property Location */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Property Location</Text>
        <Text style={styles.sectionSubtitle}>
          Tell us where the property is located.
        </Text>

        {/* PIN Code with Fetch Details */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>
              PIN Code <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TouchableOpacity onPress={handleFetchPincodeDetails} activeOpacity={0.7}>
              <Text style={styles.fetchDetailsText}>Fetch Details</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputWithIcon}>
            <View style={styles.iconBoxLeft}>
              <Ionicons name="location-outline" size={18} color="#64748B" />
            </View>
            <TextInput
              style={styles.inputFlex}
              placeholder="Enter PIN code"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              maxLength={6}
              value={data.pincode}
              onChangeText={(text) => onChange("pincode", text.replace(/\D/g, ""))}
            />
          </View>
        </View>

        {/* City */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            City <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View style={styles.inputWithIcon}>
            <View style={styles.iconBoxLeft}>
              <Ionicons name="business-outline" size={18} color="#64748B" />
            </View>
            <TextInput
              style={styles.inputFlex}
              placeholder="Enter city"
              placeholderTextColor="#94A3B8"
              value={data.city}
              onChangeText={(text) => onChange("city", text)}
            />
          </View>
        </View>

        {/* District */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            District <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View style={styles.inputWithIcon}>
            <View style={styles.iconBoxLeft}>
              <Ionicons name="business-outline" size={18} color="#64748B" />
            </View>
            <TextInput
              style={styles.inputFlex}
              placeholder="Enter district"
              placeholderTextColor="#94A3B8"
              value={data.district}
              onChangeText={(text) => onChange("district", text)}
            />
          </View>
        </View>

        {/* State Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            State <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dropdownBoxWithIcon}
            onPress={() => setActivePicker("state")}
            activeOpacity={0.7}
          >
            <View style={styles.iconBoxLeft}>
              <Ionicons name="map-outline" size={18} color="#64748B" />
            </View>
            <View style={styles.dropdownTextContent}>
              <Text
                style={
                  data.state ? styles.dropdownText : styles.dropdownPlaceholder
                }
              >
                {data.state || "Select state"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#64748B" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Property Address */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Property Address <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View style={styles.inputWithIcon}>
            <View style={styles.iconBoxLeft}>
              <Ionicons name="home-outline" size={18} color="#64748B" />
            </View>
            <TextInput
              style={[styles.inputFlex, styles.multilineInput]}
              placeholder="Enter complete property address"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              value={data.propertyAddress}
              onChangeText={(text) => onChange("propertyAddress", text)}
            />
          </View>
        </View>

        {/* Landmark (Optional) */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Landmark (Optional)</Text>
          <View style={styles.inputWithIcon}>
            <View style={styles.iconBoxLeft}>
              <Ionicons name="location-outline" size={18} color="#64748B" />
            </View>
            <TextInput
              style={styles.inputFlex}
              placeholder="Enter landmark"
              placeholderTextColor="#94A3B8"
              value={data.landmark}
              onChangeText={(text) => onChange("landmark", text)}
            />
          </View>
        </View>
      </View>

      {/* 2. Property Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Property Information</Text>
        <Text style={styles.sectionSubtitle}>
          Tell us more about the property.
        </Text>

        {/* Property Type Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Property Type <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dropdownBoxWithIcon}
            onPress={() => setActivePicker("propertyType")}
            activeOpacity={0.7}
          >
            <View style={styles.iconBoxLeft}>
              <Ionicons name="home-outline" size={18} color="#64748B" />
            </View>
            <View style={styles.dropdownTextContent}>
              <Text
                style={
                  data.propertyType
                    ? styles.dropdownText
                    : styles.dropdownPlaceholder
                }
              >
                {data.propertyType || "Select property type"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#64748B" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Property Sub-type Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Property Sub-type <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dropdownBoxWithIcon}
            onPress={() => setActivePicker("propertySubType")}
            activeOpacity={0.7}
          >
            <View style={styles.iconBoxLeft}>
              <Ionicons name="grid-outline" size={18} color="#64748B" />
            </View>
            <View style={styles.dropdownTextContent}>
              <Text
                style={
                  data.propertySubType
                    ? styles.dropdownText
                    : styles.dropdownPlaceholder
                }
              >
                {data.propertySubType || "Select property sub-type"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#64748B" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Construction Status Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Construction Status <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dropdownBoxWithIcon}
            onPress={() => setActivePicker("constructionStatus")}
            activeOpacity={0.7}
          >
            <View style={styles.iconBoxLeft}>
              <Ionicons name="construct-outline" size={18} color="#64748B" />
            </View>
            <View style={styles.dropdownTextContent}>
              <Text
                style={
                  data.constructionStatus
                    ? styles.dropdownText
                    : styles.dropdownPlaceholder
                }
              >
                {data.constructionStatus || "Select construction status"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#64748B" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Current Usage Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Current Usage <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dropdownBoxWithIcon}
            onPress={() => setActivePicker("currentUsage")}
            activeOpacity={0.7}
          >
            <View style={styles.iconBoxLeft}>
              <Ionicons name="cog-outline" size={18} color="#64748B" />
            </View>
            <View style={styles.dropdownTextContent}>
              <Text
                style={
                  data.currentUsage
                    ? styles.dropdownText
                    : styles.dropdownPlaceholder
                }
              >
                {data.currentUsage || "Select current usage"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#64748B" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Area Type Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Area Type <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dropdownBoxWithIcon}
            onPress={() => setActivePicker("areaType")}
            activeOpacity={0.7}
          >
            <View style={styles.iconBoxLeft}>
              <Ionicons name="square-outline" size={18} color="#64748B" />
            </View>
            <View style={styles.dropdownTextContent}>
              <Text
                style={
                  data.areaType
                    ? styles.dropdownText
                    : styles.dropdownPlaceholder
                }
              >
                {data.areaType || "Select area type"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#64748B" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Area Input with sq. ft. suffix */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Area <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View style={styles.inputWithIcon}>
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
        </View>

        {/* Property Age Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Property Age <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dropdownBoxWithIcon}
            onPress={() => setActivePicker("propertyAge")}
            activeOpacity={0.7}
          >
            <View style={styles.iconBoxLeft}>
              <Ionicons name="calendar-outline" size={18} color="#64748B" />
            </View>
            <View style={styles.dropdownTextContent}>
              <Text
                style={
                  data.propertyAge
                    ? styles.dropdownText
                    : styles.dropdownPlaceholder
                }
              >
                {data.propertyAge || "Select property age"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#64748B" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Approving Authority Dropdown */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Approving Authority <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dropdownBoxWithIcon}
            onPress={() => setActivePicker("approvingAuthority")}
            activeOpacity={0.7}
          >
            <View style={styles.iconBoxLeft}>
              <Ionicons name="school-outline" size={18} color="#64748B" />
            </View>
            <View style={styles.dropdownTextContent}>
              <Text
                style={
                  data.approvingAuthority
                    ? styles.dropdownText
                    : styles.dropdownPlaceholder
                }
              >
                {data.approvingAuthority || "Select approving authority"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#64748B" />
            </View>
          </TouchableOpacity>
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
          <View style={styles.inputWithIcon}>
            <View style={styles.iconBoxLeft}>
              <Text
                style={{ fontSize: 16, fontWeight: "700", color: "#0F2052" }}
              >
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
      <Modal
        visible={activePicker !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setActivePicker(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActivePicker(null)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{getPickerTitle()}</Text>
              <TouchableOpacity onPress={() => setActivePicker(null)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={getPickerOptions()}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = activePicker ? data[activePicker] === item : false;
                return (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleSelectOption(item)}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        isSelected ? styles.modalItemTextSelected : null,
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={BrandColors.PRIMARY_ORANGE}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PropertyLoanPropertyStep;
