import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../config/theme';

const RestaurantDetailsScreen = ({ navigation, route }: any) => {
  // In a real app, we would get the restaurant details from the route params
  // const { restaurantId } = route.params;
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.restaurantName}>Restaurant Name</Text>
          <Text style={styles.restaurantType}>Restaurant Type • $$$</Text>
          <Text style={styles.restaurantAddress}>123 Main St, City, Country</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionContent}>
            This is a placeholder for the restaurant description. In the actual app, this would contain
            information about the restaurant, its history, specialties, and more.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menus</Text>
          <Text style={styles.comingSoon}>Coming soon...</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.viewMenuButton}
          onPress={() => navigation.navigate('MenuDetails')}
        >
          <Text style={styles.viewMenuButtonText}>View Menu</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    padding: SIZES.large,
  },
  header: {
    marginBottom: SIZES.xlarge,
  },
  restaurantName: {
    fontSize: SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.small,
  },
  restaurantType: {
    fontSize: SIZES.medium,
    color: COLORS.text.secondary,
    marginBottom: SIZES.small,
  },
  restaurantAddress: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
  },
  section: {
    marginBottom: SIZES.large,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.medium,
  },
  sectionContent: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    lineHeight: 22,
  },
  comingSoon: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
  },
  viewMenuButton: {
    backgroundColor: COLORS.accent,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    marginTop: SIZES.large,
  },
  viewMenuButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
});

export default RestaurantDetailsScreen;