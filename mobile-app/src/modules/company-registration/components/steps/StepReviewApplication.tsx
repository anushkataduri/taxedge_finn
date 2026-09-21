import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { styles } from './StepReviewApplication.styles';

export const StepReviewApplication: React.FC = () => {
  const draft = useCompanyRegistrationStore((state) => state.draft);
  const setStep = useCompanyRegistrationStore((state) => state.setStep);
  const { company, directors, linkedRegistrations } = draft;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Review Application</Text>
      <Text style={styles.subheading}>Review your application details thoroughly before proceeding to payment.</Text>

      {/* Section 1: Company Type & Classification */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Company Type & Classification</Text>
          <TouchableOpacity onPress={() => setStep(0)}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Entity Type</Text>
          <Text style={styles.dataValue}>{company.companyType}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Class / Category</Text>
          <Text style={styles.dataValue}>{company.companyClass} • {company.companyCategory}</Text>
        </View>
      </View>

      {/* Section 2: Business Activity & NIC */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Business Activity & NIC</Text>
          <TouchableOpacity onPress={() => setStep(2)}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Primary Activity</Text>
          <Text style={styles.dataValue}>{company.primaryActivity}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>NIC Code</Text>
          <Text style={styles.dataValue}>{company.nicCode}</Text>
        </View>
      </View>

      {/* Section 3: Proposed Company Names */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Proposed Company Names</Text>
          <TouchableOpacity onPress={() => setStep(3)}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>1st Preference</Text>
          <Text style={styles.dataValue}>{company.proposedName1}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>2nd Preference</Text>
          <Text style={styles.dataValue}>{company.proposedName2}</Text>
        </View>
      </View>

      {/* Section 4: Registered Office */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Registered Office</Text>
          <TouchableOpacity onPress={() => setStep(4)}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Address</Text>
          <Text style={styles.dataValue}>{company.registeredAddressLine}, {company.registeredCity}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>State & PIN</Text>
          <Text style={styles.dataValue}>{company.registeredState} - {company.registeredPincode}</Text>
        </View>
      </View>

      {/* Section 5: Directors & Shareholding */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Promoters & Shareholding</Text>
          <TouchableOpacity onPress={() => setStep(5)}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        </View>
        {directors.map((d, i) => (
          <View key={d.id} style={styles.dataRow}>
            <Text style={styles.dataLabel}>{i + 1}. {d.name || 'Director'}</Text>
            <Text style={styles.dataValue}>{d.sharesPercentage}% Shareholding</Text>
          </View>
        ))}
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Authorised Capital</Text>
          <Text style={styles.dataValue}>₹{company.authorizedCapital.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      {/* Section 6: Linked Services */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Linked Registrations</Text>
          <TouchableOpacity onPress={() => setStep(8)}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.dataValue}>
          {Object.entries(linkedRegistrations)
            .filter(([_, v]) => v)
            .map(([k]) => k.toUpperCase())
            .join(', ')}
        </Text>
      </View>
    </View>
  );
};
