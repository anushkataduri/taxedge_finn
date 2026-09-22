import React from 'react';
import { View, ScrollView } from 'react-native';
import { AppHeader } from '../../../../shared/components/AppHeader';
import { DocumentChecklist } from '../../../../shared/components/DocumentUploader/DocumentChecklist';
import type { ApplicationDocument } from '../../../../shared/types/domain';
import { styles } from './PendingDocumentsScreen.styles';

export const PendingDocumentsScreen: React.FC = () => {
  const docs: ApplicationDocument[] = [
    { name: 'Income Proof / Bank Statement', status: 'Pending' },
    { name: 'Business Address Proof', status: 'Pending' },
  ];

  return (
    <View style={styles.container}>
      <AppHeader title="Action Required - Pending Documents" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <DocumentChecklist documents={docs} onUpload={() => {}} />
      </ScrollView>
    </View>
  );
};

export default PendingDocumentsScreen;
