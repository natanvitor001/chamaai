import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

import SimpleLoginScreen from '../screens/SimpleLoginScreen';
import ForgotPassword from '../screens/ForgotPasswordScreen';
import DrawerNavigator from './DrawerNavigator';
import PrestadorTabNavigator from './PrestadorTabNavigator';
import ChatScreen from '../screens/ChatScreen';
import NewServiceRequestScreen from '../screens/NewServiceRequestScreen';
import LojaScreen from '../screens/LojaScreen';
import EmailVerification from '../screens/EmailVerificationScreen';

import { RootStackParamList } from '../screens/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007bff" />
    </View>
  );
}

export default function SimpleAppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<'cliente' | 'prestador' | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser && firebaseUser.emailVerified) {
          console.log('Usuário autenticado:', firebaseUser.email);
          
          // Buscar dados do usuário no Firestore
          const userDoc = await getDoc(doc(db, 'Usuarios', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('Dados do usuário:', userData);
            setUser(firebaseUser);
            setUserType(userData.tipo);
          } else {
            console.log('Dados do usuário não encontrados');
            setUser(null);
            setUserType(null);
          }
        } else {
          console.log('Usuário não autenticado ou email não verificado');
          setUser(null);
          setUserType(null);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setUser(null);
        setUserType(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const getInitialRouteName = (): keyof RootStackParamList => {
    if (user && userType) {
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
        <Stack.Screen name="Login" component={SimpleLoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="EmailVerification" component={EmailVerification} />
        <Stack.Screen name="MainApp" component={DrawerNavigator} />
        <Stack.Screen name="PrestadorApp" component={PrestadorTabNavigator} />
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
    backgroundColor: '#f5f5f5',
  },
});

