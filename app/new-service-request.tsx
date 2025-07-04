import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Camera, MapPin, Calendar, Clock, FileText } from 'lucide-react-native';

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

const serviceCategories = [
  { label: 'Selecione uma categoria', value: '' },
  { label: 'Pedreiro', value: 'pedreiro' },
  { label: 'Eletricista', value: 'eletricista' },
  { label: 'Encanador', value: 'encanador' },
  { label: 'Pintor', value: 'pintor' },
  { label: 'Marceneiro', value: 'marceneiro' },
  { label: 'Jardineiro', value: 'jardineiro' },
  { label: 'Faxineiro', value: 'faxineiro' },
  { label: 'Técnico em Ar Condicionado', value: 'ar_condicionado' },
  { label: 'Chaveiro', value: 'chaveiro' },
  { label: 'Outros', value: 'outros' }
];

export default function NewServiceRequestScreen() {
  const [serviceCategory, setServiceCategory] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState({
    street: '',
    number: '',
    neighborhood: '',
    zipCode: ''
  });
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Refs for navigation
  const descriptionRef = useRef<TextInput>(null);
  const streetRef = useRef<TextInput>(null);
  const numberRef = useRef<TextInput>(null);
  const neighborhoodRef = useRef<TextInput>(null);
  const zipCodeRef = useRef<TextInput>(null);
  const dateRef = useRef<TextInput>(null);
  const timeRef = useRef<TextInput>(null);

  const validateForm = () => {
    if (!serviceCategory) {
      Alert.alert('Erro', 'Por favor, selecione uma categoria de serviço.');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Erro', 'Por favor, descreva o serviço que você precisa.');
      return false;
    }
    if (!address.street.trim()) {
      Alert.alert('Erro', 'Por favor, informe o nome da rua.');
      return false;
    }
    if (!address.number.trim()) {
      Alert.alert('Erro', 'Por favor, informe o número do endereço.');
      return false;
    }
    if (!address.neighborhood.trim()) {
      Alert.alert('Erro', 'Por favor, informe o bairro.');
      return false;
    }
    if (!address.zipCode.trim()) {
      Alert.alert('Erro', 'Por favor, informe o CEP.');
      return false;
    }
    if (!preferredDate.trim()) {
      Alert.alert('Erro', 'Por favor, informe a data preferida.');
      return false;
    }
    if (!preferredTime.trim()) {
      Alert.alert('Erro', 'Por favor, informe o horário preferido.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const requestData = {
        serviceCategory,
        description,
        address,
        preferredDate,
        preferredTime,
        photos
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Sucesso!', 
        'Sua solicitação foi enviada com sucesso! Em breve você receberá propostas de profissionais.',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar sua solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhoto = () => {
    Alert.alert(
      'Adicionar Foto',
      'Escolha uma opção:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Câmera', onPress: () => console.log('Camera') },
        { text: 'Galeria', onPress: () => console.log('Gallery') }
      ]
    );
  };

  const formatZipCode = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 8) {
      const match = cleaned.match(/^(\d{0,5})(\d{0,3})$/);
      if (match) {
        return !match[2] ? match[1] : `${match[1]}-${match[2]}`;
      }
    }
    return text;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Solicitação</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {/* Service Category */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileText size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Categoria do Serviço</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.pickerButton}
              onPress={() => {
                Alert.alert(
                  'Selecionar Categoria',
                  'Escolha uma categoria:',
                  serviceCategories.slice(1).map(category => ({
                    text: category.label,
                    onPress: () => setServiceCategory(category.value)
                  })).concat([{ text: 'Cancelar', style: 'cancel' }])
                );
              }}
            >
              <Text style={[styles.pickerButtonText, !serviceCategory && styles.placeholder]}>
                {serviceCategory ? serviceCategories.find(cat => cat.value === serviceCategory)?.label : 'Selecione uma categoria'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Descrição do Serviço *</Text>
            <TextInput
              ref={descriptionRef}
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Descreva detalhadamente o que você precisa..."
              placeholderTextColor={COLORS.gray}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              returnKeyType="next"
              onSubmitEditing={() => streetRef.current?.focus()}
            />
          </View>

          {/* Address Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Endereço</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rua *</Text>
              <TextInput
                ref={streetRef}
                style={styles.input}
                value={address.street}
                onChangeText={(text) => setAddress({...address, street: text})}
                placeholder="Nome da rua"
                placeholderTextColor={COLORS.gray}
                returnKeyType="next"
                onSubmitEditing={() => numberRef.current?.focus()}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Número *</Text>
                <TextInput
                  ref={numberRef}
                  style={styles.input}
                  value={address.number}
                  onChangeText={(text) => setAddress({...address, number: text})}
                  placeholder="123"
                  placeholderTextColor={COLORS.gray}
                  keyboardType="numeric"
                  returnKeyType="next"
                  onSubmitEditing={() => neighborhoodRef.current?.focus()}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 2, marginLeft: 8 }]}>
                <Text style={styles.label}>Bairro *</Text>
                <TextInput
                  ref={neighborhoodRef}
                  style={styles.input}
                  value={address.neighborhood}
                  onChangeText={(text) => setAddress({...address, neighborhood: text})}
                  placeholder="Nome do bairro"
                  placeholderTextColor={COLORS.gray}
                  returnKeyType="next"
                  onSubmitEditing={() => zipCodeRef.current?.focus()}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CEP *</Text>
              <TextInput
                ref={zipCodeRef}
                style={styles.input}
                value={address.zipCode}
                onChangeText={(text) => setAddress({...address, zipCode: formatZipCode(text)})}
                placeholder="00000-000"
                placeholderTextColor={COLORS.gray}
                keyboardType="numeric"
                maxLength={9}
                returnKeyType="next"
                onSubmitEditing={() => dateRef.current?.focus()}
              />
            </View>
          </View>

          {/* Date and Time */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Agendamento</Text>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Data Preferida *</Text>
                <TextInput
                  ref={dateRef}
                  style={styles.input}
                  value={preferredDate}
                  onChangeText={setPreferredDate}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={COLORS.gray}
                  returnKeyType="next"
                  onSubmitEditing={() => timeRef.current?.focus()}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Horário Preferido *</Text>
                <TextInput
                  ref={timeRef}
                  style={styles.input}
                  value={preferredTime}
                  onChangeText={setPreferredTime}
                  placeholder="HH:MM"
                  placeholderTextColor={COLORS.gray}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
              </View>
            </View>
          </View>

          {/* Photos */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Camera size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Fotos (Opcional)</Text>
            </View>
            
            <TouchableOpacity style={styles.photoButton} onPress={handleAddPhoto}>
              <Camera size={24} color={COLORS.primary} />
              <Text style={styles.photoButtonText}>Adicionar Fotos</Text>
              <Text style={styles.photoButtonSubtext}>
                Ajude os profissionais a entender melhor o serviço
              </Text>
            </TouchableOpacity>

            {photos.length > 0 && (
              <View style={styles.photosGrid}>
                {photos.map((photo, index) => (
                  <Image key={index} source={{ uri: photo }} style={styles.photoPreview} />
                ))}
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Enviando...' : 'Enviar Solicitação'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
    elevation: 2,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  placeholder: {
    width: 40,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginLeft: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.dark,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderColor: COLORS.grayLight,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    borderRadius: 12,
    color: COLORS.dark,
    fontSize: 16,
    backgroundColor: COLORS.white,
  },
  textArea: {
    borderColor: COLORS.grayLight,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: COLORS.white,
    minHeight: 120,
    color: COLORS.dark,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  pickerButton: {
    borderColor: COLORS.grayLight,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    minHeight: 50,
  },
  pickerButtonText: {
    fontSize: 16,
    color: COLORS.dark,
  },
  placeholder: {
    color: COLORS.gray,
  },
  photoButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  photoButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  photoButtonSubtext: {
    color: COLORS.gray,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 8,
  },
  photoPreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.gray,
    elevation: 0,
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});