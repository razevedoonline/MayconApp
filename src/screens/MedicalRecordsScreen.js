import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Dados do prontuário
const medicalData = {
  patientInfo: {
    name: 'Maria Silva Santos',
    birthDate: '15/03/1965',
    age: '60 anos',
    bloodType: 'O+',
    allergies: ['Dipirona', 'Penicilina'],
    chronicConditions: ['Hipertensão', 'Diabetes Tipo 2'],
  },
  vitals: {
    pressure: '12/8 mmHg',
    glucose: '98 mg/dL',
    weight: '68 kg',
    height: '1.62 m',
    imc: '25.9',
  },
  consultations: [
    {
      id: 1,
      date: '01/11/2025',
      doctor: 'Dr. Maycon Fellipe',
      type: 'Consulta de Rotina',
      diagnosis: 'Hipertensão controlada',
      notes: 'Paciente apresenta quadro estável. Manter medicação atual. Retorno em 30 dias.',
      prescriptions: ['Losartana 50mg - 1x ao dia', 'Metformina 850mg - 2x ao dia'],
    },
    {
      id: 2,
      date: '15/10/2025',
      doctor: 'Dr. Maycon Fellipe',
      type: 'Exame de Rotina',
      diagnosis: 'Check-up anual',
      notes: 'Exames laboratoriais dentro da normalidade. Glicemia de jejum em 98mg/dL.',
      prescriptions: [],
    },
    {
      id: 3,
      date: '20/09/2025',
      doctor: 'Dr. Maycon Fellipe',
      type: 'Consulta',
      diagnosis: 'Gripe comum',
      notes: 'Quadro gripal leve. Repouso e hidratação recomendados.',
      prescriptions: ['Paracetamol 750mg - 6/6h se febre', 'Vitamina C 1g - 1x ao dia'],
    },
  ],
  exams: [
    {
      id: 1,
      date: '15/10/2025',
      name: 'Hemograma Completo',
      status: 'Normal',
      lab: 'Lab São Carlos',
    },
    {
      id: 2,
      date: '15/10/2025',
      name: 'Glicemia de Jejum',
      status: 'Normal',
      result: '98 mg/dL',
      lab: 'Lab São Carlos',
    },
    {
      id: 3,
      date: '15/10/2025',
      name: 'Colesterol Total',
      status: 'Atenção',
      result: '210 mg/dL',
      lab: 'Lab São Carlos',
    },
    {
      id: 4,
      date: '01/08/2025',
      name: 'Eletrocardiograma',
      status: 'Normal',
      lab: 'Clínica São Carlos Imagem',
    },
  ],
  medications: [
    {
      id: 1,
      name: 'Losartana 50mg',
      dosage: '1 comprimido ao dia',
      schedule: 'Manhã',
      startDate: '01/01/2024',
      status: 'active',
    },
    {
      id: 2,
      name: 'Metformina 850mg',
      dosage: '1 comprimido 2x ao dia',
      schedule: 'Manhã e Noite',
      startDate: '01/01/2024',
      status: 'active',
    },
    {
      id: 3,
      name: 'AAS 100mg',
      dosage: '1 comprimido ao dia',
      schedule: 'Após almoço',
      startDate: '15/06/2024',
      status: 'active',
    },
  ],
};

