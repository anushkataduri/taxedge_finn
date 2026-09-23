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
import { LoanOwnershipFormData } from "../../../types/loans.types";
import { styles } from "./PropertyLoanOwnershipStep.styles";

export interface PropertyLoanOwnershipStepProps {
  data: LoanOwnershipFormData;
  onChange: (field: keyof LoanOwnershipFormData, value: any) => void;
  errors?: Record<string, string>;
}

const RELATIONSHIPS = [
  "Spouse",
  "Father",
  "Mother",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Partner / Business Associate",
];

const LENDERS = [
  "HDFC Bank",
  "ICICI Bank",
  "State Bank of India (SBI)",
  "Axis Bank",
  "Bajaj Housing Finance",
  "LIC Housing Finance",
  "L&T Housing Finance",
  "Tata Capital",
  "Other Bank / NBFC",
];

const EXISTING_LOAN_TYPES = [
  "Home Loan",
  "Loan Against Property (LAP)",
  "Commercial Purchase Loan",
  "Top-up Loan",
];

type DropdownKey = "coOwnerRelationship" | "currentLender" | "existingLoanType";

export const PropertyLoanOwnershipStep: React.FC<PropertyLoanOwnershipStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const [activePicker, setActivePicker] = useState<DropdownKey | null>(null);

  const getPickerOptions = (): string[] => {
    switch (activePicker) {
      case "coOwnerRelationship":
        return RELATIONSHIPS;
      case "currentLender":
        return LENDERS;
      case "existingLoanType":
        return EXISTING_LOAN_TYPES;
      default:
        return [];
    }
  };

  const getPickerTitle = (): string => {
    switch (activePicker) {
      case "coOwnerRelationship":
        return "Select Relationship";
      case "currentLender":
        return "Select Lender";
      case "existingLoanType":
        return "Select Existing Loan Type";
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
      {/* 1. Ownership Details */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ownership Details</Text>
        <Text style={styles.sectionSubtitle}>
          Tell us about the ownership of the property.
        </Text>

        {/* Ownership Type Selection Cards */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Ownership Type <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View style={styles.radioRow}>
            {/* Sole Ownership */}
            <TouchableOpacity
              style={[
                styles.radioCard,
                data.ownershipType === "Sole Ownership"
                  ? styles.radioCardSelected
                  : null,
                errors.ownershipType ? styles.inputError : null,
              ]}
              onPress={() => onChange("ownershipType", "Sole Ownership")}
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  data.ownershipType === "Sole Ownership"
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={20}
                color={
                  data.ownershipType === "Sole Ownership"
                    ? BrandColors.PRIMARY_ORANGE
                    : "#64748B"
                }
              />
              <Text style={styles.radioText}>Sole Ownership</Text>
            </TouchableOpacity>

            {/* Joint Ownership */}
            <TouchableOpacity
              style={[
                styles.radioCard,
                data.ownershipType === "Joint Ownership"
                  ? styles.radioCardSelected
                  : null,
                errors.ownershipType ? styles.inputError : null,
              ]}
              onPress={() => onChange("ownershipType", "Joint Ownership")}
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  data.ownershipType === "Joint Ownership"
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={20}
                color={
                  data.ownershipType === "Joint Ownership"
                    ? BrandColors.PRIMARY_ORANGE
                    : "#64748B"
                }
              />
              <Text style={styles.radioText}>Joint Ownership</Text>
            </TouchableOpacity>
          </View>
          {errors.ownershipType ? (
            <Text style={styles.errorText}>{errors.ownershipType}</Text>
          ) : null}
        </View>
      </View>

      {/* 2. Co-owner Details (If Joint Ownership) */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Co-owner Details (If Joint Ownership)
        </Text>
        <Text style={styles.sectionSubtitle}>
          Provide details of the co-owner / co-applicant.
        </Text>

        {/* Co-owner Full Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Co-owner Full Name {data.ownershipType === "Joint Ownership" && <Text style={styles.requiredStar}>*</Text>}
          </Text>
          <View
            style={[
              styles.inputWithIcon,
              errors.coOwnerFullName ? styles.inputError : null,
            ]}
          >
            <View style={styles.iconBoxLeft}>
              <Ionicons name="person-outline" size={18} color="#64748B" />
            </View>
            <TextInput
              style={styles.inputFlex}
              placeholder="Enter co-owner name"
              placeholderTextColor="#94A3B8"
              value={data.coOwnerFullName}
              onChangeText={(text) => onChange("coOwnerFullName", text)}
            />
          </View>
          {errors.coOwnerFullName ? (
            <Text style={styles.errorText}>{errors.coOwnerFullName}</Text>
          ) : null}
        </View>

        {/* Relationship with Applicant */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Relationship with Applicant {data.ownershipType === "Joint Ownership" && <Text style={styles.requiredStar}>*</Text>}
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownBoxWithIcon,
              errors.coOwnerRelationship ? styles.inputError : null,
            ]}
            onPress={() => setActivePicker("coOwnerRelationship")}
            activeOpacity={0.7}
          >
            <View style={styles.iconBoxLeft}>
              <Ionicons name="people-outline" size={18} color="#64748B" />
            </View>
            <View style={styles.dropdownTextContent}>
              <Text
                style={
                  data.coOwnerRelationship
                    ? styles.dropdownText
                    : styles.dropdownPlaceholder
                }
              >
                {data.coOwnerRelationship || "Select relationship"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#64748B" />
            </View>
          </TouchableOpacity>
          {errors.coOwnerRelationship ? (
            <Text style={styles.errorText}>{errors.coOwnerRelationship}</Text>
          ) : null}
        </View>

        {/* Co-owner PAN */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Co-owner PAN {data.ownershipType === "Joint Ownership" && <Text style={styles.requiredStar}>*</Text>}
          </Text>
          <View
            style={[
              styles.inputWithIcon,
              errors.coOwnerPan ? styles.inputError : null,
            ]}
          >
            <View style={styles.iconBoxLeft}>
              <Ionicons name="card-outline" size={18} color="#64748B" />
            </View>
            <TextInput
              style={styles.inputFlex}
              placeholder="Enter PAN (e.g. ABCDE1234F)"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
              maxLength={10}
              value={data.coOwnerPan}
              onChangeText={(text) => onChange("coOwnerPan", text.toUpperCase())}
            />
          </View>
          {errors.coOwnerPan ? (
            <Text style={styles.errorText}>{errors.coOwnerPan}</Text>
          ) : null}
        </View>

        {/* Co-owner Mobile Number */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Co-owner Mobile Number {data.ownershipType === "Joint Ownership" && <Text style={styles.requiredStar}>*</Text>}
          </Text>
          <View
            style={[
              styles.inputWithIcon,
              errors.coOwnerMobile ? styles.inputError : null,
            ]}
          >
            <View style={styles.iconBoxLeft}>
              <Ionicons name="call-outline" size={18} color="#64748B" />
            </View>
            <View
              style={[
                styles.iconBoxLeft,
                { borderRightWidth: 1, backgroundColor: "#F8FAFC" },
              ]}
            >
              <Text style={styles.prefixText}>+91</Text>
            </View>
            <TextInput
              style={styles.inputFlex}
              placeholder="Enter mobile number"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              maxLength={10}
              value={data.coOwnerMobile}
              onChangeText={(text) =>
                onChange("coOwnerMobile", text.replace(/\D/g, ""))
              }
            />
          </View>
          {errors.coOwnerMobile ? (
            <Text style={styles.errorText}>{errors.coOwnerMobile}</Text>
          ) : null}
        </View>
      </View>

      {/* 3. Existing Property Loan (If any) */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Existing Property Loan (If any)</Text>
        <Text style={styles.sectionSubtitle}>
          Tell us if there is an existing loan on this property.
        </Text>

        {/* Current Lender */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Current Lender</Text>
          <TouchableOpacity
            style={styles.dropdownBoxWithIcon}
            onPress={() => setActivePicker("currentLender")}
            activeOpacity={0.7}
          >
            <View style={styles.iconBoxLeft}>
              <Ionicons name="business-outline" size={18} color="#64748B" />
            </View>
            <View style={styles.dropdownTextContent}>
              <Text
                style={
                  data.currentLender
                    ? styles.dropdownText
                    : styles.dropdownPlaceholder
                }
              >
                {data.currentLender || "Select lender"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#64748B" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Existing Loan Type */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Existing Loan Type</Text>
          <TouchableOpacity
            style={styles.dropdownBoxWithIcon}
            onPress={() => setActivePicker("existingLoanType")}
            activeOpacity={0.7}
          >
            <View style={styles.iconBoxLeft}>
              <Ionicons name="document-text-outline" size={18} color="#64748B" />
            </View>
            <View style={styles.dropdownTextContent}>
              <Text
                style={
                  data.existingLoanType
                    ? styles.dropdownText
                    : styles.dropdownPlaceholder
                }
              >
                {data.existingLoanType || "Select loan type"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#64748B" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Outstanding Loan Amount */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Outstanding Loan Amount</Text>
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
              placeholder="Enter outstanding amount"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              value={data.outstandingLoanAmount}
              onChangeText={(text) =>
                onChange("outstandingLoanAmount", text.replace(/\D/g, ""))
              }
            />
          </View>
        </View>
      </View>

      {/* 4. Ownership Confirmation */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ownership Confirmation</Text>
        <Text style={styles.sectionSubtitle}>
          Please confirm the following.
        </Text>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() =>
            onChange("isConfirmationChecked", !data.isConfirmationChecked)
          }
          activeOpacity={0.7}
        >
          <Ionicons
            name={
              data.isConfirmationChecked ? "checkbox" : "square-outline"
            }
            size={22}
            color={
              data.isConfirmationChecked
                ? BrandColors.PRIMARY_ORANGE
                : errors.isConfirmationChecked
                ? "#EF4444"
                : "#94A3B8"
            }
          />
          <Text style={styles.checkboxText}>
            I/We confirm that the property details provided above are correct
            and I/We have the legal right to offer this property as security for
            the loan.
          </Text>
        </TouchableOpacity>
        {errors.isConfirmationChecked ? (
          <Text style={styles.errorText}>{errors.isConfirmationChecked}</Text>
        ) : null}
      </View>

      {/* Selection Modal */}
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

export default PropertyLoanOwnershipStep;
