import React from "react";
import { View, Text, TouchableOpacity, Alert, Modal, Image, SafeAreaView } from "react-native";
import { useState } from "react";
import * as Sharing from "expo-sharing";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { styles } from "../screens/GstCancellationScreen/GstCancellationScreen.styles";

interface GstSupportingProofProps {
  supportingDoc: any;
  setSupportingDoc: (doc: any) => void;
  handleBrowseFiles: () => void;
  handleScanFile: () => void;
}

export function GstSupportingProof({ supportingDoc, setSupportingDoc, handleBrowseFiles, handleScanFile }: GstSupportingProofProps) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const isImage = supportingDoc?.mimeType?.startsWith('image/') || supportingDoc?.name?.match(/\.(jpg|jpeg|png)$/i);
  return (
    <>
      {/* SUPPORTING PROOF SECTION (EXACT MATCH TO SCREENSHOT) */}
      
        <Text style={styles.formSectionTitle}>Supporting proof</Text>

        <View style={styles.proofCard}>
          <Text style={styles.proofDescText}>
            Attach the document that evidences this change (PDF, JPG, PNG — max
            10 MB).
          </Text>
          <View style={styles.uploadActionsRow}>
            <TouchableOpacity
              style={styles.uploadBtn}
              activeOpacity={0.8}
              onPress={handleBrowseFiles}
            >
              <Ionicons name="folder-outline" size={18} color="#EA580C" />
              <Text style={styles.uploadBtnText}>Browse Files</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.uploadBtn}
              activeOpacity={0.8}
              onPress={handleScanFile}
            >
              <Ionicons
                name="camera-outline"
                size={18}
                color={BrandColors.PRIMARY_BLUE}
              />
              <Text style={styles.uploadBtnText}>Scan</Text>
            </TouchableOpacity>
          </View>
          {supportingDoc && (
            <View style={styles.docPreviewRow}>
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <View style={styles.docPreviewIcon}>
                  <Ionicons name="document-text" size={20} color={BrandColors.PRIMARY_BLUE} />
                </View>
                <View style={styles.docPreviewInfo}>
                  <Text style={styles.docPreviewName} numberOfLines={1}>{supportingDoc.name}</Text>
                  <Text style={styles.docPreviewSize}>{supportingDoc.size}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                <TouchableOpacity
                  onPress={async () => {
                    if (isImage) {
                      setPreviewVisible(true);
                    } else {
                      try {
                        if (await Sharing.isAvailableAsync()) {
                          await Sharing.shareAsync(supportingDoc.uri);
                        } else {
                          Alert.alert("Not Supported", "Document preview is not supported.");
                        }
                      } catch (error) {
                        Alert.alert("Error", "Could not open the document.");
                      }
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 13, fontWeight: "700", color: BrandColors.PRIMARY_BLUE }}>Review</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.docDeleteBtn}
                  onPress={() => setSupportingDoc(null)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.docDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        
    
      <Modal visible={previewVisible} transparent={true} animationType="fade" onRequestClose={() => setPreviewVisible(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}>
          <TouchableOpacity style={{ padding: 16, alignSelf: 'flex-end', zIndex: 10 }} onPress={() => setPreviewVisible(false)}>
            <Ionicons name="close-circle" size={36} color="#FFFFFF" />
          </TouchableOpacity>
          {isImage && supportingDoc?.uri ? (
            <Image source={{ uri: supportingDoc.uri }} style={{ flex: 1, resizeMode: 'contain' }} />
          ) : null}
        </SafeAreaView>
      </Modal>
    </>
  );
}