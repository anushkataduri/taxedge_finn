import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CustomerOfftakerItem } from "../../types/projectFinance.types";
import { CustomerModal } from "./CustomerModal";
import { styles } from "./CustomersOfftakersCard.styles";

interface CustomersOfftakersCardProps {
  customers: CustomerOfftakerItem[];
  onAddCustomer: (customer: CustomerOfftakerItem) => void;
  onUpdateCustomer: (customer: CustomerOfftakerItem) => void;
  onDeleteCustomer: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const CustomersOfftakersCard: React.FC<CustomersOfftakersCardProps> = ({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  isExpanded,
  onToggleExpand,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<CustomerOfftakerItem | null>(null);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (item: CustomerOfftakerItem) => {
    setEditingItem(item);
    setModalVisible(true);
  };

  const handleSaveModal = (item: CustomerOfftakerItem) => {
    if (editingItem) {
      onUpdateCustomer(item);
    } else {
      onAddCustomer(item);
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={onToggleExpand}
          activeOpacity={0.7}
        >
          <View style={styles.iconBadge}>
            <Ionicons name="people-outline" size={18} color="#F97316" />
          </View>
          <Text style={styles.cardTitle}>3. Customers / Offtakers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addCustomerBtn} onPress={handleOpenAdd}>
          <Text style={styles.addCustomerText}>+ Add Customer</Text>
        </TouchableOpacity>
      </View>

      {/* Body */}
      {isExpanded && (
        <View style={styles.cardBody}>
          <Text style={styles.subtitle}>
            Add details of your key customers or offtakers.
          </Text>

          {/* Customers List */}
          {customers.map((cust) => (
            <TouchableOpacity
              key={cust.id}
              style={styles.customerCard}
              onPress={() => handleOpenEdit(cust)}
              activeOpacity={0.7}
            >
              <View style={styles.custHeader}>
                <View style={styles.custHeaderLeft}>
                  <View style={styles.custIconBox}>
                    <Ionicons name="business-outline" size={16} color="#EA580C" />
                  </View>
                  <Text style={styles.custName}>{cust.name}</Text>
                  {cust.isOfftaker && (
                    <View style={styles.offtakerBadge}>
                      <Text style={styles.offtakerBadgeText}>Offtaker</Text>
                    </View>
                  )}
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                  {customers.length > 1 && (
                    <TouchableOpacity
                      onPress={() => onDeleteCustomer(cust.id)}
                      style={{ padding: 4 }}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.custStatsRow}>
                <View style={styles.statCol}>
                  <Text style={styles.statLabel}>Type</Text>
                  <Text style={styles.statVal}>{cust.type}</Text>
                </View>

                <View style={styles.statCol}>
                  <Text style={styles.statLabel}>Expected Quantity</Text>
                  <Text style={styles.statVal}>{cust.expectedQuantity}</Text>
                </View>

                <View style={styles.statCol}>
                  <Text style={styles.statLabel}>Contract Period</Text>
                  <Text style={styles.statVal}>{cust.contractPeriodYears}</Text>
                </View>

                <View style={styles.statCol}>
                  <Text style={styles.statLabel}>Estimated Revenue (₹)</Text>
                  <Text style={styles.statVal}>{cust.estimatedRevenue}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Modal */}
      <CustomerModal
        visible={modalVisible}
        initialData={editingItem}
        onSave={handleSaveModal}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default CustomersOfftakersCard;
