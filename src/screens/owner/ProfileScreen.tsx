import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImage}>
          <Text style={styles.profileInitial}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'R'}
          </Text>
        </View>
        <Text style={styles.profileName}>{user?.name || 'Restaurant Owner'}</Text>
        <Text style={styles.profileEmail}>{user?.email || 'owner@example.com'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Restaurant Information</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Restaurant Name</Text>
          <Text style={styles.infoValue}>Sample Restaurant</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Address</Text>
          <Text style={styles.infoValue}>123 Main St, City, Country</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>+1 (555) 123-4567</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Website</Text>
          <Text style={styles.infoValue}>www.samplerestaurant.com</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Information</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Notification Preferences</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Connected Services</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
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
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    paddingBottom: SIZES.small,
  },
  infoItem: {
    marginBottom: SIZES.medium,
  },
  infoLabel: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
  },
  editButton: {
    backgroundColor: COLORS.accent,
    padding: SIZES.small,
    borderRadius: SIZES.small,
    alignItems: 'center',
    marginTop: SIZES.small,
  },
  editButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  settingItem: {
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  settingText: {
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
  },
  logoutButton: {
    backgroundColor: COLORS.status.error,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    marginVertical: SIZES.large,
  },
  logoutButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
});

export default ProfileScreen;