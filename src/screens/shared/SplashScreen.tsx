import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { COLORS, SIZES } from '../../config/theme';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.appName}>Tablaya</Text>
      <Text style={styles.tagline}>Connect with restaurants, discover menus</Text>
      <ActivityIndicator
        size="large"
        color={COLORS.accent}
        style={styles.loader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.large,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: SIZES.medium,
  },
  appName: {
    fontSize: SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginBottom: SIZES.small,
  },
  tagline: {
    fontSize: SIZES.medium,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SIZES.xlarge,
  },
  loader: {
    marginTop: SIZES.large,
  },
});

export default SplashScreen;