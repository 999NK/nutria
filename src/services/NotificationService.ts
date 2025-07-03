import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationSchedule {
  id: string;
  title: string;
  body: string;
  time: string; // HH:MM format
  enabled: boolean;
  type: 'meal' | 'water' | 'exercise' | 'custom';
}

class NotificationService {
  private storageKey = 'notification_schedules';

  async requestPermission(): Promise<boolean> {
    try {
      // Em um app real, usaria react-native-push-notification ou @react-native-async-storage/async-storage
      // Para esta demonstração, simularemos a permissão
      return new Promise((resolve) => {
        Alert.alert(
          'Notificações',
          'Deseja receber lembretes para suas refeições e hidratação?',
          [
            {
              text: 'Não',
              style: 'cancel',
              onPress: () => resolve(false),
            },
            {
              text: 'Sim',
              onPress: () => resolve(true),
            },
          ]
        );
      });
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificação:', error);
      return false;
    }
  }

  async scheduleNotification(notification: Omit<NotificationSchedule, 'id'>): Promise<string> {
    try {
      const id = Date.now().toString();
      const newNotification: NotificationSchedule = {
        ...notification,
        id,
      };

      const existingSchedules = await this.getScheduledNotifications();
      const updatedSchedules = [...existingSchedules, newNotification];
      
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(updatedSchedules));
      
      // Em um app real, aqui agendaria a notificação no sistema
      console.log('Notificação agendada:', newNotification);
      
      return id;
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      throw error;
    }
  }

  async getScheduledNotifications(): Promise<NotificationSchedule[]> {
    try {
      const stored = await AsyncStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao buscar notificações agendadas:', error);
      return [];
    }
  }

  async updateNotification(id: string, updates: Partial<NotificationSchedule>): Promise<void> {
    try {
      const schedules = await this.getScheduledNotifications();
      const updatedSchedules = schedules.map(schedule =>
        schedule.id === id ? { ...schedule, ...updates } : schedule
      );
      
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(updatedSchedules));
    } catch (error) {
      console.error('Erro ao atualizar notificação:', error);
      throw error;
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      const schedules = await this.getScheduledNotifications();
      const filteredSchedules = schedules.filter(schedule => schedule.id !== id);
      
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(filteredSchedules));
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      throw error;
    }
  }

  async setupDefaultNotifications(): Promise<void> {
    try {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) return;

      const defaultNotifications = [
        {
          title: 'Café da Manhã',
          body: 'Hora do café da manhã! Não esqueça de registrar sua refeição.',
          time: '08:00',
          enabled: true,
          type: 'meal' as const,
        },
        {
          title: 'Almoço',
          body: 'Hora do almoço! Lembre-se de fazer escolhas saudáveis.',
          time: '12:00',
          enabled: true,
          type: 'meal' as const,
        },
        {
          title: 'Jantar',
          body: 'Hora do jantar! Registre sua última refeição do dia.',
          time: '19:00',
          enabled: true,
          type: 'meal' as const,
        },
        {
          title: 'Hidratação',
          body: 'Lembre-se de beber água! Mantenha-se hidratado.',
          time: '15:00',
          enabled: true,
          type: 'water' as const,
        },
      ];

      for (const notification of defaultNotifications) {
        await this.scheduleNotification(notification);
      }
    } catch (error) {
      console.error('Erro ao configurar notificações padrão:', error);
    }
  }

  async sendImmediateNotification(title: string, body: string): Promise<void> {
    try {
      // Em um app real, enviaria uma notificação imediata
      Alert.alert(title, body);
    } catch (error) {
      console.error('Erro ao enviar notificação imediata:', error);
    }
  }

  // Simular notificações baseadas em metas
  async checkGoalsAndNotify(currentCalories: number, targetCalories: number): Promise<void> {
    const percentage = (currentCalories / targetCalories) * 100;
    
    if (percentage >= 100) {
      await this.sendImmediateNotification(
        'Meta Atingida! 🎉',
        'Parabéns! Você atingiu sua meta de calorias hoje.'
      );
    } else if (percentage >= 75) {
      await this.sendImmediateNotification(
        'Quase lá! 💪',
        `Você já consumiu ${Math.round(percentage)}% da sua meta diária.`
      );
    }
  }

  async scheduleWeeklyReport(): Promise<void> {
    try {
      await this.scheduleNotification({
        title: 'Relatório Semanal',
        body: 'Seu relatório semanal está pronto! Veja como foi sua semana.',
        time: '09:00',
        enabled: true,
        type: 'custom',
      });
    } catch (error) {
      console.error('Erro ao agendar relatório semanal:', error);
    }
  }
}

export default new NotificationService();

