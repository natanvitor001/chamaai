import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  where,
  getDocs,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { authService } from '../storage/firebaseAuth';

export interface ChatMessage {
  _id: string;
  text?: string;
  createdAt: Date | Timestamp;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  image?: string;
  audio?: string;
  system?: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  participantsData: {
    [uid: string]: {
      name: string;
      avatar?: string;
      tipo: 'cliente' | 'prestador';
    };
  };
  lastMessage?: {
    text: string;
    createdAt: Date | Timestamp;
    senderId: string;
  };
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

// Função para criar ou obter um chat entre dois usuários
export async function createOrGetChat(otherUserId: string, otherUserData: { name: string; avatar?: string; tipo: 'cliente' | 'prestador' }): Promise<string> {
  try {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    const currentUserId = currentUser.uid;
    
    // Criar ID do chat baseado nos UIDs ordenados para garantir consistência
    const chatId = [currentUserId, otherUserId].sort().join('_');
    
    // Verificar se o chat já existe
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);
    
    if (!chatDoc.exists()) {
      // Obter dados do usuário atual
      const currentUserData = await getUserData(currentUserId);
      
      // Criar novo chat
      const chatData: Omit<Chat, 'id'> = {
        participants: [currentUserId, otherUserId],
        participantsData: {
          [currentUserId]: {
            name: currentUserData?.name || currentUser.displayName || 'Usuário',
            avatar: currentUserData?.avatar,
            tipo: currentUserData?.tipo || 'cliente'
          },
          [otherUserId]: {
            name: otherUserData.name,
            avatar: otherUserData.avatar,
            tipo: otherUserData.tipo
          }
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(chatRef, chatData);
    }
    
    return chatId;
  } catch (error) {
    console.error('Erro ao criar/obter chat:', error);
    throw error;
  }
}

// Função para obter dados básicos do usuário
async function getUserData(userId: string): Promise<{ name: string; avatar?: string; tipo: 'cliente' | 'prestador' } | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        name: userData.nome || userData.name || 'Usuário',
        avatar: userData.avatar,
        tipo: userData.tipo || 'cliente'
      };
    }
    return null;
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    return null;
  }
}

/// Função para enviar mensagem
export async function sendMessage(chatId: string, messageData: Omit<ChatMessage, 
  '_id' | 'createdAt' | 'user'>): Promise<void> {
  try {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    // Obter dados do usuário atual
    const userData = await getUserData(currentUser.uid);
    
    const message: Omit<ChatMessage, '_id'> = {
      ...messageData,
      createdAt: serverTimestamp(),
      user: {
        _id: currentUser.uid,
        name: userData?.name || currentUser.displayName || 'Usuário',
        avatar: userData?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || 'User')}&background=3B82F6&color=fff`
      }
    };

    // Adicionar mensagem à subcoleção messages
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const docRef = await addDoc(messagesRef, message);

    // Atualizar informações do chat
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      lastMessage: {
        text: messageData.text || (messageData.image ? '📷 Imagem' : (messageData.audio ? '🎵 Áudio' : 'Mensagem')),
        createdAt: serverTimestamp(),
        senderId: currentUser.uid
      },
      updatedAt: serverTimestamp()
    });

    console.log('Mensagem enviada com sucesso:', docRef.id);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
}

// Função para escutar mensagens em tempo real
export function listenToMessages(chatId: string, callback: (messages: ChatMessage[]) => void): () => void {
  try {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(50));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages: ChatMessage[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const message: ChatMessage = {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt?.toDate() || new Date(),
          user: data.user,
          image: data.image,
          audio: data.audio,
          system: data.system
        };
        messages.push(message);
      });

      callback(messages);
    }, (error) => {
      console.error('Erro ao escutar mensagens:', error);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Erro ao configurar listener de mensagens:', error);
    return () => {};
  }
}

// Função para obter lista de chats do usuário
export function listenToUserChats(callback: (chats: Chat[]) => void): () => void {
  try {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef, 
      where('participants', 'array-contains', currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats: Chat[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const chat: Chat = {
          id: doc.id,
          participants: data.participants,
          participantsData: data.participantsData,
          lastMessage: data.lastMessage ? {
            text: data.lastMessage.text,
            createdAt: data.lastMessage.createdAt?.toDate() || new Date(),
            senderId: data.lastMessage.senderId
          } : undefined,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
        chats.push(chat);
      });

      callback(chats);
    }, (error) => {
      console.error('Erro ao escutar chats:', error);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Erro ao configurar listener de chats:', error);
    return () => {};
  }
}

// Função para buscar usuários disponíveis para chat
export async function searchUsers(searchTerm: string): Promise<Array<{ uid: string; name: string; tipo: 'cliente' | 'prestador'; avatar?: string }>> {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    const users: Array<{ uid: string; name: string; tipo: 'cliente' | 'prestador'; avatar?: string }> = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const name = data.nome || data.name || '';
      
      // Filtrar por termo de busca (case insensitive)
      if (name.toLowerCase().includes(searchTerm.toLowerCase()) && doc.id !== authService.getCurrentUser()?.uid) {
        users.push({
          uid: doc.id,
          name: name,
          tipo: data.tipo || 'cliente',
          avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=fff`
        });
      }
    });
    
    return users;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
}

// Função para obter todos os usuários (para listagem completa)
export async function getAllUsers(): Promise<Array<{ uid: string; name: string; tipo: 'cliente' | 'prestador'; avatar?: string }>> {
  try {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      return [];
    }

    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    const users: Array<{ uid: string; name: string; tipo: 'cliente' | 'prestador'; avatar?: string }> = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      
      // Excluir o usuário atual da lista
      if (doc.id !== currentUser.uid) {
        const name = data.nome || data.name || 'Usuário';
        users.push({
          uid: doc.id,
          name: name,
          tipo: data.tipo || 'cliente',
          avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=fff`
        });
      }
    });
    
    return users;
  } catch (error) {
    console.error('Erro ao obter todos os usuários:', error);
    return [];
  }
}

// Função para marcar mensagens como lidas (opcional)
export async function markMessagesAsRead(chatId: string): Promise<void> {
  try {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      return;
    }

    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      [`readBy.${currentUser.uid}`]: serverTimestamp()
    });
  } catch (error) {
    console.error('Erro ao marcar mensagens como lidas:', error);
  }
}

