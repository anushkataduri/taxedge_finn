import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../hooks/use-theme";
import { FormInput } from "../FormInput/FormInput";
import { PrimaryButton } from "../PrimaryButton/PrimaryButton";
import { Result } from "../../utils/functional";
import type { ApplicationFormData, FormField } from "../../types/domain";
import { styles } from "./DynamicForm.styles";

/** Validation messages, keyed by `FormField.name`. */
export type FormErrors = Record<string, string>;

export interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (values: ApplicationFormData) => void;
  submitButtonText?: string;
  initialValues?: ApplicationFormData;
}

export function DynamicForm({
  fields,
  onSubmit,
  submitButtonText = "Submit",
  initialValues = {},
}: DynamicFormProps) {
  const colors = useTheme();
  // Track form values and validation errors
  const [formValues, setFormValues] =
    useState<ApplicationFormData>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  // Dropdown modal state
  const [activeDropdownField, setActiveDropdownField] =
    useState<FormField | null>(null);
  const [showDropdownModal, setShowDropdownModal] = useState(false);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [fieldName]: value }));
    errors[fieldName] &&
      setErrors(({ [fieldName]: _omitted, ...rest }) => rest);
  };

  const handleDropdownSelect = (fieldName: string, option: string) => {
    handleInputChange(fieldName, option);
    setShowDropdownModal(false);
    setActiveDropdownField(null);
  };

  const openDropdown = (field: FormField) => {
    setActiveDropdownField(field);
    setShowDropdownModal(true);
  };

  const validateForm = (): Result<ApplicationFormData, FormErrors> => {
    const validationErrors = fields.reduce<FormErrors>((acc, field) => {
      const val = formValues[field.name];
      return field.required && (!val || val.trim() === "")
        ? { ...acc, [field.name]: `${field.label} is required` }
        : acc;
    }, {});

    return Object.keys(validationErrors).length === 0
      ? Result.success<ApplicationFormData, FormErrors>(formValues)
      : Result.failure<FormErrors, ApplicationFormData>(validationErrors);
  };

  const handleFormSubmit = () => {
    validateForm()
      .map((values) => {
        setErrors({});
        onSubmit(values);
        return values;
      })
      .getOrElse((validationErrors: FormErrors | null) => {
        setErrors(validationErrors ?? {});
        Alert.alert("Incomplete Form", "Please fill in all required fields.");
      });
  };

  return (
    <View style={styles.container}>
      {fields.map((field) => {
        const value = formValues[field.name] || "";
        const error = errors[field.name];

        return field.type === "dropdown" ? (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              {field.label}{" "}
              {field.required && (
                <Text style={[styles.requiredAsterisk, { color: colors.error }]}>*</Text>
              )}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => openDropdown(field)}
              style={[
                styles.dropdownBox,
                {
                  backgroundColor: colors.background,
                  borderColor: error ? colors.error : colors.border,
                },
              ]}
            >
              <Text
                style={[styles.dropdownValueText, { color: value ? colors.text : colors.textSecondary }]}
              >
                {value || field.placeholder || "Select option"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
            {error && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {error}
              </Text>
            )}
          </View>
        ) : field.type === "date" ? (
          <FormInput
            key={field.name}
            label={field.label}
            value={value}
            onChangeText={(text) => handleInputChange(field.name, text)}
            placeholder={field.placeholder || "YYYY-MM-DD"}
            required={field.required}
            error={error}
          />
        ) : (
          <FormInput
            key={field.name}
            label={field.label}
            value={value}
            onChangeText={(text) => handleInputChange(field.name, text)}
            placeholder={field.placeholder}
            keyboardType={field.type === "number" ? "numeric" : "default"}
            required={field.required}
            error={error}
          />
        );
      })}

      <PrimaryButton
        title={submitButtonText}
        onPress={handleFormSubmit}
        style={styles.submitBtn}
        colorType="orange"
      />

      {/* Dropdown Options Modal */}
      <Modal
        visible={showDropdownModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdownModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: colors.backgroundElement },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select {activeDropdownField?.label}
            </Text>

            <ScrollView
              style={styles.optionsScroll}
              contentContainerStyle={styles.optionsScrollContent}
            >
              {activeDropdownField?.options?.map((option, idx) => {
                const isSelected =
                  formValues[activeDropdownField.name] === option;
                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.8}
                    onPress={() =>
                      handleDropdownSelect(activeDropdownField.name, option)
                    }
                    style={[
                      styles.optionItem,
                      {
                        backgroundColor: isSelected
                          ? colors.orangeLight
                          : "transparent",
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: isSelected ? colors.orange : colors.text,
                          fontWeight: isSelected ? "700" : "500",
                        },
                      ]}
                    >
                      {option}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={colors.orange}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setShowDropdownModal(false);
                setActiveDropdownField(null);
              }}
              style={[styles.closeBtn, { borderTopColor: colors.border }]}
            >
              <Text
                style={[styles.closeBtnText, { color: colors.textSecondary }]}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
