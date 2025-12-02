import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Dados das receitas
const prescriptionsData = {
  active: [
    {
      id: 1,
      date: '01/11/2025',
      doctor: 'Dr. Maycon Fellipe',
      crm: 'CRM/CE 15972',
      validUntil: '01/02/2026',
      medications: [
        {
          name: 'Losartana 50mg',
          dosage: '1 comprimido',
          frequency: '1x ao dia',
          period: 'Uso contínuo',
          instructions: 'Tomar pela manhã, em jejum',
        },
        {
          name: 'Metformina 850mg',
          dosage: '1 comprimido',
          frequency: '2x ao dia',
          period: 'Uso contínuo',
          instructions: 'Tomar após café e jantar',
        },
        {
          name: 'AAS 100mg',
          dosage: '1 comprimido',
          frequency: '1x ao dia',
          period: 'Uso contínuo',
          instructions: 'Tomar após o almoço',
        },
      ],
      type: 'comum',
    },
    {
      id: 2,
      date: '15/11/2025',
      doctor: 'Dr. Maycon Fellipe',
      crm: 'CRM/CE 15972',
      validUntil: '15/12/2025',
      medications: [
        {
          name: 'Vitamina D3 2000UI',
          dosage: '1 cápsula',
          frequency: '1x ao dia',
          period: '90 dias',
          instructions: 'Tomar junto com uma refeição',
        },
      ],
      type: 'comum',
    },
  ],
  history: [
    {
      id: 3,
      date: '20/09/2025',
      doctor: 'Dr. Maycon Fellipe',
      crm: 'CRM/CE 15972',
      validUntil: '20/10/2025',
      medications: [
        {
          name: 'Paracetamol 750mg',
          dosage: '1 comprimido',
          frequency: '6/6 horas',
          period: '5 dias',
          instructions: 'Tomar se febre ou dor',
        },
        {
          name: 'Vitamina C 1g',
          dosage: '1 comprimido efervescente',
          frequency: '1x ao dia',
          period: '10 dias',
          instructions: 'Dissolver em água',
        },
      ],
      type: 'comum',
      diagnosis: 'Gripe comum',
    },
    {
      id: 4,
      date: '15/08/2025',
      doctor: 'Dr. Maycon Fellipe',
      crm: 'CRM/CE 15972',
      validUntil: '15/09/2025',
      medications: [
        {
          name: 'Amoxicilina 500mg',
          dosage: '1 cápsula',
          frequency: '8/8 horas',
          period: '7 dias',
          instructions: 'Não interromper o tratamento',
        },
      ],
      type: 'antibiotico',
      diagnosis: 'Infecção respiratória',
    },
    {
      id: 5,
      date: '01/06/2025',
      doctor: 'Dr. Maycon Fellipe',
      crm: 'CRM/CE 15972',
      validUntil: '01/07/2025',
      medications: [
        {
          name: 'Omeprazol 20mg',
          dosage: '1 cápsula',
          frequency: '1x ao dia',
          period: '30 dias',
          instructions: 'Tomar em jejum, 30min antes do café',
        },
      ],
      type: 'comum',
      diagnosis: 'Gastrite',
    },
  ],
};

const PrescriptionsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const getTypeConfig = (type) => {
    const configs = {
      comum: { label: 'Receita Comum', color: '#1A5F7A', bgColor: '#E3F2FD', icon: 'document-text' },
      antibiotico: { label: 'Antibiótico', color: '#E53935', bgColor: '#FFEBEE', icon: 'medical' },
      controlada: { label: 'Controlada', color: '#9C27B0', bgColor: '#F3E5F5', icon: 'lock-closed' },
    };
    return configs[type] || configs.comum;
  };

  const isExpired = (validUntil) => {
    const [day, month, year] = validUntil.split('/');
    const expirationDate = new Date(year, month - 1, day);
    return expirationDate < new Date();
  };

  const openDetailModal = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailModal(true);
  };

  const renderPrescriptionCard = (prescription, isActive) => {
    const typeConfig = getTypeConfig(prescription.type);
    const expired = !isActive && isExpired(prescription.validUntil);

    return (
      <TouchableOpacity
        key={prescription.id}
        style={styles.prescriptionCard}
        onPress={() => openDetailModal(prescription)}
        activeOpacity={0.7}
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={[styles.typeIcon, { backgroundColor: typeConfig.bgColor }]}>
            <Ionicons name={typeConfig.icon} size={20} color={typeConfig.color} />
          </View>
          <View style={styles.cardHeaderInfo}>
            <Text style={styles.cardDate}>{prescription.date}</Text>
            <View style={[styles.typeBadge, { backgroundColor: typeConfig.bgColor }]}>
              <Text style={[styles.typeText, { color: typeConfig.color }]}>
                {typeConfig.label}
              </Text>
            </View>
          </View>
          {isActive && (
            <View style={styles.activeBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>Ativa</Text>
            </View>
          )}
        </View>

        {/* Medicamentos Preview */}
        <View style={styles.medicationsPreview}>
          {prescription.medications.slice(0, 2).map((med, index) => (
            <View key={index} style={styles.medicationPreviewItem}>
              <MaterialCommunityIcons name="pill" size={16} color="#1A5F7A" />
              <Text style={styles.medicationPreviewText} numberOfLines={1}>
                {med.name}
              </Text>
            </View>
          ))}
          {prescription.medications.length > 2 && (
            <Text style={styles.moreMedications}>
              +{prescription.medications.length - 2} medicamento(s)
            </Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <View style={styles.doctorInfo}>
            <MaterialCommunityIcons name="doctor" size={14} color="#666" />
            <Text style={styles.doctorText}>{prescription.doctor}</Text>
          </View>
          <View style={styles.validityInfo}>
            <Ionicons 
              name={expired ? "alert-circle" : "calendar-outline"} 
              size={14} 
              color={expired ? "#E53935" : "#666"} 
            />
            <Text style={[styles.validityText, expired && styles.expiredText]}>
              {expired ? 'Expirada' : `Válida até ${prescription.validUntil}`}
            </Text>
          </View>
        </View>

        {/* Diagnosis (for history) */}
        {prescription.diagnosis && (
          <View style={styles.diagnosisBox}>
            <Ionicons name="information-circle" size={14} color="#666" />
            <Text style={styles.diagnosisText}>{prescription.diagnosis}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const currentPrescriptions = activeTab === 'active' 
    ? prescriptionsData.active 
    : prescriptionsData.history;

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
          <Text style={styles.headerTitle}>Minhas Receitas</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Resumo */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <MaterialCommunityIcons name="file-document-outline" size={24} color="#FFFFFF" />
            <Text style={styles.summaryNumber}>{prescriptionsData.active.length}</Text>
            <Text style={styles.summaryLabel}>Ativas</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <MaterialCommunityIcons name="pill" size={24} color="#FFFFFF" />
            <Text style={styles.summaryNumber}>
              {prescriptionsData.active.reduce((acc, p) => acc + p.medications.length, 0)}
            </Text>
            <Text style={styles.summaryLabel}>Medicamentos</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <MaterialCommunityIcons name="history" size={24} color="#FFFFFF" />
            <Text style={styles.summaryNumber}>{prescriptionsData.history.length}</Text>
            <Text style={styles.summaryLabel}>Histórico</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
        >
          <Ionicons 
            name="document-text" 
            size={18} 
            color={activeTab === 'active' ? '#FFFFFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
            Ativas
          </Text>
          {prescriptionsData.active.length > 0 && (
            <View style={[styles.tabBadge, activeTab === 'active' && styles.tabBadgeActive]}>
              <Text style={styles.tabBadgeText}>{prescriptionsData.active.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Ionicons 
            name="time" 
            size={18} 
            color={activeTab === 'history' ? '#FFFFFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
            Histórico
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Receitas */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {currentPrescriptions.length > 0 ? (
          currentPrescriptions.map((prescription) => 
            renderPrescriptionCard(prescription, activeTab === 'active')
          )
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="file-document-outline" size={60} color="#CCC" />
            <Text style={styles.emptyTitle}>Nenhuma receita</Text>
            <Text style={styles.emptyText}>
              {activeTab === 'active' 
                ? 'Você não possui receitas ativas no momento'
                : 'Nenhuma receita no histórico'
              }
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de Detalhes */}
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
                
                {selectedPrescription && (
                  <>
                    <View style={styles.modalHeader}>
                      <View>
                        <Text style={styles.modalTitle}>Receita Médica</Text>
                        <Text style={styles.modalSubtitle}>
                          Emitida em {selectedPrescription.date}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                        <Ionicons name="close" size={24} color="#666" />
                      </TouchableOpacity>
                    </View>

                    {/* Info do Médico */}
                    <View style={styles.doctorCard}>
                      <View style={styles.doctorAvatar}>
                        <MaterialCommunityIcons name="doctor" size={24} color="#1A5F7A" />
                      </View>
                      <View style={styles.doctorDetails}>
                        <Text style={styles.doctorName}>{selectedPrescription.doctor}</Text>
                        <Text style={styles.doctorCrm}>{selectedPrescription.crm}</Text>
                      </View>
                    </View>

                    {/* Validade */}
                    <View style={styles.validityCard}>
                      <Ionicons name="calendar" size={18} color="#1A5F7A" />
                      <Text style={styles.validityLabel}>Válida até:</Text>
                      <Text style={styles.validityValue}>{selectedPrescription.validUntil}</Text>
                    </View>

                    {/* Medicamentos */}
                    <Text style={styles.medicationsTitle}>Medicamentos Prescritos</Text>

                    <ScrollView 
                      style={styles.medicationsScroll}
                      showsVerticalScrollIndicator={false}
                    >
                      {selectedPrescription.medications.map((med, index) => (
                        <View key={index} style={styles.medicationCard}>
                          <View style={styles.medicationHeader}>
                            <View style={styles.medicationIconBox}>
                              <MaterialCommunityIcons name="pill" size={20} color="#FFFFFF" />
                            </View>
                            <Text style={styles.medicationName}>{med.name}</Text>
                          </View>
                          
                          <View style={styles.medicationDetails}>
                            <View style={styles.medicationRow}>
                              <Text style={styles.medicationLabel}>Dosagem:</Text>
                              <Text style={styles.medicationValue}>{med.dosage}</Text>
                            </View>
                            <View style={styles.medicationRow}>
                              <Text style={styles.medicationLabel}>Frequência:</Text>
                              <Text style={styles.medicationValue}>{med.frequency}</Text>
                            </View>
                            <View style={styles.medicationRow}>
                              <Text style={styles.medicationLabel}>Período:</Text>
                              <Text style={styles.medicationValue}>{med.period}</Text>
                            </View>
                          </View>

                          {med.instructions && (
                            <View style={styles.instructionsBox}>
                              <Ionicons name="information-circle" size={16} color="#FF9800" />
                              <Text style={styles.instructionsText}>{med.instructions}</Text>
                            </View>
                          )}
                        </View>
                      ))}
                    </ScrollView>

                    {/* Botões */}
                    <View style={styles.modalButtons}>
                      <TouchableOpacity style={styles.downloadBtn}>
                        <Ionicons name="download-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.downloadBtnText}>Baixar PDF</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.shareBtn}>
                        <Ionicons name="share-outline" size={20} color="#1A5F7A" />
                      </TouchableOpacity>
                    </View>
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
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    backgroundColor: '#1A5F7A',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
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
  },
  prescriptionCard: {
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
    marginBottom: 12,
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardDate: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
  },
  activeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4CAF50',
  },
  medicationsPreview: {
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  medicationPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  medicationPreviewText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  moreMedications: {
    fontSize: 12,
    color: '#1A5F7A',
    fontWeight: '600',
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  doctorText: {
    fontSize: 12,
    color: '#666',
  },
  validityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  validityText: {
    fontSize: 12,
    color: '#666',
  },
  expiredText: {
    color: '#E53935',
  },
  diagnosisBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    gap: 6,
  },
  diagnosisText: {
    fontSize: 13,
    color: '#666',
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
    maxHeight: '90%',
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
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  doctorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorDetails: {
    marginLeft: 12,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  doctorCrm: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  validityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  validityLabel: {
    fontSize: 14,
    color: '#666',
  },
  validityValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A5F7A',
  },
  medicationsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  medicationsScroll: {
    maxHeight: 300,
  },
  medicationCard: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicationIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1A5F7A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicationName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  medicationDetails: {
    gap: 6,
  },
  medicationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  medicationLabel: {
    fontSize: 13,
    color: '#666',
  },
  medicationValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  instructionsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    gap: 8,
  },
  instructionsText: {
    fontSize: 12,
    color: '#E65100',
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  downloadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A5F7A',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  downloadBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  shareBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PrescriptionsScreen;

