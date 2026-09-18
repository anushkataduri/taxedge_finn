import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { ifscService } from "@/modules/gst/services/ifscService";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { authStorage } from "@/modules/authentication/services/authStorage";
import { customerApi } from "@/modules/customer/services/customerApi";
import { useCustomerStore } from "@/modules/customer/store/customerStore";
import type { Customer } from "@/shared/types/domain";
import {
  TdsCustomerIncomeFormData,
  BankAccountType,
  TaxRegimeType,
  PersonalDetails,
} from "../../types/customerIncome.types";
import {
  cleanIfsc,
  cleanAccountNumber,
  formatCurrency,
} from "../../utils/tdsValidation";
import {
  validateCustomerIncomeForm,
  CustomerFormErrors,
} from "../../validation/tdsCustomerSchema";
import { tdsCalculationService } from "../../services/tdsCalculationService";
import {
  tdsDraftService,
  INITIAL_TDS_FORM_DATA,
} from "../../services/tdsDraftService";
import { TdsRefundPersonalInfoCard } from "../../components/personal/TdsRefundPersonalInfoCard";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { styles } from "./TdsRefundFormScreen.styles";

export const TdsRefundFormScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [formData, setFormData] = useState<TdsCustomerIncomeFormData>(INITIAL_TDS_FORM_DATA);
  const [errors, setErrors] = useState<CustomerFormErrors>({});
  const [isIfscLoading, setIsIfscLoading] = useState(false);
  const [ifscError, setIfscError] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileFetchError, setProfileFetchError] = useState<string | null>(null);

  // Draft Guard & dirty tracking
  const initialSnapshotRef = useRef<string | null>(null);
  const [hasUserEdited, setHasUserEdited] = useState(false);

  // Universal Draft Guard Hook
  const {
    showDraftModal,
    markSubmitted,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
  } = useUniversalDraftGuard({
    isDirty: () => {
      if (!initialSnapshotRef.current) return false;
      const currentSnapshot = JSON.stringify({ bank: formData.bank, income: formData.income });
      return hasUserEdited || currentSnapshot !== initialSnapshotRef.current;
    },
    onSaveDraft: async () => {
      await tdsDraftService.saveFormDraft(formData);
    },
    onDiscardDraft: async () => {
      await tdsDraftService.clearDraft();
    },
  });

  // Bank & Income Input refs
  const accHolderRef = useRef<TextInput>(null);
  const accNumRef = useRef<TextInput>(null);
  const confirmAccNumRef = useRef<TextInput>(null);
  const ifscRef = useRef<TextInput>(null);
  const salaryRef = useRef<TextInput>(null);
  const otherIncomeRef = useRef<TextInput>(null);
  const interestRef = useRef<TextInput>(null);
  const tdsRef = useRef<TextInput>(null);
  const tcsRef = useRef<TextInput>(null);
  const advanceTaxRef = useRef<TextInput>(null);
  const selfTaxRef = useRef<TextInput>(null);

  // Auto-fetch profile from central Auth/Customer store & API
  const fetchAndPopulateProfile = async (): Promise<PersonalDetails | null> => {
    setIsProfileLoading(true);
    setProfileFetchError(null);
    try {
      useAuthStore.getState().syncFromDevAuth();
      const currentAuthUser = useAuthStore.getState().authenticatedUser;
      let currentCustomer = useAuthStore.getState().customer;

      const activeMobile =
        currentCustomer?.mobile ||
        (currentAuthUser as any)?.mobileNumber ||
        (currentAuthUser as any)?.mobile ||
        authStorage.getSession().activeMobile ||
        useAuthStore.getState().mobileNumber;

      const activeCustId =
        currentCustomer?.customerId ||
        (currentAuthUser as any)?.customerId ||
        (currentAuthUser as any)?.custId;

      let apiRes: any = null;
      try {
        apiRes = await customerApi.getProfile(activeMobile || activeCustId);
      } catch (err) {
        console.warn("Backend profile fetch failed, using stored profile:", err);
      }

      if (apiRes && (apiRes.name || apiRes.fullName || apiRes.mobileNumber || apiRes.mobile || apiRes.pan || apiRes.aadhaar)) {
        const mergedCust: Customer = {
          name: apiRes.name || apiRes.fullName || currentCustomer?.name || "",
          email: apiRes.email || currentCustomer?.email || "",
          mobile: apiRes.mobileNumber || apiRes.mobile || currentCustomer?.mobile || activeMobile || "",
          pan: apiRes.pan || currentCustomer?.pan || "",
          aadhaar: apiRes.aadhaar || currentCustomer?.aadhaar || "",
          dob: apiRes.dob || apiRes.dateOfBirth || currentCustomer?.dob || "",
          customerType: apiRes.customerType || apiRes.custType || currentCustomer?.customerType || "Individual",
          addressLine1: apiRes.addressLine1 || currentCustomer?.addressLine1 || "",
          addressLine2: apiRes.addressLine2 || currentCustomer?.addressLine2 || "",
          city: apiRes.city || currentCustomer?.city || "",
          state: apiRes.state || currentCustomer?.state || "",
          pincode: apiRes.pincode || apiRes.pinCode || currentCustomer?.pincode || "",
          address: apiRes.address || currentCustomer?.address || "",
          customerId: apiRes.custId || apiRes.customerId || currentCustomer?.customerId || activeCustId || "",
          avatarUri: currentCustomer?.avatarUri || null,
          profileCompleted: true,
          hasPasscode: currentCustomer?.hasPasscode ?? Boolean(currentAuthUser?.passcode),
        };
        currentCustomer = mergedCust;
        useAuthStore.setState({ customer: mergedCust, profileCompleted: true });
        try {
          useCustomerStore.getState().setProfile(mergedCust);
        } catch {}
      }

      if (!currentCustomer && !currentAuthUser && !apiRes) {
        setProfileFetchError("Unable to load your profile information.");
        return null;
      }

      const rawPan = apiRes?.pan || currentCustomer?.pan || (currentAuthUser as any)?.pan || "";
      const rawAadhaar = apiRes?.aadhaar || currentCustomer?.aadhaar || (currentAuthUser as any)?.aadhaar || "";
      const rawDob = apiRes?.dob || apiRes?.dateOfBirth || currentCustomer?.dob || (currentAuthUser as any)?.dob || "";
      const rawMobile = apiRes?.mobileNumber || apiRes?.mobile || currentCustomer?.mobile || (currentAuthUser as any)?.mobileNumber || "";
      const rawEmail = apiRes?.email || currentCustomer?.email || (currentAuthUser as any)?.email || "";
      const rawName = apiRes?.name || apiRes?.fullName || currentCustomer?.name || (currentAuthUser as any)?.name || "";

      let rawAddress = apiRes?.addressLine1 || currentCustomer?.addressLine1 || apiRes?.address || currentCustomer?.address || "";
      if (apiRes?.addressLine2 || currentCustomer?.addressLine2) {
        const line2 = apiRes?.addressLine2 || currentCustomer?.addressLine2;
        rawAddress = rawAddress ? `${rawAddress}, ${line2}` : line2;
      }

      const rawCity = apiRes?.city || currentCustomer?.city || "";
      const rawState = apiRes?.state || currentCustomer?.state || "";
      const rawPin = apiRes?.pincode || apiRes?.pinCode || currentCustomer?.pincode || "";

      const populatedPersonal: PersonalDetails = {
        fullName: rawName,
        pan: rawPan,
        aadhaar: rawAadhaar,
        dob: rawDob,
        mobileNumber: rawMobile,
        email: rawEmail,
        residentialAddress: rawAddress,
        city: rawCity,
        state: rawState,
        pinCode: rawPin,
      };

      setFormData((prev) => ({
        ...prev,
        personal: populatedPersonal,
        bank: {
          ...prev.bank,
          accountHolderName: prev.bank.accountHolderName || rawName,
        },
      }));

      return populatedPersonal;
    } catch (e: any) {
      setProfileFetchError(e?.message || "Failed to load profile.");
      return null;
    } finally {
      setIsProfileLoading(false);
    }
  };

  // Restore draft or populate profile on mount
  useEffect(() => {
    async function loadData() {
      // 1. Always fetch fresh personal details from database first
      const freshPersonal = await fetchAndPopulateProfile();

      // 2. Load draft if exists, but merge bank and income without overriding personal info
      const savedDraft = await tdsDraftService.getFormDraft();
      if (savedDraft) {
        const currentMobile = useAuthStore.getState().customer?.mobile ||
          authStorage.getSession().activeMobile ||
          useAuthStore.getState().mobileNumber;

        // Isolate customer: only restore if draft belongs to current user or has no conflicting mobile
        const isSameCustomer = !savedDraft.personal?.mobileNumber ||
          !currentMobile ||
          savedDraft.personal.mobileNumber.replace(/\D/g, "") === currentMobile.replace(/\D/g, "");

        if (isSameCustomer) {
          setFormData((prev) => ({
            ...prev,
            bank: savedDraft.bank || prev.bank,
            income: savedDraft.income || prev.income,
            personal: freshPersonal || prev.personal, // ensure database data is preserved!
          }));
          initialSnapshotRef.current = JSON.stringify({ bank: savedDraft.bank, income: savedDraft.income });
          return;
        } else {
          // Different customer's draft: discard to prevent leakage
          await tdsDraftService.clearDraft();
        }
      }

      initialSnapshotRef.current = JSON.stringify({ bank: INITIAL_TDS_FORM_DATA.bank, income: INITIAL_TDS_FORM_DATA.income });
    }
    loadData();
  }, []);

  // Save edited profile back to stores & backend
  const handleSaveProfile = async (updated: PersonalDetails) => {
    setFormData((prev) => ({
      ...prev,
      personal: updated,
      bank: {
        ...prev.bank,
        accountHolderName: prev.bank.accountHolderName || updated.fullName,
      },
    }));

    const currentCust = useAuthStore.getState().customer;
    const currentAuthUser = useAuthStore.getState().authenticatedUser;

    const updatedCustomer: Customer = {
      name: updated.fullName,
      email: updated.email,
      mobile: updated.mobileNumber,
      pan: updated.pan,
      aadhaar: updated.aadhaar,
      dob: updated.dob,
      customerType: currentCust?.customerType || "Individual",
      addressLine1: updated.residentialAddress,
      addressLine2: currentCust?.addressLine2 || "",
      city: updated.city,
      state: updated.state,
      pincode: updated.pinCode,
      address: `${updated.residentialAddress}, ${updated.city}, ${updated.state} - ${updated.pinCode}`,
      customerId: currentCust?.customerId || (currentAuthUser as any)?.customerId || "",
      avatarUri: currentCust?.avatarUri || null,
      profileCompleted: true,
      hasPasscode: currentCust?.hasPasscode ?? Boolean(currentAuthUser?.passcode),
    };

    useAuthStore.setState({ customer: updatedCustomer, profileCompleted: true });
    try {
      useCustomerStore.getState().setProfile(updatedCustomer);
    } catch {}

    try {
      await customerApi.updateProfile({
        name: updatedCustomer.name,
        email: updatedCustomer.email,
        mobileNumber: updatedCustomer.mobile,
        pan: updatedCustomer.pan,
        aadhaar: updatedCustomer.aadhaar,
        dob: updatedCustomer.dob,
        address: `${updatedCustomer.addressLine1 || ""} ${updatedCustomer.addressLine2 || ""}`.trim(),
        addressLine1: updatedCustomer.addressLine1,
        addressLine2: updatedCustomer.addressLine2,
        city: updatedCustomer.city,
        state: updatedCustomer.state,
        pincode: updatedCustomer.pincode,
        customerType: updatedCustomer.customerType,
      });
    } catch (e) {
      console.warn("Backend profile persistence failed:", e);
    }

    await tdsDraftService.saveFormDraft({
      ...formData,
      personal: updated,
    });
  };

  // Live calculation estimate
  const liveCalculation = tdsCalculationService.calculate(formData);

  // Field updater helpers
  const updateBank = (field: keyof typeof formData.bank, value: any) => {
    setHasUserEdited(true);
    setFormData((prev) => ({
      ...prev,
      bank: { ...prev.bank, [field]: value },
    }));

    const errorKey = `bank.${field}` as keyof CustomerFormErrors;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  const updateIncome = (field: keyof typeof formData.income, value: any) => {
    setHasUserEdited(true);
    setFormData((prev) => ({
      ...prev,
      income: { ...prev.income, [field]: value },
    }));

    const errorKey = `income.${field}` as keyof CustomerFormErrors;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  // IFSC Auto-Lookup
  const handleIfscChange = async (val: string) => {
    const cleaned = cleanIfsc(val);
    updateBank("ifscCode", cleaned);

    if (cleaned.length === 11) {
      setIsIfscLoading(true);
      setIfscError(null);
      try {
        const details = await ifscService.lookup(cleaned);
        setFormData((prev) => ({
          ...prev,
          bank: {
            ...prev.bank,
            ifscCode: cleaned,
            bankName: details.bank,
            branchName: details.branch,
            isIfscVerified: true,
          },
        }));
        setIfscError(null);
      } catch {
        setIfscError("Invalid IFSC code. Please check branch details.");
        updateBank("isIfscVerified", false);
      } finally {
        setIsIfscLoading(false);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        bank: {
          ...prev.bank,
          bankName: "",
          branchName: "",
          isIfscVerified: false,
        },
      }));
    }
  };

  // Submit and move to Step 2 (Documents)
  const handleContinue = async () => {
    const validation = validateCustomerIncomeForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      Alert.alert(
        "Incomplete Information",
        "Please complete all required fields correctly to proceed to document upload."
      );
      return;
    }

    await tdsDraftService.saveFormDraft(formData);
    markSubmitted();
    router.push("/service/tds-checklist" as any);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header Bar */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 12) + 6 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={20} color={BrandColors.PRIMARY_BLUE_DARK} />
        </TouchableOpacity>

        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>TDS Refund</Text>
          <Text style={styles.headerSubtitle}>Step 1 of 5: Customer & Income</Text>
        </View>

        <View style={styles.headerRightSpacer} />
      </View>

      {/* Progress Track */}
      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>

      {/* Main Form Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 85 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Dynamic Preliminary Estimate Pill */}
        <View style={styles.previewEstimateBanner}>
          <View style={styles.previewLeft}>
            <Text style={styles.previewLabel}>
              {liveCalculation.isAdditionalTaxPayable
                ? "Preliminary Tax Payable"
                : "Preliminary Estimated Refund"}
            </Text>
            <Text style={styles.previewAmount}>
              {liveCalculation.isAdditionalTaxPayable
                ? formatCurrency(liveCalculation.estimatedTaxPayable)
                : formatCurrency(liveCalculation.estimatedRefund)}
            </Text>
          </View>
          <View style={styles.previewRight}>
            <Text style={styles.previewTag}>AY 2025-26</Text>
          </View>
        </View>

        {/* ========================================================
            SECTION 1: PERSONAL INFORMATION (COMPACT CARD)
        ======================================================== */}
        <TdsRefundPersonalInfoCard
          personalData={formData.personal}
          isLoading={isProfileLoading}
          isError={Boolean(profileFetchError)}
          errorMessage={profileFetchError || undefined}
          onRetry={fetchAndPopulateProfile}
          onSaveProfile={handleSaveProfile}
        />

        {/* ========================================================
            SECTION 2: REFUND BANK ACCOUNT
        ======================================================== */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumberBadge}>
              <Text style={styles.sectionNumberText}>2</Text>
            </View>
            <Text style={styles.sectionTitle}>Refund Bank Account</Text>
          </View>

          {/* Account Holder Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Account Holder Name <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              ref={accHolderRef}
              style={[styles.textInput, errors["bank.accountHolderName"] ? styles.textInputError : null]}
              placeholder="Enter account holder name"
              placeholderTextColor="#94A3B8"
              value={formData.bank.accountHolderName}
              onChangeText={(t) => updateBank("accountHolderName", t)}
              returnKeyType="next"
              onSubmitEditing={() => accNumRef.current?.focus()}
            />
            {errors["bank.accountHolderName"] && (
              <Text style={styles.errorText}>{errors["bank.accountHolderName"]}</Text>
            )}
          </View>

          {/* Bank Account Number (Full Width for clean fit) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Bank Account Number <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              ref={accNumRef}
              style={[styles.textInput, errors["bank.accountNumber"] ? styles.textInputError : null]}
              placeholder="Enter account number"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              value={formData.bank.accountNumber}
              onChangeText={(t) => updateBank("accountNumber", cleanAccountNumber(t))}
              returnKeyType="next"
              onSubmitEditing={() => confirmAccNumRef.current?.focus()}
            />
            {errors["bank.accountNumber"] && (
              <Text style={styles.errorText}>{errors["bank.accountNumber"]}</Text>
            )}
          </View>

          {/* Confirm Account Number (Full Width for clean fit) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Confirm Account Number <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              ref={confirmAccNumRef}
              style={[styles.textInput, errors["bank.confirmAccountNumber"] ? styles.textInputError : null]}
              placeholder="Re-enter account number"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              value={formData.bank.confirmAccountNumber}
              onChangeText={(t) => updateBank("confirmAccountNumber", cleanAccountNumber(t))}
              returnKeyType="next"
              onSubmitEditing={() => ifscRef.current?.focus()}
            />
            {errors["bank.confirmAccountNumber"] && (
              <Text style={styles.errorText}>{errors["bank.confirmAccountNumber"]}</Text>
            )}
          </View>

          {/* IFSC Code with Auto-Lookup */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              IFSC Code <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <View style={styles.ifscRow}>
              <View style={styles.ifscInputWrap}>
                <TextInput
                  ref={ifscRef}
                  style={[
                    styles.textInput,
                    errors["bank.ifscCode"] || ifscError ? styles.textInputError : null,
                  ]}
                  placeholder="Enter IFSC"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="characters"
                  maxLength={11}
                  value={formData.bank.ifscCode}
                  onChangeText={handleIfscChange}
                  returnKeyType="next"
                  onSubmitEditing={() => salaryRef.current?.focus()}
                />
              </View>
              {isIfscLoading && <ActivityIndicator size="small" color={BrandColors.PRIMARY_ORANGE} />}
            </View>

            {/* IFSC Status */}
            {isIfscLoading && (
              <View style={styles.ifscLoadingBox}>
                <Text style={styles.ifscLoadingText}>Verifying IFSC with RBI directory...</Text>
              </View>
            )}

            {formData.bank.isIfscVerified && formData.bank.bankName && (
              <View style={styles.ifscSuccessBox}>
                <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
                <Text style={styles.ifscSuccessText} numberOfLines={1}>
                  {formData.bank.bankName} • {formData.bank.branchName}
                </Text>
              </View>
            )}

            {(errors["bank.ifscCode"] || ifscError) && (
              <Text style={styles.errorText}>{errors["bank.ifscCode"] || ifscError}</Text>
            )}
          </View>

          {/* Bank Name & Branch (Read-Only after lookup) */}
          <View style={styles.fieldRow}>
            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>Bank Name</Text>
              <TextInput
                style={[styles.textInput, styles.textInputReadOnly]}
                editable={false}
                placeholder="Auto-fetched via IFSC"
                placeholderTextColor="#94A3B8"
                value={formData.bank.bankName}
              />
            </View>

            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>Branch</Text>
              <TextInput
                style={[styles.textInput, styles.textInputReadOnly]}
                editable={false}
                placeholder="Auto-fetched via IFSC"
                placeholderTextColor="#94A3B8"
                value={formData.bank.branchName}
              />
            </View>
          </View>

          {/* Account Type */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Account Type</Text>
            <View style={styles.chipGroup}>
              {(["savings", "current"] as BankAccountType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  activeOpacity={0.8}
                  onPress={() => updateBank("accountType", type)}
                  style={[
                    styles.chip,
                    formData.bank.accountType === type ? styles.chipActive : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      formData.bank.accountType === type ? styles.chipTextActive : null,
                    ]}
                  >
                    {type === "savings" ? "Savings Account" : "Current Account"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* ========================================================
            SECTION 3: INCOME & TAX INFORMATION
        ======================================================== */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumberBadge}>
              <Text style={styles.sectionNumberText}>3</Text>
            </View>
            <Text style={styles.sectionTitle}>Income & Tax Information</Text>
          </View>

          {/* Regime Selector */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Tax Regime</Text>
            <View style={styles.regimeSelector}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => updateIncome("taxRegime", "NEW")}
                style={[
                  styles.regimeOption,
                  formData.income.taxRegime === "NEW" ? styles.regimeOptionActive : null,
                ]}
              >
                <Text
                  style={[
                    styles.regimeTitle,
                    formData.income.taxRegime === "NEW" ? styles.regimeTitleActive : null,
                  ]}
                >
                  New Tax Regime
                </Text>
                <Text style={styles.regimeDesc}>u/s 115BAC • Standard Slab</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => updateIncome("taxRegime", "OLD")}
                style={[
                  styles.regimeOption,
                  formData.income.taxRegime === "OLD" ? styles.regimeOptionActive : null,
                ]}
              >
                <Text
                  style={[
                    styles.regimeTitle,
                    formData.income.taxRegime === "OLD" ? styles.regimeTitleActive : null,
                  ]}
                >
                  Old Tax Regime
                </Text>
                <Text style={styles.regimeDesc}>Supports 80C, 80D, Home Loan</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Salary Income */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Salaried Gross Income (₹)</Text>
            <TextInput
              ref={salaryRef}
              style={styles.textInput}
              placeholder="Enter salary"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={formData.income.salaryIncome}
              onChangeText={(t) => updateIncome("salaryIncome", t)}
              returnKeyType="next"
              onSubmitEditing={() => otherIncomeRef.current?.focus()}
            />
          </View>

          {/* Other & Interest Income */}
          <View style={styles.fieldRow}>
            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>Other Income (₹)</Text>
              <TextInput
                ref={otherIncomeRef}
                style={styles.textInput}
                placeholder="Enter other income"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={formData.income.otherIncome}
                onChangeText={(t) => updateIncome("otherIncome", t)}
                returnKeyType="next"
                onSubmitEditing={() => interestRef.current?.focus()}
              />
            </View>

            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>Interest Income (₹)</Text>
              <TextInput
                ref={interestRef}
                style={styles.textInput}
                placeholder="Enter interest"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={formData.income.interestIncome}
                onChangeText={(t) => updateIncome("interestIncome", t)}
                returnKeyType="next"
                onSubmitEditing={() => tdsRef.current?.focus()}
              />
            </View>
          </View>

          {/* Progressive Disclosure 1: Rental Income */}
          <View style={styles.toggleSection}>
            <View style={styles.toggleHeader}>
              <View style={styles.toggleTextGroup}>
                <Text style={styles.toggleQuestion}>Rental Income</Text>
                <Text style={styles.toggleSubtitle}>House property rent</Text>
              </View>
              <View style={styles.toggleChips}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasRentalIncome", true)}
                  style={[styles.toggleChip, formData.income.hasRentalIncome ? styles.toggleChipActive : null]}
                >
                  <Text style={[styles.toggleChipText, formData.income.hasRentalIncome ? styles.toggleChipTextActive : null]}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasRentalIncome", false)}
                  style={[styles.toggleChip, !formData.income.hasRentalIncome ? styles.toggleChipActive : null]}
                >
                  <Text style={[styles.toggleChipText, !formData.income.hasRentalIncome ? styles.toggleChipTextActive : null]}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {formData.income.hasRentalIncome && (
              <View style={styles.conditionalFields}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Annual Rent Received (₹)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter rental income"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={formData.income.rentalIncome}
                    onChangeText={(t) => updateIncome("rentalIncome", t)}
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Property Taxes Paid (₹)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter municipal taxes"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={formData.income.municipalTaxesPaid}
                    onChangeText={(t) => updateIncome("municipalTaxesPaid", t)}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Progressive Disclosure 2: Capital Gains */}
          <View style={styles.toggleSection}>
            <View style={styles.toggleHeader}>
              <View style={styles.toggleTextGroup}>
                <Text style={styles.toggleQuestion}>Capital Gains</Text>
                <Text style={styles.toggleSubtitle}>Stocks / MF / Property</Text>
              </View>
              <View style={styles.toggleChips}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasCapitalGains", true)}
                  style={[styles.toggleChip, formData.income.hasCapitalGains ? styles.toggleChipActive : null]}
                >
                  <Text style={[styles.toggleChipText, formData.income.hasCapitalGains ? styles.toggleChipTextActive : null]}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasCapitalGains", false)}
                  style={[styles.toggleChip, !formData.income.hasCapitalGains ? styles.toggleChipActive : null]}
                >
                  <Text style={[styles.toggleChipText, !formData.income.hasCapitalGains ? styles.toggleChipTextActive : null]}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {formData.income.hasCapitalGains && (
              <View style={styles.conditionalFields}>
                <View style={styles.fieldRow}>
                  <View style={[styles.fieldGroup, styles.fieldRowItem]}>
                    <Text style={styles.fieldLabel}>Short-Term Gains (₹)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter STCG"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={formData.income.shortTermCapitalGains}
                      onChangeText={(t) => updateIncome("shortTermCapitalGains", t)}
                    />
                  </View>
                  <View style={[styles.fieldGroup, styles.fieldRowItem]}>
                    <Text style={styles.fieldLabel}>Long-Term Gains (₹)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter LTCG"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={formData.income.longTermCapitalGains}
                      onChangeText={(t) => updateIncome("longTermCapitalGains", t)}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Progressive Disclosure 3: Business Income */}
          <View style={styles.toggleSection}>
            <View style={styles.toggleHeader}>
              <View style={styles.toggleTextGroup}>
                <Text style={styles.toggleQuestion}>Business / Profession</Text>
                <Text style={styles.toggleSubtitle}>Freelance or business income</Text>
              </View>
              <View style={styles.toggleChips}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasBusinessIncome", true)}
                  style={[styles.toggleChip, formData.income.hasBusinessIncome ? styles.toggleChipActive : null]}
                >
                  <Text style={[styles.toggleChipText, formData.income.hasBusinessIncome ? styles.toggleChipTextActive : null]}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasBusinessIncome", false)}
                  style={[styles.toggleChip, !formData.income.hasBusinessIncome ? styles.toggleChipActive : null]}
                >
                  <Text style={[styles.toggleChipText, !formData.income.hasBusinessIncome ? styles.toggleChipTextActive : null]}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {formData.income.hasBusinessIncome && (
              <View style={styles.conditionalFields}>
                <View style={styles.fieldRow}>
                  <View style={[styles.fieldGroup, styles.fieldRowItem]}>
                    <Text style={styles.fieldLabel}>Turnover (₹)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter turnover"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={formData.income.grossTurnover}
                      onChangeText={(t) => updateIncome("grossTurnover", t)}
                    />
                  </View>
                  <View style={[styles.fieldGroup, styles.fieldRowItem]}>
                    <Text style={styles.fieldLabel}>Net Profit (₹)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter profit"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={formData.income.netBusinessProfit}
                      onChangeText={(t) => updateIncome("netBusinessProfit", t)}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Progressive Disclosure 4: Home Loan */}
          <View style={styles.toggleSection}>
            <View style={styles.toggleHeader}>
              <View style={styles.toggleTextGroup}>
                <Text style={styles.toggleQuestion}>Home Loan Interest</Text>
                <Text style={styles.toggleSubtitle}>Self-occupied house property</Text>
              </View>
              <View style={styles.toggleChips}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasHomeLoan", true)}
                  style={[styles.toggleChip, formData.income.hasHomeLoan ? styles.toggleChipActive : null]}
                >
                  <Text style={[styles.toggleChipText, formData.income.hasHomeLoan ? styles.toggleChipTextActive : null]}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasHomeLoan", false)}
                  style={[styles.toggleChip, !formData.income.hasHomeLoan ? styles.toggleChipActive : null]}
                >
                  <Text style={[styles.toggleChipText, !formData.income.hasHomeLoan ? styles.toggleChipTextActive : null]}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {formData.income.hasHomeLoan && (
              <View style={styles.conditionalFields}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Interest Paid (Sec 24b) (₹)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter interest paid"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={formData.income.homeLoanInterestSec24b}
                    onChangeText={(t) => updateIncome("homeLoanInterestSec24b", t)}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Progressive Disclosure 5: Deductions (80C, 80D) */}
          <View style={styles.toggleSection}>
            <View style={styles.toggleHeader}>
              <View style={styles.toggleTextGroup}>
                <Text style={styles.toggleQuestion}>Tax Deductions</Text>
                <Text style={styles.toggleSubtitle}>Section 80C, 80D, 80G</Text>
              </View>
              <View style={styles.toggleChips}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasDeductions", true)}
                  style={[styles.toggleChip, formData.income.hasDeductions ? styles.toggleChipActive : null]}
                >
                  <Text style={[styles.toggleChipText, formData.income.hasDeductions ? styles.toggleChipTextActive : null]}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasDeductions", false)}
                  style={[styles.toggleChip, !formData.income.hasDeductions ? styles.toggleChipActive : null]}
                >
                  <Text style={[styles.toggleChipText, !formData.income.hasDeductions ? styles.toggleChipTextActive : null]}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {formData.income.hasDeductions && (
              <View style={styles.conditionalFields}>
                <View style={styles.fieldRow}>
                  <View style={[styles.fieldGroup, styles.fieldRowItem]}>
                    <Text style={styles.fieldLabel}>80C (PPF, ELSS, LIC) (₹)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Up to ₹1.5L"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={formData.income.deductions80C}
                      onChangeText={(t) => updateIncome("deductions80C", t)}
                    />
                  </View>
                  <View style={[styles.fieldGroup, styles.fieldRowItem]}>
                    <Text style={styles.fieldLabel}>80D (Health Ins.) (₹)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Up to ₹75k"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={formData.income.deductions80D}
                      onChangeText={(t) => updateIncome("deductions80D", t)}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ========================================================
            SECTION 4: TDS & TAXES PAID (TAX CREDITS)
        ======================================================== */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumberBadge}>
              <Text style={styles.sectionNumberText}>4</Text>
            </View>
            <Text style={styles.sectionTitle}>TDS & Taxes Paid</Text>
          </View>

          {/* Total TDS Deducted (Full Width) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Total TDS Deducted (₹) <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              ref={tdsRef}
              style={[styles.textInput, errors["income.totalTdsDeducted"] ? styles.textInputError : null]}
              placeholder="Enter TDS amount"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={formData.income.totalTdsDeducted}
              onChangeText={(t) => updateIncome("totalTdsDeducted", t)}
              returnKeyType="next"
              onSubmitEditing={() => tcsRef.current?.focus()}
            />
            {errors["income.totalTdsDeducted"] && (
              <Text style={styles.errorText}>{errors["income.totalTdsDeducted"]}</Text>
            )}
          </View>

          {/* TCS & Advance Tax (2 Columns - Spacious & Fits) */}
          <View style={styles.fieldRow}>
            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>TCS Amount (₹)</Text>
              <TextInput
                ref={tcsRef}
                style={styles.textInput}
                placeholder="Enter TCS"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={formData.income.tcsAmount}
                onChangeText={(t) => updateIncome("tcsAmount", t)}
                returnKeyType="next"
                onSubmitEditing={() => advanceTaxRef.current?.focus()}
              />
            </View>

            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>Advance Tax (₹)</Text>
              <TextInput
                ref={advanceTaxRef}
                style={styles.textInput}
                placeholder="Enter advance tax"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={formData.income.advanceTaxPaid}
                onChangeText={(t) => updateIncome("advanceTaxPaid", t)}
                returnKeyType="next"
                onSubmitEditing={() => selfTaxRef.current?.focus()}
              />
            </View>
          </View>

          {/* Self Assessment Tax (Full Width - Fits cleanly without clipping) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Self Assessment Tax Paid (₹)</Text>
            <TextInput
              ref={selfTaxRef}
              style={styles.textInput}
              placeholder="Enter self-assessment tax"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={formData.income.selfAssessmentTaxPaid}
              onChangeText={(t) => updateIncome("selfAssessmentTaxPaid", t)}
              returnKeyType="done"
            />
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 14 }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleContinue}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaButtonText}>Continue to Documents</Text>
          <Ionicons name="arrow-forward" size={18} color={BrandColors.WHITE} />
        </TouchableOpacity>
      </View>

      {/* Universal Save As Draft Confirmation Modal */}
      <UniversalDraftModal
        visible={showDraftModal}
        title="Save Application Progress?"
        message="You have unsaved changes in your TDS refund application. Save your progress so you can resume anytime without re-entering details."
        saveButtonText="Save as Draft & Exit"
        discardButtonText="Discard & Exit"
        cancelButtonText="Keep Editing"
        onSaveAndExit={handleSaveAndExit}
        onDiscardAndExit={handleDiscardAndExit}
        onCancel={handleCancel}
      />
    </KeyboardAvoidingView>
  );
};

export default TdsRefundFormScreen;
