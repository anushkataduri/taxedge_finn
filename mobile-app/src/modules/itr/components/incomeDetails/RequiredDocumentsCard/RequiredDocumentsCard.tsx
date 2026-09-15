import React from "react";
import { View, Text } from "react-native";
import { RequiredDocumentItem } from "../../../types/incomeDetails.types";
import { DocumentUploadItem } from "../DocumentUploadItem";
import { styles } from "./RequiredDocumentsCard.styles";

interface RequiredDocumentsCardProps {
  categoryTitle?: string;
  documents: RequiredDocumentItem[];
  onFilePicked: (id: string, fileInfo: { uri: string; name: string; size?: string }) => void;
  onFileRemoved: (id: string) => void;
}

export const RequiredDocumentsCard: React.FC<RequiredDocumentsCardProps> = ({
  categoryTitle = "Business Income",
  documents,
  onFilePicked,
  onFileRemoved,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>
        Required Documents for {categoryTitle}
      </Text>

      <View style={styles.listContainer}>
        {documents.map((doc) => (
          <DocumentUploadItem
            key={doc.id}
            item={doc}
            onFilePicked={onFilePicked}
            onFileRemoved={onFileRemoved}
          />
        ))}
      </View>
    </View>
  );
};
