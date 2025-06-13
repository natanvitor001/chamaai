import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Platform } from 'react-native';
import PrestadorHome from '../screens/PrestadorHome';
import MinhasPropostasScreen from '../screens/MinhasPropostasScreen';
import CarteiraScreen from '../screens/CarteiraScreen';
import ChatScreen from '../screens/ChatScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Tab = createBottomTabNavigator();

// Cores do tema (Paleta de azul escuro)
const COLORS = {
  primary: '#1A237E', // Azul escuro principal (Deep Purple 900)
  primaryDark: '#000051', // Azul escuro mais profundo
  secondary: '#424242', // Cinza escuro para acentos
  accent: '#448AFF', // Azul vibrante para destaque (Blue A200)
  success: '#4CAF50', // Verde para sucesso
  danger: '#D32F2F', // Vermelho para erro
  warning: '#FBC02D', // Amarelo para aviso
  info: '#2196F3', // Azul para informação
  light: '#F5F5F5', // Fundo claro
  dark: '#212121', // Texto escuro
  gray: '#757575', // Cinza para texto secundário
  grayLight: '#E0E0E0', // Cinza claro para bordas
  white: '#FFFFFF', // Branco
  black: '#000000', // Preto
  inputBg: '#E8EAF6', // Fundo de input (Light Blue 50)
  inputBorder: '#9FA8DA', // Borda de input (Indigo 200)
  shadow: 'rgba(0, 0, 0, 0.2)', // Sombra
};

// Componente personalizado para o ícone da tab
function TabBarIcon({ focused, name, label }: { focused: boolean; name: any; label: string }) {
  return (
    <View style={styles.tabIconContainer}>
      <Ionicons 
        name={name} 
        size={24} 
        color={focused ? COLORS.primary : COLORS.gray} 
      />
      <Text style={[
        styles.tabLabel,
        { color: focused ? COLORS.primary : COLORS.gray }
      ]}>
        {label}
      </Text>
    </View>
  );
}

export default function PrestadorTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          height: 60,
          paddingBottom: Platform.OS === 'ios' ? 10 : 5,
          paddingTop: 5,
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.grayLight,
          elevation: 8,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="InicioTab" 
        component={PrestadorHome} 
        options={{ 
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={focused ? 'home' : 'home-outline'} label="Início" />
          ),
        }}
      />
      <Tab.Screen 
        name="PropostasTab" 
        component={MinhasPropostasScreen} 
        options={{ 
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={focused ? 'briefcase' : 'briefcase-outline'} label="Propostas" />
          ),
        }}
      />
      <Tab.Screen 
        name="CarteiraTab" 
        component={CarteiraScreen} 
        options={{ 
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={focused ? 'wallet' : 'wallet-outline'} label="Carteira" />
          ),
        }}
      />
      <Tab.Screen 
        name="ChatTab" 
        component={ChatScreen} 
        options={{ 
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={focused ? 'chatbubble' : 'chatbubble-outline'} label="Chat" />
          ),
        }}
      />
      <Tab.Screen 
        name="PerfilTab" 
        component={EditProfileScreen} 
        options={{ 
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={focused ? 'person' : 'person-outline'} label="Perfil" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 3,
    fontWeight: '500',
  },
});

