import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Gerar próximos 14 dias
const generateDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    dates.push({
      id: i,
      dayName: dayNames[date.getDay()],
      dayNumber: date.getDate(),
      month: monthNames[date.getMonth()],
      fullDate: date.toISOString().split('T')[0],
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    });
  }
  
  return dates;
};

// Horários disponíveis (simulando disponibilidade)
const generateTimeSlots = (dateId) => {
  const allSlots = [
    { time: '08:00', period: 'Manhã' },
    { time: '08:30', period: 'Manhã' },
    { time: '09:00', period: 'Manhã' },
    { time: '09:30', period: 'Manhã' },
    { time: '10:00', period: 'Manhã' },
    { time: '10:30', period: 'Manhã' },
    { time: '11:00', period: 'Manhã' },
    { time: '11:30', period: 'Manhã' },
    { time: '14:00', period: 'Tarde' },
    { time: '14:30', period: 'Tarde' },
    { time: '15:00', period: 'Tarde' },
    { time: '15:30', period: 'Tarde' },
    { time: '16:00', period: 'Tarde' },
    { time: '16:30', period: 'Tarde' },
    { time: '17:00', period: 'Tarde' },
    { time: '17:30', period: 'Tarde' },
  ];
  
  // Simular alguns horários ocupados baseado no dia
  const occupiedIndexes = [
    dateId % 3,
    (dateId + 2) % 8,
    (dateId + 4) % 12,
    (dateId + 1) % 16,
  ];
  
  return allSlots.map((slot, index) => ({
    ...slot,
    id: index,
    available: !occupiedIndexes.includes(index),
  }));
};

