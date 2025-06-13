// src/screens/SimpleLoginScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

type SimpleLoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: SimpleLoginScreenNavigationProp;
};

export default function SimpleLoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [celular, setCelular] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'cliente' | 'prestador'>('cliente');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }

    setLoading(true);
    try {
      console.log('Tentando fazer login...');
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      
      console.log('Login realizado, verificando email...');
      if (!user.emailVerified) {
        Alert.alert(
          'Email não verificado',
          'Verifique seu email antes de fazer login. Deseja reenviar?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Reenviar', 
              onPress: async () => {
                await sendEmailVerification(user);
                Alert.alert('Sucesso', 'Email de verificação reenviado!');
              }
            }
          ]
        );
        setLoading(false);
        return;
      }

      console.log('Buscando dados do usuário...');
      const userDoc = await getDoc(doc(db, 'Usuarios', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Dados do usuário:', userData);
        
        if (userData.tipo !== userType) {
          Alert.alert('Erro', `Este usuário é ${userData.tipo}. Selecione o tipo correto.`);
          setLoading(false);
          return;
        }

        // Navegar para a tela correta
        if (userData.tipo === 'cliente') {
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
      } else {
        Alert.alert('Erro', 'Dados do usuário não encontrados');
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      Alert.alert('Erro', error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleCadastro = async () => {
    if (!email || !senha || !nome || !celular) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      console.log('Criando usuário...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      console.log('Salvando dados no Firestore...');
      await setDoc(doc(db, 'Usuarios', user.uid), {
        nome,
        email,
        celular,
        telefone: celular,
        tipo: userType,
        uid: user.uid,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('Enviando email de verificação...');
      await sendEmailVerification(user);

      Alert.alert(
        'Cadastro realizado!',
        'Verifique seu email e depois faça login.',
        [
          {
            text: 'OK',
            onPress: () => {
              setIsLogin(true);
              setNome('');
              setCelular('');
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      Alert.alert('Erro', error.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ChamaAí</Text>
      
      {/* Toggle Login/Cadastro */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, isLogin && styles.toggleActive]}
          onPress={() => setIsLogin(true)}
        >
          <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !isLogin && styles.toggleActive]}
          onPress={() => setIsLogin(false)}
        >
          <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>
            Cadastro
          </Text>
        </TouchableOpacity>
      </View>

      {/* Toggle Tipo de Usuário */}
      <View style={styles.userTypeContainer}>
        <TouchableOpacity
          style={[styles.userTypeButton, userType === 'cliente' && styles.userTypeActive]}
          onPress={() => setUserType('cliente')}
        >
          <Text style={[styles.userTypeText, userType === 'cliente' && styles.userTypeTextActive]}>
            Cliente
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.userTypeButton, userType === 'prestador' && styles.userTypeActive]}
          onPress={() => setUserType('prestador')}
        >
          <Text style={[styles.userTypeText, userType === 'prestador' && styles.userTypeTextActive]}>
            Prestador
          </Text>
        </TouchableOpacity>
      </View>

      {/* Campos do formulário */}
      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        autoCapitalize="none"
      />

      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Celular"
          value={celular}
          onChangeText={setCelular}
          keyboardType="phone-pad"
        />
      )}

      {/* Botão principal */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={isLogin ? handleLogin : handleCadastro}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleActive: {
    backgroundColor: '#007bff',
  },
  toggleText: {
    color: '#666',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
  },
  userTypeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 4,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  userTypeActive: {
    backgroundColor: '#28a745',
  },
  userTypeText: {
    color: '#666',
    fontWeight: '600',
  },
  userTypeTextActive: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

