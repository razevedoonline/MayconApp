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
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

// Histórico de exames numéricos para gráficos
const examHistory = {
  'Glicemia de Jejum': {
    unit: 'mg/dL',
    refMin: 70,
    refMax: 100,
    icon: 'water',
    color: '#9C27B0',
    data: [
      { date: '15/05/2025', value: 105 },
      { date: '01/08/2025', value: 98 },
      { date: '15/10/2025', value: 102 },
      { date: '01/11/2025', value: 95 },
      { date: '01/12/2025', value: 92 },
    ],
  },
  'Hemoglobina Glicada': {
    unit: '%',
    refMin: 4.0,
    refMax: 7.0,
    icon: 'water-percent',
    color: '#E91E63',
    data: [
      { date: '15/01/2025', value: 7.8 },
      { date: '15/03/2025', value: 7.5 },
      { date: '15/05/2025', value: 7.2 },
      { date: '15/08/2025', value: 6.9 },
      { date: '15/11/2025', value: 6.7 },
    ],
  },
  'Colesterol Total': {
    unit: 'mg/dL',
    refMin: 0,
    refMax: 200,
    icon: 'heart-pulse',
    color: '#F44336',
    data: [
      { date: '01/04/2025', value: 220 },
      { date: '01/06/2025', value: 210 },
      { date: '01/08/2025', value: 195 },
      { date: '01/10/2025', value: 188 },
      { date: '01/12/2025', value: 180 },
    ],
  },
  'HDL': {
    unit: 'mg/dL',
    refMin: 40,
    refMax: 60,
    icon: 'heart',
    color: '#4CAF50',
    data: [
      { date: '01/04/2025', value: 38 },
      { date: '01/06/2025', value: 42 },
      { date: '01/08/2025', value: 45 },
      { date: '01/10/2025', value: 48 },
      { date: '01/12/2025', value: 52 },
    ],
  },
  'LDL': {
    unit: 'mg/dL',
    refMin: 0,
    refMax: 100,
    icon: 'heart-outline',
    color: '#FF9800',
    data: [
      { date: '01/04/2025', value: 145 },
      { date: '01/06/2025', value: 130 },
      { date: '01/08/2025', value: 118 },
      { date: '01/10/2025', value: 105 },
      { date: '01/12/2025', value: 95 },
    ],
  },
  'Triglicerídeos': {
    unit: 'mg/dL',
    refMin: 0,
    refMax: 150,
    icon: 'water-outline',
    color: '#2196F3',
    data: [
      { date: '01/04/2025', value: 180 },
      { date: '01/06/2025', value: 165 },
      { date: '01/08/2025', value: 155 },
      { date: '01/10/2025', value: 142 },
      { date: '01/12/2025', value: 135 },
    ],
  },
  'Creatinina': {
    unit: 'mg/dL',
    refMin: 0.7,
    refMax: 1.3,
    icon: 'flask',
    color: '#795548',
    data: [
      { date: '01/06/2025', value: 1.1 },
      { date: '01/08/2025', value: 1.0 },
      { date: '01/09/2025', value: 0.95 },
      { date: '01/10/2025', value: 0.9 },
      { date: '01/11/2025', value: 0.88 },
    ],
  },
  'Hemoglobina': {
    unit: 'g/dL',
    refMin: 12.0,
    refMax: 16.0,
    icon: 'blood-bag',
    color: '#D32F2F',
    data: [
      { date: '01/05/2025', value: 13.5 },
      { date: '01/07/2025', value: 14.0 },
      { date: '01/09/2025', value: 13.8 },
      { date: '01/10/2025', value: 14.2 },
      { date: '01/12/2025', value: 14.5 },
    ],
  },
};

