import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Star,
  MapPin,
  Phone,
  Mail,
  Edit3
} from 'lucide-react-native';

const COLORS = {
  primary: '#1A237E',
  primaryLight: '#3F51B5',
  secondary: '#424242',
  accent: '#448AFF',
  success: '#4CAF50',
  warning: '#FFC107',
  danger: '#F44336',
  light: '#F8FAFC',
  white: '#FFFFFF',
  gray: '#64748B',
  grayLight: '#E2E8F0',
  dark: '#1E293B',
};

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  rating: number;
  completedServices: number;
  memberSince: string;
}

const userProfile: UserProfile = {
  name: 'João Silva',
  email: 'joao.silva@email.com',
  phone: '(11) 99999-9999',
  location: 'São Paulo, SP',
  avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
  rating: 4.8,
  completedServices: 23,
  memberSince: 'Janeiro 2023',
};

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  action: () => void;
  showChevron?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    console.log('Edit profile');
  };

  const handleLogout = () => {
    // Implement logout logic
    console.log('Logout');
  };

  const menuSections: MenuSection[] = [
    {
      title: 'Conta',
      items: [
        {
          id: 'edit-profile',
          title: 'Editar Perfil',
          subtitle: 'Alterar informações pessoais',
          icon: Edit3,
          action: handleEditProfile,
          showChevron: true,
        },
        {
          id: 'notifications',
          title: 'Notificações',
          subtitle: 'Receber alertas e atualizações',
          icon: Bell,
          action: () => {},
          showSwitch: true,
          switchValue: notificationsEnabled,
          onSwitchChange: setNotificationsEnabled,
        },
        {
          id: 'location',
          title: 'Localização',
          subtitle: 'Permitir acesso à localização',
          icon: MapPin,
          action: () => {},
          showSwitch: true,
          switchValue: locationEnabled,
          onSwitchChange: setLocationEnabled,
        },
      ],
    },
    {
      title: 'Serviços',
      items: [
        {
          id: 'payment',
          title: 'Pagamentos',
          subtitle: 'Métodos de pagamento e histórico',
          icon: CreditCard,
          action: () => console.log('Payments'),
          showChevron: true,
        },
        {
          id: 'privacy',
          title: 'Privacidade e Segurança',
          subtitle: 'Configurações de privacidade',
          icon: Shield,
          action: () => console.log('Privacy'),
          showChevron: true,
        },
      ],
    },
    {
      title: 'Suporte',
      items: [
        {
          id: 'help',
          title: 'Central de Ajuda',
          subtitle: 'FAQ e suporte técnico',
          icon: HelpCircle,
          action: () => console.log('Help'),
          showChevron: true,
        },
        {
          id: 'settings',
          title: 'Configurações',
          subtitle: 'Preferências do aplicativo',
          icon: Settings,
          action: () => console.log('Settings'),
          showChevron: true,
        },
      ],
    },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.action}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>
          <item.icon size={20} color={COLORS.primary} />
        </View>
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.menuItemRight}>
        {item.showSwitch && (
          <Switch
            value={item.switchValue}
            onValueChange={item.onSwitchChange}
            trackColor={{ false: COLORS.grayLight, true: COLORS.primary }}
            thumbColor={COLORS.white}
          />
        )}
        {item.showChevron && (
          <ChevronRight size={20} color={COLORS.gray} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderMenuSection = (section: MenuSection) => (
    <View key={section.title} style={styles.menuSection}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map(renderMenuItem)}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: userProfile.avatar }} style={styles.profileImage} />
            <TouchableOpacity style={styles.editImageButton} onPress={handleEditProfile}>
              <Edit3 size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileEmail}>{userProfile.email}</Text>
          
          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Star size={16} color={COLORS.warning} fill={COLORS.warning} />
              </View>
              <Text style={styles.statValue}>{userProfile.rating}</Text>
              <Text style={styles.statLabel}>Avaliação</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProfile.completedServices}</Text>
              <Text style={styles.statLabel}>Serviços</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2023</Text>
              <Text style={styles.statLabel}>Membro desde</Text>
            </View>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <Phone size={16} color={COLORS.gray} />
            <Text style={styles.contactText}>{userProfile.phone}</Text>
          </View>
          <View style={styles.contactItem}>
            <MapPin size={16} color={COLORS.gray} />
            <Text style={styles.contactText}>{userProfile.location}</Text>
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map(renderMenuSection)}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={20} color={COLORS.danger} />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.appVersion}>
          <Text style={styles.versionText}>Versão 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 24,
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statIcon: {
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.grayLight,
  },
  contactInfo: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 12,
  },
  menuSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.grayLight,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },
  menuItemRight: {
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.danger,
    marginLeft: 8,
  },
  appVersion: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.gray,
  },
});