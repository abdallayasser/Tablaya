export const COLORS = {
  primary: '#FFFFFF', // Neutral White
  secondary: '#F0F0F0', // Light Gray
  accent: '#008080', // Teal
  text: {
    primary: '#333333',
    secondary: '#666666',
    light: '#999999',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F0F0F0',
  },
  status: {
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
  },
  allergens: {
    dairy: '#FFD700', // Gold
    nuts: '#8B4513', // Brown
    gluten: '#DAA520', // Goldenrod
    seafood: '#1E90FF', // Blue
    soy: '#32CD32', // Lime Green
  }
};

export const FONTS = {
  regular: 'Roboto-Regular',
  medium: 'Roboto-Medium',
  bold: 'Roboto-Bold',
  light: 'Roboto-Light',
};

export const SIZES = {
  // Global sizes
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  xlarge: 24,
  xxlarge: 32,
  
  // Screen dimensions
  width: 375, // Default design width
  height: 812, // Default design height
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 6,
  },
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
};

const theme = { COLORS, FONTS, SIZES, SHADOWS, SPACING };

export default theme;