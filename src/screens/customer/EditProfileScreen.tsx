import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, SIZES } from '../../config/theme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { RootState } from '../../store';
import { updateUserProfile } from '../../store/slices/authSlice';

const ALLERGENS = [
  { id: 'dairy', name: 'Dairy' },
  { id: 'gluten', name: 'Gluten' },
  { id: 'nuts', name: 'Nuts' },
  { id: 'shellfish', name: 'Shellfish' },
  { id: 'eggs', name: 'Eggs' },
  { id: 'soy', name: 'Soy' },
  { id: 'fish', name: 'Fish' },
  { id: 'wheat', name: 'Wheat' },
];

const DIETARY_PREFERENCES = [
  { id: 'vegetarian', name: 'Vegetarian' },
  { id: 'vegan', name: 'Vegan' },
  { id: 'pescatarian', name: 'Pescatarian' },
  { id: 'keto', name: 'Keto' },
  { id: 'paleo', name: 'Paleo' },
  { id: 'lowCarb', name: 'Low Carb' },
  { id: 'lowFat', name: 'Low Fat' },
  { id: 'lowSodium', name: 'Low Sodium' },
];

const EditProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [allergens, setAllergens] = useState<string[]>(user?.allergens || []);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(user?.dietaryPreferences || []);
  const [isLoading, setIsLoading] = useState(false);

  const toggleAllergen = (allergenId: string) => {
    if (allergens.includes(allergenId)) {
      setAllergens(allergens.filter(id => id !== allergenId));
    } else {
      setAllergens([...allergens, allergenId]);
    }
  };

  const toggleDietaryPreference = (preferenceId: string) => {
    if (dietaryPreferences.includes(preferenceId)) {
      setDietaryPreferences(dietaryPreferences.filter(id => id !== preferenceId));
    } else {
      setDietaryPreferences([...dietaryPreferences, preferenceId]);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      setIsLoading(true);

      // In a real app, we would update the user profile in the database
      // For now, we'll just update the Redux store
      const updatedUser = {
        ...user,
        name,
        phone,
        allergens,
        dietaryPreferences,
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch(updateUserProfile(updatedUser));
      setIsLoading(false);
      
      Alert.alert(
        'Success',
        'Profile updated successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <View style={styles.formContainer}>
        <Input
          label="Name"
          placeholder="Your full name"
          value={name}
          onChangeText={setName}
        />

        <Input
          label="Phone Number"
          placeholder="Your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergen Restrictions</Text>
          <Text style={styles.sectionDescription}>
            Select allergens you want to avoid in your food
          </Text>
          
          <View style={styles.optionsContainer}>
            {ALLERGENS.map(allergen => (
              <TouchableOpacity
                key={allergen.id}
                style={[
                  styles.optionItem,
                  allergens.includes(allergen.id) && styles.selectedOption
                ]}
                onPress={() => toggleAllergen(allergen.id)}
              >
                <Text
                  style={[
                    styles.optionText,
                    allergens.includes(allergen.id) && styles.selectedOptionText
                  ]}
                >
                  {allergen.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dietary Preferences</Text>
          <Text style={styles.sectionDescription}>
            Select your dietary preferences
          </Text>
          
          <View style={styles.optionsContainer}>
            {DIETARY_PREFERENCES.map(preference => (
              <TouchableOpacity
                key={preference.id}
                style={[
                  styles.optionItem,
                  dietaryPreferences.includes(preference.id) && styles.selectedOption
                ]}
                onPress={() => toggleDietaryPreference(preference.id)}
              >
                <Text
                  style={[
                    styles.optionText,
                    dietaryPreferences.includes(preference.id) && styles.selectedOptionText
                  ]}
                >
                  {preference.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Save Profile"
            onPress={handleSaveProfile}
            loading={isLoading}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: SIZES.large,
  },
  header: {
    marginBottom: SIZES.large,
  },
  backButton: {
    marginBottom: SIZES.medium,
  },
  backButtonText: {
    color: COLORS.accent,
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
  title: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  formContainer: {
    marginTop: SIZES.large,
  },
  section: {
    marginTop: SIZES.large,
    marginBottom: SIZES.large,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.small,
  },
  sectionDescription: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: SIZES.medium,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionItem: {
    backgroundColor: COLORS.secondary,
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    borderRadius: SIZES.small,
    marginRight: SIZES.small,
    marginBottom: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  selectedOption: {
    backgroundColor: COLORS.accent + '20', // 20% opacity
    borderColor: COLORS.accent,
  },
  optionText: {
    color: COLORS.text.secondary,
    fontSize: SIZES.font,
  },
  selectedOptionText: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: SIZES.xlarge,
    marginBottom: SIZES.xxlarge,
  },
});

export default EditProfileScreen;