import { AIAllergenDetectionResult, AllergenType } from '../types';

// Common allergens and their related keywords
const ALLERGEN_KEYWORDS = {
  dairy: [
    'milk', 'cheese', 'butter', 'cream', 'yogurt', 'ice cream', 'custard', 'pudding',
    'whey', 'casein', 'lactose', 'ghee', 'curd', 'kefir', 'buttermilk', 'sour cream',
    'parmesan', 'mozzarella', 'cheddar', 'blue cheese', 'ricotta', 'brie', 'feta',
  ],
  nuts: [
    'almond', 'walnut', 'pecan', 'cashew', 'pistachio', 'hazelnut', 'macadamia',
    'pine nut', 'brazil nut', 'chestnut', 'nut', 'nuts', 'nutty', 'nut butter',
  ],
  gluten: [
    'wheat', 'barley', 'rye', 'oats', 'bread', 'pasta', 'flour', 'cereal', 'couscous',
    'bulgur', 'semolina', 'farina', 'durum', 'kamut', 'spelt', 'triticale', 'malt',
    'bun', 'roll', 'cracker', 'pizza', 'pastry', 'cake', 'cookie', 'pie crust',
    'biscuit', 'croissant', 'bagel', 'pretzel', 'noodle', 'spaghetti', 'fettuccine',
  ],
  seafood: [
    'fish', 'salmon', 'tuna', 'cod', 'halibut', 'trout', 'tilapia', 'sardine', 'anchovy',
    'shellfish', 'shrimp', 'prawn', 'crab', 'lobster', 'clam', 'mussel', 'oyster', 'scallop',
    'squid', 'calamari', 'octopus', 'seafood', 'fish sauce', 'fish oil', 'caviar', 'roe',
  ],
  soy: [
    'soy', 'soya', 'soybeans', 'soy sauce', 'tofu', 'tempeh', 'miso', 'edamame',
    'soy milk', 'soy protein', 'soy lecithin', 'textured vegetable protein', 'TVP',
  ],
  eggs: [
    'egg', 'eggs', 'yolk', 'white', 'albumin', 'mayonnaise', 'meringue', 'custard',
    'eggnog', 'quiche', 'frittata', 'omelet', 'egg wash', 'egg noodles',
  ],
  peanuts: [
    'peanut', 'peanuts', 'peanut butter', 'peanut oil', 'groundnut', 'arachis',
    'goober', 'monkey nut', 'beer nuts',
  ],
  wheat: [
    'wheat', 'flour', 'bread', 'pasta', 'couscous', 'bulgur', 'semolina', 'durum',
    'wheat germ', 'wheat bran', 'wheat starch', 'wheat protein', 'seitan',
  ],
};

// In a real application, this would connect to an AI service for allergen detection
// For this example, we'll simulate AI functionality using keyword matching

// Detect allergens in menu text
export const detectAllergens = async (menuText: string): Promise<AIAllergenDetectionResult> => {
  try {
    console.log('Detecting allergens in menu text');
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result: AIAllergenDetectionResult = {
      allergens: [],
      menuItemsWithAllergens: [],
    };
    
    // Extract menu items from text
    const menuItems = extractMenuItems(menuText);
    
    // Check for allergens in each menu item
    for (const item of menuItems) {
      const itemText = `${item.name} ${item.description}`.toLowerCase();
      const detectedAllergens: AllergenType[] = [];
      
      // Check for each allergen type
      for (const [allergenType, keywords] of Object.entries(ALLERGEN_KEYWORDS)) {
        const mentions: string[] = [];
        
        for (const keyword of keywords) {
          if (itemText.includes(keyword.toLowerCase())) {
            mentions.push(keyword);
          }
        }
        
        if (mentions.length > 0) {
          detectedAllergens.push(allergenType as AllergenType);
          
          // Add to overall allergens if not already present
          if (!result.allergens.some(a => a.type === allergenType)) {
            result.allergens.push({
              type: allergenType as AllergenType,
              confidence: 0.9, // Simulated confidence score
              mentions,
            });
          } else {
            // Update existing allergen entry with new mentions
            const allergenEntry = result.allergens.find(a => a.type === allergenType);
            if (allergenEntry) {
              allergenEntry.mentions = [...new Set([...allergenEntry.mentions, ...mentions])];
            }
          }
        }
      }
      
      if (detectedAllergens.length > 0) {
        result.menuItemsWithAllergens.push({
          itemName: item.name,
          allergens: detectedAllergens,
        });
      }
    }
    
    return result;
  } catch (error) {
    console.error('Allergen detection error:', error);
    throw error;
  }
};

