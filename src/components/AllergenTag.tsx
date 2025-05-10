import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../config/theme';
import { AllergenType } from '../types';

interface AllergenTagProps {
  allergen: AllergenType;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const AllergenTag: React.FC<AllergenTagProps> = ({
  allergen,
  onPress,
  size = 'medium',
  showLabel = true,
}) => {
  // Get allergen color
  const getAllergenColor = (): string => {
    switch (allergen) {
      case 'dairy':
        return COLORS.allergens.dairy;
      case 'nuts':
        return COLORS.allergens.nuts;
      case 'gluten':
        return COLORS.allergens.gluten;
      case 'seafood':
        return COLORS.allergens.seafood;
      case 'soy':
        return COLORS.allergens.soy;
      default:
        return COLORS.status.warning;
    }
  };

  // Get allergen label
  const getAllergenLabel = (): string => {
    switch (allergen) {
      case 'dairy':
        return 'Dairy';
      case 'nuts':
        return 'Nuts';
      case 'gluten':
        return 'Gluten';
      case 'seafood':
        return 'Seafood';
      case 'soy':
        return 'Soy';
      case 'eggs':
        return 'Eggs';
      case 'wheat':
        return 'Wheat';
      case 'peanuts':
        return 'Peanuts';
      default:
        return 'Allergen';
    }
  };

  // Get size-based styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: {
            paddingVertical: 2,
            paddingHorizontal: 6,
            borderRadius: 4,
          },
          text: {
            fontSize: 10,
          },
        };
      case 'large':
        return {
          container: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
          },
          text: {
            fontSize: 16,
          },
        };
      default:
        return {
          container: {
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 6,
          },
          text: {
            fontSize: 12,
          },
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const TagComponent = onPress ? TouchableOpacity : View;

  return (
    <TagComponent
      style={[
        styles.container,
        sizeStyles.container,
        { backgroundColor: getAllergenColor() },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {showLabel && (
        <Text style={[styles.text, sizeStyles.text]}>{getAllergenLabel()}</Text>
      )}
    </TagComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: SIZES.small,
    marginBottom: SIZES.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default AllergenTag;