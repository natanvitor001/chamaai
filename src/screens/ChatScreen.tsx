import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Platform, Alert, ActivityIndicator, KeyboardAvoidingView, Pressable } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Composer, Send, Actions } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Audio from 'expo-av';
import { Audio as AudioRecorder } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

// Importando estilos isolados para esta tela
import { styles, COLORS } from './ChatScreen.styles';

// Importando serviços de chat
import { 
  sendMessage, 
  listenToMessages, 
  createOrGetChat,
  ChatMessage 
} from '../services/chatService';
import { authService } from "../storage/firebaseAuth";

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export default function ChatScreen({ navigation, route }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [recording, setRecording] = useState<Audio.Audio.Recording | undefined>(undefined);
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState<Audio.Audio.Sound | undefined>(undefined);
  const [recordingPermission, setRecordingPermission] = useState<boolean>(false);
  const [audioDirectory, setAudioDirectory] = useState<string>('');
  const [chatId, setChatId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState<any>(null);
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Obter dados do outro usuário dos parâmetros da rota
  const routeOtherUser = route.params?.otherUser;
  const proposta = route.params?.proposta;

  useEffect(() => {
    initializeChat();
    setupAudioDirectory();
    checkRecordingPermission();

    return () => {
      // Cleanup
      if (sound) {
        sound.unloadAsync();
      }
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (longPressTimeout.current) {
        clearTimeout(longPressTimeout.current);
      }
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const initializeChat = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        Alert.alert('Erro', 'Usuário não autenticado');
        navigation.goBack();
        return;
      }

      let otherUserData;
      
      if (routeOtherUser) {
        // Chat direto com usuário específico
        otherUserData = routeOtherUser;
      } else if (proposta) {
        // Chat baseado em proposta
        otherUserData = {
          uid: proposta.clienteId || '2', // ID fictício se não tiver
          name: proposta.cliente,
          avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(proposta.cliente) + '&background=3B82F6&color=fff',
          tipo: 'cliente' as const
        };
      } else {
        Alert.alert('Erro', 'Dados do chat não encontrados');
        navigation.goBack();
        return;
      }

      setOtherUser(otherUserData);

      // Criar ou obter chat
      const newChatId = await createOrGetChat(otherUserData.uid, {
        name: otherUserData.name,
        avatar: otherUserData.avatar,
        tipo: otherUserData.tipo
      });

      setChatId(newChatId);

      // Configurar listener para mensagens em tempo real
      const unsubscribe = listenToMessages(newChatId, (newMessages) => {
        setMessages(newMessages);
        setLoading(false);
      });

      unsubscribeRef.current = unsubscribe;

    } catch (error) {
      console.error('Erro ao inicializar chat:', error);
      Alert.alert('Erro', 'Não foi possível carregar o chat');
      setLoading(false);
    }
  };

  const setupAudioDirectory = async () => {
    const audioDir = `${FileSystem.documentDirectory}audios/`;
    const dirInfo = await FileSystem.getInfoAsync(audioDir);
    
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(audioDir, { intermediates: true });
    }
    
    setAudioDirectory(audioDir);
  };

  const checkRecordingPermission = async () => {
    const { status } = await AudioRecorder.requestPermissionsAsync();
    setRecordingPermission(status === 'granted');
    
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Para enviar mensagens de áudio, precisamos da sua permissão para acessar o microfone.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Configurações', onPress: () => AudioRecorder.requestPermissionsAsync() }
        ]
      );
    }
  };

  const onSend = useCallback(async (newMessages: any[] = []) => {
    if (!chatId) return;

    try {
      for (const message of newMessages) {
        await sendMessage(chatId, {
          text: message.text,
          image: message.image,
          audio: message.audio,
          system: message.system
        });
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      Alert.alert('Erro', 'Não foi possível enviar a mensagem');
    }
  }, [chatId]);

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: COLORS.light,
          },
          right: {
            backgroundColor: COLORS.primary,
          },
        }}
        textStyle={{
          left: {
            color: COLORS.dark,
          },
          right: {
            color: COLORS.white,
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbarContainer}
        primaryStyle={styles.inputToolbarPrimary}
      />
    );
  };

  const renderComposer = (props: any) => {
    return (
      <Composer
        {...props}
        textInputStyle={styles.composerTextInput}
        placeholderTextColor={COLORS.gray}
      />
    );
  };

  const renderSend = (props: any) => {
    return (
      <Send {...props} containerStyle={styles.sendContainer}>
        <Ionicons name="send" size={24} color={COLORS.primary} />
      </Send>
    );
  };

  const startRecording = async () => {
    try {
      if (!recordingPermission) {
        const { status } = await AudioRecorder.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão negada', 'Precisamos de permissão para gravar áudio.');
          return;
        }
        setRecordingPermission(true);
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await AudioRecorder.Recording.createAsync(
        AudioRecorder.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Erro', 'Não foi possível iniciar a gravação.');
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (uri) {
        // Gerar nome de arquivo único
        const fileName = `audio_${Date.now()}.m4a`;
        const fileUri = `${audioDirectory}${fileName}`;
        
        // Copiar o arquivo para o diretório permanente
        await FileSystem.copyAsync({
          from: uri,
          to: fileUri
        });
        
        // Enviar mensagem com o áudio
        onSend([
          {
            _id: Math.round(Math.random() * 1000000),
            createdAt: new Date(),
            user: { _id: authService.getCurrentUser()?.uid || '1' },
            audio: fileUri,
          },
        ]);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao finalizar a gravação.');
    }
    
    setRecording(undefined);
  };

  const handleAudioLongPress = () => {
    startRecording();
  };

  const handleAudioPressOut = () => {
    if (isRecording) {
      stopRecording();
    }
    
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de permissão para acessar suas fotos.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Gerar nome de arquivo único
      const fileName = `image_${Date.now()}.jpg`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      // Copiar o arquivo para o diretório permanente
      await FileSystem.copyAsync({
        from: result.assets[0].uri,
        to: fileUri
      });
      
      onSend([
        {
          _id: Math.round(Math.random() * 1000000),
          createdAt: new Date(),
          user: { _id: getCurrentUser()?.uid || '1' },
          image: fileUri,
        },
      ]);
    }
  };

  const ligarParaCliente = () => {
    if (!otherUser) return;
    
    Alert.alert(
      'Ligar para ' + otherUser.name,
      `Deseja ligar para ${otherUser.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ligar', onPress: () => {
          Alert.alert('Ligação', 'Funcionalidade de ligação seria implementada aqui.');
        }}
      ]
    );
  };

  const verEndereco = () => {
    if (proposta) {
      Alert.alert(
        'Endereço do Cliente',
        proposta.endereco || proposta.bairro || 'Endereço não informado',
        [
          { text: 'OK' },
          { text: 'Abrir no Maps', onPress: () => {
            Alert.alert('Maps', 'Abriria o endereço no Google Maps.');
          }}
        ]
      );
    }
  };

  const renderActions = (props: any) => {
    return (
      <View style={styles.actionsWrapper}>
        {/* Botão de áudio com pressionar para gravar */}
        <Pressable 
          style={[
            styles.actionButton,
            isRecording && styles.recordingButton
          ]}
          onLongPress={handleAudioLongPress}
          onPressOut={handleAudioPressOut}
          delayLongPress={200}
        >
          <Ionicons 
            name={isRecording ? "radio" : "mic"} 
            size={24} 
            color={isRecording ? COLORS.danger : COLORS.gray} 
          />
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <Text style={styles.recordingText}>Gravando...</Text>
            </View>
          )}
        </Pressable>
        
        {/* Botão de imagem */}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={pickImage}
        >
          <Ionicons name="image" size={24} color={COLORS.gray} />
        </TouchableOpacity>
        
        {/* Botão de ações original */}
        <Actions
          {...props}
          containerStyle={styles.actionsContainer}
          icon={() => (
            <Ionicons name="add" size={24} color={COLORS.gray} />
          )}
          onPressActionButton={() => {
            Alert.alert(
              "Anexar",
              "Escolha uma opção:",
              [
                {
                  text: "Cancelar",
                  style: "cancel",
                },
                {
                  text: "Enviar Imagem",
                  onPress: pickImage,
                },
                {
                  text: "Gravar Áudio",
                  onPress: () => Alert.alert(
                    "Gravação de áudio", 
                    "Pressione e segure o botão de microfone para gravar. Solte para enviar."
                  ),
                },
              ]
            );
          }}
        />
      </View>
    );
  };

  const renderMessageAudio = (props: any) => {
    const { currentMessage } = props;
    return (
      <View style={styles.audioMessageContainer}>
        <TouchableOpacity
          onPress={async () => {
            try {
              if (sound) {
                await sound.unloadAsync();
                setSound(undefined);
              }
              const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: currentMessage.audio },
                { shouldPlay: true }
              );
              setSound(newSound);
              
              // Adicionar evento para quando o áudio terminar
              newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                  newSound.unloadAsync();
                  setSound(undefined);
                }
              });
            } catch (error) {
              console.error('Error playing audio:', error);
              Alert.alert('Erro', 'Não foi possível reproduzir o áudio.');
            }
          }}
        >
          <Ionicons name="play-circle" size={30} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.audioMessageText}>
          {sound ? "Reproduzindo..." : "Reproduzir Áudio"}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.fullScreenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 16, color: COLORS.gray }}>Carregando chat...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <View style={styles.fullScreenContainer}>
        {/* Header do Chat */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <View style={styles.headerProfile}>
            <Image 
              source={{ uri: otherUser?.avatar || 'https://ui-avatars.com/api/?name=User&background=3B82F6&color=fff' }} 
              style={styles.headerAvatar} 
            />
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>{otherUser?.name || 'Usuário'}</Text>
              <Text style={styles.headerSubtitle}>
                {proposta ? `${proposta.categoria} • ${proposta.valor}` : 'Online'}
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={ligarParaCliente} style={styles.headerActionButton}>
              <Ionicons name="call" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            {proposta && (
              <TouchableOpacity onPress={verEndereco} style={styles.headerActionButton}>
                <Ionicons name="location" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Informações da Proposta */}
        {proposta && (
          <View style={styles.propostaInfo}>
            <View style={styles.propostaHeader}>
              <Ionicons name="briefcase" size={16} color={COLORS.primary} />
              <Text style={styles.propostaTitle}>Detalhes da Solicitação</Text>
            </View>
            <Text style={styles.propostaDescricao}>{proposta.descricao}</Text>
            <View style={styles.propostaDetalhes}>
              <Text style={styles.propostaDetalhe}>📍 {proposta.bairro}</Text>
              <Text style={styles.propostaDetalhe}>💰 {proposta.valor}</Text>
              {proposta.telefone && (
                <Text style={styles.propostaDetalhe}>📞 {proposta.telefone}</Text>
              )}
            </View>
          </View>
        )}

        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: getCurrentUser()?.uid || '1',
          }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderSend={renderSend}
          renderActions={renderActions}
          renderMessageAudio={renderMessageAudio}
          showAvatarForEveryMessage={true}
          showUserAvatar={true}
          alwaysShowSend={true}
          placeholder="Digite sua mensagem..."
          messagesContainerStyle={styles.messagesContainer}
          textInputProps={{ autoCorrect: false, autoCapitalize: 'none' }}
          keyboardShouldPersistTaps="always"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

