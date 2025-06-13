import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import Login from '../screens/LoginScreen';
import Cadastro from '../screens/CadastroScreen';
import ForgotPassword from '../screens/ForgotPasswordScreen';
import DrawerNavigator from './DrawerNavigator';
import PrestadorTabNavigator from './PrestadorTabNavigator';
import ChatScreen from '../screens/ChatScreen';
import NewServiceRequestScreen from '../screens/NewServiceRequestScreen';
import LojaScreen from '../screens/LojaScreen';
import EmailVerification from '../screens/EmailVerificationScreen';

import { RootStackParamList } from '../screens/types';
import { authService } from '../storage/firebaseAuth';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Componente de loading
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  );
}

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'cliente' | 'prestador' | null>(null);

  useEffect(() => {
    // Observar mudanças no estado de autenticação
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser && firebaseUser.emailVerified) {
          // Usuário logado e email verificado
          console.log('Usuário autenticado:', firebaseUser.email);
          
          // Buscar dados completos do usuário
          const userData = await authService.getUserFromFirestorePublic(firebaseUser.uid);
          
          if (userData) {
            setUserType(userData.tipo);
            setIsAuthenticated(true);
            console.log('Tipo de usuário:', userData.tipo);
          } else {
            // Se não encontrar dados, fazer logout
            console.log('Dados do usuário não encontrados, fazendo logout');
            await authService.logoutUser();
            setIsAuthenticated(false);
            setUserType(null);
          }
        } else {
          // Usuário não logado ou email não verificado
          console.log('Usuário não autenticado ou email não verificado');
          setIsAuthenticated(false);
          setUserType(null);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
        setUserType(null);
      } finally {
        setIsLoading(false);
      }
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Determinar tela inicial baseada no estado de autenticação
  const getInitialRouteName = (): keyof RootStackParamList => {
    if (isAuthenticated && userType) {
      return userType === 'cliente' ? 'MainApp' : 'PrestadorApp';
    }
    return 'Login';
  };

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={getInitialRouteName()} 
        screenOptions={{ headerShown: false }}
      >
        {/* Telas de autenticação */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="EmailVerification" component={EmailVerification} />
        
        {/* Telas principais */}
        <Stack.Screen name="MainApp" component={DrawerNavigator} />
        <Stack.Screen name="PrestadorApp" component={PrestadorTabNavigator} />
        
        {/* Telas modais/secundárias */}
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen 
          name="NewServiceRequest" 
          component={NewServiceRequestScreen}
          options={{
            headerShown: true,
            title: 'Nova Solicitação',
            headerBackTitle: 'Voltar'
          }}
        />
        <Stack.Screen 
          name="Loja" 
          component={LojaScreen}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
  },
});

