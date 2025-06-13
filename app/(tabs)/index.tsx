import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Search, MapPin, Star, Clock, ArrowRight } from 'lucide-react-native';

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

interface Service {
  id: string;
  name: string;
  category: string;
  rating: number;
  price: string;
  distance: string;
  image: string;
  isAvailable: boolean;
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const serviceCategories: ServiceCategory[] = [
  { id: '1', name: 'Limpeza', icon: '🧹', color: '#E3F2FD' },
  { id: '2', name: 'Elétrica', icon: '⚡', color: '#FFF3E0' },
  { id: '3', name: 'Encanamento', icon: '🔧', color: '#E8F5E8' },
  { id: '4', name: 'Pintura', icon: '🎨', color: '#FCE4EC' },
  { id: '5', name: 'Jardinagem', icon: '🌱', color: '#F1F8E9' },
  { id: '6', name: 'Marcenaria', icon: '🪚', color: '#FFF8E1' },
];

const featuredServices: Service[] = [
  {
    id: '1',
    name: 'Maria Silva',
    category: 'Limpeza Residencial',
    rating: 4.9,
    price: 'R$ 80/dia',
    distance: '2.3 km',
    image: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'João Santos',
    category: 'Eletricista',
    rating: 4.8,
    price: 'R$ 120/serviço',
    distance: '1.8 km',
    image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Ana Costa',
    category: 'Encanadora',
    rating: 4.7,
    price: 'R$ 100/hora',
    distance: '3.1 km',
    image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: false,
  },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('Cliente');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleServicePress = (service: Service) => {
    // Navigate to service details or chat
    router.push('/chat');
  };

  const handleCategoryPress = (category: ServiceCategory) => {
    router.push('/services');
  };

  const renderServiceCategory = (category: ServiceCategory) => (
    <TouchableOpacity
      key={category.id}
      style={[styles.categoryCard, { backgroundColor: category.color }]}
      onPress={() => handleCategoryPress(category)}
      activeOpacity={0.7}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  );

  const renderFeaturedService = (service: Service) => (
    <TouchableOpacity
      key={service.id}
      style={styles.serviceCard}
      onPress={() => handleServicePress(service)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: service.image }} style={styles.serviceImage} />
      <View style={styles.serviceInfo}>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color={COLORS.warning} fill={COLORS.warning} />
            <Text style={styles.rating}>{service.rating}</Text>
          </View>
        </View>
        <Text style={styles.serviceCategory}>{service.category}</Text>
        <View style={styles.serviceFooter}>
          <View style={styles.priceDistance}>
            <Text style={styles.price}>{service.price}</Text>
            <View style={styles.distanceContainer}>
              <MapPin size={12} color={COLORS.gray} />
              <Text style={styles.distance}>{service.distance}</Text>
            </View>
          </View>
          <View style={[
            styles.availabilityBadge,
            { backgroundColor: service.isAvailable ? COLORS.success : COLORS.gray }
          ]}>
            <Text style={styles.availabilityText}>
              {service.isAvailable ? 'Disponível' : 'Ocupado'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>Olá, {userName}! 👋</Text>
            <Text style={styles.subtitle}>O que você precisa hoje?</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar serviços..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.gray}
          />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias Populares</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {serviceCategories.map(renderServiceCategory)}
          </ScrollView>
        </View>

        {/* Emergency Button */}
        <TouchableOpacity style={styles.emergencyButton} activeOpacity={0.8}>
          <View style={styles.emergencyContent}>
            <View style={styles.emergencyIcon}>
              <Clock size={24} color={COLORS.white} />
            </View>
            <View style={styles.emergencyText}>
              <Text style={styles.emergencyTitle}>Serviço Urgente</Text>
              <Text style={styles.emergencySubtitle}>Disponível 24h</Text>
            </View>
            <ArrowRight size={20} color={COLORS.white} />
          </View>
        </TouchableOpacity>

        {/* Featured Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profissionais em Destaque</Text>
            <TouchableOpacity onPress={() => router.push('/services')}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.servicesContainer}>
            {featuredServices.map(renderFeaturedService)}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atividade Recente</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>
              Você ainda não tem atividades recentes.
            </Text>
            <Text style={styles.activitySubtext}>
              Comece solicitando um serviço!
            </Text>
          </View>
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
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.dark,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingLeft: 20,
  },
  categoryCard: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 2,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.dark,
    textAlign: 'center',
  },
  emergencyButton: {
    marginHorizontal: 20,
    backgroundColor: COLORS.danger,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    elevation: 4,
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emergencyText: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  servicesContainer: {
    paddingHorizontal: 20,
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: 120,
  },
  serviceInfo: {
    padding: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    marginLeft: 4,
  },
  serviceCategory: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 12,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceDistance: {
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 4,
  },
  availabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  activityCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: 8,
  },
  activitySubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
});