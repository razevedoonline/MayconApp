import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Linking,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const doctorPhoto = require('../../assets/doctor.png');

const VideoCallScreen = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  // Consultas agendadas com videochamada disponível
  const scheduledCalls = [
    {
      id: 1,
      date: '15 de Dezembro, 2025',
      time: '14:30',
      type: 'Consulta de Rotina',
      status: 'scheduled',
      canStart: true,
    },
    {
      id: 2,
      date: '22 de Dezembro, 2025',
      time: '10:00',
      type: 'Retorno',
      status: 'scheduled',
      canStart: false,
    },
  ];

  const handleStartCall = (call) => {
    if (call.canStart) {
      Alert.alert(
        '🎥 Iniciar Videochamada',
        `Deseja iniciar a videochamada com Dr. Maycon Fellipe?\n\nConsulta: ${call.type}\nHorário: ${call.time}`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Iniciar', 
            onPress: () => {
              // Navegar para a tela de videoconferência
              navigation.navigate('VideoConference', { call });
            }
          },
        ]
      );
    } else {
      Alert.alert(
        'Aguarde o horário',
        'A videochamada só pode ser iniciada próximo ao horário agendado.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleWhatsAppCall = () => {
    const phoneNumber = '5588998056685';
    const message = 'Olá, gostaria de agendar uma consulta por videochamada com o Dr. Maycon Fellipe.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const handleScheduleVideoCall = () => {
    navigation.navigate('Schedule');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <LinearGradient
        colors={['#673AB7', '#9C27B0', '#E91E63']}
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
          <Text style={styles.headerTitle}>Videochamada</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Ícone principal */}
        <View style={styles.headerIconContainer}>
          <View style={styles.headerIconBg}>
            <Ionicons name="videocam" size={50} color="#673AB7" />
          </View>
          <Text style={styles.headerSubtitle}>Consulta Online</Text>
          <Text style={styles.headerDescription}>
            Converse com o Dr. Maycon Fellipe{'\n'}sem sair de casa
          </Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Card do Médico */}
        <View style={styles.doctorCard}>
          <Image source={doctorPhoto} style={styles.doctorPhoto} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>Dr. Maycon Fellipe</Text>
            <Text style={styles.doctorSpecialty}>Médico Clínico e Internista</Text>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Disponível para chamadas</Text>
            </View>
          </View>
        </View>

        {/* Consultas Agendadas */}
        <Text style={styles.sectionTitle}>📅 Suas Videochamadas Agendadas</Text>
        
        {scheduledCalls.map((call) => (
          <View key={call.id} style={styles.callCard}>
            <View style={styles.callCardHeader}>
              <View style={styles.callDateContainer}>
                <Ionicons name="calendar" size={18} color="#673AB7" />
                <Text style={styles.callDate}>{call.date}</Text>
              </View>
              <View style={[
                styles.callStatus,
                { backgroundColor: call.canStart ? '#E8F5E9' : '#FFF3E0' }
              ]}>
                <Text style={[
                  styles.callStatusText,
                  { color: call.canStart ? '#4CAF50' : '#FF9800' }
                ]}>
                  {call.canStart ? 'Disponível' : 'Aguardando'}
                </Text>
              </View>
            </View>
            
            <View style={styles.callDetails}>
              <View style={styles.callTimeContainer}>
                <Ionicons name="time" size={16} color="#666" />
                <Text style={styles.callTime}>{call.time}</Text>
              </View>
              <Text style={styles.callType}>{call.type}</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.startCallButton,
                { backgroundColor: call.canStart ? '#673AB7' : '#E0E0E0' }
              ]}
              onPress={() => handleStartCall(call)}
              activeOpacity={0.8}
            >
              <Ionicons 
                name="videocam" 
                size={20} 
                color={call.canStart ? '#FFFFFF' : '#999'} 
              />
              <Text style={[
                styles.startCallButtonText,
                { color: call.canStart ? '#FFFFFF' : '#999' }
              ]}>
                {call.canStart ? 'Iniciar Chamada' : 'Aguardar Horário'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Opções */}
        <Text style={styles.sectionTitle}>🎯 O que você precisa?</Text>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleScheduleVideoCall}
          activeOpacity={0.8}
        >
          <View style={[styles.optionIcon, { backgroundColor: '#E8F5E9' }]}>
            <MaterialCommunityIcons name="calendar-plus" size={28} color="#4CAF50" />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Agendar Nova Videochamada</Text>
            <Text style={styles.optionDescription}>
              Marque uma consulta online com o médico
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleWhatsAppCall}
          activeOpacity={0.8}
        >
          <View style={[styles.optionIcon, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="logo-whatsapp" size={28} color="#25D366" />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Falar pelo WhatsApp</Text>
            <Text style={styles.optionDescription}>
              Tire dúvidas ou agende pelo WhatsApp
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#CCC" />
        </TouchableOpacity>

        {/* Informações */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color="#673AB7" />
            <Text style={styles.infoTitle}>Como funciona?</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoNumber}>
              <Text style={styles.infoNumberText}>1</Text>
            </View>
            <Text style={styles.infoText}>Agende sua consulta online</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoNumber}>
              <Text style={styles.infoNumberText}>2</Text>
            </View>
            <Text style={styles.infoText}>No dia e horário, acesse o app</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoNumber}>
              <Text style={styles.infoNumberText}>3</Text>
            </View>
            <Text style={styles.infoText}>Clique em "Iniciar Chamada"</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoNumber}>
              <Text style={styles.infoNumberText}>4</Text>
            </View>
            <Text style={styles.infoText}>Converse com o médico por vídeo</Text>
          </View>
        </View>

        {/* Dicas */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Dicas para uma boa chamada</Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
            <Text style={styles.tipText}>Esteja em um local silencioso e bem iluminado</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
            <Text style={styles.tipText}>Verifique sua conexão de internet</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
            <Text style={styles.tipText}>Tenha em mãos seus exames recentes</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
            <Text style={styles.tipText}>Anote suas dúvidas antes da consulta</Text>
          </View>
        </View>

      </ScrollView>
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
    backgroundColor: 'rgba(255,255,255,0.2)',
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
  headerIconContainer: {
    alignItems: 'center',
  },
  headerIconBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  headerSubtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  doctorPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#673AB7',
  },
  doctorInfo: {
    marginLeft: 14,
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  doctorSpecialty: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  onlineText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  callCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  callCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  callDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  callDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  callStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  callStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  callDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  callTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 16,
  },
  callTime: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  callType: {
    fontSize: 14,
    color: '#666',
  },
  startCallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  startCallButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContent: {
    flex: 1,
    marginLeft: 14,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#EDE7F6',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#673AB7',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#673AB7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  tipsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
    lineHeight: 18,
  },
});

export default VideoCallScreen;

