import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { DocumentUploadBottomSheet } from '@/modules/itr/tds/components/upload/DocumentUploadBottomSheet/DocumentUploadBottomSheet';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { styles } from './StepDocumentsKYC.styles';

export interface KycChecklistItem {
  id: string;
  title: string;
  subtitle: string;
  section: 'PROMOTER / DIRECTOR KYC' | 'REGISTERED OFFICE' | 'STATUTORY DOCUMENTS';
  required: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
}

const CHECKLIST_ITEMS: KycChecklistItem[] = [
  // PROMOTER / DIRECTOR KYC
  {
    id: 'doc-pan',
    title: 'PAN Card *',
    subtitle: 'Promoter KYC',
    section: 'PROMOTER / DIRECTOR KYC',
    required: true,
    iconName: 'card-outline',
  },
  {
    id: 'doc-aadhaar',
    title: 'Identity / Address Proof *',
    subtitle: 'Aadhaar / Passport / other applicable proof',
    section: 'PROMOTER / DIRECTOR KYC',
    required: true,
    iconName: 'id-card-outline',
  },
  {
    id: 'doc-photo',
    title: 'Passport Photo',
    subtitle: 'Required if applicable',
    section: 'PROMOTER / DIRECTOR KYC',
    required: false,
    iconName: 'person-circle-outline',
  },

  // REGISTERED OFFICE
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

  // STATUTORY DOCUMENTS
  {
    id: 'doc-moa',
    title: 'MOA / e-MOA',
    subtitle: 'Handled/generated as applicable',
    section: 'STATUTORY DOCUMENTS',
    required: false,
    iconName: 'document-text-outline',
  },
  {
    id: 'doc-aoa',
    title: 'AOA / e-AOA',
    subtitle: 'Handled/generated as applicable',
    section: 'STATUTORY DOCUMENTS',
    required: false,
    iconName: 'book-outline',
  },
];

export const StepDocumentsKYC: React.FC = () => {
  const storedDocs = useCompanyRegistrationStore((state) => state.draft.documents);
  const updateDocumentStatus = useCompanyRegistrationStore((state) => state.updateDocumentStatus);

  const [activeItem, setActiveItem] = useState<KycChecklistItem | null>(null);

  const handleDocumentSelected = (fileName: string, fileUri?: string) => {
    if (!activeItem) return;
    updateDocumentStatus(activeItem.id, 'Uploaded', fileUri, fileName);
    setActiveItem(null);
  };

  const handlePickFiles = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        handleDocumentSelected(asset.name, asset.uri);
      }
    } catch (e: any) {
      Alert.alert('Upload Error', e?.message || 'Failed to select document.');
    }
  };

  const handlePickGallery = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission Required', 'Please allow gallery access to select photo.');
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        const name = asset.fileName || `photo_${Date.now()}.jpg`;
        handleDocumentSelected(name, asset.uri);
      }
    } catch (e: any) {
      Alert.alert('Upload Error', e?.message || 'Failed to select image from gallery.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission Required', 'Please allow camera access to take document photo.');
        return;
      }
      const res = await ImagePicker.launchCameraAsync({
        quality: 0.8,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        const name = asset.fileName || `camera_${Date.now()}.jpg`;
        handleDocumentSelected(name, asset.uri);
      }
    } catch (e: any) {
      Alert.alert('Upload Error', e?.message || 'Failed to take photo.');
    }
  };

  const handleRemoveDocument = (docId: string) => {
    updateDocumentStatus(docId, 'Pending', undefined, undefined);
  };

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

      {sections.map((sectionName) => {
        const sectionItems = CHECKLIST_ITEMS.filter((item) => item.section === sectionName);
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
                    <View style={styles.docIconTitleGroup}>
                      <View style={styles.docIconBox}>
                        <Ionicons name={item.iconName} size={20} color="#083B75" />
                      </View>

                      <View style={styles.docTitleTextGroup}>
                        <Text style={styles.docTitle}>{item.title}</Text>
                        <Text style={styles.docSubtitle}>{item.subtitle}</Text>
                      </View>
                    </View>

                    {!isUploaded && (
                      <TouchableOpacity
                        style={styles.uploadActionBtn}
                        onPress={() => setActiveItem(item)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="cloud-upload-outline" size={14} color="#FFFFFF" />
                        <Text style={styles.uploadActionBtnText}>Upload</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Real Uploaded State Display */}
                  {isUploaded && (
                    <View style={styles.uploadedContainer}>
                      <View style={styles.uploadedInfo}>
                        <View style={styles.uploadedBadge}>
                          <Ionicons name="checkmark-circle" size={14} color="#166534" />
                          <Text style={styles.uploadedText}>Uploaded</Text>
                        </View>
                        <Text style={styles.fileNameText} numberOfLines={1}>
                          {displayFileName || 'document.pdf'}
                        </Text>
                      </View>

                      <View style={styles.uploadedActions}>
                        <TouchableOpacity onPress={() => setActiveItem(item)} activeOpacity={0.7}>
                          <Text style={styles.actionTextBtn}>Replace</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleRemoveDocument(item.id)} activeOpacity={0.7}>
                          <Text style={styles.removeTextBtn}>Remove</Text>
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

      {/* Reused ITR Document Upload Bottom Sheet */}
      <DocumentUploadBottomSheet
        visible={!!activeItem}
        documentTitle={activeItem?.title.replace('*', '').trim()}
        onClose={() => setActiveItem(null)}
        onCancel={() => setActiveItem(null)}
        onPickFiles={handlePickFiles}
        onPickGallery={handlePickGallery}
        onTakePhoto={handleTakePhoto}
      />
    </View>
  );
};
