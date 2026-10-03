import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar, Modal, Image } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useApplicationStore } from "@/store/applicationStore";
import { TaxNoticeHeader } from "../../components/common";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NoticePreviewScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const taxNoticeDraft = useApplicationStore((state) => state.taxNoticeDraft);

    const formData = taxNoticeDraft?.formData || {};
  const documents = taxNoticeDraft?.documents || [];
  const uploadedDocs = documents.filter((d: any) => d.status === "uploaded" || d.fileUri);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleEditDetails = () => {
    router.push("/service/tax-notice-assistance");
  };

  const handleEditDocuments = () => {
    router.back();
  };

  const handleContinueToMail = () => {
    router.push({
      pathname: "/service/tax-notice-review" as any,
      params: {
        noticeId: formData.noticeId,
        pan: formData.pan,
        noticeNumber: formData.noticeNumber,
        noticeDate: formData.noticeDate,
        responseDueDate: formData.responseDueDate,
        noticeType: formData.noticeType,
        assessmentYear: formData.assessmentYear,
      },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TaxNoticeHeader subtitle="Review Submission" />
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}>
        
        <View style={styles.headerArea}>
          <Text style={styles.title}>Review Your Details</Text>
          <Text style={styles.subtitle}>Please verify the information before we draft the response.</Text>
        </View>

        {/* Step 1 Details */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="document-text" size={20} color="#0B1F3A" />
              <Text style={styles.cardTitle}>Notice Details</Text>
            </View>
            <TouchableOpacity onPress={handleEditDetails} style={styles.editBtn}>
              <Ionicons name="pencil-outline" size={16} color="#F97316" />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.row}>
              <Text style={styles.label}>PAN Number</Text>
              <Text style={styles.value}>{formData.pan || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Assessment Year</Text>
              <Text style={styles.value}>{formData.assessmentYear || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Notice Type</Text>
              <Text style={styles.value}>{formData.noticeType || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Notice Date</Text>
              <Text style={styles.value}>{formData.noticeDate || "-"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>DIN / Notice Number</Text>
              <Text style={styles.value}>{formData.noticeNumber || "-"}</Text>
            </View>
          </View>
        </View>

        {/* Step 2 Details */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="folder-open" size={20} color="#0B1F3A" />
              <Text style={styles.cardTitle}>Uploaded Documents</Text>
            </View>
            <TouchableOpacity onPress={handleEditDocuments} style={styles.editBtn}>
              <Ionicons name="pencil-outline" size={16} color="#F97316" />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardBody}>
            {uploadedDocs.length === 0 ? (
              <Text style={[styles.value, { color: '#64748B' }]}>No documents uploaded.</Text>
            ) : (
              uploadedDocs.map((doc: any, i: number) => (
                <View key={i} style={styles.docRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, paddingRight: 8 }}>
                    <Ionicons name="image-outline" size={20} color="#10B981" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.docTitle} numberOfLines={1}>{doc.title}</Text>
                      {doc.fileName && <Text style={styles.docSubtitle} numberOfLines={1}>{doc.fileName}</Text>}
                    </View>
                  </View>
                  <TouchableOpacity style={styles.eyeBtn} onPress={() => {
                    if (doc.fileUri) {
                      setPreviewImage(doc.fileUri);
                    }
                  }}>
                    <Ionicons name="eye-outline" size={20} color="#0B1F3A" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </View>

      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinueToMail}>
          <Text style={styles.continueButtonText}>Continue to Final Review</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    {/* Image Preview Modal */}
      <Modal visible={!!previewImage} transparent={true} animationType="fade" onRequestClose={() => setPreviewImage(null)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setPreviewImage(null)}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          {previewImage && (
            <Image 
              source={{ uri: previewImage }} 
              style={styles.previewImage} 
              resizeMode="contain" 
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  headerArea: { marginBottom: 20 },
  scrollContent: { padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#0F172A", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#64748B", lineHeight: 20 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottomWidth: 1, borderBottomColor: "#F1F5F9", paddingBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  editBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FFF7ED", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  editBtnText: { fontSize: 13, fontWeight: "600", color: "#F97316" },
  cardBody: { gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: "#F8FAFC", paddingBottom: 8 },
  label: { fontSize: 13, color: "#64748B", flex: 1 },
  value: { fontSize: 13, color: "#0F172A", fontWeight: "600", flex: 1, textAlign: 'right' },
  docRow: { flexDirection: "row", alignItems: "center", justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  docTitle: { fontSize: 14, color: "#0F172A", fontWeight: '500' },
  docSubtitle: { fontSize: 12, color: "#64748B", marginTop: 2 },
  eyeBtn: { padding: 8, backgroundColor: "#F1F5F9", borderRadius: 8 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  continueButton: {
    backgroundColor: "#F97316",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  previewImage: {
    width: "90%",
    height: "80%",
  },
});

export default NoticePreviewScreen;
