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
import { Search, MessageCircle, Phone, Video, MoreHorizontal } from 'lucide-react-native';

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

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  isOnline: boolean;
  unreadCount: number;
  isTyping?: boolean;
}

const chats: Chat[] = [
  {
    id: '1',
    name: 'Maria Silva',
    lastMessage: 'Oi! Posso fazer a limpeza amanhã às 14h?',
    timestamp: '14:30',
    avatar: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=100',
    isOnline: true,
    unreadCount: 2,
  },
  {
    id: '2',
    name: 'João Santos',
    lastMessage: 'Perfeito! Vou levar as ferramentas necessárias.',
    timestamp: '13:45',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100',
    isOnline: true,
    unreadCount: 0,
  },
  {
    id: '3',
    name: 'Ana Costa',
    lastMessage: 'Obrigada pela confiança! 😊',
    timestamp: '12:20',
    avatar: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=100',
    isOnline: false,
    unreadCount: 0,
  },
  {
    id: '4',
    name: 'Carlos Oliveira',
    lastMessage: 'Posso começar na segunda-feira?',
    timestamp: '11:15',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
    isOnline: true,
    unreadCount: 1,
    isTyping: true,
  },
  {
    id: '5',
    name: 'Fernanda Lima',
    lastMessage: 'Vou enviar o orçamento em breve.',
    timestamp: 'Ontem',
    avatar: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=100',
    isOnline: false,
    unreadCount: 0,
  },
];

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState(chats);

  const handleChatPress = (chat: Chat) => {
    router.push('/chat');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter(chat =>
        chat.name.toLowerCase().includes(query.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return timestamp;
  };

  const renderChatItem = (chat: Chat) => (
    <TouchableOpacity
      key={chat.id}
      style={styles.chatItem}
      onPress={() => handleChatPress(chat)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: chat.avatar }} style={styles.avatar} />
        {chat.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{chat.name}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(chat.timestamp)}</Text>
        </View>
        
        <View style={styles.messageRow}>
          <Text style={[
            styles.lastMessage,
            chat.unreadCount > 0 && styles.unreadMessage
          ]} numberOfLines={1}>
            {chat.isTyping ? 'Digitando...' : chat.lastMessage}
          </Text>
          
          {chat.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <TouchableOpacity style={styles.moreButton}>
        <MoreHorizontal size={20} color={COLORS.gray} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mensagens</Text>
        <Text style={styles.headerSubtitle}>
          {filteredChats.length} conversas
        </Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar conversas..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={COLORS.gray}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <View style={styles.quickActionIcon}>
            <MessageCircle size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.quickActionText}>Nova conversa</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <View style={styles.quickActionIcon}>
            <Phone size={20} color={COLORS.success} />
          </View>
          <Text style={styles.quickActionText}>Chamada</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton}>
          <View style={styles.quickActionIcon}>
            <Video size={20} color={COLORS.accent} />
          </View>
          <Text style={styles.quickActionText}>Vídeo</Text>
        </TouchableOpacity>
      </View>

      {/* Chats List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filteredChats.map(renderChatItem)}
        
        {filteredChats.length === 0 && (
          <View style={styles.emptyState}>
            <MessageCircle size={64} color={COLORS.grayLight} />
            <Text style={styles.emptyStateTitle}>
              Nenhuma conversa encontrada
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              {searchQuery ? 'Tente buscar por outro termo' : 'Inicie uma conversa com um profissional'}
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
  quickActions: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  chatContent: {
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
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.gray,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.gray,
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    fontWeight: '600',
    color: COLORS.dark,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  moreButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
});