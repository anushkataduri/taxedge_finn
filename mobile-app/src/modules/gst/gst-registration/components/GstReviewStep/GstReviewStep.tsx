/**
 * Component: GstReviewStep
 * Refactored: Extracted repetitive rows to ReviewRow and reused DocumentPreviewModal.
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "@/shared/theme";
import { GstBusinessFormData } from "../GstBusinessStep/GstBusinessStep";
import { DocumentItem } from "../GstUnifiedDocumentStep/GstUnifiedDocumentStep";
import { styles, getDocProgressFillStyle } from "./GstReviewStep.styles";
import { DocumentPreviewModal } from "../GstUnifiedDocumentStep/GstDocumentModals";

interface GstReviewStepProps {
  businessData: GstBusinessFormData;
  documents: DocumentItem[];
  onEditStep: (stepIndex: number) => void;
  declared: boolean;
  onToggleDeclaration: () => void;
}

const ReviewRow = ({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text
      style={[styles.value, multiline && styles.valueMultiline]}
      numberOfLines={multiline ? undefined : 1}
    >
      {value || "-"}
    </Text>
  </View>
);

export const GstReviewStep: React.FC<GstReviewStepProps> = ({
  businessData,
  documents,
  onEditStep,
  declared,
  onToggleDeclaration,
}) => {
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const uploadedDocs = documents.filter((d) => Boolean(d.fileUri));
  const progressPercent =
    documents.length > 0 ? (uploadedDocs.length / documents.length) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* 1. Business Details Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Business Details</Text>
          <TouchableOpacity onPress={() => onEditStep(0)} activeOpacity={0.7}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />

        <ReviewRow label="Legal Name" value={businessData.legalName} />
        <ReviewRow label="Trade Name" value={businessData.businessName} />
        <ReviewRow label="Constitution" value={businessData.businessType} />
        <ReviewRow
          label="Nature of Business"
          value={businessData.natureOfBusiness}
        />
        <ReviewRow
          label="Date of Commencement"
          value={businessData.businessStartDate}
        />
        <ReviewRow
          label="Reason for Reg."
          value={businessData.reasonForRegistration}
        />
        <ReviewRow
          label="Composition Scheme"
          value={businessData.compositionScheme}
        />
        <ReviewRow
          label="Place of Business"
          value={businessData.placeOfBusiness}
        />
        <ReviewRow
          label="Address"
          value={businessData.businessAddress}
          multiline
        />
        <ReviewRow
          label="Location"
          value={`${businessData.city ? businessData.city + ", " : ""}${businessData.district ? businessData.district + ", " : ""}${businessData.state || ""} - ${businessData.pinCode || ""}`}
          multiline
        />
        <ReviewRow label="HSN / SAC Code" value={businessData.hsnCode} />
      </View>

      {/* 2. Bank Details Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Bank Details</Text>
          <TouchableOpacity onPress={() => onEditStep(0)} activeOpacity={0.7}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />

        <ReviewRow
          label="Account Holder"
          value={businessData.accountHolderName}
        />
        <ReviewRow
          label="Account Number"
          value={businessData.bankAccountNumber}
        />
        <ReviewRow label="IFSC Code" value={businessData.ifscCode} />
        <ReviewRow
          label="Bank & Branch"
          value={`${businessData.bankName || "-"} (${businessData.branchName || "-"})`}
          multiline
        />
        <ReviewRow label="Account Type" value={businessData.accountType} />
      </View>

      {/* 3. Authorised Signatory Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Authorised Signatory</Text>
          <TouchableOpacity onPress={() => onEditStep(0)} activeOpacity={0.7}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />

        <ReviewRow label="Name" value={businessData.signatoryName} />
        <ReviewRow label="PAN" value={businessData.signatoryPan} />
        <ReviewRow label="DOB" value={businessData.signatoryDob} />
        <ReviewRow
          label="Designation"
          value={businessData.signatoryDesignation}
        />
        <ReviewRow
          label="Contact"
          value={`${businessData.signatoryMobile ? `+91 ${businessData.signatoryMobile}` : "-"}\n${businessData.signatoryEmail || "-"}`}
          multiline
        />
      </View>

      {/* 4. Documents Summary Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Uploaded Documents</Text>
          <TouchableOpacity onPress={() => onEditStep(1)} activeOpacity={0.7}>
            <Text style={styles.docCountText}>
              {uploadedDocs.length}/{documents.length} Uploaded
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.docProgressBar}>
          <View
            style={[
              styles.docProgressFill,
              getDocProgressFillStyle(progressPercent),
            ]}
          />
        </View>

        {uploadedDocs.length > 0 && (
          <View style={styles.uploadedDocList}>
            {uploadedDocs.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                style={styles.uploadedDocItem}
                activeOpacity={0.7}
                onPress={() => setPreviewDoc(doc)}
              >
                <Ionicons name="checkmark-circle" size={18} color="#059669" />
                <View style={styles.uploadedDocTextCol}>
                  <Text style={styles.uploadedDocName} numberOfLines={1}>
                    {doc.name}
                  </Text>
                  {doc.id === "address-proof" && (
                    <Text style={styles.uploadedDocSubtitle}>
                      {doc.subtitle}
                    </Text>
                  )}
                </View>
                <View style={styles.eyeIconBox}>
                  <Ionicons
                    name="eye-outline"
                    size={18}
                    color={BrandColors.PRIMARY_BLUE}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* 5. Declaration Checkbox Card */}
      <TouchableOpacity
        style={styles.declarationCard}
        activeOpacity={0.8}
        onPress={onToggleDeclaration}
      >
        <View style={[styles.checkbox, declared && styles.checkboxActive]}>
          {declared && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
        </View>
        <Text style={styles.declarationText}>
          I hereby declare that the information provided is true and accurate to
          the best of my knowledge. I authorise TaxEdge Fin Solutions to file
          this application on my behalf.
        </Text>
      </TouchableOpacity>

      {/* Full-Screen Document Preview Modal */}
      <DocumentPreviewModal
        previewDoc={previewDoc}
        onClose={() => setPreviewDoc(null)}
        onReplace={() => {
          setPreviewDoc(null);
          onEditStep(1);
        }}
        isUploading={false}
      />
    </View>
  );
};
