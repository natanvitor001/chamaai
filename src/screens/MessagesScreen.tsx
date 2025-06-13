import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

// Importando serviços de chat
import { 
  listenToUserChats, 
  getAllUsers, 
  searchUsers,
  createOrGetChat,
  Chat 
} from '../services/chatService';
import { authService } from '../storage/firebaseAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'Messages'>;

interface User {
  uid: string;
  name: string;
  tipo: 'cliente' | 'prestador';
  avatar?: string;
}

export default function MessagesScreen({ navigation }: Props) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'chats' | 'users'>('chats');

  useEffect(() => {
    loadChats();
    loadAllUsers();
  }, []);

  const loadChats = () => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    const unsubscribe = listenToUserChats((newChats) => {
      setChats(newChats);
      setLoading(false);
      setRefreshing(false);
    });

    return unsubscribe;
  };

  const loadAllUsers = async () => {
    try {
      const users = await getAllUsers();
      setAllUsers(users);
      console.log(`Carregados ${users.length} usuários disponíveis para chat`);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadChats();
    loadAllUsers();
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    }
    
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    if (messageDate > weekAgo) {
      return messageDate.toLocaleDateString('pt-BR', { weekday: 'short' });
    }
    
    return messageDate.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const getOtherUserData = (chat: Chat) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return null;

    const otherUserId = chat.participants.find(id => id !== currentUser.uid);
    if (!otherUserId) return null;

    return chat.participantsData[otherUserId];
  };

  const openChat = (chat: Chat) => {
    const otherUserData = getOtherUserData(chat);
    if (!otherUserData) return;
    navigation.navigate("Chat", {
      otherUser: {
        uid: chat.participants.find(id => id !== authService.getCurrentUser()?.uid) || otherUserData.uid,
        name: otherUserData.name,
        avatar: otherUserData.avatar,
        tipo: otherUserData.tipo
      }
    });
  };

  const startNewChat = async (user: User) => {
    try {
      const chatId = await createOrGetChat(user.uid, {
        name: user.name,
        avatar: user.avatar,
        tipo: user.tipo
      });
      
      navigation.navigate('Chat', {
        otherUser: user
      });
    } catch (error) {
      console.error('Erro ao criar chat:', error);
      Alert.alert('Erro', 'Não foi possível iniciar a conversa');
    }
  };

  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderChatItem = ({ item }: { item: Chat }) => {
    const otherUserData = getOtherUserData(item);
    if (!otherUserData) return null;

    const lastMessageText = item.lastMessage?.text || 'Nenhuma mensagem';
    const lastMessageTime = item.lastMessage?.createdAt ? formatTime(item.lastMessage.createdAt) : '';

    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => openChat(item)}>
        <Image 
          source={{ 
            uri: otherUserData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUserData.name)}&background=3B82F6&color=fff`
          }} 
          style={styles.avatar} 
        />
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{otherUserData.name}</Text>
            <Text style={styles.chatTime}>{lastMessageTime}</Text>
          </View>
          <View style={styles.chatPreview}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessageText}
            </Text>
            <View style={[styles.chatBadge, { backgroundColor: otherUserData.tipo === 'cliente' ? '#3B82F6' : '#10B981' }]}>
              <Text style={styles.badgeText}>
                {otherUserData.tipo === 'cliente' ? 'C' : 'P'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => startNewChat(item)}>
      <Image 
        source={{ 
          uri: item.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=3B82F6&color=fff`
        }} 
        style={styles.avatar} 
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userType}>
          {item.tipo === 'cliente' ? 'Cliente' : 'Prestador de Serviços'}
        </Text>
      </View>
      <Ionicons name="chatbubble-outline" size={20} color="#3B82F6" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ marginTop: 16, color: '#64748B' }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mensagens</Text>
        <View style={styles.userCount}>
          <Ionicons name="people" size={16} color="#3B82F6" />
          <Text style={styles.userCountText}>{allUsers.length} usuários</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'chats' && styles.activeTab]}
          onPress={() => setActiveTab('chats')}
        >
          <Ionicons 
            name="chatbubbles" 
            size={20} 
            color={activeTab === 'chats' ? '#3B82F6' : '#64748B'} 
          />
          <Text style={[styles.tabText, activeTab === 'chats' && styles.activeTabText]}>
            Conversas ({chats.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Ionicons 
            name="people" 
            size={20} 
            color={activeTab === 'users' ? '#3B82F6' : '#64748B'} 
          />
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            Todos Usuários ({allUsers.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Barra de Pesquisa (apenas na aba de usuários) */}
      {activeTab === 'users' && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar usuários..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#94A3B8"
          />
        </View>
      )}

      {/* Lista de Conversas ou Usuários */}
      {activeTab === 'chats' ? (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color="#CBD5E1" />
              <Text style={styles.emptyText}>Nenhuma conversa ainda</Text>
              <Text style={styles.emptySubtext}>
                Vá para a aba "Todos Usuários" para iniciar uma conversa
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.uid}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color="#CBD5E1" />
              <Text style={styles.emptyText}>Nenhum usuário encontrado</Text>
              <Text style={styles.emptySubtext}>
                Tente uma pesquisa diferente
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  userCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  userCountText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  chatInfo: {
    flex: 1,
  },
  userInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  chatTime: {
    fontSize: 12,
    color: '#64748B',
  },
  chatPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#64748B',
    marginRight: 12,
  },
  userType: {
    fontSize: 14,
    color: '#64748B',
  },
  chatBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});