import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { Button } from '../../../../shared/components/Button/Button';
import { useCompanyRegistration } from '../../hooks/useCompanyRegistration';
import { useTheme } from '../../../../hooks/use-theme';
import { styles, getThemedStyles } from './ReviewApplicationScreen.styles';

export const ReviewApplicationScreen: React.FC = () => {
  const colors = useTheme();
  const { draft } = useCompanyRegistration();
  const details = draft.company;
  const themed = getThemedStyles(colors);

  return (
    <View style={[styles.container, themed.container]}>
      <AppHeader title="Review Incorporation" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.card, themed.card]}>
          <Text style={[styles.cardTitle, themed.cardTitle]}>Proposed Names</Text>
          <Text style={[styles.cardValue, themed.cardValue]}>Option 1: {details.proposedName1 || 'Not specified'}</Text>
          <Text style={[styles.cardValue, themed.cardValue]}>Option 2: {details.proposedName2 || 'Not specified'}</Text>
        </View>
        <View style={[styles.card, themed.card]}>
          <Text style={[styles.cardTitle, themed.cardTitle]}>Entity Type</Text>
          <Text style={[styles.cardValue, themed.cardValue]}>{details.companyType}</Text>
        </View>
        <Button title="Submit Application" onPress={() => {}} variant="primary" />
      </ScrollView>
    </View>
  );
};

export default ReviewApplicationScreen;
