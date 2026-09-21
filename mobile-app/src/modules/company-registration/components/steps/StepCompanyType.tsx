import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import type { CompanyType } from '../../types/company.types';
import { styles } from './StepCompanyType.styles';

const OPTIONS: { type: CompanyType; title: string; desc: string; members: string; timeline: string }[] = [
  {
    type: 'Private Limited',
    title: 'Private Limited Company (Pvt Ltd)',
    desc: 'Most popular structure for startups & growing businesses. Limited liability & easy funding.',
    members: 'Min 2 Directors',
    timeline: '7-10 Days',
  },
  {
    type: 'One Person Company (OPC)',
    title: 'One Person Company (OPC)',
    desc: 'Ideal for solo entrepreneurs who want corporate identity with 100% ownership control.',
    members: '1 Founder + 1 Nominee',
    timeline: '7-10 Days',
  },
  {
    type: 'Section 8 (NGO)',
    title: 'Section 8 Company (Non-Profit)',
    desc: 'Formed for promoting commerce, art, science, sports, education, research, or charity.',
    members: 'Min 2 Members',
    timeline: '12-15 Days',
  },
  {
    type: 'Public Limited',
    title: 'Public Limited Company',
    desc: 'Suitable for large scale enterprises planning to list shares or issue public capital.',
    members: 'Min 3 Directors',
    timeline: '15-20 Days',
  },
];

export const StepCompanyType: React.FC = () => {
  const selectedType = useCompanyRegistrationStore((state) => state.draft.company.companyType);
  const setCompanyType = useCompanyRegistrationStore((state) => state.setCompanyType);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select Company Type</Text>
      <Text style={styles.subheading}>Choose the corporate legal entity structure for your incorporation.</Text>

      {OPTIONS.map((item) => {
        const isSelected = selectedType === item.type;
        return (
          <TouchableOpacity
            key={item.type}
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={() => setCompanyType(item.type)}
            activeOpacity={0.8}
          >
            <View style={styles.row}>
              <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>{item.title}</Text>
              <Ionicons
                name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={isSelected ? '#083B75' : '#94A3B8'}
              />
            </View>
            <Text style={styles.description}>{item.desc}</Text>
            <View style={styles.tagRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.members}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.timeline}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
