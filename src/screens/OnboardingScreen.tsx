import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../hooks/useAuth';

const OnboardingScreen = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    activityLevel: 'sedentary',
    goal: 'maintain',
  });
  const { updateUser } = useAuth();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      // Calcular calorias diárias baseado nos dados
      const dailyCalories = calculateDailyCalories();
      const macros = calculateMacros(dailyCalories);

      await updateUser({
        name: formData.name,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        activityLevel: formData.activityLevel,
        goal: formData.goal,
        dailyCalories,
        dailyProtein: macros.protein,
        dailyCarbs: macros.carbs,
        dailyFat: macros.fat,
        isProfileComplete: true,
      });
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar perfil');
    }
  };

  const calculateDailyCalories = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseInt(formData.age);

    // Fórmula de Harris-Benedict simplificada
    let bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    const tdee = bmr * activityMultipliers[formData.activityLevel as keyof typeof activityMultipliers];

    const goalAdjustments = {
      lose: -500,
      maintain: 0,
      gain: 500,
    };

    return Math.round(tdee + goalAdjustments[formData.goal as keyof typeof goalAdjustments]);
  };

  const calculateMacros = (calories: number) => {
    return {
      protein: Math.round((calories * 0.25) / 4), // 25% das calorias, 4 cal/g
      carbs: Math.round((calories * 0.45) / 4), // 45% das calorias, 4 cal/g
      fat: Math.round((calories * 0.30) / 9), // 30% das calorias, 9 cal/g
    };
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Informações Básicas</Text>
      <Text style={styles.stepSubtitle}>Vamos conhecer você melhor</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Seu nome"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Idade</Text>
        <TextInput
          style={styles.input}
          value={formData.age}
          onChangeText={(text) => setFormData({ ...formData, age: text })}
          placeholder="Sua idade"
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Dados Físicos</Text>
      <Text style={styles.stepSubtitle}>Para calcular suas necessidades nutricionais</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Peso (kg)</Text>
        <TextInput
          style={styles.input}
          value={formData.weight}
          onChangeText={(text) => setFormData({ ...formData, weight: text })}
          placeholder="Seu peso em kg"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Altura (cm)</Text>
        <TextInput
          style={styles.input}
          value={formData.height}
          onChangeText={(text) => setFormData({ ...formData, height: text })}
          placeholder="Sua altura em cm"
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Objetivos</Text>
      <Text style={styles.stepSubtitle}>Defina seu nível de atividade e objetivo</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nível de Atividade</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.activityLevel}
            onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}
            style={styles.picker}
          >
            <Picker.Item label="Sedentário" value="sedentary" />
            <Picker.Item label="Levemente ativo" value="light" />
            <Picker.Item label="Moderadamente ativo" value="moderate" />
            <Picker.Item label="Muito ativo" value="active" />
            <Picker.Item label="Extremamente ativo" value="very_active" />
          </Picker>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Objetivo</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.goal}
            onValueChange={(value) => setFormData({ ...formData, goal: value })}
            style={styles.picker}
          >
            <Picker.Item label="Perder peso" value="lose" />
            <Picker.Item label="Manter peso" value="maintain" />
            <Picker.Item label="Ganhar peso" value="gain" />
          </Picker>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((stepNumber) => (
            <View
              key={stepNumber}
              style={[
                styles.progressDot,
                stepNumber <= step && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
        <Text style={styles.stepIndicator}>Passo {step} de 3</Text>
      </View>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}

      <View style={styles.buttonContainer}>
        {step > 1 && (
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => setStep(step - 1)}
          >
            <Text style={styles.buttonSecondaryText}>Voltar</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleNext}
        >
          <Text style={styles.buttonPrimaryText}>
            {step === 3 ? 'Finalizar' : 'Próximo'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#10B981',
  },
  stepIndicator: {
    fontSize: 14,
    color: '#6b7280',
  },
  stepContainer: {
    padding: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  pickerContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#10B981',
  },
  buttonSecondary: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;

