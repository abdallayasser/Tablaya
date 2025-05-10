import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../services/notificationService';
import { RootState } from '../../store';
import { Notification } from '../../types';
import Button from '../../components/Button';

const NotificationsScreen = ({ navigation }: any) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const userNotifications = await getUserNotifications(user.id);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    
    try {
      await markAllNotificationsAsRead(user.id);
      // Update local state
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleNotificationPress = async (notification: Notification) => {
    try {
      // Mark as read in database
      if (!notification.read) {
        await markNotificationAsRead(notification.id);
        
        // Update local state
        setNotifications(prevNotifications =>
          prevNotifications.map(item =>
            item.id === notification.id ? { ...item, read: true } : item
          )
        );
      }
      
      // Navigate based on notification type
      if (notification.type === 'menu_update' && notification.data?.restaurantId) {
        navigation.navigate('RestaurantDetails', {
          restaurantId: notification.data.restaurantId,
        });
      } else if (notification.type === 'new_offer' && notification.data?.restaurantId) {
        navigation.navigate('RestaurantDetails', {
          restaurantId: notification.data.restaurantId,
          showOffers: true,
        });
      }
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.read && styles.unreadNotification,
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationContent}>
        <Text style={styles.notificationType}>{item.type.replace('_', ' ')}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>
          {new Date(item.timestamp?.toDate()).toLocaleString()}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No notifications yet</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity
          style={styles.markAllButton}
          onPress={handleMarkAllAsRead}
          disabled={notifications.every(n => n.read)}
        >
          <Text
            style={[
              styles.markAllText,
              notifications.every(n => n.read) && styles.disabledText,
            ]}
          >
            Mark all as read
          </Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyComponent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  backButton: {
    padding: SIZES.small,
  },
  backButtonText: {
    color: COLORS.accent,
    fontSize: SIZES.medium,
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  markAllButton: {
    padding: SIZES.small,
  },
  markAllText: {
    color: COLORS.accent,
    fontSize: SIZES.font,
  },
  disabledText: {
    color: COLORS.text.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: SIZES.medium,
    flexGrow: 1,
  },
  notificationItem: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
    flexDirection: 'row',
    ...SHADOWS.small,
  },
  unreadNotification: {
    backgroundColor: COLORS.background.secondary,
  },
  notificationContent: {
    flex: 1,
  },
  notificationType: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.accent,
    textTransform: 'capitalize',
    marginBottom: SIZES.small,
  },
  notificationMessage: {
    fontSize: SIZES.font,
    color: COLORS.text.primary,
    marginBottom: SIZES.small,
  },
  notificationTime: {
    fontSize: SIZES.small,
    color: COLORS.text.light,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent,
    marginLeft: SIZES.small,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.xxlarge,
  },
  emptyText: {
    fontSize: SIZES.medium,
    color: COLORS.text.light,
  },
});

export default NotificationsScreen;