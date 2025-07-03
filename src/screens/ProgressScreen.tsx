import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width: screenWidth } = Dimensions.get('window');

const ProgressScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
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

  const weightData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        data: [75.2, 75.0, 74.8, 74.9, 74.7, 74.5, 74.3],
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const caloriesData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        data: [1850, 1920, 1780, 1950, 1820, 2100, 1890],
      },
    ],
  };

  const macroData = {
    labels: ['Proteína', 'Carboidratos', 'Gordura'],
    datasets: [
      {
        data: [25, 45, 30], // Percentuais
      },
    ],
  };

  const periods = [
    { key: 'week', label: 'Semana' },
    { key: 'month', label: 'Mês' },
    { key: 'year', label: 'Ano' },
  ];

  const stats = [
    {
      title: 'Peso Atual',
      value: '74.3 kg',
      change: '-0.9 kg',
      changeType: 'positive',
      icon: 'monitor-weight',
      color: '#10B981',
    },
    {
      title: 'Média de Calorias',
      value: '1887 kcal',
      change: '+87 kcal',
      changeType: 'neutral',
      icon: 'local-fire-department',
      color: '#F59E0B',
    },
    {
      title: 'Dias Consistentes',
      value: '6/7 dias',
      change: '85%',
      changeType: 'positive',
      icon: 'check-circle',
      color: '#3B82F6',
    },
    {
      title: 'Meta Atingida',
      value: '5/7 dias',
      change: '71%',
      changeType: 'positive',
      icon: 'flag',
      color: '#8B5CF6',
    },
  ];

  const achievements = [
    {
      title: 'Primeira Semana',
      description: 'Completou sua primeira semana de acompanhamento',
      icon: 'emoji-events',
      color: '#F59E0B',
      unlocked: true,
    },
    {
      title: 'Meta Diária',
      description: 'Atingiu sua meta de calorias por 5 dias seguidos',
      icon: 'stars',
      color: '#10B981',
      unlocked: true,
    },
    {
      title: 'Consistência',
      description: 'Registrou refeições por 30 dias consecutivos',
      icon: 'trending-up',
      color: '#3B82F6',
      unlocked: false,
    },
    {
      title: 'Objetivo Alcançado',
      description: 'Perdeu 5kg desde o início',
      icon: 'workspace-premium',
      color: '#8B5CF6',
      unlocked: false,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Progresso</Text>
        <Text style={styles.subtitle}>Acompanhe sua evolução</Text>
      </View>

      {/* Seletor de Período */}
      <View style={styles.periodSelector}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.periodButton,
              selectedPeriod === period.key && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period.key as any)}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period.key && styles.periodButtonTextActive,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Estatísticas */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                <Icon name={stat.icon} size={20} color="#fff" />
              </View>
              <View style={styles.statChange}>
                <Text
                  style={[
                    styles.statChangeText,
                    stat.changeType === 'positive' && styles.positiveChange,
                    stat.changeType === 'negative' && styles.negativeChange,
                  ]}
                >
                  {stat.change}
                </Text>
              </View>
            </View>
            <Text style={styles.statTitle}>{stat.title}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>

      {/* Gráfico de Peso */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Evolução do Peso</Text>
        <LineChart
          data={weightData}
          width={screenWidth - 48}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Gráfico de Calorias */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Calorias Diárias</Text>
        <BarChart
          data={caloriesData}
          width={screenWidth - 48}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          }}
          style={styles.chart}
        />
      </View>

      {/* Conquistas */}
      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Conquistas</Text>
        <View style={styles.achievementsList}>
          {achievements.map((achievement, index) => (
            <View
              key={index}
              style={[
                styles.achievementCard,
                !achievement.unlocked && styles.achievementLocked,
              ]}
            >
              <View
                style={[
                  styles.achievementIcon,
                  { backgroundColor: achievement.unlocked ? achievement.color : '#e5e7eb' },
                ]}
              >
                <Icon
                  name={achievement.icon}
                  size={24}
                  color={achievement.unlocked ? '#fff' : '#9ca3af'}
                />
              </View>
              <View style={styles.achievementInfo}>
                <Text
                  style={[
                    styles.achievementTitle,
                    !achievement.unlocked && styles.achievementTitleLocked,
                  ]}
                >
                  {achievement.title}
                </Text>
                <Text
                  style={[
                    styles.achievementDescription,
                    !achievement.unlocked && styles.achievementDescriptionLocked,
                  ]}
                >
                  {achievement.description}
                </Text>
              </View>
              {achievement.unlocked && (
                <Icon name="check-circle" size={24} color="#10B981" />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Insights */}
      <View style={styles.insightsSection}>
        <Text style={styles.sectionTitle}>Insights da Semana</Text>
        <View style={styles.insightCard}>
          <Icon name="lightbulb" size={24} color="#F59E0B" />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Parabéns pelo progresso!</Text>
            <Text style={styles.insightText}>
              Você perdeu 0.9kg esta semana e manteve uma média de calorias adequada. 
              Continue assim para atingir sua meta!
            </Text>
          </View>
        </View>
        
        <View style={styles.insightCard}>
          <Icon name="trending-up" size={24} color="#10B981" />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Consistência em alta</Text>
            <Text style={styles.insightText}>
              Você registrou refeições em 6 dos 7 dias. Tente manter essa consistência 
              para melhores resultados.
            </Text>
          </View>
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
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: '1%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statChange: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statChangeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  positiveChange: {
    color: '#10B981',
  },
  negativeChange: {
    color: '#EF4444',
  },
  statTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  chartCard: {
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
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  achievementsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  achievementsList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  achievementTitleLocked: {
    color: '#9ca3af',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  achievementDescriptionLocked: {
    color: '#d1d5db',
  },
  insightsSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  insightContent: {
    flex: 1,
    marginLeft: 16,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default ProgressScreen;

