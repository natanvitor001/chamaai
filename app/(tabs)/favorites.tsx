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
} from 'react-native';
import { router } from 'expo-router';
import { Heart, Star, MapPin, MessageCircle, Phone } from 'lucide-react-native';

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

interface FavoriteService {
  id: string;
  name: string;
  category: string;
  rating: number;
  price: string;
  distance: string;
  image: string;
  isAvailable: boolean;
  completedJobs: number;
  lastWorked: string;
}

const favoriteServices: FavoriteService[] = [
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
    lastWorked: 'Há 2 semanas',
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
    lastWorked: 'Há 1 mês',
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
    lastWorked: 'Há 3 semanas',
  },
];

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState(favoriteServices);

  const handleRemoveFavorite = (serviceId: string) => {
    setFavorites(prev => prev.filter(service => service.id !== serviceId));
  };

  const handleContactPress = (service: FavoriteService) => {
    router.push('/chat');
  };

  const handleCallPress = (service: FavoriteService) => {
    // Implement call functionality
    console.log('Calling', service.name);
  };

  const renderFavoriteCard = (service: FavoriteService) => (
    <View key={service.id} style={styles.favoriteCard}>
      <Image source={{ uri: service.image }} style={styles.serviceImage} />
      
      <View style={styles.serviceInfo}>
        <View style={styles.serviceHeader}>
          <View style={styles.serviceNameContainer}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => handleRemoveFavorite(service.id)}
            >
              <Heart size={20} color={COLORS.danger} fill={COLORS.danger} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.ratingContainer}>
            <Star size={14} color={COLORS.warning} fill={COLORS.warning} />
            <Text style={styles.rating}>{service.rating}</Text>
          </View>
        </View>
        
        <Text style={styles.serviceCategory}>{service.category}</Text>
        
        <View style={styles.serviceStats}>
          <Text style={styles.completedJobs}>
            {service.completedJobs} trabalhos • {service.lastWorked}
          </Text>
        </View>
        
        <View style={styles.serviceDetails}>
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
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.messageButton]}
            onPress={() => handleContactPress(service)}
          >
            <MessageCircle size={16} color={COLORS.white} />
            <Text style={styles.messageButtonText}>Mensagem</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={() => handleCallPress(service)}
          >
            <Phone size={16} color={COLORS.primary} />
            <Text style={styles.callButtonText}>Ligar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoritos</Text>
        <Text style={styles.headerSubtitle}>
          {favorites.length} profissionais salvos
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {favorites.length > 0 ? (
          favorites.map(renderFavoriteCard)
        ) : (
          <View style={styles.emptyState}>
            <Heart size={64} color={COLORS.grayLight} />
            <Text style={styles.emptyStateTitle}>
              Nenhum favorito ainda
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              Adicione profissionais aos seus favoritos para encontrá-los facilmente
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/services')}
            >
              <Text style={styles.exploreButtonText}>Explorar Serviços</Text>
            </TouchableOpacity>
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
    paddingBottom: 20,
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
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  favoriteCard: {
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
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
    marginLeft: 8,
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
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  messageButton: {
    backgroundColor: COLORS.primary,
  },
  messageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  callButton: {
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});