import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Switch,
  TextInput
} from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS, SIZES } from '../../config/theme';
import { RootState } from '../../store';

// Mock data for menu details
const MOCK_MENU = {
  id: '1',
  restaurantId: '1',
  name: 'Dinner Menu',
  description: 'Our full dinner selection',
  sections: [
    {
      id: 's1',
      name: 'Appetizers',
      items: [
        {
          id: 'a1',
          name: 'Bruschetta',
          description: 'Grilled bread rubbed with garlic and topped with olive oil, salt, tomato, and basil.',
          price: 10.99,
          allergens: ['gluten'],
          dietaryOptions: ['vegetarian'],
          popular: true,
        },
        {
          id: 'a2',
          name: 'Calamari',
          description: 'Lightly battered and fried squid served with marinara sauce and lemon wedges.',
          price: 12.99,
          allergens: ['gluten', 'shellfish'],
          dietaryOptions: [],
          popular: false,
        },
        {
          id: 'a3',
          name: 'Caprese Salad',
          description: 'Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze and olive oil.',
          price: 11.99,
          allergens: ['dairy'],
          dietaryOptions: ['vegetarian', 'gluten-free'],
          popular: true,
        },
      ],
    },
    {
      id: 's2',
      name: 'Main Courses',
      items: [
        {
          id: 'm1',
          name: 'Spaghetti Carbonara',
          description: 'Classic pasta dish with pancetta, eggs, Parmesan cheese, and black pepper.',
          price: 18.99,
          allergens: ['gluten', 'dairy', 'eggs'],
          dietaryOptions: [],
          popular: true,
        },
        {
          id: 'm2',
          name: 'Margherita Pizza',
          description: 'Traditional pizza with tomato sauce, fresh mozzarella, and basil.',
          price: 16.99,
          allergens: ['gluten', 'dairy'],
          dietaryOptions: ['vegetarian'],
          popular: true,
        },
        {
          id: 'm3',
          name: 'Grilled Salmon',
          description: 'Fresh salmon fillet grilled with lemon and herbs, served with seasonal vegetables.',
          price: 22.99,
          allergens: ['fish'],
          dietaryOptions: ['gluten-free'],
          popular: false,
        },
        {
          id: 'm4',
          name: 'Eggplant Parmesan',
          description: 'Breaded eggplant slices layered with marinara sauce, mozzarella, and Parmesan cheese.',
          price: 17.99,
          allergens: ['gluten', 'dairy'],
          dietaryOptions: ['vegetarian'],
          popular: false,
        },
      ],
    },
    {
      id: 's3',
      name: 'Desserts',
      items: [
        {
          id: 'd1',
          name: 'Tiramisu',
          description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.',
          price: 8.99,
          allergens: ['dairy', 'eggs', 'gluten'],
          dietaryOptions: ['vegetarian'],
          popular: true,
        },
        {
          id: 'd2',
          name: 'Cannoli',
          description: 'Crispy pastry shells filled with sweet ricotta cream and chocolate chips.',
          price: 7.99,
          allergens: ['dairy', 'gluten', 'nuts'],
          dietaryOptions: ['vegetarian'],
          popular: false,
        },
        {
          id: 'd3',
          name: 'Gelato',
          description: 'Italian ice cream available in various flavors.',
          price: 6.99,
          allergens: ['dairy'],
          dietaryOptions: ['vegetarian', 'gluten-free'],
          popular: false,
        },
      ],
    },
  ],
};

