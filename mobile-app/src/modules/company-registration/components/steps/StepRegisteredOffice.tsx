import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { DocumentUploadBottomSheet } from '@/modules/itr/tds/components/upload/DocumentUploadBottomSheet/DocumentUploadBottomSheet';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { styles } from './StepRegisteredOffice.styles';

type DocType = 'proof' | 'ownership' | 'noc';

export const StepRegisteredOffice: React.FC = () => {
  const company = useCompanyRegistrationStore((state) => state.draft.company);
  const updateDetails = useCompanyRegistrationStore((state) => state.updateCompanyDetails);

  const [activeDocType, setActiveDocType] = useState<DocType | null>(null);

  const isNocRequired = company.premisesOwnership === 'Rented' || company.premisesOwnership === 'Leased';

  const getDocTitle = (type: DocType | null) => {
    switch (type) {
      case 'proof':
        return 'Office Address Proof / Utility Bill';
      case 'ownership':
        return 'Ownership / Rent / Lease Document';
      case 'noc':
        return 'Owner NOC';
      default:
        return 'Document';
    }
  };

  const handleDocumentSelected = (fileName: string) => {
    if (!activeDocType) return;
    if (activeDocType === 'proof') updateDetails({ officeAddressProofName: fileName });
    if (activeDocType === 'ownership') updateDetails({ ownershipDocName: fileName });
    if (activeDocType === 'noc') updateDetails({ ownerNocName: fileName });
    setActiveDocType(null);
  };

  const handlePickFiles = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        handleDocumentSelected(res.assets[0].name);
      }
    } catch (e: any) {
      Alert.alert('Upload Error', e?.message || 'Failed to select document.');
    }
  };

  const handlePickGallery = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission Required', 'Please allow gallery access to select document images.');
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        const name = asset.fileName || `gallery_doc_${Date.now()}.jpg`;
        handleDocumentSelected(name);
      }
    } catch (e: any) {
      Alert.alert('Upload Error', e?.message || 'Failed to select image from gallery.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission Required', 'Please allow camera access to take document photos.');
        return;
      }
      const res = await ImagePicker.launchCameraAsync({
        quality: 0.8,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        const name = asset.fileName || `camera_doc_${Date.now()}.jpg`;
        handleDocumentSelected(name);
      }
    } catch (e: any) {
      Alert.alert('Upload Error', e?.message || 'Failed to take photo.');
    }
  };

  const handleRemoveDoc = (type: DocType) => {
    if (type === 'proof') updateDetails({ officeAddressProofName: '' });
    if (type === 'ownership') updateDetails({ ownershipDocName: '' });
    if (type === 'noc') updateDetails({ ownerNocName: '' });
  };

  const renderDocCard = (
    label: string,
    type: DocType,
    fileName: string | undefined,
    helperText?: string,
    isRequired = true
  ) => {
    const hasFile = !!fileName;

    return (
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          {label} {isRequired ? '*' : ''}
        </Text>

        {hasFile ? (
          <View style={styles.uploadBoxSuccess}>
            <TouchableOpacity
              style={styles.fileLeftInfo}
              onPress={() => setActiveDocType(type)}
              activeOpacity={0.7}
            >
              <Ionicons name="document-text" size={20} color="#083B75" />
              <Text style={styles.uploadSuccessText} numberOfLines={1}>
                {fileName}
              </Text>
            </TouchableOpacity>
            <View style={styles.fileRightActions}>
              <Ionicons name="checkmark-circle" size={20} color="#166534" />
              <TouchableOpacity
                onPress={() => handleRemoveDoc(type)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.removeBtn}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.uploadBoxEmpty}
            onPress={() => setActiveDocType(type)}
            activeOpacity={0.7}
          >
            <View style={styles.fileLeftInfo}>
              <Ionicons name="cloud-upload-outline" size={20} color="#083B75" />
              <Text style={styles.uploadEmptyText}>
                Upload {label.replace('*', '').trim()} (PDF / Image)
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}

        {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Registered Office Details</Text>
      <Text style={styles.subheading}>
        Provide official communication address for MCA, ROC, and statutory authorities.
      </Text>

      {/* Building / Address Line */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Building / Premises Address Line *</Text>
        <TextInput
          style={styles.input}
          value={company.registeredAddressLine}
          onChangeText={(val) => updateDetails({ registeredAddressLine: val })}
          placeholder="Plot 42, Tech Park Phase 2, HITEC City"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* City & District Row */}
      <View style={styles.row}>
        <View style={[styles.fieldGroup, styles.halfField]}>
          <Text style={styles.label}>City *</Text>
          <TextInput
            style={styles.input}
            value={company.registeredCity}
            onChangeText={(val) => updateDetails({ registeredCity: val })}
            placeholder="Hyderabad"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={[styles.fieldGroup, styles.halfField]}>
          <Text style={styles.label}>District *</Text>
          <TextInput
            style={styles.input}
            value={company.registeredDistrict || ''}
            onChangeText={(val) => updateDetails({ registeredDistrict: val })}
            placeholder="Rangareddy"
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      {/* State & PIN Code Row */}
      <View style={styles.row}>
        <View style={[styles.fieldGroup, styles.halfField]}>
          <Text style={styles.label}>State *</Text>
          <TextInput
            style={styles.input}
            value={company.registeredState}
            onChangeText={(val) => updateDetails({ registeredState: val })}
            placeholder="Telangana"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={[styles.fieldGroup, styles.halfField]}>
          <Text style={styles.label}>PIN Code *</Text>
          <TextInput
            style={styles.input}
            value={company.registeredPincode}
            onChangeText={(val) => updateDetails({ registeredPincode: val })}
            placeholder="500081"
            keyboardType="numeric"
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      {/* Premises Ownership Status */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Premises Ownership Status *</Text>
        <View style={styles.chipRow}>
          {(['Rented', 'Owned', 'Leased'] as const).map((status) => {
            const isSelected = company.premisesOwnership === status;
            return (
              <TouchableOpacity
                key={status}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => updateDetails({ premisesOwnership: status })}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {status}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Info Box */}
        <View style={styles.infoBoxContainer}>
          <Ionicons name="information-circle-outline" size={18} color="#0369A1" style={styles.infoIcon} />
          <Text style={styles.infoNote}>
            Proof of address (Electricity Bill / Rent Agreement) is mandatory. If premises are rented, leased, or owned by a Director or third party, a No Objection Certificate (NOC) from the owner is strictly required.
          </Text>
        </View>
      </View>

      {/* Contact Details */}
      <View style={styles.row}>
        <View style={[styles.fieldGroup, styles.halfField]}>
          <Text style={styles.label}>Company Email *</Text>
          <TextInput
            style={styles.input}
            value={company.companyEmail}
            onChangeText={(val) => updateDetails({ companyEmail: val })}
            placeholder="contact@taxedgetech.com"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={[styles.fieldGroup, styles.halfField]}>
          <Text style={styles.label}>Mobile *</Text>
          <TextInput
            style={styles.input}
            value={company.companyMobile}
            onChangeText={(val) => updateDetails({ companyMobile: val })}
            placeholder="9876543210"
            keyboardType="phone-pad"
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      {/* Document Section */}
      <View style={styles.sectionDivider} />
      <Text style={styles.sectionHeading}>Mandatory Documents</Text>

      {/* 1. Address Proof / Utility Bill */}
      {renderDocCard(
        'Office Address Proof / Utility Bill',
        'proof',
        company.officeAddressProofName,
        'Utility bill should be recent (not older than 2 months).',
        true
      )}

      {/* 2. Ownership / Rent / Lease Document */}
      {renderDocCard(
        'Ownership / Rent / Lease Document',
        'ownership',
        company.ownershipDocName,
        undefined,
        true
      )}

      {/* 3. Owner NOC */}
      {renderDocCard(
        'Owner NOC',
        'noc',
        company.ownerNocName,
        'Required only for rented/leased/third-party premises.',
        isNocRequired
      )}

      {/* ITR Document Upload Bottom Sheet Reused */}
      <DocumentUploadBottomSheet
        visible={!!activeDocType}
        documentTitle={getDocTitle(activeDocType)}
        onClose={() => setActiveDocType(null)}
        onCancel={() => setActiveDocType(null)}
        onPickFiles={handlePickFiles}
        onPickGallery={handlePickGallery}
        onTakePhoto={handleTakePhoto}
      />
    </View>
  );
};
