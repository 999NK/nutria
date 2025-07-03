import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAuth } from '../hooks/useAuth';
import { RootStackParamList, BottomTabParamList } from '../types';

// Screens
import LandingScreen from '../screens/LandingScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AddMealScreen from '../screens/AddMealScreen';
import MyPlanScreen from '../screens/MyPlanScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AiChatScreen from '../screens/AiChatScreen';
import LoadingScreen from '../screens/LoadingScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'AddMeal':
              iconName = 'add-circle';
              break;
            case 'MyPlan':
              iconName = 'restaurant-menu';
              break;
            case 'Progress':
              iconName = 'trending-up';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            case 'AiChat':
              iconName = 'chat';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Início' }}
      />
      <Tab.Screen 
        name="AddMeal" 
        component={AddMealScreen}
        options={{ title: 'Adicionar' }}
      />
      <Tab.Screen 
        name="MyPlan" 
        component={MyPlanScreen}
        options={{ title: 'Meu Plano' }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{ title: 'Progresso' }}
      />
      <Tab.Screen 
        name="AiChat" 
        component={AiChatScreen}
        options={{ title: 'AI Chat' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Landing" component={LandingScreen} />
        ) : user && !user.isProfileComplete ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

