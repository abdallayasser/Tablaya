export type UserRole = 'owner' | 'customer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerProfile extends User {
  role: 'customer';
  dietaryPreferences: string[];
  allergenRestrictions: string[];
  favoriteRestaurants: string[];
}

export interface RestaurantOwnerProfile extends User {
  role: 'owner';
  restaurants: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  ownerId: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  profileImage?: string;
  description?: string;
  cuisine: string[];
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Menu {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  status: 'draft' | 'published';
  ocrText?: string;
  allergenFlags: string[];
  uploadDate: Date;
  updatedAt: Date;
}

export interface MenuItem {
  id: string;
  menuId: string;
  name: string;
  description?: string;
  price: number;
  detectedAllergens: string[];
  tags: string[];
  image?: string;
  category: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Offer {
  id: string;
  restaurantId: string;
  title: string;
  description: string;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  startDate: Date;
  expirationDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'menu_update' | 'new_offer' | 'allergen_alert' | 'restaurant_favorite';
  message: string;
  read: boolean;
  data?: any;
  timestamp: Date;
}

export type AllergenType = 'dairy' | 'nuts' | 'gluten' | 'seafood' | 'soy' | 'eggs' | 'wheat' | 'peanuts';

export interface OCRResult {
  text: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface AIAllergenDetectionResult {
  allergens: {
    type: AllergenType;
    confidence: number;
    mentions: string[];
  }[];
  menuItemsWithAllergens: {
    itemName: string;
    allergens: AllergenType[];
  }[];
}