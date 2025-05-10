import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import restaurantReducer from './slices/restaurantSlice';
import menuReducer from './slices/menuSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurant: restaurantReducer,
    menu: menuReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/setUser'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.createdAt', 'payload.updatedAt', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: [
          'auth.user.createdAt',
          'auth.user.updatedAt',
          'restaurant.restaurants.createdAt',
          'restaurant.restaurants.updatedAt',
          'menu.menus.uploadDate',
          'menu.menus.updatedAt',
          'notification.notifications.timestamp',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;