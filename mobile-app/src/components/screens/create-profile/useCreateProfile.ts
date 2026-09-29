import { useState, useRef, useEffect, useMemo } from "react";
import {
  Platform,
  Keyboard,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { biometricService } from "@/modules/authentication/services/biometricService";
import {
  sanitizePanInput,
  formatDobInput,
  validateField,
  checkFormValidity,
} from "./createProfileValidation";
import type { SignupForm, SignupErrors } from "./types";

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCreateProfile(
  currentStep: 1 | 2,
  setCurrentStep: (step: 1 | 2) => void
) {
  const router = useRouter();
  const params = useLocalSearchParams<{ customerType?: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const { register, mobileNumber: storeMobileNumber } = useAuthStore();

  // ─── Field Refs ──────────────────────────────────────────────────────────────
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

  // ─── UI State ────────────────────────────────────────────────────────────────
  const [showAddressLine2, setShowAddressLine2] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState<SignupErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // ─── Keyboard-aware scroll ───────────────────────────────────────────────────
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const fieldYOffsets = useRef<Record<string, number>>({});
  const activeFieldKey = useRef<string | null>(null);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      const h = e?.endCoordinates?.height || 280;
      setKeyboardHeight(h);
      activeFieldKey.current &&
        (() => {
          const y = fieldYOffsets.current[activeFieldKey.current!];
          y !== undefined &&
            scrollRef.current?.scrollTo({ y: Math.max(0, y - 70), animated: true });
        })();
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
      activeFieldKey.current = null;
    });

    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const handleFieldFocus = (fieldKey: string) => {
    activeFieldKey.current = fieldKey;
    const y = fieldYOffsets.current[fieldKey];
    y !== undefined &&
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: Math.max(0, y - 70), animated: true });
      }, 120);
  };

  // ─── Modal State ─────────────────────────────────────────────────────────────
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [stateSearchQuery, setStateSearchQuery] = useState("");

  // ─── Biometric State ─────────────────────────────────────────────────────────
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [biometricType, setBiometricType] = useState("Fingerprint");
  const [pendingPostRegistrationRoute, setPendingPostRegistrationRoute] =
    useState<string | null>(null);

  // ─── Calendar State ──────────────────────────────────────────────────────────
  const [pickerYear, setPickerYear] = useState(2000);
  const [pickerMonth, setPickerMonth] = useState(0);
  const [pickerDay, setPickerDay] = useState(1);

  // ─── Form State ──────────────────────────────────────────────────────────────
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
    params?.customerType &&
      params.customerType !== form.customerType &&
      setForm((p) => ({ ...p, customerType: params.customerType! }));
  }, [params?.customerType]);

  useEffect(() => {
    storeMobileNumber &&
      storeMobileNumber !== form.mobileNumber &&
      setForm((p) => ({ ...p, mobileNumber: storeMobileNumber }));
  }, [storeMobileNumber]);

  // ─── PAN Keyboard Type ───────────────────────────────────────────────────────
  const panKeyboardType: "default" | "number-pad" =
    form.pan.length >= 5 && form.pan.length < 9 ? "number-pad" : "default";

  // ─── PAN Sanitizer (functional, zero loops) ──────────────────────────────────
  const handlePanChange = (text: string) => {
    updateForm("pan", sanitizePanInput(text, form.pan));
  };

  // ─── Form Update with Inline Validation ──────────────────────────────────────
  const updateForm = (key: keyof SignupForm, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    profileErrors[key] && setProfileErrors((p) => ({ ...p, [key]: "" }));

    const updateMap: Partial<Record<keyof SignupForm, () => void>> = {
      pan: () => {
        const clean = val.trim().toUpperCase();
        clean.length === 10 &&
          setProfileErrors((p) => ({
            ...p,
            pan: /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(clean) ? "" : "Invalid PAN",
          }));
      },
      aadhaar: () => {
        const clean = val.replace(/\D/g, "");
        clean.length === 12 &&
          setProfileErrors((p) => ({
            ...p,
            aadhaar: /^[2-9]{1}[0-9]{11}$/.test(clean) ? "" : "Invalid Aadhaar",
          }));
      },
      pincode: () => {
        const clean = val.replace(/\D/g, "");
        clean.length === 6 && setProfileErrors((p) => ({ ...p, pincode: "" }));
      },
      password: () => {
        form.confirmPassword &&
          setProfileErrors((p) => ({
            ...p,
            confirmPassword: val === form.confirmPassword ? "" : "Passcodes do not match",
          }));
      },
      confirmPassword: () => {
        form.password &&
          setProfileErrors((p) => ({
            ...p,
            confirmPassword: val === form.password ? "" : "Passcodes do not match",
          }));
      },
    };

    updateMap[key]?.();
  };

  const handleBlur = (key: keyof SignupForm) => {
    const val = form[key];
    if (val && val.trim().length > 0) {
      const err = validateField(
        key,
        val,
        form.mobileNumber || storeMobileNumber,
        form.password
      );
      if (err) setProfileErrors((p) => ({ ...p, [key]: err }));
    }
  };

  // ─── DOB Handlers ────────────────────────────────────────────────────────────
  const handleDobChange = (text: string) => {
    updateForm("dob", formatDobInput(text));
  };

  const openCalendarModal = () => {
    Boolean(form.dob) &&
      (() => {
        const parts = form.dob.split("-");
        parts.length === 3 &&
          (() => {
            const d = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10) - 1;
            const y = parseInt(parts[2], 10);
            !isNaN(d) && !isNaN(m) && !isNaN(y) && y >= 1930 && y <= 2030 &&
              (setPickerDay(d), setPickerMonth(m), setPickerYear(y));
          })();
      })();
    setShowDatePicker(true);
  };

  const confirmCalendarDate = () => {
    const dayStr = String(pickerDay).padStart(2, "0");
    const monthStr = String(pickerMonth + 1).padStart(2, "0");
    updateForm("dob", `${dayStr}-${monthStr}-${String(pickerYear)}`);
    setShowDatePicker(false);
    setTimeout(() => fatherSpouseRef.current?.focus(), 150);
  };

  // ─── Form Validity (memoized) ────────────────────────────────────────────────
  const isFormValid = useMemo(() => {
    return checkFormValidity(
      form,
      agreedToTerms,
      form.mobileNumber || storeMobileNumber
    );
  }, [form, agreedToTerms, storeMobileNumber]);

  // ─── Step Navigation ─────────────────────────────────────────────────────────
  const handleProceedToRegistration = () => {
    !form.customerType
      ? Alert.alert("Account Type Required", "Please select an account type.")
      : (setCurrentStep(2), scrollRef.current?.scrollTo({ y: 0, animated: true }));
  };

  const handleBack = () => {
    currentStep === 2
      ? (setCurrentStep(1), scrollRef.current?.scrollTo({ y: 0, animated: true }))
      : router.back();
  };

  // ─── Registration API Call ───────────────────────────────────────────────────
  const executeRegistrationRequest = async () => {
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
      res.success
        ? (async () => {
            const pendingRoute = useAuthStore.getState().pendingServiceRoute;
            useAuthStore.getState().setPendingServiceRoute(null);
            const destination = pendingRoute || "/(main)/home";
            try {
              const hasHardware = await biometricService.checkHardwareSupport();
              const isEnrolled = await biometricService.checkEnrollment();
              const isAlreadyEnabled = await biometricService.isBiometricEnabled();
              hasHardware && isEnrolled && !isAlreadyEnabled
                ? (async () => {
                    const typeLabel = await biometricService.getBiometricTypeLabel();
                    setBiometricType(typeLabel);
                    setPendingPostRegistrationRoute(destination);
                    setShowBiometricModal(true);
                  })()
                : router.replace(destination as any);
              return;
            } catch {}
            router.replace(destination as any);
          })()
        : Alert.alert("Registration Error", res.error || "Failed to create account. Please try again.");
    } catch (err: any) {
      setProfileLoading(false);
      Alert.alert("Registration Error", err?.message || "An unexpected error occurred during registration.");
    }
  };

  // ─── Submit with Validation ──────────────────────────────────────────────────
  const fieldOrder: { key: keyof SignupForm; ref?: React.RefObject<TextInput | null> }[] = [
    { key: "name", ref: nameRef },
    { key: "email", ref: emailRef },
    { key: "gender" },
    { key: "dob", ref: dobRef },
    { key: "fatherSpouseName", ref: fatherSpouseRef },
    { key: "pan", ref: panRef },
    { key: "aadhaar", ref: aadhaarRef },
    { key: "addressLine1", ref: address1Ref },
    { key: "city", ref: cityRef },
    { key: "pincode", ref: pinRef },
    { key: "state" },
    { key: "password", ref: passcodeRef },
    { key: "confirmPassword", ref: confirmPasscodeRef },
  ];

  const submitValidatedForm = () => {
    const errs: SignupErrors = fieldOrder.reduce<SignupErrors>(
      (acc, item) => {
        const err = validateField(
          item.key,
          form[item.key],
          form.mobileNumber || storeMobileNumber,
          form.password
        );
        return err ? { ...acc, [item.key]: err } : acc;
      },
      agreedToTerms
        ? {}
        : { terms: "Please accept the Terms of Service and Privacy Policy to continue." }
    );

    const hasErrors = Object.keys(errs).length > 0;
    hasErrors
      ? (() => {
          setProfileErrors(errs);
          const firstInvalid = fieldOrder.find((item) => Boolean(errs[item.key]));
          firstInvalid
            ? (() => {
                const y = fieldYOffsets.current[firstInvalid.key];
                y !== undefined &&
                  scrollRef.current?.scrollTo({ y: Math.max(0, y - 70), animated: true });
                firstInvalid.ref?.current &&
                  setTimeout(() => firstInvalid.ref?.current?.focus(), 150);
              })()
            : errs.terms
              ? scrollRef.current?.scrollToEnd({ animated: true })
              : undefined;
        })()
      : executeRegistrationRequest();
  };

  const handleFinalRegistration = async () => {
    !form.customerType
      ? (Alert.alert("Account Type Required", "Please select an account type."), setCurrentStep(1))
      : submitValidatedForm();
  };

  // ─── Biometric Handlers ──────────────────────────────────────────────────────
  const handleEnableBiometric = async () => {
    setShowBiometricModal(false);
    try {
      const authRes = await biometricService.authenticate();
      authRes.success && (await useAuthStore.getState().setBiometricEnabled(true));
    } catch {}
    router.replace((pendingPostRegistrationRoute || "/(main)/home") as any);
  };

  const handleNotNowBiometric = () => {
    setShowBiometricModal(false);
    router.replace((pendingPostRegistrationRoute || "/(main)/home") as any);
  };

  // ─── Field Offset Setter (kept inside hook to satisfy React compiler) ─────────
  const setFieldOffset = (key: string, y: number) => {
    fieldYOffsets.current[key] = y;
  };

  // ─── Return ──────────────────────────────────────────────────────────────────
  return {
    form,
    updateForm,
    handlePanChange,
    handleDobChange,
    handleBlur,
    profileErrors,
    profileLoading,
    isFormValid,
    handleProceedToRegistration,
    handleFinalRegistration,
    handleBack,
    panKeyboardType,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    agreedToTerms,
    setAgreedToTerms,
    showAddressLine2,
    setShowAddressLine2,
    keyboardHeight,
    setFieldOffset,
    handleFieldFocus,
    scrollRef,
    nameRef,
    emailRef,
    dobRef,
    fatherSpouseRef,
    panRef,
    aadhaarRef,
    address1Ref,
    address2Ref,
    cityRef,
    pinRef,
    passcodeRef,
    confirmPasscodeRef,
    showDatePicker,
    setShowDatePicker,
    showGenderModal,
    setShowGenderModal,
    showStateModal,
    setShowStateModal,
    stateSearchQuery,
    setStateSearchQuery,
    showBiometricModal,
    biometricType,
    handleEnableBiometric,
    handleNotNowBiometric,
    pickerYear,
    setPickerYear,
    pickerMonth,
    setPickerMonth,
    pickerDay,
    setPickerDay,
    openCalendarModal,
    confirmCalendarDate,
  };
}
