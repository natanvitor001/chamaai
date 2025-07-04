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
  FlatList,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Search, Filter, MapPin, Star, Clock, Heart } from 'lucide-react-native';

const { width } = Dimensions.get('window');

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
  isFavorite: boolean;
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
    isFavorite: false,
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
    isFavorite: true,
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
    isFavorite: false,
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
    isFavorite: false,
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
    isFavorite: true,
  },
  {
    id: '6',
    name: 'Roberto Silva',
    category: 'Marceneiro',
    rating: 4.5,
    price: 'R$ 110/dia',
    distance: '5.1 km',
    image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
    isAvailable: true,
    completedJobs: 62,
    isFavorite: false,
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
  const [favorites, setFavorites] = useState<string[]>(['2', '5']);

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

  const toggleFavorite = (serviceId: string) => {
    setFavorites(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const renderCategoryButton = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.categoryButtonActive
      ]}
      onPress={() => handleCategoryPress(category)}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === category && styles.categoryButtonTextActive
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  const renderServiceCard = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => handleServicePress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.serviceImageContainer}>
        <Image source={{ uri: item.image }} style={styles.serviceImage} />
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Heart 
            size={20} 
            color={favorites.includes(item.id) ? COLORS.danger : COLORS.white} 
            fill={favorites.includes(item.id) ? COLORS.danger : 'transparent'}
          />
        </TouchableOpacity>
        <View style={[
          styles.availabilityBadge,
          { backgroundColor: item.isAvailable ? COLORS.success : COLORS.gray }
        ]}>
          <Text style={styles.availabilityText}>
            {item.isAvailable ? 'Disponível' : 'Ocupado'}
          </Text>
        </View>
      </View>
      
      <View style={styles.serviceInfo}>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color={COLORS.warning} fill={COLORS.warning} />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
        </View>
        
        <Text style={styles.serviceCategory}>{item.category}</Text>
        
        <View style={styles.serviceStats}>
          <Text style={styles.completedJobs}>
            {item.completedJobs} trabalhos concluídos
          </Text>
        </View>
        
        <View style={styles.serviceFooter}>
          <View style={styles.priceDistance}>
            <Text style={styles.price}>{item.price}</Text>
            <View style={styles.distanceContainer}>
              <MapPin size={12} color={COLORS.gray} />
              <Text style={styles.distance}>{item.distance}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contatar</Text>
          </TouchableOpacity>
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
      <FlatList
        data={filteredServices}
        renderItem={renderServiceCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.servicesContainer}
        numColumns={2}
        columnWrapperStyle={styles.serviceRow}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>
              Nenhum profissional encontrado
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              Tente ajustar os filtros ou buscar por outro termo
            </Text>
          </View>
        }
      />
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
    elevation: 2,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    borderRadius: 16,
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
  servicesContainer: {
    padding: 16,
  },
  serviceRow: {
    justifyContent: 'space-between',
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
    width: (width - 48) / 2,
  },
  serviceImageContainer: {
    position: 'relative',
  },
  serviceImage: {
    width: '100%',
    height: 120,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  availabilityBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.white,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.dark,
    marginLeft: 4,
  },
  serviceCategory: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 8,
  },
  serviceStats: {
    marginBottom: 12,
  },
  completedJobs: {
    fontSize: 10,
    color: COLORS.gray,
  },
  serviceFooter: {
    flexDirection: 'column',
    gap: 8,
  },
  priceDistance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 10,
    color: COLORS.gray,
    marginLeft: 4,
  },
  contactButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
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