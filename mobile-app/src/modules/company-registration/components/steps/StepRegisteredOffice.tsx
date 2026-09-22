import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { styles } from './StepRegisteredOffice.styles';

export const StepRegisteredOffice: React.FC = () => {
  const company = useCompanyRegistrationStore((state) => state.draft.company);
  const updateDetails = useCompanyRegistrationStore((state) => state.updateCompanyDetails);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Registered Office Details</Text>
      <Text style={styles.subheading}>Provide official communication address for MCA, ROC, and statutory authorities.</Text>

      {/* Address Line */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Building / Premises Address Line *</Text>
        <TextInput
          style={styles.input}
          value={company.registeredAddressLine}
          onChangeText={(val) => updateDetails({ registeredAddressLine: val })}
          placeholder="Flat / Office No, Building Name, Street"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* City & State Row */}
      <View style={styles.row}>
        <View style={[styles.fieldGroup, styles.halfField]}>
          <Text style={styles.label}>City *</Text>
          <TextInput
            style={styles.input}
            value={company.registeredCity}
            onChangeText={(val) => updateDetails({ registeredCity: val })}
            placeholder="City"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={[styles.fieldGroup, styles.halfField]}>
          <Text style={styles.label}>State *</Text>
          <TextInput
            style={styles.input}
            value={company.registeredState}
            onChangeText={(val) => updateDetails({ registeredState: val })}
            placeholder="State"
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      {/* PIN Code */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>PIN Code *</Text>
        <TextInput
          style={styles.input}
          value={company.registeredPincode}
          onChangeText={(val) => updateDetails({ registeredPincode: val })}
          placeholder="6-digit PIN Code"
          keyboardType="numeric"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Premises Ownership */}
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
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{status}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.infoNote}>
          Proof of address (Electricity Bill / Rent Agreement) is mandatory. If premises are rented, leased, or owned by a Director or third party, a No Objection Certificate (NOC) from the owner is strictly required.
        </Text>
      </View>

      {/* Email & Mobile */}
      <View style={styles.row}>
        <View style={[styles.fieldGroup, styles.halfField]}>
          <Text style={styles.label}>Company Email *</Text>
          <TextInput
            style={styles.input}
            value={company.companyEmail}
            onChangeText={(val) => updateDetails({ companyEmail: val })}
            placeholder="official@company.com"
            keyboardType="email-address"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={[styles.fieldGroup, styles.halfField]}>
          <Text style={styles.label}>Mobile *</Text>
          <TextInput
            style={styles.input}
            value={company.companyMobile}
            onChangeText={(val) => updateDetails({ companyMobile: val })}
            placeholder="10-digit Mobile"
            keyboardType="phone-pad"
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      {/* Office Address Proof */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Office Address Proof (Rent Agreement / Electricity Bill)</Text>
        <View style={styles.uploadBox}>
          <Text style={styles.uploadText}>{company.officeAddressProofName || 'Rent_Agreement_Office.pdf'}</Text>
          <Ionicons name="checkmark-circle" size={20} color="#166534" />
        </View>
      </View>
    </View>
  );
};
