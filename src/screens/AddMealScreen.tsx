import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Food, Meal } from '../types';

const AddMealScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [quantity, setQuantity] = useState('1');
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  // Mock data para demonstração
  const mockFoods: Food[] = [
    {
      id: '1',
      name: 'Banana',
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
      servingSize: '1 unidade média (118g)',
      category: 'Frutas',
    },
    {
      id: '2',
      name: 'Peito de Frango Grelhado',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      servingSize: '100g',
      category: 'Proteínas',
    },
    {
      id: '3',
      name: 'Arroz Integral Cozido',
      calories: 111,
      protein: 2.6,
      carbs: 23,
      fat: 0.9,
      servingSize: '100g',
      category: 'Carboidratos',
    },
    {
      id: '4',
      name: 'Aveia',
      calories: 389,
      protein: 16.9,
      carbs: 66.3,
      fat: 6.9,
      servingSize: '100g',
      category: 'Cereais',
    },
  ];

  const mealTypes = [
    { key: 'breakfast', label: 'Café da Manhã', icon: 'wb-sunny' },
    { key: 'lunch', label: 'Almoço', icon: 'restaurant' },
    { key: 'dinner', label: 'Jantar', icon: 'dinner-dining' },
    { key: 'snack', label: 'Lanche', icon: 'local-cafe' },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const filtered = mockFoods.filter(food =>
        food.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
    setSearchResults([]);
    setSearchQuery(food.name);
  };

  const handleAddMeal = () => {
    if (!selectedFood) {
      Alert.alert('Erro', 'Selecione um alimento');
      return;
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      Alert.alert('Erro', 'Informe uma quantidade válida');
      return;
    }

    const quantityNum = parseFloat(quantity);
    const totalCalories = Math.round(selectedFood.calories * quantityNum);
    const totalProtein = Math.round(selectedFood.protein * quantityNum * 10) / 10;
    const totalCarbs = Math.round(selectedFood.carbs * quantityNum * 10) / 10;
    const totalFat = Math.round(selectedFood.fat * quantityNum * 10) / 10;

    Alert.alert(
      'Refeição Adicionada',
      `${selectedFood.name} (${quantity}x) foi adicionada ao seu ${mealTypes.find(m => m.key === selectedMealType)?.label}.\n\nCalorias: ${totalCalories}\nProteína: ${totalProtein}g\nCarboidratos: ${totalCarbs}g\nGordura: ${totalFat}g`,
      [
        {
          text: 'OK',
          onPress: () => {
            setSelectedFood(null);
            setSearchQuery('');
            setQuantity('1');
          },
        },
      ]
    );
  };

  const renderFoodItem = ({ item }: { item: Food }) => (
    <TouchableOpacity
      style={styles.foodItem}
      onPress={() => handleSelectFood(item)}
    >
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodDetails}>
          {item.calories} kcal • {item.servingSize}
        </Text>
        <Text style={styles.foodCategory}>{item.category}</Text>
      </View>
      <View style={styles.foodNutrition}>
        <Text style={styles.nutritionText}>P: {item.protein}g</Text>
        <Text style={styles.nutritionText}>C: {item.carbs}g</Text>
        <Text style={styles.nutritionText}>G: {item.fat}g</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Adicionar Refeição</Text>
        <Text style={styles.subtitle}>Registre o que você comeu</Text>
      </View>

      {/* Tipo de Refeição */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipo de Refeição</Text>
        <View style={styles.mealTypeContainer}>
          {mealTypes.map((mealType) => (
            <TouchableOpacity
              key={mealType.key}
              style={[
                styles.mealTypeButton,
                selectedMealType === mealType.key && styles.mealTypeButtonActive,
              ]}
              onPress={() => setSelectedMealType(mealType.key as any)}
            >
              <Icon
                name={mealType.icon}
                size={24}
                color={selectedMealType === mealType.key ? '#fff' : '#6b7280'}
              />
              <Text
                style={[
                  styles.mealTypeText,
                  selectedMealType === mealType.key && styles.mealTypeTextActive,
                ]}
              >
                {mealType.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Buscar Alimento */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buscar Alimento</Text>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Digite o nome do alimento..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {searchResults.length > 0 && (
          <View style={styles.searchResults}>
            <FlatList
              data={searchResults}
              renderItem={renderFoodItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}
      </View>

      {/* Alimento Selecionado */}
      {selectedFood && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alimento Selecionado</Text>
          <View style={styles.selectedFoodCard}>
            <Text style={styles.selectedFoodName}>{selectedFood.name}</Text>
            <Text style={styles.selectedFoodServing}>{selectedFood.servingSize}</Text>
            
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Calorias</Text>
                <Text style={styles.nutritionValue}>{selectedFood.calories}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Proteína</Text>
                <Text style={styles.nutritionValue}>{selectedFood.protein}g</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Carboidratos</Text>
                <Text style={styles.nutritionValue}>{selectedFood.carbs}g</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Gordura</Text>
                <Text style={styles.nutritionValue}>{selectedFood.fat}g</Text>
              </View>
            </View>

            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Quantidade</Text>
              <TextInput
                style={styles.quantityInput}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="1"
              />
              <Text style={styles.quantityUnit}>porção(ões)</Text>
            </View>
          </View>
        </View>
      )}

      {/* Botão Adicionar */}
      {selectedFood && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddMeal}>
            <Icon name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Adicionar Refeição</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mealTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: '45%',
  },
  mealTypeButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  mealTypeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  mealTypeTextActive: {
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1f2937',
  },
  searchResults: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  foodItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  foodDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  foodCategory: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  foodNutrition: {
    alignItems: 'flex-end',
  },
  nutritionText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  selectedFoodCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedFoodName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  selectedFoodServing: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#1f2937',
    marginRight: 12,
  },
  quantityInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: 60,
    textAlign: 'center',
  },
  quantityUnit: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 12,
  },
  buttonContainer: {
    padding: 24,
  },
  addButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default AddMealScreen;

