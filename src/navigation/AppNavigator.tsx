import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

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

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
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

