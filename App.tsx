import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { store, persistor } from './src/store';
import AppNavigation from './src/navigation';
import { COLORS } from './src/config/theme';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, images, etc.
        await Font.loadAsync({
          // Add custom fonts here if needed
          // 'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
          // 'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
        });

        // Pre-load images
        await Asset.loadAsync([
          require('./assets/images/icon.png'),
          // Add other assets here
        ]);

        // Artificially delay for a smoother startup experience
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // Hide the splash screen after resources are loaded
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar style="auto" backgroundColor={COLORS.primary} />
          <AppNavigation />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}