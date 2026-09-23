import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  LayoutAnimation,
  Keyboard,
  BackHandler,
  type TextInputProps,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../hooks/use-theme";
import { BrandColors, Colors, BorderWidth, Spacing } from "../../shared/theme";
import { useAuthStore } from "../../store/authStore";
import { validatePasscode } from "../../modules/authentication/validation/authSchema";
import { biometricService } from "../../modules/authentication/services/biometricService";
import { BiometricPromptModal } from "../../shared/components/BiometricPromptModal";
import { styles } from "../../styles/app/(auth)/create-profile.styles";
import type { IconName } from "../../types/domain";

const HEADER_INSET_TOP_OFFSET = Spacing.sm; // 8
const MIN_HEADER_TOP = Spacing.xl; // 24

interface SignupForm {
  name: string;
  email: string;
  mobileNumber: string;
  gender: string;
  dob: string;
  fatherSpouseName: string;
  pan: string;
  aadhaar: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  pincode: string;
  state: string;
  password: string;
  confirmPassword: string;
  customerType: string;
}

type SignupErrors = Partial<Record<keyof SignupForm, string>>;

interface CustomerTypeOption {
  key: string;
  title: string;
  subtitle: string;
  icon: IconName;
}

const CUSTOMER_TYPE_OPTIONS: CustomerTypeOption[] = [
  {
    key: "Individual",
    title: "Individual",
    subtitle: "Salaried professionals & individual taxpayers",
    icon: "person-outline",
  },
  {
    key: "Proprietorship",
    title: "Proprietorship",
    subtitle: "Single-owner business entities & local shops",
    icon: "storefront-outline",
  },
  {
    key: "Partnership",
    title: "Partnership",
    subtitle: "Registered partnership firms with 2+ partners",
    icon: "people-outline",
  },
  {
    key: "LLP",
    title: "LLP",
    subtitle: "Limited Liability Partnership firms",
    icon: "shield-checkmark-outline",
  },
  {
    key: "Private Limited",
    title: "Private Limited",
    subtitle: "Pvt Ltd companies & scalable startups",
    icon: "business-outline",
  },
  {
    key: "Public Limited",
    title: "Public Limited",
    subtitle: "Publicly traded or listed corporations",
    icon: "podium-outline",
  },
  {
    key: "HUF",
    title: "HUF",
    subtitle: "Hindu Undivided Family tax units",
    icon: "home-outline",
  },
  {
    key: "AOP / BOI",
    title: "AOP / BOI",
    subtitle: "Association of Persons or Body of Individuals",
    icon: "layers-outline",
  },
  {
    key: "Freelancer",
    title: "Freelancer",
    subtitle: "Independent contractors, gig workers & consultants",
    icon: "laptop-outline",
  },
  {
    key: "NGO / Trust",
    title: "NGO / Trust",
    subtitle: "Non-profit entities, trusts & societies",
    icon: "heart-outline",
  },
];

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const INDIAN_STATES_AND_UTS = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCT)",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function CreateProfileScreen() {
  const colors = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ customerType?: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const { register, mobileNumber: storeMobileNumber } = useAuthStore();

  // 2-Step Navigation: Step 1 = Type of User (Account Type), Step 2 = Full Registration Form
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Hardware Back Button listener for Android: Step 2 returns to Step 1
  useEffect(() => {
    const onBackPress = () => {
      if (currentStep === 2) {
        setCurrentStep(1);
        scrollRef.current?.scrollTo({ y: 0, animated: true });
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [currentStep]);

  // Input Refs for smooth keyboard navigation
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const dobRef = useRef<TextInput>(null);
  const fatherSpouseRef = useRef<TextInput>(null);
  const panRef = useRef<TextInput>(null);
  const aadhaarRef = useRef<TextInput>(null);
  const address1Ref = useRef<TextInput>(null);
  const address2Ref = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const pinRef = useRef<TextInput>(null);
  const passcodeRef = useRef<TextInput>(null);
  const confirmPasscodeRef = useRef<TextInput>(null);

  // Expandable Address Line 2 state
  const [showAddressLine2, setShowAddressLine2] = useState(false);

  // Form states
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState<SignupErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Modals
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [stateSearchQuery, setStateSearchQuery] = useState("");

  // Biometric prompt state
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [biometricType, setBiometricType] = useState("Fingerprint");
  const [pendingPostRegistrationRoute, setPendingPostRegistrationRoute] = useState<string | null>(null);

  // Calendar states
  const [pickerYear, setPickerYear] = useState(2000);
  const [pickerMonth, setPickerMonth] = useState(0);
  const [pickerDay, setPickerDay] = useState(1);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const autoMobile = storeMobileNumber || "";

  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    mobileNumber: autoMobile,
    gender: "",
    dob: "",
    fatherSpouseName: "",
    pan: "",
    aadhaar: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    pincode: "",
    state: "",
    password: "",
    confirmPassword: "",
    customerType: params.customerType || "Individual",
  });

  useEffect(() => {
    if (params?.customerType && params.customerType !== form.customerType) {
      setForm((p) => ({ ...p, customerType: params.customerType! }));
    }
  }, [params?.customerType]);

  useEffect(() => {
    if (storeMobileNumber && storeMobileNumber !== form.mobileNumber) {
      setForm((p) => ({ ...p, mobileNumber: storeMobileNumber }));
    }
  }, [storeMobileNumber]);

  const updateForm = (key: keyof SignupForm, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));

    if (profileErrors[key]) {
      setProfileErrors((p) => ({ ...p, [key]: "" }));
    }

    if (key === "pan") {
      const clean = val.trim().toUpperCase();
      if (clean.length === 10) {
        setProfileErrors((p) => ({
          ...p,
          pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(clean) ? "" : "Invalid PAN",
        }));
      }
    } else if (key === "aadhaar") {
      const clean = val.replace(/\D/g, "");
      if (clean.length === 12) {
        setProfileErrors((p) => ({
          ...p,
          aadhaar: /^[2-9]{1}[0-9]{11}$/.test(clean) ? "" : "Invalid Aadhaar",
        }));
      }
    } else if (key === "pincode") {
      const clean = val.replace(/\D/g, "");
      if (clean.length === 6) {
        setProfileErrors((p) => ({ ...p, pincode: "" }));
      }
    } else if (key === "password" || key === "confirmPassword") {
      const activeMobile = form.mobileNumber || storeMobileNumber;
      if (key === "password") {
        const clean = val.replace(/\D/g, "");
        if (clean.length === 6) {
          const v = validatePasscode(clean, activeMobile);
          setProfileErrors((p) => ({
            ...p,
            password: v.valid ? "" : (v.error || "Invalid passcode"),
          }));
        } else {
          setProfileErrors((p) => ({ ...p, password: "" }));
        }
        if (form.confirmPassword) {
          setProfileErrors((p) => ({
            ...p,
            confirmPassword: val === form.confirmPassword ? "" : "Passcodes do not match",
          }));
        }
      } else if (key === "confirmPassword" && form.password) {
        setProfileErrors((p) => ({
          ...p,
          confirmPassword: val === form.password ? "" : "Passcodes do not match",
        }));
      }
    }
  };

  const validateField = (key: keyof SignupForm, val: string): string => {
    switch (key) {
      case "name":
        return val.trim() ? "" : "Required";
      case "email": {
        const clean = val.trim();
        if (!clean) return "Required";
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(clean)) {
          return "Invalid email";
        }
        return "";
      }
      case "gender":
        return val ? "" : "Required";
      case "dob":
        return val.trim() ? "" : "Required";
      case "fatherSpouseName":
        return val.trim() ? "" : "Required";
      case "pan": {
        const clean = val.trim().toUpperCase();
        if (!clean) return "Required";
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(clean)) {
          return "Invalid PAN";
        }
        return "";
      }
      case "aadhaar": {
        const clean = val.replace(/\D/g, "");
        if (!clean) return "Required";
        if (clean.length !== 12 || !/^[2-9]{1}[0-9]{11}$/.test(clean)) {
          return "Invalid Aadhaar";
        }
        return "";
      }
      case "addressLine1":
        return val.trim() ? "" : "Required";
      case "city":
        return val.trim() ? "" : "Required";
      case "pincode": {
        const clean = val.replace(/\D/g, "");
        if (!clean) return "Required";
        if (clean.length !== 6) return "PIN Code must be 6 digits";
        return "";
      }
      case "state":
        return val ? "" : "Required";
      case "password": {
        if (!val) return "Required";
        if (val.length < 6) return "Passcode must be 6 digits";
        const v = validatePasscode(val, form.mobileNumber || storeMobileNumber);
        if (!v.valid) return v.error || "Invalid passcode";
        return "";
      }
      case "confirmPassword": {
        if (!val) return "Required";
        if (val !== form.password) return "Passcodes do not match";
        return "";
      }
      case "customerType":
        return val ? "" : "Required";
      default:
        return "";
    }
  };

  const handleBlur = (key: keyof SignupForm) => {
    const val = form[key];
    if (val && val.trim().length > 0) {
      const err = validateField(key, val);
      if (err) {
        setProfileErrors((p) => ({ ...p, [key]: err }));
      }
    }
  };

  const handleDobChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, "");
    let formatted = digits;
    if (digits.length > 2 && digits.length <= 4) {
      formatted = `${digits.slice(0, 2)}-${digits.slice(2)}`;
    } else if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 8)}`;
    }
    updateForm("dob", formatted);
  };

  const openCalendarModal = () => {
    if (form.dob) {
      const parts = form.dob.split("-");
      if (parts.length === 3) {
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const y = parseInt(parts[2], 10);
        if (!isNaN(d) && !isNaN(m) && !isNaN(y) && y >= 1930 && y <= 2030) {
          setPickerDay(d);
          setPickerMonth(m);
          setPickerYear(y);
        }
      }
    }
    setShowDatePicker(true);
  };

  const confirmCalendarDate = () => {
    const dayStr = String(pickerDay).padStart(2, "0");
    const monthStr = String(pickerMonth + 1).padStart(2, "0");
    const yearStr = String(pickerYear);
    updateForm("dob", `${dayStr}-${monthStr}-${yearStr}`);
    setShowDatePicker(false);
    setTimeout(() => fatherSpouseRef.current?.focus(), 150);
  };

  // Screen 1: Complete Form Validity Check for Continue button
  const isScreen1Valid = useMemo(() => {
    const hasName = Boolean(form.name.trim());
    const hasEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      form.email.trim()
    );
    const hasGender = Boolean(form.gender);
    const hasDob = Boolean(form.dob.trim());
    const hasFatherSpouse = Boolean(form.fatherSpouseName.trim());
    const hasPan = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(
      form.pan.trim().toUpperCase()
    );
    const hasAadhaar = /^[2-9]{1}[0-9]{11}$/.test(
      form.aadhaar.replace(/\D/g, "")
    );
    const hasAddress1 = Boolean(form.addressLine1.trim());
    const hasCity = Boolean(form.city.trim());
    const hasPincode = form.pincode.replace(/\D/g, "").length === 6;
    const hasState = Boolean(form.state);
    const hasPasscode =
      validatePasscode(form.password, form.mobileNumber || storeMobileNumber).valid;
    const hasConfirmPasscode =
      form.confirmPassword === form.password && form.confirmPassword.length === 6;

    return (
      hasName &&
      hasEmail &&
      hasGender &&
      hasDob &&
      hasFatherSpouse &&
      hasPan &&
      hasAadhaar &&
      hasAddress1 &&
      hasCity &&
      hasPincode &&
      hasState &&
      hasPasscode &&
      hasConfirmPasscode &&
      agreedToTerms
    );
  }, [form, agreedToTerms]);

  // Navigate from Step 1 (Select Account Type) to Step 2 (Registration Form)
  const handleProceedToRegistration = () => {
    if (!form.customerType) {
      Alert.alert("Account Type Required", "Please select an account type.");
      return;
    }

    setCurrentStep(2);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  // Step 2: Submit Full Registration Payload to Backend
  const handleFinalRegistration = async () => {
    if (!form.customerType) {
      Alert.alert("Account Type Required", "Please select an account type.");
      setCurrentStep(1);
      return;
    }

    const requiredKeys: (keyof SignupForm)[] = [
      "name",
      "email",
      "gender",
      "dob",
      "fatherSpouseName",
      "pan",
      "aadhaar",
      "addressLine1",
      "city",
      "pincode",
      "state",
      "password",
      "confirmPassword",
    ];

    const errs: SignupErrors = {};
    requiredKeys.forEach((k) => {
      const err = validateField(k, form[k]);
      if (err) errs[k] = err;
    });

    if (!agreedToTerms) {
      Alert.alert(
        "Terms Required",
        "Please accept the Terms of Service and Privacy Policy to continue."
      );
      return;
    }

    if (Object.keys(errs).length > 0) {
      setProfileErrors(errs);
      Alert.alert(
        "Incomplete Form",
        "Please fill in all required fields."
      );
      return;
    }

    setProfileLoading(true);

    const fullAddress = [
      form.addressLine1.trim(),
      form.addressLine2.trim(),
      form.city.trim(),
      form.state.trim()
        ? `${form.state.trim()} - ${form.pincode.trim()}`
        : form.pincode.trim(),
    ]
      .filter(Boolean)
      .join(", ");

    try {
      const res = await register(
        {
          name: form.name.trim(),
          email: form.email.trim(),
          customerType: form.customerType,
          dob: form.dob.trim(),
          gender: form.gender,
          fatherSpouseName: form.fatherSpouseName.trim(),
          pan: form.pan.trim().toUpperCase(),
          aadhaar: form.aadhaar.replace(/\D/g, ""),
          address: fullAddress,
          addressLine1: form.addressLine1.trim(),
          addressLine2: form.addressLine2.trim(),
          city: form.city.trim(),
          pincode: form.pincode.trim(),
          state: form.state.trim(),
          mobileNumber: form.mobileNumber || storeMobileNumber,
        } as any,
        form.password.trim(),
        true
      );

      setProfileLoading(false);
      if (res.success) {
        const pendingRoute = useAuthStore.getState().pendingServiceRoute;
        useAuthStore.getState().setPendingServiceRoute(null);
        const destination = pendingRoute || "/(main)/home";

        try {
          const hasHardware = await biometricService.checkHardwareSupport();
          const isEnrolled = await biometricService.checkEnrollment();
          const isAlreadyEnabled = await biometricService.isBiometricEnabled();

          if (hasHardware && isEnrolled && !isAlreadyEnabled) {
            const typeLabel = await biometricService.getBiometricTypeLabel();
            setBiometricType(typeLabel);
            setPendingPostRegistrationRoute(destination);
            setShowBiometricModal(true);
            return;
          }
        } catch {}

        router.replace(destination as any);
      } else {
        Alert.alert(
          "Registration Error",
          res.error || "Failed to create account. Please try again."
        );
      }
    } catch (err: any) {
      setProfileLoading(false);
      Alert.alert(
        "Registration Error",
        err?.message || "An unexpected error occurred during registration."
      );
    }
  };

  const handleEnableBiometric = async () => {
    setShowBiometricModal(false);
    try {
      const authRes = await biometricService.authenticate();
      if (authRes.success) {
        await useAuthStore.getState().setBiometricEnabled(true);
      }
    } catch {}
    const destination = pendingPostRegistrationRoute || "/(main)/home";
    router.replace(destination as any);
  };

  const handleNotNowBiometric = () => {
    setShowBiometricModal(false);
    const destination = pendingPostRegistrationRoute || "/(main)/home";
    router.replace(destination as any);
  };

  // Back Button handler
  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      router.back();
    }
  };

  // Filtered Indian States
  const filteredStates = useMemo(() => {
    if (!stateSearchQuery.trim()) return INDIAN_STATES_AND_UTS;
    const q = stateSearchQuery.toLowerCase();
    return INDIAN_STATES_AND_UTS.filter((s) => s.toLowerCase().includes(q));
  }, [stateSearchQuery]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      style={[styles.container, { backgroundColor: BrandColors.BACKGROUND }]}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.profileScroll,
          {
            paddingBottom:
              currentStep === 1
                ? Math.max(insets.bottom + 90, 110)
                : Math.max(insets.bottom + Spacing.xl, 40),
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={true}
      >
        {/* Top Wave Header */}
        <View style={styles.waveHeaderWrapper}>
          <Svg
            height={150}
            width="100%"
            viewBox="0 0 375 150"
            style={StyleSheet.absoluteFill}
            preserveAspectRatio="none"
          >
            {/* Navy Blue Curved Base */}
            <Path
              d="M0,0 L375,0 L375,100 C310,140 230,135 140,115 C60,95 20,110 0,120 Z"
              fill={BrandColors.PRIMARY_BLUE_DARK}
            />
            {/* Orange Wave on Top Right */}
            <Path
              d="M260,0 C295,35 335,55 375,58 L375,0 Z"
              fill={BrandColors.PRIMARY_ORANGE}
            />
          </Svg>

          {/* Back Arrow & Centered Title Only */}
          <View
            style={[
              styles.waveHeaderContent,
              { paddingTop: Math.max(insets.top + HEADER_INSET_TOP_OFFSET, MIN_HEADER_TOP) },
            ]}
          >
            <View style={styles.headerRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleBack}
                style={styles.backBtnWhite}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons name="arrow-back" size={24} color={BrandColors.WHITE} />
              </TouchableOpacity>

              <Text style={styles.headerTitleWhite}>
                {currentStep === 1 ? "Select Account Type" : "Create Account"}
              </Text>
            </View>
          </View>
        </View>

        {/* ============================================================= */}
        {/* STEP 1: TYPE OF USER / ACCOUNT TYPE SELECTION                 */}
        {/* ============================================================= */}
        {currentStep === 1 && (
          <View style={styles.customerTypeContainer}>
            {/* 10 Modern Customer Type Option Cards */}
            {CUSTOMER_TYPE_OPTIONS.map((opt) => {
              const isSelected = form.customerType === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  activeOpacity={0.8}
                  onPress={() => updateForm("customerType", opt.key)}
                  style={[
                    styles.customerTypeCard,
                    isSelected && styles.customerTypeCardSelected,
                  ]}
                >
                  <View
                    style={[
                      styles.cardIconContainer,
                      isSelected && styles.cardIconContainerSelected,
                    ]}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={22}
                      color={
                        isSelected
                          ? BrandColors.PRIMARY_ORANGE
                          : BrandColors.PRIMARY_BLUE
                      }
                    />
                  </View>

                  <View style={styles.cardContent}>
                    <Text
                      style={[
                        styles.cardTitle,
                        isSelected && styles.cardTitleSelected,
                      ]}
                    >
                      {opt.title}
                    </Text>
                    <Text style={styles.cardSubtitle}>{opt.subtitle}</Text>
                  </View>

                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                    ]}
                  >
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={BrandColors.WHITE}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ============================================================= */}
        {/* STEP 2: COMPLETE REGISTRATION FORM (ONE SCROLLABLE PAGE)       */}
        {/* ============================================================= */}
        {currentStep === 2 && (
          <View style={styles.formSection}>
            {/* Selected Account Type Badge */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setCurrentStep(1);
                scrollRef.current?.scrollTo({ y: 0, animated: true });
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#EFF6FF",
                borderWidth: 1,
                borderColor: "#BFDBFE",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginBottom: 16,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Ionicons name="briefcase-outline" size={20} color={BrandColors.PRIMARY_BLUE} />
                <View>
                  <Text style={{ fontSize: 11, color: "#64748B", fontWeight: "600", textTransform: "uppercase" }}>
                    Account Type
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: BrandColors.PRIMARY_BLUE_DARK }}>
                    {form.customerType || "Individual"}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: BrandColors.PRIMARY_ORANGE }}>
                  Change
                </Text>
                <Ionicons name="chevron-forward" size={14} color={BrandColors.PRIMARY_ORANGE} />
              </View>
            </TouchableOpacity>

            {/* Full Name */}
            <Field
              ref={nameRef}
              label="Full Name"
              leftIcon="person-outline"
              value={form.name}
              onChangeText={(t) => updateForm("name", t)}
              onBlur={() => handleBlur("name")}
              placeholder="Full Name"
              error={profileErrors.name}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />

            {/* Email */}
            <Field
              ref={emailRef}
              label="Email"
              leftIcon="mail-outline"
              value={form.email}
              onChangeText={(t) => updateForm("email", t)}
              onBlur={() => handleBlur("email")}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={profileErrors.email}
              returnKeyType="next"
              onSubmitEditing={() => setShowGenderModal(true)}
            />

            {/* Gender */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Gender</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowGenderModal(true)}
                style={[
                  styles.inputBox,
                  profileErrors.gender
                    ? { borderColor: Colors.error, backgroundColor: "#FEF2F2" }
                    : null,
                ]}
              >
                <Ionicons
                  name="transgender-outline"
                  size={20}
                  color={BrandColors.PRIMARY_ORANGE}
                  style={styles.leftIcon}
                />
                <Text
                  style={[
                    styles.dropdownText,
                    !form.gender && { color: BrandColors.TEXT_MUTED },
                  ]}
                >
                  {form.gender || "Gender"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={BrandColors.TEXT_SECONDARY}
                  style={styles.rightIcon}
                />
              </TouchableOpacity>
              {profileErrors.gender ? (
                <Text style={styles.errorText}>{profileErrors.gender}</Text>
              ) : null}
            </View>

            {/* Date of Birth */}
            <Field
              ref={dobRef}
              label="Date of Birth"
              leftIcon="calendar-outline"
              value={form.dob}
              onChangeText={handleDobChange}
              placeholder="DD-MM-YYYY"
              keyboardType="number-pad"
              maxLength={10}
              rightIcon="calendar-outline"
              onRightIconPress={openCalendarModal}
              error={profileErrors.dob}
              returnKeyType="next"
              onSubmitEditing={() => fatherSpouseRef.current?.focus()}
            />

            {/* Father's / Spouse Name */}
            <Field
              ref={fatherSpouseRef}
              label="Father's / Spouse Name"
              leftIcon="people-outline"
              value={form.fatherSpouseName}
              onChangeText={(t) => updateForm("fatherSpouseName", t)}
              onBlur={() => handleBlur("fatherSpouseName")}
              placeholder="Father's / Spouse Name"
              error={profileErrors.fatherSpouseName}
              returnKeyType="next"
              onSubmitEditing={() => panRef.current?.focus()}
            />

            {/* PAN Number */}
            <Field
              ref={panRef}
              label="PAN Number"
              leftIcon="card-outline"
              value={form.pan}
              onChangeText={(t) => updateForm("pan", t.toUpperCase())}
              onBlur={() => handleBlur("pan")}
              placeholder="PAN Number"
              autoCapitalize="characters"
              maxLength={10}
              error={profileErrors.pan}
              returnKeyType="next"
              onSubmitEditing={() => aadhaarRef.current?.focus()}
            />

            {/* Aadhaar Number */}
            <Field
              ref={aadhaarRef}
              label="Aadhaar Number"
              leftIcon="newspaper-outline"
              value={form.aadhaar}
              onChangeText={(t) =>
                updateForm("aadhaar", t.replace(/\D/g, "").slice(0, 12))
              }
              onBlur={() => handleBlur("aadhaar")}
              placeholder="Aadhaar Number"
              keyboardType="number-pad"
              maxLength={12}
              error={profileErrors.aadhaar}
              returnKeyType="next"
              onSubmitEditing={() => address1Ref.current?.focus()}
            />

            {/* Address Line 1 */}
            <Field
              ref={address1Ref}
              label="Address Line 1 *"
              labelRightElement={
                !showAddressLine2 ? (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      LayoutAnimation.configureNext(
                        LayoutAnimation.Presets.easeInEaseOut
                      );
                      setShowAddressLine2(true);
                      setTimeout(() => address2Ref.current?.focus(), 150);
                    }}
                    style={styles.addAddressLineBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name="add"
                      size={16}
                      color={BrandColors.PRIMARY_ORANGE}
                    />
                    <Text style={styles.addAddressLineBtnText}>Add Line 2</Text>
                  </TouchableOpacity>
                ) : null
              }
              leftIcon="home-outline"
              value={form.addressLine1}
              onChangeText={(t) => updateForm("addressLine1", t)}
              onBlur={() => handleBlur("addressLine1")}
              placeholder="House / Building / Street"
              error={profileErrors.addressLine1}
              returnKeyType="next"
              onSubmitEditing={() => {
                if (showAddressLine2) {
                  address2Ref.current?.focus();
                } else {
                  cityRef.current?.focus();
                }
              }}
            />

            {/* Address Line 2 (Only if expanded) */}
            {showAddressLine2 && (
              <Field
                ref={address2Ref}
                label="Address Line 2 (Optional)"
                leftIcon="location-outline"
                value={form.addressLine2}
                onChangeText={(t) => updateForm("addressLine2", t)}
                placeholder="Locality, Landmark"
                returnKeyType="next"
                onSubmitEditing={() => cityRef.current?.focus()}
              />
            )}

            {/* City & PIN Code (Side by side on the same row) */}
            <View style={styles.cityPinRow}>
              <View style={styles.cityCol}>
                <Field
                  ref={cityRef}
                  label="City"
                  leftIcon="business-outline"
                  value={form.city}
                  onChangeText={(t) => updateForm("city", t)}
                  onBlur={() => handleBlur("city")}
                  placeholder="City"
                  error={profileErrors.city}
                  returnKeyType="next"
                  onSubmitEditing={() => pinRef.current?.focus()}
                />
              </View>

              <View style={styles.pinCol}>
                <Field
                  ref={pinRef}
                  label="PIN Code"
                  leftIcon="pin-outline"
                  value={form.pincode}
                  onChangeText={(t) =>
                    updateForm("pincode", t.replace(/\D/g, "").slice(0, 6))
                  }
                  onBlur={() => handleBlur("pincode")}
                  placeholder="PIN Code"
                  keyboardType="number-pad"
                  maxLength={6}
                  error={profileErrors.pincode}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    setStateSearchQuery("");
                    setShowStateModal(true);
                  }}
                />
              </View>
            </View>

            {/* State / UT */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>State / UT</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setStateSearchQuery("");
                  setShowStateModal(true);
                }}
                style={[
                  styles.inputBox,
                  profileErrors.state
                    ? { borderColor: Colors.error, backgroundColor: "#FEF2F2" }
                    : null,
                ]}
              >
                <Ionicons
                  name="map-outline"
                  size={20}
                  color={BrandColors.PRIMARY_ORANGE}
                  style={styles.leftIcon}
                />
                <Text
                  style={[
                    styles.dropdownText,
                    !form.state && { color: BrandColors.TEXT_MUTED },
                  ]}
                >
                  {form.state || "State / UT"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={BrandColors.TEXT_SECONDARY}
                  style={styles.rightIcon}
                />
              </TouchableOpacity>
              {profileErrors.state ? (
                <Text style={styles.errorText}>{profileErrors.state}</Text>
              ) : null}
            </View>

            {/* Passcode */}
            <Field
              ref={passcodeRef}
              label="Passcode"
              leftIcon="lock-closed-outline"
              value={form.password}
              onChangeText={(t) =>
                updateForm("password", t.replace(/\D/g, "").slice(0, 6))
              }
              onBlur={() => handleBlur("password")}
              placeholder="Passcode"
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowPassword((prev) => !prev)}
              error={profileErrors.password}
              returnKeyType="next"
              onSubmitEditing={() => confirmPasscodeRef.current?.focus()}
            />

            {/* Confirm Passcode */}
            <Field
              ref={confirmPasscodeRef}
              label="Confirm Passcode"
              leftIcon="lock-closed-outline"
              value={form.confirmPassword}
              onChangeText={(t) =>
                updateForm("confirmPassword", t.replace(/\D/g, "").slice(0, 6))
              }
              onBlur={() => handleBlur("confirmPassword")}
              placeholder="Confirm Passcode"
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry={!showConfirmPassword}
              rightIcon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowConfirmPassword((prev) => !prev)}
              error={profileErrors.confirmPassword}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />

            {/* Terms Checkbox */}
            <View style={styles.termsRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setAgreedToTerms((prev) => !prev)}
                style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}
              >
                {agreedToTerms && (
                  <Ionicons name="checkmark" size={16} color={BrandColors.WHITE} />
                )}
              </TouchableOpacity>

              <Text style={styles.termsText}>
                By creating an account, I agree to the{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() =>
                    Alert.alert(
                      "Terms of Service",
                      "By using TaxEdge, you agree to statutory Indian tax filing and compliance guidelines, confidential credential management, and authorized tax representation."
                    )
                  }
                >
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() =>
                    Alert.alert(
                      "Privacy Policy",
                      "TaxEdge uses bank-grade 256-bit encryption to safeguard your PAN, Aadhaar, and financial records. We do not sell your data to third parties."
                    )
                  }
                >
                  Privacy Policy
                </Text>
                .
              </Text>
            </View>

            {/* Create Account / Final Registration Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleFinalRegistration}
              disabled={!isScreen1Valid || profileLoading}
              style={[
                styles.submitBtnOrange,
                (!isScreen1Valid || profileLoading) && styles.submitBtnDisabled,
              ]}
            >
              {profileLoading ? (
                <ActivityIndicator color={BrandColors.WHITE} size="small" />
              ) : (
                <Text
                  style={[
                    styles.submitBtnText,
                    (!isScreen1Valid || profileLoading) && styles.submitBtnTextDisabled,
                  ]}
                >
                  Create Account
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Button for Step 1: Continue to Registration */}
      {currentStep === 1 && (
        <View
          style={[
            styles.fixedBottomBar,
            {
              paddingBottom: Math.max(insets.bottom + Spacing.sm, Spacing.base),
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleProceedToRegistration}
            disabled={!form.customerType}
            style={styles.submitBtnOrange}
          >
            <Text style={styles.submitBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Calendar Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.calendarModalContent,
              { backgroundColor: colors.backgroundElement },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.calendarHeader}>
              <Text style={[styles.calendarTitle, { color: BrandColors.PRIMARY_BLUE }]}>
                Select Date of Birth
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Month & Year Bar */}
            <View style={styles.monthYearNav}>
              <TouchableOpacity
                onPress={() => {
                  if (pickerMonth === 0) {
                    setPickerMonth(11);
                    setPickerYear((y) => y - 1);
                  } else {
                    setPickerMonth((m) => m - 1);
                  }
                }}
                style={styles.navArrow}
              >
                <Ionicons
                  name="chevron-back"
                  size={18}
                  color={BrandColors.PRIMARY_BLUE}
                />
              </TouchableOpacity>

              <View style={styles.monthYearDisplay}>
                <Text
                  style={[
                    styles.monthYearText,
                    { color: BrandColors.PRIMARY_BLUE },
                  ]}
                >
                  {months[pickerMonth]} {pickerYear}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (pickerMonth === 11) {
                    setPickerMonth(0);
                    setPickerYear((y) => y + 1);
                  } else {
                    setPickerMonth((m) => m + 1);
                  }
                }}
                style={styles.navArrow}
              >
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={BrandColors.PRIMARY_BLUE}
                />
              </TouchableOpacity>
            </View>

            {/* Fast Year Switcher Chips */}
            <View style={styles.yearQuickRow}>
              {[-10, -5, +5, +10].map((offset) => (
                <TouchableOpacity
                  key={offset}
                  onPress={() => setPickerYear((y) => y + offset)}
                  style={styles.yearChip}
                >
                  <Text style={styles.yearChipText}>
                    {offset > 0 ? `+${offset}` : offset} Yrs
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Weekday headers */}
            <View style={styles.weekdaysRow}>
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <Text key={d} style={styles.weekdayText}>
                  {d}
                </Text>
              ))}
            </View>

            {/* Days Grid */}
            <View style={styles.daysGrid}>
              {Array.from({
                length: new Date(pickerYear, pickerMonth, 1).getDay(),
              }).map((_, i) => (
                <View key={`empty-${i}`} style={styles.dayCellEmpty} />
              ))}

              {Array.from({
                length: new Date(pickerYear, pickerMonth + 1, 0).getDate(),
              }).map((_, i) => {
                const dayNum = i + 1;
                const isSelected = pickerDay === dayNum;
                return (
                  <TouchableOpacity
                    key={`day-${dayNum}`}
                    onPress={() => setPickerDay(dayNum)}
                    style={[
                      styles.dayCell,
                      isSelected && {
                        backgroundColor: BrandColors.PRIMARY_BLUE,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayCellText,
                        {
                          color: isSelected ? BrandColors.WHITE : colors.text,
                        },
                      ]}
                    >
                      {dayNum}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Modal Action Buttons */}
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                style={[styles.modalCancelBtn, { borderColor: "#BFDBFE" }]}
              >
                <Text style={[styles.modalCancelText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmCalendarDate}
                style={[
                  styles.modalConfirmBtn,
                  { backgroundColor: BrandColors.PRIMARY_ORANGE },
                ]}
              >
                <Text style={styles.modalConfirmText}>Apply Date</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Gender Selection Modal */}
      <Modal
        visible={showGenderModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.genderModalContent}>
            <View style={styles.calendarHeader}>
              <Text
                style={[
                  styles.calendarTitle,
                  { color: BrandColors.PRIMARY_BLUE_DARK },
                ]}
              >
                Select Gender
              </Text>
              <TouchableOpacity
                onPress={() => setShowGenderModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {GENDER_OPTIONS.map((g) => {
              const isSelected = form.gender === g;
              return (
                <TouchableOpacity
                  key={g}
                  activeOpacity={0.7}
                  onPress={() => {
                    updateForm("gender", g);
                    setShowGenderModal(false);
                    setTimeout(() => dobRef.current?.focus(), 150);
                  }}
                  style={[
                    styles.genderOption,
                    isSelected && styles.genderOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.genderOptionText,
                      isSelected && styles.genderOptionTextSelected,
                    ]}
                  >
                    {g}
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
            })}
          </View>
        </View>
      </Modal>

      {/* State / UT Selection Modal */}
      <Modal
        visible={showStateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.stateModalContent}>
            <View style={styles.calendarHeader}>
              <Text
                style={[
                  styles.calendarTitle,
                  { color: BrandColors.PRIMARY_BLUE_DARK },
                ]}
              >
                Select State / UT
              </Text>
              <TouchableOpacity
                onPress={() => setShowStateModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Search Box */}
            <View style={styles.stateSearchBox}>
              <Ionicons
                name="search-outline"
                size={18}
                color={BrandColors.TEXT_MUTED}
              />
              <TextInput
                style={styles.stateSearchInput}
                value={stateSearchQuery}
                onChangeText={setStateSearchQuery}
                placeholder="Search State / UT"
                placeholderTextColor={BrandColors.TEXT_MUTED}
              />
              {stateSearchQuery ? (
                <TouchableOpacity onPress={() => setStateSearchQuery("")}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* State List */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredStates.map((s) => {
                const isSelected = form.state === s;
                return (
                  <TouchableOpacity
                    key={s}
                    activeOpacity={0.7}
                    onPress={() => {
                      updateForm("state", s);
                      setShowStateModal(false);
                      setTimeout(() => passcodeRef.current?.focus(), 150);
                    }}
                    style={[
                      styles.stateItem,
                      isSelected && styles.stateItemSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stateItemText,
                        isSelected && styles.stateItemTextSelected,
                      ]}
                    >
                      {s}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={BrandColors.PRIMARY_ORANGE}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Biometric Enable Prompt Modal */}
      <BiometricPromptModal
        visible={showBiometricModal}
        biometricType={biometricType}
        onEnable={handleEnableBiometric}
        onNotNow={handleNotNowBiometric}
      />
    </KeyboardAvoidingView>
  );
}

interface FieldProps
  extends Omit<
    TextInputProps,
    "value" | "onChangeText" | "placeholder" | "style" | "onBlur"
  > {
  label?: string;
  labelRightElement?: React.ReactNode;
  leftIcon?: IconName;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  error?: string;
}

const Field = React.forwardRef<TextInput, FieldProps>(function Field(
  {
    label,
    labelRightElement,
    leftIcon,
    value,
    onChangeText,
    onBlur,
    placeholder,
    rightIcon,
    onRightIconPress,
    error,
    keyboardType,
    maxLength,
    returnKeyType,
    onSubmitEditing,
    ...props
  },
  ref
) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.fieldContainer}>
      {label ? (
        labelRightElement ? (
          <View style={styles.labelWithActionRow}>
            <Text style={styles.label}>{label}</Text>
            {labelRightElement}
          </View>
        ) : (
          <Text style={styles.label}>{label}</Text>
        )
      ) : null}
      <View
        style={[
          styles.inputBox,
          error
            ? {
                borderColor: Colors.error,
                backgroundColor: "#FEF2F2",
              }
            : {
                borderColor: isFocused
                  ? BrandColors.PRIMARY_ORANGE
                  : BrandColors.BORDER,
                backgroundColor: BrandColors.WHITE,
              },
          {
            borderWidth: isFocused || error ? BorderWidth.regular : BorderWidth.thin,
          },
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={error ? Colors.error : BrandColors.PRIMARY_ORANGE}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          ref={ref}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (onBlur) onBlur();
          }}
          placeholder={placeholder}
          placeholderTextColor={BrandColors.TEXT_MUTED}
          keyboardType={keyboardType}
          maxLength={maxLength}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          {...props}
        />
        {rightIcon &&
          (onRightIconPress ? (
            <TouchableOpacity
              onPress={onRightIconPress}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.rightIconTouch}
            >
              <Ionicons
                name={rightIcon}
                size={20}
                color={BrandColors.TEXT_SECONDARY}
              />
            </TouchableOpacity>
          ) : (
            <Ionicons
              name={rightIcon}
              size={18}
              color={BrandColors.TEXT_SECONDARY}
              style={styles.rightIcon}
            />
          ))}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
});
