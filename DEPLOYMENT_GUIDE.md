# Guia de Deploy - NutritionAI

Este guia detalha o processo completo para publicar o aplicativo NutritionAI nas lojas Google Play Store e Apple App Store.

## 📋 Pré-requisitos

### Contas Necessárias
- **Google Play Console**: Conta de desenvolvedor ($25 taxa única)
- **Apple Developer Program**: Conta de desenvolvedor ($99/ano)
- **Certificados de Assinatura**: Para ambas as plataformas

### Ferramentas Necessárias
- Android Studio (para Android)
- Xcode (para iOS)
- React Native CLI
- Node.js 18+

## 🤖 Deploy para Google Play Store

### 1. Preparação do Ambiente Android

#### 1.1 Configurar Chave de Assinatura
```bash
# Gerar chave de upload
keytool -genkey -v -keystore nutrition-ai-upload-key.keystore -alias nutrition-ai -keyalg RSA -keysize 2048 -validity 10000

# Informações necessárias:
# - Nome: NutritionAI
# - Organização: Sua Empresa
# - Cidade/Estado/País: Seus dados
# - Senha: Guarde com segurança
```

#### 1.2 Configurar gradle.properties
Crie/edite `android/gradle.properties`:
```properties
MYAPP_UPLOAD_STORE_FILE=nutrition-ai-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=nutrition-ai
MYAPP_UPLOAD_STORE_PASSWORD=sua_senha_keystore
MYAPP_UPLOAD_KEY_PASSWORD=sua_senha_key

# Otimizações
org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
org.gradle.parallel=true
org.gradle.configureondemand=true
org.gradle.daemon=true

android.useAndroidX=true
android.enableJetifier=true
```

#### 1.3 Atualizar build.gradle
Verifique se `android/app/build.gradle` está configurado corretamente:
```gradle
android {
    compileSdkVersion 33
    buildToolsVersion "33.0.0"

    defaultConfig {
        applicationId "com.nutritionai.app"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
        multiDexEnabled true
    }

    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

### 2. Gerar APK/AAB de Produção

#### 2.1 Limpar e Preparar
```bash
cd android
./gradlew clean
cd ..
```

#### 2.2 Gerar Bundle (Recomendado)
```bash
cd android
./gradlew bundleRelease
```
O arquivo será gerado em: `android/app/build/outputs/bundle/release/app-release.aab`

#### 2.3 Gerar APK (Alternativo)
```bash
cd android
./gradlew assembleRelease
```
O arquivo será gerado em: `android/app/build/outputs/apk/release/app-release.apk`

### 3. Preparar Assets para Play Store

#### 3.1 Ícones Necessários
- **Ícone do app**: 512x512 px (PNG)
- **Ícone adaptativo**: 512x512 px (PNG)
- **Banner de funcionalidade**: 1024x500 px (JPG/PNG)

#### 3.2 Screenshots
- **Telefone**: Mínimo 2, máximo 8 (16:9 ou 9:16)
- **Tablet 7"**: Opcional (16:10 ou 10:16)
- **Tablet 10"**: Opcional (16:10 ou 10:16)

Resoluções recomendadas:
- 1080x1920 px (telefone)
- 1200x1920 px (tablet 7")
- 1440x2560 px (tablet 10")

### 4. Configurar Play Console

#### 4.1 Criar Novo App
1. Acesse [Google Play Console](https://play.google.com/console)
2. Clique em "Criar app"
3. Preencha informações básicas:
   - Nome: "NutritionAI"
   - Idioma padrão: Português (Brasil)
   - Tipo: App
   - Categoria: Saúde e fitness

#### 4.2 Configurar Informações do App
```
Título: NutritionAI - Sua Jornada Saudável
Descrição curta: Acompanhamento nutricional inteligente com IA

Descrição completa:
🌟 Transforme sua relação com a alimentação!

O NutritionAI é seu companheiro inteligente para uma vida mais saudável. Com tecnologia de inteligência artificial, oferecemos:

✅ SCANNER DE ALIMENTOS
• Identifique alimentos instantaneamente com a câmera
• Cálculo automático de calorias e nutrientes
• Base de dados completa de alimentos

📊 ACOMPANHAMENTO COMPLETO
• Dashboard intuitivo com progresso diário
• Gráficos de evolução de peso e nutrição
• Relatórios detalhados semanais e mensais

