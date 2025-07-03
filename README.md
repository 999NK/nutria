# NutritionAI - React Native

Um aplicativo móvel completo para acompanhamento nutricional com inteligência artificial, desenvolvido em React Native para iOS e Android.

## 🚀 Funcionalidades

### 📱 Principais Recursos
- **Dashboard Intuitivo**: Visualização completa do progresso nutricional diário
- **Registro de Refeições**: Adicione facilmente alimentos às suas refeições
- **Scanner de Alimentos**: Use a câmera para identificar alimentos automaticamente
- **Chat com IA**: Assistente nutricional inteligente para dúvidas e orientações
- **Plano Nutricional**: Planejamento semanal de refeições personalizado
- **Acompanhamento de Progresso**: Gráficos e relatórios detalhados
- **Perfil Personalizado**: Configurações e metas individualizadas

### 🤖 Inteligência Artificial
- Reconhecimento automático de alimentos por imagem
- Cálculo automático de informações nutricionais
- Assistente virtual para orientações nutricionais
- Sugestões personalizadas baseadas no perfil do usuário

### 📊 Análises e Relatórios
- Gráficos de evolução de peso
- Análise de macronutrientes
- Relatórios semanais e mensais
- Acompanhamento de metas diárias

## 🛠️ Tecnologias Utilizadas

### Core
- **React Native 0.80.1**: Framework principal
- **TypeScript**: Tipagem estática
- **React Navigation**: Navegação entre telas
- **React Native Vector Icons**: Ícones

### Funcionalidades Nativas
- **React Native Image Picker**: Seleção de imagens
- **React Native Permissions**: Gerenciamento de permissões
- **React Native Async Storage**: Armazenamento local
- **React Native Share**: Compartilhamento de conteúdo
- **React Native FS**: Sistema de arquivos

### Visualização de Dados
- **React Native Chart Kit**: Gráficos e visualizações
- **React Native SVG**: Gráficos vetoriais

### UI/UX
- **React Native Gesture Handler**: Gestos e interações
- **React Native Safe Area Context**: Área segura
- **React Native Linear Gradient**: Gradientes

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   └── FoodScannerModal.tsx
├── hooks/              # Hooks customizados
│   └── useAuth.ts
├── navigation/         # Configuração de navegação
│   └── AppNavigator.tsx
├── screens/           # Telas do aplicativo
│   ├── LandingScreen.tsx
│   ├── OnboardingScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── AddMealScreen.tsx
│   ├── MyPlanScreen.tsx
│   ├── ProgressScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── AiChatScreen.tsx
│   └── LoadingScreen.tsx
├── services/          # Serviços e APIs
│   ├── CameraService.ts
│   ├── NotificationService.ts
│   └── ShareService.ts
├── types/             # Definições de tipos
│   └── index.ts
└── utils/             # Utilitários
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- React Native CLI
- Android Studio (para Android)
- Xcode (para iOS)

### Instalação
```bash
# Clone o repositório
git clone [url-do-repositorio]

# Instale as dependências
cd NutritionAI_ReactNative
npm install

# Para iOS, instale os pods
cd ios && pod install && cd ..
```

### Executar no Android
```bash
# Inicie o Metro bundler
npm start

# Em outro terminal, execute no Android
npm run android
```

### Executar no iOS
```bash
# Inicie o Metro bundler
npm start

# Em outro terminal, execute no iOS
npm run ios
```

## 📱 Telas do Aplicativo

### 1. Landing/Login
- Tela de entrada com autenticação
- Design moderno e intuitivo
- Opções de login e cadastro

### 2. Onboarding
- Processo de configuração inicial
- Coleta de dados pessoais e objetivos
- Cálculo automático de metas nutricionais

### 3. Dashboard
- Visão geral do dia atual
- Progresso de calorias e macronutrientes
- Gráficos de evolução
- Ações rápidas

### 4. Adicionar Refeição
- Busca de alimentos
- Scanner com IA
- Seleção de tipo de refeição
- Cálculo nutricional automático

### 5. Meu Plano
- Planejamento semanal
- Distribuição de refeições
- Edição de planos
- Geração automática com IA

### 6. Progresso
- Gráficos de evolução
- Estatísticas detalhadas
- Sistema de conquistas
- Insights personalizados

### 7. Perfil
- Configurações pessoais
- Edição de dados
- Preferências do app
- Opções de compartilhamento

### 8. Chat com IA
- Assistente nutricional inteligente
- Perguntas frequentes
- Respostas personalizadas
- Interface de chat moderna

## 🔧 Configuração para Produção

### Android
1. Gere uma chave de assinatura:
```bash
keytool -genkey -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Configure o arquivo `android/gradle.properties`:
```
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

3. Gere o APK de produção:
```bash
cd android
./gradlew assembleRelease
```

### iOS
1. Configure o projeto no Xcode
2. Configure certificados de distribuição
3. Archive e envie para a App Store

## 🔐 Permissões

### Android
- `CAMERA`: Para scanner de alimentos
- `READ_EXTERNAL_STORAGE`: Para acessar galeria
- `WRITE_EXTERNAL_STORAGE`: Para salvar relatórios
- `INTERNET`: Para conectividade
- `VIBRATE`: Para feedback tátil

### iOS
- `NSCameraUsageDescription`: Acesso à câmera
- `NSPhotoLibraryUsageDescription`: Acesso à galeria
- `NSLocationWhenInUseUsageDescription`: Localização (opcional)

## 📈 Próximas Funcionalidades

- [ ] Integração com wearables
- [ ] Modo offline completo
- [ ] Sincronização em nuvem
- [ ] Comunidade de usuários
- [ ] Receitas personalizadas
- [ ] Integração com nutricionistas
- [ ] Análise de exames laboratoriais

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- Email: suporte@nutritionai.com
- Website: https://nutritionai.com
- GitHub Issues: [Link para issues]

---

Desenvolvido com ❤️ para uma vida mais saudável

