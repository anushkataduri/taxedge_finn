import React from "react";
import { View, Text } from "react-native";
import { FilingDocItem } from "../../config/gstFilingDocumentsConfig";
import { styles } from "./GstFilingDocumentsStep.styles";
import { GstDocItemCard } from "./GstDocItemCard";
import { filterDocsByCategory } from "./gstDocStepUtils";

interface RecursiveDocListProps {
  docs: readonly FilingDocItem[];
  filingNature?: "Regular Return" | "Nil Return";
  onPreview: (doc: FilingDocItem) => void;
  onPromptUpload: (docId: string) => void;
  onUploadOption: (docId: string, source: "gallery" | "camera") => void;
  onRemoveDoc: (docId: string) => void;
  index?: number;
}

export const RecursiveDocList: React.FC<RecursiveDocListProps> = ({
  docs,
  filingNature,
  onPreview,
  onPromptUpload,
  onUploadOption,
  onRemoveDoc,
  index = 0,
}) => {
  if (index >= docs.length) {
    return null;
  }

  const doc = docs[index];

  return (
    <>
      <GstDocItemCard
        key={doc.id}
        doc={doc}
        filingNature={filingNature}
        onPreview={onPreview}
        onPromptUpload={onPromptUpload}
        onUploadOption={onUploadOption}
        onRemoveDoc={onRemoveDoc}
      />
      <RecursiveDocList
        docs={docs}
        filingNature={filingNature}
        onPreview={onPreview}
        onPromptUpload={onPromptUpload}
        onUploadOption={onUploadOption}
        onRemoveDoc={onRemoveDoc}
        index={index + 1}
      />
    </>
  );
};

interface RecursiveCategorySectionsProps {
  categories: readonly FilingDocItem["category"][];
  documents: readonly FilingDocItem[];
  filingNature?: "Regular Return" | "Nil Return";
  onPreview: (doc: FilingDocItem) => void;
  onPromptUpload: (docId: string) => void;
  onUploadOption: (docId: string, source: "gallery" | "camera") => void;
  onRemoveDoc: (docId: string) => void;
  index?: number;
}

export const RecursiveCategorySections: React.FC<RecursiveCategorySectionsProps> = ({
  categories,
  documents,
  filingNature,
  onPreview,
  onPromptUpload,
  onUploadOption,
  onRemoveDoc,
  index = 0,
}) => {
  if (index >= categories.length) {
    return null;
  }

  const category = categories[index];
  const categoryDocs = filterDocsByCategory(documents, category);

  return (
    <>
      {categoryDocs.length > 0 ? (
        <View key={category} style={styles.categorySection}>
          <Text style={styles.categoryTitle}>{category}</Text>
          <View style={styles.docsList}>
            <RecursiveDocList
              docs={categoryDocs}
              filingNature={filingNature}
              onPreview={onPreview}
              onPromptUpload={onPromptUpload}
              onUploadOption={onUploadOption}
              onRemoveDoc={onRemoveDoc}
            />
          </View>
        </View>
      ) : null}
      <RecursiveCategorySections
        categories={categories}
        documents={documents}
        filingNature={filingNature}
        onPreview={onPreview}
        onPromptUpload={onPromptUpload}
        onUploadOption={onUploadOption}
        onRemoveDoc={onRemoveDoc}
        index={index + 1}
      />
    </>
  );
};
