import React from 'react';
import { View, Text, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { styles } from './StepCapitalShareholding.styles';

export const StepCapitalShareholding: React.FC = () => {
  const company = useCompanyRegistrationStore((state) => state.draft.company);
  const directors = useCompanyRegistrationStore((state) => state.draft.directors);
  const updateDetails = useCompanyRegistrationStore((state) => state.updateCompanyDetails);

  const isOpc = company.companyType === 'One Person Company (OPC)';

  // Dynamic share calculations from real promoter state
  const totalSubscribedShares = directors.reduce(
    (sum, d) => sum + (Number(d.numberOfShares) || 0),
    0
  );

  const getSharePercentageStr = (shares: number | undefined): string => {
    if (isOpc) return '100%';
    if (!shares || !totalSubscribedShares || totalSubscribedShares <= 0) return '--';
    const pct = (Number(shares) / totalSubscribedShares) * 100;
    if (isNaN(pct)) return '--';
    return pct % 1 === 0 ? `${pct.toFixed(0)}%` : `${pct.toFixed(2)}%`;
  };

  const isCapitalValid =
    Number(company.paidUpCapital) <= Number(company.authorizedCapital);
  const isFaceValueValid = Number(company.faceValuePerShare) > 0;
  const isShareholdingValid = isOpc || totalSubscribedShares > 0;
  const isAllValid = isCapitalValid && isFaceValueValid && isShareholdingValid;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Shareholding & Capital</Text>
      <Text style={styles.subheading}>
        Define authorized capital, subscribed capital, and equity share allocation.
      </Text>

      {/* Capital Details */}
      <Text style={styles.sectionTitle}>Capital Details</Text>

      <View style={styles.row}>
        <View style={[styles.fieldGroup, styles.halfField]}>
          <Text style={styles.label}>Authorised Capital (₹) *</Text>
          <TextInput
            style={styles.input}
            value={company.authorizedCapital ? String(company.authorizedCapital) : ''}
            onChangeText={(val) => updateDetails({ authorizedCapital: Number(val) || 0 })}
            keyboardType="numeric"
            placeholder="e.g. 100000"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={[styles.fieldGroup, styles.halfField]}>
          <Text style={styles.label}>Subscribed Capital (₹) *</Text>
          <TextInput
            style={styles.input}
            value={company.paidUpCapital ? String(company.paidUpCapital) : ''}
            onChangeText={(val) => updateDetails({ paidUpCapital: Number(val) || 0 })}
            keyboardType="numeric"
            placeholder="e.g. 100000"
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.fieldGroup, styles.halfField]}>
          <Text style={styles.label}>Total Number of Shares *</Text>
          <TextInput
            style={styles.input}
            value={company.numberOfShares ? String(company.numberOfShares) : ''}
            onChangeText={(val) => updateDetails({ numberOfShares: Number(val) || 0 })}
            keyboardType="numeric"
            placeholder="e.g. 10000"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={[styles.fieldGroup, styles.halfField]}>
          <Text style={styles.label}>Face Value per Share (₹) *</Text>
          <TextInput
            style={styles.input}
            value={company.faceValuePerShare ? String(company.faceValuePerShare) : ''}
            onChangeText={(val) => updateDetails({ faceValuePerShare: Number(val) || 10 })}
            keyboardType="numeric"
            placeholder="e.g. 10"
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      {/* Shareholding Pattern */}
      <Text style={styles.sectionTitle}>Shareholding Pattern</Text>

      {isOpc && (
        <Text style={styles.opcNote}>
          In a One Person Company (OPC), 100% equity shareholding is automatically allocated to the single member.
        </Text>
      )}

      {directors.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="people-outline" size={32} color="#94A3B8" />
          <Text style={styles.emptyText}>
            No promoter/share subscription details added yet.
          </Text>
        </View>
      ) : (
        <>
          {directors.map((dir, idx) => (
            <View key={dir.id || `dir-${idx}`} style={styles.shareCard}>
              <View style={styles.shareRow}>
                <View style={styles.shareInfo}>
                  <Text style={styles.shareName}>
                    {dir.name || `Promoter / Director #${idx + 1}`}
                  </Text>
                  <Text style={styles.shareDetailText}>
                    PAN: {dir.pan || 'N/A'} • Shares: {dir.numberOfShares ? dir.numberOfShares.toLocaleString() : '0'}
                  </Text>
                </View>

                <View style={styles.shareStatsRight}>
                  <View style={styles.shareBadge}>
                    <Text style={styles.shareBadgeText}>
                      {getSharePercentageStr(dir.numberOfShares)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}

          {/* Dynamic Totals */}
          <View style={styles.totalsCard}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Total Subscribed Shares</Text>
              <Text style={styles.totalsValue}>
                {totalSubscribedShares ? totalSubscribedShares.toLocaleString() : '0'}
              </Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Total Share Allocation</Text>
              <Text style={styles.totalsValue}>
                {isOpc || totalSubscribedShares > 0 ? '100%' : '--'}
              </Text>
            </View>
          </View>
        </>
      )}

      {/* Dynamic Validation Status */}
      <View
        style={[
          styles.validationBox,
          isAllValid ? styles.validBox : styles.invalidBox,
        ]}
      >
        <Ionicons
          name={isAllValid ? 'checkmark-circle' : 'alert-circle'}
          size={20}
          color={isAllValid ? '#166534' : '#991B1B'}
        />
        <View style={{ flex: 1 }}>
          <Text style={[styles.validationText, { color: isAllValid ? '#166534' : '#991B1B' }]}>
            Subscribed Capital ≤ Authorised Capital:{' '}
            {isCapitalValid ? 'PASSED' : 'FAILED (Subscribed exceeds Authorised)'}
          </Text>
          <Text style={[styles.validationText, { color: isAllValid ? '#166534' : '#991B1B' }]}>
            Total Share Allocation:{' '}
            {isShareholdingValid
              ? '100% (PASSED)'
              : 'FAILED (No shares allocated yet)'}
          </Text>
        </View>
      </View>
    </View>
  );
};
