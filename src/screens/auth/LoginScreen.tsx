import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { loginUser, getUserProfile } from '../../services/authService';
import { setUser, setLoading, setError } from '../../store/slices/authSlice';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      dispatch(setLoading(true));
      
      // Login with Firebase
      const userCredential = await loginUser(email, password);
      
      // Get user profile from Firestore
      const userProfile = await getUserProfile(userCredential.user.uid);
      
      // Set user in Redux store
      dispatch(setUser(userProfile));
      
      setIsLoading(false);
      dispatch(setLoading(false));
      
      // Navigate based on user role
      if (userProfile?.role === 'owner') {
        navigation.replace('OwnerTabs');
      } else {
        navigation.replace('CustomerTabs');
      }
    } catch (error: any) {
      setIsLoading(false);
      dispatch(setLoading(false));
      
      let errorMessage = 'Failed to login. Please try again.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      
      Alert.alert('Login Error', errorMessage);
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
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Tablaya</Text>
            <Text style={styles.tagline}>Connect with restaurants, discover menus</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.title}>Login</Text>
            
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
            
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            
            <Button
              title="Login"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.loginButton}
            />
            
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.signupLink}>Sign Up</Text>
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
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xxlarge,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: SIZES.medium,
  },
  appName: {
    fontSize: SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginBottom: SIZES.small,
  },
  tagline: {
    fontSize: SIZES.medium,
    color: COLORS.text.secondary,
    textAlign: 'center',
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: SIZES.large,
  },
  forgotPasswordText: {
    color: COLORS.accent,
    fontSize: SIZES.font,
  },
  loginButton: {
    marginTop: SIZES.medium,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.large,
  },
  signupText: {
    color: COLORS.text.secondary,
    fontSize: SIZES.font,
  },
  signupLink: {
    color: COLORS.accent,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  showHideText: {
    color: COLORS.accent,
    fontSize: SIZES.font,
  },
});

export default LoginScreen;