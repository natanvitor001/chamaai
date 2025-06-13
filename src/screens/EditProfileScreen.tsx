import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
  Modal,
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import axios from 'axios';
import { getUser, updateUser, UserData } from '../storage/UserStorage';
import * as ImagePicker from 'expo-image-picker';

// Importando estilos isolados para esta tela
import { styles, COLORS } from './EditProfileScreen.styles';

// Lista de países com seus códigos
const countryCodes = [
  { name: 'Brasil', code: '+55', flag: '🇧🇷' },
  { name: 'Estados Unidos', code: '+1', flag: '🇺🇸' },
  { name: 'Portugal', code: '+351', flag: '🇵🇹' },
  { name: 'Espanha', code: '+34', flag: '🇪🇸' },
  { name: 'Argentina', code: '+54', flag: '🇦🇷' },
  { name: 'Chile', code: '+56', flag: '🇨🇱' },
  { name: 'Colômbia', code: '+57', flag: '🇨🇴' },
  { name: 'México', code: '+52', flag: '🇲🇽' },
  { name: 'Uruguai', code: '+598', flag: '🇺🇾' },
  { name: 'Paraguai', code: '+595', flag: '🇵🇾' },
  { name: 'Peru', code: '+51', flag: '🇵🇪' },
  { name: 'Bolívia', code: '+591', flag: '🇧🇴' },
  { name: 'Equador', code: '+593', flag: '🇪🇨' },
  { name: 'Venezuela', code: '+58', flag: '🇻🇪' },
  { name: 'Alemanha', code: '+49', flag: '🇩🇪' },
  { name: 'França', code: '+33', flag: '🇫🇷' },
  { name: 'Itália', code: '+39', flag: '🇮🇹' },
  { name: 'Reino Unido', code: '+44', flag: '🇬🇧' },
  { name: 'Japão', code: '+81', flag: '🇯🇵' },
  { name: 'China', code: '+86', flag: '🇨🇳' },
  { name: 'Índia', code: '+91', flag: '🇮🇳' },
  { name: 'Austrália', code: '+61', flag: '🇦🇺' },
  { name: 'Canadá', code: "+1", flag: '🇨🇦' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+55'); // Código do Brasil como padrão
  const [profileImage, setProfileImage] = useState('https://i.pravatar.cc/150');
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [allFieldsValid, setAllFieldsValid] = useState(false);
  const [profileVerified, setProfileVerified] = useState(false);
  
  // Campos de endereço
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  
  // Estados para controle de UI
  const [isLoading, setIsLoading] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  // Refs para navegação entre campos
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const cepRef = useRef<TextInput>(null);
  const ruaRef = useRef<TextInput>(null);
  const numeroRef = useRef<TextInput>(null);
  const complementoRef = useRef<TextInput>(null);
  const bairroRef = useRef<TextInput>(null);
  const cidadeRef = useRef<TextInput>(null);
  const estadoRef = useRef<TextInput>(null);

  // Carregar dados do usuário ao iniciar
  useEffect(() => {
    loadUserData();
  }, []);

  // Verificar se houve alterações
  useEffect(() => {
    if (!initialData) return;
    
    const currentData = {
      nome: name,
      email,
      telefone: phone,
      profileImage,
      endereco: {
        cep,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado
      }
    };
    
    const hasDataChanged = JSON.stringify(initialData) !== JSON.stringify(currentData);
    setHasChanges(hasDataChanged);
  }, [name, email, phone, profileImage, cep, rua, numero, complemento, bairro, cidade, estado, initialData]);

  // Verificar se todos os campos obrigatórios estão preenchidos
  useEffect(() => {
    const isValid =
      name.trim() !== '' &&
      phone.trim() !== '' &&
      validateEmail(email) &&
      validatePhone(phone);
    
    setAllFieldsValid(isValid);
  }, [name, phone, email]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const userData = await getUser();
      
      if (userData) {
        setName(userData.nome || '');
        setEmail(userData.email || '');
        setPhone(userData.telefone || '');
        if (userData.profileImage) setProfileImage(userData.profileImage);
        setProfileVerified(userData.profileVerified || false);
        
        // Carregar dados de endereço se existirem
        if (userData.endereco) {
          setCep(userData.endereco.cep || '');
          setRua(userData.endereco.rua || '');
          setNumero(userData.endereco.numero || '');
          setComplemento(userData.endereco.complemento || '');
          setBairro(userData.endereco.bairro || '');
          setCidade(userData.endereco.cidade || '');
          setEstado(userData.endereco.estado || '');
        }
        
        // Salvar dados iniciais para comparação posterior
        setInitialData({
          nome: userData.nome || '',
          email: userData.email || '',
          telefone: userData.telefone || '',
          profileImage: userData.profileImage || 'https://i.pravatar.cc/150',
          endereco: userData.endereco || {
            cep: '',
            rua: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: ''
          }
        });
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do usuário');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Validações
  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone: string) => {
    // Regex para telefone brasileiro (10 ou 11 dígitos, com ou sem DDD, com ou sem hífen)
    const re = /^\(?\d{2}\)?\s?\d{4,5}\-?\d{4}$/;
    return re.test(phone);
  };

  const handleSaveProfile = async () => {
    // Validações básicas
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome é obrigatório');
      return;
    }
    
    if (!phone.trim()) {
      Alert.alert('Erro', 'O telefone é obrigatório');
      return;
    }

    if (email.trim() !== '' && !validateEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido.');
      return;
    }

    if (!validatePhone(phone)) {
      Alert.alert('Erro', 'Por favor, insira um número de telefone válido (ex: 11 98765-4321 ou 11 8765-4321).');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Verificar se todos os campos obrigatórios estão preenchidos
      const isProfileComplete =
        name.trim() !== '' &&
        phone.trim() !== '' &&
        cep.trim() !== '' &&
        rua.trim() !== '' &&
        numero.trim() !== '' &&
        bairro.trim() !== '' &&
        cidade.trim() !== '' &&
        estado.trim() !== '';
      
      // Preparar dados para salvar
      const userData: Partial<UserData> = {
        nome: name,
        email,
        telefone: phone,
        profileImage,
        profileVerified: isProfileComplete, // Atualiza o status de verificação
      };
      
      // Adicionar endereço apenas se algum campo estiver preenchido
      if (cep || rua || numero || bairro || cidade || estado) {
        userData.endereco = {
          cep: cep || '',
          rua: rua || '',
          numero: numero || '',
          complemento: complemento || '',
          bairro: bairro || '',
          cidade: cidade || '',
          estado: estado || ''
        };
      }
      
      // Salvar dados no AsyncStorage
      await updateUser(userData);
      
      // Atualizar dados iniciais após salvar para que 'hasChanges' seja false
      setInitialData({
        nome: name,
        email,
        telefone: phone,
        profileImage,
        endereco: {
          cep,
          rua,
          numero,
          complemento,
          bairro,
          cidade,
          estado
        }
      });
      setHasChanges(false);
      setProfileVerified(isProfileComplete);
      
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      // Não navegar de volta para manter o usuário na tela de edição
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCepSearch = async () => {
    if (!cep || cep.length !== 8) {
      Alert.alert('Erro', 'Digite um CEP válido com 8 dígitos (apenas números).');
      return;
    }
    
    try {
      setIsCepLoading(true);
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      
      if (response.data.erro) {
        Alert.alert('Erro', 'CEP não encontrado ou inválido.');
        return;
      }
      
      // Preencher campos com dados do CEP
      setRua(response.data.logradouro || '');
      setBairro(response.data.bairro || '');
      setCidade(response.data.localidade || '');
      setEstado(response.data.uf || '');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar o CEP. Verifique sua conexão ou o CEP digitado.');
      console.error(error);
    } finally {
      setIsCepLoading(false);
    }
  };

  // Função para selecionar imagem da galeria
  const pickImage = async () => {
    try {
      // Solicitar permissão para acessar a galeria
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de permissão para acessar suas fotos');
        return;
      }
      
      // Abrir seletor de imagem
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Atualizar a imagem de perfil com a URI da imagem selecionada
        setProfileImage(result.assets[0].uri);
        setHasChanges(true);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  // Função para tirar foto com a câmera
  const takePhoto = async () => {
    try {
      // Solicitar permissão para acessar a câmera
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de permissão para acessar sua câmera');
        return;
      }
      
      // Abrir câmera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Atualizar a imagem de perfil com a URI da foto tirada
        setProfileImage(result.assets[0].uri);
        setHasChanges(true);
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto');
    }
  };

  // Função melhorada para trocar a imagem de perfil
  const changeProfileImage = () => {
    Alert.alert(
      "Alterar foto de perfil",
      "Escolha uma opção:",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Escolher da galeria",
          onPress: pickImage
        },
        {
          text: "Tirar foto",
          onPress: takePhoto
        },
        {
          text: "Usar avatar padrão",
          onPress: () => {
            // Gera um avatar aleatório do pravatar
            const randomId = Math.floor(Math.random() * 1000);
            setProfileImage(`https://i.pravatar.cc/150?img=${randomId}`);
            setHasChanges(true);
          }
        }
      ]
    );
  };

  // Função para voltar à tela anterior
  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        "Alterações não salvas",
        "Você tem alterações não salvas. Deseja salvar antes de sair?",
        [
          {
            text: "Não salvar",
            style: "destructive",
            onPress: () => navigation.goBack()
          },
          {
            text: "Salvar",
            onPress: handleSaveProfile
          },
          {
            text: "Cancelar",
            style: "cancel"
          }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const formatCep = (text: string) => {
    // Remove tudo que não é número
    const cleaned = text.replace(/\D/g, '');
    
    // Aplica a máscara XXXXX-XXX
    if (cleaned.length <= 8) {
      const match = cleaned.match(/^(\d{0,5})(\d{0,3})$/);
      if (match) {
        return !match[2] ? match[1] : `${match[1]}-${match[2]}`;
      }
    }
    return text;
  };

  const formatPhone = (text: string) => {
    // Remove tudo que não é número
    const cleaned = text.replace(/\D/g, '');
    
    // Aplica a máscara (XX) XXXXX-XXXX
    if (cleaned.length <= 11) {
      const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
      if (match) {
        return !match[2] ? match[1] : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
      }
    }
    return text;
  };

  if (isLoading && !initialData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.mainContainer} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      
      {/* Header com botão de voltar e notificação */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleBack} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <TouchableOpacity 
          onPress={() => Alert.alert('Notificações', 'Você não tem novas notificações.')} 
          style={styles.notificationButton}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={24} color={COLORS.dark} />
        </TouchableOpacity>
      </View>

      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView 
          style={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {/* Imagem de perfil */}
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageWrapper}>
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            </View>
            <TouchableOpacity 
              onPress={changeProfileImage} 
              style={styles.editImageButton}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={22} color={COLORS.white} />
            </TouchableOpacity>
            {profileVerified && (
              <View style={styles.profileVerifiedBadge}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.accent} />
                <Text style={styles.verifiedBadgeText}>Perfil Verificado Premium</Text>
              </View>
            )}
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Informações Pessoais</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome Completo <Text style={styles.requiredMark}>*</Text></Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Digite seu nome completo"
                    placeholderTextColor={COLORS.gray}
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                  <TextInput
                    ref={emailRef}
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Digite seu email"
                    placeholderTextColor={COLORS.gray}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    returnKeyType="next"
                    onSubmitEditing={() => phoneRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Telefone <Text style={styles.requiredMark}>*</Text></Text>
                <View style={styles.phoneInputContainer}>
                  <TouchableOpacity 
                    style={styles.countryCodeButton}
                    onPress={() => setShowCountryModal(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.countryCodeText}>🇧🇷 {countryCode}</Text>
                    <Ionicons name="chevron-down" size={16} color={COLORS.gray} />
                  </TouchableOpacity>
                  <TextInput
                    ref={phoneRef}
                    style={styles.phoneInput}
                    value={phone}
                    onChangeText={(text) => setPhone(formatPhone(text))}
                    placeholder="(11) 99999-9999"
                    placeholderTextColor={COLORS.gray}
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    returnKeyType="next"
                    onSubmitEditing={() => cepRef.current?.focus()}
                    blurOnSubmit={false}
                    maxLength={15}
                  />
                </View>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Endereço</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>CEP</Text>
                <View style={styles.cepInputContainer}>
                  <View style={styles.inputContainer}>
                    <Ionicons name="location-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                    <TextInput
                      ref={cepRef}
                      style={styles.input}
                      value={cep}
                      onChangeText={(text) => setCep(formatCep(text))}
                      placeholder="00000-000"
                      placeholderTextColor={COLORS.gray}
                      keyboardType="numeric"
                      autoComplete="postal-code"
                      returnKeyType="search"
                      onSubmitEditing={handleCepSearch}
                      maxLength={9}
                    />
                  </View>
                  <TouchableOpacity 
                    style={styles.cepSearchButton}
                    onPress={handleCepSearch}
                    disabled={isCepLoading}
                    activeOpacity={0.7}
                  >
                    {isCepLoading ? (
                      <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                      <Ionicons name="search" size={20} color={COLORS.white} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Rua</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="home-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                  <TextInput
                    ref={ruaRef}
                    style={styles.input}
                    value={rua}
                    onChangeText={setRua}
                    placeholder="Nome da rua"
                    placeholderTextColor={COLORS.gray}
                    autoCapitalize="words"
                    autoComplete="street-address"
                    returnKeyType="next"
                    onSubmitEditing={() => numeroRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                </View>
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Número</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      ref={numeroRef}
                      style={styles.input}
                      value={numero}
                      onChangeText={setNumero}
                      placeholder="123"
                      placeholderTextColor={COLORS.gray}
                      keyboardType="numeric"
                      returnKeyType="next"
                      onSubmitEditing={() => complementoRef.current?.focus()}
                      blurOnSubmit={false}
                    />
                  </View>
                </View>

                <View style={[styles.inputGroup, { flex: 2, marginLeft: 8 }]}>
                  <Text style={styles.label}>Complemento</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      ref={complementoRef}
                      style={styles.input}
                      value={complemento}
                      onChangeText={setComplemento}
                      placeholder="Apto, bloco, etc."
                      placeholderTextColor={COLORS.gray}
                      autoCapitalize="words"
                      returnKeyType="next"
                      onSubmitEditing={() => bairroRef.current?.focus()}
                      blurOnSubmit={false}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Bairro</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="business-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                  <TextInput
                    ref={bairroRef}
                    style={styles.input}
                    value={bairro}
                    onChangeText={setBairro}
                    placeholder="Nome do bairro"
                    placeholderTextColor={COLORS.gray}
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() => cidadeRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                </View>
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 2, marginRight: 8 }]}>
                  <Text style={styles.label}>Cidade</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      ref={cidadeRef}
                      style={styles.input}
                      value={cidade}
                      onChangeText={setCidade}
                      placeholder="Nome da cidade"
                      placeholderTextColor={COLORS.gray}
                      autoCapitalize="words"
                      returnKeyType="next"
                      onSubmitEditing={() => estadoRef.current?.focus()}
                      blurOnSubmit={false}
                    />
                  </View>
                </View>

                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Estado</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      ref={estadoRef}
                      style={styles.input}
                      value={estado}
                      onChangeText={setEstado}
                      placeholder="UF"
                      placeholderTextColor={COLORS.gray}
                      autoCapitalize="characters"
                      returnKeyType="done"
                      onSubmitEditing={handleSaveProfile}
                      maxLength={2}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Botão de salvar */}
            <TouchableOpacity 
              style={[
                styles.saveButton,
                (!hasChanges || isLoading) && styles.saveButtonDisabled
              ]}
              onPress={handleSaveProfile}
              disabled={!hasChanges || isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
                  <Text style={styles.saveButtonText}>
                    {hasChanges ? 'Salvar Alterações' : 'Nenhuma Alteração'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Modal de seleção de código do país */}
      <Modal
        visible={showCountryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar País</Text>
              <TouchableOpacity 
                onPress={() => setShowCountryModal(false)}
                style={styles.modalCloseButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={COLORS.dark} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              {countryCodes.map((country, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.countryOption,
                    countryCode === country.code && styles.countryOptionSelected
                  ]}
                  onPress={() => {
                    setCountryCode(country.code);
                    setShowCountryModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.countryFlag}>{country.flag}</Text>
                  <Text style={styles.countryName}>{country.name}</Text>
                  <Text style={styles.countryCodeText}>{country.code}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

