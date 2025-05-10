import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import { RootState } from '../../store';
import { Restaurant, Menu } from '../../types';
import { getRestaurantsByOwnerId } from '../../services/restaurantService';
import { getMenusByRestaurantId } from '../../services/menuService';
import Card from '../../components/Card';
import Button from '../../components/Button';

const DashboardScreen = ({ navigation }: any) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [recentMenus, setRecentMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMenuViews: 0,
    totalOffers: 0,
    activeOffers: 0,
  });

  useEffect(() => {
    if (user?.id) {
      fetchOwnerData();
    }
  }, [user]);

  const fetchOwnerData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Get owner's restaurants
      const ownerRestaurants = await getRestaurantsByOwnerId(user.id);
      setRestaurants(ownerRestaurants);
      
      // If owner has restaurants, get recent menus
      if (ownerRestaurants.length > 0) {
        const allMenusPromises = ownerRestaurants.map(restaurant => 
          getMenusByRestaurantId(restaurant.id)
        );
        
        const allMenusArrays = await Promise.all(allMenusPromises);
        const allMenus = allMenusArrays.flat();
        
        // Sort by upload date (newest first) and take the first 5
        const sortedMenus = allMenus.sort((a, b) => {
          const dateA = a.uploadDate?.toDate?.() || new Date(0);
          const dateB = b.uploadDate?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        }).slice(0, 5);
        
        setRecentMenus(sortedMenus);
        
        // Calculate stats (in a real app, this would come from analytics)
        setStats({
          totalMenuViews: allMenus.reduce((sum, menu) => sum + (menu.views || 0), 0),
          totalOffers: Math.floor(Math.random() * 10), // Simulated
          activeOffers: Math.floor(Math.random() * 5), // Simulated
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching owner data:', error);
      setLoading(false);
    }
  };

  const handleAddRestaurant = () => {
    // Navigate to add restaurant screen
    // This would be implemented in a real app
    alert('Add restaurant functionality would be implemented here');
  };

  const handleUploadMenu = () => {
    navigation.navigate('MenuUpload', {
      restaurantId: restaurants[0]?.id, // Default to first restaurant
    });
  };

  const handleCreateOffer = () => {
    navigation.navigate('CreateOffer', {
      restaurantId: restaurants[0]?.id, // Default to first restaurant
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.displayName?.split(' ')[0] || 'there'}!</Text>
          <Text style={styles.subGreeting}>Welcome to your dashboard</Text>
        </View>
        
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>
      
      {restaurants.length === 0 ? (
        <Card style={styles.noRestaurantCard}>
          <Text style={styles.noRestaurantTitle}>No Restaurants Yet</Text>
          <Text style={styles.noRestaurantText}>
            You haven't added any restaurants yet. Add your first restaurant to get started.
          </Text>
          <Button
            title="Add Restaurant"
            onPress={handleAddRestaurant}
            style={styles.addButton}
          />
        </Card>
      ) : (
        <>
          <View style={styles.statsContainer}>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalMenuViews}</Text>
              <Text style={styles.statLabel}>Menu Views</Text>
            </Card>
            
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalOffers}</Text>
              <Text style={styles.statLabel}>Total Offers</Text>
            </Card>
            
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{stats.activeOffers}</Text>
              <Text style={styles.statLabel}>Active Offers</Text>
            </Card>
          </View>
          
          <View style={styles.actionsContainer}>
            <Button
              title="Upload Menu"
              onPress={handleUploadMenu}
              style={styles.actionButton}
            />
            
            <Button
              title="Create Offer"
              onPress={handleCreateOffer}
              style={styles.actionButton}
              variant="secondary"
            />
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Restaurants</Text>
              <TouchableOpacity onPress={handleAddRestaurant}>
                <Text style={styles.addText}>+ Add New</Text>
              </TouchableOpacity>
            </View>
            
            {restaurants.map(restaurant => (
              <Card key={restaurant.id} style={styles.restaurantCard}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
                <Text style={styles.restaurantAddress}>
                  {restaurant.location.address.street}, {restaurant.location.address.city}
                </Text>
                
                <View style={styles.restaurantStats}>
                  <View style={styles.restaurantStat}>
                    <Text style={styles.restaurantStatValue}>
                      {restaurant.menus?.length || 0}
                    </Text>
                    <Text style={styles.restaurantStatLabel}>Menus</Text>
                  </View>
                  
                  <View style={styles.restaurantStat}>
                    <Text style={styles.restaurantStatValue}>
                      {restaurant.offers?.length || 0}
                    </Text>
                    <Text style={styles.restaurantStatLabel}>Offers</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Menus</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Menus')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {recentMenus.length > 0 ? (
              recentMenus.map(menu => (
                <Card key={menu.id} style={styles.menuCard}>
                  <Text style={styles.menuName}>{menu.name}</Text>
                  <Text style={styles.menuRestaurant}>
                    {restaurants.find(r => r.id === menu.restaurantId)?.name || 'Unknown Restaurant'}
                  </Text>
                  <Text style={styles.menuDate}>
                    Uploaded: {menu.uploadDate?.toDate?.().toLocaleDateString() || 'Unknown date'}
                  </Text>
                  <Text style={styles.menuViews}>Views: {menu.views || 0}</Text>
                </Card>
              ))
            ) : (
              <Text style={styles.emptyText}>No menus uploaded yet</Text>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  contentContainer: {
    padding: SIZES.large,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  greeting: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  subGreeting: {
    fontSize: SIZES.medium,
    color: COLORS.text.secondary,
    marginTop: SIZES.small,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  notificationIcon: {
    fontSize: SIZES.large,
  },
  noRestaurantCard: {
    alignItems: 'center',
    padding: SIZES.xlarge,
  },
  noRestaurantTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.medium,
  },
  noRestaurantText: {
    fontSize: SIZES.medium,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SIZES.large,
  },
  addButton: {
    minWidth: 200,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.large,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: SIZES.medium,
    marginHorizontal: SIZES.small / 2,
  },
  statValue: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginBottom: SIZES.small,
  },
  statLabel: {
    fontSize: SIZES.small,
    color: COLORS.text.secondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.large,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: SIZES.small / 2,
  },
  section: {
    marginBottom: SIZES.xlarge,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  addText: {
    fontSize: SIZES.font,
    color: COLORS.accent,
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: SIZES.font,
    color: COLORS.accent,
  },
  restaurantCard: {
    marginBottom: SIZES.medium,
  },
  restaurantName: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SIZES.small,
  },
  restaurantCuisine: {
    fontSize: SIZES.font,
    color: COLORS.accent,
    marginBottom: SIZES.small,
  },
  restaurantAddress: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: SIZES.medium,
  },
  restaurantStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary,
    paddingTop: SIZES.medium,
  },
  restaurantStat: {
    flex: 1,
    alignItems: 'center',
  },
  restaurantStatValue: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  restaurantStatLabel: {
    fontSize: SIZES.small,
    color: COLORS.text.secondary,
  },
  menuCard: {
    marginBottom: SIZES.medium,
  },
  menuName: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SIZES.small,
  },
  menuRestaurant: {
    fontSize: SIZES.font,
    color: COLORS.accent,
    marginBottom: SIZES.small,
  },
  menuDate: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: SIZES.small,
  },
  menuViews: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
  },
  emptyText: {
    fontSize: SIZES.medium,
    color: COLORS.text.light,
    padding: SIZES.medium,
    textAlign: 'center',
  },
});

export default DashboardScreen;