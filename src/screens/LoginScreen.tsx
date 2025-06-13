// src/screens/LoginScreen.tsx
import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types'; // Caminho corrigido
import { authService } from '../storage/firebaseAuth'; // função que verifica usuário no Firebase

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [userType, setUserType] = useState<'cliente' | 'prestador'>('cliente');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Refs para navegação entre campos
  const senhaRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    if (!email || !senha) {
      setErrorMessage('Preencha todos os campos.');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Por favor, insira um e-mail válido.');
      return;
    }

    setLoading(true);
    setErrorMessage(''); // Limpar mensagem de erro anterior
    
    try {
      console.log('Tentando fazer login com:', email, 'Tipo:', userType);
      const user = await authService.loginUser(email, senha); // verifica dados no Firebase
      console.log('Login realizado, dados do usuário:', user);

      // Verificar se o e-mail foi verificado
      if (!user.emailVerified) {
        setLoading(false);
        Alert.alert(
          'E-mail não verificado',
          'Seu e-mail ainda não foi verificado. Deseja reenviar o e-mail de verificação?',
          [
            {
              text: 'Cancelar',
              style: 'cancel'
            },
            {
              text: 'Reenviar',
              onPress: () => handleResendVerification()
            }
          ]
        );
        return;
      }

      // Verificar se o tipo de usuário corresponde
      if (user.tipo !== userType) {
        setErrorMessage(`Este usuário está cadastrado como ${user.tipo}. Selecione o tipo correto.`);
        setLoading(false);
        return;
      }

      console.log('Login bem-sucedido, navegando para:', userType === 'cliente' ? 'MainApp' : 'PrestadorApp');
      
      // Login bem-sucedido - a navegação será tratada pelo AppNavigator
      // que observa mudanças no estado de autenticação
      
      // Pequeno delay para garantir que o estado seja atualizado
      setTimeout(() => {
        if (userType === 'cliente') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainApp' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'PrestadorApp' }],
          });
        }
      }, 100);
      
    } catch (error: any) {
      console.error('Erro no login:', error);
      setErrorMessage(error.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await authService.resendVerificationEmail();
      Alert.alert(
        'E-mail enviado',
        'Um novo e-mail de verificação foi enviado. Verifique sua caixa de entrada e spam.'
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao reenviar e-mail de verificação.');
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        automaticallyAdjustKeyboardInsets={true}
      >
          {/* Logo textual */}
          <Text style={styles.logo}>
            Chama
            <Text style={styles.logoHighlight}>Aí</Text>
          </Text>
          <Text style={styles.slogan}>Conectando você aos melhores serviços</Text>

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, userType === 'cliente' && styles.toggleButtonActive]}
              onPress={() => setUserType('cliente')}
            >
              <Text style={[styles.toggleButtonText, userType === 'cliente' && styles.toggleButtonTextActive]}>
                Cliente
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleButton, userType === 'prestador' && styles.toggleButtonActive]}
              onPress={() => setUserType('prestador')}
            >
              <Text style={[styles.toggleButtonText, userType === 'prestador' && styles.toggleButtonTextActive]}>
                Prestador
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            placeholderTextColor="#64748B"
            value={email}
            onChangeText={setEmail}
            returnKeyType="next"
            onSubmitEditing={() => senhaRef.current?.focus()}
            blurOnSubmit={false}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              ref={senhaRef}
              style={styles.passwordInput}
              placeholder="Senha"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              placeholderTextColor="#64748B"
              value={senha}
              onChangeText={setSenha}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
          </TouchableOpacity>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
          </TouchableOpacity>
        </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF', // Azul muito claro de fundo
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  logo: {
    fontSize: 48,
    fontWeight: '900',
    textAlign: 'center',
    color: '#1E3A8A', // Azul escuro
    marginBottom: 8,
    letterSpacing: -2,
    textShadowColor: 'rgba(59, 130, 246, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  logoHighlight: {
    color: '#F59E0B', // Laranja vibrante para destacar "Aí"
    fontWeight: '900',
  },
  slogan: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 16,
    marginBottom: 40,
    fontWeight: '400',
    lineHeight: 22,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    backgroundColor: '#E0F2FE', // Azul muito claro
    borderRadius: 16,
    padding: 6,
    marginHorizontal: 20,
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  toggleButtonActive: {
    backgroundColor: '#3B82F6', // Azul principal
    shadowColor: '#1E40AF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  toggleButtonText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 16,
  },
  toggleButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  input: {
    height: 56,
    borderColor: '#CBD5E1',
    borderWidth: 1.5,
    marginBottom: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    color: '#1E3A8A',
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  passwordInput: {
    height: 56,
    borderColor: '#CBD5E1',
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingRight: 50,
    borderRadius: 12,
    color: '#1E3A8A',
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    padding: 5,
  },
  eyeIcon: {
    fontSize: 20,
  },
  button: {
    backgroundColor: '#3B82F6', // Azul principal
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 24,
    marginTop: 8,
    shadowColor: '#1E40AF',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  linkText: {
    textAlign: 'center',
    color: '#3B82F6',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  forgotPasswordText: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 12,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    textAlign: 'center',
    color: '#DC2626', // Vermelho
    marginTop: 8,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});

