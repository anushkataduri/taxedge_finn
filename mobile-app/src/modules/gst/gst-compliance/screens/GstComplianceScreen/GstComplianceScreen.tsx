

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/shared/hooks/useTheme";
import { BrandColors } from "@/shared/theme";
import { ComplianceHeader } from "@/modules/gst/gst-compliance/components/ComplianceHeader/ComplianceHeader";
import { BottomSheetSelector, SelectorOption } from "@/modules/gst/gst-compliance/components/BottomSheetSelector/BottomSheetSelector";
import { RequestTypeSection } from "@/modules/gst/gst-compliance/components/RequestTypeSection/RequestTypeSection";
import { FloatingLabelInput } from "@/modules/gst/gst-compliance/components/FloatingLabelInput/FloatingLabelInput";
import { useComplianceForm } from "@/modules/gst/hooks/useComplianceForm";
import {
  styles,
  getRootThemeStyle,
  getCardThemeStyle,
  getTextThemeStyle,
  getLabelThemeStyle,
  getInputWrapperThemeStyle,
  getSubmitBtnThemeStyle,
  getDialogCardThemeStyle,
  getDialogMessageThemeStyle,
  getDialogCancelBtnThemeStyle,
  getDialogCancelTextThemeStyle,
} from "./GstComplianceScreen.styles";

const FINANCIAL_YEARS: SelectorOption[] = [
  { label: "2025-26", value: "2025-26", icon: "calendar-outline" },
  { label: "2024-25", value: "2024-25", icon: "calendar-outline" },
  { label: "2023-24", value: "2023-24", icon: "calendar-outline" },
  { label: "2022-23", value: "2022-23", icon: "calendar-outline" },
];

const REQUEST_TYPES: SelectorOption[] = [
  {
    label: "Reconciliation Support",
    value: "Reconciliation Support",
    icon: "git-compare-outline",
    subtitle: "Reconcile Purchase & Sales registers against GSTR-2B",
  },
  {
    label: "Notice Response",
    value: "Notice Response",
    icon: "document-text-outline",
    subtitle: "Expert CA response drafting for GST department notices",
  },
];

