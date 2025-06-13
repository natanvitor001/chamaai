// src/screens/EmailVerificationScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { resendVerificationEmail, checkEmailVerification, getCurrentUser } from '../storage/firebaseAuth';

type EmailVerificationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EmailVerification'>;

type Props = {
  navigation: EmailVerificationScreenNavigationProp;
};

export default function EmailVerificationScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserEmail(user.email || '');
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      await resendVerificationEmail();
      setResendCooldown(30); // Inicia o cooldown de 30 segundos
      Alert.alert(
        'E-mail enviado',
        'Um novo e-mail de verificação foi enviado. Verifique sua caixa de entrada e spam.'
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao reenviar e-mail de verificação.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setChecking(true);
    try {
      const isVerified = await checkEmailVerification();
      if (isVerified) {
        Alert.alert(
          'E-mail verificado!',
          'Seu e-mail foi verificado com sucesso. Você pode fazer login agora.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      } else {
        // Mesmo se não verificado, redireciona para o login
        Alert.alert(
          'Redirecionando para login',
          'Você será redirecionado para a tela de login. Lembre-se de verificar seu e-mail antes de tentar fazer login.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      }
    } catch (error: any) {
      // Em caso de erro, também redireciona para o login
      Alert.alert(
        'Redirecionando para login',
        'Você será redirecionado para a tela de login. Lembre-se de verificar seu e-mail antes de tentar fazer login.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>📧</Text>
        <Text style={styles.title}>Verifique seu e-mail</Text>
        <Text style={styles.description}>
          Enviamos um e-mail de verificação para:
        </Text>
        <Text style={styles.email}>{userEmail}</Text>
        <Text style={styles.instruction}>
          Clique no link do e-mail para verificar sua conta. Não se esqueça de verificar a pasta de spam.
        </Text>

        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleCheckVerification}
          disabled={checking}
        >
          {checking ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Já verifiquei</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.secondaryButton, (loading || resendCooldown > 0) && styles.disabledButton]} 
          onPress={handleResendVerification}
          disabled={loading || resendCooldown > 0}
        >
          {loading ? (
            <ActivityIndicator color="#0A8754" />
          ) : (
            <Text style={[styles.secondaryButtonText, (resendCooldown > 0) && styles.disabledButtonText]}>
              {resendCooldown > 0 ? `Aguarde ${resendCooldown}s` : 'Reenviar e-mail'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>Voltar ao login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFFE',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#064635',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A8754',
    marginBottom: 24,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#0A8754',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#0A8754',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0A8754',
    marginBottom: 24,
    minWidth: 200,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#0A8754',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
  linkButton: {
    paddingVertical: 8,
  },
  linkText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
});

