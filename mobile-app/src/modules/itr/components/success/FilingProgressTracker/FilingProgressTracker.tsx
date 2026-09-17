import React from "react";
import { View, Text, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "./FilingProgressTracker.styles";

interface ItrProgressStage {
  id: string;
  stageNumber: number;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  status: "completed" | "active" | "pending";
  description: string;
}

export const FilingProgressTracker: React.FC = () => {
  const stages: ItrProgressStage[] = [
    {
      id: "stage-1",
      stageNumber: 1,
      label: "New\nRequest",
      icon: "document-text-outline",
      status: "completed",
      description: "Filing request initiated and customer profile confirmed.",
    },
    {
      id: "stage-2",
      stageNumber: 2,
      label: "Docs\nPending",
      icon: "cloud-upload-outline",
      status: "completed",
      description: "Key tax documents identified for upload.",
    },
    {
      id: "stage-3",
      stageNumber: 3,
      label: "Docs\nReceived",
      icon: "file-tray-full-outline",
      status: "active",
      description: "Your uploaded documents and data have been received by TaxEdge.",
    },
    {
      id: "stage-4",
      stageNumber: 4,
      label: "Docs Under\nVerify",
      icon: "search-outline",
      status: "pending",
      description: "Certified CA verifying Form 16, AIS/TIS against declared sources.",
    },
    {
      id: "stage-5",
      stageNumber: 5,
      label: "ITR\nPreparation",
      icon: "create-outline",
      status: "pending",
      description: "CA preparing the draft computation and optimal regime selection.",
    },
    {
      id: "stage-6",
      stageNumber: 6,
      label: "Tax\nCalculation",
      icon: "calculator-outline",
      status: "pending",
      description: "Final tax computation, TDS reconciliation, and rebate validation.",
    },
    {
      id: "stage-7",
      stageNumber: 7,
      label: "Customer\nApproval",
      icon: "person-outline",
      status: "pending",
      description: "Review and approve the CA-prepared computation before portal submission.",
    },
    {
      id: "stage-8",
      stageNumber: 8,
      label: "ITR\nFiled",
      icon: "paper-plane-outline",
      status: "pending",
      description: "Return submitted to the Income Tax Department portal.",
    },
    {
      id: "stage-9",
      stageNumber: 9,
      label: "E-Verify\nPending",
      icon: "time-outline",
      status: "pending",
      description: "Pending Aadhaar OTP or net-banking e-verification.",
    },
    {
      id: "stage-10",
      stageNumber: 10,
      label: "E-Verified",
      icon: "shield-checkmark-outline",
      status: "pending",
      description: "Successfully e-verified with the Income Tax Department.",
    },
    {
      id: "stage-11",
      stageNumber: 11,
      label: "Processing",
      icon: "sync-outline",
      status: "pending",
      description: "Return currently processing by CPC Bangalore.",
    },
    {
      id: "stage-12",
      stageNumber: 12,
      label: "Refund /\nPayable",
      icon: "cash-outline",
      status: "pending",
      description: "Intimation u/s 143(1) issued; refund credited or tax settled.",
    },
    {
      id: "stage-13",
      stageNumber: 13,
      label: "Completed",
      icon: "checkmark-done-circle-outline",
      status: "pending",
      description: "ITR filing lifecycle fully completed and archived.",
    },
  ];

  const activeStage = stages.find((s) => s.status === "active") || stages[2];

  return (
    <View style={styles.card}>
      {/* Tracker Header */}
      <View style={styles.trackerHeaderRow}>
        <Text style={styles.trackerTitle}>ITR Lifecycle Tracker</Text>
        <View style={styles.trackerBadge}>
          <Text style={styles.trackerBadgeText}>Stage {activeStage.stageNumber} of 13</Text>
        </View>
      </View>

      {/* 13 Step Nodes in Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.stepsRow}>
          {stages.map((step, index) => {
            const isLast = index === stages.length - 1;
            const isCompleted = step.status === "completed";
            const isActive = step.status === "active";

            return (
              <React.Fragment key={step.id}>
                {/* Step Node */}
                <View style={styles.stepNode}>
                  <View
                    style={[
                      styles.iconCircle,
                      isCompleted && styles.completedCircle,
                      isActive && styles.activeCircle,
                      !isCompleted && !isActive && styles.inactiveCircle,
                    ]}
                  >
                    <Ionicons
                      name={step.icon}
                      size={14}
                      color={isCompleted || isActive ? "#FFFFFF" : "#64748B"}
                    />
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      isCompleted && styles.completedLabel,
                      isActive && styles.activeLabel,
                      !isCompleted && !isActive && styles.inactiveLabel,
                    ]}
                    numberOfLines={2}
                  >
                    {step.label}
                  </Text>
                </View>

                {/* Connector line */}
                {!isLast && <View style={styles.connector} />}
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>

      {/* Underneath Context Box for Active Stage */}
      <View style={styles.activeStageBox}>
        <View style={styles.activeStageTitleRow}>
          <Ionicons name="information-circle" size={15} color="#083B75" />
          <Text style={styles.activeStageTitle}>
            Current Stage {activeStage.stageNumber}: {activeStage.label.replace(/\n/g, " ")}
          </Text>
        </View>
        <Text style={styles.activeStageDesc}>{activeStage.description}</Text>
      </View>
    </View>
  );
};

export default FilingProgressTracker;
