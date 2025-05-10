import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../config/theme';

const OffersScreen = ({ navigation }: any) => {
  // Mock data for offers
  const offers = [
    { 
      id: '1', 
      title: 'Happy Hour Special', 
      description: '50% off all drinks from 4-6pm',
      expirationDate: '2023-06-01',
      active: true
    },
    { 
      id: '2', 
      title: 'Weekend Brunch Deal', 
      description: 'Free mimosa with any brunch entree',
      expirationDate: '2023-06-15',
      active: true
    },
    { 
      id: '3', 
      title: 'Summer Promotion', 
      description: '20% off all seafood dishes',
      expirationDate: '2023-05-01',
      active: false
    },
  ];

  const renderOfferItem = ({ item }: any) => (
    <TouchableOpacity 
      style={[styles.offerItem, !item.active && styles.inactiveOffer]}
      onPress={() => navigation.navigate('CreateOffer', { offerId: item.id })}
    >
      <View style={styles.offerContent}>
        <Text style={styles.offerTitle}>{item.title}</Text>
        <Text style={styles.offerDescription}>{item.description}</Text>
        <Text style={styles.offerExpiration}>
          {item.active 
            ? `Expires: ${item.expirationDate}` 
            : `Expired: ${item.expirationDate}`
          }
        </Text>
        <View style={[
          styles.statusBadge,
          item.active ? styles.activeBadge : styles.inactiveBadge
        ]}>
          <Text style={[
            styles.statusText,
            item.active ? styles.activeText : styles.inactiveText
          ]}>
            {item.active ? 'Active' : 'Expired'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Offers</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateOffer')}
        >
          <Text style={styles.addButtonText}>+ New Offer</Text>
        </TouchableOpacity>
      </View>

      {offers.length > 0 ? (
        <FlatList
          data={offers}
          renderItem={renderOfferItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You don't have any offers yet.</Text>
          <Text style={styles.emptySubtext}>
            Create your first offer by clicking the "New Offer" button above.
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
  offerItem: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.small,
    marginBottom: SIZES.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inactiveOffer: {
    opacity: 0.7,
  },
  offerContent: {
    padding: SIZES.medium,
  },
  offerTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.small,
  },
  offerDescription: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: SIZES.small,
  },
  offerExpiration: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: SIZES.small,
    fontStyle: 'italic',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  activeBadge: {
    backgroundColor: COLORS.status.success + '20', // 20% opacity
    borderWidth: 1,
    borderColor: COLORS.status.success,
  },
  inactiveBadge: {
    backgroundColor: COLORS.status.error + '20', // 20% opacity
    borderWidth: 1,
    borderColor: COLORS.status.error,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeText: {
    color: COLORS.status.success,
  },
  inactiveText: {
    color: COLORS.status.error,
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

export default OffersScreen;