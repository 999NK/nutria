import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useAuth } from '../hooks/useAuth';
import { NutritionalDay } from '../types';

const { width: screenWidth } = Dimensions.get('window');

const DashboardScreen = () => {
  const { user } = useAuth();
  const [todayData, setTodayData] = useState<NutritionalDay>({
    date: new Date().toISOString().split('T')[0],
    totalCalories: 1250,
    totalProtein: 85,
    totalCarbs: 120,
    totalFat: 45,
    meals: [],
  });

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#10B981',
    },
  };

  const weeklyData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        data: [1800, 1650, 1900, 1750, 1600, 2100, 1850],
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const macroData = [
    {
      name: 'Proteína',
      population: todayData.totalProtein,
      color: '#10B981',
      legendFontColor: '#6b7280',
      legendFontSize: 12,
    },
    {
      name: 'Carboidratos',
      population: todayData.totalCarbs,
      color: '#3B82F6',
      legendFontColor: '#6b7280',
      legendFontSize: 12,
    },
    {
      name: 'Gorduras',
      population: todayData.totalFat,
      color: '#F59E0B',
      legendFontColor: '#6b7280',
      legendFontSize: 12,
    },
  ];

  const caloriesPercentage = user?.dailyCalories 
    ? (todayData.totalCalories / user.dailyCalories) * 100 
    : 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {user?.name}!</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {/* Resumo de Calorias */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Calorias de Hoje</Text>
          <Icon name="local-fire-department" size={24} color="#F59E0B" />
        </View>
        <View style={styles.caloriesContainer}>
          <Text style={styles.caloriesMain}>
            {todayData.totalCalories}
          </Text>
          <Text style={styles.caloriesTarget}>
            / {user?.dailyCalories || 2000} kcal
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${Math.min(caloriesPercentage, 100)}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(caloriesPercentage)}% da meta diária
        </Text>
      </View>

      {/* Macronutrientes */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Macronutrientes</Text>
        <View style={styles.macroGrid}>
          <View style={styles.macroItem}>
            <View style={[styles.macroIcon, { backgroundColor: '#10B981' }]}>
              <Icon name="fitness-center" size={20} color="#fff" />
            </View>
            <Text style={styles.macroLabel}>Proteína</Text>
            <Text style={styles.macroValue}>{todayData.totalProtein}g</Text>
            <Text style={styles.macroTarget}>/ {user?.dailyProtein || 150}g</Text>
          </View>
          <View style={styles.macroItem}>
            <View style={[styles.macroIcon, { backgroundColor: '#3B82F6' }]}>
              <Icon name="grain" size={20} color="#fff" />
            </View>
            <Text style={styles.macroLabel}>Carboidratos</Text>
            <Text style={styles.macroValue}>{todayData.totalCarbs}g</Text>
            <Text style={styles.macroTarget}>/ {user?.dailyCarbs || 250}g</Text>
          </View>
          <View style={styles.macroItem}>
            <View style={[styles.macroIcon, { backgroundColor: '#F59E0B' }]}>
              <Icon name="opacity" size={20} color="#fff" />
            </View>
            <Text style={styles.macroLabel}>Gorduras</Text>
            <Text style={styles.macroValue}>{todayData.totalFat}g</Text>
            <Text style={styles.macroTarget}>/ {user?.dailyFat || 67}g</Text>
          </View>
        </View>
      </View>

      {/* Gráfico Semanal */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Calorias da Semana</Text>
        <LineChart
          data={weeklyData}
          width={screenWidth - 48}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Distribuição de Macros */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Distribuição de Macros</Text>
        <PieChart
          data={macroData}
          width={screenWidth - 48}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </View>

      {/* Ações Rápidas */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ações Rápidas</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <Icon name="add-circle" size={32} color="#10B981" />
            <Text style={styles.quickActionText}>Adicionar Refeição</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Icon name="camera-alt" size={32} color="#3B82F6" />
            <Text style={styles.quickActionText}>Escanear Alimento</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Icon name="chat" size={32} color="#8B5CF6" />
            <Text style={styles.quickActionText}>Chat com IA</Text>
          </TouchableOpacity>
        </View>
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  caloriesMain: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#10B981',
  },
  caloriesTarget: {
    fontSize: 18,
    color: '#6b7280',
    marginLeft: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
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
  macroTarget: {
    fontSize: 12,
    color: '#6b7280',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default DashboardScreen;

