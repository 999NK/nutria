import { Alert, Platform } from 'react-native';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export interface ImageResult {
  uri: string;
  fileName?: string;
  type?: string;
  fileSize?: number;
}

class CameraService {
  async requestCameraPermission(): Promise<boolean> {
    try {
      const permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.CAMERA 
        : PERMISSIONS.ANDROID.CAMERA;
      
      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Erro ao solicitar permissão da câmera:', error);
      return false;
    }
  }

  async requestGalleryPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
        const result = await request(permission);
        return result === RESULTS.GRANTED;
      }
      return true; // iOS não precisa de permissão para galeria
    } catch (error) {
      console.error('Erro ao solicitar permissão da galeria:', error);
      return false;
    }
  }

  async openCamera(): Promise<ImageResult | null> {
    try {
      const hasPermission = await this.requestCameraPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permissão Necessária',
          'É necessário permitir o acesso à câmera para tirar fotos.'
        );
        return null;
      }

      return new Promise((resolve) => {
        const options = {
          mediaType: 'photo' as MediaType,
          quality: 0.8,
          maxWidth: 1024,
          maxHeight: 1024,
        };

        launchCamera(options, (response: ImagePickerResponse) => {
          if (response.didCancel || response.errorMessage) {
            resolve(null);
            return;
          }

          if (response.assets && response.assets[0]) {
            const asset = response.assets[0];
            resolve({
              uri: asset.uri!,
              fileName: asset.fileName,
              type: asset.type,
              fileSize: asset.fileSize,
            });
          } else {
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('Erro ao abrir câmera:', error);
      Alert.alert('Erro', 'Não foi possível abrir a câmera');
      return null;
    }
  }

  async openGallery(): Promise<ImageResult | null> {
    try {
      const hasPermission = await this.requestGalleryPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permissão Necessária',
          'É necessário permitir o acesso à galeria para selecionar fotos.'
        );
        return null;
      }

      return new Promise((resolve) => {
        const options = {
          mediaType: 'photo' as MediaType,
          quality: 0.8,
          maxWidth: 1024,
          maxHeight: 1024,
        };

        launchImageLibrary(options, (response: ImagePickerResponse) => {
          if (response.didCancel || response.errorMessage) {
            resolve(null);
            return;
          }

          if (response.assets && response.assets[0]) {
            const asset = response.assets[0];
            resolve({
              uri: asset.uri!,
              fileName: asset.fileName,
              type: asset.type,
              fileSize: asset.fileSize,
            });
          } else {
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('Erro ao abrir galeria:', error);
      Alert.alert('Erro', 'Não foi possível abrir a galeria');
      return null;
    }
  }

  showImagePickerOptions(): Promise<ImageResult | null> {
    return new Promise((resolve) => {
      Alert.alert(
        'Selecionar Imagem',
        'Escolha uma opção:',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => resolve(null),
          },
          {
            text: 'Câmera',
            onPress: async () => {
              const result = await this.openCamera();
              resolve(result);
            },
          },
          {
            text: 'Galeria',
            onPress: async () => {
              const result = await this.openGallery();
              resolve(result);
            },
          },
        ]
      );
    });
  }

  // Simular análise de imagem com IA para reconhecimento de alimentos
  async analyzeFood(imageUri: string): Promise<{
    foodName: string;
    confidence: number;
    calories: number;
    nutrients: {
      protein: number;
      carbs: number;
      fat: number;
    };
  } | null> {
    try {
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock de resposta da IA
      const mockResults = [
        {
          foodName: 'Banana',
          confidence: 0.95,
          calories: 89,
          nutrients: { protein: 1.1, carbs: 22.8, fat: 0.3 },
        },
        {
          foodName: 'Maçã',
          confidence: 0.92,
          calories: 52,
          nutrients: { protein: 0.3, carbs: 13.8, fat: 0.2 },
        },
        {
          foodName: 'Pão Integral',
          confidence: 0.88,
          calories: 247,
          nutrients: { protein: 13.0, carbs: 41.0, fat: 4.2 },
        },
      ];

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      return randomResult;
    } catch (error) {
      console.error('Erro ao analisar imagem:', error);
      return null;
    }
  }
}

export default new CameraService();

