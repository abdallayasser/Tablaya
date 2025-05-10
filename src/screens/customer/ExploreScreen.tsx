import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS, SIZES } from '../../config/theme';
import { RootState } from '../../store';

// Mock data for restaurants
const MOCK_RESTAURANTS = [
  {
    id: '1',
    name: 'Pasta Paradise',
    type: 'Italian',
    rating: 4.7,
    priceLevel: '$$',
    distance: '0.8 mi',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
    tags: ['pasta', 'pizza', 'italian'],
    dietaryOptions: ['vegetarian', 'vegan'],
    allergenFree: ['nuts'],
  },
  {
    id: '2',
    name: 'Sushi Sensation',
    type: 'Japanese',
    rating: 4.5,
    priceLevel: '$$$',
    distance: '1.2 mi',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    tags: ['sushi', 'japanese', 'seafood'],
    dietaryOptions: ['pescatarian', 'gluten-free'],
    allergenFree: ['dairy', 'nuts'],
  },
  {
    id: '3',
    name: 'Veggie Delight',
    type: 'Vegetarian',
    rating: 4.3,
    priceLevel: '$$',
    distance: '0.5 mi',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
    tags: ['vegetarian', 'vegan', 'healthy'],
    dietaryOptions: ['vegetarian', 'vegan', 'gluten-free'],
    allergenFree: ['dairy', 'eggs', 'shellfish', 'fish'],
  },
  {
    id: '4',
    name: 'Burger Barn',
    type: 'American',
    rating: 4.2,
    priceLevel: '$',
    distance: '1.5 mi',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add',
    tags: ['burgers', 'american', 'fast food'],
    dietaryOptions: [],
    allergenFree: [],
  },
  {
    id: '5',
    name: 'Taco Town',
    type: 'Mexican',
    rating: 4.4,
    priceLevel: '$$',
    distance: '2.0 mi',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47',
    tags: ['mexican', 'tacos', 'burritos'],
    dietaryOptions: ['vegetarian'],
    allergenFree: ['gluten'],
  },
];

// Filter options
const DIETARY_FILTERS = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'pescatarian', label: 'Pescatarian' },
  { id: 'keto', label: 'Keto' },
  { id: 'paleo', label: 'Paleo' },
];

const ALLERGEN_FILTERS = [
  { id: 'dairy', label: 'Dairy-Free' },
  { id: 'nuts', label: 'Nut-Free' },
  { id: 'gluten', label: 'Gluten-Free' },
  { id: 'shellfish', label: 'Shellfish-Free' },
  { id: 'eggs', label: 'Egg-Free' },
  { id: 'soy', label: 'Soy-Free' },
  { id: 'fish', label: 'Fish-Free' },
];

const CUISINE_FILTERS = [
  { id: 'italian', label: 'Italian' },
  { id: 'japanese', label: 'Japanese' },
  { id: 'mexican', label: 'Mexican' },
  { id: 'american', label: 'American' },
  { id: 'chinese', label: 'Chinese' },
  { id: 'indian', label: 'Indian' },
  { id: 'thai', label: 'Thai' },
  { id: 'mediterranean', label: 'Mediterranean' },
];

const ExploreScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState(MOCK_RESTAURANTS);
  const [filteredRestaurants, setFilteredRestaurants] = useState(MOCK_RESTAURANTS);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeFilterType, setActiveFilterType] = useState<'dietary' | 'allergen' | 'cuisine'>('dietary');
  
  const user = useSelector((state: RootState) => state.auth.user);

  // Apply user's dietary preferences and allergen restrictions as default filters
  useEffect(() => {
    if (user?.dietaryPreferences?.length > 0 || user?.allergens?.length > 0) {
      const userFilters = [
        ...(user.dietaryPreferences || []),
        ...(user.allergens || []).map(allergen => `${allergen}-free`)
      ];
      setActiveFilters(userFilters);
      applyFilters(userFilters);
    }
  }, [user]);

  const applyFilters = (filters: string[]) => {
    if (filters.length === 0) {
      setFilteredRestaurants(restaurants);
      return;
    }

    const filtered = restaurants.filter(restaurant => {
      // Check if restaurant matches any of the active filters
      return filters.some(filter => {
        // Check dietary options
        if (restaurant.dietaryOptions && restaurant.dietaryOptions.includes(filter)) {
          return true;
        }
        
        // Check allergen-free options (remove "-free" suffix for comparison)
        if (filter.endsWith('-free')) {
          const allergen = filter.replace('-free', '');
          return restaurant.allergenFree && restaurant.allergenFree.includes(allergen);
        }
        
        // Check cuisine/tags
        return restaurant.tags && restaurant.tags.includes(filter);
      });
    });

    setFilteredRestaurants(filtered);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (!text.trim()) {
      // If search is empty, just apply current filters
      applyFilters(activeFilters);
      return;
    }
    
    // Filter by search text and active filters
    const searchResults = restaurants.filter(restaurant => 
      (restaurant.name.toLowerCase().includes(text.toLowerCase()) ||
       restaurant.type.toLowerCase().includes(text.toLowerCase()) ||
       restaurant.tags.some(tag => tag.toLowerCase().includes(text.toLowerCase()))) &&
      (activeFilters.length === 0 || 
        activeFilters.some(filter => {
          if (restaurant.dietaryOptions && restaurant.dietaryOptions.includes(filter)) {
            return true;
          }
          if (filter.endsWith('-free')) {
            const allergen = filter.replace('-free', '');
            return restaurant.allergenFree && restaurant.allergenFree.includes(allergen);
          }
          return restaurant.tags && restaurant.tags.includes(filter);
        })
      )
    );
    
    setFilteredRestaurants(searchResults);
  };

  const toggleFilter = (filterId: string) => {
    let updatedFilters;
    
    if (activeFilters.includes(filterId)) {
      updatedFilters = activeFilters.filter(id => id !== filterId);
    } else {
      updatedFilters = [...activeFilters, filterId];
    }
    
    setActiveFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const renderFilterChips = () => {
    let filterOptions;
    
    switch (activeFilterType) {
      case 'dietary':
        filterOptions = DIETARY_FILTERS;
        break;
      case 'allergen':
        filterOptions = ALLERGEN_FILTERS;
        break;
      case 'cuisine':
        filterOptions = CUISINE_FILTERS;
        break;
      default:
        filterOptions = DIETARY_FILTERS;
    }
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {filterOptions.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              activeFilters.includes(filter.id) && styles.activeFilterChip
            ]}
            onPress={() => toggleFilter(filter.id)}
          >
            <Text style={[
              styles.filterChipText,
              activeFilters.includes(filter.id) && styles.activeFilterChipText
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderRestaurantItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.restaurantCard}
      onPress={() => navigation.navigate('RestaurantDetails', { restaurantId: item.id })}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.restaurantImage}
        resizeMode="cover"
      />
      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantHeader}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{item.rating}</Text>
            {/* Star icon would go here */}
          </View>
        </View>
        <View style={styles.restaurantSubheader}>
          <Text style={styles.restaurantType}>{item.type}</Text>
          <Text style={styles.restaurantMeta}>{item.priceLevel} • {item.distance}</Text>
        </View>
        
        {/* Dietary and allergen tags */}
        {(item.dietaryOptions.length > 0 || item.allergenFree.length > 0) && (
          <View style={styles.tagsContainer}>
            {item.dietaryOptions.map((option: string) => (
              <View key={option} style={styles.dietaryTag}>
                <Text style={styles.dietaryTagText}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </View>
            ))}
            
            {item.allergenFree.map((allergen: string) => (
              <View key={allergen} style={styles.allergenTag}>
                <Text style={styles.allergenTagText}>
                  {allergen.charAt(0).toUpperCase() + allergen.slice(1)}-free
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Restaurants</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants, cuisines..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={COLORS.text.secondary}
          />
          {/* Search icon would go here */}
        </View>
      </View>
      
      <View style={styles.filterTypesContainer}>
        <TouchableOpacity
          style={[
            styles.filterTypeButton,
            activeFilterType === 'dietary' && styles.activeFilterTypeButton
          ]}
          onPress={() => setActiveFilterType('dietary')}
        >
          <Text style={[
            styles.filterTypeText,
            activeFilterType === 'dietary' && styles.activeFilterTypeText
          ]}>
            Dietary
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterTypeButton,
            activeFilterType === 'allergen' && styles.activeFilterTypeButton
          ]}
          onPress={() => setActiveFilterType('allergen')}
        >
          <Text style={[
            styles.filterTypeText,
            activeFilterType === 'allergen' && styles.activeFilterTypeText
          ]}>
            Allergen-Free
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterTypeButton,
            activeFilterType === 'cuisine' && styles.activeFilterTypeButton
          ]}
          onPress={() => setActiveFilterType('cuisine')}
        >
          <Text style={[
            styles.filterTypeText,
            activeFilterType === 'cuisine' && styles.activeFilterTypeText
          ]}>
            Cuisine
          </Text>
        </TouchableOpacity>
      </View>
      
      {renderFilterChips()}
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      ) : filteredRestaurants.length > 0 ? (
        <FlatList
          data={filteredRestaurants}
          renderItem={renderRestaurantItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.restaurantList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No restaurants found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your filters or search criteria
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
  },
  header: {
    padding: SIZES.large,
    paddingBottom: SIZES.medium,
  },
  title: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.medium,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: COLORS.text.primary,
    fontSize: SIZES.font,
  },
  filterTypesContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.large,
    marginBottom: SIZES.small,
  },
  filterTypeButton: {
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    marginRight: SIZES.medium,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeFilterTypeButton: {
    borderBottomColor: COLORS.accent,
  },
  filterTypeText: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  activeFilterTypeText: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  filtersContainer: {
    paddingHorizontal: SIZES.large,
    paddingBottom: SIZES.medium,
  },
  filterChip: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  activeFilterChip: {
    backgroundColor: COLORS.accent + '20', // 20% opacity
    borderColor: COLORS.accent,
  },
  filterChipText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  activeFilterChipText: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantList: {
    paddingHorizontal: SIZES.large,
    paddingBottom: SIZES.xxlarge,
  },
  restaurantCard: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    marginBottom: SIZES.large,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantImage: {
    width: '100%',
    height: 180,
  },
  restaurantInfo: {
    padding: SIZES.medium,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginRight: 4,
  },
  restaurantSubheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.small,
  },
  restaurantType: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
  },
  restaurantMeta: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
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

export default ExploreScreen;