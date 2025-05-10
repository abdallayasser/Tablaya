import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../config/theme';

const MenusScreen = ({ navigation }: any) => {
  // Mock data for menus
  const menus = [
    { id: '1', name: 'Lunch Menu', lastUpdated: '2023-05-01', status: 'published' },
    { id: '2', name: 'Dinner Menu', lastUpdated: '2023-05-02', status: 'published' },
    { id: '3', name: 'Brunch Menu', lastUpdated: '2023-05-03', status: 'draft' },
  ];

  const renderMenuItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.menuItem}
      onPress={() => navigation.navigate('MenuEditor', { menuId: item.id })}
    >
      <View style={styles.menuItemContent}>
        <Text style={styles.menuName}>{item.name}</Text>
        <Text style={styles.menuDate}>Last updated: {item.lastUpdated}</Text>
        <View style={[
          styles.statusBadge,
          item.status === 'published' ? styles.publishedBadge : styles.draftBadge
        ]}>
          <Text style={[
            styles.statusText,
            item.status === 'published' ? styles.publishedText : styles.draftText
          ]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Menus</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('MenuUpload')}
        >
          <Text style={styles.addButtonText}>+ Add Menu</Text>
        </TouchableOpacity>
      </View>

      {menus.length > 0 ? (
        <FlatList
          data={menus}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You don't have any menus yet.</Text>
          <Text style={styles.emptySubtext}>
            Create your first menu by clicking the "Add Menu" button above.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: SIZES.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  title: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  addButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    borderRadius: SIZES.small,
  },
  addButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: SIZES.large,
  },
  menuItem: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.small,
    marginBottom: SIZES.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemContent: {
    padding: SIZES.medium,
  },
  menuName: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.small,
  },
  menuDate: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: SIZES.small,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  publishedBadge: {
    backgroundColor: COLORS.status.success + '20', // 20% opacity
    borderWidth: 1,
    borderColor: COLORS.status.success,
  },
  draftBadge: {
    backgroundColor: COLORS.status.warning + '20', // 20% opacity
    borderWidth: 1,
    borderColor: COLORS.status.warning,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  publishedText: {
    color: COLORS.status.success,
  },
  draftText: {
    color: COLORS.status.warning,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xlarge,
  },
  emptyText: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SIZES.medium,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});

export default MenusScreen;