// Laboratórios disponíveis com preços e descontos para pacientes do Dr. Maycon
const availableLabs = {
  'Hemograma Completo': [
    { labName: 'Lab São Carlos', originalPrice: 45.00, price: 35.00, discount: 22, distance: '0.8 km', phone: '(88) 3611-1234', hasStock: true },
    { labName: 'Lab Popular', originalPrice: 35.00, price: 25.00, discount: 29, distance: '1.2 km', phone: '(88) 3611-5678', hasStock: true },
    { labName: 'Clínica São Carlos Imagem', originalPrice: 55.00, price: 45.00, discount: 18, distance: '0.5 km', phone: '(88) 3611-9999', hasStock: true },
    { labName: 'Lab Unimed', originalPrice: 65.00, price: 55.00, discount: 15, distance: '2.0 km', phone: '(88) 3611-4444', hasStock: false },
  ],
  'Glicemia de Jejum': [
    { labName: 'Lab São Carlos', originalPrice: 20.00, price: 15.00, discount: 25, distance: '0.8 km', phone: '(88) 3611-1234', hasStock: true },
    { labName: 'Lab Popular', originalPrice: 18.00, price: 12.00, discount: 33, distance: '1.2 km', phone: '(88) 3611-5678', hasStock: true },
    { labName: 'Clínica São Carlos Imagem', originalPrice: 25.00, price: 18.00, discount: 28, distance: '0.5 km', phone: '(88) 3611-9999', hasStock: true },
    { labName: 'Lab Unimed', originalPrice: 28.00, price: 22.00, discount: 21, distance: '2.0 km', phone: '(88) 3611-4444', hasStock: true },
  ],
  'Hemoglobina Glicada': [
    { labName: 'Lab São Carlos', originalPrice: 60.00, price: 45.00, discount: 25, distance: '0.8 km', phone: '(88) 3611-1234', hasStock: true },
    { labName: 'Lab Popular', originalPrice: 50.00, price: 38.00, discount: 24, distance: '1.2 km', phone: '(88) 3611-5678', hasStock: true },
    { labName: 'Clínica São Carlos Imagem', originalPrice: 70.00, price: 55.00, discount: 21, distance: '0.5 km', phone: '(88) 3611-9999', hasStock: false },
    { labName: 'Lab Unimed', originalPrice: 75.00, price: 60.00, discount: 20, distance: '2.0 km', phone: '(88) 3611-4444', hasStock: true },
  ],
  'Perfil Lipídico': [
    { labName: 'Lab São Carlos', originalPrice: 70.00, price: 55.00, discount: 21, distance: '0.8 km', phone: '(88) 3611-1234', hasStock: true },
    { labName: 'Lab Popular', originalPrice: 55.00, price: 42.00, discount: 24, distance: '1.2 km', phone: '(88) 3611-5678', hasStock: true },
    { labName: 'Clínica São Carlos Imagem', originalPrice: 85.00, price: 65.00, discount: 24, distance: '0.5 km', phone: '(88) 3611-9999', hasStock: true },
    { labName: 'Lab Unimed', originalPrice: 95.00, price: 75.00, discount: 21, distance: '2.0 km', phone: '(88) 3611-4444', hasStock: true },
  ],
  'Eletrocardiograma': [
    { labName: 'Clínica São Carlos Imagem', originalPrice: 100.00, price: 80.00, discount: 20, distance: '0.5 km', phone: '(88) 3611-9999', hasStock: true },
    { labName: 'Hospital do Coração', originalPrice: 150.00, price: 120.00, discount: 20, distance: '1.5 km', phone: '(88) 3611-7777', hasStock: true },
  ],
  'Ecocardiograma': [
    { labName: 'Clínica São Carlos Imagem', originalPrice: 320.00, price: 250.00, discount: 22, distance: '0.5 km', phone: '(88) 3611-9999', hasStock: true },
    { labName: 'Hospital do Coração', originalPrice: 400.00, price: 320.00, discount: 20, distance: '1.5 km', phone: '(88) 3611-7777', hasStock: true },
  ],
  'Creatinina': [
    { labName: 'Lab São Carlos', originalPrice: 25.00, price: 18.00, discount: 28, distance: '0.8 km', phone: '(88) 3611-1234', hasStock: true },
    { labName: 'Lab Popular', originalPrice: 20.00, price: 14.00, discount: 30, distance: '1.2 km', phone: '(88) 3611-5678', hasStock: true },
    { labName: 'Clínica São Carlos Imagem', originalPrice: 30.00, price: 22.00, discount: 27, distance: '0.5 km', phone: '(88) 3611-9999', hasStock: true },
  ],
  'Colesterol Total e Frações': [
    { labName: 'Lab São Carlos', originalPrice: 60.00, price: 45.00, discount: 25, distance: '0.8 km', phone: '(88) 3611-1234', hasStock: true },
    { labName: 'Lab Popular', originalPrice: 48.00, price: 35.00, discount: 27, distance: '1.2 km', phone: '(88) 3611-5678', hasStock: true },
    { labName: 'Clínica São Carlos Imagem', originalPrice: 70.00, price: 55.00, discount: 21, distance: '0.5 km', phone: '(88) 3611-9999', hasStock: true },
  ],
};

