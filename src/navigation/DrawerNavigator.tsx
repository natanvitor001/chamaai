import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import OrdersScreen from '../screens/OrdersScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import MessagesScreen from '../screens/MessagesScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getUser } from '../storage/UserStorage';

const Drawer = createDrawerNavigator();

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

function CustomDrawerContent(props: any) {
  const [profileImage, setProfileImage] = useState('https://i.pravatar.cc/150');
  const [userName, setUserName] = useState('Menu Principal');

  // Carregar dados do usuário
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getUser();
        if (userData) {
          setUserName(userData.nome || 'Menu Principal');
          if (userData.profileImage) {
            setProfileImage(userData.profileImage);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    };
    
    loadUserData();
  }, []);

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Image source={{ uri: profileImage }} style={styles.drawerHeaderImage} />
        <Text style={styles.drawerHeaderText}>{userName}</Text>
      </View>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.navigate('MainTabs');
          props.navigation.closeDrawer();
        }}
      >
        <Ionicons name="home-outline" size={22} color={COLORS.primary} />
        <Text style={styles.drawerItemText}>Página Inicial</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.navigate('Orders');
          props.navigation.closeDrawer();
        }}
      >
        <Ionicons name="list-outline" size={22} color={COLORS.primary} />
        <Text style={styles.drawerItemText}>Meus Pedidos</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.navigate('Messages');
          props.navigation.closeDrawer();
        }}
      >
        <Ionicons name="chatbubble-outline" size={22} color={COLORS.primary} />
        <Text style={styles.drawerItemText}>Mensagens</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.navigate('Favorites');
          props.navigation.closeDrawer();
        }}
      >
        <Ionicons name="heart-outline" size={22} color={COLORS.primary} />
        <Text style={styles.drawerItemText}>Favoritos</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.navigate('EditProfile');
          props.navigation.closeDrawer();
        }}
      >
        <Ionicons name="person-outline" size={22} color={COLORS.primary} />
        <Text style={styles.drawerItemText}>Editar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
        drawerStyle: {
          backgroundColor: COLORS.white,
          width: 250,
        },
      }}
    >
      <Drawer.Screen name="MainTabs" component={TabNavigator} />
      <Drawer.Screen name="Orders" component={OrdersScreen} />
      <Drawer.Screen name="EditProfile" component={EditProfileScreen} />
      <Drawer.Screen name="Messages" component={MessagesScreen} />
      <Drawer.Screen name="Favorites" component={FavoritesScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  drawerHeader: {
    backgroundColor: COLORS.primary,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  drawerHeaderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: COLORS.white,
    marginBottom: 10,
  },
  drawerHeaderText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  drawerItemText: {
    fontSize: 16,
    color: COLORS.dark,
    marginLeft: 15,
  },
});


