import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, SIZES } from '../../config/theme';
import { logout } from '../../store/slices/authSlice';
import { signOut } from '../../services/authService';
import { RootState } from '../../store';

const ProfileScreen = ({ navigation }: any) => {
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
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={styles.profileName}>{user?.name || 'User'}</Text>
        <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
        
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dietary Preferences</Text>
        {user?.dietaryPreferences && user.dietaryPreferences.length > 0 ? (
          <View style={styles.preferencesContainer}>
            {user.dietaryPreferences.map((preference: string) => (
              <View key={preference} style={styles.preferenceTag}>
                <Text style={styles.preferenceText}>
                  {preference.charAt(0).toUpperCase() + preference.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No dietary preferences set</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Allergen Restrictions</Text>
        {user?.allergens && user.allergens.length > 0 ? (
          <View style={styles.preferencesContainer}>
            {user.allergens.map((allergen: string) => (
              <View key={allergen} style={styles.allergenTag}>
                <Text style={styles.allergenText}>
                  {allergen.charAt(0).toUpperCase() + allergen.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No allergen restrictions set</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favorite Restaurants</Text>
        <Text style={styles.emptyText}>You haven't saved any favorites yet</Text>
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
    marginBottom: SIZES.medium,
  },
  editProfileButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    borderRadius: SIZES.small,
  },
  editProfileButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.font,
    fontWeight: '600',
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
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  preferenceTag: {
    backgroundColor: COLORS.accent + '20', // 20% opacity
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  preferenceText: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '500',
  },
  allergenTag: {
    backgroundColor: COLORS.status.warning + '20', // 20% opacity
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: COLORS.status.warning,
  },
  allergenText: {
    fontSize: 12,
    color: COLORS.status.warning,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
  },
  logoutButton: {
    backgroundColor: COLORS.status.error,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    marginTop: SIZES.large,
    marginBottom: SIZES.xxlarge,
  },
  logoutButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
});

export default ProfileScreen;