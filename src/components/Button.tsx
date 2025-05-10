import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../config/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}) => {
  // Determine button styles based on variant and size
  const getButtonStyles = (): ViewStyle => {
    let buttonStyle: ViewStyle = {};
    
    // Variant styles
    switch (variant) {
      case 'primary':
        buttonStyle = {
          backgroundColor: COLORS.accent,
          ...SHADOWS.small,
        };
        break;
      case 'secondary':
        buttonStyle = {
          backgroundColor: COLORS.secondary,
          ...SHADOWS.small,
        };
        break;
      case 'outline':
        buttonStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: COLORS.accent,
        };
        break;
      case 'text':
        buttonStyle = {
          backgroundColor: 'transparent',
        };
        break;
    }
    
    // Size styles
    switch (size) {
      case 'small':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: SIZES.small,
          paddingHorizontal: SIZES.medium,
          borderRadius: SIZES.base,
        };
        break;
      case 'medium':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: SIZES.medium,
          paddingHorizontal: SIZES.large,
          borderRadius: SIZES.small,
        };
        break;
      case 'large':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: SIZES.large,
          paddingHorizontal: SIZES.xlarge,
          borderRadius: SIZES.medium,
        };
        break;
    }
    
    // Disabled style
    if (disabled) {
      buttonStyle = {
        ...buttonStyle,
        opacity: 0.5,
      };
    }
    
    return buttonStyle;
  };
  
  // Determine text styles based on variant
  const getTextStyles = (): TextStyle => {
    let textStyleObj: TextStyle = {
      fontSize: size === 'small' ? SIZES.font : size === 'medium' ? SIZES.medium : SIZES.large,
      fontWeight: '600',
    };
    
    switch (variant) {
      case 'primary':
        textStyleObj = {
          ...textStyleObj,
          color: COLORS.primary,
        };
        break;
      case 'secondary':
        textStyleObj = {
          ...textStyleObj,
          color: COLORS.text.primary,
        };
        break;
      case 'outline':
      case 'text':
        textStyleObj = {
          ...textStyleObj,
          color: COLORS.accent,
        };
        break;
    }
    
    return textStyleObj;
  };
  
  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? COLORS.primary : COLORS.accent}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={[styles.text, getTextStyles(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.small,
  },
  text: {
    textAlign: 'center',
    marginHorizontal: SIZES.base,
  },
});

export default Button;