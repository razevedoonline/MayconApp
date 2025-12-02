import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Categorias de sintomas
const symptomCategories = [
  {
    id: 'head',
    name: 'Cabeça',
    icon: 'head',
    color: '#9C27B0',
    symptoms: [
      { id: 1, name: 'Dor de cabeça', icon: 'head-side-virus' },
      { id: 2, name: 'Tontura', icon: 'dizzy' },
      { id: 3, name: 'Enxaqueca', icon: 'brain' },
      { id: 4, name: 'Visão turva', icon: 'eye' },
    ],
  },
  {
    id: 'chest',
    name: 'Peito/Coração',
    icon: 'heart-pulse',
    color: '#E53935',
    symptoms: [
      { id: 5, name: 'Dor no peito', icon: 'heart-broken' },
      { id: 6, name: 'Palpitação', icon: 'heartbeat' },
      { id: 7, name: 'Falta de ar', icon: 'lungs' },
      { id: 8, name: 'Pressão alta', icon: 'heart' },
    ],
  },
  {
    id: 'stomach',
    name: 'Estômago/Barriga',
    icon: 'stomach',
    color: '#FF9800',
    symptoms: [
      { id: 9, name: 'Dor de barriga', icon: 'stomach' },
      { id: 10, name: 'Náusea', icon: 'face-nauseated' },
      { id: 11, name: 'Azia', icon: 'fire' },
      { id: 12, name: 'Diarreia', icon: 'toilet' },
      { id: 13, name: 'Constipação', icon: 'poop' },
    ],
  },
  {
    id: 'respiratory',
    name: 'Respiratório',
    icon: 'lungs',
    color: '#2196F3',
    symptoms: [
      { id: 14, name: 'Tosse', icon: 'head-side-cough' },
      { id: 15, name: 'Coriza', icon: 'head-side-mask' },
      { id: 16, name: 'Dor de garganta', icon: 'head-side-virus' },
      { id: 17, name: 'Febre', icon: 'thermometer' },
      { id: 18, name: 'Gripe', icon: 'virus' },
    ],
  },
  {
    id: 'body',
    name: 'Corpo/Muscular',
    icon: 'human',
    color: '#4CAF50',
    symptoms: [
      { id: 19, name: 'Dor nas costas', icon: 'user-injured' },
      { id: 20, name: 'Dor muscular', icon: 'dumbbell' },
      { id: 21, name: 'Cansaço', icon: 'bed' },
      { id: 22, name: 'Fraqueza', icon: 'battery-quarter' },
      { id: 23, name: 'Inchaço', icon: 'hand-paper' },
    ],
  },
  {
    id: 'mental',
    name: 'Mental/Emocional',
    icon: 'brain',
    color: '#673AB7',
    symptoms: [
      { id: 24, name: 'Ansiedade', icon: 'sad-tear' },
      { id: 25, name: 'Insônia', icon: 'moon' },
      { id: 26, name: 'Estresse', icon: 'brain' },
      { id: 27, name: 'Tristeza', icon: 'sad-cry' },
    ],
  },
];

// Níveis de intensidade
const intensityLevels = [
  { id: 1, label: 'Leve', color: '#4CAF50', emoji: '😊' },
  { id: 2, label: 'Moderado', color: '#FF9800', emoji: '😐' },
  { id: 3, label: 'Forte', color: '#F44336', emoji: '😣' },
  { id: 4, label: 'Muito Forte', color: '#B71C1C', emoji: '😫' },
];

// Duração dos sintomas
const durationOptions = [
  { id: 1, label: 'Agora', value: 'now' },
  { id: 2, label: 'Hoje', value: 'today' },
  { id: 3, label: '2-3 dias', value: '2-3days' },
  { id: 4, label: '1 semana', value: '1week' },
  { id: 5, label: 'Mais de 1 semana', value: 'more' },
];

// Histórico de sintomas reportados
const symptomsHistory = [
  {
    id: 1,
    date: '28/11/2025',
    time: '14:30',
    symptoms: ['Dor de cabeça', 'Tontura'],
    intensity: { label: 'Moderado', emoji: '😐', color: '#FF9800' },
    duration: 'Hoje',
    status: 'viewed', // viewed, pending, responded
    doctorResponse: 'Recomendo repouso e hidratação. Se persistir, agende uma consulta.',
  },
  {
    id: 2,
    date: '25/11/2025',
    time: '09:15',
    symptoms: ['Dor de barriga', 'Náusea'],
    intensity: { label: 'Leve', emoji: '😊', color: '#4CAF50' },
    duration: '2-3 dias',
    status: 'responded',
    doctorResponse: 'Evite alimentos gordurosos. Tome Omeprazol 20mg antes do café.',
  },
  {
    id: 3,
    date: '20/11/2025',
    time: '18:45',
    symptoms: ['Tosse', 'Dor de garganta', 'Febre'],
    intensity: { label: 'Forte', emoji: '😣', color: '#F44336' },
    duration: '2-3 dias',
    status: 'responded',
    doctorResponse: 'Quadro gripal. Receita enviada. Repouso por 3 dias.',
  },
  {
    id: 4,
    date: '15/11/2025',
    time: '10:00',
    symptoms: ['Cansaço', 'Fraqueza'],
    intensity: { label: 'Moderado', emoji: '😐', color: '#FF9800' },
    duration: '1 semana',
    status: 'responded',
    doctorResponse: 'Solicito exames de sangue. Verifique sua rotina de sono.',
  },
];

const SymptomsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('new'); // 'new' ou 'history'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [intensity, setIntensity] = useState(null);
  const [duration, setDuration] = useState(null);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const getStatusConfig = (status) => {
    const configs = {
      pending: { label: 'Aguardando', color: '#FF9800', icon: 'time-outline' },
      viewed: { label: 'Visualizado', color: '#2196F3', icon: 'eye-outline' },
      responded: { label: 'Respondido', color: '#4CAF50', icon: 'checkmark-circle-outline' },
    };
    return configs[status] || configs.pending;
  };

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => {
      const exists = prev.find(s => s.id === symptom.id);
      if (exists) {
        return prev.filter(s => s.id !== symptom.id);
      }
      return [...prev, symptom];
    });
  };

  const isSymptomSelected = (symptomId) => {
    return selectedSymptoms.some(s => s.id === symptomId);
  };

  const handleSubmit = () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert('Atenção', 'Por favor, selecione pelo menos um sintoma.');
      return;
    }
    if (!intensity) {
      Alert.alert('Atenção', 'Por favor, selecione a intensidade dos sintomas.');
      return;
    }
    if (!duration) {
      Alert.alert('Atenção', 'Por favor, informe há quanto tempo está sentindo.');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSubmit = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmModal(false);
      Alert.alert(
        '✅ Enviado com Sucesso!',
        'Suas informações foram enviadas para o Dr. Maycon Fellipe. Ele irá analisar e entrar em contato se necessário.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Limpar formulário
              setSelectedSymptoms([]);
              setIntensity(null);
              setDuration(null);
              setAdditionalNotes('');
              setSelectedCategory(null);
              navigation.goBack();
            }
          }
        ]
      );
    }, 2000);
  };

  const renderCategoryCard = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryCard,
        selectedCategory?.id === category.id && styles.categoryCardSelected,
        { borderColor: category.color },
      ]}
      onPress={() => setSelectedCategory(selectedCategory?.id === category.id ? null : category)}
      activeOpacity={0.7}
    >
      <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
        <MaterialCommunityIcons name={category.icon} size={28} color={category.color} />
      </View>
      <Text style={styles.categoryName}>{category.name}</Text>
      {category.symptoms.some(s => isSymptomSelected(s.id)) && (
        <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
          <Text style={styles.categoryBadgeText}>
            {category.symptoms.filter(s => isSymptomSelected(s.id)).length}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderSymptomItem = (symptom, category) => (
    <TouchableOpacity
      key={symptom.id}
      style={[
        styles.symptomItem,
        isSymptomSelected(symptom.id) && styles.symptomItemSelected,
        isSymptomSelected(symptom.id) && { borderColor: category.color, backgroundColor: category.color + '10' },
      ]}
      onPress={() => toggleSymptom(symptom)}
      activeOpacity={0.7}
    >
      <FontAwesome5 
        name={symptom.icon} 
        size={18} 
        color={isSymptomSelected(symptom.id) ? category.color : '#666'} 
      />
      <Text style={[
        styles.symptomName,
        isSymptomSelected(symptom.id) && { color: category.color, fontWeight: '700' }
      ]}>
        {symptom.name}
      </Text>
      {isSymptomSelected(symptom.id) && (
        <Ionicons name="checkmark-circle" size={20} color={category.color} />
      )}
    </TouchableOpacity>
  );

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
          <Text style={styles.headerTitle}>O que você sente?</Text>
          <View style={styles.placeholder} />
        </View>

        <Text style={styles.headerSubtitle}>
          Selecione seus sintomas para que o Dr. Maycon possa te ajudar melhor
        </Text>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'new' && styles.tabActive]}
          onPress={() => setActiveTab('new')}
        >
          <Ionicons 
            name="add-circle-outline" 
            size={18} 
            color={activeTab === 'new' ? '#FFFFFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'new' && styles.tabTextActive]}>
            Novo Relato
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Ionicons 
            name="time-outline" 
            size={18} 
            color={activeTab === 'history' ? '#FFFFFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
            Histórico
          </Text>
          {symptomsHistory.length > 0 && (
            <View style={[styles.tabBadge, activeTab === 'history' && styles.tabBadgeActive]}>
              <Text style={styles.tabBadgeText}>{symptomsHistory.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'history' ? (
          /* Histórico de Sintomas */
          <View>
            {symptomsHistory.length > 0 ? (
              symptomsHistory.map((item) => {
                const statusConfig = getStatusConfig(item.status);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.historyCard}
                    onPress={() => setSelectedHistory(selectedHistory?.id === item.id ? null : item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.historyHeader}>
                      <View style={styles.historyDateContainer}>
                        <Ionicons name="calendar-outline" size={16} color="#1A5F7A" />
                        <Text style={styles.historyDate}>{item.date}</Text>
                        <Text style={styles.historyTime}>{item.time}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
                        <Ionicons name={statusConfig.icon} size={14} color={statusConfig.color} />
                        <Text style={[styles.statusText, { color: statusConfig.color }]}>
                          {statusConfig.label}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.historySymptoms}>
                      {item.symptoms.map((symptom, index) => (
                        <View key={index} style={styles.historySymptomTag}>
                          <Text style={styles.historySymptomText}>{symptom}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.historyInfo}>
                      <View style={styles.historyInfoItem}>
                        <Text style={styles.historyInfoLabel}>Intensidade:</Text>
                        <Text style={[styles.historyInfoValue, { color: item.intensity.color }]}>
                          {item.intensity.emoji} {item.intensity.label}
                        </Text>
                      </View>
                      <View style={styles.historyInfoItem}>
                        <Text style={styles.historyInfoLabel}>Duração:</Text>
                        <Text style={styles.historyInfoValue}>{item.duration}</Text>
                      </View>
                    </View>

                    {selectedHistory?.id === item.id && item.doctorResponse && (
                      <View style={styles.doctorResponseBox}>
                        <View style={styles.doctorResponseHeader}>
                          <MaterialCommunityIcons name="doctor" size={18} color="#1A5F7A" />
                          <Text style={styles.doctorResponseTitle}>Resposta do Dr. Maycon:</Text>
                        </View>
                        <Text style={styles.doctorResponseText}>{item.doctorResponse}</Text>
                      </View>
                    )}

                    <View style={styles.historyFooter}>
                      <Text style={styles.expandText}>
                        {selectedHistory?.id === item.id ? 'Ver menos' : 'Ver resposta'}
                      </Text>
                      <Ionicons 
                        name={selectedHistory?.id === item.id ? 'chevron-up' : 'chevron-down'} 
                        size={16} 
                        color="#1A5F7A" 
                      />
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyHistory}>
                <Ionicons name="document-text-outline" size={60} color="#CCC" />
                <Text style={styles.emptyHistoryTitle}>Nenhum relato</Text>
                <Text style={styles.emptyHistoryText}>
                  Você ainda não enviou nenhum relato de sintomas
                </Text>
              </View>
            )}
          </View>
        ) : (
          /* Novo Relato */
          <View>
        {/* Sintomas Selecionados */}
        {selectedSymptoms.length > 0 && (
          <View style={styles.selectedContainer}>
            <Text style={styles.sectionTitle}>
              Sintomas Selecionados ({selectedSymptoms.length})
            </Text>
            <View style={styles.selectedTags}>
              {selectedSymptoms.map((symptom) => (
                <TouchableOpacity
                  key={symptom.id}
                  style={styles.selectedTag}
                  onPress={() => toggleSymptom(symptom)}
                >
                  <Text style={styles.selectedTagText}>{symptom.name}</Text>
                  <Ionicons name="close-circle" size={16} color="#666" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Categorias */}
        <Text style={styles.sectionTitle}>Onde você sente?</Text>
        <View style={styles.categoriesGrid}>
          {symptomCategories.map(renderCategoryCard)}
        </View>

        {/* Sintomas da Categoria Selecionada */}
        {selectedCategory && (
          <View style={styles.symptomsSection}>
            <Text style={styles.sectionTitle}>
              Sintomas - {selectedCategory.name}
            </Text>
            <View style={styles.symptomsList}>
              {selectedCategory.symptoms.map((symptom) => 
                renderSymptomItem(symptom, selectedCategory)
              )}
            </View>
          </View>
        )}

        {/* Intensidade */}
        {selectedSymptoms.length > 0 && (
          <View style={styles.intensitySection}>
            <Text style={styles.sectionTitle}>Qual a intensidade?</Text>
            <View style={styles.intensityOptions}>
              {intensityLevels.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.intensityOption,
                    intensity?.id === level.id && styles.intensityOptionSelected,
                    intensity?.id === level.id && { borderColor: level.color, backgroundColor: level.color + '15' },
                  ]}
                  onPress={() => setIntensity(level)}
                >
                  <Text style={styles.intensityEmoji}>{level.emoji}</Text>
                  <Text style={[
                    styles.intensityLabel,
                    intensity?.id === level.id && { color: level.color, fontWeight: '700' }
                  ]}>
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Duração */}
        {selectedSymptoms.length > 0 && (
          <View style={styles.durationSection}>
            <Text style={styles.sectionTitle}>Há quanto tempo sente isso?</Text>
            <View style={styles.durationOptions}>
              {durationOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.durationOption,
                    duration?.id === option.id && styles.durationOptionSelected,
                  ]}
                  onPress={() => setDuration(option)}
                >
                  <Text style={[
                    styles.durationLabel,
                    duration?.id === option.id && styles.durationLabelSelected,
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Observações Adicionais */}
        {selectedSymptoms.length > 0 && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Observações adicionais</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Descreva mais detalhes sobre como você está se sentindo..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={additionalNotes}
              onChangeText={setAdditionalNotes}
              textAlignVertical="top"
            />
          </View>
        )}

        {/* Aviso */}
        <View style={styles.warningBox}>
          <Ionicons name="warning" size={20} color="#FF9800" />
          <Text style={styles.warningText}>
            Em caso de emergência, procure imediatamente um pronto-socorro ou ligue para o SAMU (192).
          </Text>
        </View>

        {/* Espaço para o botão */}
        <View style={{ height: 100 }} />
          </View>
        )}
      </ScrollView>

      {/* Botão Enviar */}
      {selectedSymptoms.length > 0 && (
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#1A5F7A', '#2D8EBA']}
              style={styles.submitGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="send" size={20} color="#FFFFFF" />
              <Text style={styles.submitText}>Enviar para o Médico</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de Confirmação */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <MaterialCommunityIcons name="clipboard-check" size={40} color="#1A5F7A" />
            </View>
            
            <Text style={styles.modalTitle}>Confirmar Envio</Text>
            
            <View style={styles.modalSummary}>
              <Text style={styles.modalSummaryTitle}>Resumo:</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sintomas:</Text>
                <Text style={styles.summaryValue}>
                  {selectedSymptoms.map(s => s.name).join(', ')}
                </Text>
              </View>
              
              {intensity && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Intensidade:</Text>
                  <Text style={styles.summaryValue}>{intensity.emoji} {intensity.label}</Text>
                </View>
              )}
              
              {duration && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Duração:</Text>
                  <Text style={styles.summaryValue}>{duration.label}</Text>
                </View>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalConfirmButton, isSubmitting && styles.modalButtonDisabled]}
                onPress={confirmSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Text style={styles.modalConfirmText}>Enviando...</Text>
                ) : (
                  <>
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                    <Text style={styles.modalConfirmText}>Confirmar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    marginBottom: 12,
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
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
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
    backgroundColor: '#E53935',
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
  historyCard: {
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
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  historyTime: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  historySymptoms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  historySymptomTag: {
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  historySymptomText: {
    fontSize: 13,
    color: '#333',
  },
  historyInfo: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  historyInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyInfoLabel: {
    fontSize: 12,
    color: '#666',
  },
  historyInfoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  doctorResponseBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1A5F7A',
  },
  doctorResponseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  doctorResponseTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A5F7A',
  },
  doctorResponseText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  historyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 4,
  },
  expandText: {
    fontSize: 13,
    color: '#1A5F7A',
    fontWeight: '600',
  },
  emptyHistory: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyHistoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
  },
  emptyHistoryText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  selectedContainer: {
    marginBottom: 20,
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedTagText: {
    fontSize: 13,
    color: '#333',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryCard: {
    width: (width - 52) / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryCardSelected: {
    borderWidth: 2,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  symptomsSection: {
    marginBottom: 20,
  },
  symptomsList: {
    gap: 8,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  symptomItemSelected: {
    borderWidth: 2,
  },
  symptomName: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  intensitySection: {
    marginBottom: 20,
  },
  intensityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  intensityOption: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  intensityOptionSelected: {
    borderWidth: 2,
  },
  intensityEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  intensityLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  durationSection: {
    marginBottom: 20,
  },
  durationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationOption: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  durationOptionSelected: {
    backgroundColor: '#1A5F7A',
    borderColor: '#1A5F7A',
  },
  durationLabel: {
    fontSize: 13,
    color: '#666',
  },
  durationLabelSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  notesSection: {
    marginBottom: 20,
  },
  notesInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#333',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#E8ECF0',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    alignItems: 'flex-start',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#E65100',
    lineHeight: 18,
  },
  submitContainer: {
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
  submitButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSummary: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  modalSummaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  summaryRow: {
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#1A5F7A',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modalButtonDisabled: {
    opacity: 0.7,
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SymptomsScreen;

