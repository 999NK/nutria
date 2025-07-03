import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../hooks/useAuth';

const ProfileScreen = () => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age?.toString() || '',
    weight: user?.weight?.toString() || '',
    height: user?.height?.toString() || '',
    dailyCalories: user?.dailyCalories?.toString() || '',
  });
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = async () => {
    try {
      await updateUser({
        name: formData.name,
        age: parseInt(formData.age) || undefined,
        weight: parseFloat(formData.weight) || undefined,
        height: parseFloat(formData.height) || undefined,
        dailyCalories: parseInt(formData.dailyCalories) || undefined,
      });
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar perfil');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ]
    );
  };

  const profileSections = [
    {
      title: 'Informações Pessoais',
      items: [
        { label: 'Nome', value: formData.name, key: 'name', editable: true },
        { label: 'Email', value: formData.email, key: 'email', editable: false },
        { label: 'Idade', value: formData.age, key: 'age', editable: true, suffix: 'anos' },
      ],
    },
    {
      title: 'Dados Físicos',
      items: [
        { label: 'Peso', value: formData.weight, key: 'weight', editable: true, suffix: 'kg' },
        { label: 'Altura', value: formData.height, key: 'height', editable: true, suffix: 'cm' },
      ],
    },
    {
      title: 'Objetivos',
      items: [
        { label: 'Meta de Calorias', value: formData.dailyCalories, key: 'dailyCalories', editable: true, suffix: 'kcal' },
        { label: 'Objetivo', value: 'Perder peso', key: 'goal', editable: false },
        { label: 'Nível de Atividade', value: 'Moderadamente ativo', key: 'activity', editable: false },
      ],
    },
  ];

  const settingsItems = [
    {
      title: 'Notificações',
      subtitle: 'Receber lembretes de refeições',
      type: 'switch',
      value: notifications,
      onToggle: setNotifications,
      icon: 'notifications',
    },
    {
      title: 'Modo Escuro',
      subtitle: 'Usar tema escuro no aplicativo',
      type: 'switch',
      value: darkMode,
      onToggle: setDarkMode,
      icon: 'dark-mode',
    },
    {
      title: 'Exportar Dados',
      subtitle: 'Baixar seus dados em PDF',
      type: 'action',
      icon: 'download',
      onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento'),
    },
    {
      title: 'Suporte',
      subtitle: 'Entrar em contato conosco',
      type: 'action',
      icon: 'help',
      onPress: () => Alert.alert('Suporte', 'Entre em contato: suporte@nutritionai.com'),
    },
    {
      title: 'Sobre',
      subtitle: 'Versão 1.0.0',
      type: 'action',
      icon: 'info',
      onPress: () => Alert.alert('NutritionAI', 'Versão 1.0.0\nDesenvolvido com ❤️'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Icon name="person" size={40} color="#fff" />
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Icon name="camera-alt" size={16} color="#10B981" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Icon name={isEditing ? 'close' : 'edit'} size={20} color="#10B981" />
          <Text style={styles.editButtonText}>
            {isEditing ? 'Cancelar' : 'Editar Perfil'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Informações do Perfil */}
      {profileSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.profileItem}>
                <Text style={styles.profileLabel}>{item.label}</Text>
                {isEditing && item.editable ? (
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={item.value}
                      onChangeText={(text) =>
                        setFormData({ ...formData, [item.key]: text })
                      }
                      placeholder={item.label}
                      keyboardType={
                        ['age', 'weight', 'height', 'dailyCalories'].includes(item.key)
                          ? 'numeric'
                          : 'default'
                      }
                    />
                    {item.suffix && (
                      <Text style={styles.inputSuffix}>{item.suffix}</Text>
                    )}
                  </View>
                ) : (
                  <Text style={styles.profileValue}>
                    {item.value} {item.suffix || ''}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* Botão Salvar */}
      {isEditing && (
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Icon name="save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Configurações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        <View style={styles.sectionContent}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.settingItem}
              onPress={item.type === 'action' ? item.onPress : undefined}
              disabled={item.type === 'switch'}
            >
              <View style={styles.settingIcon}>
                <Icon name={item.icon} size={24} color="#6b7280" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              </View>
              {item.type === 'switch' ? (
                <Switch
                  value={item.value as boolean}
                  onValueChange={item.onToggle}
                  trackColor={{ false: '#e5e7eb', true: '#10B981' }}
                  thumbColor="#fff"
                />
              ) : (
                <Icon name="chevron-right" size={24} color="#d1d5db" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Botão Sair */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
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
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f3f4f6',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  editButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  profileLabel: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  profileValue: {
    fontSize: 16,
    color: '#6b7280',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: 80,
    textAlign: 'right',
  },
  inputSuffix: {
    marginLeft: 8,
    fontSize: 16,
    color: '#6b7280',
  },
  saveButtonContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  saveButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    backgroundColor: '#fff',
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen;

