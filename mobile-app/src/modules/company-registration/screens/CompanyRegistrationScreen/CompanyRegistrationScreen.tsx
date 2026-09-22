import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../../../../components/AppHeader';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';

import { StepCompanyType } from '../../components/steps/StepCompanyType';
import { StepClassification } from '../../components/steps/StepClassification';
import { StepBusinessActivity } from '../../components/steps/StepBusinessActivity';
import { StepProposedNames } from '../../components/steps/StepProposedNames';
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
  'Company Classification',
  'Business Activity / NIC',
  'Proposed Company Names',
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
    // Basic validation before advancing step
    if (currentStep === 3 && !draft.company.proposedName1.trim()) {
      Alert.alert('Validation Error', 'Please enter at least 1st Preferred Name.');
      return;
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
      const requiredIds: string[] = ['doc-address', 'doc-utility'];

      draft.directors.forEach((dir) => {
        if (!dir.hasDin) {
          requiredIds.push(`doc-idproof-${dir.id}`);
        }
      });

      if (draft.company.companyType === 'One Person Company (OPC)' && draft.opcNominee?.name) {
        requiredIds.push('doc-idproof-nominee');
      }

      const missingMandatory = requiredIds.some((id) => {
        const doc = draft.documents.find((d) => d.id === id);
        return !doc || doc.status !== 'Uploaded';
      });
      if (missingMandatory) {
        Alert.alert(
          'Validation Error',
          'Please upload all applicable mandatory documents (Office Proofs, and Identity Proofs for persons without DIN) before proceeding.'
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
        return <StepClassification />;
      case 2:
        return <StepBusinessActivity />;
      case 3:
        return <StepProposedNames />;
      case 4:
        return <StepRegisteredOffice />;
      case 5:
        return <StepPromoters />;
      case 6:
        return <StepCapitalShareholding />;
      case 7:
        return <StepDocumentsKYC />;
      case 8:
        return <StepLinkedRegistrations />;
      case 9:
        return <StepReviewApplication />;
      case 10:
        return <StepFeesPayment />;
      case 11:
        return <StepApplicationTracking />;
      case 12:
        return <StepSubmissionSuccess />;
      case 13:
        return <StepApplicationReceipt />;
      default:
        return <StepCompanyType />;
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Company Registration" showBack />

      {/* Filling Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>

      {/* Main Scroll Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {renderStepContent()}
      </ScrollView>

      {/* Sticky Bottom Footer Navigation */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.8}>
          <Text style={styles.backBtnText}>{currentStep === 0 ? 'Cancel' : '← Back'}</Text>
        </TouchableOpacity>

        {currentStep < 10 && (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.nextBtnText}>Continue →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CompanyRegistrationScreen;
