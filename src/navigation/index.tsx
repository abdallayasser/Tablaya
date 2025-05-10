import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector, useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserProfile } from '../services/authService';
import { setUser, setLoading } from '../store/slices/authSlice';
import { RootState } from '../store';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Customer Screens
import CustomerHomeScreen from '../screens/customer/HomeScreen';
import CustomerExploreScreen from '../screens/customer/ExploreScreen';
import CustomerFavoritesScreen from '../screens/customer/FavoritesScreen';
import CustomerProfileScreen from '../screens/customer/ProfileScreen';
import EditProfileScreen from '../screens/customer/EditProfileScreen';
import RestaurantDetailsScreen from '../screens/customer/RestaurantDetailsScreen';
import MenuDetailsScreen from '../screens/customer/MenuDetailsScreen';

// Restaurant Owner Screens
import OwnerDashboardScreen from '../screens/owner/DashboardScreen';
import OwnerMenusScreen from '../screens/owner/MenusScreen';
import OwnerOffersScreen from '../screens/owner/OffersScreen';
import OwnerProfileScreen from '../screens/owner/ProfileScreen';
import MenuUploadScreen from '../screens/owner/MenuUploadScreen';
import MenuEditorScreen from '../screens/owner/MenuEditorScreen';
import CreateOfferScreen from '../screens/owner/CreateOfferScreen';

// Shared Screens
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import SplashScreen from '../screens/shared/SplashScreen';

// Create navigators
const Stack = createStackNavigator();
const CustomerTab = createBottomTabNavigator();
const OwnerTab = createBottomTabNavigator();

// Customer Tab Navigator
const CustomerTabNavigator = () => {
  return (
    <CustomerTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#008080',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#F0F0F0',
        },
        headerTitleStyle: {
          color: '#333333',
          fontWeight: '600',
        },
      }}
    >
      <CustomerTab.Screen
        name="Home"
        component={CustomerHomeScreen}
        options={{
          title: 'Home',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="home" color={color} size={size} />
          // ),
        }}
      />
      <CustomerTab.Screen
        name="Explore"
        component={CustomerExploreScreen}
        options={{
          title: 'Explore',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="search" color={color} size={size} />
          // ),
        }}
      />
      <CustomerTab.Screen
        name="Favorites"
        component={CustomerFavoritesScreen}
        options={{
          title: 'Favorites',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="heart" color={color} size={size} />
          // ),
        }}
      />
      <CustomerTab.Screen
        name="Profile"
        component={CustomerProfileScreen}
        options={{
          title: 'Profile',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="user" color={color} size={size} />
          // ),
        }}
      />
    </CustomerTab.Navigator>
  );
};

// Restaurant Owner Tab Navigator
const OwnerTabNavigator = () => {
  return (
    <OwnerTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#008080',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#F0F0F0',
        },
        headerTitleStyle: {
          color: '#333333',
          fontWeight: '600',
        },
      }}
    >
      <OwnerTab.Screen
        name="Dashboard"
        component={OwnerDashboardScreen}
        options={{
          title: 'Dashboard',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="grid" color={color} size={size} />
          // ),
        }}
      />
      <OwnerTab.Screen
        name="Menus"
        component={OwnerMenusScreen}
        options={{
          title: 'Menus',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="book-open" color={color} size={size} />
          // ),
        }}
      />
      <OwnerTab.Screen
        name="Offers"
        component={OwnerOffersScreen}
        options={{
          title: 'Offers',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="tag" color={color} size={size} />
          // ),
        }}
      />
      <OwnerTab.Screen
        name="Profile"
        component={OwnerProfileScreen}
        options={{
          title: 'Profile',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="user" color={color} size={size} />
          // ),
        }}
      />
    </OwnerTab.Navigator>
  );
};

// Main Navigation
const AppNavigation = () => {
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [initializing, setInitializing] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user profile from Firestore
          const userProfile = await getUserProfile(firebaseUser.uid);
          dispatch(setUser(userProfile));
        } catch (error) {
          console.error('Error fetching user profile:', error);
          dispatch(setUser(null));
        }
      } else {
        dispatch(setUser(null));
      }
      
      if (initializing) {
        setInitializing(false);
      }
      
      dispatch(setLoading(false));
    });
    
    // Cleanup subscription
    return unsubscribe;
  }, [dispatch, initializing]);
  
  if (isLoading || initializing) {
    return <SplashScreen />;
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </Stack.Group>
        ) : user?.role === 'owner' ? (
          // Restaurant Owner Stack
          <Stack.Group>
            <Stack.Screen name="OwnerTabs" component={OwnerTabNavigator} />
            <Stack.Screen name="MenuUpload" component={MenuUploadScreen} />
            <Stack.Screen name="MenuEditor" component={MenuEditorScreen} />
            <Stack.Screen name="CreateOffer" component={CreateOfferScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
          </Stack.Group>
        ) : (
          // Customer Stack
          <Stack.Group>
            <Stack.Screen name="CustomerTabs" component={CustomerTabNavigator} />
            <Stack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} />
            <Stack.Screen name="MenuDetails" component={MenuDetailsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;