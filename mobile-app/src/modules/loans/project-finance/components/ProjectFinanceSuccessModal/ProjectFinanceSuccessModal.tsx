import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./ProjectFinanceSuccessModal.styles";

export interface ProjectFinanceSuccessModalProps {
  visible: boolean;
  applicationId?: string;
  referenceNumber?: string;
  onTrackStatus?: () => void;
  onClose: () => void;
}

export const ProjectFinanceSuccessModal: React.FC<
  ProjectFinanceSuccessModalProps
> = ({
  visible,
  applicationId = "PF-2026-9842",
  referenceNumber,
  onTrackStatus,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark-done" size={36} color="#16A34A" />
          </View>

          <Text style={styles.title}>Application Submitted!</Text>

          <View style={styles.appIdBadge}>
            <Text style={styles.appIdText}>
              {referenceNumber
                ? `Ref: ${referenceNumber}`
                : `Application ID: ${applicationId}`}
            </Text>
          </View>

          <Text style={styles.description}>
            Your Project Finance loan application has been submitted successfully.
            Our commercial credit appraisal team will review your dossier and
            initiate technical & financial due diligence.
          </Text>

          {onTrackStatus ? (
            <TouchableOpacity
              style={styles.trackButton}
              onPress={onTrackStatus}
              activeOpacity={0.8}
            >
              <Text style={styles.trackButtonText}>Track Application</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.doneButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ProjectFinanceSuccessModal;
