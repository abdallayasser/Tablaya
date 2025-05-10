import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  KeyboardTypeOptions,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../config/theme';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  editable?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onIconPress?: () => void;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  editable = true,
  style,
  inputStyle,
  labelStyle,
  icon,
  iconPosition = 'right',
  onIconPress,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          error && styles.errorInput,
          !editable && styles.disabledInput,
        ]}
      >
        {icon && iconPosition === 'left' && (
          <TouchableOpacity
            onPress={onIconPress}
            disabled={!onIconPress}
            style={styles.iconLeft}
          >
            {icon}
          </TouchableOpacity>
        )}
        
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            inputStyle,
            icon && iconPosition === 'left' && styles.inputWithLeftIcon,
            icon && iconPosition === 'right' && styles.inputWithRightIcon,
          ]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text.light}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {icon && iconPosition === 'right' && (
          <TouchableOpacity
            onPress={onIconPress}
            disabled={!onIconPress}
            style={styles.iconRight}
          >
            {icon}
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.medium,
  },
  label: {
    fontSize: SIZES.font,
    color: COLORS.text.primary,
    marginBottom: SIZES.base,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.secondary,
    borderRadius: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    ...SHADOWS.small,
  },
  input: {
    flex: 1,
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.medium,
    color: COLORS.text.primary,
    fontSize: SIZES.font,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  focusedInput: {
    borderColor: COLORS.accent,
  },
  errorInput: {
    borderColor: COLORS.status.error,
  },
  disabledInput: {
    backgroundColor: COLORS.secondary,
    opacity: 0.7,
  },
  errorText: {
    color: COLORS.status.error,
    fontSize: SIZES.small,
    marginTop: SIZES.base,
  },
  iconLeft: {
    paddingLeft: SIZES.medium,
  },
  iconRight: {
    paddingRight: SIZES.medium,
  },
  inputWithLeftIcon: {
    paddingLeft: SIZES.small,
  },
  inputWithRightIcon: {
    paddingRight: SIZES.small,
  },
});

export default Input;