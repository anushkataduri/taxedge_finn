import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCompanyRegistrationStore } from '../../store/companyRegistrationSlice';
import { styles } from './StepPromoters.styles';

export const StepPromoters: React.FC = () => {
  const company = useCompanyRegistrationStore((state) => state.draft.company);
  const directors = useCompanyRegistrationStore((state) => state.draft.directors);
  const opcNominee = useCompanyRegistrationStore((state) => state.draft.opcNominee);
  const addDirector = useCompanyRegistrationStore((state) => state.addDirector);
  const updateDirector = useCompanyRegistrationStore((state) => state.updateDirector);
  const removeDirector = useCompanyRegistrationStore((state) => state.removeDirector);
  const setOpcNominee = useCompanyRegistrationStore((state) => state.setOpcNominee);

  const isOpc = company.companyType === 'One Person Company (OPC)';

  const handleAddPromoter = () => {
    addDirector({
      id: `dir-${Date.now()}`,
      name: `Director ${directors.length + 1}`,
      pan: '',
      aadhaar: '',
      dob: '1992-01-01',
      fatherName: '',
      email: '',
      phone: '',
      occupation: 'Professional',
      hasDin: false,
      hasDsc: true,
      sharesPercentage: 0,
      residentialAddress: '',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Promoter / Director Details</Text>
      <Text style={styles.subheading}>
        Enter identity, contact, DIN & shareholding percentage of all company promoters/directors.
      </Text>

      {directors.map((dir, idx) => (
        <View key={dir.id} style={styles.promoterCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.promoterName}>Promoter / Director #{idx + 1}</Text>
              <Text style={styles.promoterSub}>{dir.name || 'Full Legal Name'}</Text>
            </View>
            {directors.length > (isOpc ? 1 : 2) && (
              <TouchableOpacity onPress={() => removeDirector(dir.id)}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>

          {/* Name & PAN Row */}
          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Full Name (as in PAN) *</Text>
              <TextInput
                style={styles.input}
                value={dir.name}
                onChangeText={(val) => updateDirector(dir.id, { name: val })}
                placeholder="Full Name"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>PAN Number *</Text>
              <TextInput
                style={styles.input}
                value={dir.pan}
                onChangeText={(val) => updateDirector(dir.id, { pan: val })}
                placeholder="PAN Number"
                autoCapitalize="characters"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Aadhaar & DOB Row */}
          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Aadhaar Number *</Text>
              <TextInput
                style={styles.input}
                value={dir.aadhaar}
                onChangeText={(val) => updateDirector(dir.id, { aadhaar: val })}
                placeholder="12-digit Aadhaar"
                keyboardType="numeric"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Date of Birth *</Text>
              <TextInput
                style={styles.input}
                value={dir.dob}
                onChangeText={(val) => updateDirector(dir.id, { dob: val })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Father Name & Occupation */}
          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Father's Name *</Text>
              <TextInput
                style={styles.input}
                value={dir.fatherName}
                onChangeText={(val) => updateDirector(dir.id, { fatherName: val })}
                placeholder="Father's Name"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Occupation *</Text>
              <TextInput
                style={styles.input}
                value={dir.occupation}
                onChangeText={(val) => updateDirector(dir.id, { occupation: val })}
                placeholder="e.g. Professional / Business"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* Email & Phone */}
          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={dir.email}
                onChangeText={(val) => updateDirector(dir.id, { email: val })}
                placeholder="Email"
                keyboardType="email-address"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Mobile Number *</Text>
              <TextInput
                style={styles.input}
                value={dir.phone}
                onChangeText={(val) => updateDirector(dir.id, { phone: val })}
                placeholder="Mobile"
                keyboardType="phone-pad"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>
      ))}

      {/* Add Promoter Button */}
      {!isOpc && (
        <TouchableOpacity style={styles.addBtn} onPress={handleAddPromoter}>
          <Ionicons name="add-circle-outline" size={20} color="#083B75" />
          <Text style={styles.addBtnText}>+ Add Promoter / Director</Text>
        </TouchableOpacity>
      )}

      {/* OPC Nominee Section (Only shown when OPC is selected) */}
      {isOpc && (
        <View style={styles.opcBox}>
          <Text style={styles.opcHeader}>One Person Company (OPC) Nominee Details</Text>
          <Text style={styles.opcNote}>
            Legal Appointee (Companies Act Requirement): The nominee does NOT hold any equity shares during the sole member's lifetime (0% shareholding) and only assumes ownership in the event of death or incapacity of the sole member.
          </Text>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nominee Full Name *</Text>
            <TextInput
              style={styles.input}
              value={opcNominee?.name || ''}
              onChangeText={(val) => setOpcNominee({ ...(opcNominee || { pan: '', aadhaar: '', email: '', phone: '', relationship: 'Family' }), name: val })}
              placeholder="Nominee Full Name"
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Nominee PAN *</Text>
              <TextInput
                style={styles.input}
                value={opcNominee?.pan || ''}
                onChangeText={(val) => setOpcNominee({ ...(opcNominee || { name: '', aadhaar: '', email: '', phone: '', relationship: 'Family' }), pan: val })}
                placeholder="PAN Number"
                autoCapitalize="characters"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={[styles.fieldGroup, styles.halfField]}>
              <Text style={styles.label}>Relationship *</Text>
              <TextInput
                style={styles.input}
                value={opcNominee?.relationship || ''}
                onChangeText={(val) => setOpcNominee({ ...(opcNominee || { name: '', pan: '', aadhaar: '', email: '', phone: '' }), relationship: val })}
                placeholder="e.g. Spouse / Brother"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
