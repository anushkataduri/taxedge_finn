import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CustomerProfileSummary } from "../../../types/loans.types";
import { styles } from "./BusinessLoanCustomerCard.styles";

export interface BusinessLoanCustomerCardProps {
  profile?: Partial<CustomerProfileSummary>;
}

export const BusinessLoanCustomerCard: React.FC<BusinessLoanCustomerCardProps> = ({
  profile,
}) => {
  const maskPan = (pan?: string) => {
    if (!pan || pan.length < 5) return pan || "ANXXXX7E";
    return `${pan.slice(0, 2)}XXXX${pan.slice(-2)}`;
  };

  const maskAadhaar = (aadhaar?: string) => {
    if (!aadhaar || aadhaar.length < 8) return aadhaar || "XXXX-XXXX-6987";
    return `XXXX-XXXX-${aadhaar.slice(-4)}`;
  };

  const name = profile?.name || "Vani";
  const mobile = profile?.mobile || "9121442578";
  const email = profile?.email || "vaniudatha9121@gmail.com";
  const pan = maskPan(profile?.pan);
  const aadhaar = maskAadhaar(profile?.aadhaar);
  const dob = profile?.dob || "01-01-2000";
  const address = profile?.address || "Nellore, Nellore, Andhra Pradesh - 524314";

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <View style={styles.iconBox}>
            <Ionicons name="person" size={16} color="#EA580C" />
          </View>
          <Text style={styles.cardTitle}>Applicant Identity Details</Text>
        </View>
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={14} color="#166534" />
          <Text style={styles.verifiedText}>Verified Profile</Text>
        </View>
      </View>

      <View style={styles.infoBanner}>
        <Ionicons name="lock-closed" size={16} color="#2563EB" />
        <Text style={styles.infoBannerText}>
          Your details are securely pulled from your TaxEdge account. You do not need to re-enter them.
        </Text>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.gridCol}>
          <Text style={styles.detailLabel}>Name</Text>
          <Text style={styles.detailValue}>{name}</Text>
        </View>
        <View style={styles.gridCol}>
          <Text style={styles.detailLabel}>Mobile</Text>
          <Text style={styles.detailValue}>{mobile}</Text>
        </View>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.gridCol}>
          <Text style={styles.detailLabel}>Email</Text>
          <Text style={styles.detailValue} numberOfLines={1}>{email}</Text>
        </View>
        <View style={styles.gridCol}>
          <Text style={styles.detailLabel}>PAN</Text>
          <Text style={styles.detailValue}>{pan}</Text>
        </View>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.gridCol}>
          <Text style={styles.detailLabel}>Aadhaar</Text>
          <Text style={styles.detailValue}>{aadhaar}</Text>
        </View>
        <View style={styles.gridCol}>
          <Text style={styles.detailLabel}>Date of Birth</Text>
          <Text style={styles.detailValue}>{dob}</Text>
        </View>
      </View>

      <View style={styles.fullWidthCol}>
        <Text style={styles.detailLabel}>Address</Text>
        <Text style={styles.detailValue}>{address}</Text>
      </View>
    </View>
  );
};

export default BusinessLoanCustomerCard;
