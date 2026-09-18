import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { styles } from './StepFeesPayment.styles';

const PAYMENT_METHODS = [
  { id: 'UPI', title: 'UPI (GPay / PhonePe / Paytm / BHIM)', icon: 'qr-code-outline' },
  { id: 'Card', title: 'Credit / Debit Card', icon: 'card-outline' },
  { id: 'NetBanking', title: 'Net Banking (All Indian Banks)', icon: 'business-outline' },
];

export const StepFeesPayment: React.FC = () => {
  const feeBreakdown = useCompanyRegistrationStore((state) => state.draft.feeBreakdown);
  const processPayment = useCompanyRegistrationStore((state) => state.processPayment);
  const setStep = useCompanyRegistrationStore((state) => state.setStep);
  const [selectedMethod, setSelectedMethod] = useState('UPI');

  const handlePay = () => {
    processPayment(selectedMethod);
    Alert.alert('Payment Successful!', 'Your incorporation application has been submitted to TaxEdge Compliance Team.', [
      { text: 'View Tracking', onPress: () => setStep(11) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Fees & Payment Breakdown</Text>
      <Text style={styles.subheading}>Review itemized MCA government filing fees and TaxEdge professional charges.</Text>

      {/* Fee Itemization Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>TaxEdge Professional Fee</Text>
          <Text style={styles.value}>₹{feeBreakdown.professionalFee.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>GST (18%)</Text>
          <Text style={styles.value}>₹{feeBreakdown.gstAmount.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Government / Statutory MCA Charges</Text>
          <Text style={styles.value}>₹{feeBreakdown.statutoryCharges.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total Payable Amount</Text>
          <Text style={styles.totalValue}>₹{feeBreakdown.totalAmount.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      {/* Payment Method Selection */}
      <Text style={[styles.label, { fontWeight: '700', marginBottom: 8 }]}>Select Payment Method</Text>
      {PAYMENT_METHODS.map((m) => {
        const isSelected = selectedMethod === m.id;
        return (
          <TouchableOpacity
            key={m.id}
            style={[styles.methodCard, isSelected && styles.methodCardSelected]}
            onPress={() => setSelectedMethod(m.id)}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name={m.icon as any} size={22} color={isSelected ? '#083B75' : '#64748B'} />
              <Text style={styles.methodTitle}>{m.title}</Text>
            </View>
            <Ionicons
              name={isSelected ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={isSelected ? '#083B75' : '#94A3B8'}
            />
          </TouchableOpacity>
        );
      })}

      {/* Pay CTA */}
      <TouchableOpacity style={styles.payBtn} onPress={handlePay} activeOpacity={0.8}>
        <Text style={styles.payBtnText}>Pay ₹{feeBreakdown.totalAmount.toLocaleString('en-IN')} & Submit</Text>
      </TouchableOpacity>
    </View>
  );
};
