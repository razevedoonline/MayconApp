import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  ScrollView,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

const { width, height } = Dimensions.get('window');

// Foto local do Dr. Maycon Fellipe
const doctorPhoto = require('../../assets/doctor.png');

// Foto do paciente
const patientPhoto = require('../../assets/maria.png');

// Dados históricos de saúde (últimas 9 coletas)
const healthHistoryData = {
  pressao: {
    labels: ['01/11', '05/11', '10/11', '15/11', '20/11', '25/11', '28/11', '30/11', '01/12'],
    sistolica: [13, 12.5, 13, 12, 12.5, 12, 12, 12.5, 12],
    diastolica: [8.5, 8, 8.5, 8, 8, 7.5, 8, 8, 8],
    valores: ['13/8.5', '12.5/8', '13/8.5', '12/8', '12.5/8', '12/7.5', '12/8', '12.5/8', '12/8'],
  },
  glicose: {
    labels: ['01/11', '05/11', '10/11', '15/11', '20/11', '25/11', '28/11', '30/11', '01/12'],
    valores: [105, 98, 102, 95, 100, 92, 96, 99, 98],
  },
  peso: {
    labels: ['01/11', '05/11', '10/11', '15/11', '20/11', '25/11', '28/11', '30/11', '01/12'],
    valores: [70, 69.5, 69.2, 69, 68.8, 68.5, 68.3, 68.1, 68],
  },
};

// Dados das notificações
const notificationsData = [
  {
    id: 1,
    type: 'medication',
    title: '💊 Hora do Medicamento',
    message: 'Losartana 50mg - 1 comprimido',
    scheduleTime: '08:00',
    time: 'Hoje',
    icon: 'pill',
    color: '#E53935',
    bgColor: '#FFEBEE',
    isNew: true,
  },
  {
    id: 2,
    type: 'medication',
    title: '💊 Hora do Medicamento',
    message: 'Metformina 500mg - 1 comprimido após refeição',
    scheduleTime: '12:30',
    time: 'Hoje',
    icon: 'pill',
    color: '#FF9800',
    bgColor: '#FFF3E0',
    isNew: true,
  },
  {
    id: 3,
    type: 'medication',
    title: '💊 Hora do Medicamento',
    message: 'Omeprazol 20mg - 1 cápsula em jejum',
    scheduleTime: '07:00',
    time: 'Hoje',
    icon: 'pill',
    color: '#9C27B0',
    bgColor: '#F3E5F5',
    isNew: true,
  },
  {
    id: 4,
    type: 'medication',
    title: '💊 Hora do Medicamento',
    message: 'Losartana 50mg - 1 comprimido',
    scheduleTime: '20:00',
    time: 'Hoje',
    icon: 'pill',
    color: '#E53935',
    bgColor: '#FFEBEE',
    isNew: false,
  },
  {
    id: 5,
    type: 'appointment',
    title: '📅 Consulta Agendada',
    message: 'Sua consulta com Dr. Maycon Fellipe está confirmada',
    scheduleTime: '14:30',
    scheduleDate: '15/12/2025',
    time: 'Ontem',
    icon: 'calendar-check',
    color: '#4CAF50',
    bgColor: '#E8F5E9',
    isNew: false,
  },
  {
    id: 6,
    type: 'exam',
    title: '🧪 Resultado Disponível',
    message: 'O resultado do seu exame de sangue já está disponível para visualização',
    time: '2 dias atrás',
    icon: 'test-tube',
    color: '#2196F3',
    bgColor: '#E3F2FD',
    isNew: false,
  },
  {
    id: 7,
    type: 'message',
    title: '💬 Mensagem da Clínica',
    message: 'Lembre-se de trazer seus exames anteriores na próxima consulta',
    time: '3 dias atrás',
    icon: 'message-text',
    color: '#00BCD4',
    bgColor: '#E0F7FA',
    isNew: false,
  },
];

