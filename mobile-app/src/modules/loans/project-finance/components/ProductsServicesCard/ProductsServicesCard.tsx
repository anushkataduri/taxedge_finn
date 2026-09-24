import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ProductServiceItem } from "../../types/projectFinance.types";
import { ProductModal } from "./ProductModal";
import { styles } from "./ProductsServicesCard.styles";

interface ProductsServicesCardProps {
  products: ProductServiceItem[];
  onAddProduct: (product: ProductServiceItem) => void;
  onUpdateProduct: (product: ProductServiceItem) => void;
  onDeleteProduct: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const ProductsServicesCard: React.FC<ProductsServicesCardProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  isExpanded,
  onToggleExpand,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductServiceItem | null>(null);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (item: ProductServiceItem) => {
    setEditingItem(item);
    setModalVisible(true);
  };

  const handleSaveModal = (item: ProductServiceItem) => {
    if (editingItem) {
      onUpdateProduct(item);
    } else {
      onAddProduct(item);
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={onToggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={styles.iconBadge}>
            <Ionicons name="cube-outline" size={18} color="#F97316" />
          </View>
          <Text style={styles.cardTitle}>1. Products / Services</Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#64748B"
        />
      </TouchableOpacity>

      {/* Body */}
      {isExpanded && (
        <View style={styles.cardBody}>
          <Text style={styles.subtitle}>
            Add the products or services your project will offer.
          </Text>

          {/* Add Button */}
          <TouchableOpacity style={styles.addButton} onPress={handleOpenAdd}>
            <Ionicons name="add" size={18} color="#F97316" />
            <Text style={styles.addButtonText}>Add Product / Service</Text>
          </TouchableOpacity>

          {/* Products List */}
          {products.map((prod) => (
            <TouchableOpacity
              key={prod.id}
              style={styles.productCard}
              onPress={() => handleOpenEdit(prod)}
              activeOpacity={0.7}
            >
              <View style={styles.productLeft}>
                <View style={styles.productIconBox}>
                  <Ionicons name="cube-outline" size={18} color="#3B82F6" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productTitle}>{prod.name}</Text>
                  <Text style={styles.productCategory}>{prod.category}</Text>

                  <View style={styles.productStatsRow}>
                    <View style={styles.statCol}>
                      <Text style={styles.statLabel}>Capacity</Text>
                      <Text style={styles.statVal}>{prod.installedCapacity}</Text>
                    </View>
                    <View style={styles.statCol}>
                      <Text style={styles.statLabel}>Unit</Text>
                      <Text style={styles.statVal}>{prod.unit}</Text>
                    </View>
                    <View style={styles.statCol}>
                      <Text style={styles.statLabel}>Price (₹)</Text>
                      <Text style={styles.statVal}>{prod.sellingPrice}</Text>
                    </View>
                    <View style={styles.statCol}>
                      <Text style={styles.statLabel}>Mix</Text>
                      <Text style={styles.statVal}>{prod.productMix}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.productRight}>
                <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                {products.length > 1 && (
                  <TouchableOpacity
                    onPress={() => onDeleteProduct(prod.id)}
                    style={{ padding: 4 }}
                  >
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Modal */}
      <ProductModal
        visible={modalVisible}
        initialData={editingItem}
        onSave={handleSaveModal}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default ProductsServicesCard;
