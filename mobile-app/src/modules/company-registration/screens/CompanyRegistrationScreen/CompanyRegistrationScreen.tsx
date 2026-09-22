import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';

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
  'Application Tracking',
  'Submission Success',
  'Application Receipt',
];

export const CompanyRegistrationScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const draft = useCompanyRegistrationStore((state) => state.draft);
  const setStep = useCompanyRegistrationStore((state) => state.setStep);

  const currentStep = draft.currentStep;
  const totalSteps = STEP_NAMES.length;
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    // Validation for combined Step 2 (Classification + Activity + Proposed Names)
    if (currentStep === 1) {
      if (!draft.company.primaryActivity?.trim()) {
        Alert.alert('Validation Error', 'Please enter Primary Business Activity.');
        return;
      }
      if (!draft.company.nicCode?.trim()) {
        Alert.alert('Validation Error', 'Please enter 5-Digit NIC Code.');
        return;
      }
      if (!draft.company.proposedName1?.trim()) {
        Alert.alert('Validation Error', 'Please enter 1st Preferred Name.');
        return;
      }
      if (!draft.company.proposedName2?.trim()) {
        Alert.alert('Validation Error', 'Please enter 2nd Preferred Name.');
        return;
      }
    }

    // Validation for Step 3 (Promoter / Director Details)
    if (currentStep === 3) {
      const firstDir = draft.directors[0];
      if (!firstDir || !firstDir.name?.trim()) {
        Alert.alert('Validation Error', 'Please enter Full Name for Director #1.');
        return;
      }
      if (!firstDir.pan?.trim()) {
        Alert.alert('Validation Error', 'Please enter PAN Number for Director #1.');
        return;
      }
      if (!firstDir.email?.trim()) {
        Alert.alert('Validation Error', 'Please enter Email Address for Director #1.');
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
          'Please upload all mandatory documents (PAN Card, Identity/Address Proof, Office Address Proof, and Office Utility Bill) before proceeding.'
        );
        return;
      }
    }

    if (currentStep < totalSteps - 1) {
      setStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === totalSteps - 1) {
      setStep(0);
    } else if (currentStep > 0) {
      setStep(currentStep - 1);
    } else {
      router.back();
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
        return <StepApplicationTracking />;
      case 10:
        return <StepSubmissionSuccess />;
      case 11:
        return <StepApplicationReceipt />;
      default:
        return <StepCompanyType />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Fixed Top Header */}
      <AppHeader title="Company Registration" showBack />

      {/* Filling Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
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
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.8}>
          <Text style={styles.backBtnText}>{currentStep === 0 ? 'Cancel' : '← Back'}</Text>
        </TouchableOpacity>

        {currentStep < 8 && (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.nextBtnText}>Continue →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CompanyRegistrationScreen;

