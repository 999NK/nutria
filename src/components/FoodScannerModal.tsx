import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CameraService, { ImageResult } from '../services/CameraService';

interface FoodScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onFoodDetected: (food: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => void;
}

const FoodScannerModal: React.FC<FoodScannerModalProps> = ({
  visible,
  onClose,
  onFoodDetected,
}) => {
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleImageSelection = async () => {
    try {
      const image = await CameraService.showImagePickerOptions();
      if (image) {
        setSelectedImage(image);
        setAnalysisResult(null);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const result = await CameraService.analyzeFood(selectedImage.uri);
      if (result) {
        setAnalysisResult(result);
      } else {
        Alert.alert(
          'Análise Incompleta',
          'Não foi possível identificar o alimento na imagem. Tente uma foto mais clara.'
        );
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao analisar a imagem');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmFood = () => {
    if (analysisResult) {
      onFoodDetected({
        name: analysisResult.foodName,
        calories: analysisResult.calories,
        protein: analysisResult.nutrients.protein,
        carbs: analysisResult.nutrients.carbs,
        fat: analysisResult.nutrients.fat,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Escanear Alimento</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {!selectedImage ? (
            <View style={styles.emptyState}>
              <View style={styles.cameraIcon}>
                <Icon name="camera-alt" size={48} color="#10B981" />
              </View>
              <Text style={styles.emptyTitle}>Tire uma foto do seu alimento</Text>
              <Text style={styles.emptySubtitle}>
                Nossa IA irá identificar o alimento e calcular as informações nutricionais
              </Text>
              <TouchableOpacity
                style={styles.selectImageButton}
                onPress={handleImageSelection}
              >
                <Icon name="add-a-photo" size={20} color="#fff" />
                <Text style={styles.selectImageText}>Selecionar Imagem</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
              
              {!analysisResult && !isAnalyzing && (
                <View style={styles.analyzeContainer}>
                  <TouchableOpacity
                    style={styles.analyzeButton}
                    onPress={handleAnalyzeImage}
                  >
                    <Icon name="search" size={20} color="#fff" />
                    <Text style={styles.analyzeButtonText}>Analisar Alimento</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.retakeButton}
                    onPress={() => setSelectedImage(null)}
                  >
                    <Text style={styles.retakeButtonText}>Escolher Outra Foto</Text>
                  </TouchableOpacity>
                </View>
              )}

              {isAnalyzing && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#10B981" />
                  <Text style={styles.loadingText}>Analisando imagem...</Text>
                  <Text style={styles.loadingSubtext}>
                    Nossa IA está identificando o alimento
                  </Text>
                </View>
              )}

              {analysisResult && (
                <View style={styles.resultContainer}>
                  <View style={styles.resultHeader}>
                    <Icon name="check-circle" size={24} color="#10B981" />
                    <Text style={styles.resultTitle}>Alimento Identificado!</Text>
                  </View>
                  
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{analysisResult.foodName}</Text>
                    <Text style={styles.confidence}>
                      Confiança: {Math.round(analysisResult.confidence * 100)}%
                    </Text>
                  </View>

                  <View style={styles.nutritionInfo}>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Calorias</Text>
                      <Text style={styles.nutritionValue}>{analysisResult.calories}</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Proteína</Text>
                      <Text style={styles.nutritionValue}>{analysisResult.nutrients.protein}g</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Carboidratos</Text>
                      <Text style={styles.nutritionValue}>{analysisResult.nutrients.carbs}g</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Gordura</Text>
                      <Text style={styles.nutritionValue}>{analysisResult.nutrients.fat}g</Text>
                    </View>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={handleConfirmFood}
                    >
                      <Icon name="add" size={20} color="#fff" />
                      <Text style={styles.confirmButtonText}>Adicionar à Refeição</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.retryButton}
                      onPress={() => {
                        setAnalysisResult(null);
                        setSelectedImage(null);
                      }}
                    >
                      <Text style={styles.retryButtonText}>Tentar Novamente</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  selectImageButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  selectImageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  imageContainer: {
    flex: 1,
  },
  selectedImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: 20,
  },
  analyzeContainer: {
    alignItems: 'center',
  },
  analyzeButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  retakeButton: {
    paddingVertical: 12,
  },
  retakeButtonText: {
    color: '#6b7280',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  resultContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  foodInfo: {
    marginBottom: 20,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  confidence: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  nutritionInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  nutritionItem: {
    width: '50%',
    marginBottom: 12,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  actionButtons: {
    gap: 12,
  },
  confirmButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  retryButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  retryButtonText: {
    color: '#6b7280',
    fontSize: 16,
  },
});

export default FoodScannerModal;

