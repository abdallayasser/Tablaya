import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import { RootState } from '../../store';
import Button from '../../components/Button';
import Card from '../../components/Card';
import AllergenTag from '../../components/AllergenTag';
import { getMenuById, updateMenu, createMenuItemsFromOCR } from '../../services/menuService';
import { detectAllergens } from '../../services/allergenService';
import { Menu, AIAllergenDetectionResult, AllergenType } from '../../types';

const MenuEditorScreen = ({ navigation, route }: any) => {
  const { menuId, restaurantId, ocrText } = route.params;
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [menu, setMenu] = useState<Menu | null>(null);
  const [editedText, setEditedText] = useState(ocrText || '');
  const [allergenResult, setAllergenResult] = useState<AIAllergenDetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [detectingAllergens, setDetectingAllergens] = useState(false);
  const [savingMenu, setSavingMenu] = useState(false);
  
  useEffect(() => {
    if (menuId) {
      fetchMenuDetails();
    }
  }, [menuId]);
  
  const fetchMenuDetails = async () => {
    try {
      setLoading(true);
      const menuData = await getMenuById(menuId);
      setMenu(menuData);
      
      // If we have OCR text from the previous screen, use it
      // Otherwise, use the text from the menu
      if (!ocrText && menuData?.ocrText) {
        setEditedText(menuData.ocrText);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu details:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to load menu details. Please try again.');
    }
  };
  
  const handleDetectAllergens = async () => {
    if (!editedText) {
      Alert.alert('Error', 'Please enter menu text first');
      return;
    }
    
    try {
      setDetectingAllergens(true);
      const result = await detectAllergens(editedText);
      setAllergenResult(result);
      setDetectingAllergens(false);
    } catch (error) {
      console.error('Allergen detection error:', error);
      setDetectingAllergens(false);
      Alert.alert('Error', 'Failed to detect allergens. Please try again.');
    }
  };
  
  const handleSaveMenu = async () => {
    if (!menuId || !editedText) {
      Alert.alert('Error', 'Menu text cannot be empty');
      return;
    }
    
    try {
      setSavingMenu(true);
      
      // Update menu with edited text
      await updateMenu(menuId, {
        ocrText: editedText,
        status: 'published',
      });
      
      // If we have allergen detection results, create menu items
      if (allergenResult) {
        await createMenuItemsFromOCR(menuId, editedText, allergenResult);
      }
      
      setSavingMenu(false);
      
      Alert.alert(
        'Success',
        'Menu saved successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Menus'),
          },
        ]
      );
    } catch (error) {
      console.error('Save menu error:', error);
      setSavingMenu(false);
      Alert.alert('Error', 'Failed to save menu. Please try again.');
    }
  };
  
  const renderAllergenSummary = () => {
    if (!allergenResult || allergenResult.allergens.length === 0) {
      return (
        <Text style={styles.noAllergensText}>
          No allergens detected in the menu text.
        </Text>
      );
    }
    
    return (
      <View>
        <Text style={styles.allergenSummaryTitle}>
          Detected Allergens:
        </Text>
        
        <View style={styles.allergenTagsContainer}>
          {allergenResult.allergens.map((allergen, index) => (
            <View key={`${allergen.type}-${index}`} style={styles.allergenItem}>
              <AllergenTag allergen={allergen.type} size="medium" />
              <Text style={styles.allergenConfidence}>
                {Math.round(allergen.confidence * 100)}% confidence
              </Text>
            </View>
          ))}
        </View>
        
        <Text style={styles.allergenSummaryTitle}>
          Menu Items with Allergens:
        </Text>
        
        {allergenResult.menuItemsWithAllergens.map((item, index) => (
          <View key={`item-${index}`} style={styles.menuItemAllergen}>
            <Text style={styles.menuItemName}>{item.itemName}</Text>
            <View style={styles.menuItemAllergenTags}>
              {item.allergens.map((allergen, i) => (
                <AllergenTag
                  key={`${allergen}-${i}`}
                  allergen={allergen}
                  size="small"
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu Editor</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <Card style={styles.editorCard}>
        <Text style={styles.sectionTitle}>Edit Menu Text</Text>
        <Text style={styles.editorInstructions}>
          Review and edit the text extracted from your menu. Make any necessary corrections before proceeding.
        </Text>
        
        <View style={styles.textEditorContainer}>
          <TextInput
            style={styles.textEditor}
            value={editedText}
            onChangeText={setEditedText}
            multiline
            placeholder="Menu text appears here..."
            placeholderTextColor={COLORS.text.light}
          />
        </View>
        
        <Button
          title="Detect Allergens"
          onPress={handleDetectAllergens}
          loading={detectingAllergens}
          style={styles.detectButton}
        />
      </Card>
      
      {allergenResult && (
        <Card style={styles.allergenCard}>
          <Text style={styles.sectionTitle}>Allergen Detection</Text>
          <Text style={styles.allergenInstructions}>
            Our AI has analyzed your menu and detected the following allergens. Review and confirm these findings.
          </Text>
          
          {renderAllergenSummary()}
        </Card>
      )}
      
      <View style={styles.actionButtons}>
        <Button
          title="Save as Draft"
          onPress={() => Alert.alert('Feature', 'Save as Draft feature would be implemented here')}
          variant="secondary"
          style={styles.actionButton}
        />
        
        <Button
          title="Publish Menu"
          onPress={handleSaveMenu}
          loading={savingMenu}
          style={styles.actionButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  contentContainer: {
    padding: SIZES.large,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.large,
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
  editorCard: {
    marginBottom: SIZES.large,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SIZES.medium,
  },
  editorInstructions: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: SIZES.medium,
  },
  textEditorContainer: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: SIZES.small,
    marginBottom: SIZES.medium,
  },
  textEditor: {
    minHeight: 200,
    padding: SIZES.medium,
    fontSize: SIZES.font,
    color: COLORS.text.primary,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  detectButton: {
    alignSelf: 'center',
    minWidth: 200,
  },
  allergenCard: {
    marginBottom: SIZES.large,
  },
  allergenInstructions: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: SIZES.medium,
  },
  noAllergensText: {
    fontSize: SIZES.medium,
    color: COLORS.text.secondary,
    textAlign: 'center',
    padding: SIZES.large,
  },
  allergenSummaryTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginTop: SIZES.medium,
    marginBottom: SIZES.small,
  },
  allergenTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.medium,
  },
  allergenItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  allergenConfidence: {
    fontSize: SIZES.small,
    color: COLORS.text.secondary,
    marginTop: SIZES.small / 2,
  },
  menuItemAllergen: {
    marginBottom: SIZES.medium,
    padding: SIZES.small,
    backgroundColor: COLORS.background.secondary,
    borderRadius: SIZES.small,
  },
  menuItemName: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SIZES.small,
  },
  menuItemAllergenTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.xlarge,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: SIZES.small / 2,
  },
});

export default MenuEditorScreen;