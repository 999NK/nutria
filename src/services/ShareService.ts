import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import { Alert } from 'react-native';

export interface ShareData {
  title: string;
  message: string;
  url?: string;
  filename?: string;
  type?: string;
}

class ShareService {
  async shareText(data: ShareData): Promise<boolean> {
    try {
      const options = {
        title: data.title,
        message: data.message,
        url: data.url,
      };

      const result = await Share.open(options);
      return result.success || false;
    } catch (error) {
      if (error.message !== 'User did not share') {
        console.error('Erro ao compartilhar texto:', error);
        Alert.alert('Erro', 'Não foi possível compartilhar');
      }
      return false;
    }
  }

  async shareProgress(
    currentWeight: number,
    targetWeight: number,
    daysTracking: number,
    caloriesConsumed: number
  ): Promise<boolean> {
    const weightLoss = Math.abs(currentWeight - targetWeight);
    const message = `🎯 Meu progresso no NutritionAI:\n\n` +
      `📊 ${daysTracking} dias de acompanhamento\n` +
      `⚖️ Peso atual: ${currentWeight}kg\n` +
      `🎯 Meta: ${targetWeight}kg\n` +
      `🔥 Calorias hoje: ${caloriesConsumed}kcal\n\n` +
      `Baixe o NutritionAI e comece sua jornada saudável! 💪`;

    return this.shareText({
      title: 'Meu Progresso - NutritionAI',
      message,
    });
  }

  async shareMealPlan(meals: Array<{ name: string; calories: number }>): Promise<boolean> {
    const mealsList = meals
      .map((meal, index) => `${index + 1}. ${meal.name} (${meal.calories} kcal)`)
      .join('\n');

    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

    const message = `🍽️ Meu plano alimentar de hoje:\n\n` +
      `${mealsList}\n\n` +
      `📊 Total: ${totalCalories} kcal\n\n` +
      `Planeje suas refeições com o NutritionAI! 📱`;

    return this.shareText({
      title: 'Meu Plano Alimentar - NutritionAI',
      message,
    });
  }

  async shareRecipe(
    recipeName: string,
    ingredients: string[],
    instructions: string,
    calories: number
  ): Promise<boolean> {
    const ingredientsList = ingredients
      .map((ingredient, index) => `• ${ingredient}`)
      .join('\n');

    const message = `👨‍🍳 Receita: ${recipeName}\n\n` +
      `📋 Ingredientes:\n${ingredientsList}\n\n` +
      `🔥 ${calories} kcal por porção\n\n` +
      `📱 Mais receitas saudáveis no NutritionAI!`;

    return this.shareText({
      title: `Receita: ${recipeName}`,
      message,
    });
  }

  async generateProgressReport(userData: {
    name: string;
    startWeight: number;
    currentWeight: number;
    targetWeight: number;
    daysTracking: number;
    averageCalories: number;
    mealsLogged: number;
  }): Promise<string | null> {
    try {
      const weightLoss = userData.startWeight - userData.currentWeight;
      const remainingWeight = userData.currentWeight - userData.targetWeight;
      const progressPercentage = Math.round(
        ((userData.startWeight - userData.currentWeight) / 
         (userData.startWeight - userData.targetWeight)) * 100
      );

      const reportContent = `
RELATÓRIO DE PROGRESSO - NUTRITIONAI
=====================================

👤 Nome: ${userData.name}
📅 Período: ${userData.daysTracking} dias

📊 PROGRESSO DE PESO
• Peso inicial: ${userData.startWeight}kg
• Peso atual: ${userData.currentWeight}kg
• Meta: ${userData.targetWeight}kg
• Perdido: ${weightLoss.toFixed(1)}kg
• Restante: ${remainingWeight.toFixed(1)}kg
• Progresso: ${progressPercentage}%

🍽️ ALIMENTAÇÃO
• Refeições registradas: ${userData.mealsLogged}
• Média de calorias: ${userData.averageCalories} kcal/dia
• Consistência: ${Math.round((userData.mealsLogged / (userData.daysTracking * 3)) * 100)}%

🎯 ANÁLISE
${progressPercentage >= 100 
  ? '🎉 Parabéns! Você atingiu sua meta!'
  : progressPercentage >= 75
  ? '💪 Excelente progresso! Continue assim!'
  : progressPercentage >= 50
  ? '👍 Bom progresso! Mantenha o foco!'
  : '🔥 Continue firme! Cada dia conta!'
}

Gerado pelo NutritionAI em ${new Date().toLocaleDateString('pt-BR')}
      `;

      const fileName = `relatorio_nutritionai_${Date.now()}.txt`;
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      
      await RNFS.writeFile(filePath, reportContent, 'utf8');
      return filePath;
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      return null;
    }
  }

  async shareProgressReport(userData: {
    name: string;
    startWeight: number;
    currentWeight: number;
    targetWeight: number;
    daysTracking: number;
    averageCalories: number;
    mealsLogged: number;
  }): Promise<boolean> {
    try {
      const filePath = await this.generateProgressReport(userData);
      if (!filePath) {
        Alert.alert('Erro', 'Não foi possível gerar o relatório');
        return false;
      }

      const options = {
        title: 'Meu Relatório de Progresso - NutritionAI',
        message: 'Confira meu progresso na jornada para uma vida mais saudável!',
        url: `file://${filePath}`,
        type: 'text/plain',
        filename: 'relatorio_nutritionai.txt',
      };

      const result = await Share.open(options);
      
      // Limpar arquivo temporário após compartilhar
      setTimeout(async () => {
        try {
          await RNFS.unlink(filePath);
        } catch (error) {
          console.log('Erro ao limpar arquivo temporário:', error);
        }
      }, 5000);

      return result.success || false;
    } catch (error) {
      if (error.message !== 'User did not share') {
        console.error('Erro ao compartilhar relatório:', error);
        Alert.alert('Erro', 'Não foi possível compartilhar o relatório');
      }
      return false;
    }
  }

  async shareAppInvite(): Promise<boolean> {
    const message = `🌟 Descubra o NutritionAI!\n\n` +
      `📱 O app que está transformando minha relação com a alimentação:\n\n` +
      `✅ Acompanhamento de refeições\n` +
      `📊 Análise nutricional completa\n` +
      `🤖 Chat com IA nutricional\n` +
      `📈 Relatórios de progresso\n` +
      `🎯 Metas personalizadas\n\n` +
      `Baixe agora e comece sua jornada saudável! 💪`;

    return this.shareText({
      title: 'NutritionAI - Sua Jornada Saudável',
      message,
    });
  }
}

export default new ShareService();

