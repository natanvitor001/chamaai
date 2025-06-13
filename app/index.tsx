import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { authService } from '@/services/firebaseAuth';

export default function IndexScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        // Get user data to determine type
        const userData = await authService.getUserFromFirestorePublic(user.uid);
        if (userData?.tipo === 'prestador') {
          router.replace('/(prestador)');
        } else {
          router.replace('/(cliente)');
        }
      } else {
        router.replace('/login');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      router.replace('/login');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
  },
});