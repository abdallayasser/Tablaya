import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useSelector } from 'react-redux';
import { COLORS, SIZES, SHADOWS } from '../../config/theme';
import { RootState } from '../../store';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import { getRestaurantsByOwnerId } from '../../services/restaurantService';
import { createMenu, uploadMenuFile } from '../../services/menuService';
import { processImageForOCR, processPDFForOCR } from '../../services/ocrService';
import { Restaurant, OCRResult } from '../../types';

const MenuUploadScreen = ({ navigation, route }: any) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(route.params?.restaurantId || '');
  const [menuName, setMenuName] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [menuFile, setMenuFile] = useState<{ uri: string; type: string; name: string } | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingOcr, setProcessingOcr] = useState(false);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchOwnerRestaurants();
    }
  }, [user]);

  const fetchOwnerRestaurants = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingRestaurants(true);
      const ownerRestaurants = await getRestaurantsByOwnerId(user.id);
      setRestaurants(ownerRestaurants);
      
      // If no restaurant is selected and we have restaurants, select the first one
      if (!selectedRestaurantId && ownerRestaurants.length > 0) {
        setSelectedRestaurantId(ownerRestaurants[0].id);
      }
      
      setLoadingRestaurants(false);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setLoadingRestaurants(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setMenuFile({
          uri: asset.uri,
          type: 'image/jpeg',
          name: 'menu_image.jpg',
        });
        
        // Reset OCR result when new file is picked
        setOcrResult(null);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      
      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setMenuFile({
          uri: asset.uri,
          type: 'application/pdf',
          name: asset.name || 'menu.pdf',
        });
        
        // Reset OCR result when new file is picked
        setOcrResult(null);
      }
    } catch (error) {
      console.error('Error picking PDF:', error);
      Alert.alert('Error', 'Failed to pick PDF. Please try again.');
    }
  };

  const processOCR = async () => {
    if (!menuFile) {
      Alert.alert('Error', 'Please upload a menu file first');
      return;
    }
    
    try {
      setProcessingOcr(true);
      
      let result: OCRResult;
      if (menuFile.type.includes('image')) {
        result = await processImageForOCR(menuFile.uri);
      } else if (menuFile.type.includes('pdf')) {
        result = await processPDFForOCR(menuFile.uri);
      } else {
        throw new Error('Unsupported file type');
      }
      
      setOcrResult(result);
      setProcessingOcr(false);
    } catch (error) {
      console.error('OCR processing error:', error);
      setProcessingOcr(false);
      Alert.alert('OCR Error', 'Failed to process the menu. Please try again or upload a clearer image/PDF.');
    }
  };

  const handleUpload = async () => {
    if (!selectedRestaurantId) {
      Alert.alert('Error', 'Please select a restaurant');
      return;
    }
    
    if (!menuName) {
      Alert.alert('Error', 'Please enter a menu name');
      return;
    }
    
    if (!menuFile) {
      Alert.alert('Error', 'Please upload a menu file');
      return;
    }
    
    try {
      setLoading(true);
      
      // Create menu in database
      const menuData = {
        restaurantId: selectedRestaurantId,
        name: menuName,
        description: menuDescription,
        status: 'draft',
        ocrText: ocrResult?.text || '',
        views: 0,
      };
      
      const menuId = await createMenu(menuData);
      
      // Upload menu file
      const fileType = menuFile.type.includes('image') ? 'jpg' : 'pdf';
      await uploadMenuFile(selectedRestaurantId, menuId, menuFile.uri, fileType);
      
      setLoading(false);
      
      // Navigate to menu editor with OCR result
      navigation.navigate('MenuEditor', {
        menuId,
        restaurantId: selectedRestaurantId,
        ocrText: ocrResult?.text || '',
      });
    } catch (error) {
      console.error('Upload error:', error);
      setLoading(false);
      Alert.alert('Upload Error', 'Failed to upload menu. Please try again.');
    }
  };

  if (loadingRestaurants) {
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
        <Text style={styles.headerTitle}>Upload Menu</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <Card style={styles.formCard}>
        <Text style={styles.sectionTitle}>Menu Details</Text>
        
        <Text style={styles.label}>Select Restaurant</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.restaurantList}
        >
          {restaurants.length > 0 ? (
            restaurants.map(restaurant => (
              <TouchableOpacity
                key={restaurant.id}
                style={[
                  styles.restaurantItem,
                  selectedRestaurantId === restaurant.id && styles.selectedRestaurant,
                ]}
                onPress={() => setSelectedRestaurantId(restaurant.id)}
              >
                <Text
                  style={[
                    styles.restaurantName,
                    selectedRestaurantId === restaurant.id && styles.selectedRestaurantText,
                  ]}
                >
                  {restaurant.name}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noRestaurantsText}>
              No restaurants found. Please add a restaurant first.
            </Text>
          )}
        </ScrollView>
        
        <Input
          label="Menu Name"
          placeholder="e.g., Dinner Menu, Lunch Specials"
          value={menuName}
          onChangeText={setMenuName}
        />
        
        <Input
          label="Description (Optional)"
          placeholder="Brief description of this menu"
          value={menuDescription}
          onChangeText={setMenuDescription}
          multiline
          numberOfLines={3}
        />
      </Card>
      
      <Card style={styles.uploadCard}>
        <Text style={styles.sectionTitle}>Upload Menu File</Text>
        <Text style={styles.uploadInstructions}>
          Upload your menu as an image or PDF file. We'll use OCR technology to extract the text.
        </Text>
        
        <View style={styles.uploadButtons}>
          <Button
            title="Upload Image"
            onPress={pickImage}
            variant="secondary"
            style={styles.uploadButton}
          />
          <Button
            title="Upload PDF"
            onPress={pickPDF}
            variant="secondary"
            style={styles.uploadButton}
          />
        </View>
        
        {menuFile && (
          <View style={styles.filePreview}>
            <Text style={styles.fileNameText}>
              {menuFile.name || 'Selected file'}
            </Text>
            
            {menuFile.type.includes('image') && (
              <Image
                source={{ uri: menuFile.uri }}
                style={styles.imagePreview}
                resizeMode="contain"
              />
            )}
            
            {menuFile.type.includes('pdf') && (
              <View style={styles.pdfPreview}>
                <Text style={styles.pdfIcon}>PDF</Text>
              </View>
            )}
            
            <Button
              title={ocrResult ? 'Re-Process with OCR' : 'Process with OCR'}
              onPress={processOCR}
              loading={processingOcr}
              style={styles.ocrButton}
            />
          </View>
        )}
        
        {ocrResult && (
          <View style={styles.ocrResultContainer}>
            <Text style={styles.ocrResultTitle}>OCR Result</Text>
            <Text style={styles.ocrConfidence}>
              Confidence: {Math.round(ocrResult.confidence * 100)}%
            </Text>
            <ScrollView style={styles.ocrTextContainer}>
              <Text style={styles.ocrText}>{ocrResult.text}</Text>
            </ScrollView>
            <Text style={styles.ocrNote}>
              You'll be able to edit this text in the next step.
            </Text>
          </View>
        )}
      </Card>
      
      <Button
        title="Continue to Menu Editor"
        onPress={handleUpload}
        loading={loading}
        disabled={!menuFile || !menuName || !selectedRestaurantId}
        style={styles.continueButton}
      />
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
  formCard: {
    marginBottom: SIZES.large,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SIZES.medium,
  },
  label: {
    fontSize: SIZES.font,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: SIZES.small,
  },
  restaurantList: {
    paddingBottom: SIZES.medium,
  },
  restaurantItem: {
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: SIZES.small,
    marginRight: SIZES.medium,
    marginBottom: SIZES.small,
  },
  selectedRestaurant: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  restaurantName: {
    fontSize: SIZES.font,
    color: COLORS.text.primary,
  },
  selectedRestaurantText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  noRestaurantsText: {
    fontSize: SIZES.medium,
    color: COLORS.text.light,
    padding: SIZES.medium,
  },
  uploadCard: {
    marginBottom: SIZES.large,
  },
  uploadInstructions: {
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: SIZES.medium,
  },
  uploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
  uploadButton: {
    flex: 1,
    marginHorizontal: SIZES.small / 2,
  },
  filePreview: {
    alignItems: 'center',
    marginVertical: SIZES.medium,
  },
  fileNameText: {
    fontSize: SIZES.font,
    color: COLORS.text.primary,
    marginBottom: SIZES.medium,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.small,
    marginBottom: SIZES.medium,
  },
  pdfPreview: {
    width: 100,
    height: 120,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.small,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.medium,
  },
  pdfIcon: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  ocrButton: {
    minWidth: 200,
  },
  ocrResultContainer: {
    marginTop: SIZES.large,
    padding: SIZES.medium,
    backgroundColor: COLORS.background.secondary,
    borderRadius: SIZES.small,
  },
  ocrResultTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SIZES.small,
  },
  ocrConfidence: {
    fontSize: SIZES.font,
    color: COLORS.accent,
    marginBottom: SIZES.medium,
  },
  ocrTextContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  ocrText: {
    fontSize: SIZES.font,
    color: COLORS.text.primary,
    lineHeight: 22,
  },
  ocrNote: {
    fontSize: SIZES.small,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
  },
  continueButton: {
    marginBottom: SIZES.xlarge,
  },
});

export default MenuUploadScreen;