const MedicalRecordsScreen = ({ navigation }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const sections = [
    { id: 'overview', title: 'Resumo', icon: 'document-text' },
    { id: 'consultations', title: 'Consultas', icon: 'calendar' },
    { id: 'exams', title: 'Exames', icon: 'flask' },
    { id: 'medications', title: 'Medicamentos', icon: 'medkit' },
  ];

  const openConsultationDetail = (consultation) => {
    setSelectedConsultation(consultation);
    setShowDetailModal(true);
  };

  const getExamStatusColor = (status) => {
    if (status === 'Normal') return '#4CAF50';
    if (status === 'Atenção') return '#FF9800';
    return '#E53935';
  };

  const renderOverview = () => (
    <View>
      {/* Informações do Paciente */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person" size={20} color="#1A5F7A" />
          <Text style={styles.cardTitle}>Informações Pessoais</Text>
        </View>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tipo Sanguíneo</Text>
            <Text style={styles.infoValue}>{medicalData.patientInfo.bloodType}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Idade</Text>
            <Text style={styles.infoValue}>{medicalData.patientInfo.age}</Text>
          </View>
        </View>
      </View>

      {/* Sinais Vitais */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="heart-pulse" size={20} color="#E53935" />
          <Text style={styles.cardTitle}>Últimos Sinais Vitais</Text>
        </View>
        <View style={styles.vitalsGrid}>
          <View style={styles.vitalItem}>
            <MaterialCommunityIcons name="heart" size={24} color="#E53935" />
            <Text style={styles.vitalValue}>{medicalData.vitals.pressure}</Text>
            <Text style={styles.vitalLabel}>Pressão</Text>
          </View>
          <View style={styles.vitalItem}>
            <MaterialCommunityIcons name="water" size={24} color="#2196F3" />
            <Text style={styles.vitalValue}>{medicalData.vitals.glucose}</Text>
            <Text style={styles.vitalLabel}>Glicose</Text>
          </View>
          <View style={styles.vitalItem}>
            <MaterialCommunityIcons name="scale-bathroom" size={24} color="#4CAF50" />
            <Text style={styles.vitalValue}>{medicalData.vitals.weight}</Text>
            <Text style={styles.vitalLabel}>Peso</Text>
          </View>
          <View style={styles.vitalItem}>
            <MaterialCommunityIcons name="human-male-height" size={24} color="#9C27B0" />
            <Text style={styles.vitalValue}>{medicalData.vitals.imc}</Text>
            <Text style={styles.vitalLabel}>IMC</Text>
          </View>
        </View>
      </View>

      {/* Alergias */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="warning" size={20} color="#FF9800" />
          <Text style={styles.cardTitle}>Alergias</Text>
        </View>
        <View style={styles.tagsContainer}>
          {medicalData.patientInfo.allergies.map((allergy, index) => (
            <View key={index} style={styles.allergyTag}>
              <Ionicons name="alert-circle" size={14} color="#E53935" />
              <Text style={styles.allergyText}>{allergy}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Condições Crônicas */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <FontAwesome5 name="notes-medical" size={18} color="#1A5F7A" />
          <Text style={styles.cardTitle}>Condições Crônicas</Text>
        </View>
        <View style={styles.tagsContainer}>
          {medicalData.patientInfo.chronicConditions.map((condition, index) => (
            <View key={index} style={styles.conditionTag}>
              <Text style={styles.conditionText}>{condition}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderConsultations = () => (
    <View>
      {medicalData.consultations.map((consultation) => (
        <TouchableOpacity
          key={consultation.id}
          style={styles.consultationCard}
          onPress={() => openConsultationDetail(consultation)}
          activeOpacity={0.7}
        >
          <View style={styles.consultationHeader}>
            <View style={styles.consultationDate}>
              <Ionicons name="calendar" size={16} color="#1A5F7A" />
              <Text style={styles.dateText}>{consultation.date}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </View>
          <Text style={styles.consultationType}>{consultation.type}</Text>
          <Text style={styles.consultationDiagnosis}>{consultation.diagnosis}</Text>
          <View style={styles.consultationFooter}>
            <MaterialCommunityIcons name="doctor" size={14} color="#666" />
            <Text style={styles.doctorText}>{consultation.doctor}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderExams = () => (
    <View>
      {medicalData.exams.map((exam) => (
        <View key={exam.id} style={styles.examCard}>
          <View style={styles.examHeader}>
            <View style={styles.examInfo}>
              <Ionicons name="flask" size={20} color="#1A5F7A" />
              <View>
                <Text style={styles.examName}>{exam.name}</Text>
                <Text style={styles.examDate}>{exam.date} • {exam.lab}</Text>
              </View>
            </View>
            <View style={[styles.examStatus, { backgroundColor: getExamStatusColor(exam.status) + '20' }]}>
              <Text style={[styles.examStatusText, { color: getExamStatusColor(exam.status) }]}>
                {exam.status}
              </Text>
            </View>
          </View>
          {exam.result && (
            <View style={styles.examResult}>
              <Text style={styles.examResultLabel}>Resultado:</Text>
              <Text style={styles.examResultValue}>{exam.result}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );

  const renderMedications = () => (
    <View>
      {medicalData.medications.map((medication) => (
        <View key={medication.id} style={styles.medicationCard}>
          <View style={styles.medicationIcon}>
            <MaterialCommunityIcons name="pill" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.medicationInfo}>
            <Text style={styles.medicationName}>{medication.name}</Text>
            <Text style={styles.medicationDosage}>{medication.dosage}</Text>
            <View style={styles.medicationSchedule}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.scheduleText}>{medication.schedule}</Text>
            </View>
          </View>
          <View style={[styles.medicationStatus, medication.status === 'active' && styles.medicationStatusActive]}>
            <Text style={[styles.medicationStatusText, medication.status === 'active' && styles.medicationStatusTextActive]}>
              {medication.status === 'active' ? 'Ativo' : 'Inativo'}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'consultations':
        return renderConsultations();
      case 'exams':
        return renderExams();
      case 'medications':
        return renderMedications();
      default:
        return renderOverview();
    }
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
          <Text style={styles.headerTitle}>Prontuário Médico</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.patientHeader}>
          <View style={styles.patientAvatar}>
            <Text style={styles.avatarText}>MS</Text>
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{medicalData.patientInfo.name}</Text>
            <Text style={styles.patientDetails}>
              {medicalData.patientInfo.birthDate} • {medicalData.patientInfo.bloodType}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tabs de Seções */}
      <View style={styles.sectionsContainer}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[styles.sectionTab, activeSection === section.id && styles.sectionTabActive]}
            onPress={() => setActiveSection(section.id)}
          >
            <Ionicons 
              name={section.icon} 
              size={16} 
              color={activeSection === section.id ? '#FFFFFF' : '#666'} 
            />
            <Text style={[styles.sectionTabText, activeSection === section.id && styles.sectionTabTextActive]}>
              {section.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conteúdo */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>

      {/* Modal de Detalhes da Consulta */}
      <Modal
        visible={showDetailModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDetailModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                
                {selectedConsultation && (
                  <>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Detalhes da Consulta</Text>
                      <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                        <Ionicons name="close" size={24} color="#666" />
                      </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                      <View style={styles.detailSection}>
                        <View style={styles.detailRow}>
                          <Ionicons name="calendar" size={18} color="#1A5F7A" />
                          <Text style={styles.detailText}>{selectedConsultation.date}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <MaterialCommunityIcons name="doctor" size={18} color="#1A5F7A" />
                          <Text style={styles.detailText}>{selectedConsultation.doctor}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Ionicons name="medical" size={18} color="#1A5F7A" />
                          <Text style={styles.detailText}>{selectedConsultation.type}</Text>
                        </View>
                      </View>

                      <View style={styles.detailSection}>
                        <Text style={styles.detailLabel}>Diagnóstico</Text>
                        <Text style={styles.detailValue}>{selectedConsultation.diagnosis}</Text>
                      </View>

                      <View style={styles.detailSection}>
                        <Text style={styles.detailLabel}>Observações</Text>
                        <Text style={styles.detailValue}>{selectedConsultation.notes}</Text>
                      </View>

                      {selectedConsultation.prescriptions.length > 0 && (
                        <View style={styles.detailSection}>
                          <Text style={styles.detailLabel}>Prescrições</Text>
                          {selectedConsultation.prescriptions.map((prescription, index) => (
                            <View key={index} style={styles.prescriptionItem}>
                              <MaterialCommunityIcons name="pill" size={16} color="#4CAF50" />
                              <Text style={styles.prescriptionText}>{prescription}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </ScrollView>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
  },
  patientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  patientInfo: {
    marginLeft: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  patientDetails: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  sectionsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 4,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  sectionTabActive: {
    backgroundColor: '#1A5F7A',
  },
  sectionTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    marginTop: 4,
  },
  sectionTabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 16,
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  infoItem: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A5F7A',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vitalItem: {
    width: '48%',
    backgroundColor: '#F5F7FA',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  vitalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 6,
  },
  vitalLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  allergyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E53935',
  },
  conditionTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  conditionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A5F7A',
  },
  consultationCard: {
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
  consultationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  consultationDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A5F7A',
  },
  consultationType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  consultationDiagnosis: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  consultationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  doctorText: {
    fontSize: 13,
    color: '#666',
  },
  examCard: {
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
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  examInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  examName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  examDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  examStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  examStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  examResult: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 8,
  },
  examResultLabel: {
    fontSize: 13,
    color: '#666',
  },
  examResultValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  medicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  medicationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A5F7A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  medicationName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  medicationDosage: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  medicationSchedule: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  scheduleText: {
    fontSize: 12,
    color: '#999',
  },
  medicationStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  medicationStatusActive: {
    backgroundColor: '#E8F5E9',
  },
  medicationStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
  },
  medicationStatusTextActive: {
    color: '#4CAF50',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  detailSection: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  detailText: {
    fontSize: 15,
    color: '#333',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A5F7A',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  prescriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    gap: 10,
  },
  prescriptionText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});

export default MedicalRecordsScreen;

