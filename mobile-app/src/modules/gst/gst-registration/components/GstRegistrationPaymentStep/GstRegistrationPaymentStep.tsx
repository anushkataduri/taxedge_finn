import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BrandColors } from "../../../../../shared/theme";
import {
  styles,
  getIconBoxStyle,
} from "./GstRegistrationPaymentStep.styles";

const PAYMENT_METHODS = [
  {
    id: "upi",
    title: "UPI",
    subtitle: "Google Pay, PhonePe, Paytm, BHIM",
    iconName: "phone-portrait-outline",
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
  {
    id: "card",
    title: "Debit / Credit Card",
    subtitle: "Visa, Mastercard, RuPay, Corporate",
    iconName: "card-outline",
    iconBg: "#E0F2FE",
    iconColor: "#0284C7",
  },
  {
    id: "netbanking",
    title: "Net Banking",
    subtitle: "All major Indian commercial banks",
    iconName: "business-outline",
    iconBg: "#F1F5F9",
    iconColor: "#475569",
  },
];

const UPI_APPS = [
  { label: "PhonePe", suffix: "@ybl" },
  { label: "GPay", suffix: "@okaxis" },
  { label: "Paytm", suffix: "@paytm" },
  { label: "BHIM", suffix: "@upi" },
];

export interface GstRegistrationPaymentStepProps {
  businessName?: string;
  onPaymentSuccess: (txnId: string, method: string) => void;
  onBackToReview?: () => void;
}

export const GstRegistrationPaymentStep: React.FC<GstRegistrationPaymentStepProps> = ({
  businessName = "Your Business",
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("upi");
  const [upiId, setUpiId] = useState<string>("taxedge@okaxis");
  const [upiError, setUpiError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>("");

  const handleSelectApp = (suffix: string) => {
    const userPrefix = upiId.includes("@") ? upiId.split("@")[0] : upiId;
    const finalPrefix = userPrefix || "business";
    setUpiId(`${finalPrefix}${suffix}`);
    setUpiError("");
  };

  const handleInitiatePayment = async () => {
    if (isProcessing) return;

    setPaymentError("");

    if (selectedMethod === "upi") {
      const cleanUpi = upiId.trim();
      if (!cleanUpi || !cleanUpi.includes("@") || cleanUpi.length < 5) {
        setUpiError("Enter a valid UPI ID (e.g. mobile@upi)");
        return;
      }
      setUpiError("");
    }

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const generatedTxnId = `TXN-GST-${Date.now().toString().slice(-8)}`;
      setIsProcessing(false);
      onPaymentSuccess(generatedTxnId, selectedMethod.toUpperCase());
    } catch (err: any) {
      setIsProcessing(false);
      const isNetwork =
        err?.message?.toLowerCase().includes("network") ||
        err?.message?.toLowerCase().includes("failed");
      const errorMsg = isNetwork
        ? "Unable to process payment. Check your connection and try again."
        : "Payment failed. Please try again.";
      setPaymentError(errorMsg);
      Alert.alert("Payment Failed", errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      {/* Service Header & Order Summary Card */}
      <View style={styles.orderSummaryCard}>
        <View style={styles.serviceHeaderRow}>
          <View style={styles.serviceBadge}>
            <Ionicons name="document-text" size={16} color={BrandColors.PRIMARY_BLUE} />
            <Text style={styles.serviceBadgeText}>GST REGISTRATION</Text>
          </View>
          <Text style={styles.applicantText} numberOfLines={1}>
            {businessName}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Cost Breakdown */}
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>GST Registration Service</Text>
          <Text style={styles.feeValue}>?1,270.34</Text>
        </View>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Applicable Taxes (18% GST)</Text>
          <Text style={styles.feeValue}>?228.66</Text>
        </View>

        <View style={styles.divider} />

        {/* Total Payable */}
        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalHeading}>Total Amount</Text>
            <Text style={styles.inclusiveText}>Includes all taxes & CA review</Text>
          </View>
          <Text style={styles.totalAmountText}>?1,499</Text>
        </View>
      </View>

      {/* Payment Error Banner if previous attempt failed */}
      {paymentError ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={20} color="#DC2626" />
          <View style={styles.methodInfoCol}>
            <Text style={styles.errorTitle}>Payment Failed</Text>
            <Text style={styles.errorSubtitle}>{paymentError}</Text>
          </View>
        </View>
      ) : null}

      {/* Select Payment Method */}
      <Text style={styles.sectionTitle}>Choose Payment Method</Text>

      <View style={styles.methodsList}>
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <TouchableOpacity
              key={method.id}
              activeOpacity={0.8}
              onPress={() => {
                if (!isProcessing) {
                  setSelectedMethod(method.id);
                  setPaymentError("");
                }
              }}
              style={[
                styles.methodCard,
                isSelected && styles.methodCardSelected,
              ]}
            >
              <View style={[styles.methodIconBox, getIconBoxStyle(method.iconBg)]}>
                <Ionicons name={method.iconName as any} size={20} color={method.iconColor} />
              </View>
              <View style={styles.methodInfoCol}>
                <Text style={styles.methodTitle}>{method.title}</Text>
                <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
              </View>
              <View
                style={[
                  styles.radioCircle,
                  isSelected && styles.radioCircleActive,
                ]}
              >
                {isSelected && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* UPI Details Box */}
      {selectedMethod === "upi" && (
        <View style={styles.methodDetailsCard}>
          <Text style={styles.inputLabel}>ENTER UPI ID / VPA *</Text>
          <TextInput
            style={[styles.input, upiError ? styles.inputError : null]}
            value={upiId}
            onChangeText={(t) => {
              setUpiId(t);
              setUpiError("");
            }}
            placeholder="e.g. yourname@okhdfcbank"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            editable={!isProcessing}
          />
          {upiError ? <Text style={styles.errorText}>{upiError}</Text> : null}

          <Text style={styles.quickSelectLabel}>Quick Select UPI App:</Text>
          <View style={styles.upiAppsRow}>
            {UPI_APPS.map((app) => (
              <TouchableOpacity
                key={app.label}
                style={styles.appPill}
                activeOpacity={0.7}
                onPress={() => !isProcessing && handleSelectApp(app.suffix)}
              >
                <Text style={styles.appPillText}>{app.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Security & Compliance Callout */}
      <View style={styles.securityBox}>
        <Ionicons name="shield-checkmark" size={18} color="#083B75" />
        <Text style={styles.securityText}>
          256-bit SSL encrypted & RBI/PCI-DSS compliant secure checkout.
        </Text>
      </View>

      {/* Primary Pay Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isProcessing}
        onPress={handleInitiatePayment}
        style={[
          styles.payBtn,
          isProcessing && styles.payBtnDisabled,
        ]}
      >
        {isProcessing ? (
          <View style={styles.processingRow}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.payBtnText}>Processing Payment...</Text>
          </View>
        ) : (
          <View style={styles.processingRow}>
            <Ionicons name="lock-closed" size={16} color="#FFFFFF" />
            <Text style={styles.payBtnText}>Pay ?1,499</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default GstRegistrationPaymentStep;
