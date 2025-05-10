import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  GeoPoint,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Restaurant } from '../types';

// Get all restaurants
export const getAllRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'restaurants'));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Restaurant[];
  } catch (error) {
    throw error;
  }
};

// Get restaurant by ID
export const getRestaurantById = async (id: string): Promise<Restaurant | null> => {
  try {
    const docRef = doc(db, 'restaurants', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Restaurant;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Get restaurants by owner ID
export const getRestaurantsByOwnerId = async (ownerId: string): Promise<Restaurant[]> => {
  try {
    const q = query(collection(db, 'restaurants'), where('ownerId', '==', ownerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Restaurant[];
  } catch (error) {
    throw error;
  }
};

// Create a new restaurant
export const createRestaurant = async (
  restaurantData: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'restaurants'), {
      ...restaurantData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Update restaurant
export const updateRestaurant = async (
  id: string,
  restaurantData: Partial<Restaurant>
): Promise<void> => {
  try {
    const restaurantRef = doc(db, 'restaurants', id);
    await updateDoc(restaurantRef, {
      ...restaurantData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};

// Delete restaurant
export const deleteRestaurant = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'restaurants', id));
  } catch (error) {
    throw error;
  }
};

// Upload restaurant profile image
export const uploadRestaurantImage = async (
  restaurantId: string,
  imageUri: string
): Promise<string> => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    const storageRef = ref(storage, `restaurants/${restaurantId}/profile-image`);
    await uploadBytes(storageRef, blob);
    
    const downloadURL = await getDownloadURL(storageRef);
    
    // Update restaurant with new image URL
    const restaurantRef = doc(db, 'restaurants', restaurantId);
    await updateDoc(restaurantRef, {
      profileImage: downloadURL,
      updatedAt: serverTimestamp(),
    });
    
    return downloadURL;
  } catch (error) {
    throw error;
  }
};

// Get nearby restaurants based on user location
export const getNearbyRestaurants = async (
  latitude: number,
  longitude: number,
  radiusInKm: number = 10
): Promise<Restaurant[]> => {
  try {
    // This is a simplified approach. In a production app, you would use
    // geohashing or a specialized geospatial database/service
    const restaurants = await getAllRestaurants();
    
    return restaurants.filter((restaurant) => {
      const lat1 = latitude;
      const lon1 = longitude;
      const lat2 = restaurant.location.coordinates.latitude;
      const lon2 = restaurant.location.coordinates.longitude;
      
      // Calculate distance using Haversine formula
      const R = 6371; // Radius of the Earth in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c; // Distance in km
      
      return distance <= radiusInKm;
    });
  } catch (error) {
    throw error;
  }
};