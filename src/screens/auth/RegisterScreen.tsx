import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { registerUser, getUserProfile } from '../../services/authService';
import { setUser, setLoading, setError } from '../../store/slices/authSlice';
import { UserRole } from '../../types';

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  
  const handleRegister = async () => {
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    
    try {
      setIsLoading(true);
      dispatch(setLoading(true));
      
      // Register with Firebase
      const userCredential = await registerUser(email, password, role, name);
      
      // Get user profile from Firestore
      const userProfile = await getUserProfile(userCredential.user.uid);
      
      // Set user in Redux store
      dispatch(setUser(userProfile));
      
      setIsLoading(false);
      dispatch(setLoading(false));
      
      // Navigate based on user role
      if (role === 'owner') {
        navigation.replace('OwnerTabs');
      } else {
        navigation.replace('CustomerTabs');
      }
    } catch (error: any) {
      setIsLoading(false);
      dispatch(setLoading(false));
      
      let errorMessage = 'Failed to register. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      }
      
      Alert.alert('Registration Error', errorMessage);
      dispatch(setError(errorMessage));
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Tablaya</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Account</Text>
            
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              icon={
                <Text style={styles.showHideText}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              }
              iconPosition="right"
              onIconPress={toggleShowPassword}
            />
            
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
            
            <Text style={styles.roleLabel}>I am a:</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'customer' && styles.roleButtonActive,
                ]}
                onPress={() => setRole('customer')}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === 'customer' && styles.roleTextActive,
                  ]}
                >
                  Customer
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'owner' && styles.roleButtonActive,
                ]}
                onPress={() => setRole('owner')}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === 'owner' && styles.roleTextActive,
                  ]}
                >
                  Restaurant Owner
                </Text>
              </TouchableOpacity>
            </View>
            
            <Button
              title="Register"
              onPress={handleRegister}
              loading={isLoading}
              style={styles.registerButton}
            />
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: SIZES.large,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: SIZES.large,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: SIZES.small,
  },
  appName: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.accent,
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
    marginBottom: SIZES.large,
  },
  roleLabel: {
    fontSize: SIZES.font,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: SIZES.small,
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.large,
  },
  roleButton: {
    flex: 1,
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  roleText: {
    color: COLORS.text.primary,
    fontSize: SIZES.font,
  },
  roleTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  registerButton: {
    marginTop: SIZES.medium,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.large,
  },
  loginText: {
    color: COLORS.text.secondary,
    fontSize: SIZES.font,
  },
  loginLink: {
    color: COLORS.accent,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  showHideText: {
    color: COLORS.accent,
    fontSize: SIZES.font,
  },
});

export default RegisterScreen;