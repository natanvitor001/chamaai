import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  Platform
} from 'react-native';

export default function NewServiceRequestScreen({ navigation }) {
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
  const [photos, setPhotos] = useState([]);

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

  const handleSubmit = () => {
    if (validateForm()) {
      const requestData = {
        serviceCategory,
        description,
        address,
        preferredDate,
        preferredTime,
        photos
      };
      
      // Here you would typically send the data to your backend
      console.log('Service request data:', requestData);
      
      Alert.alert(
        'Sucesso', 
        'Sua solicitação foi enviada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    }
  };

  const handleAddPhoto = () => {
    // In a real application, you would implement photo selection here
    Alert.alert('Funcionalidade', 'Adicionar fotos será implementado em breve.');
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
      <View style={styles.content}>
        <Text style={styles.title}>Nova Solicitação de Serviço</Text>
        
        {/* Service Category */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Categoria do Serviço *</Text>
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
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Descrição do Serviço *</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Descreva o que você precisa..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Address Section */}
        <Text style={styles.sectionTitle}>Endereço Completo</Text>
        
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Rua *</Text>
          <TextInput
            style={styles.input}
            value={address.street}
            onChangeText={(text) => setAddress({...address, street: text})}
            placeholder="Nome da rua"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Número *</Text>
          <TextInput
            style={styles.input}
            value={address.number}
            onChangeText={(text) => setAddress({...address, number: text})}
            placeholder="Número"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Bairro *</Text>
          <TextInput
            style={styles.input}
            value={address.neighborhood}
            onChangeText={(text) => setAddress({...address, neighborhood: text})}
            placeholder="Nome do bairro"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>CEP *</Text>
          <TextInput
            style={styles.input}
            value={address.zipCode}
            onChangeText={(text) => setAddress({...address, zipCode: text})}
            placeholder="00000-000"
            keyboardType="numeric"
          />
        </View>

        {/* Date and Time */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Data Preferida *</Text>
          <TextInput
            style={styles.input}
            value={preferredDate}
            onChangeText={setPreferredDate}
            placeholder="DD/MM/AAAA"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Horário Preferido *</Text>
          <TextInput
            style={styles.input}
            value={preferredTime}
            onChangeText={setPreferredTime}
            placeholder="HH:MM"
          />
        </View>

        {/* Photos */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Fotos (Opcional)</Text>
          <TouchableOpacity style={styles.photoButton} onPress={handleAddPhoto}>
            <Text style={styles.photoButtonText}>+ Adicionar Fotos</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Enviar Solicitação</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 56,
    borderColor: '#E0E0E0',
    borderWidth: 1.5,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    color: '#1E3A8A',
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    borderColor: '#E0E0E0',
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    minHeight: 100,
    color: '#1E3A8A',
  },
  pickerButton: {
    borderColor: '#E0E0E0',
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  placeholder: {
    color: '#999',
  },
  photoButton: {
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  photoButtonText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

