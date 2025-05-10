import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, SIZES } from '../../config/theme';
import { logout } from '../../store/slices/authSlice';
import { signOut } from '../../services/authService';
import { RootState } from '../../store';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      await signOut();
      dispatch(logout());
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImage}>
          <Text style={styles.profileInitial}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={styles.profileName}>{user?.name || 'User'}</Text>
        <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <Text style={styles.comingSoon}>Coming soon...</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: SIZES.large,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: SIZES.xxlarge,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  profileName: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.small,
  },
  profileEmail: {
    fontSize: SIZES.medium,
    color: COLORS.text.secondary,
  },
  section: {
    marginBottom: SIZES.xlarge,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.medium,
  },
  comingSoon: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
  },
  logoutButton: {
    backgroundColor: COLORS.status.error,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    marginTop: 'auto',
  },
  logoutButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
});

export default ProfileScreen;