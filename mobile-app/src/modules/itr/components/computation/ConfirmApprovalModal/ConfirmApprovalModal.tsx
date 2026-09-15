import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./ConfirmApprovalModal.styles";

interface ConfirmApprovalModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmApprovalModal: React.FC<ConfirmApprovalModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const [agreed, setAgreed] = useState(false);

  const handleClose = () => {
    if (isLoading) return;
    setAgreed(false);
    onCancel();
  };

  const handleConfirmPress = () => {
    if (!agreed || isLoading) return;
    onConfirm();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dialogCard}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.iconCircle}>
                  <Ionicons name="checkmark-done-circle" size={24} color="#F97316" />
                </View>
                <Text style={styles.title}>Confirm Approval</Text>
              </View>

              {/* Message */}
              <Text style={styles.message}>
                I confirm that I have reviewed the tax computation and approve TaxEdge to file my Income Tax Return on my behalf.
              </Text>

              {/* Checkbox */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setAgreed(!agreed)}
                style={styles.checkboxRow}
              >
                <View
                  style={[
                    styles.checkbox,
                    agreed && styles.checkboxChecked,
                  ]}
                >
                  {agreed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>
                <Text style={styles.checkboxLabel}>
                  I agree and confirm the above.
                </Text>
              </TouchableOpacity>

              {/* Buttons */}
              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleClose}
                  disabled={isLoading}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleConfirmPress}
                  disabled={!agreed || isLoading}
                  style={[
                    styles.approveButton,
                    (!agreed || isLoading) && styles.approveButtonDisabled,
                  ]}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.approveButtonText}>Approve & File</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
