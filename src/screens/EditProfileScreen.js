import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Foto do paciente
const patientPhoto = require('../../assets/maria.png');

// Funções de máscara
const maskPhone = (value) => {
  if (!value) return '';
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

const maskCPF = (value) => {
  if (!value) return '';
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

const maskDate = (value) => {
  if (!value) return '';
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
};

const maskCEP = (value) => {
  if (!value) return '';
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 5) return numbers;
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
};

const EditProfileScreen = ({ navigation }) => {
  const [profileData, setProfileData] = useState({
    nome: 'Maria',
    nomeCompleto: 'Maria Silva Santos',
    email: 'maycon@online',
    telefone: '(88) 99999-9999',
    cpf: '',
    dataNascimento: '15/03/1965',
    cidade: 'Sobral',
    estado: 'CE',
    cep: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    if (!profileData.nome || !profileData.email) {
      Alert.alert('Atenção', 'Por favor, preencha os campos obrigatórios.');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }, 1000);
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Alterar Foto',
      'Escolha uma opção',
      [
        { text: 'Câmera', onPress: () => console.log('Abrir câmera') },
        { text: 'Galeria', onPress: () => console.log('Abrir galeria') },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const updateField = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (value) => {
    updateField('telefone', maskPhone(value));
  };

  const handleCPFChange = (value) => {
    updateField('cpf', maskCPF(value));
  };

  const handleDateChange = (value) => {
    updateField('dataNascimento', maskDate(value));
  };

  const handleCEPChange = (value) => {
    updateField('cep', maskCEP(value));
  };

  const handleEstadoChange = (value) => {
    const formatted = value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
    updateField('estado', formatted);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <LinearGradient
        colors={['#0F4C75', '#1A5F7A', '#2D8EBA']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Foto do Perfil */}
        <View style={styles.photoContainer}>
          <View style={styles.photoWrapper}>
            <Image source={patientPhoto} style={styles.profilePhoto} />
            <TouchableOpacity 
              style={styles.changePhotoButton}
              onPress={handleChangePhoto}
            >
              <Ionicons name="camera" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.changePhotoText}>Alterar foto</Text>
        </View>
      </LinearGradient>

      {/* Formulário */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.formContainer}
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Nome */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <Ionicons name="person-outline" size={16} color="#1A5F7A" /> Nome *
            </Text>
            <TextInput
              style={styles.input}
              value={profileData.nome}
              onChangeText={(value) => updateField('nome', value)}
              placeholder="Seu nome"
              placeholderTextColor="#999"
            />
          </View>

          {/* Nome Completo */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <Ionicons name="document-text-outline" size={16} color="#1A5F7A" /> Nome Completo
            </Text>
            <TextInput
              style={styles.input}
              value={profileData.nomeCompleto}
              onChangeText={(value) => updateField('nomeCompleto', value)}
              placeholder="Seu nome completo"
              placeholderTextColor="#999"
            />
          </View>

          {/* CPF */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <Ionicons name="card-outline" size={16} color="#1A5F7A" /> CPF
            </Text>
            <TextInput
              style={styles.input}
              value={profileData.cpf}
              onChangeText={handleCPFChange}
              placeholder="000.000.000-00"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={14}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <Ionicons name="mail-outline" size={16} color="#1A5F7A" /> E-mail *
            </Text>
            <TextInput
              style={styles.input}
              value={profileData.email}
              onChangeText={(value) => updateField('email', value)}
              placeholder="seu@email.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Telefone */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <Ionicons name="call-outline" size={16} color="#1A5F7A" /> Telefone
            </Text>
            <TextInput
              style={styles.input}
              value={profileData.telefone}
              onChangeText={handlePhoneChange}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>

          {/* Data de Nascimento */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <Ionicons name="calendar-outline" size={16} color="#1A5F7A" /> Data de Nascimento
            </Text>
            <TextInput
              style={styles.input}
              value={profileData.dataNascimento}
              onChangeText={handleDateChange}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          {/* CEP */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <MaterialCommunityIcons name="map-marker-outline" size={16} color="#1A5F7A" /> CEP
            </Text>
            <TextInput
              style={styles.input}
              value={profileData.cep}
              onChangeText={handleCEPChange}
              placeholder="00000-000"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={9}
            />
          </View>

          {/* Cidade e Estado */}
          <View style={styles.rowContainer}>
            <View style={[styles.inputGroup, { flex: 2, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>
                <Ionicons name="location-outline" size={16} color="#1A5F7A" /> Cidade
              </Text>
              <TextInput
                style={styles.input}
                value={profileData.cidade}
                onChangeText={(value) => updateField('cidade', value)}
                placeholder="Sua cidade"
                placeholderTextColor="#999"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Estado</Text>
              <TextInput
                style={styles.input}
                value={profileData.estado}
                onChangeText={handleEstadoChange}
                placeholder="UF"
                placeholderTextColor="#999"
                maxLength={2}
                autoCapitalize="characters"
              />
            </View>
          </View>

          {/* Informação */}
          <View style={styles.infoCard}>
            <MaterialCommunityIcons name="information-outline" size={20} color="#1A5F7A" />
            <Text style={styles.infoText}>
              Seus dados são protegidos e utilizados apenas para melhorar seu atendimento médico.
            </Text>
          </View>

          {/* Botão Salvar */}
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSave}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#1A5F7A', '#2D8EBA']}
              style={styles.saveButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isLoading ? (
                <Text style={styles.saveButtonText}>Salvando...</Text>
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Botão Cancelar */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  photoContainer: {
    alignItems: 'center',
  },
  photoWrapper: {
    position: 'relative',
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A5F7A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  changePhotoText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  keyboardView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E8ECF0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    marginBottom: 24,
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1A5F7A',
    lineHeight: 18,
  },
  saveButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfileScreen;
