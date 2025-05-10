import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../config/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  disabled = false,
}) => {
  // Get card styles based on variant
  const getCardStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          ...styles.card,
          ...SHADOWS.medium,
          backgroundColor: COLORS.primary,
        };
      case 'outlined':
        return {
          ...styles.card,
          backgroundColor: COLORS.primary,
          borderWidth: 1,
          borderColor: COLORS.secondary,
        };
      default:
        return {
          ...styles.card,
          ...SHADOWS.small,
          backgroundColor: COLORS.primary,
        };
    }
  };

  // If card is pressable, wrap in TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyles(), style]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  // Otherwise, render as a View
  return <View style={[getCardStyles(), style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginVertical: SIZES.small,
  },
});

export default Card;