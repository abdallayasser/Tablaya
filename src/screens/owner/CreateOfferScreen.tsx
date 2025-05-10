import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SIZES } from '../../config/theme';
import Input from '../../components/Input';
import Button from '../../components/Button';

const CreateOfferScreen = ({ navigation, route }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Check if we're editing an existing offer
  useEffect(() => {
    if (route.params?.offerId) {
      setIsEditing(true);
      // In a real app, we would fetch the offer details from the database
      // For now, we'll just set some mock data
      setTitle('Happy Hour Special');
      setDescription('50% off all drinks from 4-6pm');
      setExpirationDate('2023-06-01');
    }
  }, [route.params]);

  const handleSaveOffer = async () => {
    // Validate inputs
    if (!title || !description || !expirationDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);

      // In a real app, we would save the offer to the database
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsLoading(false);
      
      // Show success message
      Alert.alert(
        'Success',
        isEditing ? 'Offer updated successfully' : 'Offer created successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to save offer. Please try again.');
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
        <Text style={styles.title}>
          {isEditing ? 'Edit Offer' : 'Create New Offer'}
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Input
          label="Offer Title"
          placeholder="e.g., Happy Hour Special"
          value={title}
          onChangeText={setTitle}
        />

        <Input
          label="Description"
          placeholder="Describe your offer"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Input
          label="Expiration Date"
          placeholder="YYYY-MM-DD"
          value={expirationDate}
          onChangeText={setExpirationDate}
          keyboardType="numbers-and-punctuation"
        />

        <View style={styles.buttonContainer}>
          <Button
            title={isEditing ? 'Update Offer' : 'Create Offer'}
            onPress={handleSaveOffer}
            loading={isLoading}
          />
          
          {isEditing && (
            <Button
              title="Delete Offer"
              onPress={() => {
                Alert.alert(
                  'Confirm Delete',
                  'Are you sure you want to delete this offer?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Delete', 
                      style: 'destructive',
                      onPress: () => {
                        // In a real app, we would delete the offer from the database
                        Alert.alert(
                          'Success',
                          'Offer deleted successfully',
                          [{ text: 'OK', onPress: () => navigation.goBack() }]
                        );
                      }
                    }
                  ]
                );
              }}
              style={styles.deleteButton}
              textStyle={styles.deleteButtonText}
            />
          )}
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
  buttonContainer: {
    marginTop: SIZES.xlarge,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.status.error,
    marginTop: SIZES.medium,
  },
  deleteButtonText: {
    color: COLORS.status.error,
  },
});

export default CreateOfferScreen;