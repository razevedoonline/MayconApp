import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Alert from '../utils/alert';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Dados das consultas
const appointmentsData = {
  upcoming: [
    {
      id: 1,
      date: '15 Dez 2025',
      time: '14:30',
      doctor: 'Dr. Maycon Fellipe',
      specialty: 'Clínico Geral',
      type: 'Consulta de Rotina',
      location: 'Clínica São Carlos Imagem',
      status: 'confirmed',
    },
    {
      id: 2,
      date: '22 Dez 2025',
      time: '09:00',
      doctor: 'Dr. Maycon Fellipe',
      specialty: 'Clínico Geral',
      type: 'Retorno',
      location: 'Clínica São Carlos Imagem',
      status: 'pending',
    },
  ],
  past: [
    {
      id: 3,
      date: '01 Nov 2025',
      time: '10:30',
      doctor: 'Dr. Maycon Fellipe',
      specialty: 'Clínico Geral',
      type: 'Consulta de Rotina',
      location: 'Clínica São Carlos Imagem',
      status: 'completed',
    },
    {
      id: 4,
      date: '15 Out 2025',
      time: '15:00',
      doctor: 'Dr. Maycon Fellipe',
      specialty: 'Clínico Geral',
      type: 'Exame de Rotina',
      location: 'Clínica São Carlos Imagem',
      status: 'completed',
    },
    {
      id: 5,
      date: '20 Set 2025',
      time: '08:30',
      doctor: 'Dr. Maycon Fellipe',
      specialty: 'Clínico Geral',
      type: 'Check-up Anual',
      location: 'Clínica São Carlos Imagem',
      status: 'completed',
    },
    {
      id: 6,
      date: '10 Ago 2025',
      time: '11:00',
      doctor: 'Dr. Maycon Fellipe',
      specialty: 'Clínico Geral',
      type: 'Consulta',
      location: 'Clínica São Carlos Imagem',
      status: 'cancelled',
    },
  ],
};

const MyAppointmentsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments] = useState(appointmentsData);

  const getStatusConfig = (status) => {
    const configs = {
      confirmed: { label: 'Confirmada', color: '#4CAF50', bgColor: '#E8F5E9', icon: 'checkmark-circle' },
      pending: { label: 'Pendente', color: '#FF9800', bgColor: '#FFF3E0', icon: 'time' },
      completed: { label: 'Realizada', color: '#2196F3', bgColor: '#E3F2FD', icon: 'checkmark-done' },
      cancelled: { label: 'Cancelada', color: '#E53935', bgColor: '#FFEBEE', icon: 'close-circle' },
    };
    return configs[status] || configs.pending;
  };

  const handleCancelAppointment = (appointment) => {
    Alert.alert(
      'Cancelar Consulta',
      `Deseja cancelar a consulta do dia ${appointment.date} às ${appointment.time}?`,
      [
        { text: 'Não', style: 'cancel' },
        { 
          text: 'Sim, Cancelar', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Consulta Cancelada', 'Sua consulta foi cancelada com sucesso.');
          }
        },
      ]
    );
  };

  const handleReschedule = (appointment) => {
    Alert.alert(
      'Reagendar Consulta',
      'Deseja reagendar esta consulta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Reagendar', 
          onPress: () => navigation.navigate('Schedule')
        },
      ]
    );
  };

  const handleViewDetails = (appointment) => {
    Alert.alert(
      '📋 Detalhes da Consulta',
      `📅 Data: ${appointment.date}\n⏰ Horário: ${appointment.time}\n👨‍⚕️ Médico: ${appointment.doctor}\n🏥 Local: ${appointment.location}\n📝 Tipo: ${appointment.type}`,
      [{ text: 'OK' }]
    );
  };

  const renderAppointmentCard = (appointment, isUpcoming) => {
    const statusConfig = getStatusConfig(appointment.status);
    
    return (
      <TouchableOpacity 
        key={appointment.id}
        style={styles.appointmentCard}
        onPress={() => handleViewDetails(appointment)}
        activeOpacity={0.7}
      >
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
          <Ionicons name={statusConfig.icon} size={14} color={statusConfig.color} />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>

        {/* Data e Hora */}
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateBox}>
            <Ionicons name="calendar" size={20} color="#1A5F7A" />
            <Text style={styles.dateText}>{appointment.date}</Text>
          </View>
          <View style={styles.timeBox}>
            <Ionicons name="time" size={20} color="#1A5F7A" />
            <Text style={styles.timeText}>{appointment.time}</Text>
          </View>
        </View>

        {/* Informações */}
        <View style={styles.appointmentInfo}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="doctor" size={18} color="#666" />
            <Text style={styles.infoText}>{appointment.doctor}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="medical" size={18} color="#666" />
            <Text style={styles.infoText}>{appointment.type}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={18} color="#666" />
            <Text style={styles.infoText}>{appointment.location}</Text>
          </View>
        </View>

        {/* Ações para consultas futuras */}
        {isUpcoming && appointment.status !== 'cancelled' && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleReschedule(appointment)}
            >
              <Ionicons name="calendar-outline" size={18} color="#1A5F7A" />
              <Text style={styles.actionText}>Reagendar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleCancelAppointment(appointment)}
            >
              <Ionicons name="close-outline" size={18} color="#E53935" />
              <Text style={[styles.actionText, styles.cancelText]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const currentAppointments = activeTab === 'upcoming' ? appointments.upcoming : appointments.past;

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
          <Text style={styles.headerTitle}>Minhas Consultas</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('Schedule')}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Resumo */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{appointments.upcoming.length}</Text>
            <Text style={styles.summaryLabel}>Agendadas</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {appointments.past.filter(a => a.status === 'completed').length}
            </Text>
            <Text style={styles.summaryLabel}>Realizadas</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {appointments.past.filter(a => a.status === 'cancelled').length}
            </Text>
            <Text style={styles.summaryLabel}>Canceladas</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Ionicons 
            name="calendar" 
            size={18} 
            color={activeTab === 'upcoming' ? '#1A5F7A' : '#999'} 
          />
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
            Próximas
          </Text>
          {appointments.upcoming.length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{appointments.upcoming.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => setActiveTab('past')}
        >
          <Ionicons 
            name="time" 
            size={18} 
            color={activeTab === 'past' ? '#1A5F7A' : '#999'} 
          />
          <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
            Histórico
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Consultas */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {currentAppointments.length > 0 ? (
          currentAppointments.map((appointment) => 
            renderAppointmentCard(appointment, activeTab === 'upcoming')
          )
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={60} color="#CCC" />
            <Text style={styles.emptyTitle}>
              {activeTab === 'upcoming' ? 'Nenhuma consulta agendada' : 'Nenhuma consulta no histórico'}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === 'upcoming' 
                ? 'Agende sua próxima consulta com o Dr. Maycon Fellipe'
                : 'Seu histórico de consultas aparecerá aqui'
              }
            </Text>
            {activeTab === 'upcoming' && (
              <TouchableOpacity 
                style={styles.scheduleButton}
                onPress={() => navigation.navigate('Schedule')}
              >
                <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                <Text style={styles.scheduleButtonText}>Agendar Consulta</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -15,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#E3F2FD',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  tabTextActive: {
    color: '#1A5F7A',
  },
  tabBadge: {
    backgroundColor: '#E53935',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 16,
  },
  appointmentCard: {
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  dateBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 10,
    borderRadius: 10,
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 10,
    borderRadius: 10,
    gap: 8,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  appointmentInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A5F7A',
  },
  cancelButton: {
    backgroundColor: '#FFEBEE',
  },
  cancelText: {
    color: '#E53935',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A5F7A',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  scheduleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default MyAppointmentsScreen;

