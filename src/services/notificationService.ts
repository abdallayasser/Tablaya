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
  orderBy,
  serverTimestamp,
  limit,
} from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import { db } from '../config/firebase';
import { Notification } from '../types';

// Register for push notifications
export const registerForPushNotifications = async (): Promise<string | null> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return null;
    }
    
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    
    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    
    return token;
  } catch (error) {
    throw error;
  }
};

// Save user's push notification token
export const savePushToken = async (userId: string, token: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      pushToken: token,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};

// Get notifications for a user
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Notification[];
  } catch (error) {
    throw error;
  }
};

// Create a new notification
export const createNotification = async (
  notificationData: Omit<Notification, 'id' | 'timestamp'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notificationData,
      read: false,
      timestamp: serverTimestamp(),
    });
    
    // Send push notification if user has a token
    const userDoc = await getDoc(doc(db, 'users', notificationData.userId));
    const userData = userDoc.data();
    
    if (userData?.pushToken) {
      await sendPushNotification(
        userData.pushToken,
        notificationData.type,
        notificationData.message,
        notificationData.data
      );
    }
    
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Send push notification
export const sendPushNotification = async (
  token: string,
  title: string,
  body: string,
  data?: any
): Promise<void> => {
  try {
    const message = {
      to: token,
      sound: 'default',
      title,
      body,
      data: data || {},
    };
    
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (id: string): Promise<void> => {
  try {
    const notificationRef = doc(db, 'notifications', id);
    await updateDoc(notificationRef, {
      read: true,
    });
  } catch (error) {
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    const querySnapshot = await getDocs(q);
    
    const batch = db.batch();
    querySnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { read: true });
    });
    
    await batch.commit();
  } catch (error) {
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'notifications', id));
  } catch (error) {
    throw error;
  }
};

// Create menu update notification for all users who favorited a restaurant
export const notifyMenuUpdate = async (
  restaurantId: string,
  restaurantName: string,
  menuName: string
): Promise<void> => {
  try {
    // Find all users who have this restaurant in their favorites
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'customer'),
      where('favoriteRestaurants', 'array-contains', restaurantId)
    );
    const querySnapshot = await getDocs(q);
    
    // Create a notification for each user
    const batch = db.batch();
    querySnapshot.docs.forEach((userDoc) => {
      const userData = userDoc.data();
      const notificationRef = doc(collection(db, 'notifications'));
      
      batch.set(notificationRef, {
        userId: userDoc.id,
        type: 'menu_update',
        message: `${restaurantName} has updated their ${menuName} menu!`,
        read: false,
        data: {
          restaurantId,
          menuName,
        },
        timestamp: serverTimestamp(),
      });
    });
    
    await batch.commit();
    
    // Send push notifications
    for (const userDoc of querySnapshot.docs) {
      const userData = userDoc.data();
      if (userData.pushToken) {
        await sendPushNotification(
          userData.pushToken,
          'Menu Update',
          `${restaurantName} has updated their ${menuName} menu!`,
          {
            restaurantId,
            menuName,
          }
        );
      }
    }
  } catch (error) {
    throw error;
  }
};