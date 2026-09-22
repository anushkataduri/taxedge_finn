import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { styles } from './StepDocumentsKYC.styles';
import type { CompanyDoc } from '../../types/registration.types';

export const StepDocumentsKYC: React.FC = () => {
  const company = useCompanyRegistrationStore((state) => state.draft.company);
  const storedDocs = useCompanyRegistrationStore((state) => state.draft.documents);
  const updateDocumentStatus = useCompanyRegistrationStore((state) => state.updateDocumentStatus);

  const isOpc = company.companyType === 'One Person Company (OPC)';
  const isSection8 = company.companyType === 'Section 8 (NGO)';
  const needsNoc = ['Rented', 'Leased', 'Owned'].includes(company.premisesOwnership);

  // Compute required list of documents including conditional items
  const documentList: CompanyDoc[] = [
    { id: 'doc-pan', name: 'Promoter PAN Card', category: 'Promoter KYC', required: true, status: 'Pending' },
    { id: 'doc-aadhaar', name: 'Promoter Aadhaar / Passport', category: 'Promoter KYC', required: true, status: 'Pending' },
    { id: 'doc-photo', name: 'Promoter Passport Photo', category: 'Promoter KYC', required: true, status: 'Pending' },
    { id: 'doc-address', name: 'Registered Office Lease / Ownership Proof', category: 'Office Proof', required: true, status: 'Pending' },
    { id: 'doc-utility', name: 'Office Utility Bill (Electricity/Water)', category: 'Office Proof', required: true, status: 'Pending' },
  ];

  if (needsNoc) {
    documentList.push({
      id: 'doc-noc',
      name: 'Property Owner No Objection Certificate (NOC)',
      category: 'Office Proof',
      required: true,
      status: 'Pending',
    });
  }

  if (isOpc) {
    documentList.push({
      id: 'doc-inc3',
      name: 'OPC Nominee Written Consent Form (INC-3)',
      category: 'Statutory Docs',
      required: true,
      status: 'Pending',
    });
  }

  if (isSection8) {
    documentList.push({
      id: 'doc-sec8-licence',
      name: 'Section 8 Licence Application (INC-12) & Draft Objectives',
      category: 'Statutory Docs',
      required: true,
      status: 'Pending',
    });
  }

  documentList.push(
    { id: 'doc-moa', name: 'Draft e-MoA (Memorandum of Association)', category: 'Statutory Docs', required: true, status: 'Pending' },
    { id: 'doc-aoa', name: 'Draft e-AoA (Articles of Association)', category: 'Statutory Docs', required: true, status: 'Pending' }
  );

  const toggleDocumentUpload = (docId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Uploaded' ? 'Pending' : 'Uploaded';
    updateDocumentStatus(docId, nextStatus);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Documents & KYC Checklist</Text>
      <Text style={styles.subheading}>
        Upload digital copies of promoter identity, office proofs, and statutory e-MoA/e-AoA drafts.
      </Text>

      {documentList.map((item) => {
        const stored = storedDocs.find((d) => d.id === item.id);
        const status = stored ? stored.status : item.status;
        const isUploaded = status === 'Uploaded';

        return (
          <TouchableOpacity
            key={item.id}
            style={styles.docCard}
            onPress={() => toggleDocumentUpload(item.id, status)}
            activeOpacity={0.8}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.docTitle}>{item.name}</Text>
              <Text style={styles.docCategory}>{item.category} • Required</Text>
            </View>

            <View style={[styles.statusBadge, isUploaded ? styles.uploadedBadge : styles.pendingBadge]}>
              <Ionicons
                name={isUploaded ? 'checkmark-circle' : 'cloud-upload-outline'}
                size={16}
                color={isUploaded ? '#166534' : '#92400E'}
              />
              <Text style={[styles.statusText, isUploaded ? styles.uploadedText : styles.pendingText]}>
                {isUploaded ? 'Uploaded' : 'Upload'}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};