const MenuDetailsScreen = ({ navigation, route }: any) => {
  const [menu, setMenu] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredSections, setFilteredSections] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllergenWarnings, setShowAllergenWarnings] = useState(true);
  const [showOnlyVegetarian, setShowOnlyVegetarian] = useState(false);
  const [showOnlyGlutenFree, setShowOnlyGlutenFree] = useState(false);
  const [showOnlyPopular, setShowOnlyPopular] = useState(false);
  
  const user = useSelector((state: RootState) => state.auth.user);
  
  // In a real app, we would fetch the menu details from an API
  useEffect(() => {
    const menuId = route.params?.menuId || '1';
    const restaurantId = route.params?.restaurantId || '1';
    
    // Simulate API call
    const fetchMenu = async () => {
      setIsLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // In a real app, we would fetch the menu from an API
        // For now, we'll just use the mock data
        setMenu(MOCK_MENU);
        setFilteredSections(MOCK_MENU.sections);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMenu();
  }, [route.params?.menuId, route.params?.restaurantId]);
  
  // Apply filters when they change
  useEffect(() => {
    if (!menu) return;
    
    const applyFilters = () => {
      const filtered = menu.sections.map((section: any) => {
        // Filter items based on current filters
        const filteredItems = section.items.filter((item: any) => {
          // Apply search filter
          if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
              !item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
          }
          
          // Apply vegetarian filter
          if (showOnlyVegetarian && 
              (!item.dietaryOptions || !item.dietaryOptions.includes('vegetarian'))) {
            return false;
          }
          
          // Apply gluten-free filter
          if (showOnlyGlutenFree && 
              (!item.dietaryOptions || !item.dietaryOptions.includes('gluten-free'))) {
            return false;
          }
          
          // Apply popular filter
          if (showOnlyPopular && !item.popular) {
            return false;
          }
          
          return true;
        });
        
        // Return section with filtered items
        return {
          ...section,
          items: filteredItems,
        };
      }).filter((section: any) => section.items.length > 0); // Remove empty sections
      
      setFilteredSections(filtered);
    };
    
    applyFilters();
  }, [menu, searchQuery, showOnlyVegetarian, showOnlyGlutenFree, showOnlyPopular]);
  
  // Check if an item contains user's allergens
  const containsUserAllergens = (item: any) => {
    if (!user?.allergens || user.allergens.length === 0 || !item.allergens) {
      return false;
    }
    
    return user.allergens.some((allergen: string) => 
      item.allergens.includes(allergen.toLowerCase())
    );
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }
  
  if (!menu) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Menu not found</Text>
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
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.menuTitle}>{menu.name}</Text>
        </View>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Search menu items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.text.secondary}
        />
        
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Show Allergen Warnings</Text>
            <Switch
              value={showAllergenWarnings}
              onValueChange={setShowAllergenWarnings}
              trackColor={{ false: COLORS.secondary, true: COLORS.accent + '80' }}
              thumbColor={showAllergenWarnings ? COLORS.accent : COLORS.text.secondary}
            />
          </View>
          
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Vegetarian Only</Text>
            <Switch
              value={showOnlyVegetarian}
              onValueChange={setShowOnlyVegetarian}
              trackColor={{ false: COLORS.secondary, true: COLORS.accent + '80' }}
              thumbColor={showOnlyVegetarian ? COLORS.accent : COLORS.text.secondary}
            />
          </View>
          
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Gluten-Free Only</Text>
            <Switch
              value={showOnlyGlutenFree}
              onValueChange={setShowOnlyGlutenFree}
              trackColor={{ false: COLORS.secondary, true: COLORS.accent + '80' }}
              thumbColor={showOnlyGlutenFree ? COLORS.accent : COLORS.text.secondary}
            />
          </View>
          
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Popular Items Only</Text>
            <Switch
              value={showOnlyPopular}
              onValueChange={setShowOnlyPopular}
              trackColor={{ false: COLORS.secondary, true: COLORS.accent + '80' }}
              thumbColor={showOnlyPopular ? COLORS.accent : COLORS.text.secondary}
            />
          </View>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredSections.length > 0 ? (
          filteredSections.map((section: any) => (
            <View key={section.id} style={styles.menuSection}>
              <Text style={styles.sectionTitle}>{section.name}</Text>
              
              {section.items.map((item: any) => {
                const hasUserAllergens = containsUserAllergens(item);
                
                return (
                  <View 
                    key={item.id} 
                    style={[
                      styles.menuItem,
                      hasUserAllergens && showAllergenWarnings && styles.allergenWarningItem
                    ]}
                  >
                    {hasUserAllergens && showAllergenWarnings && (
                      <View style={styles.allergenWarningBanner}>
                        <Text style={styles.allergenWarningText}>
                          ⚠️ Contains allergens you've marked in your profile
                        </Text>
                      </View>
                    )}
                    
                    <View style={styles.menuItemHeader}>
                      <View style={styles.menuItemNameContainer}>
                        <Text style={styles.menuItemName}>{item.name}</Text>
                        {item.popular && (
                          <View style={styles.popularBadge}>
                            <Text style={styles.popularBadgeText}>Popular</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                    </View>
                    
                    <Text style={styles.menuItemDescription}>
                      {item.description}
                    </Text>
                    
                    {/* Dietary options */}
                    {item.dietaryOptions && item.dietaryOptions.length > 0 && (
                      <View style={styles.dietaryContainer}>
                        {item.dietaryOptions.map((option: string) => (
                          <View key={option} style={styles.dietaryTag}>
                            <Text style={styles.dietaryText}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                    
                    {/* Allergens */}
                    {item.allergens && item.allergens.length > 0 && showAllergenWarnings && (
                      <View style={styles.allergenContainer}>
                        <Text style={styles.allergenLabel}>Contains:</Text>
                        {item.allergens.map((allergen: string) => (
                          <View 
                            key={allergen} 
                            style={[
                              styles.allergenTag,
                              user?.allergens?.includes(allergen) && styles.userAllergenTag
                            ]}
                          >
                            <Text style={[
                              styles.allergenText,
                              user?.allergens?.includes(allergen) && styles.userAllergenText
                            ]}>
                              {allergen.charAt(0).toUpperCase() + allergen.slice(1)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No menu items match your filters</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSearchQuery('');
                setShowOnlyVegetarian(false);
                setShowOnlyGlutenFree(false);
                setShowOnlyPopular(false);
              }}
            >
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: SIZES.large,
    paddingHorizontal: SIZES.large,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.text.primary,
    fontWeight: 'bold',
  },
  menuTitle: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    flex: 1,
  },
  searchInput: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    marginBottom: SIZES.medium,
    color: COLORS.text.primary,
    fontSize: SIZES.font,
  },
  filtersContainer: {
    marginBottom: SIZES.medium,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary + '50', // 50% opacity
  },
  filterLabel: {
    fontSize: SIZES.font,
    color: COLORS.text.primary,
  },
  scrollContent: {
    padding: SIZES.large,
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
  menuSection: {
    marginBottom: SIZES.xlarge,
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
  menuItem: {
    marginBottom: SIZES.large,
    padding: SIZES.medium,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.small,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  allergenWarningItem: {
    borderWidth: 2,
    borderColor: COLORS.status.warning,
  },
  allergenWarningBanner: {
    backgroundColor: COLORS.status.warning,
    padding: SIZES.small,
    marginBottom: SIZES.small,
    marginHorizontal: -SIZES.medium,
    marginTop: -SIZES.medium,
  },
  allergenWarningText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: SIZES.font,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.small,
  },
  menuItemNameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  menuItemName: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginRight: SIZES.small,
  },
  popularBadge: {
    backgroundColor: COLORS.accent,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  popularBadgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  menuItemPrice: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  menuItemDescription: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: SIZES.medium,
  },
  dietaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.small,
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
  dietaryText: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '500',
  },
  allergenContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  allergenLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginRight: 8,
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
  userAllergenTag: {
    backgroundColor: COLORS.status.error + '20', // 20% opacity
    borderColor: COLORS.status.error,
  },
  userAllergenText: {
    color: COLORS.status.error,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xlarge,
    minHeight: 300,
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
    marginBottom: SIZES.large,
  },
  resetButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    borderRadius: SIZES.small,
  },
  resetButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
});

export default MenuDetailsScreen;