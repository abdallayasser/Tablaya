import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../config/theme';
import AllergenTag from './AllergenTag';
import { AllergenType } from '../types';

interface MenuItemProps {
  name: string;
  description?: string;
  price: number;
  allergens?: AllergenType[];
  image?: string;
  onPress?: () => void;
  isAvailable?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  name,
  description,
  price,
  allergens = [],
  image,
  onPress,
  isAvailable = true,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        !isAvailable && styles.unavailable,
      ]}
      onPress={onPress}
      disabled={!onPress || !isAvailable}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{name}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
          <Text style={styles.price}>${price.toFixed(2)}</Text>
          
          {allergens.length > 0 && (
            <View style={styles.allergensContainer}>
              {allergens.map((allergen, index) => (
                <AllergenTag
                  key={`${allergen}-${index}`}
                  allergen={allergen}
                  size="small"
                />
              ))}
            </View>
          )}
          
          {!isAvailable && (
            <View style={styles.unavailableTag}>
              <Text style={styles.unavailableText}>Unavailable</Text>
            </View>
          )}
        </View>
        
        {image && (
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    ...SHADOWS.small,
  },
  content: {
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
    marginRight: image ? SIZES.medium : 0,
  },
  name: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SIZES.base,
  },
  description: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: SIZES.small,
  },
  price: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    color: COLORS.accent,
    marginBottom: SIZES.small,
  },
  allergensContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SIZES.small,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: SIZES.base,
  },
  unavailable: {
    opacity: 0.6,
  },
  unavailableTag: {
    backgroundColor: COLORS.status.error,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: SIZES.base,
    alignSelf: 'flex-start',
    marginTop: SIZES.small,
  },
  unavailableText: {
    color: COLORS.primary,
    fontSize: SIZES.small,
    fontWeight: '600',
  },
});

export default MenuItem;