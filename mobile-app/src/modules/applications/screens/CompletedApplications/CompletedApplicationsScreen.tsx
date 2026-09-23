import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { useTheme } from '../../../../hooks/use-theme';
import {
  styles,
  getCardThemedStyle,
  getTitleThemedStyle,
  getDescThemedStyle,
} from './CompletedApplicationsScreen.styles';

export const CompletedApplicationsScreen: React.FC = () => {
  const colors = useTheme();

  return (
    <View style={styles.container}>
      <AppHeader title="Completed Applications" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.card, getCardThemedStyle(colors.backgroundElement)]}>
          <Text style={[styles.title, getTitleThemedStyle(colors.text)]}>
            GST Registration (GST-2026-9812)
          </Text>
          <Text style={[styles.desc, getDescThemedStyle(colors.success)]}>
            Completed on 28 Feb 2026
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default CompletedApplicationsScreen;