🤖 ASSISTENTE IA NUTRICIONAL
• Chat inteligente para dúvidas nutricionais
• Sugestões personalizadas de refeições
• Orientações baseadas em seus objetivos

🎯 PLANEJAMENTO INTELIGENTE
• Planos alimentares personalizados
• Metas adaptadas ao seu perfil
• Lembretes e notificações inteligentes

🏆 GAMIFICAÇÃO
• Sistema de conquistas e metas
• Acompanhamento de progresso motivador
• Compartilhamento de resultados

PRINCIPAIS FUNCIONALIDADES:
• Registro rápido de refeições
• Análise de macronutrientes
• Histórico completo de alimentação
• Sincronização automática
• Interface moderna e intuitiva

Ideal para quem busca:
• Perder peso de forma saudável
• Ganhar massa muscular
• Melhorar hábitos alimentares
• Acompanhar nutrição esportiva
• Controlar diabetes e outras condições

Baixe agora e comece sua jornada para uma vida mais saudável! 💪

Palavras-chave: nutrição, dieta, saúde, fitness, calorias, peso, IA, inteligência artificial
```

#### 4.3 Upload do App Bundle
1. Vá para "Versões do app" > "Produção"
2. Clique em "Criar nova versão"
3. Faça upload do arquivo `.aab`
4. Preencha as notas da versão:
```
Versão 1.0.0 - Lançamento inicial

🎉 Bem-vindo ao NutritionAI!

Novidades desta versão:
• Scanner de alimentos com IA
• Dashboard completo de nutrição
• Chat com assistente nutricional
• Planejamento de refeições
• Acompanhamento de progresso
• Sistema de metas personalizadas

Esta é nossa primeira versão. Estamos ansiosos pelo seu feedback!
```

### 5. Configurações Adicionais

#### 5.1 Classificação de Conteúdo
- Categoria: Saúde e fitness
- Público-alvo: 13+ anos
- Sem conteúdo sensível

#### 5.2 Política de Privacidade
Crie uma política de privacidade e hospede em:
`https://seusite.com/privacy-policy`

#### 5.3 Preços e Distribuição
- Gratuito
- Disponível em todos os países
- Sem compras no app (inicialmente)

## 🍎 Deploy para Apple App Store

### 1. Preparação do Ambiente iOS

#### 1.1 Configurar Xcode
```bash
# Abrir projeto no Xcode
cd ios
open NutritionAI_ReactNative.xcworkspace
```

#### 1.2 Configurar Bundle Identifier
No Xcode:
1. Selecione o projeto
2. Target > NutritionAI_ReactNative
3. General > Bundle Identifier: `com.nutritionai.app`

#### 1.3 Configurar Certificados
1. Apple Developer Account > Certificates
2. Criar "iOS Distribution Certificate"
3. Criar "App Store Provisioning Profile"

### 2. Configurar App Store Connect

