import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, SIZES } from '../../config/theme';
import { RootState } from '../../store';

// Mock data for restaurant details
const MOCK_RESTAURANT = {
  id: '1',
  name: 'Pasta Paradise',
  type: 'Italian',
  rating: 4.7,
  priceLevel: '$$',
  distance: '0.8 mi',
  address: '123 Main St, New York, NY 10001',
  phone: '+1 (555) 123-4567',
  website: 'www.pastapardise.com',
  hours: [
    { day: 'Monday', hours: '11:00 AM - 10:00 PM' },
    { day: 'Tuesday', hours: '11:00 AM - 10:00 PM' },
    { day: 'Wednesday', hours: '11:00 AM - 10:00 PM' },
    { day: 'Thursday', hours: '11:00 AM - 10:00 PM' },
    { day: 'Friday', hours: '11:00 AM - 11:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 11:00 PM' },
    { day: 'Sunday', hours: '10:00 AM - 9:00 PM' },
  ],
  image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
  coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
  description: 'Pasta Paradise offers authentic Italian cuisine in a cozy, family-friendly atmosphere. Our pasta is made fresh daily, and we source our ingredients from local farms whenever possible. Join us for a taste of Italy in the heart of the city.',
  tags: ['pasta', 'pizza', 'italian'],
  dietaryOptions: ['vegetarian', 'vegan'],
  allergenFree: ['nuts'],
  menus: [
    { id: '1', name: 'Lunch Menu', description: 'Available weekdays 11am-3pm' },
    { id: '2', name: 'Dinner Menu', description: 'Our full dinner selection' },
    { id: '3', name: 'Weekend Brunch', description: 'Saturday & Sunday 10am-2pm' },
  ],
  offers: [
    { id: '1', title: 'Happy Hour', description: '50% off appetizers from 4-6pm daily' },
    { id: '2', title: 'Family Special', description: 'Free kids meal with purchase of two entrees' },
  ],
  isFavorite: false,
};

const RestaurantDetailsScreen = ({ navigation, route }: any) => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  
  // In a real app, we would fetch the restaurant details from an API
  useEffect(() => {
    const restaurantId = route.params?.restaurantId || '1';
    
    // Simulate API call
    const fetchRestaurant = async () => {
      setIsLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In a real app, we would fetch the restaurant from an API
        // For now, we'll just use the mock data
        setRestaurant(MOCK_RESTAURANT);
        
        // Check if this restaurant is in the user's favorites
        if (user?.favorites && user.favorites.includes(restaurantId)) {
          setIsFavorite(true);
        }
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRestaurant();
  }, [route.params?.restaurantId, user]);
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    
    // In a real app, we would update the user's favorites in the database
    // For now, we'll just update the local state
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }
  
  if (!restaurant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Restaurant not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cover Image */}
        <View style={styles.coverImageContainer}>
          <Image
            source={{ uri: restaurant.coverImage }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.backIconButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIconText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={toggleFavorite}
          >
            <Text style={styles.favoriteButtonText}>
              {isFavorite ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Restaurant Info */}
        <View style={styles.header}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{restaurant.rating}</Text>
            <Text style={styles.ratingStars}>★★★★★</Text>
          </View>
          <Text style={styles.restaurantType}>{restaurant.type} • {restaurant.priceLevel}</Text>
          <Text style={styles.restaurantAddress}>{restaurant.address}</Text>
          
          {/* Dietary and allergen tags */}
          {(restaurant.dietaryOptions.length > 0 || restaurant.allergenFree.length > 0) && (
            <View style={styles.tagsContainer}>
              {restaurant.dietaryOptions.map((option: string) => (
                <View key={option} style={styles.dietaryTag}>
                  <Text style={styles.dietaryTagText}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </View>
              ))}
              
              {restaurant.allergenFree.map((allergen: string) => (
                <View key={allergen} style={styles.allergenTag}>
                  <Text style={styles.allergenTagText}>
                    {allergen.charAt(0).toUpperCase() + allergen.slice(1)}-free
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📞</Text>
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📍</Text>
            <Text style={styles.actionText}>Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>🌐</Text>
            <Text style={styles.actionText}>Website</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📝</Text>
            <Text style={styles.actionText}>Review</Text>
          </TouchableOpacity>
        </View>
        
        {/* Special Offers */}
        {restaurant.offers && restaurant.offers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Offers</Text>
            {restaurant.offers.map((offer: any) => (
              <View key={offer.id} style={styles.offerCard}>
                <Text style={styles.offerTitle}>{offer.title}</Text>
                <Text style={styles.offerDescription}>{offer.description}</Text>
              </View>
            ))}
          </View>
        )}
        
        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionContent}>
            {restaurant.description}
          </Text>
        </View>
        
        {/* Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hours</Text>
          {restaurant.hours.map((item: any, index: number) => (
            <View key={index} style={styles.hoursRow}>
              <Text style={styles.dayText}>{item.day}</Text>
              <Text style={styles.hoursText}>{item.hours}</Text>
            </View>
          ))}
        </View>
        
        {/* Menus */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menus</Text>
          {restaurant.menus.map((menu: any) => (
            <TouchableOpacity 
              key={menu.id}
              style={styles.menuCard}
              onPress={() => navigation.navigate('MenuDetails', { menuId: menu.id, restaurantId: restaurant.id })}
            >
              <View style={styles.menuCardContent}>
                <Text style={styles.menuName}>{menu.name}</Text>
                <Text style={styles.menuDescription}>{menu.description}</Text>
              </View>
              <Text style={styles.menuCardArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    paddingBottom: SIZES.xxlarge,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: SIZES.large,
  },
  errorText: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.large,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    borderRadius: SIZES.small,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  coverImageContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  backIconButton: {
    position: 'absolute',
    top: SIZES.large,
    left: SIZES.large,
    backgroundColor: COLORS.primary + 'CC', // 80% opacity
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIconText: {
    fontSize: 24,
    color: COLORS.text.primary,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: SIZES.large,
    right: SIZES.large,
    backgroundColor: COLORS.primary + 'CC', // 80% opacity
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonText: {
    fontSize: 24,
    color: COLORS.status.error,
    fontWeight: 'bold',
  },
  header: {
    padding: SIZES.large,
    marginBottom: SIZES.medium,
  },
  restaurantName: {
    fontSize: SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.small,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  ratingText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginRight: SIZES.small,
  },
  ratingStars: {
    fontSize: SIZES.medium,
    color: COLORS.accent,
  },
  restaurantType: {
    fontSize: SIZES.medium,
    color: COLORS.text.secondary,
    marginBottom: SIZES.small,
  },
  restaurantAddress: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: SIZES.medium,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dietaryTag: {
    backgroundColor: COLORS.accent + '20', // 20% opacity
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  dietaryTagText: {
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
  allergenTagText: {
    fontSize: 12,
    color: COLORS.status.warning,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SIZES.medium,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.secondary,
    marginBottom: SIZES.large,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
  },
  section: {
    paddingHorizontal: SIZES.large,
    marginBottom: SIZES.large,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    paddingBottom: SIZES.small,
  },
  sectionContent: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    lineHeight: 22,
  },
  offerCard: {
    backgroundColor: COLORS.accent + '10', // 10% opacity
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  offerTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  offerDescription: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary + '50', // 50% opacity
  },
  dayText: {
    fontSize: SIZES.font,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  hoursText: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuCardContent: {
    flex: 1,
  },
  menuName: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
  },
  menuCardArrow: {
    fontSize: 24,
    color: COLORS.accent,
    marginLeft: SIZES.medium,
  },
});

export default RestaurantDetailsScreen;