// Grupos de exames por consulta
const examGroups = [
  {
    id: 1,
    consultationDate: '01/12/2025',
    consultationType: 'Consulta Atual',
    doctor: 'Dr. Maycon Fellipe',
    status: 'pending', // pending, partial, completed
    exams: [
      {
        id: 101,
        name: 'Hemograma Completo',
        status: 'pending',
        requestDate: '01/12/2025',
        instructions: 'Jejum de 8 horas',
        labs: [],
      },
      {
        id: 102,
        name: 'Glicemia de Jejum',
        status: 'pending',
        requestDate: '01/12/2025',
        instructions: 'Jejum de 12 horas',
        labs: [],
      },
      {
        id: 103,
        name: 'Hemoglobina Glicada',
        status: 'pending',
        requestDate: '01/12/2025',
        instructions: 'Não necessita jejum',
        labs: [],
      },
      {
        id: 104,
        name: 'Perfil Lipídico',
        status: 'pending',
        requestDate: '01/12/2025',
        instructions: 'Jejum de 12 horas',
        labs: [],
      },
    ],
  },
  {
    id: 2,
    consultationDate: '15/10/2025',
    consultationType: 'Check-up de Rotina',
    doctor: 'Dr. Maycon Fellipe',
    status: 'completed',
    exams: [
      {
        id: 201,
        name: 'Hemograma Completo',
        status: 'completed',
        requestDate: '15/10/2025',
        resultDate: '16/10/2025',
        statusResult: 'Normal',
        labs: [
          {
            labName: 'Lab São Carlos',
            price: 35.00,
            resultDate: '16/10/2025',
            results: [
              { name: 'Hemácias', value: '4.8', unit: 'milhões/mm³', ref: '4.5 - 5.5', status: 'normal' },
              { name: 'Hemoglobina', value: '14.2', unit: 'g/dL', ref: '13.5 - 17.5', status: 'normal' },
              { name: 'Hematócrito', value: '42', unit: '%', ref: '40 - 50', status: 'normal' },
              { name: 'Leucócitos', value: '7.200', unit: '/mm³', ref: '4.500 - 11.000', status: 'normal' },
              { name: 'Plaquetas', value: '245.000', unit: '/mm³', ref: '150.000 - 400.000', status: 'normal' },
            ],
          },
        ],
      },
      {
        id: 202,
        name: 'Glicemia de Jejum',
        status: 'completed',
        requestDate: '15/10/2025',
        resultDate: '16/10/2025',
        statusResult: 'Normal',
        labs: [
          {
            labName: 'Lab São Carlos',
            price: 15.00,
            resultDate: '16/10/2025',
            results: [
              { name: 'Glicose', value: '98', unit: 'mg/dL', ref: '70 - 99', status: 'normal' },
            ],
          },
          {
            labName: 'Lab Popular',
            price: 12.00,
            resultDate: '16/10/2025',
            results: [
              { name: 'Glicose', value: '97', unit: 'mg/dL', ref: '70 - 99', status: 'normal' },
            ],
          },
        ],
      },
      {
        id: 203,
        name: 'Colesterol Total e Frações',
        status: 'completed',
        requestDate: '15/10/2025',
        resultDate: '16/10/2025',
        statusResult: 'Atenção',
        labs: [
          {
            labName: 'Lab São Carlos',
            price: 45.00,
            resultDate: '16/10/2025',
            results: [
              { name: 'Colesterol Total', value: '210', unit: 'mg/dL', ref: '< 200', status: 'attention' },
              { name: 'HDL', value: '55', unit: 'mg/dL', ref: '> 40', status: 'normal' },
              { name: 'LDL', value: '130', unit: 'mg/dL', ref: '< 130', status: 'normal' },
              { name: 'Triglicerídeos', value: '125', unit: 'mg/dL', ref: '< 150', status: 'normal' },
            ],
          },
        ],
      },
      {
        id: 204,
        name: 'Creatinina',
        status: 'completed',
        requestDate: '15/10/2025',
        resultDate: '16/10/2025',
        statusResult: 'Normal',
        labs: [
          {
            labName: 'Lab São Carlos',
            price: 18.00,
            resultDate: '16/10/2025',
            results: [
              { name: 'Creatinina', value: '0.9', unit: 'mg/dL', ref: '0.7 - 1.3', status: 'normal' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    consultationDate: '01/08/2025',
    consultationType: 'Avaliação Cardíaca',
    doctor: 'Dr. Maycon Fellipe',
    status: 'completed',
    exams: [
      {
        id: 301,
        name: 'Eletrocardiograma',
        status: 'completed',
        requestDate: '01/08/2025',
        resultDate: '01/08/2025',
        statusResult: 'Normal',
        labs: [
          {
            labName: 'Clínica São Carlos Imagem',
            price: 80.00,
            resultDate: '01/08/2025',
            results: [
              { name: 'Ritmo', value: 'Sinusal', unit: '', ref: '-', status: 'normal' },
              { name: 'Frequência', value: '72', unit: 'bpm', ref: '60 - 100', status: 'normal' },
              { name: 'Conclusão', value: 'ECG normal', unit: '', ref: '-', status: 'normal' },
            ],
          },
        ],
      },
      {
        id: 302,
        name: 'Ecocardiograma',
        status: 'completed',
        requestDate: '01/08/2025',
        resultDate: '02/08/2025',
        statusResult: 'Normal',
        labs: [
          {
            labName: 'Clínica São Carlos Imagem',
            price: 250.00,
            resultDate: '02/08/2025',
            results: [
              { name: 'Fração de Ejeção', value: '65', unit: '%', ref: '> 55', status: 'normal' },
              { name: 'Átrio Esquerdo', value: '35', unit: 'mm', ref: '< 40', status: 'normal' },
              { name: 'Conclusão', value: 'Ecocardiograma normal', unit: '', ref: '-', status: 'normal' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    consultationDate: '15/05/2025',
    consultationType: 'Acompanhamento Diabetes',
    doctor: 'Dr. Maycon Fellipe',
    status: 'completed',
    exams: [
      {
        id: 401,
        name: 'Hemoglobina Glicada',
        status: 'completed',
        requestDate: '15/05/2025',
        resultDate: '16/05/2025',
        statusResult: 'Atenção',
        labs: [
          {
            labName: 'Lab São Carlos',
            price: 35.00,
            resultDate: '16/05/2025',
            results: [
              { name: 'HbA1c', value: '7.2', unit: '%', ref: '< 7.0', status: 'attention' },
            ],
          },
        ],
      },
      {
        id: 402,
        name: 'Glicemia de Jejum',
        status: 'completed',
        requestDate: '15/05/2025',
        resultDate: '16/05/2025',
        statusResult: 'Atenção',
        labs: [
          {
            labName: 'Lab São Carlos',
            price: 15.00,
            resultDate: '16/05/2025',
            results: [
              { name: 'Glicose', value: '112', unit: 'mg/dL', ref: '70 - 99', status: 'attention' },
            ],
          },
        ],
      },
    ],
  },
];

const ExamsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('current');
  const [expandedGroup, setExpandedGroup] = useState(1);
  const [selectedExam, setSelectedExam] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);
  const [showLabsModal, setShowLabsModal] = useState(false);
  const [selectedPendingExam, setSelectedPendingExam] = useState(null);
  const [sortBy, setSortBy] = useState('price'); // 'price', 'distance'
  const [selectedGraphExam, setSelectedGraphExam] = useState(null);
  const [showGraphModal, setShowGraphModal] = useState(false);

  // Função para fechar o modal de laboratórios e limpar o estado
  const closeLabsModal = () => {
    setShowLabsModal(false);
    // Limpa o exame selecionado após um delay para evitar flickering
    setTimeout(() => {
      setSelectedPendingExam(null);
      setSortBy('price');
    }, 300);
  };

  // Função para abrir o mapa com a localização do laboratório
  const openMaps = (labName) => {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(labName + ' Sobral CE')}`;
    Linking.openURL(url);
  };

  const currentExams = examGroups.filter(g => g.status === 'pending');
  const historyExams = examGroups.filter(g => g.status === 'completed');

  const getStatusColor = (status) => {
    if (status === 'Normal' || status === 'normal' || status === 'completed') return '#4CAF50';
    if (status === 'Atenção' || status === 'attention') return '#FF9800';
    if (status === 'Alterado' || status === 'altered') return '#E53935';
    if (status === 'pending') return '#2196F3';
    return '#999';
  };

  const getGroupStatusConfig = (status) => {
    const configs = {
      pending: { label: 'Pendente', color: '#2196F3', icon: 'time-outline' },
      partial: { label: 'Parcial', color: '#FF9800', icon: 'hourglass-outline' },
      completed: { label: 'Concluído', color: '#4CAF50', icon: 'checkmark-circle-outline' },
    };
    return configs[status] || configs.pending;
  };

  const openExamResults = (exam) => {
    setSelectedExam(exam);
    setSelectedLab(exam.labs?.[0] || null);
    setShowResultModal(true);
  };

  const openLabsModal = (exam) => {
    setSelectedPendingExam(exam);
    setSortBy('price');
    setShowLabsModal(true);
  };

  const getLabsForExam = (examName) => {
    return availableLabs[examName] || [];
  };

  const getSortedLabs = (labs) => {
    return [...labs].sort((a, b) => {
      if (sortBy === 'price') {
        return a.price - b.price;
      }
      return parseFloat(a.distance) - parseFloat(b.distance);
    });
  };

  const getCheapestPrice = (examName) => {
    const labs = getLabsForExam(examName);
    if (labs.length === 0) return null;
    const available = labs.filter(l => l.hasStock);
    if (available.length === 0) return null;
    return Math.min(...available.map(l => l.price));
  };

  const toggleGroup = (groupId) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  const renderExamItem = (exam, isCurrentGroup) => {
    const hasResults = exam.labs && exam.labs.length > 0;
    const isPending = exam.status === 'pending';
    const cheapestPrice = isPending ? getCheapestPrice(exam.name) : null;
    const labsAvailable = isPending ? getLabsForExam(exam.name) : [];
    
    return (
      <TouchableOpacity
        key={exam.id}
        style={styles.examItem}
        onPress={() => {
          if (hasResults) {
            openExamResults(exam);
          } else if (isPending && labsAvailable.length > 0) {
            openLabsModal(exam);
          }
        }}
        activeOpacity={(hasResults || (isPending && labsAvailable.length > 0)) ? 0.7 : 1}
      >
        <View style={[styles.examStatusDot, { backgroundColor: getStatusColor(exam.status) }]} />
        <View style={styles.examItemContent}>
          <Text style={styles.examItemName}>{exam.name}</Text>
          {exam.status === 'pending' ? (
            <>
              <View style={styles.examPendingInfo}>
                <Ionicons name="information-circle" size={14} color="#FF9800" />
                <Text style={styles.examInstructions}>{exam.instructions}</Text>
              </View>
              {cheapestPrice !== null && (
                <View style={styles.examPriceInfo}>
                  <Text style={styles.examPriceLabel}>A partir de</Text>
                  <Text style={styles.examPriceValue}>
                    R$ {cheapestPrice.toFixed(2).replace('.', ',')}
                  </Text>
                  <Text style={styles.examLabsCount}>
                    • {labsAvailable.length} labs
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.examResultInfo}>
              <Text style={styles.examResultDate}>Resultado: {exam.resultDate}</Text>
              {exam.statusResult && (
                <View style={[styles.examResultBadge, { backgroundColor: getStatusColor(exam.statusResult) + '20' }]}>
                  <Text style={[styles.examResultText, { color: getStatusColor(exam.statusResult) }]}>
                    {exam.statusResult}
                  </Text>
                </View>
              )}
            </View>
          )}
          {hasResults && (
            <View style={styles.labsPreview}>
              <MaterialCommunityIcons name="flask" size={12} color="#666" />
              <Text style={styles.labsCount}>
                {exam.labs.length} laboratório{exam.labs.length > 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>
        {hasResults && (
          <Ionicons name="chevron-forward" size={18} color="#999" />
        )}
      </TouchableOpacity>
    );
  };

  const renderGroup = (group) => {
    const statusConfig = getGroupStatusConfig(group.status);
    const isExpanded = expandedGroup === group.id;
    const isCurrentGroup = group.status === 'pending';

    return (
      <View key={group.id} style={styles.groupCard}>
        <TouchableOpacity 
          style={styles.groupHeader}
          onPress={() => toggleGroup(group.id)}
          activeOpacity={0.7}
        >
          <View style={styles.groupHeaderLeft}>
            <View style={[styles.groupIcon, { backgroundColor: statusConfig.color + '20' }]}>
              <Ionicons name={statusConfig.icon} size={20} color={statusConfig.color} />
            </View>
            <View style={styles.groupInfo}>
              <Text style={styles.groupDate}>{group.consultationDate}</Text>
              <Text style={styles.groupType}>{group.consultationType}</Text>
              <Text style={styles.groupDoctor}>{group.doctor}</Text>
            </View>
          </View>
          <View style={styles.groupHeaderRight}>
            <View style={[styles.groupBadge, { backgroundColor: statusConfig.color + '20' }]}>
              <Text style={[styles.groupBadgeText, { color: statusConfig.color }]}>
                {group.exams.length} exames
              </Text>
            </View>
            <Ionicons 
              name={isExpanded ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#666" 
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.groupContent}>
            {isCurrentGroup && (
              <View style={styles.currentGroupActions}>
                <TouchableOpacity style={styles.scheduleLabButton}>
                  <Ionicons name="calendar-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.scheduleLabText}>Agendar no Laboratório</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.printButton}>
                  <Ionicons name="print-outline" size={18} color="#1A5F7A" />
                </TouchableOpacity>
              </View>
            )}
            {group.exams.map(exam => renderExamItem(exam, isCurrentGroup))}
          </View>
        )}
      </View>
    );
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
          <Text style={styles.headerTitle}>Meus Exames</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Resumo */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Ionicons name="time-outline" size={22} color="#FFFFFF" />
            <Text style={styles.summaryNumber}>
              {currentExams.reduce((acc, g) => acc + g.exams.length, 0)}
            </Text>
            <Text style={styles.summaryLabel}>Pendentes</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />
            <Text style={styles.summaryNumber}>
              {historyExams.reduce((acc, g) => acc + g.exams.length, 0)}
            </Text>
            <Text style={styles.summaryLabel}>Realizados</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Ionicons name="folder-outline" size={22} color="#FFFFFF" />
            <Text style={styles.summaryNumber}>{examGroups.length}</Text>
            <Text style={styles.summaryLabel}>Grupos</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'current' && styles.tabActive]}
          onPress={() => setActiveTab('current')}
        >
          <Ionicons 
            name="document-text-outline" 
            size={18} 
            color={activeTab === 'current' ? '#FFFFFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'current' && styles.tabTextActive]}>
            Atual
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
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'graphs' && styles.tabActive]}
          onPress={() => setActiveTab('graphs')}
        >
          <Ionicons 
            name="stats-chart" 
            size={18} 
            color={activeTab === 'graphs' ? '#FFFFFF' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'graphs' && styles.tabTextActive]}>
            Gráficos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Grupos */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'current' ? (
          currentExams.length > 0 ? (
            currentExams.map(renderGroup)
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="clipboard-check-outline" size={60} color="#CCC" />
              <Text style={styles.emptyTitle}>Nenhum exame pendente</Text>
              <Text style={styles.emptyText}>
                Você não possui exames pendentes no momento
              </Text>
            </View>
          )
        ) : activeTab === 'history' ? (
          historyExams.length > 0 ? (
            historyExams.map(renderGroup)
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="history" size={60} color="#CCC" />
              <Text style={styles.emptyTitle}>Nenhum histórico</Text>
              <Text style={styles.emptyText}>
                Seu histórico de exames aparecerá aqui
              </Text>
            </View>
          )
        ) : (
          /* Aba Gráficos */
          <View>
            <Text style={styles.graphsSectionTitle}>📊 Acompanhe sua Evolução</Text>
            <Text style={styles.graphsSubtitle}>
              Toque em um exame para ver o gráfico com os últimos 5 resultados
            </Text>
            
            {Object.entries(examHistory).map(([examName, examData]) => {
              const lastValue = examData.data[examData.data.length - 1].value;
              const isNormal = lastValue >= examData.refMin && lastValue <= examData.refMax;
              const trend = examData.data[examData.data.length - 1].value - examData.data[0].value;
              
              return (
                <TouchableOpacity
                  key={examName}
                  style={styles.graphExamCard}
                  onPress={() => {
                    setSelectedGraphExam({ name: examName, ...examData });
                    setShowGraphModal(true);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.graphExamHeader}>
                    <View style={[styles.graphExamIcon, { backgroundColor: examData.color + '20' }]}>
                      <MaterialCommunityIcons name={examData.icon} size={24} color={examData.color} />
                    </View>
                    <View style={styles.graphExamInfo}>
                      <Text style={styles.graphExamName}>{examName}</Text>
                      <Text style={styles.graphExamRef}>
                        Ref: {examData.refMin} - {examData.refMax} {examData.unit}
                      </Text>
                    </View>
                    <View style={styles.graphExamValue}>
                      <Text style={[styles.graphExamValueText, { color: isNormal ? '#4CAF50' : '#FF9800' }]}>
                        {lastValue}
                      </Text>
                      <Text style={styles.graphExamUnit}>{examData.unit}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.graphExamFooter}>
                    <View style={styles.graphExamTrend}>
                      <Ionicons 
                        name={trend < 0 ? 'trending-down' : trend > 0 ? 'trending-up' : 'remove'} 
                        size={16} 
                        color={trend < 0 ? '#4CAF50' : trend > 0 ? '#FF9800' : '#999'} 
                      />
                      <Text style={[
                        styles.graphExamTrendText,
                        { color: trend < 0 ? '#4CAF50' : trend > 0 ? '#FF9800' : '#999' }
                      ]}>
                        {trend > 0 ? '+' : ''}{trend.toFixed(1)} desde {examData.data[0].date}
                      </Text>
                    </View>
                    <View style={styles.graphExamAction}>
                      <Text style={styles.graphExamActionText}>Ver gráfico</Text>
                      <Ionicons name="chevron-forward" size={16} color="#1A5F7A" />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Modal de Resultados */}
      <Modal
        visible={showResultModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowResultModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowResultModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                
                {selectedExam && (
                  <>
                    <View style={styles.modalHeader}>
                      <View>
                        <Text style={styles.modalTitle}>{selectedExam.name}</Text>
                        <Text style={styles.modalSubtitle}>
                          Solicitado em {selectedExam.requestDate}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => setShowResultModal(false)}>
                        <Ionicons name="close" size={24} color="#666" />
                      </TouchableOpacity>
                    </View>

                    {/* Seletor de Laboratório */}
                    {selectedExam.labs && selectedExam.labs.length > 1 && (
                      <View style={styles.labSelector}>
                        <Text style={styles.labSelectorTitle}>Selecione o Laboratório:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          {selectedExam.labs.map((lab, index) => (
                            <TouchableOpacity
                              key={index}
                              style={[
                                styles.labOption,
                                selectedLab === lab && styles.labOptionActive,
                              ]}
                              onPress={() => setSelectedLab(lab)}
                            >
                              <Text style={[
                                styles.labOptionName,
                                selectedLab === lab && styles.labOptionNameActive,
                              ]}>
                                {lab.labName}
                              </Text>
                              <Text style={[
                                styles.labOptionPrice,
                                selectedLab === lab && styles.labOptionPriceActive,
                              ]}>
                                R$ {lab.price.toFixed(2).replace('.', ',')}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}

                    {/* Info do Laboratório */}
                    {selectedLab && (
                      <View style={styles.labInfo}>
                        <View style={styles.labInfoRow}>
                          <MaterialCommunityIcons name="flask" size={16} color="#1A5F7A" />
                          <Text style={styles.labInfoText}>{selectedLab.labName}</Text>
                        </View>
                        <View style={styles.labInfoRow}>
                          <Ionicons name="calendar-outline" size={16} color="#1A5F7A" />
                          <Text style={styles.labInfoText}>Resultado: {selectedLab.resultDate}</Text>
                        </View>
                        <View style={styles.labInfoRow}>
                          <Ionicons name="cash-outline" size={16} color="#1A5F7A" />
                          <Text style={styles.labInfoText}>
                            Valor: R$ {selectedLab.price.toFixed(2).replace('.', ',')}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Resultados */}
                    <Text style={styles.resultsTitle}>Resultados</Text>

                    <ScrollView 
                      style={styles.resultsScroll}
                      showsVerticalScrollIndicator={false}
                    >
                      {selectedLab?.results.map((result, index) => (
                        <View key={index} style={styles.resultItem}>
                          <View style={styles.resultHeader}>
                            <Text style={styles.resultName}>{result.name}</Text>
                            <View style={[
                              styles.resultStatusDot,
                              { backgroundColor: getStatusColor(result.status) }
                            ]} />
                          </View>
                          <View style={styles.resultValues}>
                            <Text style={styles.resultValue}>
                              {result.value} {result.unit}
                            </Text>
                            <Text style={styles.resultRef}>Ref: {result.ref}</Text>
                          </View>
                        </View>
                      ))}
                    </ScrollView>

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

      {/* Modal de Laboratórios */}
      <Modal
        visible={showLabsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeLabsModal}
      >
        <View style={styles.labsModalOverlay}>
          {/* Área clicável para fechar */}
          <TouchableOpacity 
            style={styles.labsModalBackdrop} 
            activeOpacity={1} 
            onPress={closeLabsModal}
          />
          
          {/* Conteúdo do Modal */}
          <View style={styles.labsModalContent}>
            <View style={styles.modalHandle} />
                
                {selectedPendingExam && (
                  <>
                    <View style={styles.modalHeader}>
                      <View>
                        <Text style={styles.modalTitle}>{selectedPendingExam.name}</Text>
                        <Text style={styles.modalSubtitle}>
                          Compare preços e escolha o laboratório
                        </Text>
                      </View>
                      <TouchableOpacity onPress={closeLabsModal}>
                        <Ionicons name="close" size={24} color="#666" />
                      </TouchableOpacity>
                    </View>

                    {/* Desconto exclusivo */}
                    <View style={styles.discountInfoCard}>
                      <MaterialCommunityIcons name="tag-heart" size={20} color="#4CAF50" />
                      <View style={styles.discountInfoContent}>
                        <Text style={styles.discountInfoTitle}>
                          Desconto exclusivo para pacientes do Dr. Maycon
                        </Text>
                        <Text style={styles.discountInfoText}>
                          Os preços abaixo já incluem o desconto especial negociado
                        </Text>
                      </View>
                    </View>

                    {/* Instruções */}
                    <View style={styles.instructionsCard}>
                      <Ionicons name="information-circle" size={18} color="#FF9800" />
                      <Text style={styles.instructionsCardText}>
                        {selectedPendingExam.instructions}
                      </Text>
                    </View>

                    {/* Ordenação */}
                    <View style={styles.sortContainer}>
                      <Text style={styles.sortLabel}>Ordenar por:</Text>
                      <TouchableOpacity
                        style={[styles.sortOption, sortBy === 'price' && styles.sortOptionActive]}
                        onPress={() => setSortBy('price')}
                      >
                        <Ionicons name="cash-outline" size={16} color={sortBy === 'price' ? '#FFFFFF' : '#666'} />
                        <Text style={[styles.sortOptionText, sortBy === 'price' && styles.sortOptionTextActive]}>
                          Preço
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.sortOption, sortBy === 'distance' && styles.sortOptionActive]}
                        onPress={() => setSortBy('distance')}
                      >
                        <Ionicons name="location-outline" size={16} color={sortBy === 'distance' ? '#FFFFFF' : '#666'} />
                        <Text style={[styles.sortOptionText, sortBy === 'distance' && styles.sortOptionTextActive]}>
                          Distância
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Lista de Laboratórios */}
                    <ScrollView 
                      key={selectedPendingExam?.id || 'labs-scroll'}
                      style={styles.labsListScroll}
                      contentContainerStyle={styles.labsListContent}
                      showsVerticalScrollIndicator={true}
                      nestedScrollEnabled={true}
                      bounces={true}
                      scrollEventThrottle={16}
                    >
                      {getSortedLabs(getLabsForExam(selectedPendingExam.name)).map((lab, index) => (
                        <View 
                          key={index} 
                          style={[
                            styles.labCard,
                            !lab.hasStock && styles.labCardDisabled,
                            index === 0 && lab.hasStock && styles.labCardBest,
                          ]}
                        >
                          {index === 0 && lab.hasStock && (
                            <View style={styles.bestPriceBadge}>
                              <Ionicons name="trophy" size={12} color="#FFFFFF" />
                              <Text style={styles.bestPriceText}>Melhor Preço</Text>
                            </View>
                          )}

                          <View style={styles.labCardHeader}>
                            <View style={styles.labCardInfo}>
                              <Text style={styles.labCardName}>{lab.labName}</Text>
                              <View style={styles.labCardDistance}>
                                <Ionicons name="location" size={14} color="#666" />
                                <Text style={styles.labCardDistanceText}>{lab.distance}</Text>
                              </View>
                            </View>
                            
                            <View style={styles.labCardPrice}>
                              {lab.originalPrice && lab.discount > 0 && (
                                <View style={styles.discountBadge}>
                                  <Text style={styles.discountText}>-{lab.discount}%</Text>
                                </View>
                              )}
                              {lab.originalPrice && (
                                <Text style={styles.originalPriceText}>
                                  R$ {lab.originalPrice.toFixed(2).replace('.', ',')}
                                </Text>
                              )}
                              <Text style={styles.labCardPriceValue}>
                                R$ {lab.price.toFixed(2).replace('.', ',')}
                              </Text>
                              {!lab.hasStock && (
                                <Text style={styles.noStockText}>Indisponível</Text>
                              )}
                            </View>
                          </View>

                          {lab.hasStock && (
                            <View style={styles.labCardActions}>
                              <TouchableOpacity 
                                style={styles.labCardActionBtn}
                                onPress={() => openMaps(lab.labName)}
                              >
                                <Ionicons name="navigate" size={18} color="#1A5F7A" />
                                <Text style={styles.labCardActionText}>Como Chegar</Text>
                              </TouchableOpacity>
                              <TouchableOpacity 
                                style={styles.labCardActionBtnSecondary}
                                onPress={() => Linking.openURL(`tel:${lab.phone.replace(/\D/g, '')}`)}
                              >
                                <Ionicons name="call-outline" size={18} color="#666" />
                                <Text style={styles.labCardActionTextSecondary}>{lab.phone}</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      ))}
                    </ScrollView>

                    {/* Legenda */}
                    <View style={styles.labsLegend}>
                      <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                        <Text style={styles.legendText}>Disponível</Text>
                      </View>
                      <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: '#E53935' }]} />
                        <Text style={styles.legendText}>Indisponível</Text>
                      </View>
                    </View>
                  </>
                )}
          </View>
        </View>
      </Modal>

      {/* Modal de Gráfico */}
      <Modal
        visible={showGraphModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGraphModal(false)}
      >
        <View style={styles.graphModalOverlay}>
          <View style={styles.graphModalContent}>
            <View style={styles.modalHandle} />
            
            {selectedGraphExam && (
              <>
                <View style={styles.graphModalHeader}>
                  <View style={styles.graphModalTitleContainer}>
                    <View style={[styles.graphModalIcon, { backgroundColor: selectedGraphExam.color + '20' }]}>
                      <MaterialCommunityIcons 
                        name={selectedGraphExam.icon} 
                        size={28} 
                        color={selectedGraphExam.color} 
                      />
                    </View>
                    <View>
                      <Text style={styles.graphModalTitle}>{selectedGraphExam.name}</Text>
                      <Text style={styles.graphModalSubtitle}>
                        Últimos 5 resultados
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setShowGraphModal(false)}>
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Valor atual */}
                <View style={styles.graphCurrentValue}>
                  <Text style={styles.graphCurrentLabel}>Último resultado</Text>
                  <View style={styles.graphCurrentValueRow}>
                    <Text style={[styles.graphCurrentNumber, { color: selectedGraphExam.color }]}>
                      {selectedGraphExam.data[selectedGraphExam.data.length - 1].value}
                    </Text>
                    <Text style={styles.graphCurrentUnit}>{selectedGraphExam.unit}</Text>
                  </View>
                  <Text style={styles.graphCurrentDate}>
                    {selectedGraphExam.data[selectedGraphExam.data.length - 1].date}
                  </Text>
                </View>

                {/* Referência */}
                <View style={styles.graphRefContainer}>
                  <View style={styles.graphRefItem}>
                    <Text style={styles.graphRefLabel}>Mínimo</Text>
                    <Text style={styles.graphRefValue}>{selectedGraphExam.refMin} {selectedGraphExam.unit}</Text>
                  </View>
                  <View style={[styles.graphRefItem, styles.graphRefItemCenter]}>
                    <Text style={styles.graphRefLabel}>Referência</Text>
                    <Text style={[styles.graphRefValue, { color: '#4CAF50' }]}>Normal</Text>
                  </View>
                  <View style={styles.graphRefItem}>
                    <Text style={styles.graphRefLabel}>Máximo</Text>
                    <Text style={styles.graphRefValue}>{selectedGraphExam.refMax} {selectedGraphExam.unit}</Text>
                  </View>
                </View>

                {/* Gráfico */}
                <View style={styles.graphChartContainer}>
                  <LineChart
                    data={{
                      labels: selectedGraphExam.data.map(d => d.date.substring(0, 5)),
                      datasets: [{
                        data: selectedGraphExam.data.map(d => d.value),
                      }],
                    }}
                    width={width - 60}
                    height={200}
                    chartConfig={{
                      backgroundColor: '#FFFFFF',
                      backgroundGradientFrom: '#FFFFFF',
                      backgroundGradientTo: '#FFFFFF',
                      decimalPlaces: 1,
                      color: (opacity = 1) => selectedGraphExam.color,
                      labelColor: (opacity = 1) => '#666',
                      style: { borderRadius: 16 },
                      propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: selectedGraphExam.color,
                      },
                      propsForBackgroundLines: {
                        strokeDasharray: '',
                        stroke: '#E8E8E8',
                      },
                    }}
                    bezier
                    style={styles.graphChart}
                    fromZero={false}
                  />
                </View>

                {/* Histórico */}
                <Text style={styles.graphHistoryTitle}>📋 Histórico de Resultados</Text>
                <ScrollView style={styles.graphHistoryList} showsVerticalScrollIndicator={false}>
                  {[...selectedGraphExam.data].reverse().map((item, index) => {
                    const isNormal = item.value >= selectedGraphExam.refMin && item.value <= selectedGraphExam.refMax;
                    return (
                      <View key={index} style={styles.graphHistoryItem}>
                        <View style={styles.graphHistoryDate}>
                          <Ionicons name="calendar-outline" size={14} color="#999" />
                          <Text style={styles.graphHistoryDateText}>{item.date}</Text>
                        </View>
                        <View style={styles.graphHistoryValue}>
                          <Text style={[
                            styles.graphHistoryValueText,
                            { color: isNormal ? '#4CAF50' : '#FF9800' }
                          ]}>
                            {item.value} {selectedGraphExam.unit}
                          </Text>
                          <View style={[
                            styles.graphHistoryStatus,
                            { backgroundColor: isNormal ? '#E8F5E9' : '#FFF3E0' }
                          ]}>
                            <Text style={[
                              styles.graphHistoryStatusText,
                              { color: isNormal ? '#4CAF50' : '#FF9800' }
                            ]}>
                              {isNormal ? 'Normal' : 'Atenção'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
              </>
            )}
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
    marginHorizontal: 16,
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
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 10,
    gap: 4,
  },
  tabActive: {
    backgroundColor: '#1A5F7A',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  groupHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  groupIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupInfo: {
    marginLeft: 12,
    flex: 1,
  },
  groupDate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  groupType: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  groupDoctor: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  groupHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  groupBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  groupBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  groupContent: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  currentGroupActions: {
    flexDirection: 'row',
    padding: 12,
    gap: 10,
    backgroundColor: '#F5F7FA',
  },
  scheduleLabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A5F7A',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  scheduleLabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  printButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  examItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  examStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  examItemContent: {
    flex: 1,
  },
  examItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  examPendingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  examInstructions: {
    fontSize: 12,
    color: '#FF9800',
  },
  examPriceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  examPriceLabel: {
    fontSize: 11,
    color: '#666',
  },
  examPriceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
  },
  examLabsCount: {
    fontSize: 11,
    color: '#999',
  },
  examResultInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  examResultDate: {
    fontSize: 12,
    color: '#666',
  },
  examResultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  examResultText: {
    fontSize: 10,
    fontWeight: '600',
  },
  labsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  labsCount: {
    fontSize: 11,
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
  labsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  labsModalBackdrop: {
    flex: 1,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  labSelector: {
    marginBottom: 16,
  },
  labSelectorTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  labOption: {
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  labOptionActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1A5F7A',
  },
  labOptionName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  labOptionNameActive: {
    color: '#1A5F7A',
  },
  labOptionPrice: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  labOptionPriceActive: {
    color: '#1A5F7A',
  },
  labInfo: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  labInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labInfoText: {
    fontSize: 14,
    color: '#333',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  resultsScroll: {
    maxHeight: 250,
  },
  resultItem: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  resultName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  resultStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  resultValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A5F7A',
  },
  resultRef: {
    fontSize: 12,
    color: '#999',
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
  // Estilos do Modal de Laboratórios
  labsModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  discountInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  discountInfoContent: {
    flex: 1,
  },
  discountInfoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 2,
  },
  discountInfoText: {
    fontSize: 11,
    color: '#4CAF50',
  },
  instructionsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
  },
  instructionsCardText: {
    flex: 1,
    fontSize: 13,
    color: '#E65100',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  sortOptionActive: {
    backgroundColor: '#1A5F7A',
  },
  sortOptionText: {
    fontSize: 13,
    color: '#666',
  },
  sortOptionTextActive: {
    color: '#FFFFFF',
  },
  labsListScroll: {
    maxHeight: 350,
  },
  labsListContent: {
    paddingBottom: 10,
    flexGrow: 1,
  },
  labCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8ECF0',
  },
  labCardDisabled: {
    opacity: 0.6,
    backgroundColor: '#FAFAFA',
  },
  labCardBest: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginTop: 14,
  },
  bestPriceBadge: {
    position: 'absolute',
    top: -12,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
    zIndex: 10,
  },
  bestPriceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  labCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  labCardInfo: {
    flex: 1,
  },
  labCardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  labCardDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  labCardDistanceText: {
    fontSize: 13,
    color: '#666',
  },
  labCardPrice: {
    alignItems: 'flex-end',
  },
  discountBadge: {
    backgroundColor: '#E53935',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 4,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  originalPriceText: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  labCardPriceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A5F7A',
  },
  noStockText: {
    fontSize: 11,
    color: '#E53935',
    marginTop: 2,
  },
  labCardActions: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 10,
  },
  labCardActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  labCardActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A5F7A',
  },
  labCardActionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  labCardActionTextSecondary: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  labsLegend: {
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
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  // Estilos da aba Gráficos
  graphsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  graphsSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 20,
    lineHeight: 18,
  },
  graphExamCard: {
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
  graphExamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  graphExamIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphExamInfo: {
    flex: 1,
    marginLeft: 12,
  },
  graphExamName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  graphExamRef: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  graphExamValue: {
    alignItems: 'flex-end',
  },
  graphExamValueText: {
    fontSize: 22,
    fontWeight: '800',
  },
  graphExamUnit: {
    fontSize: 11,
    color: '#999',
  },
  graphExamFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  graphExamTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  graphExamTrendText: {
    fontSize: 12,
  },
  graphExamAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  graphExamActionText: {
    fontSize: 13,
    color: '#1A5F7A',
    fontWeight: '600',
  },
  // Modal de Gráfico
  graphModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  graphModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  graphModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  graphModalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  graphModalIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  graphModalSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  graphCurrentValue: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  graphCurrentLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  graphCurrentValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  graphCurrentNumber: {
    fontSize: 42,
    fontWeight: '800',
  },
  graphCurrentUnit: {
    fontSize: 16,
    color: '#666',
  },
  graphCurrentDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  graphRefContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  graphRefItem: {
    flex: 1,
    alignItems: 'center',
  },
  graphRefItemCenter: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  graphRefLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  graphRefValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  graphChartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  graphChart: {
    borderRadius: 16,
  },
  graphHistoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  graphHistoryList: {
    maxHeight: 150,
  },
  graphHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  graphHistoryDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  graphHistoryDateText: {
    fontSize: 13,
    color: '#666',
  },
  graphHistoryValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  graphHistoryValueText: {
    fontSize: 15,
    fontWeight: '700',
  },
  graphHistoryStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  graphHistoryStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
});

export default ExamsScreen;

