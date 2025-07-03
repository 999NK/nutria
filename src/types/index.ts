export interface User {
  id: string;
  email: string;
  name: string;
  isProfileComplete: boolean;
  age?: number;
  weight?: number;
  height?: number;
  activityLevel?: string;
  goal?: string;
  dailyCalories?: number;
  dailyProtein?: number;
  dailyCarbs?: number;
  dailyFat?: number;
}

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize: string;
  category?: string;
}

export interface Meal {
  id: string;
  userId: string;
  foodId: string;
  food: Food;
  quantity: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  createdAt: string;
}

export interface NutritionalDay {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: Meal[];
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface ProgressData {
  date: string;
  weight?: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type RootStackParamList = {
  Landing: undefined;
  Onboarding: undefined;
  Main: undefined;
  Dashboard: undefined;
  AddMeal: undefined;
  MyPlan: undefined;
  Progress: undefined;
  Profile: undefined;
  AiChat: undefined;
};

export type BottomTabParamList = {
  Dashboard: undefined;
  AddMeal: undefined;
  MyPlan: undefined;
  Progress: undefined;
  Profile: undefined;
  AiChat: undefined;
};

