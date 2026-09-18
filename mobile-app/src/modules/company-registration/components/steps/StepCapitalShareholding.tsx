import React from 'react';
import { View, Text, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { styles } from './StepCapitalShareholding.styles';

export const StepCapitalShareholding: React.FC = () => {
  const company = useCompanyRegistrationStore((state) => state.draft.company);
  const directors = useCompanyRegistrationStore((state) => state.draft.directors);
  const updateDetails = useCompanyRegistrationStore((state) => state.updateCompanyDetails);
  const updateDirector = useCompanyRegistrationStore((state) => state.updateDirector);

  const totalShareholding = directors.reduce((sum, d) => sum + (Number(d.sharesPercentage) || 0), 0);
  const isPaidUpValid = Number(company.paidUpCapital) <= Number(company.authorizedCapital);
  const isShareholdingValid = totalShareholding === 100;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Shareholding & Capital</Text>
      <Text style={styles.subheading}>Define authorized capital, paid-up capital, and equity share allocation.</Text>

      {/* Authorised & Paid-up Capital */}
      <View style={styles.row}>
        <View style={[styles.fieldGroup, styles.halfField]}>
          <Text style={styles.label}>Authorised Capital (₹) *</Text>
          <TextInput
            style={styles.input}
            value={String(company.authorizedCapital)}
            onChangeText={(val) => updateDetails({ authorizedCapital: Number(val) || 0 })}
            keyboardType="numeric"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={[styles.fieldGroup, styles.halfField]}>
          <Text style={styles.label}>Paid-up Capital (₹) *</Text>
          <TextInput
            style={styles.input}
            value={String(company.paidUpCapital)}
            onChangeText={(val) => updateDetails({ paidUpCapital: Number(val) || 0 })}
            keyboardType="numeric"
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      {/* Number of Shares & Face Value */}
      <View style={styles.row}>
        <View style={[styles.fieldGroup, styles.halfField]}>
          <Text style={styles.label}>Number of Shares *</Text>
          <TextInput
            style={styles.input}
            value={String(company.numberOfShares)}
            onChangeText={(val) => updateDetails({ numberOfShares: Number(val) || 0 })}
            keyboardType="numeric"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={[styles.fieldGroup, styles.halfField]}>
          <Text style={styles.label}>Face Value per Share (₹) *</Text>
          <TextInput
            style={styles.input}
            value={String(company.faceValuePerShare)}
            onChangeText={(val) => updateDetails({ faceValuePerShare: Number(val) || 10 })}
            keyboardType="numeric"
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      {/* Shareholding Breakdown */}
      <Text style={[styles.label, { marginTop: 10, marginBottom: 8 }]}>Equity Shareholding Pattern (%)</Text>
      {directors.map((dir) => (
        <View key={dir.id} style={styles.shareCard}>
          <View style={styles.shareRow}>
            <View>
              <Text style={styles.shareName}>{dir.name || 'Promoter'}</Text>
              <Text style={{ fontSize: 12, color: '#64748B' }}>PAN: {dir.pan || 'N/A'}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <TextInput
                style={styles.shareInput}
                value={String(dir.sharesPercentage)}
                onChangeText={(val) => updateDirector(dir.id, { sharesPercentage: Number(val) || 0 })}
                keyboardType="numeric"
              />
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>%</Text>
            </View>
          </View>
        </View>
      ))}

      {/* Validations Display */}
      <View style={[styles.validationBox, isPaidUpValid && isShareholdingValid ? styles.validBox : styles.invalidBox]}>
        <Ionicons
          name={isPaidUpValid && isShareholdingValid ? 'checkmark-circle' : 'alert-circle'}
          size={20}
          color={isPaidUpValid && isShareholdingValid ? '#166534' : '#991B1B'}
        />
        <View style={{ flex: 1 }}>
          <Text style={[styles.validationText, { color: isPaidUpValid && isShareholdingValid ? '#166534' : '#991B1B' }]}>
            Paid-up ≤ Authorised Capital: {isPaidUpValid ? 'PASSED' : 'FAILED (Paid-up exceeds Authorised)'}
          </Text>
          <Text style={[styles.validationText, { color: isShareholdingValid ? '#166534' : '#991B1B' }]}>
            Total Equity Allocation: {totalShareholding}% {isShareholdingValid ? '(PASSED)' : '(Must equal 100%)'}
          </Text>
        </View>
      </View>
    </View>
  );
};
