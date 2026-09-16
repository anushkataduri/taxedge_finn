import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TdsFormData, TdsFormErrors, TdsFormFieldKey } from "../../types/tdsForm.types";
import { INITIAL_TDS_FORM_DATA } from "../../constants/tdsForm.constants";
import { validateTdsForm, validateField } from "../../validation/tdsFormValidation";
import {
  TdsHeader,
  TdsNoticeBanner,
  YourDetailsSection,
  DeductorSection,
  RefundBankSection,
} from "../../components/form";
import { useApplicationStore } from "@/store/applicationStore";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import {
  styles,
  getContainerInsetsStyle,
  getBottomBarInsetsStyle,
} from "./TdsRefundFormScreen.styles";

export const TdsRefundFormScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const tdsDraft = useApplicationStore((state) => state.tdsDraft);
  const saveTdsDraft = useApplicationStore((state) => state.saveTdsDraft);
  const clearTdsDraft = useApplicationStore((state) => state.clearTdsDraft);

  // Pure functional initial state: restore form from draft synchronously - zero loops
  const [formData, setFormData] = useState<TdsFormData>(() => {
    const draft = useApplicationStore.getState().tdsDraft;
    if (draft && draft.formData) {
      return {
        ...INITIAL_TDS_FORM_DATA,
        ...draft.formData,
      };
    }
    return INITIAL_TDS_FORM_DATA;
  });
  const [errors, setErrors] = useState<TdsFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep state synchronized with draft store functionally - zero loops
  useEffect(() => {
    if (tdsDraft && tdsDraft.formData) {
      setFormData((prev) => ({
        ...prev,
        ...tdsDraft.formData,
      }));
    }
  }, [tdsDraft?.formData]);

  // Universal draft guard hook (same pattern as GST and ITR)
  const {
    showDraftModal,
    openDraftModal,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
  } = useUniversalDraftGuard({
    isDirty: () =>
      Object.values(formData).some((v) => (v || "").trim() !== ""),
    onSaveDraft: () => {
      saveTdsDraft?.({
        formData,
        step: "FORM",
        updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    },
    onDiscardDraft: () => {
      clearTdsDraft?.();
    },
  });

  // Pure functional field change handler - zero loops
  const handleChange = (key: keyof TdsFormData, value: string) => {
    const updatedData: TdsFormData = { ...formData, [key]: value };
    setFormData(updatedData);

    // Clear or update field-specific error in real time
    if (errors[key]) {
      const fieldError = validateField(key, updatedData);
      setErrors((prev) => ({
        ...prev,
        [key]: fieldError,
      }));
    }
  };

  const handleContinue = () => {
    setIsSubmitting(true);
    const { isValid, errors: validationErrors } = validateTdsForm(formData);

    if (!isValid) {
      setErrors(validationErrors);
      // Collect error messages functionally without loops
      const errorList = Object.keys(validationErrors)
        .map((k) => validationErrors[k as TdsFormFieldKey])
        .filter(Boolean);

      const firstError = errorList[0] || "Please check the form for errors.";
      Alert.alert("Incomplete Details", firstError);
      setIsSubmitting(false);
      return;
    }

    // Save progress to draft state and navigate to Document Checklist
    saveTdsDraft?.({
      formData,
      step: "DOCUMENTS",
      updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });

    router.push({
      pathname: "/service/tds-checklist" as any,
      params: {
        pan: formData.panNumber,
        ay: formData.assessmentYear,
        tdsAmount: formData.tdsAmount,
        deductorName: formData.deductorName,
        deductorTan: formData.deductorTan,
        accountNumber: formData.accountNumber,
        bankName: formData.bankName,
      },
    });
    setIsSubmitting(false);
  };

  const handleBackPress = () => {
    const isDirty = Object.values(formData).some((v) => (v || "").trim() !== "");
    if (isDirty) {
      openDraftModal();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/service/itr" as any);
    }
  };

  const containerInsets = getContainerInsetsStyle(insets.top);
  const bottomBarInsets = getBottomBarInsetsStyle(insets.bottom);

  return (
    <View style={[styles.container, containerInsets]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Header with back guard */}
      <TdsHeader
        title="TDS Refund"
        subtitle="Claim tax deducted at source back"
        onBack={handleBackPress}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Notice Banner */}
          <TdsNoticeBanner />

          {/* Section 1: Your details */}
          <YourDetailsSection
            data={formData}
            errors={errors}
            onChange={handleChange}
          />

          {/* Section 2: Deductor */}
          <DeductorSection
            data={formData}
            errors={errors}
            onChange={handleChange}
          />

          {/* Section 3: Refund bank account */}
          <RefundBankSection
            data={formData}
            errors={errors}
            onChange={handleChange}
          />
        </ScrollView>

        {/* Sticky Bottom Bar with CTA */}
        <View style={[styles.bottomBar, bottomBarInsets]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleContinue}
            disabled={isSubmitting}
            style={[
              styles.ctaButton,
              isSubmitting && styles.ctaButtonDisabled,
            ]}
          >
            <Text style={styles.ctaButtonText}>Continue to Documents</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Universal Draft Modal (Same as GST & ITR) */}
      <UniversalDraftModal
        visible={showDraftModal}
        title="Save TDS Refund Draft?"
        message="You have unsaved details in your TDS refund claim. Save your progress so you can resume anytime without re-entering details."
        saveButtonText="Save as Draft & Exit"
        discardButtonText="Discard & Exit"
        cancelButtonText="Keep Editing"
        onSaveAndExit={handleSaveAndExit}
        onDiscardAndExit={handleDiscardAndExit}
        onCancel={handleCancel}
      />
    </View>
  );
};

export default TdsRefundFormScreen;
