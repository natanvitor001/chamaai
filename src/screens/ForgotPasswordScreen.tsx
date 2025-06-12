// src/screens/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
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
import { RootStackParamList } from './types';
import { resetPassword } from '../storage/firebaseAuth';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

type Props = {
  navigation: ForgotPasswordScreenNavigationProp;
};

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, digite seu e-mail.');
      return;
    }

    // Validação básica de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Erro', 'Por favor, digite um e-mail válido.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim());
      setEmailSent(true);
      Alert.alert(
        'E-mail enviado!',
        'Instruções para redefinir sua senha foram enviadas para seu e-mail. Verifique sua caixa de entrada e spam.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao enviar e-mail de redefinição.');
    } finally {
      setLoading(false);
    }
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
      >
        <View style={styles.header}>
          <Text style={styles.title}>Recuperar Senha</Text>
          <Text style={styles.subtitle}>
            Digite seu e-mail para receber as instruções de redefinição de senha
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            placeholderTextColor="#64748B"
            value={email}
            onChangeText={setEmail}
            editable={!loading && !emailSent}
            returnKeyType="done"
            onSubmitEditing={handleResetPassword}
          />

          <TouchableOpacity 
            style={[styles.button, (loading || emailSent) && styles.buttonDisabled]} 
            onPress={handleResetPassword} 
            disabled={loading || emailSent}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Enviando...' : emailSent ? 'E-mail Enviado' : 'Enviar Instruções'}
            </Text>
          </TouchableOpacity>

          {emailSent && (
            <View style={styles.successContainer}>
              <Text style={styles.successIcon}>✅</Text>
              <Text style={styles.successText}>
                E-mail enviado com sucesso! Verifique sua caixa de entrada.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.backText}>← Voltar ao Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    color: '#1E3A8A',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748B',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  form: {
    marginBottom: 40,
  },
  input: {
    height: 56,
    borderColor: '#CBD5E1',
    borderWidth: 1.5,
    marginBottom: 24,
    paddingHorizontal: 16,
    borderRadius: 12,
    color: '#1E3A8A',
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 18,
    borderRadius: 12,
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
  buttonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0.2,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  successContainer: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  successIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  successText: {
    color: '#065F46',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
  },
  backText: {
    textAlign: 'center',
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  linkText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
});

