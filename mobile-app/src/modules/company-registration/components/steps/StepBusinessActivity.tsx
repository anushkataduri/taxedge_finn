import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { CompanySectionCard } from '../CompanySectionCard/CompanySectionCard';
import { styles } from './StepBusinessActivity.styles';

export const StepBusinessActivity: React.FC = () => {
  const company = useCompanyRegistrationStore((state) => state.draft.company);
  const updateDetails = useCompanyRegistrationStore((state) => state.updateCompanyDetails);

  return (
    <CompanySectionCard
      title="Business Activity / NIC"
      description="Define the main objective and National Industrial Classification code of your company."
    >
      {/* Primary Business Activity */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Primary Business Activity *</Text>
        <TextInput
          style={styles.input}
          value={company.primaryActivity}
          onChangeText={(val) => updateDetails({ primaryActivity: val })}
          placeholder="e.g. Information Technology & Software Development"
          placeholderTextColor="#94A3B8"
        />
        <Text style={styles.hint}>Used for Main Objects in MoA Memorandum of Association.</Text>
      </View>

      {/* NIC Code */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>NIC 5-Digit Code *</Text>
        <TextInput
          style={styles.input}
          value={company.nicCode}
          onChangeText={(val) => updateDetails({ nicCode: val })}
          placeholder="Enter NIC code"
          keyboardType="numeric"
          placeholderTextColor="#94A3B8"
        />
        <Text style={styles.hint}>National Industrial Classification code (e.g. 62011 for software development).</Text>
      </View>

      {/* Secondary Business Activity */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Secondary Business Activity (Optional)</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={company.secondaryActivity}
          onChangeText={(val) => updateDetails({ secondaryActivity: val })}
          placeholder="e.g. Data Processing, IT Consultancy, Web Hosting, Software Sales"
          multiline
          placeholderTextColor="#94A3B8"
        />
      </View>
    </CompanySectionCard>
  );
};
