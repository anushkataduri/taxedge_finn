import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { BrandColors } from "../../../../../shared/theme";
import { LoanApplicantFormData } from "../../../types/loans.types";
import { styles } from "./PropertyLoanApplicantStep.styles";

export interface PropertyLoanApplicantStepProps {
  data: LoanApplicantFormData;
  onChange: (field: keyof LoanApplicantFormData, value: any) => void;
  errors?: Record<string, string>;
}

const GENDERS = ["Male", "Female", "Other"];

const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"];

const RESIDENCE_TYPES = [
  "Owned by Self/Spouse",
  "Rented",
  "Owned by Parents",
  "Corporate / Company Provided",
];

const YEARS_AT_ADDRESS = ["< 1 Year", "1-3 Years", "3-5 Years", "5+ Years"];

const EMPLOYER_CATEGORIES = [
  "Salaried - MNC",
  "Salaried - Public Sector",
  "Salaried - Private Ltd",
  "Self-Employed Professional",
  "Business Owner",
];

const TOTAL_EXPERIENCES = [
  "< 1 Year",
  "1-3 Years",
  "3-5 Years",
  "5-10 Years",
  "10+ Years",
];

const YEARS_IN_CURRENT_JOB = ["< 1 Year", "1-3 Years", "3-5 Years", "5+ Years"];

type DropdownKey =
  | "gender"
  | "maritalStatus"
  | "residenceType"
  | "yearsAtCurrentAddress"
  | "employerCategory"
  | "totalWorkExperience"
  | "yearsInCurrentJob";

function formatDateToDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function parseDDMMYYYYToDate(str?: string): Date {
  if (!str) return new Date(1995, 0, 1);
  const parts = str.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  return new Date(1995, 0, 1);
}

