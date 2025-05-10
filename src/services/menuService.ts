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
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Menu, MenuItem, OCRResult, AIAllergenDetectionResult, AllergenType } from '../types';

// Get all menus for a restaurant
export const getMenusByRestaurantId = async (restaurantId: string): Promise<Menu[]> => {
  try {
    const q = query(collection(db, 'menus'), where('restaurantId', '==', restaurantId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Menu[];
  } catch (error) {
    throw error;
  }
};

// Get menu by ID
export const getMenuById = async (id: string): Promise<Menu | null> => {
  try {
    const docRef = doc(db, 'menus', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Menu;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Create a new menu
export const createMenu = async (
  menuData: Omit<Menu, 'id' | 'uploadDate' | 'updatedAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'menus'), {
      ...menuData,
      uploadDate: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Update menu
export const updateMenu = async (
  id: string,
  menuData: Partial<Menu>
): Promise<void> => {
  try {
    const menuRef = doc(db, 'menus', id);
    await updateDoc(menuRef, {
      ...menuData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};

// Delete menu
export const deleteMenu = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'menus', id));
  } catch (error) {
    throw error;
  }
};

// Upload menu file (PDF or image)
export const uploadMenuFile = async (
  restaurantId: string,
  menuId: string,
  fileUri: string,
  fileType: string
): Promise<string> => {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    
    const storageRef = ref(storage, `restaurants/${restaurantId}/menus/${menuId}/menu-file.${fileType}`);
    await uploadBytes(storageRef, blob);
    
    const downloadURL = await getDownloadURL(storageRef);
    
    // Update menu with file URL
    const menuRef = doc(db, 'menus', menuId);
    await updateDoc(menuRef, {
      fileUrl: downloadURL,
      updatedAt: serverTimestamp(),
    });
    
    return downloadURL;
  } catch (error) {
    throw error;
  }
};

// Perform OCR on menu file
export const performOCR = async (fileUrl: string): Promise<OCRResult> => {
  try {
    // In a real app, this would call a cloud function or external OCR API
    // For this example, we'll simulate an OCR result
    
    // Simulated API call to OCR service
    // const response = await fetch('https://api.ocr-service.com/extract', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ fileUrl }),
    // });
    // const data = await response.json();
    
    // Simulated OCR result
    const simulatedOCRResult: OCRResult = {
      text: "APPETIZERS\n" +
            "Garlic Bread - $5.99\n" +
            "Crispy bread with garlic butter and herbs\n" +
            "Mozzarella Sticks - $7.99\n" +
            "Served with marinara sauce\n" +
            "Chicken Wings - $10.99\n" +
            "Buffalo or BBQ sauce, served with blue cheese dressing\n\n" +
            "MAIN COURSES\n" +
            "Grilled Salmon - $18.99\n" +
            "Served with seasonal vegetables and rice\n" +
            "Fettuccine Alfredo - $14.99\n" +
            "Creamy parmesan sauce with fettuccine pasta\n" +
            "Add chicken +$3.99\n" +
            "Cheeseburger - $12.99\n" +
            "Angus beef, cheddar cheese, lettuce, tomato, onion, served with fries",
      confidence: 0.92,
    };
    
    return simulatedOCRResult;
  } catch (error) {
    throw error;
  }
};

// Detect allergens in menu text
export const detectAllergens = async (menuText: string): Promise<AIAllergenDetectionResult> => {
  try {
    // In a real app, this would call a cloud function or external AI API
    // For this example, we'll simulate an allergen detection result
    
    // Simulated API call to AI service
    // const response = await fetch('https://api.ai-service.com/detect-allergens', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ menuText }),
    // });
    // const data = await response.json();
    
    // Simulated allergen detection result
    const simulatedAllergenResult: AIAllergenDetectionResult = {
      allergens: [
        {
          type: 'dairy' as AllergenType,
          confidence: 0.95,
          mentions: ['blue cheese dressing', 'parmesan sauce', 'cheddar cheese'],
        },
        {
          type: 'gluten' as AllergenType,
          confidence: 0.92,
          mentions: ['bread', 'fettuccine pasta', 'burger bun'],
        },
        {
          type: 'seafood' as AllergenType,
          confidence: 0.98,
          mentions: ['salmon'],
        },
      ],
      menuItemsWithAllergens: [
        {
          itemName: 'Garlic Bread',
          allergens: ['gluten'],
        },
        {
          itemName: 'Chicken Wings',
          allergens: ['dairy'],
        },
        {
          itemName: 'Grilled Salmon',
          allergens: ['seafood'],
        },
        {
          itemName: 'Fettuccine Alfredo',
          allergens: ['dairy', 'gluten'],
        },
        {
          itemName: 'Cheeseburger',
          allergens: ['dairy', 'gluten'],
        },
      ],
    };
    
    return simulatedAllergenResult;
  } catch (error) {
    throw error;
  }
};

// Get all menu items for a menu
export const getMenuItemsByMenuId = async (menuId: string): Promise<MenuItem[]> => {
  try {
    const q = query(collection(db, 'menuItems'), where('menuId', '==', menuId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MenuItem[];
  } catch (error) {
    throw error;
  }
};

// Create menu items from OCR and allergen detection
export const createMenuItemsFromOCR = async (
  menuId: string,
  ocrText: string,
  allergenDetectionResult: AIAllergenDetectionResult
): Promise<string[]> => {
  try {
    const menuItemIds: string[] = [];
    
    // Parse OCR text to extract menu items
    // This is a simplified example - in a real app, you would use more sophisticated parsing
    const lines = ocrText.split('\n');
    let currentCategory = '';
    let currentItem: Partial<MenuItem> | null = null;
    
    for (const line of lines) {
      if (line.trim() === '') continue;
      
      // Check if line is a category header
      if (line.toUpperCase() === line && !line.includes('$')) {
        currentCategory = line.trim();
        continue;
      }
      
      // Check if line contains a menu item with price
      const priceMatch = line.match(/(.+)\s-\s\$(\d+\.\d+)/);
      if (priceMatch) {
        // Save previous item if exists
        if (currentItem && currentItem.name) {
          const docRef = await addDoc(collection(db, 'menuItems'), {
            ...currentItem,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          menuItemIds.push(docRef.id);
        }
        
        // Start new item
        const itemName = priceMatch[1].trim();
        const price = parseFloat(priceMatch[2]);
        
        // Find allergens for this item
        const itemAllergens = allergenDetectionResult.menuItemsWithAllergens
          .find(item => item.itemName === itemName)?.allergens || [];
        
        currentItem = {
          menuId,
          name: itemName,
          price,
          category: currentCategory,
          description: '',
          detectedAllergens: itemAllergens,
          tags: [],
          isAvailable: true,
        };
      } else if (currentItem) {
        // This line is likely a description for the current item
        currentItem.description = (currentItem.description || '') + line.trim() + ' ';
      }
    }
    
    // Save the last item
    if (currentItem && currentItem.name) {
      const docRef = await addDoc(collection(db, 'menuItems'), {
        ...currentItem,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      menuItemIds.push(docRef.id);
    }
    
    return menuItemIds;
  } catch (error) {
    throw error;
  }
};

// Create a new menu item
export const createMenuItem = async (
  menuItemData: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'menuItems'), {
      ...menuItemData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Update menu item
export const updateMenuItem = async (
  id: string,
  menuItemData: Partial<MenuItem>
): Promise<void> => {
  try {
    const menuItemRef = doc(db, 'menuItems', id);
    await updateDoc(menuItemRef, {
      ...menuItemData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};

// Delete menu item
export const deleteMenuItem = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'menuItems', id));
  } catch (error) {
    throw error;
  }
};