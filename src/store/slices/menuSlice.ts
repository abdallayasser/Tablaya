import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Menu, MenuItem, OCRResult, AIAllergenDetectionResult } from '../../types';

interface MenuState {
  menus: Menu[];
  currentMenu: Menu | null;
  menuItems: MenuItem[];
  ocrResult: OCRResult | null;
  allergenDetectionResult: AIAllergenDetectionResult | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  menus: [],
  currentMenu: null,
  menuItems: [],
  ocrResult: null,
  allergenDetectionResult: null,
  isLoading: false,
  error: null,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setMenus: (state, action: PayloadAction<Menu[]>) => {
      state.menus = action.payload;
      state.error = null;
    },
    setCurrentMenu: (state, action: PayloadAction<Menu | null>) => {
      state.currentMenu = action.payload;
    },
    setMenuItems: (state, action: PayloadAction<MenuItem[]>) => {
      state.menuItems = action.payload;
    },
    setOCRResult: (state, action: PayloadAction<OCRResult | null>) => {
      state.ocrResult = action.payload;
    },
    setAllergenDetectionResult: (state, action: PayloadAction<AIAllergenDetectionResult | null>) => {
      state.allergenDetectionResult = action.payload;
    },
    addMenu: (state, action: PayloadAction<Menu>) => {
      state.menus.push(action.payload);
    },
    updateMenu: (state, action: PayloadAction<Menu>) => {
      const index = state.menus.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.menus[index] = action.payload;
      }
      if (state.currentMenu?.id === action.payload.id) {
        state.currentMenu = action.payload;
      }
    },
    deleteMenu: (state, action: PayloadAction<string>) => {
      state.menus = state.menus.filter(m => m.id !== action.payload);
      if (state.currentMenu?.id === action.payload) {
        state.currentMenu = null;
      }
    },
    addMenuItem: (state, action: PayloadAction<MenuItem>) => {
      state.menuItems.push(action.payload);
    },
    updateMenuItem: (state, action: PayloadAction<MenuItem>) => {
      const index = state.menuItems.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.menuItems[index] = action.payload;
      }
    },
    deleteMenuItem: (state, action: PayloadAction<string>) => {
      state.menuItems = state.menuItems.filter(item => item.id !== action.payload);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setMenus,
  setCurrentMenu,
  setMenuItems,
  setOCRResult,
  setAllergenDetectionResult,
  addMenu,
  updateMenu,
  deleteMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  setError,
  clearError,
} = menuSlice.actions;

export default menuSlice.reducer;