import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import { BrandColors } from "@/shared/theme";
import { GstValidators } from "@/modules/gst/utils/gstValidators";
import { pickImageFromGallery, pickImageFromCamera } from "@/modules/gst/utils/imageUploadHelper";
import { styles } from "./GstAmendmentScreen.styles";
import { useApplicationStore } from "@/store/applicationStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useAuthStore } from "@/store/authStore";
import { gstAmendmentApi } from "@/modules/gst/services/gstAmendmentApi";
import { apiClient } from "@/core/api/apiClient";
import { UniversalDraftModal } from "@/shared/components/UniversalDraftModal";
import { useUniversalDraftGuard } from "@/shared/hooks/useUniversalDraftGuard";

export type AmendmentStep = "LANDING" | "EDIT" | "REVIEW" | "SUCCESS";

interface AmendmentSectionConfig {
  id: string;
  title: string;
  type: "core" | "non-core";
  typeLabel: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
}

const AMENDMENT_SECTIONS: AmendmentSectionConfig[] = [
  // Core Amendments (Officer approval required)
  {
    id: "legal-name",
    title: "Legal Business Name",
    type: "core",
    typeLabel: "Core amendment - officer approval required",
    icon: "pricetag",
    iconBg: "#FFF1E8",
    iconColor: BrandColors.PRIMARY_ORANGE,
  },
  {
    id: "principal-place",
    title: "Principal Place of Business",
    type: "core",
    typeLabel: "Core amendment - officer approval required",
    icon: "business",
    iconBg: "#EAF1FE",
    iconColor: BrandColors.PRIMARY_BLUE,
  },
  {
    id: "additional-place",
    title: "Additional Place of Business",
    type: "core",
    typeLabel: "Core amendment - officer approval required",
    icon: "storefront",
    iconBg: "#EAF1FE",
    iconColor: BrandColors.PRIMARY_BLUE_ACCENT,
  },
  // Non-core Amendments (Auto-approved)
  {
    id: "bank-accounts",
    title: "Bank Accounts",
    type: "non-core",
    typeLabel: "Non-core - auto-approved",
    icon: "wallet",
    iconBg: "#F3E8FF",
    iconColor: "#7E22CE",
  },
  {
    id: "authorised-signatories",
    title: "Authorised Signatories",
    type: "non-core",
    typeLabel: "Non-core - auto-approved",
    icon: "create",
    iconBg: "#FFF1E8",
    iconColor: BrandColors.PRIMARY_ORANGE_DARK,
  },
  {
    id: "contact-details",
    title: "Contact Details",
    type: "non-core",
    typeLabel: "Non-core - auto-approved",
    icon: "call",
    iconBg: "#FCE7F3",
    iconColor: "#DB2777",
  },
];

const ADDRESS_PROOF_TYPES = [
  "Rental Agreement",
  "Ownership Proof",
  "Electricity Bill",
  "Other Address Proof",
];

const INDIAN_STATES_AND_UTS = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
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

const NATURE_OF_PREMISES_OPTIONS = [
  "Leased",
  "Warehouse",
  "Owned",
  "Rented",
  "Consent",
  "Shared",
  "Others",
];

const BANK_ACCOUNT_TYPES = [
  "Current",
  "Savings",
  "Cash Credit",
];

const SECTION_ACCEPTED_PROOFS: Record<string, { initial: string[]; all: string[] }> = {
  "legal-name": {
    initial: [
      "Certificate of Incorporation / Name Change Certificate",
      "Revised Government Registration Certificate",
      "Official document showing the changed legal name",
    ],
    all: [
      "Certificate of Incorporation / Name Change Certificate",
      "Revised Certificate of Incorporation",
      "Government-issued business registration certificate showing the new legal name",
      "Revised LLP / Partnership Registration Document",
      "Government-issued order/document reflecting the changed legal name",
      "Other official name-change supporting document",
    ],
  },
  "principal-place": {
    initial: [
      "Property Tax Receipt",
      "Municipal Khata Certificate / Khata Copy",
      "Electricity Bill",
    ],
    all: [
      "Property Tax Receipt",
      "Municipal Khata Certificate / Khata Copy",
      "Electricity Bill",
      "Rent / Lease Agreement",
      "Consent Letter",
      "Government-issued document/certificate showing the premises",
      "Legal ownership document",
    ],
  },
  "additional-place": {
    initial: [
      "Property Tax Receipt",
      "Municipal Khata Certificate / Khata Copy",
      "Electricity Bill",
    ],
    all: [
      "Property Tax Receipt",
      "Municipal Khata Certificate / Khata Copy",
      "Electricity Bill",
      "Rent / Lease Agreement",
      "Consent Letter",
      "Government-issued document/certificate showing the premises",
      "Legal ownership document",
    ],
  },
  "bank-accounts": {
    initial: [
      "Bank Statement",
      "First Page of Passbook",
      "Cancelled Cheque",
    ],
    all: [
      "Bank Statement",
      "First Page of Passbook",
      "Cancelled Cheque",
      "Recent Bank Account Statement (last 3 months)",
      "Bank Account Certificate issued by Bank",
      "Letter from Bank confirming account details",
    ],
  },
  "authorised-signatories": {
    initial: [
      "Letter of Authorisation",
      "Board Resolution",
      "Managing Committee Resolution",
    ],
    all: [
      "Letter of Authorisation",
      "Board Resolution",
      "Managing Committee Resolution",
      "Acceptance Letter accompanying the Resolution",
      "Applicable official appointment / authorisation document",
      "Other official authorisation document applicable to the entity",
    ],
  },
  "contact-details": {
    initial: [
      "Official government/business registration document showing the updated contact details",
      "Official government correspondence showing the updated contact details",
      "Other supporting document showing the updated contact details",
    ],
    all: [
      "Official government/business registration document showing the updated contact details",
      "Official government correspondence showing the updated contact details",
      "Other supporting document showing the updated contact details",
      "Board Resolution / Authorization for contact update",
      "Utility Bill in the name of the entity / authorized person",
      "Other official document evidencing the contact detail change",
    ],
  },
};