const ScheduleScreen = ({ navigation }) => {
  const [dates] = useState(generateDates());
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateSelect = (date) => {
    if (date.isWeekend) {
      Alert.alert('Atenção', 'Não há atendimento aos finais de semana.');
      return;
    }
    setSelectedDate(date);
    setSelectedTime(null);
    setTimeSlots(generateTimeSlots(date.id));
  };

  const handleTimeSelect = (slot) => {
    if (!slot.available) {
      Alert.alert('Horário Indisponível', 'Este horário já está ocupado. Por favor, escolha outro.');
      return;
    }
    setSelectedTime(slot);
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Atenção', 'Por favor, selecione uma data e horário.');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        '✅ Consulta Agendada!',
        `Sua consulta foi agendada para:\n\n📅 ${selectedDate.dayNumber} de ${selectedDate.month}\n⏰ ${selectedTime.time}\n👨‍⚕️ Dr. Maycon Fellipe\n📍 Clínica São Carlos Imagem - Sobral`,
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    }, 1500);
  };

  const morningSlots = timeSlots.filter(slot => slot.period === 'Manhã');
  const afternoonSlots = timeSlots.filter(slot => slot.period === 'Tarde');

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
          <Text style={styles.headerTitle}>Agendar Consulta</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.doctorInfo}>
          <MaterialCommunityIcons name="doctor" size={40} color="#FFFFFF" />
          <View style={styles.doctorText}>
            <Text style={styles.doctorName}>Dr. Maycon Fellipe</Text>
            <Text style={styles.doctorSpecialty}>Clínico Geral e Internista</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Seleção de Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="calendar" size={18} color="#1A5F7A" /> Escolha a Data
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datesContainer}
          >
            {dates.map((date) => (
              <TouchableOpacity
                key={date.id}
                style={[
                  styles.dateCard,
                  date.isWeekend && styles.dateCardWeekend,
                  selectedDate?.id === date.id && styles.dateCardSelected,
                ]}
                onPress={() => handleDateSelect(date)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.dateDayName,
                  date.isWeekend && styles.dateTextWeekend,
                  selectedDate?.id === date.id && styles.dateTextSelected,
                ]}>
                  {date.dayName}
                </Text>
                <Text style={[
                  styles.dateDayNumber,
                  date.isWeekend && styles.dateTextWeekend,
                  selectedDate?.id === date.id && styles.dateTextSelected,
                ]}>
                  {date.dayNumber}
                </Text>
                <Text style={[
                  styles.dateMonth,
                  date.isWeekend && styles.dateTextWeekend,
                  selectedDate?.id === date.id && styles.dateTextSelected,
                ]}>
                  {date.month}
                </Text>
                {date.isWeekend && (
                  <View style={styles.weekendBadge}>
                    <Ionicons name="close-circle" size={14} color="#E53935" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Seleção de Horário */}
        {selectedDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="time" size={18} color="#1A5F7A" /> Escolha o Horário
            </Text>
            
            <Text style={styles.selectedDateText}>
              📅 {selectedDate.dayName}, {selectedDate.dayNumber} de {selectedDate.month}
            </Text>

            {/* Manhã */}
            <View style={styles.periodContainer}>
              <View style={styles.periodHeader}>
                <Ionicons name="sunny" size={20} color="#FF9800" />
                <Text style={styles.periodTitle}>Manhã</Text>
              </View>
              <View style={styles.timeSlotsGrid}>
                {morningSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.timeSlot,
                      !slot.available && styles.timeSlotUnavailable,
                      selectedTime?.id === slot.id && styles.timeSlotSelected,
                    ]}
                    onPress={() => handleTimeSelect(slot)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      !slot.available && styles.timeSlotTextUnavailable,
                      selectedTime?.id === slot.id && styles.timeSlotTextSelected,
                    ]}>
                      {slot.time}
                    </Text>
                    {!slot.available && (
                      <Ionicons name="close-circle" size={14} color="#E53935" style={styles.unavailableIcon} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tarde */}
            <View style={styles.periodContainer}>
              <View style={styles.periodHeader}>
                <Ionicons name="moon" size={20} color="#5C6BC0" />
                <Text style={styles.periodTitle}>Tarde</Text>
              </View>
              <View style={styles.timeSlotsGrid}>
                {afternoonSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.timeSlot,
                      !slot.available && styles.timeSlotUnavailable,
                      selectedTime?.id === slot.id && styles.timeSlotSelected,
                    ]}
                    onPress={() => handleTimeSelect(slot)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      !slot.available && styles.timeSlotTextUnavailable,
                      selectedTime?.id === slot.id && styles.timeSlotTextSelected,
                    ]}>
                      {slot.time}
                    </Text>
                    {!slot.available && (
                      <Ionicons name="close-circle" size={14} color="#E53935" style={styles.unavailableIcon} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Legenda */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.legendText}>Disponível</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#E53935' }]} />
                <Text style={styles.legendText}>Ocupado</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#1A5F7A' }]} />
                <Text style={styles.legendText}>Selecionado</Text>
              </View>
            </View>
          </View>
        )}

        {/* Resumo do Agendamento */}
        {selectedDate && selectedTime && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>📋 Resumo do Agendamento</Text>
            <View style={styles.summaryRow}>
              <Ionicons name="calendar-outline" size={18} color="#1A5F7A" />
              <Text style={styles.summaryText}>
                {selectedDate.dayName}, {selectedDate.dayNumber} de {selectedDate.month}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="time-outline" size={18} color="#1A5F7A" />
              <Text style={styles.summaryText}>{selectedTime.time}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="person-outline" size={18} color="#1A5F7A" />
              <Text style={styles.summaryText}>Dr. Maycon Fellipe</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="location-outline" size={18} color="#1A5F7A" />
              <Text style={styles.summaryText}>Clínica São Carlos Imagem - Sobral</Text>
            </View>
          </View>
        )}

        {/* Espaço para o botão */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botão Confirmar */}
      {selectedDate && selectedTime && (
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[styles.confirmButton, isLoading && styles.confirmButtonDisabled]}
            onPress={handleConfirm}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#1A5F7A', '#2D8EBA']}
              style={styles.confirmButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isLoading ? (
                <Text style={styles.confirmButtonText}>Agendando...</Text>
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
                  <Text style={styles.confirmButtonText}>Confirmar Agendamento</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
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
  placeholder: {
    width: 40,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
  },
  doctorText: {
    marginLeft: 12,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  datesContainer: {
    paddingRight: 20,
  },
  dateCard: {
    width: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginRight: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dateCardWeekend: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FFCDD2',
    opacity: 0.8,
  },
  dateCardSelected: {
    backgroundColor: '#1A5F7A',
    borderColor: '#1A5F7A',
  },
  dateDayName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  dateDayNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
  },
  dateMonth: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  dateTextWeekend: {
    color: '#E57373',
  },
  dateTextSelected: {
    color: '#FFFFFF',
  },
  weekendBadge: {
    marginTop: 4,
  },
  weekendText: {
    fontSize: 7,
    fontWeight: '700',
    color: '#E53935',
    textTransform: 'uppercase',
  },
  selectedDateText: {
    fontSize: 15,
    color: '#1A5F7A',
    fontWeight: '600',
    marginBottom: 16,
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 12,
  },
  periodContainer: {
    marginBottom: 20,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  periodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    width: (width - 70) / 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    position: 'relative',
  },
  timeSlotUnavailable: {
    backgroundColor: '#FFEBEE',
    borderColor: '#E53935',
    opacity: 0.6,
  },
  timeSlotSelected: {
    backgroundColor: '#1A5F7A',
    borderColor: '#1A5F7A',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timeSlotTextUnavailable: {
    color: '#E53935',
    textDecorationLine: 'line-through',
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
  },
  unavailableIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8ECF0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 15,
    color: '#333',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E8ECF0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  confirmButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  confirmButtonDisabled: {
    opacity: 0.7,
  },
  confirmButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default ScheduleScreen;

