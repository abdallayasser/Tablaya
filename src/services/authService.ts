import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User, UserRole, CustomerProfile, RestaurantOwnerProfile } from '../types';

// Register a new user
export const registerUser = async (
  email: string,
  password: string,
  role: UserRole,
  displayName: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    // Update profile with display name
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    const userData = {
      id: user.uid,
      email: user.email,
      role,
      displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Add role-specific fields
    if (role === 'customer') {
      const customerData: Partial<CustomerProfile> = {
        ...userData,
        dietaryPreferences: [],
        allergenRestrictions: [],
        favoriteRestaurants: [],
      };
      await setDoc(doc(db, 'users', user.uid), customerData);
    } else if (role === 'owner') {
      const ownerData: Partial<RestaurantOwnerProfile> = {
        ...userData,
        restaurants: [],
      };
      await setDoc(doc(db, 'users', user.uid), ownerData);
    }

    return userCredential;
  } catch (error) {
    throw error;
  }
};

// Sign in existing user
export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error;
  }
};

// Sign out user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

// Get current user profile from Firestore
export const getUserProfile = async (userId: string): Promise<User | CustomerProfile | RestaurantOwnerProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as User | CustomerProfile | RestaurantOwnerProfile;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    // If display name is being updated, also update in Firebase Auth
    if (data.displayName && auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: data.displayName });
    }
  } catch (error) {
    throw error;
  }
};

// Update customer profile
export const updateCustomerProfile = async (
  userId: string,
  data: Partial<CustomerProfile>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};

// Update restaurant owner profile
export const updateRestaurantOwnerProfile = async (
  userId: string,
  data: Partial<RestaurantOwnerProfile>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};