// Extract menu items from text
function extractMenuItems(menuText: string): { name: string, description: string }[] {
  const items: { name: string, description: string }[] = [];
  const lines = menuText.split('\n');
  
  let currentItem: { name: string, description: string } | null = null;
  
  for (const line of lines) {
    if (line.trim() === '') continue;
    
    // Skip category headers (all caps lines without prices)
    if (line.toUpperCase() === line && !line.includes('$')) {
      continue;
    }
    
    // Check if line contains a menu item with price
    const priceMatch = line.match(/(.+)\s-\s\$(\d+\.\d+)/);
    if (priceMatch) {
      // Save previous item if exists
      if (currentItem) {
        items.push(currentItem);
      }
      
      // Start new item
      currentItem = {
        name: priceMatch[1].trim(),
        description: '',
      };
    } else if (currentItem) {
      // This line is likely a description for the current item
      currentItem.description += line.trim() + ' ';
    }
  }
  
  // Add the last item
  if (currentItem) {
    items.push(currentItem);
  }
  
  return items;
}

// Get allergen information for a specific allergen type
export const getAllergenInfo = (allergenType: AllergenType): { name: string, description: string, commonFoods: string[] } => {
  const allergenInfo = {
    dairy: {
      name: 'Dairy',
      description: 'Milk and products made from milk, such as cheese, yogurt, and butter.',
      commonFoods: ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Ice cream', 'Cream', 'Custard'],
    },
    nuts: {
      name: 'Tree Nuts',
      description: 'Includes various types of nuts grown on trees, such as almonds, walnuts, and cashews.',
      commonFoods: ['Almonds', 'Walnuts', 'Cashews', 'Pistachios', 'Hazelnuts', 'Pecans', 'Macadamia nuts'],
    },
    gluten: {
      name: 'Gluten',
      description: 'A protein found in wheat, barley, and rye that can cause adverse reactions in people with celiac disease or gluten sensitivity.',
      commonFoods: ['Bread', 'Pasta', 'Cereal', 'Beer', 'Crackers', 'Baked goods', 'Some sauces and gravies'],
    },
    seafood: {
      name: 'Seafood',
      description: 'Includes fish and shellfish, which are common allergens.',
      commonFoods: ['Fish', 'Shrimp', 'Crab', 'Lobster', 'Clams', 'Mussels', 'Oysters'],
    },
    soy: {
      name: 'Soy',
      description: 'Products made from soybeans, which are legumes.',
      commonFoods: ['Tofu', 'Soy milk', 'Soy sauce', 'Edamame', 'Miso', 'Tempeh', 'Many processed foods'],
    },
    eggs: {
      name: 'Eggs',
      description: 'Both egg whites and egg yolks can cause allergic reactions.',
      commonFoods: ['Eggs', 'Mayonnaise', 'Meringue', 'Some baked goods', 'Custards', 'Some pasta'],
    },
    wheat: {
      name: 'Wheat',
      description: 'One of the most common grains in the American diet.',
      commonFoods: ['Bread', 'Pasta', 'Cereal', 'Crackers', 'Baked goods', 'Beer', 'Some sauces'],
    },
    peanuts: {
      name: 'Peanuts',
      description: 'Legumes that grow underground, not true nuts, but one of the most common food allergens.',
      commonFoods: ['Peanuts', 'Peanut butter', 'Many candies', 'Some baked goods', 'Some Asian cuisine'],
    },
  };
  
  return allergenInfo[allergenType];
};