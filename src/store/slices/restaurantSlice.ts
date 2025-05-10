import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Restaurant } from '../../types';

interface RestaurantState {
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  nearbyRestaurants: Restaurant[];
  favoriteRestaurants: Restaurant[];
  isLoading: boolean;
  error: string | null;
}

const initialState: RestaurantState = {
  restaurants: [],
  currentRestaurant: null,
  nearbyRestaurants: [],
  favoriteRestaurants: [],
  isLoading: false,
  error: null,
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setRestaurants: (state, action: PayloadAction<Restaurant[]>) => {
      state.restaurants = action.payload;
      state.error = null;
    },
    setCurrentRestaurant: (state, action: PayloadAction<Restaurant | null>) => {
      state.currentRestaurant = action.payload;
    },
    setNearbyRestaurants: (state, action: PayloadAction<Restaurant[]>) => {
      state.nearbyRestaurants = action.payload;
    },
    setFavoriteRestaurants: (state, action: PayloadAction<Restaurant[]>) => {
      state.favoriteRestaurants = action.payload;
    },
    addRestaurant: (state, action: PayloadAction<Restaurant>) => {
      state.restaurants.push(action.payload);
    },
    updateRestaurant: (state, action: PayloadAction<Restaurant>) => {
      const index = state.restaurants.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.restaurants[index] = action.payload;
      }
      if (state.currentRestaurant?.id === action.payload.id) {
        state.currentRestaurant = action.payload;
      }
    },
    deleteRestaurant: (state, action: PayloadAction<string>) => {
      state.restaurants = state.restaurants.filter(r => r.id !== action.payload);
      if (state.currentRestaurant?.id === action.payload) {
        state.currentRestaurant = null;
      }
    },
    addToFavorites: (state, action: PayloadAction<Restaurant>) => {
      if (!state.favoriteRestaurants.some(r => r.id === action.payload.id)) {
        state.favoriteRestaurants.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favoriteRestaurants = state.favoriteRestaurants.filter(r => r.id !== action.payload);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setRestaurants,
  setCurrentRestaurant,
  setNearbyRestaurants,
  setFavoriteRestaurants,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
  addToFavorites,
  removeFromFavorites,
  setError,
  clearError,
} = restaurantSlice.actions;

export default restaurantSlice.reducer;