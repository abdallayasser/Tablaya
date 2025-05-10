import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../config/theme';

const ExploreScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Restaurants</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: SIZES.large,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.medium,
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: COLORS.text.secondary,
  },
});

export default ExploreScreen;