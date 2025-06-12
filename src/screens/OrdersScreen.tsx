import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function OrdersScreen({ navigation }) {
  const [hasOrders, setHasOrders] = useState(false); // This state should be determined by actual data

  useEffect(() => {
    // In a real application, you would fetch user's orders here
    // and update the 'hasOrders' state accordingly.
    // For now, we'll simulate no orders.
    setHasOrders(false);
  }, []);

  const handleMakeServiceRequest = () => {
    navigation.navigate('NewServiceRequest');
  };

  const handleGoBack = () => {
    navigation.navigate('HomeTab');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#007BFF" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Meus Pedidos</Text>
        <View style={styles.placeholder}></View>
      </View>
      
      <View style={styles.content}>
        {!hasOrders ? (
          <TouchableOpacity style={styles.button} onPress={handleMakeServiceRequest}>
            <Text style={styles.buttonText}>Fazer solicitação de serviço</Text>
          </TouchableOpacity>
        ) : (
          <Text>Lista de pedidos realizados pelo cliente.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007BFF',
    fontSize: 16,
    marginLeft: 4,
  },
  placeholder: {
    width: 70, // Para equilibrar o layout com o botão de voltar
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 50,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


