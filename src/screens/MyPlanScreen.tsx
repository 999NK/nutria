import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../hooks/useAuth';

interface MealPlan {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: {
    name: string;
    quantity: string;
    calories: number;
  }[];
  totalCalories: number;
}

const MyPlanScreen = () => {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState(0);

  const daysOfWeek = [
    'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
  ];

  const mealTypes = [
    { key: 'breakfast', label: 'Café da Manhã', icon: 'wb-sunny', color: '#F59E0B' },
    { key: 'lunch', label: 'Almoço', icon: 'restaurant', color: '#10B981' },
    { key: 'dinner', label: 'Jantar', icon: 'dinner-dining', color: '#3B82F6' },
    { key: 'snack', label: 'Lanches', icon: 'local-cafe', color: '#8B5CF6' },
  ];

  // Mock data para demonstração
  const weeklyPlan: MealPlan[] = [
    {
      id: '1',
      mealType: 'breakfast',
      foods: [
        { name: 'Aveia com frutas', quantity: '1 tigela', calories: 320 },
        { name: 'Café com leite', quantity: '1 xícara', calories: 80 },
      ],
      totalCalories: 400,
    },
    {
      id: '2',
      mealType: 'lunch',
      foods: [
        { name: 'Peito de frango grelhado', quantity: '150g', calories: 248 },
        { name: 'Arroz integral', quantity: '100g', calories: 111 },
        { name: 'Feijão carioca', quantity: '80g', calories: 76 },
        { name: 'Salada verde', quantity: '1 prato', calories: 25 },
      ],
      totalCalories: 460,
    },
    {
      id: '3',
      mealType: 'dinner',
      foods: [
        { name: 'Salmão grelhado', quantity: '120g', calories: 248 },
        { name: 'Batata doce assada', quantity: '150g', calories: 129 },
        { name: 'Brócolis refogado', quantity: '100g', calories: 34 },
      ],
      totalCalories: 411,
    },
    {
      id: '4',
      mealType: 'snack',
      foods: [
        { name: 'Iogurte grego', quantity: '150g', calories: 130 },
        { name: 'Castanhas', quantity: '30g', calories: 185 },
      ],
      totalCalories: 315,
    },
  ];

  const totalDailyCalories = weeklyPlan.reduce((sum, meal) => sum + meal.totalCalories, 0);

  const renderMealPlan = ({ item }: { item: MealPlan }) => {
    const mealTypeInfo = mealTypes.find(type => type.key === item.mealType);
    
    return (
      <View style={styles.mealCard}>
        <View style={styles.mealHeader}>
          <View style={styles.mealTitleContainer}>
            <View style={[styles.mealIcon, { backgroundColor: mealTypeInfo?.color }]}>
              <Icon name={mealTypeInfo?.icon || 'restaurant'} size={20} color="#fff" />
            </View>
            <Text style={styles.mealTitle}>{mealTypeInfo?.label}</Text>
          </View>
          <Text style={styles.mealCalories}>{item.totalCalories} kcal</Text>
        </View>
        
        <View style={styles.foodsList}>
          {item.foods.map((food, index) => (
            <View key={index} style={styles.foodItem}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodQuantity}>{food.quantity}</Text>
              </View>
              <Text style={styles.foodCalories}>{food.calories} kcal</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity style={styles.editButton}>
          <Icon name="edit" size={16} color="#10B981" />
          <Text style={styles.editButtonText}>Editar refeição</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Plano Nutricional</Text>
        <Text style={styles.subtitle}>Planeje suas refeições da semana</Text>
      </View>

      {/* Seletor de Dias */}
      <View style={styles.daySelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {daysOfWeek.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayButton,
                selectedDay === index && styles.dayButtonActive,
              ]}
              onPress={() => setSelectedDay(index)}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  selectedDay === index && styles.dayButtonTextActive,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Resumo do Dia */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Resumo do Dia</Text>
          <Text style={styles.summaryDate}>{daysOfWeek[selectedDay]}</Text>
        </View>
        
        <View style={styles.caloriesContainer}>
          <View style={styles.caloriesInfo}>
            <Text style={styles.caloriesLabel}>Total de Calorias</Text>
            <Text style={styles.caloriesValue}>{totalDailyCalories} kcal</Text>
          </View>
          <View style={styles.caloriesTarget}>
            <Text style={styles.targetLabel}>Meta Diária</Text>
            <Text style={styles.targetValue}>{user?.dailyCalories || 2000} kcal</Text>
          </View>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min((totalDailyCalories / (user?.dailyCalories || 2000)) * 100, 100)}%`,
                backgroundColor: totalDailyCalories > (user?.dailyCalories || 2000) ? '#EF4444' : '#10B981'
              }
            ]} 
          />
        </View>
        
        <View style={styles.macroSummary}>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Proteína</Text>
            <Text style={styles.macroValue}>85g</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Carboidratos</Text>
            <Text style={styles.macroValue}>180g</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Gordura</Text>
            <Text style={styles.macroValue}>65g</Text>
          </View>
        </View>
      </View>

      {/* Plano de Refeições */}
      <View style={styles.mealsSection}>
        <Text style={styles.sectionTitle}>Refeições Planejadas</Text>
        <FlatList
          data={weeklyPlan}
          renderItem={renderMealPlan}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* Ações */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="auto-awesome" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Gerar Plano com IA</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
          <Icon name="share" size={24} color="#10B981" />
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
            Compartilhar Plano
          </Text>
        </TouchableOpacity>
      </View>
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
  daySelector: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  dayButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dayButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  dayButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  dayButtonTextActive: {
    color: '#fff',
  },
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  summaryDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  caloriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  caloriesInfo: {
    flex: 1,
  },
  caloriesLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  caloriesValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
  },
  caloriesTarget: {
    alignItems: 'flex-end',
  },
  targetLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  targetValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  macroSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  mealsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  mealCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  foodsList: {
    marginBottom: 16,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 2,
  },
  foodQuantity: {
    fontSize: 12,
    color: '#6b7280',
  },
  foodCalories: {
    fontSize: 14,
    color: '#6b7280',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: '#10B981',
    marginLeft: 4,
    fontWeight: '500',
  },
  actionsSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  actionButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#10B981',
  },
});

export default MyPlanScreen;

