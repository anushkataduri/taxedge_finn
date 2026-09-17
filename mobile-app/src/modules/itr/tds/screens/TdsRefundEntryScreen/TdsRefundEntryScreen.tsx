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
import { styles } from "./TdsRefundEntryScreen.styles";

export const TdsRefundEntryScreen: React.FC = () => {
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

  // Universal Draft Guard Hook for Back Gesture, Header Back, and Hardware Back Interception
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

  // Bank & Income Input refs for smooth keyboard navigation
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
  const fetchAndPopulateProfile = async () => {
    setIsProfileLoading(true);
    setProfileFetchError(null);
    try {
      useAuthStore.getState().syncFromDevAuth();
      const currentAuthUser = useAuthStore.getState().authenticatedUser;
      let currentCustomer = useAuthStore.getState().customer;

      const activeMobile =
        currentCustomer?.mobile ||
        (currentAuthUser as any)?.mobileNumber ||
        (currentAuthUser as any)?.mobile;
      const activeCustId =
        currentCustomer?.customerId ||
        (currentAuthUser as any)?.customerId ||
        (currentAuthUser as any)?.custId;

      try {
        const apiRes = await customerApi.getProfile(activeMobile || activeCustId);
        if (apiRes && (apiRes.name || apiRes.fullName || apiRes.mobile || apiRes.mobileNumber)) {
          const mergedCust: Customer = {
            name: apiRes.fullName || apiRes.name || currentCustomer?.name || "",
            email: apiRes.email || currentCustomer?.email || "",
            mobile: apiRes.mobileNumber || apiRes.mobile || currentCustomer?.mobile || "",
            pan: apiRes.pan || currentCustomer?.pan || "",
            aadhaar: apiRes.aadhaar || currentCustomer?.aadhaar || "",
            dob: apiRes.dateOfBirth || apiRes.dob || currentCustomer?.dob || "",
            customerType: apiRes.customerType || apiRes.custType || currentCustomer?.customerType || "Individual",
            addressLine1: apiRes.addressLine1 || currentCustomer?.addressLine1 || "",
            addressLine2: apiRes.addressLine2 || currentCustomer?.addressLine2 || "",
            city: apiRes.city || currentCustomer?.city || "",
            state: apiRes.state || currentCustomer?.state || "",
            pincode: apiRes.pinCode || apiRes.pincode || currentCustomer?.pincode || "",
            address: apiRes.address || currentCustomer?.address || "",
            customerId: apiRes.customerId || apiRes.custId || currentCustomer?.customerId || "",
            avatarUri: currentCustomer?.avatarUri || null,
            profileCompleted: true,
            hasPasscode: currentCustomer?.hasPasscode ?? Boolean(currentAuthUser?.passcode),
          };
          currentCustomer = mergedCust;
          useAuthStore.setState({ customer: mergedCust });
          try {
            useCustomerStore.getState().setProfile(mergedCust);
          } catch {}
        }
      } catch (err) {
        console.warn("Backend profile fetch failed, using stored profile:", err);
      }

      if (!currentCustomer && !currentAuthUser) {
        setProfileFetchError("Unable to load your profile information.");
        return;
      }

      const cust: any = currentCustomer || currentAuthUser;

      // Auto-fill personal details directly from existing customer profile in DB
      setFormData((prev) => ({
        ...prev,
        personal: {
          fullName: cust?.name || cust?.fullName || prev.personal.fullName || "",
          pan: cust?.pan !== undefined && cust?.pan !== null ? cust.pan : (prev.personal.pan || ""),
          aadhaar: cust?.aadhaar !== undefined && cust?.aadhaar !== null ? cust.aadhaar : (prev.personal.aadhaar || ""),
          dob: cust?.dob || cust?.dateOfBirth || prev.personal.dob || "",
          mobileNumber: cust?.mobile || cust?.mobileNumber || prev.personal.mobileNumber || "",
          email: cust?.email || prev.personal.email || "",
          residentialAddress:
            cust?.addressLine1 ||
            cust?.address ||
            prev.personal.residentialAddress ||
            "",
          city: cust?.city || prev.personal.city || "",
          state: cust?.state || prev.personal.state || "",
          pinCode: cust?.pincode || cust?.pinCode || prev.personal.pinCode || "",
        },
      }));
    } catch (err) {
      console.warn("Profile fetch error in TDS:", err);
      setProfileFetchError("Unable to load your profile information.");
    } finally {
      setIsProfileLoading(false);
    }
  };

  // Restore draft and auto-fetch profile on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const draft = await tdsDraftService.getFormDraft();
      if (isMounted && draft) {
        setFormData(draft);
      }
      if (isMounted) {
        await fetchAndPopulateProfile();
      }
      if (isMounted) {
        initialSnapshotRef.current = JSON.stringify({
          bank: draft ? draft.bank : INITIAL_TDS_FORM_DATA.bank,
          income: draft ? draft.income : INITIAL_TDS_FORM_DATA.income,
        });
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Live dynamic calculation for top preview
  const liveCalculation = tdsCalculationService.calculate(formData);

  // Save edited personal details to central profile and TDS form data
  const handleSaveProfile = async (updatedPersonal: PersonalDetails) => {
    setHasUserEdited(true);
    setFormData((prev) => ({
      ...prev,
      personal: updatedPersonal,
    }));

    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (k.startsWith("personal.")) delete next[k];
      });
      return next;
    });

    const currentCust = useAuthStore.getState().customer;
    const currentAuthUser = useAuthStore.getState().authenticatedUser;

    const updatedCustomer: Customer = {
      name: updatedPersonal.fullName.trim(),
      email: updatedPersonal.email.trim(),
      dob: updatedPersonal.dob.trim(),
      pan: updatedPersonal.pan.trim().toUpperCase(),
      aadhaar: updatedPersonal.aadhaar.trim(),
      mobile: updatedPersonal.mobileNumber.trim(),
      address: updatedPersonal.residentialAddress.trim(),
      addressLine1: updatedPersonal.residentialAddress.trim(),
      city: updatedPersonal.city.trim(),
      state: updatedPersonal.state.trim(),
      pincode: updatedPersonal.pinCode.trim(),
      customerType: currentCust?.customerType || currentAuthUser?.customerType || "Individual",
      customerId:
        currentCust?.customerId ||
        currentAuthUser?.customerId ||
        `CUST-2026-${updatedPersonal.mobileNumber.trim().slice(-5) || "00001"}`,
      avatarUri: currentCust?.avatarUri || currentAuthUser?.avatarUri || null,
      profileCompleted: true,
      hasPasscode: currentCust?.hasPasscode ?? Boolean(currentAuthUser?.passcode),
    };

    useAuthStore.setState({
      customer: updatedCustomer,
      authenticatedUser: {
        ...(currentAuthUser || {}),
        ...updatedCustomer,
        mobileNumber: updatedCustomer.mobile,
        registrationCompleted: true,
      } as any,
    });

    authStorage.saveUser({
      ...(currentAuthUser || {}),
      ...updatedCustomer,
      mobileNumber: updatedCustomer.mobile,
      registrationCompleted: true,
    } as any);

    try {
      useCustomerStore.getState().setProfile(updatedCustomer);
    } catch {}

    try {
      let backendDob = updatedCustomer.dob;
      if (backendDob) {
        const dmy = backendDob.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
        if (dmy) {
          backendDob = `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
        }
      }

      await customerApi.updateProfile({
        custId: updatedCustomer.customerId,
        mobileNumber: updatedCustomer.mobile,
        name: updatedCustomer.name,
        email: updatedCustomer.email,
        dob: backendDob,
        pan: updatedCustomer.pan,
        aadhaar: updatedCustomer.aadhaar,
        address: updatedCustomer.address,
        addressLine1: updatedCustomer.addressLine1,
        city: updatedCustomer.city,
        state: updatedCustomer.state,
        pincode: updatedCustomer.pincode,
      });
    } catch (err) {
      console.warn("Backend customer profile update error:", err);
    }

    await tdsDraftService.saveFormDraft({
      ...formData,
      personal: updatedPersonal,
    });
  };


  const updateBank = (field: keyof TdsCustomerIncomeFormData["bank"], val: any) => {
    setHasUserEdited(true);
    setFormData((prev) => ({
      ...prev,
      bank: { ...prev.bank, [field]: val },
    }));
    if (errors[`bank.${field}`]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`bank.${field}`];
        return next;
      });
    }
  };

  const updateIncome = (field: keyof TdsCustomerIncomeFormData["income"], val: any) => {
    setHasUserEdited(true);
    setFormData((prev) => ({
      ...prev,
      income: { ...prev.income, [field]: val },
    }));
    if (errors[`income.${field}`]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`income.${field}`];
        return next;
      });
    }
  };

  // IFSC code auto-lookup handler
  const handleIfscChange = async (rawText: string) => {
    const cleaned = cleanIfsc(rawText);
    updateBank("ifscCode", cleaned);
    setIfscError(null);

    if (cleaned.length === 11) {
      setIsIfscLoading(true);
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

    // Persist draft for next screens
    await tdsDraftService.saveFormDraft(formData);
    markSubmitted();

    // Navigate to Screen 2 (Document checklist)
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
        {/* Info Banner */}
        <View style={styles.infoNotice}>
          <Ionicons name="shield-checkmark" size={16} color={BrandColors.PRIMARY_BLUE_ACCENT} />
          <Text style={styles.infoNoticeText}>
            Details are verified by a Chartered Accountant against Form 26AS & AIS records.
          </Text>
        </View>

        {/* Dynamic Preliminary Estimate Pill */}
        <View style={styles.previewEstimateBanner}>
          <View style={styles.previewLeft}>
            <Text style={styles.previewLabel}>
              {liveCalculation.isAdditionalTaxPayable
                ? "PRELIMINARY TAX PAYABLE"
                : "PRELIMINARY ESTIMATED REFUND"}
            </Text>
            <Text style={styles.previewAmount}>
              {formatCurrency(
                liveCalculation.isAdditionalTaxPayable
                  ? liveCalculation.estimatedTaxPayable
                  : liveCalculation.estimatedRefund
              )}
            </Text>
          </View>
          <View style={styles.previewRight}>
            <Text style={styles.previewTag}>Dynamic Calculation</Text>
          </View>
        </View>

        {/* ========================================================
            SECTION 1: PERSONAL INFORMATION (AUTO-FETCH CARD)
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
            SECTION 2: BANK / REFUND DETAILS
        ======================================================== */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumberBadge}>
              <Text style={styles.sectionNumberText}>2</Text>
            </View>
            <Text style={styles.sectionTitle}>Bank / Refund Account Details</Text>
          </View>

          {/* Account Holder Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Account Holder Name <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TextInput
              ref={accHolderRef}
              style={[styles.textInput, errors["bank.accountHolderName"] ? styles.textInputError : null]}
              placeholder="Account holder name"
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

          {/* Account Number & Confirm Account Number */}
          <View style={styles.fieldRow}>
            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>
                Bank Account Number <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TextInput
                ref={accNumRef}
                style={[styles.textInput, errors["bank.accountNumber"] ? styles.textInputError : null]}
                placeholder="Account number"
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

            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>
                Confirm Account Number <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TextInput
                ref={confirmAccNumRef}
                style={[styles.textInput, errors["bank.confirmAccountNumber"] ? styles.textInputError : null]}
                placeholder="Confirm account number"
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
                <Text style={styles.ifscSuccessText}>
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
                value={formData.bank.bankName || "Auto-fetched via IFSC"}
              />
            </View>

            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>Branch</Text>
              <TextInput
                style={[styles.textInput, styles.textInputReadOnly]}
                editable={false}
                value={formData.bank.branchName || "Auto-fetched via IFSC"}
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
            <Text style={styles.sectionTitle}>Income & Tax Slabs Information</Text>
          </View>

          {/* Assessment Year & Regime */}
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
                <Text style={styles.regimeDesc}>
                  u/s 115BAC • Lower slab rates • ₹75k Std Ded
                </Text>
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
                <Text style={styles.regimeDesc}>
                  Supports 80C, 80D, 80G & Home Loan interest
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Salary Income */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Salaried / Employment Gross Income (₹)</Text>
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

          {/* Conditional 1: Rental Income */}
          <View style={styles.toggleSection}>
            <View style={styles.toggleHeader}>
              <Text style={styles.toggleQuestion}>Do you have Rental / House Property Income?</Text>
              <View style={styles.chipGroup}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasRentalIncome", true)}
                  style={[styles.chip, formData.income.hasRentalIncome ? styles.chipActive : null]}
                >
                  <Text style={[styles.chipText, formData.income.hasRentalIncome ? styles.chipTextActive : null]}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasRentalIncome", false)}
                  style={[styles.chip, !formData.income.hasRentalIncome ? styles.chipActive : null]}
                >
                  <Text style={[styles.chipText, !formData.income.hasRentalIncome ? styles.chipTextActive : null]}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {formData.income.hasRentalIncome && (
              <View style={styles.conditionalFields}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Annual Rental Income Received (₹)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter rental income"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={formData.income.rentalIncome}
                    onChangeText={(t) => updateIncome("rentalIncome", t)}
                  />
                  {errors["income.rentalIncome"] && (
                    <Text style={styles.errorText}>{errors["income.rentalIncome"]}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Municipal / Property Taxes Paid (₹)</Text>
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

          {/* Conditional 2: Capital Gains */}
          <View style={styles.toggleSection}>
            <View style={styles.toggleHeader}>
              <Text style={styles.toggleQuestion}>Do you have Capital Gains from Stocks/MF/Property?</Text>
              <View style={styles.chipGroup}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasCapitalGains", true)}
                  style={[styles.chip, formData.income.hasCapitalGains ? styles.chipActive : null]}
                >
                  <Text style={[styles.chipText, formData.income.hasCapitalGains ? styles.chipTextActive : null]}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasCapitalGains", false)}
                  style={[styles.chip, !formData.income.hasCapitalGains ? styles.chipActive : null]}
                >
                  <Text style={[styles.chipText, !formData.income.hasCapitalGains ? styles.chipTextActive : null]}>
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

          {/* Conditional 3: Business / Professional Income */}
          <View style={styles.toggleSection}>
            <View style={styles.toggleHeader}>
              <Text style={styles.toggleQuestion}>Do you have Business or Professional Income?</Text>
              <View style={styles.chipGroup}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasBusinessIncome", true)}
                  style={[styles.chip, formData.income.hasBusinessIncome ? styles.chipActive : null]}
                >
                  <Text style={[styles.chipText, formData.income.hasBusinessIncome ? styles.chipTextActive : null]}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasBusinessIncome", false)}
                  style={[styles.chip, !formData.income.hasBusinessIncome ? styles.chipActive : null]}
                >
                  <Text style={[styles.chipText, !formData.income.hasBusinessIncome ? styles.chipTextActive : null]}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {formData.income.hasBusinessIncome && (
              <View style={styles.conditionalFields}>
                <View style={styles.fieldRow}>
                  <View style={[styles.fieldGroup, styles.fieldRowItem]}>
                    <Text style={styles.fieldLabel}>Gross Turnover (₹)</Text>
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

          {/* Conditional 4: Home Loan */}
          <View style={styles.toggleSection}>
            <View style={styles.toggleHeader}>
              <Text style={styles.toggleQuestion}>Do you have a Home Loan on Self-occupied House?</Text>
              <View style={styles.chipGroup}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasHomeLoan", true)}
                  style={[styles.chip, formData.income.hasHomeLoan ? styles.chipActive : null]}
                >
                  <Text style={[styles.chipText, formData.income.hasHomeLoan ? styles.chipTextActive : null]}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasHomeLoan", false)}
                  style={[styles.chip, !formData.income.hasHomeLoan ? styles.chipActive : null]}
                >
                  <Text style={[styles.chipText, !formData.income.hasHomeLoan ? styles.chipTextActive : null]}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {formData.income.hasHomeLoan && (
              <View style={styles.conditionalFields}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Eligible Home Loan Interest u/s 24(b)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter interest amount"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={formData.income.homeLoanInterestSec24b}
                    onChangeText={(t) => updateIncome("homeLoanInterestSec24b", t)}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Conditional 5: Chapter VI-A Deductions */}
          <View style={styles.toggleSection}>
            <View style={styles.toggleHeader}>
              <Text style={styles.toggleQuestion}>Claim Deductions (80C, 80D Mediclaim, 80G)?</Text>
              <View style={styles.chipGroup}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasDeductions", true)}
                  style={[styles.chip, formData.income.hasDeductions ? styles.chipActive : null]}
                >
                  <Text style={[styles.chipText, formData.income.hasDeductions ? styles.chipTextActive : null]}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasDeductions", false)}
                  style={[styles.chip, !formData.income.hasDeductions ? styles.chipActive : null]}
                >
                  <Text style={[styles.chipText, !formData.income.hasDeductions ? styles.chipTextActive : null]}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {formData.income.hasDeductions && (
              <View style={styles.conditionalFields}>
                <View style={styles.fieldRow}>
                  <View style={[styles.fieldGroup, styles.fieldRowItem]}>
                    <Text style={styles.fieldLabel}>Section 80C</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter 80C amount"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={formData.income.deductions80C}
                      onChangeText={(t) => updateIncome("deductions80C", t)}
                    />
                  </View>
                  <View style={[styles.fieldGroup, styles.fieldRowItem]}>
                    <Text style={styles.fieldLabel}>Section 80D (Health)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter 80D amount"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={formData.income.deductions80D}
                      onChangeText={(t) => updateIncome("deductions80D", t)}
                    />
                  </View>
                </View>

                <View style={styles.fieldRow}>
                  <View style={[styles.fieldGroup, styles.fieldRowItem]}>
                    <Text style={styles.fieldLabel}>80G Donations</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter 80G amount"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={formData.income.donations80G}
                      onChangeText={(t) => updateIncome("donations80G", t)}
                    />
                  </View>
                  <View style={[styles.fieldGroup, styles.fieldRowItem]}>
                    <Text style={styles.fieldLabel}>Other Deductions</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter other deductions"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={formData.income.otherDeductions}
                      onChangeText={(t) => updateIncome("otherDeductions", t)}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Conditional 6: Loss Carry Forward */}
          <View style={styles.toggleSection}>
            <View style={styles.toggleHeader}>
              <Text style={styles.toggleQuestion}>Any Previous Year Loss to Carry Forward?</Text>
              <View style={styles.chipGroup}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasPreviousLoss", true)}
                  style={[styles.chip, formData.income.hasPreviousLoss ? styles.chipActive : null]}
                >
                  <Text style={[styles.chipText, formData.income.hasPreviousLoss ? styles.chipTextActive : null]}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateIncome("hasPreviousLoss", false)}
                  style={[styles.chip, !formData.income.hasPreviousLoss ? styles.chipActive : null]}
                >
                  <Text style={[styles.chipText, !formData.income.hasPreviousLoss ? styles.chipTextActive : null]}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {formData.income.hasPreviousLoss && (
              <View style={styles.conditionalFields}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Loss Amount (₹)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter loss amount"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={formData.income.carryForwardLossAmount}
                    onChangeText={(t) => updateIncome("carryForwardLossAmount", t)}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ========================================================
            SECTION 4: TAX DEDUCTED / PAID (TAX CREDITS)
        ======================================================== */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumberBadge}>
              <Text style={styles.sectionNumberText}>4</Text>
            </View>
            <Text style={styles.sectionTitle}>TDS & Taxes Paid (Tax Credits)</Text>
          </View>

          {/* Total TDS Deducted */}
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

          {/* TCS, Advance Tax, Self Assessment */}
          <View style={styles.fieldRow}>
            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>TCS (₹)</Text>
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

            <View style={[styles.fieldGroup, styles.fieldRowItem]}>
              <Text style={styles.fieldLabel}>Self Assessment (₹)</Text>
              <TextInput
                ref={selfTaxRef}
                style={styles.textInput}
                placeholder="Enter self tax"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={formData.income.selfAssessmentTaxPaid}
                onChangeText={(t) => updateIncome("selfAssessmentTaxPaid", t)}
                returnKeyType="done"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}>
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

export default TdsRefundEntryScreen;
