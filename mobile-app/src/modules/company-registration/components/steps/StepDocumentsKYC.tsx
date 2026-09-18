import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { styles } from './StepDocumentsKYC.styles';

export const StepDocumentsKYC: React.FC = () => {
  const documents = useCompanyRegistrationStore((state) => state.draft.documents);
  const updateDocumentStatus = useCompanyRegistrationStore((state) => state.updateDocumentStatus);

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

      {documents.map((doc) => {
        const isUploaded = doc.status === 'Uploaded';
        return (
          <TouchableOpacity
            key={doc.id}
            style={styles.docCard}
            onPress={() => toggleDocumentUpload(doc.id, doc.status)}
            activeOpacity={0.8}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.docTitle}>{doc.name}</Text>
              <Text style={styles.docCategory}>{doc.category} • Required</Text>
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

