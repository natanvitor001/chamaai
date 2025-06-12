// src/screens/CadastroScreen.tsx
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
  TouchableWithoutFeedback, 
  Keyboard,
  ScrollView 
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types'; // ajuste conforme seu projeto
import { authService } from '../storage/firebaseAuth'; // Importa o Firebase Auth

type CadastroScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cadastro'>;

type Props = {
  navigation: CadastroScreenNavigationProp;
};

export default function CadastroScreen({ navigation }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [celular, setCelular] = useState('');
  const [tipo, setTipo] = useState<'cliente' | 'prestador'>('cliente');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Refs para navegação entre campos
  const emailRef = useRef<TextInput>(null);
  const senhaRef = useRef<TextInput>(null);
  const confirmarSenhaRef = useRef<TextInput>(null);
  const celularRef = useRef<TextInput>(null);

  // Função para validar a senha
  const validatePassword = (password: string) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 8;
    
    return hasLetter && hasNumber && hasMinLength;
  };

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !confirmarSenha || !celular) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    // Validação de nome
    if (nome.trim().length < 2) {
      Alert.alert('Erro', 'O nome deve ter pelo menos 2 caracteres.');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    // Validação de celular (deve ter pelo menos 10 dígitos)
    const celularDigits = celular.replace(/\D/g, '');
    if (celularDigits.length < 10) {
      Alert.alert('Erro', 'Por favor, insira um número de celular válido.');
      return;
    }

    if (!validatePassword(senha)) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 8 caracteres, incluindo letras e números.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    setLoading(true);
    try {
      await authService.registerUser({
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        celular,
        tipo,
      }, senha);

      Alert.alert(
        "Cadastro realizado!",
        `Conta criada com sucesso! Um e-mail de verificação foi enviado para ${email}. Por favor, verifique sua caixa de entrada e spam antes de fazer login.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate("EmailVerification")
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Erro no cadastro', error.message || 'Algo deu errado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatCelular = (text: string) => {
    // Remove tudo que não é número
    const cleaned = text.replace(/\D/g, '');
    
    // Aplica a máscara (XX) XXXXX-XXXX
    if (cleaned.length <= 11) {
      const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
      if (match) {
        return !match[2] ? match[1] : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
      }
    }
    return text;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        automaticallyAdjustKeyboardInsets={true}
      >
          <Text style={styles.title}>Cadastro no ChamaAí</Text>

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, tipo === 'cliente' && styles.toggleButtonActive]}
              onPress={() => setTipo('cliente')}
              disabled={loading}
            >
              <Text style={[styles.toggleButtonText, tipo === 'cliente' && styles.toggleButtonTextActive]}>Cliente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, tipo === 'prestador' && styles.toggleButtonActive]}
              onPress={() => setTipo('prestador')}
              disabled={loading}
            >
              <Text style={[styles.toggleButtonText, tipo === 'prestador' && styles.toggleButtonTextActive]}>Prestador</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            value={nome}
            onChangeText={setNome}
            editable={!loading}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />
          
          <TextInput
            ref={emailRef}
            style={styles.input}
            placeholder="E-mail"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => senhaRef.current?.focus()}
          />
          
          <View style={styles.passwordContainer}>
            <TextInput
              ref={senhaRef}
              style={styles.passwordInput}
              placeholder="Senha"
              secureTextEntry={!showPassword}
              value={senha}
              onChangeText={setSenha}
              editable={!loading}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => confirmarSenhaRef.current?.focus()}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.passwordContainer}>
            <TextInput
              ref={confirmarSenhaRef}
              style={styles.passwordInput}
              placeholder="Confirmar senha"
              secureTextEntry={!showConfirmPassword}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              editable={!loading}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => celularRef.current?.focus()}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text style={styles.eyeIcon}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
          
          <TextInput
            ref={celularRef}
            style={styles.input}
            placeholder="Celular"
            keyboardType="phone-pad"
            value={celular}
            onChangeText={(text) => setCelular(formatCelular(text))}
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={handleCadastro}
            maxLength={15} // (XX) XXXXX-XXXX
          />

          <TouchableOpacity style={styles.button} onPress={handleCadastro} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
            <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
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
    paddingHorizontal: 32,
    paddingVertical: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 32,
    textAlign: 'center',
    color: '#1E3A8A', // Azul escuro
    letterSpacing: -1,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    justifyContent: 'center',
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
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#1E3A8A',
    backgroundColor: '#FFFFFF',
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  passwordInput: {
    height: 56,
    borderColor: '#CBD5E1',
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingRight: 50,
    borderRadius: 12,
    fontSize: 16,
    color: '#1E3A8A',
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
    marginTop: 8,
    marginBottom: 24,
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
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  linkText: {
    textAlign: 'center',
    color: '#3B82F6',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});

