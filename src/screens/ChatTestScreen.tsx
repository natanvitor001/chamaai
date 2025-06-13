import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  sendMessage, 
  createOrGetChat, 
  getAllUsers,
  searchUsers 
} from '../services/chatService';
import { getCurrentUser } from '../storage/firebaseAuth';

export default function ChatTestScreen() {
  const testCreateChat = async () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      // Criar chat de teste com usuário fictício
      const testUser = {
        name: 'Usuário Teste',
        avatar: 'https://ui-avatars.com/api/?name=Teste&background=3B82F6&color=fff',
        tipo: 'cliente' as const
      };

      const chatId = await createOrGetChat('test-user-id', testUser);
      Alert.alert('Sucesso', `Chat criado com ID: ${chatId}`);
    } catch (error) {
      console.error('Erro no teste de criação de chat:', error);
      Alert.alert('Erro', 'Falha ao criar chat de teste');
    }
  };

  const testSendMessage = async () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      // Primeiro criar um chat
      const testUser = {
        name: 'Usuário Teste',
        avatar: 'https://ui-avatars.com/api/?name=Teste&background=3B82F6&color=fff',
        tipo: 'cliente' as const
      };

      const chatId = await createOrGetChat('test-user-id', testUser);
      
      // Enviar mensagem de teste
      await sendMessage(chatId, {
        text: `Mensagem de teste enviada em ${new Date().toLocaleTimeString()}`
      });

      Alert.alert('Sucesso', 'Mensagem de teste enviada!');
    } catch (error) {
      console.error('Erro no teste de envio de mensagem:', error);
      Alert.alert('Erro', 'Falha ao enviar mensagem de teste');
    }
  };

  const testGetUsers = async () => {
    try {
      const users = await getAllUsers();
      Alert.alert('Usuários', `Encontrados ${users.length} usuários no sistema`);
      console.log('Usuários encontrados:', users);
    } catch (error) {
      console.error('Erro no teste de busca de usuários:', error);
      Alert.alert('Erro', 'Falha ao buscar usuários');
    }
  };

  const testSearchUsers = async () => {
    try {
      const results = await searchUsers('test');
      Alert.alert('Busca', `Encontrados ${results.length} usuários com "test"`);
      console.log('Resultados da busca:', results);
    } catch (error) {
      console.error('Erro no teste de busca:', error);
      Alert.alert('Erro', 'Falha na busca de usuários');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Testes do Sistema de Chat</Text>
      
      <TouchableOpacity style={styles.testButton} onPress={testCreateChat}>
        <Ionicons name="chatbubble-outline" size={24} color="#FFFFFF" />
        <Text style={styles.buttonText}>Testar Criação de Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.testButton} onPress={testSendMessage}>
        <Ionicons name="send-outline" size={24} color="#FFFFFF" />
        <Text style={styles.buttonText}>Testar Envio de Mensagem</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.testButton} onPress={testGetUsers}>
        <Ionicons name="people-outline" size={24} color="#FFFFFF" />
        <Text style={styles.buttonText}>Testar Busca de Usuários</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.testButton} onPress={testSearchUsers}>
        <Ionicons name="search-outline" size={24} color="#FFFFFF" />
        <Text style={styles.buttonText}>Testar Pesquisa de Usuários</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Instruções de Teste:</Text>
        <Text style={styles.infoText}>
          1. Execute cada teste individualmente{'\n'}
          2. Verifique os logs no console{'\n'}
          3. Confirme se as operações foram bem-sucedidas{'\n'}
          4. Teste com diferentes usuários autenticados
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 30,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
});