export function GstAmendmentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const customer = useAuthStore((state) => state.customer);
  const gstDraft = useApplicationStore((state) => state.gstDraft);
  const applications = useApplicationStore((state) => state.applications);
  const createApplication = useApplicationStore((state) => state.createApplication);
  const saveGstAmendmentDraft = useApplicationStore((state) => state.saveGstAmendmentDraft);
  const clearGstAmendmentDraft = useApplicationStore((state) => state.clearGstAmendmentDraft);
  const addNotification = useNotificationStore((state) => state.addNotification);

  // Workflow state
  const [currentStep, setCurrentStep] = useState<AmendmentStep>("LANDING");
  const [gstin, setGstin] = useState(
    () =>
      (customer as any)?.gstId ||
      gstDraft?.createdGstId ||
      applications.find((a) => a.formData?.createdGstId || a.formData?.gstId || a.formData?.gstin)?.formData?.createdGstId ||
      ""
  );
  const [selectedSectionId, setSelectedSectionId] = useState<string>("legal-name");

  // Form inputs for all 6 sections (Exact registration fields)
  const [newLegalBusinessName, setNewLegalBusinessName] = useState("");
  
  // Principal Place of Business fields (Screenshot 1, 2, 3)
  const [newPrincipalAddress, setNewPrincipalAddress] = useState("");
  const [newPrincipalCity, setNewPrincipalCity] = useState("");
  const [newPrincipalDistrict, setNewPrincipalDistrict] = useState("");
  const [newPrincipalState, setNewPrincipalState] = useState("");
  const [newPrincipalPincode, setNewPrincipalPincode] = useState("");
  const [newPrincipalNatureOfPremises, setNewPrincipalNatureOfPremises] = useState("");

  // Additional Place of Business fields (Screenshot 01)
  const [newAdditionalAddress, setNewAdditionalAddress] = useState("");
  const [newAdditionalCity, setNewAdditionalCity] = useState("");
  const [newAdditionalPincode, setNewAdditionalPincode] = useState("");
  const [newAdditionalNatureOfPremises, setNewAdditionalNatureOfPremises] = useState("");

  // Bank Accounts fields (Screenshot 02)
  const [newBankName, setNewBankName] = useState("");
  const [newBankAccountNumber, setNewBankAccountNumber] = useState("");
  const [confirmBankAccountNumber, setConfirmBankAccountNumber] = useState("");
  const [newIfscCode, setNewIfscCode] = useState("");
  const [newAccountType, setNewAccountType] = useState("");

  // Authorised Signatories fields (Screenshot 03)
  const [newSignatoryName, setNewSignatoryName] = useState("");
  const [newSignatoryPan, setNewSignatoryPan] = useState("");
  const [newSignatoryDob, setNewSignatoryDob] = useState("");
  const [newSignatoryDesignation, setNewSignatoryDesignation] = useState("");
  const [newSignatoryMobile, setNewSignatoryMobile] = useState("");
  const [newSignatoryEmail, setNewSignatoryEmail] = useState("");

  // Contact Details fields (Screenshot 04)
  const [newContactMobile, setNewContactMobile] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");

  // Supporting document state
  const [supportingDoc, setSupportingDoc] = useState<{ uri: string; name: string; size: string } | null>(null);

  // Dropdown selection modal state
  const [pickerModal, setPickerModal] = useState<{
    isOpen: boolean;
    title: string;
    options: string[];
    selectedVal: string;
    onSelect: (val: string) => void;
  }>({
    isOpen: false,
    title: "",
    options: [],
    selectedVal: "",
    onSelect: () => {},
  });

  // Review & submission state
  const [declared, setDeclared] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    arn: string;
    date: string;
    appId: string;
    sectionTitle: string;
    isCore: boolean;
  } | null>(null);

  const targetGstId =
    gstin ||
    (customer as any)?.gstId ||
    gstDraft?.createdGstId ||
    applications.find((a) => a.formData?.createdGstId || a.formData?.gstId || a.formData?.gstin)?.formData?.createdGstId ||
    applications.find((a) => a.formData?.createdGstId || a.formData?.gstId || a.formData?.gstin)?.formData?.gstId ||
    applications.find((a) => a.formData?.createdGstId || a.formData?.gstId || a.formData?.gstin)?.formData?.gstin ||
    "GST29AAACU9876P1Z5";

  // Read-only registered details state (dynamically fetched from backend database)
  const [registeredDetails, setRegisteredDetails] = useState({
    legalBusinessName: "-",
    principalAddress: "-",
    principalCity: "-",
    principalDistrict: "-",
    principalState: "-",
    principalPincode: "-",
    principalProofType: "-",

    // Additional Place of Business
    additionalAddress: "-",
    additionalCity: "-",
    additionalPincode: "-",
    additionalNatureOfPremises: "-",

    // Bank Accounts
    bankName: "-",
    bankAccountNumber: "-",
    ifscCode: "-",
    accountType: "-",

    // Authorised Signatories
    signatoryName: "-",
    signatoryPan: "-",
    signatoryDesignation: "-",
    signatoryMobile: "-",
    signatoryEmail: "-",

    // Contact Details
    contactMobile: "-",
    contactEmail: "-",
  });

  // Fetch live registered details from backend database for all 6 modules using /api/v1/gst/business/{gstId}
  useEffect(() => {
    let isMounted = true;

    const fetchAllRegisteredDetails = async () => {
      try {
        const idToFetch = targetGstId || "DEFAULT";

        // Fetch from @GetMapping("/business/{gstId}") as primary source
        const [
          businessRes,
          legalRes,
          principalRes,
          additionalRes,
          bankRes,
          signatoryRes,
          contactRes,
        ] = await Promise.allSettled([
          apiClient.get<any>(`/api/v1/gst/business/${idToFetch}`),
          gstAmendmentApi.getExistingLegalName(idToFetch),
          gstAmendmentApi.getExistingPrincipalPlace(idToFetch),
          gstAmendmentApi.getExistingAdditionalPlace(idToFetch),
          gstAmendmentApi.getExistingBankAccount(idToFetch),
          gstAmendmentApi.getExistingSignatory(idToFetch),
          gstAmendmentApi.getExistingContact(idToFetch),
        ]);

        if (!isMounted) return;

        setRegisteredDetails((prev) => {
          const updated = { ...prev };

          // 1. Primary data source: /api/v1/gst/business/{gstId}
          if (businessRes.status === "fulfilled" && businessRes.value) {
            const b = businessRes.value;
            if (b.legalName) updated.legalBusinessName = b.legalName;
            else if (b.tradeName) updated.legalBusinessName = b.tradeName;

            if (b.businessAddress) updated.principalAddress = b.businessAddress;
            if (b.city) updated.principalCity = b.city;
            if (b.district) updated.principalDistrict = b.district;
            if (b.state) updated.principalState = b.state;
            if (b.pinCode) updated.principalPincode = b.pinCode;

            // Additional Place defaults
            if (b.businessAddress) updated.additionalAddress = b.businessAddress;
            if (b.city) updated.additionalCity = b.city;
            if (b.pinCode) updated.additionalPincode = b.pinCode;
            if (b.natureOfBusiness) updated.additionalNatureOfPremises = String(b.natureOfBusiness);

            if (b.bankName) updated.bankName = b.bankName;
            if (b.bankAccountNumber) updated.bankAccountNumber = b.bankAccountNumber;
            if (b.ifscCode) updated.ifscCode = b.ifscCode;
            if (b.accountType) updated.accountType = b.accountType;

            if (b.signatoryName) updated.signatoryName = b.signatoryName;
            else if (b.authorisedSignatory) updated.signatoryName = b.authorisedSignatory;
            else if (b.accountHolderName) updated.signatoryName = b.accountHolderName;

            if (b.signatoryPan) updated.signatoryPan = b.signatoryPan;
            if (b.designation) updated.signatoryDesignation = b.designation;
            if (b.signatoryMobile) {
              updated.signatoryMobile = b.signatoryMobile;
              updated.contactMobile = b.signatoryMobile;
            }
            if (b.signatoryEmail) {
              updated.signatoryEmail = b.signatoryEmail;
              updated.contactEmail = b.signatoryEmail;
            }
          }

          // 2. Specific module overrides if existing amendments exist
          if (legalRes.status === "fulfilled" && legalRes.value?.newLegalName) {
            updated.legalBusinessName = legalRes.value.newLegalName;
          }

          if (principalRes.status === "fulfilled" && principalRes.value) {
            const p = principalRes.value;
            if (p.newBusinessAddress) updated.principalAddress = p.newBusinessAddress;
            if (p.newCity) updated.principalCity = p.newCity;
            if (p.newDistrict) updated.principalDistrict = p.newDistrict;
            if (p.newState) updated.principalState = p.newState;
            if (p.newPinCode) updated.principalPincode = p.newPinCode;
          }

          if (additionalRes.status === "fulfilled" && additionalRes.value) {
            const addList = Array.isArray(additionalRes.value) ? additionalRes.value : [additionalRes.value];
            if (addList.length > 0 && addList[0]) {
              const a = addList[0];
              if (a.address) updated.additionalAddress = a.address;
              if (a.city) updated.additionalCity = a.city;
              if (a.pinCode) updated.additionalPincode = a.pinCode;
              if (a.natureOfPremises) updated.additionalNatureOfPremises = String(a.natureOfPremises);
            }
          }

          if (bankRes.status === "fulfilled" && bankRes.value) {
            const bk = bankRes.value;
            if (bk.newBankName) updated.bankName = bk.newBankName;
            if (bk.newBankAccountNumber) updated.bankAccountNumber = bk.newBankAccountNumber;
            if (bk.newIfscCode) updated.ifscCode = bk.newIfscCode;
            if (bk.newAccountType) updated.accountType = bk.newAccountType;
          }

          if (signatoryRes.status === "fulfilled" && signatoryRes.value) {
            const s = signatoryRes.value;
            if (s.newSignatoryName) updated.signatoryName = s.newSignatoryName;
            if (s.newSignatoryPan) updated.signatoryPan = s.newSignatoryPan;
            if (s.newDesignation) updated.signatoryDesignation = s.newDesignation;
            if (s.newSignatoryMobile) updated.signatoryMobile = s.newSignatoryMobile;
            if (s.newSignatoryEmail) updated.signatoryEmail = s.newSignatoryEmail;
          }

          if (contactRes.status === "fulfilled" && contactRes.value) {
            const c = contactRes.value;
            if (c.newMobileNumber) updated.contactMobile = c.newMobileNumber;
            if (c.newEmail) updated.contactEmail = c.newEmail;
          }

          return updated;
        });
      } catch (err) {
        console.warn("Error fetching registered amendment details from database:", err);
      }
    };

    fetchAllRegisteredDetails();

    return () => {
      isMounted = false;
    };
  }, [targetGstId, selectedSectionId]);


  const selectedSection = AMENDMENT_SECTIONS.find((s) => s.id === selectedSectionId) || AMENDMENT_SECTIONS[0];

  // Accepted proofs expansion state (default: collapsed)
  const [isProofsExpanded, setIsProofsExpanded] = useState(false);

  useEffect(() => {
    setIsProofsExpanded(false);
  }, [selectedSectionId, currentStep]);

  const currentAcceptedProofs = SECTION_ACCEPTED_PROOFS[selectedSectionId];
  const displayedProofs = currentAcceptedProofs
    ? (isProofsExpanded ? currentAcceptedProofs.all : currentAcceptedProofs.initial)
    : [];
  const hasMoreProofs = currentAcceptedProofs
    ? currentAcceptedProofs.all.length > currentAcceptedProofs.initial.length
    : false;

  // Universal Draft Guard
  const {
    showDraftModal,
    markSubmitted,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
  } = useUniversalDraftGuard({
    isDirty: () =>
      Boolean(
        currentStep !== "LANDING" &&
        currentStep !== "SUCCESS" &&
        (newLegalBusinessName ||
          newPrincipalAddress ||
          newPrincipalCity ||
          newPrincipalDistrict ||
          newPrincipalState ||
          newPrincipalPincode ||
          newPrincipalNatureOfPremises ||
          newAdditionalAddress ||
          newAdditionalCity ||
          newAdditionalPincode ||
          newAdditionalNatureOfPremises ||
          newBankName ||
          newBankAccountNumber ||
          confirmBankAccountNumber ||
          newIfscCode ||
          newAccountType ||
          newSignatoryName ||
          newSignatoryPan ||
          newSignatoryDob ||
          newSignatoryDesignation ||
          newSignatoryMobile ||
          newSignatoryEmail ||
          newContactMobile ||
          newContactEmail ||
          supportingDoc)
      ),
    onSaveDraft: () => {
      saveGstAmendmentDraft({
        formData: {
          gstin,
          selectedSectionId,
          newLegalBusinessName,
          newPrincipalAddress,
          newPrincipalCity,
          newPrincipalDistrict,
          newPrincipalState,
          newPrincipalPincode,
          newPrincipalNatureOfPremises,
          newAdditionalAddress,
          newAdditionalCity,
          newAdditionalPincode,
          newAdditionalNatureOfPremises,
          newBankName,
          newBankAccountNumber,
          newIfscCode,
          newAccountType,
          newSignatoryName,
          newSignatoryPan,
          newSignatoryDob,
          newSignatoryDesignation,
          newSignatoryMobile,
          newSignatoryEmail,
          newContactMobile,
          newContactEmail,
        },
        step: currentStep,
        updatedAt: new Date().toISOString().split("T")[0],
      });
    },
    onDiscardDraft: () => {
      clearGstAmendmentDraft();
    },
    isSubmitted: () => currentStep === "SUCCESS",
  });

  const clearError = (key: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleGstinChange = (text: string) => {
    const cleaned = text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    setGstin(cleaned);
    clearError("gstin");
  };

  // Document picker handlers
  const handleBrowseFiles = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png", "image/jpg"],
        copyToCacheDirectory: true,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const file = res.assets[0];
        const sizeMb = file.size ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : "0.1 MB";
        setSupportingDoc({
          uri: file.uri,
          name: file.name,
          size: sizeMb,
        });
        clearError("supportingDoc");
      }
    } catch {
      const uri = await pickImageFromGallery(false);
      if (uri) {
        setSupportingDoc({
          uri,
          name: `Document_${Date.now().toString().slice(-4)}.pdf`,
          size: "0.2 MB",
        });
        clearError("supportingDoc");
      }
    }
  };

  const handleScanFile = async () => {
    const uri = await pickImageFromCamera(false);
    if (uri) {
      setSupportingDoc({
        uri,
        name: `Scan_${Date.now().toString().slice(-4)}.jpg`,
        size: "1.4 MB",
      });
      clearError("supportingDoc");
    }
  };

  // Transition from Landing -> Edit Section
  const handleSelectSection = (sectionId: string) => {
    const clean = gstin.trim().toUpperCase();
    if (!clean) {
      setErrors({ gstin: "GSTIN or Business ID is required." });
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    const isValidId =
      GstValidators.isValidGstin(clean) ||
      clean.startsWith("GST") ||
      clean.length >= 10;

    if (!isValidId) {
      setErrors({ gstin: "Enter a valid 15-character GSTIN (e.g. 29AAAAA0000A1Z5) or GST ID" });
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    clearError("gstin");
    setSelectedSectionId(sectionId);
    setIsProofsExpanded(false);
    setErrors({});
    setCurrentStep("EDIT");
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const openPickerModal = (
    title: string,
    options: string[],
    selectedVal: string,
    onSelect: (val: string) => void
  ) => {
    setPickerModal({
      isOpen: true,
      title,
      options,
      selectedVal,
      onSelect,
    });
  };

  // Validation for Edit Section Form
  const validateSectionForm = (): boolean => {
    const errs: Record<string, string> = {};

    switch (selectedSectionId) {
      case "legal-name":
        if (!GstValidators.isNotEmpty(newLegalBusinessName, 2)) {
          errs.newLegalBusinessName = "New Legal Business Name is required";
        }
        break;
      case "principal-place":
        if (!GstValidators.isNotEmpty(newPrincipalAddress, 2)) {
          errs.newPrincipalAddress = "New Business Address is required";
        }
        if (!GstValidators.isNotEmpty(newPrincipalCity, 2)) {
          errs.newPrincipalCity = "City is required";
        }
        if (!GstValidators.isNotEmpty(newPrincipalDistrict, 2)) {
          errs.newPrincipalDistrict = "District is required";
        }
        if (!newPrincipalState) {
          errs.newPrincipalState = "State / UT is required";
        }
        if (!/^\d{6}$/.test(newPrincipalPincode.trim())) {
          errs.newPrincipalPincode = "Enter a valid 6-digit PIN code";
        }
        if (!newPrincipalNatureOfPremises) {
          errs.newPrincipalNatureOfPremises = "Nature of Premises is required";
        }
        break;
      case "additional-place":
        if (!GstValidators.isNotEmpty(newAdditionalAddress, 2)) {
          errs.newAdditionalAddress = "New Additional Place Address is required";
        }
        if (!GstValidators.isNotEmpty(newAdditionalCity, 2)) {
          errs.newAdditionalCity = "City is required";
        }
        if (!/^\d{6}$/.test(newAdditionalPincode.trim())) {
          errs.newAdditionalPincode = "Enter a valid 6-digit PIN code";
        }
        if (!newAdditionalNatureOfPremises) {
          errs.newAdditionalNatureOfPremises = "Nature of Premises is required";
        }
        break;
      case "bank-accounts":
        if (!GstValidators.isNotEmpty(newBankName, 2)) {
          errs.newBankName = "New Bank Name is required";
        }
        if (!GstValidators.isValidBankAccount(newBankAccountNumber)) {
          errs.newBankAccountNumber = "Enter a valid 9 to 18 digit bank account number";
        }
        if (!confirmBankAccountNumber) {
          errs.confirmBankAccountNumber = "Confirm Account Number is required";
        } else if (confirmBankAccountNumber !== newBankAccountNumber) {
          errs.confirmBankAccountNumber = "Bank account numbers do not match";
        }
        if (!GstValidators.isValidIfsc(newIfscCode)) {
          errs.newIfscCode = "Enter a valid 11-character IFSC code (e.g. HDFC0001234)";
        }
        if (!newAccountType) {
          errs.newAccountType = "Account Type is required";
        }
        break;
      case "authorised-signatories":
        if (!GstValidators.isNotEmpty(newSignatoryName, 2)) {
          errs.newSignatoryName = "New Signatory Name is required";
        }
        if (!GstValidators.isValidPan(newSignatoryPan)) {
          errs.newSignatoryPan = "Enter a valid 10-character PAN (e.g. ABCDE1234F)";
        }
        if (!newSignatoryDob || newSignatoryDob.trim().length < 8) {
          errs.newSignatoryDob = "Date of Birth is required (dd-mm-yyyy)";
        }
        if (!GstValidators.isNotEmpty(newSignatoryDesignation, 2)) {
          errs.newSignatoryDesignation = "Designation is required";
        }
        if (!GstValidators.isValidMobile(newSignatoryMobile)) {
          errs.newSignatoryMobile = "Enter a valid 10-digit mobile number";
        }
        if (!GstValidators.isValidEmail(newSignatoryEmail)) {
          errs.newSignatoryEmail = "Enter a valid email address";
        }
        break;
      case "contact-details":
        if (!GstValidators.isValidMobile(newContactMobile)) {
          errs.newContactMobile = "Enter a valid 10-digit mobile number";
        }
        if (!GstValidators.isValidEmail(newContactEmail)) {
          errs.newContactEmail = "Enter a valid email address";
        }
        break;
    }

    if (!supportingDoc) {
      errs.supportingDoc = "Supporting proof is required for an amendment";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Transition from Edit -> Review Changes
  const handleReviewChanges = () => {
    if (!validateSectionForm()) {
      Alert.alert("Required Information", "Please fill in the required amendment details and attach supporting proof.");
      return;
    }
    setCurrentStep("REVIEW");
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  // Submit Amendment
  const handleSubmitAmendment = async () => {
    if (!declared) {
      Alert.alert("Declaration Required", "Please tick the declaration checkbox to authorise TaxEdge to file your amendment.");
      return;
    }

    if (!supportingDoc) {
      Alert.alert("Supporting Proof Required", "Please attach a supporting proof document before submitting your amendment.");
      return;
    }

    setIsSubmitting(true);

    try {
      const targetGstId =
        gstin ||
        (customer as any)?.gstId ||
        gstDraft?.createdGstId ||
        applications.find((a) => a.formData?.createdGstId || a.formData?.gstId || a.formData?.gstin)?.formData?.createdGstId ||
        applications.find((a) => a.formData?.createdGstId || a.formData?.gstId || a.formData?.gstin)?.formData?.gstId ||
        applications.find((a) => a.formData?.createdGstId || a.formData?.gstId || a.formData?.gstin)?.formData?.gstin ||
        "GST29AAACU9876P1Z5";

      switch (selectedSectionId) {
        case "legal-name":
          await gstAmendmentApi.submitLegalNameAmendment(
            targetGstId,
            newLegalBusinessName,
            supportingDoc,
          );
          break;
        case "principal-place":
          await gstAmendmentApi.submitPrincipalPlaceAmendment(
            targetGstId,
            newPrincipalAddress,
            newPrincipalCity,
            newPrincipalState,
            newPrincipalPincode,
            supportingDoc,
            newPrincipalDistrict,
            newPrincipalNatureOfPremises,
          );
          break;
        case "additional-place":
          await gstAmendmentApi.submitAdditionalPlaceAmendment(
            targetGstId,
            newAdditionalAddress,
            newAdditionalCity,
            newAdditionalPincode,
            newAdditionalNatureOfPremises,
            supportingDoc,
          );
          break;
        case "bank-accounts":
          await gstAmendmentApi.submitBankAccountAmendment(
            targetGstId,
            newBankName,
            newBankAccountNumber,
            newIfscCode,
            newAccountType,
            supportingDoc,
          );
          break;
        case "contact-details":
          await gstAmendmentApi.submitContactAmendment(
            targetGstId,
            newContactMobile,
            newContactEmail,
            supportingDoc,
          );
          break;
        case "authorised-signatories":
          await gstAmendmentApi.submitSignatoryAmendment(
            targetGstId,
            newSignatoryName,
            newSignatoryPan,
            supportingDoc,
            newSignatoryDob,
            newSignatoryDesignation,
            newSignatoryMobile,
            newSignatoryEmail,
          );
          break;
      }

      markSubmitted();

      const isCore = selectedSection.type === "core";
      const randomSuffix = Math.floor(10000000 + Math.random() * 90000000);
      const generatedArn = `AA2993${randomSuffix.toString().slice(0, 6)}`;
      const now = new Date();
      const dateStr = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

      // Build readable comparison summaries
      let currentValSummary = "";
      let requestedValSummary = "";
      let currentValDict: Record<string, string> | undefined = undefined;
      let requestedValDict: Record<string, string> | undefined = undefined;

      switch (selectedSectionId) {
        case "legal-name":
          currentValSummary = registeredDetails.legalBusinessName;
          requestedValSummary = newLegalBusinessName;
          currentValDict = { "Legal Business Name": registeredDetails.legalBusinessName };
          requestedValDict = { "Legal Business Name": newLegalBusinessName };
          break;
        case "principal-place":
          currentValSummary = `${registeredDetails.principalAddress}, ${registeredDetails.principalCity}, ${registeredDetails.principalDistrict}, ${registeredDetails.principalState} - ${registeredDetails.principalPincode}`;
          requestedValSummary = `${newPrincipalAddress}, ${newPrincipalCity}, ${newPrincipalDistrict}, ${newPrincipalState} - ${newPrincipalPincode} (${newPrincipalNatureOfPremises})`;
          currentValDict = {
            Address: registeredDetails.principalAddress,
            City: registeredDetails.principalCity,
            District: registeredDetails.principalDistrict,
            State: registeredDetails.principalState,
            "PIN Code": registeredDetails.principalPincode,
          };
          requestedValDict = {
            "Business Address": newPrincipalAddress,
            City: newPrincipalCity,
            District: newPrincipalDistrict,
            "State / UT": newPrincipalState,
            "PIN Code": newPrincipalPincode,
            "Nature of Premises": newPrincipalNatureOfPremises,
          };
          break;
        case "additional-place":
          currentValSummary = `${registeredDetails.additionalAddress}, ${registeredDetails.additionalCity} - ${registeredDetails.additionalPincode} (${registeredDetails.additionalNatureOfPremises})`;
          requestedValSummary = `${newAdditionalAddress}, ${newAdditionalCity} - ${newAdditionalPincode} (${newAdditionalNatureOfPremises})`;
          currentValDict = {
            Address: registeredDetails.additionalAddress,
            City: registeredDetails.additionalCity,
            "PIN Code": registeredDetails.additionalPincode,
            "Nature of Premises": registeredDetails.additionalNatureOfPremises,
          };
          requestedValDict = {
            "Additional Place Address": newAdditionalAddress,
            City: newAdditionalCity,
            "PIN Code": newAdditionalPincode,
            "Nature of Premises": newAdditionalNatureOfPremises,
          };
          break;
        case "bank-accounts":
          currentValSummary = `${registeredDetails.bankName} - A/C: ${registeredDetails.bankAccountNumber}, IFSC: ${registeredDetails.ifscCode}`;
          requestedValSummary = `${newBankName} - A/C: ${newBankAccountNumber}, IFSC: ${newIfscCode}`;
          currentValDict = {
            "Bank Name": registeredDetails.bankName,
            "Account Number": registeredDetails.bankAccountNumber,
            "IFSC Code": registeredDetails.ifscCode,
            "Account Type": registeredDetails.accountType,
          };
          requestedValDict = {
            "Bank Name": newBankName,
            "Account Number": newBankAccountNumber,
            "Confirm Account Number": confirmBankAccountNumber,
            "IFSC Code": newIfscCode,
            "Account Type": newAccountType,
          };
          break;
        case "authorised-signatories":
          currentValSummary = `${registeredDetails.signatoryName} (${registeredDetails.signatoryPan}) - ${registeredDetails.signatoryDesignation}`;
          requestedValSummary = `${newSignatoryName} (${newSignatoryPan}) - ${newSignatoryDesignation}`;
          currentValDict = {
            Name: registeredDetails.signatoryName,
            PAN: registeredDetails.signatoryPan,
            Designation: registeredDetails.signatoryDesignation,
            Mobile: registeredDetails.signatoryMobile,
            Email: registeredDetails.signatoryEmail,
          };
          requestedValDict = {
            "Signatory Name": newSignatoryName,
            "Signatory PAN": newSignatoryPan,
            "Date of Birth": newSignatoryDob,
            Designation: newSignatoryDesignation,
            "Signatory Mobile": newSignatoryMobile,
            "Signatory Email": newSignatoryEmail,
          };
          break;
        case "contact-details":
          currentValSummary = `Mob: ${registeredDetails.contactMobile}, Email: ${registeredDetails.contactEmail}`;
          requestedValSummary = `Mob: ${newContactMobile}, Email: ${newContactEmail}`;
          currentValDict = {
            Mobile: registeredDetails.contactMobile,
            Email: registeredDetails.contactEmail,
          };
          requestedValDict = {
            "Mobile Number": newContactMobile,
            "Email Address": newContactEmail,
          };
          break;
      }

      // Create application in Zustand store
      const appId = createApplication(
        "gst-amendment",
        `GST Amendment`,
        "GST",
        {
          gstin: targetGstId,
          arn: generatedArn,
          section: selectedSection.title,
          amendmentCategory: isCore ? "Core (officer approval)" : "Non-core (auto-approved)",
          isCore: isCore ? "true" : "false",
          applicantName: registeredDetails.legalBusinessName,
          submissionDate: dateStr,
          currentValue: currentValSummary,
          requestedValue: requestedValSummary,
          currentValues: currentValDict ? JSON.stringify(currentValDict) : "",
          requestedValues: requestedValDict ? JSON.stringify(requestedValDict) : "",
          supportingDocName: supportingDoc?.name || "Supporting Proof",
        },
        supportingDoc ? [supportingDoc.name] : ["Amendment Supporting Proof"],
        999
      );

      // Add Notification
      addNotification(
        "GST Amendment Filed",
        `Your GST Amendment request for ${selectedSection.title} (ARN: ${generatedArn}) has been submitted successfully.`,
        "gst"
      );

      setSubmissionResult({
        arn: generatedArn,
        date: dateStr,
        appId,
        sectionTitle: selectedSection.title,
        isCore,
      });

      setCurrentStep("SUCCESS");
    } catch (error: any) {
      console.error("Amendment Submission Error:", error);
      Alert.alert(
        "Submission Failed",
        error?.message || "Failed to submit amendment. Please check your network connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------------------------------------------------- */
  /* SCREEN 4: SUCCESS / SUBMITTED SCREEN (Screenshot 5)          */
  /* ------------------------------------------------------------- */
  if (currentStep === "SUCCESS" && submissionResult) {
    return (
      <View style={styles.successContainer}>
        <StatusBar barStyle="light-content" backgroundColor={BrandColors.PRIMARY_BLUE} />

        {/* Scrollable Content */}
        <ScrollView
          style={styles.modalScrollView}
          contentContainerStyle={styles.modalScrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Hero Banner with curved bottom */}
          <View style={[styles.successHero, { paddingTop: insets.top + 32 }]}>
            <View style={styles.successHeroIconBox}>
              <View style={styles.successHeroCheckCircle}>
                <Ionicons name="checkmark" size={32} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.successHeroTitle}>Amendment Submitted</Text>
          </View>

          {/* Details Card */}
          <View style={styles.successCard}>
            <View style={styles.successRow}>
              <Text style={styles.successRowKey}>Application Type</Text>
              <Text style={styles.successRowVal}>GST Amendment</Text>
            </View>
            <View style={styles.successDivider} />

            <View style={styles.successRow}>
              <Text style={styles.successRowKey}>ARN / Reference</Text>
              <Text style={[styles.successRowVal, { color: BrandColors.PRIMARY_BLUE }]}>
                {submissionResult.arn}
              </Text>
            </View>
            <View style={styles.successDivider} />

            <View style={styles.successRow}>
              <Text style={styles.successRowKey}>Submission Date</Text>
              <Text style={styles.successRowVal}>{submissionResult.date}</Text>
            </View>
            <View style={styles.successDivider} />

            <View style={styles.successRow}>
              <Text style={styles.successRowKey}>Requested Section</Text>
              <Text style={styles.successRowVal}>{submissionResult.sectionTitle}</Text>
            </View>
            <View style={styles.successDivider} />

            <View style={styles.successRow}>
              <Text style={styles.successRowKey}>Current Status</Text>
              <Text style={[styles.successRowVal, { color: "#16A34A" }]}>Submitted</Text>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Bottom Action Area */}
        <View style={[styles.successActionsWrap, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={() => {
              useApplicationStore.getState().setSelectedApplicationId(submissionResult.appId);
              router.push(`/application/${submissionResult.appId}`);
            }}
          >
            <Text style={styles.primaryBtnText}>Track Amendment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.85}
            onPress={() => router.push("/(main)/applications")}
          >
            <Text style={styles.secondaryBtnText}>Open My Applications</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /* ------------------------------------------------------------- */
  /* SCREEN 3: REVIEW AMENDMENT SCREEN (Screenshot 4)             */
  /* ------------------------------------------------------------- */
  if (currentStep === "REVIEW") {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

        {/* Header */}
        <View style={[styles.headerBar, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setCurrentStep("EDIT")}
            style={styles.roundBackButton}
          >
            <Ionicons name="chevron-back" size={22} color={BrandColors.PRIMARY_BLUE} />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerMainTitle}>Review Amendment</Text>
            <Text style={styles.headerSubtitle}>Review requested details</Text>
          </View>
          <View style={styles.placeholderBox} />
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Metadata Card */}
          <View style={styles.reviewMetaCard}>
            <View style={styles.reviewMetaRow}>
              <Text style={styles.reviewMetaKey}>GSTIN</Text>
              <Text style={styles.reviewMetaVal}>{gstin || "-"}</Text>
            </View>
            <View style={styles.reviewMetaDivider} />

            <View style={styles.reviewMetaRow}>
              <Text style={styles.reviewMetaKey}>Section</Text>
              <Text style={styles.reviewMetaVal}>{selectedSection.title}</Text>
            </View>
            <View style={styles.reviewMetaDivider} />

            <View style={styles.reviewMetaRow}>
              <Text style={styles.reviewMetaKey}>Type</Text>
              <Text style={[styles.reviewMetaVal, { color: selectedSection.type === "core" ? "#EA580C" : "#083B75" }]}>
                {selectedSection.type === "core" ? "Core (officer approval)" : "Non-core (auto-approved)"}
              </Text>
            </View>
          </View>

          {/* Requested Details Card with Edit Option */}
          <View style={styles.requestedDetailsCard}>
            <View style={styles.requestedCardHeaderRow}>
              <Text style={styles.requestedCardTitle}>REQUESTED DETAILS</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setCurrentStep("EDIT")}
                style={styles.editOptionBtn}
              >
                <Ionicons name="create-outline" size={15} color={BrandColors.PRIMARY_ORANGE} />
                <Text style={styles.editOptionText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.reviewMetaDivider} />

            {selectedSectionId === "legal-name" && (
              <View style={styles.reviewFieldRow}>
                <Text style={styles.reviewFieldLabel}>Legal Business Name</Text>
                <Text style={styles.reviewFieldValue}>{newLegalBusinessName || "-"}</Text>
              </View>
            )}

            {selectedSectionId === "principal-place" && (
              <View style={styles.gap8}>
                <View style={styles.reviewFieldRow}>
                  <Text style={styles.reviewFieldLabel}>Business Address</Text>
                  <Text style={styles.reviewFieldValue}>{newPrincipalAddress || "-"}</Text>
                </View>
                <View style={styles.reviewFieldRow}>
                  <Text style={styles.reviewFieldLabel}>City</Text>
                  <Text style={styles.reviewFieldValue}>{newPrincipalCity || "-"}</Text>
                </View>
                <View style={styles.reviewFieldRow}>
                  <Text style={styles.reviewFieldLabel}>District</Text>
                  <Text style={styles.reviewFieldValue}>{newPrincipalDistrict || "-"}</Text>
                </View>
                <View style={styles.reviewFieldRow}>
                  <Text style={styles.reviewFieldLabel}>State / UT</Text>
                  <Text style={styles.reviewFieldValue}>{newPrincipalState || "-"}</Text>
                </View>
                <View style={styles.reviewFieldRow}>
                  <Text style={styles.reviewFieldLabel}>PIN Code</Text>
                  <Text style={styles.reviewFieldValue}>{newPrincipalPincode || "-"}</Text>
                </View>
                <View style={styles.reviewFieldRow}>
                  <Text style={styles.reviewFieldLabel}>Nature of Premises</Text>
                  <Text style={styles.reviewFieldValue}>{newPrincipalNatureOfPremises || "-"}</Text>
                </View>
              </View>
            )}

            {selectedSectionId === "additional-place" && (
              <View style={styles.gap8}>
                <View style={styles.reviewFieldRow}>
                  <Text style={styles.reviewFieldLabel}>Additional Place Address</Text>
                  <Text style={styles.reviewFieldValue}>{newAdditionalAddress || "-"}</Text>
                </View>
                <View style={styles.reviewFieldRow}>
                  <Text style={styles.reviewFieldLabel}>City</Text>
                  <Text style={styles.reviewFieldValue}>{newAdditionalCity || "-"}</Text>
                </View>
                <View style={styles.reviewFieldRow}>
                  <Text style={styles.reviewFieldLabel}>PIN Code</Text>
                  <Text style={styles.reviewFieldValue}>{newAdditionalPincode || "-"}</Text>
                </View>
                <View style={styles.reviewFieldRow}>
                  <Text style={styles.reviewFieldLabel}>Nature of Premises</Text>
                  <Text style={styles.reviewFieldValue}>{newAdditionalNatureOfPremises || "-"}</Text>
                </View>
              </View>
            )}

            {selectedSectionId === "bank-accounts" && (
              <View style={styles.gap8}>
                <View style={styles.reviewFieldRow}>
                  <Text style={styles.reviewFieldLabel}>Bank Name</Text>
                  <Text style={styles.reviewFieldValue}>{newBankName || "-"}</Text>
                </View>
                <View style={styles.reviewFieldRow}>
                  <Text style={styles.reviewFieldLabel}>Account Number</Text>
                  <Text style={styles.reviewFieldValue}>{newBankAccountNumber || "-"}</Text>
                </View>
                <View style={styles.reviewFieldRow}>
                  <Text style={styles.reviewFieldLabel}>IFSC Code</Text>
                  <Text style={styles.reviewFieldValue}>{newIfscCode || "-"}</Text>
                </View>
                <View style={styles.reviewFieldRow}>
                  <Text style={styles.reviewFieldLabel}>Account Type</Text>
                  <Text style={styles.reviewFieldValue}>{newAccountType || "-"}</Text>
                </View>
              </View>
            )}

            {selectedSectionId === "authorised-signatories" && (
              <View style={styles.gap8}>
                <View style={styles.reviewFieldRow}>
                  <Text style={styles.reviewFieldLabel}>Signatory Name</Text>
                  <Text style={styles.reviewFieldValue}>{newSignatoryName || "-"}</Text>
                </View>
                <View style={styles.reviewFieldRow}>
                  <Text style={styles.reviewFieldLabel}>Signatory PAN</Text>
                  <Text style={styles.reviewFieldValue}>{newSignatoryPan || "-"}</Text>
                </View>
                {newSignatoryDob ? (
                  <View style={styles.reviewFieldRow}>
                    <Text style={styles.reviewFieldLabel}>Date of Birth</Text>
                    <Text style={styles.reviewFieldValue}>{newSignatoryDob}</Text>
                  </View>
                ) : null}
                {newSignatoryDesignation ? (
                  <View style={styles.reviewFieldRow}>
                    <Text style={styles.reviewFieldLabel}>Designation</Text>
                    <Text style={styles.reviewFieldValue}>{newSignatoryDesignation}</Text>
                  </View>
                ) : null}
                {newSignatoryMobile ? (
                  <View style={styles.reviewFieldRow}>
                    <Text style={styles.reviewFieldLabel}>Signatory Mobile</Text>
                    <Text style={styles.reviewFieldValue}>{newSignatoryMobile}</Text>
                  </View>
                ) : null}
                {newSignatoryEmail ? (
                  <View style={styles.reviewFieldRow}>
                    <Text style={styles.reviewFieldLabel}>Signatory Email</Text>
                    <Text style={styles.reviewFieldValue}>{newSignatoryEmail}</Text>
                  </View>
                ) : null}
              </View>
            )}

            {selectedSectionId === "contact-details" && (
              <View style={styles.gap8}>
                <View style={styles.reviewFieldRow}>
                  <Text style={styles.reviewFieldLabel}>Mobile Number</Text>
                  <Text style={styles.reviewFieldValue}>{newContactMobile || "-"}</Text>
                </View>
                <View style={styles.reviewFieldRow}>
                  <Text style={styles.reviewFieldLabel}>Email Address</Text>
                  <Text style={styles.reviewFieldValue}>{newContactEmail || "-"}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Supporting Documents Card */}
          <View style={styles.reviewDocsCard}>
            <Text style={styles.reviewDocsTitle}>Supporting documents</Text>
            {supportingDoc ? (
              <View style={styles.reviewDocRow}>
                <Text style={styles.reviewDocName} numberOfLines={1}>
                  {supportingDoc.name}
                </Text>
                <Text style={styles.reviewDocSize}>{supportingDoc.size}</Text>
              </View>
            ) : (
              <Text style={styles.noDocText}>No document attached</Text>
            )}
          </View>

          {/* Declaration Checkbox */}
          <TouchableOpacity
            style={styles.declarationBox}
            activeOpacity={0.85}
            onPress={() => setDeclared(!declared)}
          >
            <View style={[styles.checkbox, declared && styles.checkboxActive]}>
              {declared && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
            </View>
            <Text style={styles.declarationText}>
              I declare that the amendment details above are true and correct, and I authorise TaxEdge Fin Solutions to file this amendment on my behalf.
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* FIXED BOTTOM ACTION AREA */}
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TouchableOpacity
            style={[styles.primaryBtn, (!declared || isSubmitting) && { opacity: 0.65 }]}
            activeOpacity={0.85}
            onPress={handleSubmitAmendment}
            disabled={isSubmitting || !declared}
          >
            <Text style={styles.primaryBtnText}>
              {isSubmitting ? "Submitting..." : "Submit Amendment Request"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /* ------------------------------------------------------------- */
  /* SCREEN 2: EDIT SECTION SCREEN (Screenshot 3)                 */
  /* ------------------------------------------------------------- */
  if (currentStep === "EDIT") {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

        {/* Header */}
        <View style={[styles.headerBar, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setCurrentStep("LANDING")}
            style={styles.roundBackButton}
          >
            <Ionicons name="chevron-back" size={22} color={BrandColors.PRIMARY_BLUE} />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerMainTitle}>{selectedSection.title}</Text>
            <Text style={styles.headerSubtitle}>Current details are read-only</Text>
          </View>
          <View style={styles.placeholderBox} />
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.editContainer}>
            {/* CURRENTLY REGISTERED CARD (READ-ONLY) */}
            <View style={styles.currentRegisteredCard}>
              <View>
                <Text style={styles.currentRegisteredHeader}>Currently registered (read-only)</Text>
              </View>

              {selectedSectionId === "legal-name" && (
                <View style={styles.currentFieldRow}>
                  <Text style={styles.currentFieldLabel}>Legal Business Name</Text>
                  <Text style={styles.currentFieldValue}>{registeredDetails.legalBusinessName}</Text>
                </View>
              )}

              {selectedSectionId === "principal-place" && (
                <>
                  <View style={styles.currentFieldRow}>
                    <Text style={styles.currentFieldLabel}>Address</Text>
                    <Text style={styles.currentFieldValue}>{registeredDetails.principalAddress}</Text>
                  </View>
                  <View style={styles.currentFieldRow}>
                    <Text style={styles.currentFieldLabel}>City</Text>
                    <Text style={styles.currentFieldValue}>{registeredDetails.principalCity}</Text>
                  </View>
                  <View style={styles.currentFieldRow}>
                    <Text style={styles.currentFieldLabel}>District</Text>
                    <Text style={styles.currentFieldValue}>{registeredDetails.principalDistrict}</Text>
                  </View>
                  <View style={styles.currentFieldRow}>
                    <Text style={styles.currentFieldLabel}>State</Text>
                    <Text style={styles.currentFieldValue}>{registeredDetails.principalState}</Text>
                  </View>
                  <View style={styles.currentFieldRow}>
                    <Text style={styles.currentFieldLabel}>PIN Code</Text>
                    <Text style={styles.currentFieldValue}>{registeredDetails.principalPincode}</Text>
                  </View>
                </>
              )}

              {selectedSectionId === "additional-place" && (
                <>
                  <View style={styles.currentFieldRow}>
                    <Text style={styles.currentFieldLabel}>Address</Text>
                    <Text style={styles.currentFieldValue}>{registeredDetails.additionalAddress}</Text>
                  </View>
                  <View style={styles.currentFieldRow}>
                    <Text style={styles.currentFieldLabel}>City</Text>
                    <Text style={styles.currentFieldValue}>{registeredDetails.additionalCity}</Text>
                  </View>
                  <View style={styles.currentFieldRow}>
                    <Text style={styles.currentFieldLabel}>PIN Code</Text>
                    <Text style={styles.currentFieldValue}>{registeredDetails.additionalPincode}</Text>
                  </View>
                  <View style={styles.currentFieldRow}>
                    <Text style={styles.currentFieldLabel}>Nature of Premises</Text>
                    <Text style={styles.currentFieldValue}>{registeredDetails.additionalNatureOfPremises}</Text>
                  </View>
                </>
              )}

              {selectedSectionId === "bank-accounts" && (
                <>
                  <View style={styles.currentFieldRow}>
                    <Text style={styles.currentFieldLabel}>Bank Name</Text>
                    <Text style={styles.currentFieldValue}>{registeredDetails.bankName}</Text>
                  </View>
                  <View style={styles.currentFieldRow}>
                    <Text style={styles.currentFieldLabel}>Account Number</Text>
                    <Text style={styles.currentFieldValue}>{registeredDetails.bankAccountNumber}</Text>
                  </View>
                  <View style={styles.currentFieldRow}>
                    <Text style={styles.currentFieldLabel}>IFSC Code</Text>
                    <Text style={styles.currentFieldValue}>{registeredDetails.ifscCode}</Text>
                  </View>
                  <View style={styles.currentFieldRow}>
                    <Text style={styles.currentFieldLabel}>Account Type</Text>
                    <Text style={styles.currentFieldValue}>{registeredDetails.accountType}</Text>
                  </View>
                </>
              )}

              {selectedSectionId === "authorised-signatories" && (
                <>
                  <View style={styles.currentFieldRow}>
                    <Text style={styles.currentFieldLabel}>Name</Text>
                    <Text style={styles.currentFieldValue}>{registeredDetails.signatoryName}</Text>
                  </View>
                  <View style={styles.currentFieldRow}>
                    <Text style={styles.currentFieldLabel}>PAN</Text>
                    <Text style={styles.currentFieldValue}>{registeredDetails.signatoryPan}</Text>
                  </View>
                  <View style={styles.currentFieldRow}>
                    <Text style={styles.currentFieldLabel}>Designation</Text>
                    <Text style={styles.currentFieldValue}>{registeredDetails.signatoryDesignation}</Text>
                  </View>
                  <View style={styles.currentFieldRow}>
                    <Text style={styles.currentFieldLabel}>Mobile</Text>
                    <Text style={styles.currentFieldValue}>{registeredDetails.signatoryMobile}</Text>
                  </View>
                  <View style={styles.currentFieldRow}>
                    <Text style={styles.currentFieldLabel}>Email</Text>
                    <Text style={styles.currentFieldValue}>{registeredDetails.signatoryEmail}</Text>
                  </View>
                </>
              )}

              {selectedSectionId === "contact-details" && (
                <>
                  <View style={styles.currentFieldRow}>
                    <Text style={styles.currentFieldLabel}>Mobile</Text>
                    <Text style={styles.currentFieldValue}>{registeredDetails.contactMobile}</Text>
                  </View>
                  <View style={styles.currentFieldRow}>
                    <Text style={styles.currentFieldLabel}>Email</Text>
                    <Text style={styles.currentFieldValue}>{registeredDetails.contactEmail}</Text>
                  </View>
                </>
              )}
            </View>

            {/* NEW DETAILS (EXACT REGISTRATION FIELDS) */}
            <Text style={styles.formSectionTitle}>New details</Text>

            {selectedSectionId === "legal-name" && (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>
                  New Legal Business Name <Text style={styles.star}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.newLegalBusinessName && styles.inputError]}
                  placeholder="As per PAN"
                  placeholderTextColor="#94A3B8"
                  value={newLegalBusinessName}
                  onChangeText={(t) => {
                    setNewLegalBusinessName(t);
                    clearError("newLegalBusinessName");
                  }}
                />
                {errors.newLegalBusinessName && (
                  <Text style={styles.errorText}>{errors.newLegalBusinessName}</Text>
                )}
              </View>
            )}

            {selectedSectionId === "principal-place" && (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    New Business Address <Text style={styles.star}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.newPrincipalAddress && styles.inputError]}
                    placeholder="Building, street, locality"
                    placeholderTextColor="#94A3B8"
                    value={newPrincipalAddress}
                    onChangeText={(t) => {
                      setNewPrincipalAddress(t);
                      clearError("newPrincipalAddress");
                    }}
                  />
                  {errors.newPrincipalAddress && (
                    <Text style={styles.errorText}>{errors.newPrincipalAddress}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    City <Text style={styles.star}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.newPrincipalCity && styles.inputError]}
                    placeholder="City"
                    placeholderTextColor="#94A3B8"
                    value={newPrincipalCity}
                    onChangeText={(t) => {
                      setNewPrincipalCity(t);
                      clearError("newPrincipalCity");
                    }}
                  />
                  {errors.newPrincipalCity && (
                    <Text style={styles.errorText}>{errors.newPrincipalCity}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    District <Text style={styles.star}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.newPrincipalDistrict && styles.inputError]}
                    placeholder="District"
                    placeholderTextColor="#94A3B8"
                    value={newPrincipalDistrict}
                    onChangeText={(t) => {
                      setNewPrincipalDistrict(t);
                      clearError("newPrincipalDistrict");
                    }}
                  />
                  {errors.newPrincipalDistrict && (
                    <Text style={styles.errorText}>{errors.newPrincipalDistrict}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    State / UT <Text style={styles.star}>*</Text>
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      openPickerModal(
                        "Select State / UT",
                        INDIAN_STATES_AND_UTS,
                        newPrincipalState,
                        (val) => {
                          setNewPrincipalState(val);
                          clearError("newPrincipalState");
                        }
                      )
                    }
                    style={[styles.dropdownSelect, errors.newPrincipalState && styles.inputError]}
                  >
                    <Text style={newPrincipalState ? styles.dropdownSelectText : styles.dropdownPlaceholderText}>
                      {newPrincipalState || "Select an option"}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#64748B" />
                  </TouchableOpacity>
                  {errors.newPrincipalState && (
                    <Text style={styles.errorText}>{errors.newPrincipalState}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    PIN Code <Text style={styles.star}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.newPrincipalPincode && styles.inputError]}
                    placeholder="560001"
                    placeholderTextColor="#94A3B8"
                    value={newPrincipalPincode}
                    onChangeText={(t) => {
                      const num = t.replace(/\D/g, "").slice(0, 6);
                      setNewPrincipalPincode(num);
                      clearError("newPrincipalPincode");
                    }}
                    keyboardType="numeric"
                    maxLength={6}
                  />
                  <View style={styles.fieldCounterRow}>
                    <Text style={styles.fieldCounterText}>{`${newPrincipalPincode.length} / 6 digits`}</Text>
                  </View>
                  {errors.newPrincipalPincode && (
                    <Text style={styles.errorText}>{errors.newPrincipalPincode}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    Nature of Premises <Text style={styles.star}>*</Text>
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      openPickerModal(
                        "Select Nature of Premises",
                        NATURE_OF_PREMISES_OPTIONS,
                        newPrincipalNatureOfPremises,
                        (val) => {
                          setNewPrincipalNatureOfPremises(val);
                          clearError("newPrincipalNatureOfPremises");
                        }
                      )
                    }
                    style={[styles.dropdownSelect, errors.newPrincipalNatureOfPremises && styles.inputError]}
                  >
                    <Text style={newPrincipalNatureOfPremises ? styles.dropdownSelectText : styles.dropdownPlaceholderText}>
                      {newPrincipalNatureOfPremises || "Select an option"}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#64748B" />
                  </TouchableOpacity>
                  {errors.newPrincipalNatureOfPremises && (
                    <Text style={styles.errorText}>{errors.newPrincipalNatureOfPremises}</Text>
                  )}
                </View>
              </>
            )}

            {selectedSectionId === "additional-place" && (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    New Additional Place Address <Text style={styles.star}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.newAdditionalAddress && styles.inputError]}
                    placeholder="Building, street, locality"
                    placeholderTextColor="#94A3B8"
                    value={newAdditionalAddress}
                    onChangeText={(t) => {
                      setNewAdditionalAddress(t);
                      clearError("newAdditionalAddress");
                    }}
                  />
                  {errors.newAdditionalAddress && (
                    <Text style={styles.errorText}>{errors.newAdditionalAddress}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    City <Text style={styles.star}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.newAdditionalCity && styles.inputError]}
                    placeholder="City"
                    placeholderTextColor="#94A3B8"
                    value={newAdditionalCity}
                    onChangeText={(t) => {
                      setNewAdditionalCity(t);
                      clearError("newAdditionalCity");
                    }}
                  />
                  {errors.newAdditionalCity && (
                    <Text style={styles.errorText}>{errors.newAdditionalCity}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    PIN Code <Text style={styles.star}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.newAdditionalPincode && styles.inputError]}
                    placeholder="560001"
                    placeholderTextColor="#94A3B8"
                    value={newAdditionalPincode}
                    onChangeText={(t) => {
                      const num = t.replace(/\D/g, "").slice(0, 6);
                      setNewAdditionalPincode(num);
                      clearError("newAdditionalPincode");
                    }}
                    keyboardType="numeric"
                    maxLength={6}
                  />
                  <View style={styles.fieldCounterRow}>
                    <Text style={styles.fieldCounterText}>{`${newAdditionalPincode.length} / 6 digits`}</Text>
                  </View>
                  {errors.newAdditionalPincode && (
                    <Text style={styles.errorText}>{errors.newAdditionalPincode}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    Nature of Premises <Text style={styles.star}>*</Text>
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      openPickerModal(
                        "Select Nature of Premises",
                        NATURE_OF_PREMISES_OPTIONS,
                        newAdditionalNatureOfPremises,
                        (val) => {
                          setNewAdditionalNatureOfPremises(val);
                          clearError("newAdditionalNatureOfPremises");
                        }
                      )
                    }
                    style={[styles.dropdownSelect, errors.newAdditionalNatureOfPremises && styles.inputError]}
                  >
                    <Text style={newAdditionalNatureOfPremises ? styles.dropdownSelectText : styles.dropdownPlaceholderText}>
                      {newAdditionalNatureOfPremises || "Select an option"}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#64748B" />
                  </TouchableOpacity>
                  {errors.newAdditionalNatureOfPremises && (
                    <Text style={styles.errorText}>{errors.newAdditionalNatureOfPremises}</Text>
                  )}
                </View>
              </>
            )}

            {selectedSectionId === "bank-accounts" && (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    New Bank Name <Text style={styles.star}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.newBankName && styles.inputError]}
                    placeholder="ICICI Bank"
                    placeholderTextColor="#94A3B8"
                    value={newBankName}
                    onChangeText={(t) => {
                      setNewBankName(t);
                      clearError("newBankName");
                    }}
                  />
                  {errors.newBankName && (
                    <Text style={styles.errorText}>{errors.newBankName}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    New Account Number <Text style={styles.star}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.newBankAccountNumber && styles.inputError]}
                    placeholder="Enter account number"
                    placeholderTextColor="#94A3B8"
                    value={newBankAccountNumber}
                    onChangeText={(t) => {
                      setNewBankAccountNumber(t.replace(/\D/g, ""));
                      clearError("newBankAccountNumber");
                    }}
                    keyboardType="numeric"
                    maxLength={18}
                  />
                  {errors.newBankAccountNumber && (
                    <Text style={styles.errorText}>{errors.newBankAccountNumber}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    Confirm Account Number <Text style={styles.star}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.confirmBankAccountNumber && styles.inputError]}
                    placeholder="Re-enter account number"
                    placeholderTextColor="#94A3B8"
                    value={confirmBankAccountNumber}
                    onChangeText={(t) => {
                      setConfirmBankAccountNumber(t.replace(/\D/g, ""));
                      clearError("confirmBankAccountNumber");
                    }}
                    keyboardType="numeric"
                    maxLength={18}
                  />
                  {errors.confirmBankAccountNumber && (
                    <Text style={styles.errorText}>{errors.confirmBankAccountNumber}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    New IFSC Code <Text style={styles.star}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.newIfscCode && styles.inputError]}
                    placeholder="ICIC0005678"
                    placeholderTextColor="#94A3B8"
                    value={newIfscCode}
                    onChangeText={(t) => {
                      setNewIfscCode(t.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());
                      clearError("newIfscCode");
                    }}
                    autoCapitalize="characters"
                    maxLength={11}
                  />
                  {errors.newIfscCode && (
                    <Text style={styles.errorText}>{errors.newIfscCode}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    Account Type <Text style={styles.star}>*</Text>
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      openPickerModal(
                        "Select Account Type",
                        BANK_ACCOUNT_TYPES,
                        newAccountType,
                        (val) => {
                          setNewAccountType(val);
                          clearError("newAccountType");
                        }
                      )
                    }
                    style={[styles.dropdownSelect, errors.newAccountType && styles.inputError]}
                  >
                    <Text style={newAccountType ? styles.dropdownSelectText : styles.dropdownPlaceholderText}>
                      {newAccountType || "Select an option"}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#64748B" />
                  </TouchableOpacity>
                  {errors.newAccountType && (
                    <Text style={styles.errorText}>{errors.newAccountType}</Text>
                  )}
                </View>
              </>
            )}

            {selectedSectionId === "authorised-signatories" && (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    New Signatory Name <Text style={styles.star}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.newSignatoryName && styles.inputError]}
                    placeholder="Full name"
                    placeholderTextColor="#94A3B8"
                    value={newSignatoryName}
                    onChangeText={(t) => {
                      setNewSignatoryName(t);
                      clearError("newSignatoryName");
                    }}
                  />
                  {errors.newSignatoryName && (
                    <Text style={styles.errorText}>{errors.newSignatoryName}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    Signatory PAN <Text style={styles.star}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.newSignatoryPan && styles.inputError]}
                    placeholder="ABCDE1234F"
                    placeholderTextColor="#94A3B8"
                    value={newSignatoryPan}
                    onChangeText={(t) => {
                      setNewSignatoryPan(t.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());
                      clearError("newSignatoryPan");
                    }}
                    autoCapitalize="characters"
                    maxLength={10}
                  />
                  {errors.newSignatoryPan && (
                    <Text style={styles.errorText}>{errors.newSignatoryPan}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    Date of Birth <Text style={styles.star}>*</Text>
                  </Text>
                  <View style={[styles.dateInputWrap, errors.newSignatoryDob && styles.inputError]}>
                    <TextInput
                      style={styles.dateTextInput}
                      placeholder="dd-mm-yyyy"
                      placeholderTextColor="#94A3B8"
                      value={newSignatoryDob}
                      onChangeText={(t) => {
                        setNewSignatoryDob(t);
                        clearError("newSignatoryDob");
                      }}
                      maxLength={10}
                    />
                    <View style={styles.dateIconBox}>
                      <Ionicons name="calendar-outline" size={19} color="#64748B" />
                    </View>
                  </View>
                  {errors.newSignatoryDob && (
                    <Text style={styles.errorText}>{errors.newSignatoryDob}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    Designation <Text style={styles.star}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.newSignatoryDesignation && styles.inputError]}
                    placeholder="KENFCNKFJC"
                    placeholderTextColor="#94A3B8"
                    value={newSignatoryDesignation}
                    onChangeText={(t) => {
                      setNewSignatoryDesignation(t);
                      clearError("newSignatoryDesignation");
                    }}
                  />
                  {errors.newSignatoryDesignation && (
                    <Text style={styles.errorText}>{errors.newSignatoryDesignation}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    Signatory Mobile <Text style={styles.star}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.newSignatoryMobile && styles.inputError]}
                    placeholder="8749594844"
                    placeholderTextColor="#94A3B8"
                    value={newSignatoryMobile}
                    onChangeText={(t) => {
                      setNewSignatoryMobile(t.replace(/\D/g, ""));
                      clearError("newSignatoryMobile");
                    }}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                  {errors.newSignatoryMobile && (
                    <Text style={styles.errorText}>{errors.newSignatoryMobile}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    Signatory Email <Text style={styles.star}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.newSignatoryEmail && styles.inputError]}
                    placeholder="name@business.com"
                    placeholderTextColor="#94A3B8"
                    value={newSignatoryEmail}
                    onChangeText={(t) => {
                      setNewSignatoryEmail(t.trim());
                      clearError("newSignatoryEmail");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {errors.newSignatoryEmail && (
                    <Text style={styles.errorText}>{errors.newSignatoryEmail}</Text>
                  )}
                </View>
              </>
            )}

            {selectedSectionId === "contact-details" && (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    New Mobile Number <Text style={styles.star}>*</Text>
                  </Text>
                  <View style={[styles.phoneInputWrap, errors.newContactMobile && styles.inputError]}>
                    <View style={styles.phonePrefixBox}>
                      <Text style={styles.phonePrefixText}>+91</Text>
                    </View>
                    <TextInput
                      style={styles.phoneTextInput}
                      placeholder="XXXXX XXXXX"
                      placeholderTextColor="#94A3B8"
                      value={newContactMobile}
                      onChangeText={(t) => {
                        setNewContactMobile(t.replace(/\D/g, ""));
                        clearError("newContactMobile");
                      }}
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                  </View>
                  {errors.newContactMobile && (
                    <Text style={styles.errorText}>{errors.newContactMobile}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    New Email Address <Text style={styles.star}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.newContactEmail && styles.inputError]}
                    placeholder="name@business.com"
                    placeholderTextColor="#94A3B8"
                    value={newContactEmail}
                    onChangeText={(t) => {
                      setNewContactEmail(t.trim());
                      clearError("newContactEmail");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {errors.newContactEmail && (
                    <Text style={styles.errorText}>{errors.newContactEmail}</Text>
                  )}
                </View>
              </>
            )}

            {/* SUPPORTING PROOF (SCREENSHOT 3 PATTERN) */}
            <Text style={styles.formSectionTitle}>Supporting proof</Text>

            <View style={styles.proofCard}>
              <Text style={styles.proofDescText}>
                Attach the document that evidences this change (PDF, JPG, PNG - max 10 MB).
              </Text>

              <View style={styles.uploadActionsRow}>
                <TouchableOpacity
                  style={styles.uploadBtn}
                  activeOpacity={0.8}
                  onPress={handleBrowseFiles}
                >
                  <Ionicons name="folder-outline" size={18} color="#EA580C" />
                  <Text style={styles.uploadBtnText}>Browse Files</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.uploadBtn}
                  activeOpacity={0.8}
                  onPress={handleScanFile}
                >
                  <Ionicons name="camera-outline" size={18} color={BrandColors.PRIMARY_BLUE} />
                  <Text style={styles.uploadBtnText}>Scan</Text>
                </TouchableOpacity>
              </View>

              {supportingDoc && (
                <View style={styles.docPreviewRow}>
                  <View style={styles.docPreviewIcon}>
                    <Ionicons name="document-text" size={20} color={BrandColors.PRIMARY_BLUE} />
                  </View>
                  <View style={styles.docPreviewInfo}>
                    <Text style={styles.docPreviewName} numberOfLines={1}>
                      {supportingDoc.name}
                    </Text>
                    <Text style={styles.docPreviewSize}>{supportingDoc.size}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.docDeleteBtn}
                    onPress={() => setSupportingDoc(null)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.docDeleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}

              {errors.supportingDoc && (
                <Text style={styles.proofErrorText}>{errors.supportingDoc}</Text>
              )}
            </View>

            {/* ACCEPTED PROOFS INFORMATIONAL AREA */}
            {currentAcceptedProofs && (
              <View style={styles.acceptedProofsCard}>
                <View style={styles.acceptedProofsHeader}>
                  <Ionicons name="information-circle" size={20} color={BrandColors.PRIMARY_ORANGE} />
                  <Text style={styles.acceptedProofsTitle}>Accepted proofs</Text>
                </View>

                <View style={styles.acceptedProofList}>
                  {displayedProofs.map((proofText, idx) => (
                    <View key={idx} style={styles.acceptedProofItem}>
                      <View style={styles.acceptedProofDot} />
                      <Text style={styles.acceptedProofText}>{proofText}</Text>
                    </View>
                  ))}
                </View>

                {hasMoreProofs && (
                  <TouchableOpacity
                    style={styles.viewMoreBtn}
                    activeOpacity={0.7}
                    onPress={() => setIsProofsExpanded((prev) => !prev)}
                  >
                    <Text style={styles.viewMoreText}>
                      {isProofsExpanded ? "View Less" : "View More"}
                    </Text>
                    <Ionicons
                      name={isProofsExpanded ? "chevron-up" : "chevron-down"}
                      size={14}
                      color={BrandColors.PRIMARY_ORANGE}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}

          </View>
        </ScrollView>

        {/* FIXED BOTTOM ACTION AREA */}
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={handleReviewChanges}
          >
            <Text style={styles.primaryBtnText}>Review Changes</Text>
          </TouchableOpacity>
        </View>

        {/* SELECTION MODAL FOR DROPDOWNS */}
        <Modal
          visible={pickerModal.isOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setPickerModal((prev) => ({ ...prev, isOpen: false }))}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setPickerModal((prev) => ({ ...prev, isOpen: false }))}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{pickerModal.title}</Text>
                <TouchableOpacity
                  onPress={() => setPickerModal((prev) => ({ ...prev, isOpen: false }))}
                  style={styles.modalCloseBtn}
                >
                  <Ionicons name="close" size={22} color="#64748B" />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {pickerModal.options.map((opt) => {
                  const isSelected = pickerModal.selectedVal === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={styles.modalOptionItem}
                      activeOpacity={0.7}
                      onPress={() => {
                        pickerModal.onSelect(opt);
                        setPickerModal((prev) => ({ ...prev, isOpen: false }));
                      }}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          isSelected && styles.modalOptionSelectedText,
                        ]}
                      >
                        {opt}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark" size={18} color={BrandColors.PRIMARY_BLUE} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Universal Draft Guard Modal */}
        <UniversalDraftModal
          visible={showDraftModal}
          title="Save Amendment Draft?"
          message="You have unsaved changes in your GST amendment request. Save your progress so you can resume anytime."
          saveButtonText="Save as Draft & Exit"
          discardButtonText="Discard & Exit"
          cancelButtonText="Keep Editing"
          onSaveAndExit={handleSaveAndExit}
          onDiscardAndExit={handleDiscardAndExit}
          onCancel={handleCancel}
        />
      </View>
    );
  }

  /* ------------------------------------------------------------- */
  /* SCREEN 1: LANDING SCREEN (Screenshots 1 & 2)                  */
  /* ------------------------------------------------------------- */
  const coreAmendments = AMENDMENT_SECTIONS.filter((s) => s.type === "core");
  const nonCoreAmendments = AMENDMENT_SECTIONS.filter((s) => s.type === "non-core");

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={[styles.headerBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.roundBackButton}
        >
          <Ionicons name="chevron-back" size={22} color={BrandColors.PRIMARY_BLUE} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerMainTitle}>GST Amendment</Text>
          <Text style={styles.headerSubtitle}>Select what you want to change</Text>
        </View>
        <View style={styles.placeholderBox} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 30 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Info Banner */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconBox}>
            <Ionicons name="information-circle" size={20} color={BrandColors.PRIMARY_BLUE} />
          </View>
          <Text style={styles.infoText}>
            Amendments reuse your GST Registration fields, validation and upload flow - nothing new to learn.
          </Text>
        </View>

        {/* GSTIN Field with character counter */}
        <View style={styles.gstinBlock}>
          <Text style={styles.gstinLabel}>
            GSTIN / Business ID <Text style={styles.star}>*</Text>
          </Text>
          <TextInput
            style={[styles.gstinInput, errors.gstin && styles.gstinInputError]}
            placeholder="e.g. 29AAAAA0000A1Z5 or GST ID"
            placeholderTextColor="#94A3B8"
            value={gstin}
            onChangeText={handleGstinChange}
            autoCapitalize="characters"
            maxLength={18}
          />
          <View style={styles.gstinCounterRow}>
            {errors.gstin ? (
              <Text style={styles.errorText}>{errors.gstin}</Text>
            ) : (
              <View />
            )}
            <Text style={styles.charCountText}>{gstin.length} chars</Text>
          </View>
        </View>

        {/* Core Amendments Group */}
        <Text style={styles.sectionHeading}>Core amendments</Text>
        <View style={styles.cardGroup}>
          {coreAmendments.map((sec) => (
            <TouchableOpacity
              key={sec.id}
              activeOpacity={0.8}
              style={styles.amendmentCard}
              onPress={() => handleSelectSection(sec.id)}
            >
              <View style={[styles.cardIconBox, { backgroundColor: sec.iconBg }]}>
                <Ionicons name={sec.icon} size={22} color={sec.iconColor} />
              </View>
              <View style={styles.cardContentCol}>
                <Text style={styles.cardTitle}>{sec.title}</Text>
                <Text style={styles.cardSubtitle}>{sec.typeLabel}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" style={styles.cardChevron} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Non-Core Amendments Group */}
        <Text style={styles.sectionHeading}>Non-core amendments</Text>
        <View style={styles.cardGroup}>
          {nonCoreAmendments.map((sec) => (
            <TouchableOpacity
              key={sec.id}
              activeOpacity={0.8}
              style={styles.amendmentCard}
              onPress={() => handleSelectSection(sec.id)}
            >
              <View style={[styles.cardIconBox, { backgroundColor: sec.iconBg }]}>
                <Ionicons name={sec.icon} size={22} color={sec.iconColor} />
              </View>
              <View style={styles.cardContentCol}>
                <Text style={styles.cardTitle}>{sec.title}</Text>
                <Text style={styles.cardSubtitle}>{sec.typeLabel}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" style={styles.cardChevron} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Universal Draft Guard Modal */}
      <UniversalDraftModal
        visible={showDraftModal}
        title="Save Amendment Draft?"
        message="You have unsaved changes in your GST amendment request. Save your progress so you can resume anytime."
        saveButtonText="Save as Draft & Exit"
        discardButtonText="Discard & Exit"
        cancelButtonText="Keep Editing"
        onSaveAndExit={handleSaveAndExit}
        onDiscardAndExit={handleDiscardAndExit}
        onCancel={handleCancel}
      />
    </View>
  );
}

export default GstAmendmentScreen;

