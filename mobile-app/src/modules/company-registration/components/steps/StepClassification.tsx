import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import type { CompanyClass, CompanyCategory, CompanySubCategory } from '../../types/company.types';
import { styles } from './StepClassification.styles';

const CLASSES: CompanyClass[] = ['Private', 'Public'];
const CATEGORIES: CompanyCategory[] = ['Company limited by Shares', 'Company limited by Guarantee', 'Unlimited Company'];
const SUB_CATEGORIES: CompanySubCategory[] = ['Indian Non-Government Company', 'State Government Company', 'Central Government Company'];

export const StepClassification: React.FC = () => {
  const company = useCompanyRegistrationStore((state) => state.draft.company);
  const updateDetails = useCompanyRegistrationStore((state) => state.updateCompanyDetails);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Company Classification</Text>
      <Text style={styles.subheading}>Specify MCA statutory classification details for incorporation filing.</Text>

      {/* Class of Company */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Class of Company *</Text>
        <View style={styles.optionRow}>
          {CLASSES.map((cls) => {
            const selected = company.companyClass === cls;
            return (
              <TouchableOpacity
                key={cls}
                style={[styles.optionChip, selected && styles.optionChipSelected]}
                onPress={() => updateDetails({ companyClass: cls })}
              >
                <Text style={[styles.optionChipText, selected && styles.optionChipTextSelected]}>{cls}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Category of Company */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Category of Company *</Text>
        <View style={styles.optionRow}>
          {CATEGORIES.map((cat) => {
            const selected = company.companyCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.optionChip, selected && styles.optionChipSelected]}
                onPress={() => updateDetails({ companyCategory: cat })}
              >
                <Text style={[styles.optionChipText, selected && styles.optionChipTextSelected]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Sub-Category */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Sub-Category of Company *</Text>
        <View style={styles.optionRow}>
          {SUB_CATEGORIES.map((subCat) => {
            const selected = company.companySubCategory === subCat;
            return (
              <TouchableOpacity
                key={subCat}
                style={[styles.optionChip, selected && styles.optionChipSelected]}
                onPress={() => updateDetails({ companySubCategory: subCat })}
              >
                <Text style={[styles.optionChipText, selected && styles.optionChipTextSelected]}>{subCat}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={20} color="#1E40AF" />
        <Text style={styles.infoText}>Standard commercial startups default to Indian Non-Government Company limited by shares.</Text>
      </View>
    </View>
  );
};
