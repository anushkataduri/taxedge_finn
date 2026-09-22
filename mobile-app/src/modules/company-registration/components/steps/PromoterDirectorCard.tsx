import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { DirectorInfo } from '../../types/director.types';
import { styles } from './StepPromoters.styles';

export interface PromoterDirectorCardProps {
  director: DirectorInfo;
  index: number;
  isExpanded: boolean;
  canRemove: boolean;
  shareholdingPct: string;
  onToggleExpand: () => void;
  onSave: (updated: Partial<DirectorInfo>) => void;
  onDeleteRequest: () => void;
}

export const PromoterDirectorCard: React.FC<PromoterDirectorCardProps> = ({
  director,
  index,
  isExpanded,
  canRemove,
  shareholdingPct,
  onToggleExpand,
  onSave,
  onDeleteRequest,
}) => {
  // Local transient state for edit mode
  const [formData, setFormData] = useState<DirectorInfo>(director);

  useEffect(() => {
    setFormData(director);
  }, [director]);

  const updateField = (fields: Partial<DirectorInfo>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleSaveChanges = () => {
    onSave(formData);
  };

  const handleCancelEdit = () => {
    setFormData(director);
    onToggleExpand();
  };

  const isSameAddress = formData.sameAsPermanentAddress !== false;
  const isResident = formData.isResidentInIndia !== false;

  return (
    <View style={styles.card}>
      {/* Accordion Header */}
      <View style={styles.cardHeader}>
        <TouchableOpacity style={styles.cardHeaderLeft} onPress={onToggleExpand} activeOpacity={0.8}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>#{index + 1}</Text>
          </View>
          <View style={styles.cardTitleGroup}>
            <Text style={styles.cardTitle}>👤 Director #{index + 1}</Text>
            <Text style={styles.cardSubtitle} numberOfLines={1}>
              {director.name || 'Enter Promoter / Director Details'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.cardHeaderRight}>
          <TouchableOpacity style={styles.editBtnHeader} onPress={onToggleExpand} activeOpacity={0.7}>
            <Ionicons name={isExpanded ? 'chevron-up' : 'pencil'} size={16} color="#083B75" />
            <Text style={styles.editBtnHeaderText}>{isExpanded ? 'Collapse' : 'Edit'}</Text>
          </TouchableOpacity>

          {canRemove && (
            <TouchableOpacity style={styles.deleteBtnHeader} onPress={onDeleteRequest} activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Summary View (When Collapsed) */}
      {!isExpanded && (
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>PAN: <Text style={styles.summaryBold}>{director.pan || 'N/A'}</Text></Text>
            <Text style={styles.summaryText}>Mobile: <Text style={styles.summaryBold}>{director.phone || 'N/A'}</Text></Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Shares: <Text style={styles.summaryBold}>{director.numberOfShares ? director.numberOfShares.toLocaleString() : '0'}</Text></Text>
            <Text style={styles.summaryText}>Shareholding: <Text style={styles.summaryBold}>{shareholdingPct}</Text></Text>
          </View>
        </View>
      )}

      {/* Expanded Edit Form */}
      {isExpanded && (
        <View style={styles.cardContent}>
          {/* SECTION A — BASIC DETAILS */}
          <Text style={styles.sectionTitle}>A. Basic Details</Text>

          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Full Name (as in PAN) *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(val) => updateField({ name: val })}
                placeholder="Full Legal Name"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>PAN Number *</Text>
              <TextInput
                style={styles.input}
                value={formData.pan}
                onChangeText={(val) => updateField({ pan: val })}
                placeholder="10-digit PAN"
                autoCapitalize="characters"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>DIN (if already allotted)</Text>
              <TextInput
                style={styles.input}
                value={formData.din || ''}
                onChangeText={(val) => updateField({ din: val, hasDin: !!val })}
                placeholder="8-digit DIN"
                keyboardType="numeric"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Date of Birth *</Text>
              <TextInput
                style={styles.input}
                value={formData.dob || ''}
                onChangeText={(val) => updateField({ dob: val })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Father's Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.fatherName || ''}
                onChangeText={(val) => updateField({ fatherName: val })}
                placeholder="Father's Full Name"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Gender *</Text>
              <TextInput
                style={styles.input}
                value={formData.gender || ''}
                onChangeText={(val) => updateField({ gender: val })}
                placeholder="Male / Female"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Nationality *</Text>
              <TextInput
                style={styles.input}
                value={formData.nationality || 'Indian'}
                onChangeText={(val) => updateField({ nationality: val })}
                placeholder="Indian"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Designation *</Text>
              <TextInput
                style={styles.input}
                value={formData.designation || 'Director'}
                onChangeText={(val) => updateField({ designation: val })}
                placeholder="Director"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Category *</Text>
            <TextInput
              style={styles.input}
              value={formData.category || 'Promoter Director'}
              onChangeText={(val) => updateField({ category: val })}
              placeholder="Promoter Director"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.sectionDivider} />

          {/* SECTION B — CONTACT */}
          <Text style={styles.sectionTitle}>B. Contact</Text>

          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(val) => updateField({ email: val })}
                placeholder="email@domain.com"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Mobile Number *</Text>
              <TextInput
                style={styles.input}
                value={formData.phone || ''}
                onChangeText={(val) => updateField({ phone: val })}
                placeholder="10-digit Mobile"
                keyboardType="phone-pad"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.sectionDivider} />

          {/* SECTION C — RESIDENCY & PERMANENT ADDRESS */}
          <Text style={styles.sectionTitle}>C. Residency & Address</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Whether resident in India *</Text>
            <View style={styles.chipRow}>
              {[true, false].map((val) => {
                const selected = isResident === val;
                return (
                  <TouchableOpacity
                    key={val ? 'yes' : 'no'}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => updateField({ isResidentInIndia: val })}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {val ? 'Yes' : 'No'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <Text style={[styles.label, { marginTop: 4 }]}>Permanent Residential Address *</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Address Line 1 *</Text>
            <TextInput
              style={styles.input}
              value={formData.addressLine1 || formData.residentialAddress || ''}
              onChangeText={(val) => updateField({ addressLine1: val, residentialAddress: val })}
              placeholder="Flat / House No, Street Name"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Address Line 2 (Optional)</Text>
            <TextInput
              style={styles.input}
              value={formData.addressLine2 || ''}
              onChangeText={(val) => updateField({ addressLine2: val })}
              placeholder="Locality / Landmark"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                value={formData.city || ''}
                onChangeText={(val) => updateField({ city: val })}
                placeholder="City"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>District *</Text>
              <TextInput
                style={styles.input}
                value={formData.district || ''}
                onChangeText={(val) => updateField({ district: val })}
                placeholder="District"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>State *</Text>
              <TextInput
                style={styles.input}
                value={formData.state || ''}
                onChangeText={(val) => updateField({ state: val })}
                placeholder="State"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>PIN Code *</Text>
              <TextInput
                style={styles.input}
                value={formData.pinCode || ''}
                onChangeText={(val) => updateField({ pinCode: val })}
                placeholder="6-digit PIN"
                keyboardType="numeric"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Present Address Checkbox */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => updateField({ sameAsPermanentAddress: !isSameAddress })}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isSameAddress ? 'checkbox' : 'square-outline'}
              size={20}
              color={isSameAddress ? '#083B75' : '#64748B'}
            />
            <Text style={styles.checkboxText}>Present Residential Address same as Permanent Address</Text>
          </TouchableOpacity>

          {!isSameAddress && (
            <View style={{ marginTop: 8 }}>
              <Text style={[styles.label, { color: '#083B75', fontWeight: '700' }]}>
                Present Residential Address
              </Text>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Present Address Line 1 *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.presentAddressLine1 || ''}
                  onChangeText={(val) => updateField({ presentAddressLine1: val })}
                  placeholder="Address Line 1"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Present Address Line 2 (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.presentAddressLine2 || ''}
                  onChangeText={(val) => updateField({ presentAddressLine2: val })}
                  placeholder="Address Line 2"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.row}>
                <View style={[styles.fieldGroup, styles.halfField]}>
                  <Text style={styles.label}>City *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.presentCity || ''}
                    onChangeText={(val) => updateField({ presentCity: val })}
                    placeholder="City"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={[styles.fieldGroup, styles.halfField]}>
                  <Text style={styles.label}>District *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.presentDistrict || ''}
                    onChangeText={(val) => updateField({ presentDistrict: val })}
                    placeholder="District"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={[styles.fieldGroup, styles.halfField]}>
                  <Text style={styles.label}>State *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.presentState || ''}
                    onChangeText={(val) => updateField({ presentState: val })}
                    placeholder="State"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={[styles.fieldGroup, styles.halfField]}>
                  <Text style={styles.label}>PIN Code *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.presentPincode || ''}
                    onChangeText={(val) => updateField({ presentPincode: val })}
                    placeholder="PIN Code"
                    keyboardType="numeric"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
            </View>
          )}

          <View style={styles.sectionDivider} />

          {/* SECTION D — SHARE SUBSCRIPTION */}
          <Text style={styles.sectionTitle}>D. Share Subscription</Text>

          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Number of Equity Shares Subscribed *</Text>
              <TextInput
                style={styles.input}
                value={formData.numberOfShares ? String(formData.numberOfShares) : ''}
                onChangeText={(val) => {
                  const shares = parseInt(val, 10) || 0;
                  updateField({ numberOfShares: shares, amountSubscribed: shares * 10 });
                }}
                placeholder="e.g. 5000"
                keyboardType="numeric"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Amount of Equity Shares Subscribed *</Text>
              <TextInput
                style={styles.input}
                value={formData.amountSubscribed ? String(formData.amountSubscribed) : ''}
                onChangeText={(val) => updateField({ amountSubscribed: parseInt(val, 10) || 0 })}
                placeholder="e.g. 50000"
                keyboardType="numeric"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Shareholding Percentage (READ ONLY)</Text>
            <View style={styles.readOnlyBox}>
              <Ionicons name="pie-chart-outline" size={18} color="#083B75" />
              <Text style={styles.readOnlyText}>{shareholdingPct}</Text>
            </View>
          </View>

          {/* Action Buttons for Card Edit */}
          <View style={styles.cardActionsRow}>
            <TouchableOpacity style={styles.cancelFormBtn} onPress={handleCancelEdit} activeOpacity={0.7}>
              <Text style={styles.cancelFormText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveFormBtn} onPress={handleSaveChanges} activeOpacity={0.7}>
              <Ionicons name="checkmark-sharp" size={16} color="#FFFFFF" />
              <Text style={styles.saveFormText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