const HomeScreen = ({ navigation }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  const [showHealthChart, setShowHealthChart] = useState(false);
  const [selectedHealthType, setSelectedHealthType] = useState(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;
  const chartModalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const openHealthChart = (type) => {
    setSelectedHealthType(type);
    setShowHealthChart(true);
    Animated.spring(chartModalAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const closeHealthChart = () => {
    Animated.timing(chartModalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowHealthChart(false);
      setSelectedHealthType(null);
    });
  };

  const getChartConfig = (type) => {
    const colors = {
      pressao: '#E53935',
      glicose: '#2196F3',
      peso: '#4CAF50',
    };
    return {
      backgroundColor: '#FFFFFF',
      backgroundGradientFrom: '#FFFFFF',
      backgroundGradientTo: '#FFFFFF',
      decimalPlaces: type === 'peso' ? 1 : 0,
      color: (opacity = 1) => colors[type] || '#1A5F7A',
      labelColor: (opacity = 1) => '#666',
      style: { borderRadius: 16 },
      propsForDots: {
        r: '5',
        strokeWidth: '2',
        stroke: colors[type],
      },
    };
  };

  const getHealthTitle = (type) => {
    const titles = {
      pressao: '❤️ Histórico de Pressão Arterial',
      glicose: '💧 Histórico de Glicose',
      peso: '⚖️ Histórico de Peso',
    };
    return titles[type] || '';
  };

  const getHealthUnit = (type) => {
    const units = {
      pressao: 'mmHg',
      glicose: 'mg/dL',
      peso: 'kg',
    };
    return units[type] || '';
  };

  const menuItems = [
    {
      id: 1,
      title: 'Agendar Consulta',
      subtitle: 'Marque sua próxima consulta',
      icon: 'calendar-plus',
      iconType: 'MaterialCommunityIcons',
      color: '#4CAF50',
      bgColor: '#E8F5E9',
    },
    {
      id: 2,
      title: 'Minhas Consultas',
      subtitle: 'Veja seus agendamentos',
      icon: 'calendar-check',
      iconType: 'MaterialCommunityIcons',
      color: '#2196F3',
      bgColor: '#E3F2FD',
    },
    {
      id: 3,
      title: 'Prontuário',
      subtitle: 'Histórico médico',
      icon: 'file-document',
      iconType: 'MaterialCommunityIcons',
      color: '#9C27B0',
      bgColor: '#F3E5F5',
    },
    {
      id: 4,
      title: 'Exames',
      subtitle: 'Resultados e pedidos',
      icon: 'test-tube',
      iconType: 'MaterialCommunityIcons',
      color: '#FF9800',
      bgColor: '#FFF3E0',
    },
    {
      id: 5,
      title: 'Receitas',
      subtitle: 'Prescrições médicas',
      icon: 'prescription',
      iconType: 'MaterialCommunityIcons',
      color: '#E91E63',
      bgColor: '#FCE4EC',
    },
    {
      id: 6,
      title: 'Farmácia',
      subtitle: 'Medicamentos e pedidos',
      icon: 'pill',
      iconType: 'MaterialCommunityIcons',
      color: '#00897B',
      bgColor: '#E0F2F1',
    },
    {
      id: 7,
      title: 'O que Sinto',
      subtitle: 'Registre seus sintomas',
      icon: 'emoticon-sick-outline',
      iconType: 'MaterialCommunityIcons',
      color: '#F44336',
      bgColor: '#FFEBEE',
    },
    {
      id: 8,
      title: 'Saúde',
      subtitle: 'Dicas e conteúdos',
      icon: 'book-heart',
      iconType: 'MaterialCommunityIcons',
      color: '#7B1FA2',
      bgColor: '#F3E5F5',
    },
    {
      id: 9,
      title: 'Chat',
      subtitle: 'Fale com a clínica',
      icon: 'chatbubbles',
      iconType: 'Ionicons',
      color: '#00BCD4',
      bgColor: '#E0F7FA',
    },
  ];

  const renderIcon = (item) => {
    if (item.iconType === 'Ionicons') {
      return <Ionicons name={item.icon} size={28} color={item.color} />;
    }
    return <MaterialCommunityIcons name={item.icon} size={28} color={item.color} />;
  };

  const openNotifications = () => {
    setShowNotifications(true);
    Animated.spring(modalAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const closeNotifications = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowNotifications(false);
    });
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isNew: false } : notif
      )
    );
  };

  const getNewNotificationsCount = () => {
    return notifications.filter(n => n.isNew).length;
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header com gradiente */}
      <LinearGradient
        colors={['#0F4C75', '#1A5F7A', '#2D8EBA', '#57C5B6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Círculos decorativos */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        <View style={styles.headerContent}>
          <Animated.View 
            style={[
              styles.userInfo,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Image source={doctorPhoto} style={styles.doctorMiniPhoto} />
            <View style={styles.welcomeText}>
              <Text style={styles.greeting}>Olá, Paciente!</Text>
              <Text style={styles.doctorInfo}>Dr. Maycon Fellipe</Text>
            </View>
          </Animated.View>
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={openNotifications}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
            {getNewNotificationsCount() > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>{getNewNotificationsCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Card de próxima consulta */}
        <Animated.View 
          style={[
            styles.nextAppointmentCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.appointmentHeader}>
            <MaterialCommunityIcons name="calendar-clock" size={24} color="#1A5F7A" />
            <Text style={styles.appointmentLabel}>Próxima Consulta</Text>
          </View>
          <Text style={styles.appointmentDate}>15 de Dezembro, 2025</Text>
          <Text style={styles.appointmentTime}>14:30 - Consulta de Rotina</Text>
          <View style={styles.appointmentLocation}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.locationText}>Clínica São Carlos Imagem - Sobral</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Conteúdo principal */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Perfil do Paciente */}
        <Animated.View 
          style={[
            styles.patientCard,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.patientCardHeader}>
            <Text style={styles.sectionTitle}>Meu Perfil</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProfile')}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil" size={16} color="#1A5F7A" />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.patientCardContent}>
            <View style={styles.patientAvatarContainer}>
              <Image source={patientPhoto} style={styles.patientAvatar} />
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Ativo</Text>
              </View>
            </View>
            
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>Maria</Text>
              <Text style={styles.patientEmail}>maycon@online</Text>
              
              <View style={styles.patientDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={14} color="#666" />
                  <Text style={styles.detailText}>Paciente desde: Dez/2025</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text style={styles.detailText}>Sobral, CE</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Informações de saúde rápidas */}
          <View style={styles.healthInfoContainer}>
            <TouchableOpacity 
              style={styles.healthInfoItem}
              onPress={() => openHealthChart('pressao')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="heart-pulse" size={20} color="#E53935" />
              <Text style={styles.healthInfoValue}>12/8</Text>
              <Text style={styles.healthInfoLabel}>Pressão</Text>
              <Ionicons name="chevron-forward" size={12} color="#999" style={styles.healthChevron} />
            </TouchableOpacity>
            <View style={styles.healthInfoDivider} />
            <TouchableOpacity 
              style={styles.healthInfoItem}
              onPress={() => openHealthChart('glicose')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="water" size={20} color="#2196F3" />
              <Text style={styles.healthInfoValue}>98</Text>
              <Text style={styles.healthInfoLabel}>Glicose</Text>
              <Ionicons name="chevron-forward" size={12} color="#999" style={styles.healthChevron} />
            </TouchableOpacity>
            <View style={styles.healthInfoDivider} />
            <TouchableOpacity 
              style={styles.healthInfoItem}
              onPress={() => openHealthChart('peso')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="scale-bathroom" size={20} color="#4CAF50" />
              <Text style={styles.healthInfoValue}>68kg</Text>
              <Text style={styles.healthInfoLabel}>Peso</Text>
              <Ionicons name="chevron-forward" size={12} color="#999" style={styles.healthChevron} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Acesso rápido */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.sectionTitle}>Acesso Rápido</Text>
          
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <Animated.View
                key={item.id}
                style={[
                  styles.menuItemWrapper,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 30],
                        outputRange: [0, 30 + (index * 5)],
                      })
                    }]
                  }
                ]}
              >
                <TouchableOpacity 
                  style={styles.menuItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (item.title === 'Agendar Consulta') {
                      navigation.navigate('Schedule');
                    } else if (item.title === 'Minhas Consultas') {
                      navigation.navigate('MyAppointments');
                    } else if (item.title === 'Prontuário') {
                      navigation.navigate('MedicalRecords');
                    } else if (item.title === 'Exames') {
                      navigation.navigate('Exams');
                    } else if (item.title === 'Receitas') {
                      navigation.navigate('Prescriptions');
                    } else if (item.title === 'Farmácia') {
                      navigation.navigate('Pharmacy');
                    } else if (item.title === 'O que Sinto') {
                      navigation.navigate('Symptoms');
                    } else if (item.title === 'Saúde') {
                      navigation.navigate('Health');
                    } else if (item.title === 'Chat') {
                      navigation.navigate('Chat');
                    } else {
                      Alert.alert(item.title, `Funcionalidade "${item.title}" em desenvolvimento.`);
                    }
                  }}
                >
                  <View style={[styles.menuIconContainer, { backgroundColor: item.bgColor }]}>
                    {renderIcon(item)}
                  </View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Informações do médico */}
        <Animated.View 
          style={[
            styles.doctorCard,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.sectionTitle}>Seu Médico</Text>
          <View style={styles.doctorCardContent}>
            <Image source={doctorPhoto} style={styles.doctorCardPhoto} />
            <View style={styles.doctorCardInfo}>
              <Text style={styles.doctorCardName}>Dr. Maycon Fellipe</Text>
              <Text style={styles.doctorCardSpecialty}>Médico Clínico e Internista</Text>
              <Text style={styles.doctorCardCRM}>CRM/CE 15972</Text>
              <View style={styles.doctorCardContact}>
                <TouchableOpacity style={styles.contactIconButton}>
                  <Ionicons name="call" size={18} color="#1A5F7A" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactIconButton}>
                  <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Botão de logout */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="#E53935" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Notificações */}
      <Modal
        visible={showNotifications}
        transparent={true}
        animationType="none"
        onRequestClose={closeNotifications}
      >
        <TouchableWithoutFeedback onPress={closeNotifications}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View 
                style={[
                  styles.notificationModal,
                  {
                    opacity: modalAnim,
                    transform: [{
                      translateY: modalAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-50, 0],
                      })
                    }]
                  }
                ]}
              >
                {/* Header do Modal */}
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <Ionicons name="notifications" size={24} color="#1A5F7A" />
                    <Text style={styles.modalTitle}>Notificações</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={closeNotifications}
                  >
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Lista de Notificações */}
                <ScrollView 
                  style={styles.notificationsList}
                  showsVerticalScrollIndicator={false}
                >
                  {notifications.map((notif) => (
                    <TouchableOpacity
                      key={notif.id}
                      style={[
                        styles.notificationItem,
                        notif.isNew && styles.notificationItemNew
                      ]}
                      onPress={() => markAsRead(notif.id)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.notificationIconContainer, { backgroundColor: notif.bgColor }]}>
                        <MaterialCommunityIcons name={notif.icon} size={22} color={notif.color} />
                      </View>
                      <View style={styles.notificationContent}>
                        <View style={styles.notificationHeader}>
                          <Text style={styles.notificationTitle}>{notif.title}</Text>
                          {notif.isNew && <View style={styles.newDot} />}
                        </View>
                        <Text style={styles.notificationMessage}>{notif.message}</Text>
                        
                        {/* Horário do medicamento/consulta destacado */}
                        {notif.scheduleTime && (
                          <View style={styles.scheduleContainer}>
                            <Ionicons name="time" size={14} color={notif.color} />
                            <Text style={[styles.scheduleTime, { color: notif.color }]}>
                              {notif.scheduleTime}
                            </Text>
                            {notif.scheduleDate && (
                              <Text style={styles.scheduleDate}>• {notif.scheduleDate}</Text>
                            )}
                          </View>
                        )}
                        
                        <Text style={styles.notificationTime}>{notif.time}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Footer do Modal */}
                <TouchableOpacity style={styles.markAllReadButton}>
                  <Ionicons name="checkmark-done" size={18} color="#1A5F7A" />
                  <Text style={styles.markAllReadText}>Marcar todas como lidas</Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal de Gráfico de Saúde */}
      <Modal
        visible={showHealthChart}
        transparent={true}
        animationType="none"
        onRequestClose={closeHealthChart}
      >
        <TouchableWithoutFeedback onPress={closeHealthChart}>
          <View style={styles.chartModalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View 
                style={[
                  styles.chartModal,
                  {
                    opacity: chartModalAnim,
                    transform: [{
                      scale: chartModalAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      })
                    }]
                  }
                ]}
              >
                {/* Header do Modal */}
                <View style={styles.chartModalHeader}>
                  <Text style={styles.chartModalTitle}>
                    {getHealthTitle(selectedHealthType)}
                  </Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={closeHealthChart}
                  >
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Valor Atual */}
                <View style={styles.currentValueContainer}>
                  <Text style={styles.currentValueLabel}>Última medição</Text>
                  <Text style={[
                    styles.currentValue,
                    { color: selectedHealthType === 'pressao' ? '#E53935' : 
                             selectedHealthType === 'glicose' ? '#2196F3' : '#4CAF50' }
                  ]}>
                    {selectedHealthType === 'pressao' ? '12/8' : 
                     selectedHealthType === 'glicose' ? '98' : '68'}
                    <Text style={styles.currentValueUnit}> {getHealthUnit(selectedHealthType)}</Text>
                  </Text>
                  <Text style={styles.currentValueDate}>01/12/2025</Text>
                </View>

                {/* Gráfico */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {selectedHealthType && (
                    <LineChart
                      data={{
                        labels: healthHistoryData[selectedHealthType]?.labels || [],
                        datasets: [{
                          data: selectedHealthType === 'pressao' 
                            ? healthHistoryData.pressao.sistolica
                            : healthHistoryData[selectedHealthType]?.valores || [0],
                        }],
                      }}
                      width={width - 40}
                      height={200}
                      chartConfig={getChartConfig(selectedHealthType)}
                      bezier
                      style={styles.chart}
                      fromZero={false}
                    />
                  )}
                </ScrollView>

                {/* Lista de Histórico */}
                <Text style={styles.historyTitle}>📋 Histórico de Medições</Text>
                <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
                  {selectedHealthType && healthHistoryData[selectedHealthType]?.labels.map((date, index) => (
                    <View key={index} style={styles.historyItem}>
                      <Text style={styles.historyDate}>{date}/2024</Text>
                      <Text style={[
                        styles.historyValue,
                        { color: selectedHealthType === 'pressao' ? '#E53935' : 
                                 selectedHealthType === 'glicose' ? '#2196F3' : '#4CAF50' }
                      ]}>
                        {selectedHealthType === 'pressao' 
                          ? healthHistoryData.pressao.valores[index]
                          : healthHistoryData[selectedHealthType]?.valores[index]}
                        {' '}{getHealthUnit(selectedHealthType)}
                      </Text>
                    </View>
                  )).reverse()}
                </ScrollView>
              </Animated.View>
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
    paddingHorizontal: 20,
    paddingBottom: 80,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: -50,
    right: -50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: 20,
    left: -40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorMiniPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  welcomeText: {
    marginLeft: 12,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  doctorInfo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  nextAppointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  appointmentLabel: {
    fontSize: 14,
    color: '#1A5F7A',
    fontWeight: '600',
    marginLeft: 8,
  },
  appointmentDate: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 15,
    color: '#666',
    marginBottom: 12,
  },
  appointmentLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    marginTop: 10,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItemWrapper: {
    width: (width - 52) / 2,
    marginBottom: 12,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  patientCard: {
    marginTop: 10,
  },
  patientCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  editButtonText: {
    fontSize: 13,
    color: '#1A5F7A',
    fontWeight: '600',
  },
  patientCardContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  patientAvatarContainer: {
    alignItems: 'center',
  },
  patientAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#1A5F7A',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
  },
  patientInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  patientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  patientEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  patientDetails: {
    marginTop: 10,
    gap: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  healthInfoContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  healthInfoItem: {
    alignItems: 'center',
    flex: 1,
  },
  healthInfoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 6,
  },
  healthInfoLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  healthInfoDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E8ECF0',
  },
  doctorCard: {
    marginTop: 10,
  },
  doctorCardContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  doctorCardPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#E8ECF0',
  },
  doctorCardInfo: {
    marginLeft: 16,
    flex: 1,
  },
  doctorCardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  doctorCardSpecialty: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  doctorCardCRM: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  doctorCardContact: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  contactIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E53935',
  },
  // Estilos do Modal de Notificações
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  notificationModal: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 20,
    maxHeight: height * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsList: {
    maxHeight: height * 0.5,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  notificationItemNew: {
    backgroundColor: '#F8FCFF',
  },
  notificationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  newDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53935',
  },
  notificationMessage: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    lineHeight: 18,
  },
  scheduleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '700',
  },
  scheduleDate: {
    fontSize: 12,
    color: '#666',
  },
  notificationTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
  },
  markAllReadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 8,
  },
  markAllReadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A5F7A',
  },
  // Estilos do Modal de Gráfico de Saúde
  healthChevron: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  chartModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  chartModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxHeight: height * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  chartModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  chartModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  currentValueContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  currentValueLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  currentValue: {
    fontSize: 36,
    fontWeight: '800',
  },
  currentValueUnit: {
    fontSize: 16,
    fontWeight: '400',
  },
  currentValueDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  chart: {
    marginVertical: 16,
    borderRadius: 16,
    marginHorizontal: 10,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  historyList: {
    maxHeight: 150,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
  },
  historyValue: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default HomeScreen;

