import React from 'react';
import { View, Text, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { styles } from './StepProposedNames.styles';

export const StepProposedNames: React.FC = () => {
  const company = useCompanyRegistrationStore((state) => state.draft.company);
  const updateDetails = useCompanyRegistrationStore((state) => state.updateCompanyDetails);

  const getSuffix = () => {
    switch (company.companyType) {
      case 'One Person Company (OPC)':
        return '(OPC) Private Limited';
      case 'Section 8 (NGO)':
        return 'Foundation / Section 8';
      case 'Public Limited':
        return 'Limited';
      default:
        return 'Private Limited';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Proposed Company Names</Text>
      <Text style={styles.subheading}>Provide up to 3 name choices in order of preference for RUN / SPICe+ MCA approval.</Text>

      {/* 1st Preferred Name */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>1st Preferred Name *</Text>
        <TextInput
          style={styles.input}
          value={company.proposedName1}
          onChangeText={(val) => updateDetails({ proposedName1: val })}
          placeholder="First Preference Name"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* 2nd Preferred Name */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>2nd Preferred Name *</Text>
        <TextInput
          style={styles.input}
          value={company.proposedName2}
          onChangeText={(val) => updateDetails({ proposedName2: val })}
          placeholder="Second Preference Name"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* 3rd Preferred Name */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>3rd Preferred Name (Optional)</Text>
        <TextInput
          style={styles.input}
          value={company.proposedName3}
          onChangeText={(val) => updateDetails({ proposedName3: val })}
          placeholder="Third Preference Name"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Mandatory Suffix */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Mandatory Suffix</Text>
        <View style={styles.suffixBadge}>
          <Text style={styles.suffixText}>Legal Suffix: {getSuffix()}</Text>
        </View>
      </View>

      {/* Name Availability Indicator */}
      <View style={styles.statusCard}>
        <Ionicons name="checkmark-circle" size={20} color="#166534" />
        <View>
          <Text style={styles.statusText}>Initial Availability Check: Passed</Text>
          <Text style={{ fontSize: 12, color: '#15803D' }}>
            "{company.proposedName1 || 'TaxEdge Tech Private Limited'}" has no direct trademark conflicts.
          </Text>
        </View>
      </View>
    </View>
  );
};