export function GstComplianceScreen() {
  const { isDark } = useTheme();

  const {
    formData,
    errors,
    isSubmitting,
    showConfirmModal,
    showResumeModal,
    setShowConfirmModal,
    resumeDraft,
    discardDraft,
    updateField,
    clearError,
    handleGstinChange,
    handlePressSubmit,
    handleConfirmSubmit,
  } = useComplianceForm();

  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Track on-screen keyboard height for dynamic bottom clearance
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Smoothly scrolls the active input field into full view above the keyboard
  const handleScrollField = (fieldName: string) => {
    if (fieldName === "gstin") {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else if (fieldName === "gstr2bRef") {
      scrollViewRef.current?.scrollTo({ y: 320, animated: true });
    } else if (fieldName === "reconciliationRemarks") {
      scrollViewRef.current?.scrollTo({ y: 440, animated: true });
    } else if (fieldName === "noticeNumber") {
      scrollViewRef.current?.scrollTo({ y: 180, animated: true });
    } else if (fieldName === "noticeRemarks") {
      scrollViewRef.current?.scrollTo({ y: 520, animated: true });
    }
  };

  // BottomSheet Modals
  const [showFyModal, setShowFyModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: isDark ? "#0F172A" : "#F8FAFC" },
      ]}
    >
      {/* Top App Bar with Thin Orange Progress Line and Info Card */}
      <ComplianceHeader />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: Math.max(
                keyboardHeight + 80,
                insets.bottom + 50
              ),
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets={true}
        >
          {/* Section 1: Core Details Card */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                borderColor: isDark ? "#334155" : "#E2E8F0",
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? "#F8FAFC" : "#0F172A" },
              ]}
            >
              Business & Filing Details
            </Text>

            {/* 1. GSTIN with Material Floating Label */}
            <FloatingLabelInput
              label="GSTIN"
              floatingLabel="GSTIN"
              placeholder="Enter 15-character GSTIN"
              required
              value={formData.gstin}
              onChangeText={handleGstinChange}
              autoCapitalize="characters"
              maxLength={15}
              autoCorrect={false}
              error={errors.gstin}
              cardBackground={isDark ? "#1E293B" : "#FFFFFF"}
              rightElement={
                formData.gstin.length === 15 && !errors.gstin ? (
                  <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
                ) : null
              }
              onClear={() => {
                updateField("gstin", "");
                clearError("gstin");
              }}
              onFocusScroll={() => handleScrollField("gstin")}
            />

          {/* 2. Financial Year Dropdown */}
          <View style={styles.fieldGroup}>
            <Text
              style={[
                styles.label,
                { color: isDark ? "#E2E8F0" : "#334155" },
              ]}
            >
              Financial Year <Text style={styles.star}>*</Text>
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowFyModal(true)}
              style={[
                styles.selectorBox,
                {
                  backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                  borderColor: errors.financialYear
                    ? "#EF4444"
                    : isDark
                    ? "#334155"
                    : "#CBD5E1",
                },
              ]}
            >
              <Text
                style={[
                  styles.selectorText,
                  {
                    color: formData.financialYear
                      ? isDark
                        ? "#F8FAFC"
                        : "#0F172A"
                      : isDark
                      ? "#64748B"
                      : "#94A3B8",
                  },
                ]}
              >
                {formData.financialYear || "Select Financial Year"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={18}
                color={isDark ? "#94A3B8" : "#64748B"}
              />
            </TouchableOpacity>
            {errors.financialYear ? (
              <Text style={styles.errorText}>{errors.financialYear}</Text>
            ) : null}
          </View>

          {/* 3. Request Type Dropdown (Only 2 options: Reconciliation Support, Notice Response) */}
          <View style={styles.fieldGroup}>
            <Text
              style={[
                styles.label,
                { color: isDark ? "#E2E8F0" : "#334155" },
              ]}
            >
              Request Type <Text style={styles.star}>*</Text>
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowTypeModal(true)}
              style={[
                styles.selectorBox,
                {
                  backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                  borderColor: errors.requestType
                    ? "#EF4444"
                    : isDark
                    ? "#334155"
                    : "#CBD5E1",
                },
              ]}
            >
              <Text
                style={[
                  styles.selectorText,
                  {
                    color: formData.requestType
                      ? isDark
                        ? "#F8FAFC"
                        : "#0F172A"
                      : isDark
                      ? "#64748B"
                      : "#94A3B8",
                  },
                ]}
              >
                {formData.requestType || "Select Request Type"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={18}
                color={isDark ? "#94A3B8" : "#64748B"}
              />
            </TouchableOpacity>
            {errors.requestType ? (
              <Text style={styles.errorText}>{errors.requestType}</Text>
            ) : null}
          </View>
        </View>

        {/* Dynamic Form Sections (Reanimated accordion transition) */}
        <RequestTypeSection
          formData={formData}
          errors={errors}
          onUpdateField={updateField}
          onClearError={clearError}
          onScrollField={handleScrollField}
        />

        {/* Large Full-Width Submit Button */}
        <View style={styles.submitWrapper}>
          <TouchableOpacity
            style={[
              styles.submitBtn,
              {
                backgroundColor: BrandColors.PRIMARY_ORANGE,
                opacity: isSubmitting ? 0.75 : 1,
              },
            ]}
            activeOpacity={0.85}
            onPress={handlePressSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.submitBtnText}>Submitting Request...</Text>
              </View>
            ) : (
              <Text style={styles.submitBtnText}>Submit Request</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>

      {/* Financial Year Selector Modal */}
      <BottomSheetSelector
        visible={showFyModal}
        title="Select Financial Year"
        options={FINANCIAL_YEARS}
        selectedValue={formData.financialYear}
        onSelect={(val) => {
          updateField("financialYear", val);
          clearError("financialYear");
        }}
        onClose={() => setShowFyModal(false)}
      />

      {/* Request Type Selector Modal */}
      <BottomSheetSelector
        visible={showTypeModal}
        title="Select Request Type"
        options={REQUEST_TYPES}
        selectedValue={formData.requestType}
        onSelect={(val) => {
          updateField(
            "requestType",
            val as "Reconciliation Support" | "Notice Response"
          );
          clearError("requestType");
        }}
        onClose={() => setShowTypeModal(false)}
      />

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.dialogCard,
              {
                backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                borderColor: isDark ? "#334155" : "#E2E8F0",
              },
            ]}
          >
            <View style={styles.dialogIconWrap}>
              <Ionicons
                name="shield-checkmark-outline"
                size={32}
                color={BrandColors.PRIMARY_ORANGE}
              />
            </View>

            <Text
              style={[
                styles.dialogTitle,
                { color: isDark ? "#F8FAFC" : "#0F172A" },
              ]}
            >
              Submit GST Compliance Request?
            </Text>

            <Text
              style={[
                styles.dialogMessage,
                { color: isDark ? "#94A3B8" : "#64748B" },
              ]}
            >
              Are you sure you want to submit this {formData.requestType} request for GSTIN {formData.gstin}? Our CA team will immediately begin processing.
            </Text>

            <View style={styles.dialogActionsRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowConfirmModal(false)}
                style={[
                  styles.dialogCancelBtn,
                  {
                    backgroundColor: isDark ? "#334155" : "#F1F5F9",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dialogCancelText,
                    { color: isDark ? "#E2E8F0" : "#475569" },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleConfirmSubmit}
                style={styles.dialogConfirmBtn}
              >
                <Text style={styles.dialogConfirmText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Resume Draft Modal */}
      <Modal
        visible={showResumeModal}
        transparent
        animationType="fade"
        onRequestClose={() => discardDraft()}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.dialogCard,
              {
                backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                borderColor: isDark ? "#334155" : "#E2E8F0",
              },
            ]}
          >
            <View
              style={[
                styles.dialogIconWrap,
                { backgroundColor: isDark ? "#0F172A" : "#EAF1FE" },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={30}
                color={BrandColors.PRIMARY_BLUE_ACCENT}
              />
            </View>

            <Text
              style={[
                styles.dialogTitle,
                { color: isDark ? "#F8FAFC" : "#0F172A" },
              ]}
            >
              Resume Draft Request?
            </Text>

            <Text
              style={[
                styles.dialogMessage,
                { color: isDark ? "#94A3B8" : "#64748B" },
              ]}
            >
              You have an unsaved GST Compliance request in progress. Would you like to resume where you left off?
            </Text>

            <View style={styles.dialogActionsRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={discardDraft}
                style={[
                  styles.dialogCancelBtn,
                  {
                    backgroundColor: isDark ? "#334155" : "#F1F5F9",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dialogCancelText,
                    { color: isDark ? "#E2E8F0" : "#475569" },
                  ]}
                >
                  Start Fresh
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={resumeDraft}
                style={styles.dialogResumeBtn}
              >
                <Text style={styles.dialogConfirmText}>Resume</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default GstComplianceScreen;