export const PropertyLoanApplicantStep: React.FC<PropertyLoanApplicantStepProps> = ({
  data,
  onChange,
  errors = {},
}) => {
  const [activePicker, setActivePicker] = useState<DropdownKey | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(() =>
    parseDDMMYYYYToDate(data.dob)
  );

  const getPickerOptions = (): string[] => {
    switch (activePicker) {
      case "gender":
        return GENDERS;
      case "maritalStatus":
        return MARITAL_STATUSES;
      case "residenceType":
        return RESIDENCE_TYPES;
      case "yearsAtCurrentAddress":
        return YEARS_AT_ADDRESS;
      case "employerCategory":
        return EMPLOYER_CATEGORIES;
      case "totalWorkExperience":
        return TOTAL_EXPERIENCES;
      case "yearsInCurrentJob":
        return YEARS_IN_CURRENT_JOB;
      default:
        return [];
    }
  };

  const getPickerTitle = (): string => {
    switch (activePicker) {
      case "gender":
        return "Select Gender";
      case "maritalStatus":
        return "Select Marital Status";
      case "residenceType":
        return "Select Residence Type";
      case "yearsAtCurrentAddress":
        return "Select Years at Address";
      case "employerCategory":
        return "Select Employer Category";
      case "totalWorkExperience":
        return "Select Total Work Experience";
      case "yearsInCurrentJob":
        return "Select Years in Current Job";
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

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (event.type === "set" && selectedDate) {
        onChange("dob", formatDateToDDMMYYYY(selectedDate));
      }
    } else if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const handleIosDateConfirm = () => {
    setShowDatePicker(false);
    onChange("dob", formatDateToDDMMYYYY(tempDate));
  };

  return (
    <View style={styles.container}>
      {/* 1. Personal Details */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
        <Text style={styles.sectionSubtitle}>Tell us about yourself.</Text>

        {/* Full Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Full Name <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.fullName ? styles.inputError : null]}
            placeholder="Enter full name"
            placeholderTextColor="#94A3B8"
            value={data.fullName}
            onChangeText={(text) => onChange("fullName", text)}
          />
          {errors.fullName ? (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          ) : null}
        </View>

        {/* PAN */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            PAN <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.pan ? styles.inputError : null]}
            placeholder="Enter PAN (e.g. ABCDE1234F)"
            placeholderTextColor="#94A3B8"
            autoCapitalize="characters"
            maxLength={10}
            value={data.pan}
            onChangeText={(text) => onChange("pan", text.toUpperCase())}
          />
          {errors.pan ? (
            <Text style={styles.errorText}>{errors.pan}</Text>
          ) : null}
        </View>

        {/* Mobile Number */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Mobile Number <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View
            style={[
              styles.inputWithPrefix,
              errors.mobile ? styles.inputError : null,
            ]}
          >
            <View style={styles.prefixBox}>
              <Text style={styles.prefixText}>+91</Text>
            </View>
            <TextInput
              style={styles.inputFlex}
              placeholder="Enter mobile number"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              maxLength={10}
              value={data.mobile}
              onChangeText={(text) => onChange("mobile", text.replace(/\D/g, ""))}
            />
          </View>
          {errors.mobile ? (
            <Text style={styles.errorText}>{errors.mobile}</Text>
          ) : null}
        </View>

        {/* Date of Birth */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Date of Birth <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.inputWithIcon,
              errors.dob ? styles.inputError : null,
            ]}
            onPress={() => {
              setTempDate(parseDDMMYYYYToDate(data.dob));
              setShowDatePicker(true);
            }}
            activeOpacity={0.8}
          >
            <TextInput
              style={styles.inputWithIconFlex}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#94A3B8"
              value={data.dob}
              onChangeText={(text) => onChange("dob", text)}
            />
            <TouchableOpacity
              style={{ padding: 4 }}
              onPress={() => {
                setTempDate(parseDDMMYYYYToDate(data.dob));
                setShowDatePicker(true);
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={BrandColors.PRIMARY_ORANGE}
                style={styles.inputIconRight}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          {errors.dob ? (
            <Text style={styles.errorText}>{errors.dob}</Text>
          ) : null}
        </View>

        {/* Current Address */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Current Address <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View
            style={[
              styles.inputWithIcon,
              errors.currentAddress ? styles.inputError : null,
            ]}
          >
            <Ionicons
              name="location-outline"
              size={18}
              color="#64748B"
              style={styles.inputIconLeft}
            />
            <TextInput
              style={styles.inputWithIconFlex}
              placeholder="Enter your current address"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={2}
              value={data.currentAddress}
              onChangeText={(text) => onChange("currentAddress", text)}
            />
          </View>
          {errors.currentAddress ? (
            <Text style={styles.errorText}>{errors.currentAddress}</Text>
          ) : null}
        </View>
      </View>

      {/* 2. Personal Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <Text style={styles.sectionSubtitle}>Help us know you better.</Text>

        {/* Gender */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Gender <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownBox,
              errors.gender ? styles.inputError : null,
            ]}
            onPress={() => setActivePicker("gender")}
            activeOpacity={0.7}
          >
            <Text
              style={
                data.gender
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {data.gender || "Select gender"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
          </TouchableOpacity>
          {errors.gender ? (
            <Text style={styles.errorText}>{errors.gender}</Text>
          ) : null}
        </View>

        {/* Marital Status */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Marital Status <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownBox,
              errors.maritalStatus ? styles.inputError : null,
            ]}
            onPress={() => setActivePicker("maritalStatus")}
            activeOpacity={0.7}
          >
            <Text
              style={
                data.maritalStatus
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {data.maritalStatus || "Select marital status"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
          </TouchableOpacity>
          {errors.maritalStatus ? (
            <Text style={styles.errorText}>{errors.maritalStatus}</Text>
          ) : null}
        </View>

        {/* Residence Type */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Residence Type <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownBox,
              errors.residenceType ? styles.inputError : null,
            ]}
            onPress={() => setActivePicker("residenceType")}
            activeOpacity={0.7}
          >
            <Text
              numberOfLines={1}
              style={
                data.residenceType
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {data.residenceType || "Select residence type"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
          </TouchableOpacity>
          {errors.residenceType ? (
            <Text style={styles.errorText}>{errors.residenceType}</Text>
          ) : null}
        </View>

        {/* Years at Current Address */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Years at Current Address <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownBox,
              errors.yearsAtCurrentAddress ? styles.inputError : null,
            ]}
            onPress={() => setActivePicker("yearsAtCurrentAddress")}
            activeOpacity={0.7}
          >
            <Text
              style={
                data.yearsAtCurrentAddress
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {data.yearsAtCurrentAddress || "Select years"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
          </TouchableOpacity>
          {errors.yearsAtCurrentAddress ? (
            <Text style={styles.errorText}>{errors.yearsAtCurrentAddress}</Text>
          ) : null}
        </View>
      </View>

      {/* 3. Employment Details */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Employment Details</Text>
        <Text style={styles.sectionSubtitle}>
          Tell us about your current employment.
        </Text>

        {/* Employer Category */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Employer Category <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownBox,
              errors.employerCategory ? styles.inputError : null,
            ]}
            onPress={() => setActivePicker("employerCategory")}
            activeOpacity={0.7}
          >
            <Text
              numberOfLines={1}
              style={
                data.employerCategory
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {data.employerCategory || "Select category"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
          </TouchableOpacity>
          {errors.employerCategory ? (
            <Text style={styles.errorText}>{errors.employerCategory}</Text>
          ) : null}
        </View>

        {/* Employer Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Employer Name <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              errors.employerName ? styles.inputError : null,
            ]}
            placeholder="Enter employer name"
            placeholderTextColor="#94A3B8"
            value={data.employerName}
            onChangeText={(text) => onChange("employerName", text)}
          />
          {errors.employerName ? (
            <Text style={styles.errorText}>{errors.employerName}</Text>
          ) : null}
        </View>

        {/* Total Work Experience */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Total Work Experience <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownBox,
              errors.totalWorkExperience ? styles.inputError : null,
            ]}
            onPress={() => setActivePicker("totalWorkExperience")}
            activeOpacity={0.7}
          >
            <Text
              style={
                data.totalWorkExperience
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {data.totalWorkExperience || "Select experience"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
          </TouchableOpacity>
          {errors.totalWorkExperience ? (
            <Text style={styles.errorText}>{errors.totalWorkExperience}</Text>
          ) : null}
        </View>

        {/* Years in Current Job */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Years in Current Job <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.dropdownBox,
              errors.yearsInCurrentJob ? styles.inputError : null,
            ]}
            onPress={() => setActivePicker("yearsInCurrentJob")}
            activeOpacity={0.7}
          >
            <Text
              style={
                data.yearsInCurrentJob
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {data.yearsInCurrentJob || "Select years"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
          </TouchableOpacity>
          {errors.yearsInCurrentJob ? (
            <Text style={styles.errorText}>{errors.yearsInCurrentJob}</Text>
          ) : null}
        </View>

        {/* Annual Income */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Annual Income <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View
            style={[
              styles.inputWithPrefix,
              errors.annualIncome ? styles.inputError : null,
            ]}
          >
            <View style={styles.prefixBox}>
              <Text style={styles.prefixText}>₹</Text>
            </View>
            <TextInput
              style={styles.inputFlex}
              placeholder="Enter annual income"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              value={data.annualIncome}
              onChangeText={(text) =>
                onChange("annualIncome", text.replace(/\D/g, ""))
              }
            />
          </View>
          {errors.annualIncome ? (
            <Text style={styles.errorText}>{errors.annualIncome}</Text>
          ) : null}
        </View>
      </View>

      {/* 4. Existing Loans & Obligations */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Existing Loans & Obligations</Text>
        <Text style={styles.sectionSubtitle}>
          Tell us about your current loans and other monthly obligations.
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Do you have any existing loans? <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View
            style={[
              styles.toggleContainer,
              errors.hasExistingLoans ? styles.inputError : null,
            ]}
          >
            <TouchableOpacity
              style={[
                styles.toggleButton,
                data.hasExistingLoans === true ? styles.toggleButtonSelected : null,
              ]}
              onPress={() => onChange("hasExistingLoans", true)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.toggleText,
                  data.hasExistingLoans === true ? styles.toggleTextSelected : null,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                data.hasExistingLoans === false ? styles.toggleButtonSelected : null,
              ]}
              onPress={() => onChange("hasExistingLoans", false)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.toggleText,
                  data.hasExistingLoans === false ? styles.toggleTextSelected : null,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
          {errors.hasExistingLoans ? (
            <Text style={styles.errorText}>{errors.hasExistingLoans}</Text>
          ) : null}
        </View>
      </View>

      {/* Dropdown Options Modal */}
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

      {/* Android Native Date Picker */}
      {Platform.OS === "android" && showDatePicker && (
        <DateTimePicker
          value={parseDDMMYYYYToDate(data.dob)}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* iOS Modal Date Picker */}
      {Platform.OS === "ios" && (
        <Modal
          visible={showDatePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { paddingHorizontal: 20 }]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={{ fontSize: 15, color: "#64748B" }}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select Date of Birth</Text>
                <TouchableOpacity onPress={handleIosDateConfirm}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      color: BrandColors.PRIMARY_ORANGE,
                    }}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default PropertyLoanApplicantStep;
