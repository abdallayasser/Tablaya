import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import { RootState } from '../../store';
import { Restaurant } from '../../types';
import { getAllRestaurants, getNearbyRestaurants } from '../../services/restaurantService';
import Card from '../../components/Card';

const HomeScreen = ({ navigation }: any) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
  const [popularRestaurants, setPopularRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      
      // In a real app, we would get the user's location
      // For now, we'll use a default location (New York City)
      const latitude = 40.7128;
      const longitude = -74.0060;
      
      // Get nearby restaurants
      const nearby = await getNearbyRestaurants(latitude, longitude, 10);
      setNearbyRestaurants(nearby.slice(0, 5));
      
      // Get all restaurants and sort by popularity (simulated)
      const all = await getAllRestaurants();
      const popular = [...all].sort(() => 0.5 - Math.random()).slice(0, 5);
      setPopularRestaurants(popular);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setLoading(false);
    }
  };

  const handleRestaurantPress = (restaurantId: string) => {
    navigation.navigate('RestaurantDetails', { restaurantId });
  };

  const renderRestaurantCard = (restaurant: Restaurant) => (
    <Card
      key={restaurant.id}
      style={styles.restaurantCard}
      onPress={() => handleRestaurantPress(restaurant.id)}
    >
      {restaurant.profileImage ? (
        <Image
          source={{ uri: restaurant.profileImage }}
          style={styles.restaurantImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.restaurantImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>{restaurant.name.charAt(0)}</Text>
        </View>
      )}
      
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
        <Text style={styles.restaurantAddress}>
          {restaurant.location.address.street}, {restaurant.location.address.city}
        </Text>
      </View>
    </Card>
  );

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
          <Text style={styles.subGreeting}>What would you like to eat today?</Text>
        </View>
        
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Restaurants</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {nearbyRestaurants.length > 0 ? (
            nearbyRestaurants.map(renderRestaurantCard)
          ) : (
            <Text style={styles.emptyText}>No nearby restaurants found</Text>
          )}
        </ScrollView>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Restaurants</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {popularRestaurants.length > 0 ? (
            popularRestaurants.map(renderRestaurantCard)
          ) : (
            <Text style={styles.emptyText}>No popular restaurants found</Text>
          )}
        </ScrollView>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Favorites</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.favoritePrompt}
          onPress={() => navigation.navigate('Explore')}
        >
          <Text style={styles.favoritePromptText}>
            You don't have any favorite restaurants yet.
          </Text>
          <Text style={styles.favoritePromptAction}>
            Explore restaurants and add them to your favorites!
          </Text>
        </TouchableOpacity>
      </View>
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
  seeAllText: {
    fontSize: SIZES.font,
    color: COLORS.accent,
  },
  horizontalScrollContent: {
    paddingRight: SIZES.large,
  },
  restaurantCard: {
    width: 250,
    marginRight: SIZES.medium,
    padding: 0,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: SIZES.small,
    borderTopRightRadius: SIZES.small,
  },
  placeholderImage: {
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.text.light,
  },
  restaurantInfo: {
    padding: SIZES.medium,
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
  },
  emptyText: {
    fontSize: SIZES.medium,
    color: COLORS.text.light,
    padding: SIZES.large,
  },
  favoritePrompt: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: SIZES.small,
    padding: SIZES.large,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  favoritePromptText: {
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SIZES.small,
  },
  favoritePromptAction: {
    fontSize: SIZES.font,
    color: COLORS.accent,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default HomeScreen;