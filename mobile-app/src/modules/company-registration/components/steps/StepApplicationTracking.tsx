import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { styles } from './StepApplicationTracking.styles';

export const StepApplicationTracking: React.FC = () => {
  const draft = useCompanyRegistrationStore((state) => state.draft);
  const setStep = useCompanyRegistrationStore((state) => state.setStep);
  const stages = draft.trackingStages;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Application Tracking</Text>
      <Text style={styles.subheading}>Live progress tracker for your MCA company incorporation application.</Text>

      {/* Application Meta Card */}
      <View style={styles.metaCard}>
        <Text style={styles.metaId}>Application ID: {draft.id}</Text>
        <Text style={styles.metaText}>Company: {draft.company.proposedName1}</Text>
        <Text style={styles.metaText}>Type: {draft.company.companyType} • Date: {draft.createdAt}</Text>
      </View>

      {/* Timeline Stages */}
      <View style={styles.timeline}>
        {stages.map((stg, idx) => {
          const isDone = stg.status === 'completed';
          const isCurrent = stg.status === 'current';
          return (
            <View key={stg.id} style={styles.stageRow}>
              <View style={styles.iconColumn}>
                <Ionicons
                  name={isDone ? 'checkmark-circle' : isCurrent ? 'time' : 'ellipse-outline'}
                  size={22}
                  color={isDone ? '#166534' : isCurrent ? '#F97316' : '#94A3B8'}
                />
                {idx < stages.length - 1 && (
                  <View style={[styles.line, isDone && styles.lineCompleted]} />
                )}
              </View>

              <View style={styles.stageContent}>
                <Text style={styles.stageTitle}>{stg.title}</Text>
                <Text style={styles.stageDesc}>{stg.description}</Text>
                {stg.updatedAt && <Text style={styles.stageTime}>{stg.updatedAt}</Text>}
              </View>
            </View>
          );
        })}
      </View>

      {/* View Receipt CTA */}
      <TouchableOpacity style={styles.receiptBtn} onPress={() => setStep(13)}>
        <Text style={styles.receiptBtnText}>View / Download Application Receipt →</Text>
      </TouchableOpacity>
    </View>
  );
};
