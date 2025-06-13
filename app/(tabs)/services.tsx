import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Search, Filter, MapPin, Star, Clock } from 'lucide-react-native';

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
  completedJobs: number;
}

const services: Service[] = [
  {
    id: '1',
    name: 'Maria Silva',
    category: 'Limpeza Residencial',
    rating: 4.9,
    price: 'R$ 80/dia',
    distance: '2.3 km',
    image: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true,
    completedJobs: 127,
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
    completedJobs: 89,
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
    completedJobs: 156,
  },
  {
    id: '4',
    name: 'Carlos Oliveira',
    category: 'Pintor',
    rating: 4.6,
    price: 'R$ 90/dia',
    distance: '4.2 km',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true,
    completedJobs: 73,
  },
  {
    id: '5',
    name: 'Fernanda Lima',
    category: 'Jardinagem',
    rating: 4.8,
    price: 'R$ 70/hora',
    distance: '2.9 km',
    image: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true,
    completedJobs: 94,
  },
];

const categories = [
  'Todos',
  'Limpeza',
  'Elétrica',
  'Encanamento',
  'Pintura',
  'Jardinagem',
  'Marcenaria',
];

export default function ServicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [filteredServices, setFilteredServices] = useState(services);

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
    if (category === 'Todos') {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(service => 
        service.category.toLowerCase().includes(category.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  };

  const handleServicePress = (service: Service) => {
    router.push('/chat');
  };

  const renderCategoryButton = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.categoryButtonActive
      ]}
      onPress={() => handleCategoryPress(category)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === category && styles.categoryButtonTextActive
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  const renderServiceCard = (service: Service) => (
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
        
        <View style={styles.serviceStats}>
          <Text style={styles.completedJobs}>
            {service.completedJobs} trabalhos concluídos
          </Text>
        </View>
        
        <View style={styles.serviceFooter}>
          <View style={styles.priceDistance}>
            <Text style={styles.price}>{service.price}</Text>
            <View style={styles.distanceContainer}>
              <MapPin size={12} color={COLORS.gray} />
              <Text style={styles.distance}>{service.distance}</Text>
            </View>
          </View>
          
          <View style={styles.availabilityContainer}>
            <View style={[
              styles.availabilityDot,
              { backgroundColor: service.isAvailable ? COLORS.success : COLORS.gray }
            ]} />
            <Text style={[
              styles.availabilityText,
              { color: service.isAvailable ? COLORS.success : COLORS.gray }
            ]}>
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
        <Text style={styles.headerTitle}>Serviços</Text>
        <Text style={styles.headerSubtitle}>
          {filteredServices.length} profissionais encontrados
        </Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar profissionais..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.gray}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map(renderCategoryButton)}
        </ScrollView>
      </View>

      {/* Services List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.servicesContainer}
      >
        {filteredServices.map(renderServiceCard)}
        
        {filteredServices.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>
              Nenhum profissional encontrado
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              Tente ajustar os filtros ou buscar por outro termo
            </Text>
          </View>
        )}
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
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 20,
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
  filterButton: {
    padding: 8,
  },
  categoriesSection: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  categoriesContainer: {
    paddingVertical: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.light,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
  },
  categoryButtonTextActive: {
    color: COLORS.white,
  },
  content: {
    flex: 1,
  },
  servicesContainer: {
    padding: 20,
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
    marginBottom: 8,
  },
  serviceStats: {
    marginBottom: 12,
  },
  completedJobs: {
    fontSize: 12,
    color: COLORS.gray,
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
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});