import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../../config/theme';

const MenuDetailsScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.menuTitle}>Restaurant Menu</Text>
        
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Appetizers</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemHeader}>
              <Text style={styles.menuItemName}>Appetizer 1</Text>
              <Text style={styles.menuItemPrice}>$10.99</Text>
            </View>
            <Text style={styles.menuItemDescription}>
              Description of the appetizer with ingredients and preparation method.
            </Text>
            <View style={styles.allergenContainer}>
              <View style={styles.allergenTag}>
                <Text style={styles.allergenText}>Gluten</Text>
              </View>
              <View style={styles.allergenTag}>
                <Text style={styles.allergenText}>Dairy</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemHeader}>
              <Text style={styles.menuItemName}>Appetizer 2</Text>
              <Text style={styles.menuItemPrice}>$12.99</Text>
            </View>
            <Text style={styles.menuItemDescription}>
              Description of another appetizer with ingredients and preparation method.
            </Text>
            <View style={styles.allergenContainer}>
              <View style={styles.allergenTag}>
                <Text style={styles.allergenText}>Nuts</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Main Courses</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemHeader}>
              <Text style={styles.menuItemName}>Main Course 1</Text>
              <Text style={styles.menuItemPrice}>$18.99</Text>
            </View>
            <Text style={styles.menuItemDescription}>
              Description of the main course with ingredients and preparation method.
            </Text>
            <View style={styles.allergenContainer}>
              <View style={styles.allergenTag}>
                <Text style={styles.allergenText}>Shellfish</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemHeader}>
              <Text style={styles.menuItemName}>Main Course 2</Text>
              <Text style={styles.menuItemPrice}>$22.99</Text>
            </View>
            <Text style={styles.menuItemDescription}>
              Description of another main course with ingredients and preparation method.
            </Text>
            <View style={styles.allergenContainer}>
              <View style={styles.allergenTag}>
                <Text style={styles.allergenText}>Gluten</Text>
              </View>
              <View style={styles.allergenTag}>
                <Text style={styles.allergenText}>Soy</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Desserts</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemHeader}>
              <Text style={styles.menuItemName}>Dessert 1</Text>
              <Text style={styles.menuItemPrice}>$8.99</Text>
            </View>
            <Text style={styles.menuItemDescription}>
              Description of the dessert with ingredients and preparation method.
            </Text>
            <View style={styles.allergenContainer}>
              <View style={styles.allergenTag}>
                <Text style={styles.allergenText}>Dairy</Text>
              </View>
              <View style={styles.allergenTag}>
                <Text style={styles.allergenText}>Eggs</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemHeader}>
              <Text style={styles.menuItemName}>Dessert 2</Text>
              <Text style={styles.menuItemPrice}>$9.99</Text>
            </View>
            <Text style={styles.menuItemDescription}>
              Description of another dessert with ingredients and preparation method.
            </Text>
            <View style={styles.allergenContainer}>
              <View style={styles.allergenTag}>
                <Text style={styles.allergenText}>Nuts</Text>
              </View>
            </View>
          </View>
        </View>
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
  menuTitle: {
    fontSize: SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.xlarge,
  },
  menuSection: {
    marginBottom: SIZES.xlarge,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    paddingBottom: SIZES.small,
  },
  menuItem: {
    marginBottom: SIZES.large,
    padding: SIZES.medium,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.small,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.small,
  },
  menuItemName: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  menuItemPrice: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  menuItemDescription: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: SIZES.medium,
  },
  allergenContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  allergenTag: {
    backgroundColor: COLORS.status.warning + '30', // 30% opacity
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: COLORS.status.warning,
  },
  allergenText: {
    fontSize: 12,
    color: COLORS.status.warning,
    fontWeight: '500',
  },
});

export default MenuDetailsScreen;