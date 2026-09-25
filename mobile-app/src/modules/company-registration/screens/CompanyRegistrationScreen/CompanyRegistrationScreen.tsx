import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { UniversalDraftModal } from '@/shared/components/UniversalDraftModal';
import { useUniversalDraftGuard } from '@/shared/hooks/useUniversalDraftGuard';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { companySchema } from '../../validation/companySchema';
import { directorSchema } from '../../validation/directorSchema';

import { StepCompanyType } from '../../components/steps/StepCompanyType';
import { StepCombinedDetails } from '../../components/steps/StepCombinedDetails';
import { StepRegisteredOffice } from '../../components/steps/StepRegisteredOffice';
import { StepPromoters } from '../../components/steps/StepPromoters';
import { StepCapitalShareholding } from '../../components/steps/StepCapitalShareholding';
import { StepDocumentsKYC } from '../../components/steps/StepDocumentsKYC';
import { StepLinkedRegistrations } from '../../components/steps/StepLinkedRegistrations';
import { StepReviewApplication } from '../../components/steps/StepReviewApplication';
import { StepFeesPayment } from '../../components/steps/StepFeesPayment';
import { StepApplicationTracking } from '../../components/steps/StepApplicationTracking';
import { StepSubmissionSuccess } from '../../components/steps/StepSubmissionSuccess';
import { StepApplicationReceipt } from '../../components/steps/StepApplicationReceipt';

import { styles } from './CompanyRegistrationScreen.styles';

const STEP_NAMES = [
  'Company Type Selection',
  'Company Details & Names',
  'Registered Office Details',
  'Promoter / Director Details',
  'Shareholding & Capital',
  'Documents & KYC Checklist',
  'Linked Registrations',
  'Review Application',
  'Fees & Payment Breakdown',
  'Submission Success',
  'Application Tracking',
];

export const CompanyRegistrationScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const draft = useCompanyRegistrationStore((state) => state.draft);
  const setStep = useCompanyRegistrationStore((state) => state.setStep);
  const resetRegistration = useCompanyRegistrationStore((state) => state.resetRegistration);

  const currentStep = draft.currentStep;
  const totalSteps = STEP_NAMES.length;
  const progressPercent = (currentStep / totalSteps) * 100;

  const {
    showDraftModal,
    handleSaveAndExit,
    handleDiscardAndExit,
    handleCancel,
  } = useUniversalDraftGuard({
    isDirty: () => {
      // Dirty if they advanced past step 0 or typed something in step 0
      return currentStep > 0 || !!draft.company.companyType;
    },
    onSaveDraft: () => {
      // Draft state is already preserved in Zustand store
    },
    onDiscardDraft: () => {
      resetRegistration();
    },
    isSubmitted: () => draft.status === 'Submitted',
    discardDestination: '/(main)/home',
  });

  const handleHeaderBack = () => {
    if (currentStep > 0) {
      setStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleNext = () => {
    // Step 0: Company Type
    if (currentStep === 0) {
      if (!draft.company.companyType) {
        Alert.alert('Validation Error', 'Please select a Company Type to proceed.');
        return;
      }
    }

    // Step 1: Combined Details (Classification, Activity, Names)
    if (currentStep === 1) {
      const { valid, errors } = companySchema.validateStep(1, draft.company);
      if (!valid && errors.length > 0) {
        Alert.alert('Validation Error', errors[0]);
        return;
      }
    }

    // Step 2: Registered Office
    if (currentStep === 2) {
      const { valid, errors } = companySchema.validateStep(2, draft.company);
      if (!valid && errors.length > 0) {
        Alert.alert('Validation Error', errors[0]);
        return;
      }
    }

    // Step 3: Promoter / Director Details
    if (currentStep === 3) {
      if (draft.directors.length === 0) {
        Alert.alert('Validation Error', 'At least one promoter/director is required.');
        return;
      }

      for (let i = 0; i < draft.directors.length; i++) {
        const { valid, errors } = directorSchema.validateDirector(draft.directors[i]);
        if (!valid && errors.length > 0) {
          Alert.alert(`Validation Error - Director ${i + 1}`, errors[0]);
          return;
        }
      }
    }

    // Step 4: Shareholding & Capital
    if (currentStep === 4) {
      const { valid, errors } = companySchema.validateStep(4, draft.company);
      if (!valid && errors.length > 0) {
        Alert.alert('Validation Error', errors[0]);
        return;
      }
      // Check if total shares equals the sum of directors' shares
      const totalSubscribed = draft.directors.reduce((sum, d) => sum + (Number(d.numberOfShares) || 0), 0);
      if (totalSubscribed !== draft.company.numberOfShares) {
        Alert.alert('Validation Error', 'Total subscribed shares by directors must equal the total number of shares of the company.');
        return;
      }
    }

    // Validation for Step 5 (Documents & KYC Checklist)
    if (currentStep === 5) {
      const requiredIds = ['doc-pan', 'doc-aadhaar', 'doc-address', 'doc-utility'];
      const missingMandatory = requiredIds.some((id) => {
        const doc = draft.documents.find((d) => d.id === id);
        return !doc || doc.status !== 'Uploaded';
      });
      if (missingMandatory) {
        Alert.alert(
          'Validation Error',
          'Please upload all mandatory documents before proceeding.'
        );
        return;
      }
      
      const isNocRequired = draft.company.premisesOwnership === 'Rented' || draft.company.premisesOwnership === 'Leased';
      if (isNocRequired) {
        const nocDoc = draft.documents.find((d) => d.id === 'doc-noc');
        if (!nocDoc || nocDoc.status !== 'Uploaded') {
          Alert.alert('Validation Error', 'Owner NOC is required for Rented/Leased premises.');
          return;
        }
      }
    }

    // Clean stale data right before final review
    if (currentStep === 6) {
      // e.g. clean NOC if ownership is owned
      if (draft.company.premisesOwnership === 'Owned') {
         draft.company.ownerNocName = '';
         draft.company.ownerNocUri = '';
      }
      // OPC data cleaning
      if (draft.company.companyType === 'One Person Company (OPC)') {
         // ensure only 1 director
      }
    }

    if (currentStep < totalSteps - 1) {
      setStep(currentStep + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <StepCompanyType />;
      case 1:
        return <StepCombinedDetails />;
      case 2:
        return <StepRegisteredOffice />;
      case 3:
        return <StepPromoters />;
      case 4:
        return <StepCapitalShareholding />;
      case 5:
        return <StepDocumentsKYC />;
      case 6:
        return <StepLinkedRegistrations />;
      case 7:
        return <StepReviewApplication />;
      case 8:
        return <StepFeesPayment />;
      case 9:
        return <StepSubmissionSuccess />;
      case 10:
        return <StepApplicationTracking />;
      default:
        return <StepCompanyType />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Fixed Top Header */}
      <AppHeader title="Company Registration" showBack onBack={handleHeaderBack} />

      {/* Filling Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {currentStep} / {totalSteps} screens completed
        </Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      {/* Main Scroll Content with Keyboard Handling */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
        >
          {renderStepContent()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky Bottom Footer Navigation */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16), justifyContent: 'flex-end' }]}>
        {currentStep < 8 && (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.nextBtnText}>Continue →</Text>
          </TouchableOpacity>
        )}
      </View>

      <UniversalDraftModal
        visible={showDraftModal}
        title="Save Filing Progress?"
        message="You have unsaved changes in your application. Save your progress so you can resume anytime without re-entering details."
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

export default CompanyRegistrationScreen;

