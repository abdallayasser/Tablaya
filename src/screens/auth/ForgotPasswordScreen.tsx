import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { resetPassword } from '../../services/authService';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Send password reset email
      await resetPassword(email);
      
      setIsLoading(false);
      setIsEmailSent(true);
    } catch (error: any) {
      setIsLoading(false);
      
      let errorMessage = 'Failed to send reset email. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      
      Alert.alert('Error', errorMessage);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Reset Password</Text>
          
          {isEmailSent ? (
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>Email Sent!</Text>
              <Text style={styles.successMessage}>
                We've sent a password reset link to {email}. Please check your email and follow the instructions to reset your password.
              </Text>
              <Button
                title="Back to Login"
                onPress={() => navigation.navigate('Login')}
                style={styles.backToLoginButton}
              />
            </View>
          ) : (
            <>
              <Text style={styles.instructions}>
                Enter your email address and we'll send you a link to reset your password.
              </Text>
              
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <Button
                title="Send Reset Link"
                onPress={handleResetPassword}
                loading={isLoading}
                style={styles.resetButton}
              />
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: SIZES.large,
  },
  backButton: {
    marginTop: SIZES.large,
    marginBottom: SIZES.medium,
  },
  backButtonText: {
    color: COLORS.accent,
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: SIZES.xlarge,
  },
  logo: {
    width: 80,
    height: 80,
  },
  formContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    padding: SIZES.large,
    ...SHADOWS.medium,
  },
  title: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.medium,
  },
  instructions: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: SIZES.large,
  },
  resetButton: {
    marginTop: SIZES.medium,
  },
  successContainer: {
    alignItems: 'center',
    padding: SIZES.medium,
  },
  successTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.status.success,
    marginBottom: SIZES.medium,
  },
  successMessage: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SIZES.large,
  },
  backToLoginButton: {
    marginTop: SIZES.medium,
  },
});

export default ForgotPasswordScreen;