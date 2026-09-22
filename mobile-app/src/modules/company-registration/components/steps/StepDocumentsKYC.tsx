
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Linking } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { styles } from './StepDocumentsKYC.styles';

import type { CompanyDoc } from '../../types/registration.types';


export interface KycChecklistItem {
  id: string;
  title: string;
  subtitle: string;
  section: 'PROMOTER / DIRECTOR KYC' | 'REGISTERED OFFICE' | 'STATUTORY DOCUMENTS';
  required: boolean;
  isNotRequired?: boolean;
  isHandled?: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
}


export const StepDocumentsKYC: React.FC = () => {
  const company = useCompanyRegistrationStore((state) => state.draft.company);
  const storedDocs = useCompanyRegistrationStore((state) => state.draft.documents);
  const directors = useCompanyRegistrationStore((state) => state.draft.directors);
  const companyType = useCompanyRegistrationStore((state) => state.draft.company.companyType);
  const opcNominee = useCompanyRegistrationStore((state) => state.draft.opcNominee);
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


  const handleRemoveDocument = (docId: string) => {
    Alert.alert('Delete Document', 'Are you sure you want to delete this document?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => updateDocumentStatus(docId, 'Pending', undefined, undefined) },
    ]);
  };

  const handleViewDocument = async (fileUri?: string, fileName?: string) => {
    if (fileUri) {
      try {
        await Linking.openURL(fileUri);
      } catch (error) {
        Alert.alert('View Document', `Previewing: ${fileName || 'Document'}\n\nCannot open URI directly on this device.`);
      }
    } else {
      Alert.alert('View Document', 'Document file is not available.');
    }
  };

  // Generate dynamic checklist
  const checklistItems: KycChecklistItem[] = [];

  directors.forEach((dir) => {
    const isDinAvail = dir.hasDin;
    checklistItems.push({
      id: `doc-idproof-${dir.id}`,
      title: 'Identity / Residential Proof' + (isDinAvail ? '' : ' *'),
      subtitle: `${dir.name}\n${dir.designation || 'Director'}${isDinAvail ? ' • DIN Available' : ' • DIN Not Available'}` + (isDinAvail ? '\nNot required for this person' : ''),
      section: 'PROMOTER / DIRECTOR KYC',
      required: !isDinAvail,
      isNotRequired: isDinAvail,
      iconName: 'person-circle-outline',
    });
  });

  if (companyType === 'One Person Company (OPC)' && opcNominee?.name) {
    checklistItems.push({
      id: `doc-idproof-nominee`,
      title: 'Identity / Residential Proof *',
      subtitle: `${opcNominee.name}\nNominee`,
      section: 'PROMOTER / DIRECTOR KYC',
      required: true,
      isNotRequired: false,
      iconName: 'person-circle-outline',
    });
  }

  checklistItems.push(
    {
      id: 'doc-address',
      title: 'Office Address Proof *',
      subtitle: 'Lease / Rent Agreement / Ownership Proof',
      section: 'REGISTERED OFFICE',
      required: true,
      iconName: 'business-outline',
    },
    {
      id: 'doc-utility',
      title: 'Office Utility Bill *',
      subtitle: 'Electricity / Water / applicable utility bill',
      section: 'REGISTERED OFFICE',
      required: true,
      iconName: 'receipt-outline',
    },
    {
      id: 'doc-noc',
      title: 'Owner NOC',
      subtitle: 'Required only if applicable',
      section: 'REGISTERED OFFICE',
      required: false,
      iconName: 'document-attach-outline',
    },
    {
      id: 'doc-moa',
      title: 'MOA / e-MOA',
      subtitle: 'Handled / generated as applicable',
      section: 'STATUTORY DOCUMENTS',
      required: false,
      isHandled: true,
      iconName: 'document-text-outline',
    },
    {
      id: 'doc-aoa',
      title: 'AOA / e-AOA',
      subtitle: 'Handled / generated as applicable',
      section: 'STATUTORY DOCUMENTS',
      required: false,
      isHandled: true,
      iconName: 'book-outline',
    }
  );

  const sections: ('PROMOTER / DIRECTOR KYC' | 'REGISTERED OFFICE' | 'STATUTORY DOCUMENTS')[] = [
    'PROMOTER / DIRECTOR KYC',
    'REGISTERED OFFICE',
    'STATUTORY DOCUMENTS',
  ];

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

      {sections.map((sectionName) => {
        const sectionItems = checklistItems.filter((item) => item.section === sectionName);
        if (sectionItems.length === 0) return null;

        return (
          <View key={sectionName}>
            <Text style={styles.sectionTitle}>{sectionName}</Text>

            {sectionItems.map((item) => {
              const stored = storedDocs.find((d) => d.id === item.id);
              const isUploaded = stored?.status === 'Uploaded';
              const displayFileName = stored?.fileName || (stored?.fileUri ? stored.fileUri.split('/').pop() : '');

              return (
                <View key={item.id} style={styles.docCard}>
                  <View style={styles.docHeaderRow}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1}}>
                      <View style={styles.docIconBox}>
                        <Ionicons name={item.iconName} size={20} color="#083B75" />
                      </View>
                      <Text style={styles.docTitle}>{item.title}</Text>
                    </View>

                    {!isUploaded && !item.isNotRequired && !item.isHandled && (
                      <TouchableOpacity
                        style={styles.uploadActionBtn}
                        onPress={() => setActiveItem(item)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="cloud-upload-outline" size={14} color="#FFFFFF" />
                        <Text style={styles.uploadActionBtnText}>Upload</Text>
                      </TouchableOpacity>
                    )}

                    {isUploaded && !item.isHandled && !item.isNotRequired && (
                      <View style={styles.uploadedBadge}>
                        <Ionicons name="checkmark-circle" size={14} color="#166534" />
                        <Text style={styles.uploadedText}>Uploaded</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.docSubtitle}>{item.subtitle}</Text>

                  {/* Real Uploaded State Display */}
                  {isUploaded && !item.isHandled && !item.isNotRequired && (
                    <View style={styles.uploadedContainer}>
                      <Text style={styles.fileNameText} numberOfLines={1}>
                        {displayFileName || 'document.pdf'}
                      </Text>

                      <View style={styles.uploadedActions}>
                        <TouchableOpacity onPress={() => handleViewDocument(stored?.fileUri, displayFileName)} activeOpacity={0.7} style={styles.actionBtn}>
                          <Ionicons name="eye-outline" size={16} color="#083B75" />
                          <Text style={styles.actionTextBtn}>View</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setActiveItem(item)} activeOpacity={0.7} style={styles.actionBtn}>
                          <Text style={styles.actionTextBtn}>Change</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleRemoveDocument(item.id)} activeOpacity={0.7} style={styles.actionBtn}>
                          <Ionicons name="trash-outline" size={16} color="#B91C1C" />
                          <Text style={styles.removeTextBtn}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

        );
      })}
    </View>
  );
};