#### 2.1 Criar Novo App
1. Acesse [App Store Connect](https://appstoreconnect.apple.com)
2. "Meus Apps" > "+"
3. Preencher informações:
   - Nome: NutritionAI
   - Bundle ID: com.nutritionai.app
   - SKU: nutritionai-ios-001

#### 2.2 Informações do App
```
Nome: NutritionAI
Subtítulo: Nutrição Inteligente com IA
Categoria: Saúde e fitness
Categoria secundária: Estilo de vida

Descrição:
🌟 Revolucione sua alimentação com inteligência artificial!

O NutritionAI é o aplicativo mais avançado para acompanhamento nutricional, combinando tecnologia de IA com uma interface intuitiva para transformar seus hábitos alimentares.

🔍 SCANNER INTELIGENTE
Aponte a câmera para qualquer alimento e nossa IA identifica instantaneamente, calculando calorias, proteínas, carboidratos e gorduras com precisão.

📊 DASHBOARD COMPLETO
Visualize seu progresso com gráficos detalhados, acompanhe metas diárias e monitore sua evolução ao longo do tempo.

🤖 ASSISTENTE NUTRICIONAL
Chat inteligente disponível 24/7 para esclarecer dúvidas, sugerir substituições e orientar suas escolhas alimentares.

🎯 PLANEJAMENTO PERSONALIZADO
Planos alimentares adaptados aos seus objetivos: perda de peso, ganho de massa, manutenção ou necessidades específicas.

✨ RECURSOS PRINCIPAIS:
• Reconhecimento de alimentos por IA
• Base de dados com milhares de alimentos
• Cálculo automático de macronutrientes
• Relatórios detalhados de progresso
• Sistema de metas e conquistas
• Lembretes inteligentes
• Compartilhamento de resultados
• Interface moderna e intuitiva

🏆 IDEAL PARA:
• Atletas e praticantes de exercícios
• Pessoas em dietas específicas
• Controle de diabetes e outras condições
• Educação nutricional
• Mudança de estilo de vida

Transforme sua relação com a comida. Baixe o NutritionAI e comece sua jornada para uma vida mais saudável hoje mesmo!

Palavras-chave: nutrição, dieta, IA, saúde, fitness, calorias, macros
```

### 3. Assets para App Store

#### 3.1 Ícones do App
- **App Store**: 1024x1024 px (PNG, sem transparência)
- **iPhone**: 60x60, 120x120, 180x180 px
- **iPad**: 76x76, 152x152 px

#### 3.2 Screenshots
**iPhone 6.7"** (obrigatório):
- 1290x2796 px
- Mínimo 3, máximo 10

**iPhone 6.5"**:
- 1242x2688 px
- Mínimo 3, máximo 10

**iPad Pro 12.9"** (se suportar iPad):
- 2048x2732 px
- Mínimo 3, máximo 10

### 4. Build e Upload

#### 4.1 Configurar Scheme para Release
No Xcode:
1. Product > Scheme > Edit Scheme
2. Run > Build Configuration > Release

#### 4.2 Archive e Upload
```bash
# No Xcode:
# 1. Product > Archive
# 2. Window > Organizer
# 3. Distribute App > App Store Connect
# 4. Upload
```

### 5. Submissão para Revisão

#### 5.1 Informações de Revisão
```
Notas para revisão:
Este é um aplicativo de acompanhamento nutricional que utiliza IA para identificar alimentos através da câmera. 

Funcionalidades principais:
- Scanner de alimentos (câmera)
- Cálculo nutricional
- Acompanhamento de progresso
- Chat com IA

Credenciais de teste:
Email: teste@nutritionai.com
Senha: Teste123!

O app não coleta dados sensíveis além das informações nutricionais fornecidas pelo usuário.
```

#### 5.2 Classificação Etária
- 4+ (sem conteúdo restrito)

#### 5.3 Preços
- Gratuito
- Disponível em todos os territórios

## 📊 Monitoramento Pós-Launch

### Métricas Importantes
- Downloads e instalações
- Avaliações e comentários
- Taxa de retenção
- Crashes e erros
- Uso de funcionalidades

### Ferramentas de Analytics
- Google Analytics for Firebase
- App Store Connect Analytics
- Crashlytics para monitoramento de erros

## 🔄 Atualizações Futuras

### Processo de Update
1. Incrementar `versionCode` (Android) e `CFBundleVersion` (iOS)
2. Atualizar `versionName` e `CFBundleShortVersionString`
3. Gerar novos builds
4. Upload nas respectivas lojas
5. Preencher notas da versão

### Planejamento de Releases
- **v1.1**: Modo offline, sincronização
- **v1.2**: Integração com wearables
- **v1.3**: Comunidade de usuários
- **v2.0**: Análise de exames laboratoriais

## ⚠️ Checklist Final

### Antes do Deploy
- [ ] Testes em dispositivos reais
- [ ] Verificar permissões
- [ ] Testar funcionalidades offline
- [ ] Validar fluxos de onboarding
- [ ] Verificar performance
- [ ] Testar em diferentes tamanhos de tela
- [ ] Validar acessibilidade
- [ ] Revisar textos e traduções

### Documentação
- [ ] README atualizado
- [ ] Política de privacidade
- [ ] Termos de uso
- [ ] Documentação da API
- [ ] Guia do usuário

### Marketing
- [ ] Landing page
- [ ] Material promocional
- [ ] Screenshots otimizadas
- [ ] Vídeo de demonstração
- [ ] Estratégia de ASO (App Store Optimization)

---

🎉 **Parabéns!** Seu app está pronto para conquistar as lojas de aplicativos!

