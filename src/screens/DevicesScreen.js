import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Switch,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const DevicesScreen = ({ navigation }) => {
  const [connectedDevices, setConnectedDevices] = useState({});
  const [isScanning, setIsScanning] = useState(false);

  // Lista de dispositivos disponíveis
  const devices = [
    {
      id: 'scale',
      name: 'Balança Inteligente',
      icon: 'scale-bathroom',
      iconType: 'MaterialCommunityIcons',
      color: '#4CAF50',
      bgColor: '#E8F5E9',
      info: ['Peso', 'IMC', 'Gordura Corporal', 'Massa Muscular'],
      description: 'Análise de Impedância Bioelétrica (BIA)',
    },
    {
      id: 'bloodpressure',
      name: 'Monitor de Pressão',
      icon: 'heart-pulse',
      iconType: 'MaterialCommunityIcons',
      color: '#E53935',
      bgColor: '#FFEBEE',
      info: ['Pressão Sistólica', 'Pressão Diastólica', 'Frequência Cardíaca'],
      description: 'Esfigmomanômetro Eletrônico',
    },
    {
      id: 'thermometer',
      name: 'Termômetro Inteligente',
      icon: 'thermometer',
      iconType: 'MaterialCommunityIcons',
      color: '#FF9800',
      bgColor: '#FFF3E0',
      info: ['Temperatura Corporal'],
      description: 'Medição oral, axilar ou de testa',
    },
    {
      id: 'oximeter',
      name: 'Oxímetro de Pulso',
      icon: 'pulse',
      iconType: 'MaterialCommunityIcons',
      color: '#2196F3',
      bgColor: '#E3F2FD',
      info: ['Saturação de Oxigênio (SpO2)', 'Frequência de Pulso'],
      description: 'Oxímetro de dedo',
    },
    {
      id: 'glucose',
      name: 'Glicosímetro',
      icon: 'water',
      iconType: 'MaterialCommunityIcons',
      color: '#9C27B0',
      bgColor: '#F3E5F5',
      info: ['Nível de Glicose no Sangue'],
      description: 'Monitoramento de glicemia',
    },
    {
      id: 'smartwatch',
      name: 'Smartwatch / Fitness',
      icon: 'watch',
      iconType: 'Ionicons',
      color: '#00BCD4',
      bgColor: '#E0F7FA',
      info: ['Passos', 'Distância', 'Calorias', 'Sono', 'Frequência Cardíaca'],
      description: 'Rastreamento de atividades',
    },
    {
      id: 'airquality',
      name: 'Sensor de Qualidade do Ar',
      icon: 'weather-windy',
      iconType: 'MaterialCommunityIcons',
      color: '#607D8B',
      bgColor: '#ECEFF1',
      info: ['PM2.5', 'PM10', 'CO2', 'Umidade', 'Temperatura'],
      description: 'Para pacientes respiratórios',
    },
    {
      id: 'light',
      name: 'Sensor de Iluminação',
      icon: 'lightbulb-on',
      iconType: 'MaterialCommunityIcons',
      color: '#FFC107',
      bgColor: '#FFF8E1',
      info: ['Nível de Luz', 'Tipo de Iluminação'],
      description: 'Ciclo circadiano e sono',
    },
    {
      id: 'urine',
      name: 'Analisador de Urina',
      icon: 'test-tube',
      iconType: 'MaterialCommunityIcons',
      color: '#795548',
      bgColor: '#EFEBE9',
      info: ['Parâmetros Bioquímicos da Urina'],
      description: 'Análise portátil',
    },
  ];

  const handleConnect = (device) => {
    if (connectedDevices[device.id]) {
      // Desconectar
      Alert.alert(
        'Desconectar Dispositivo',
        `Deseja desconectar ${device.name}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Desconectar',
            style: 'destructive',
            onPress: () => {
              setConnectedDevices(prev => ({ ...prev, [device.id]: false }));
              Alert.alert('Desconectado', `${device.name} foi desconectado.`);
            }
          },
        ]
      );
    } else {
      // Conectar
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        Alert.alert(
          '🔍 Procurando Dispositivo',
          `Buscando ${device.name}...\n\nCertifique-se de que o dispositivo está:\n• Ligado\n• Com Bluetooth ativado\n• Próximo ao celular`,
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Simular Conexão',
              onPress: () => {
                setConnectedDevices(prev => ({ ...prev, [device.id]: true }));
                Alert.alert(
                  '✅ Conectado!',
                  `${device.name} conectado com sucesso!\n\nOs dados serão sincronizados automaticamente.`
                );
              }
            },
          ]
        );
      }, 1500);
    }
  };

  const handleScanAll = () => {
    setIsScanning(true);
    Alert.alert(
      '🔍 Buscando Dispositivos',
      'Procurando dispositivos Bluetooth próximos...\n\nCertifique-se de que:\n• Bluetooth está ativado\n• Dispositivos estão ligados',
      [{ text: 'OK', onPress: () => setIsScanning(false) }]
    );
  };

  const renderIcon = (device) => {
    if (device.iconType === 'Ionicons') {
      return <Ionicons name={device.icon} size={32} color={device.color} />;
    } else if (device.iconType === 'FontAwesome5') {
      return <FontAwesome5 name={device.icon} size={28} color={device.color} />;
    }
    return <MaterialCommunityIcons name={device.icon} size={32} color={device.color} />;
  };

  const connectedCount = Object.values(connectedDevices).filter(Boolean).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <LinearGradient
        colors={['#0288D1', '#03A9F4', '#4FC3F7']}
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
          <Text style={styles.headerTitle}>Dispositivos</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Ícone principal */}
        <View style={styles.headerIconContainer}>
          <View style={styles.headerIconBg}>
            <Ionicons name="bluetooth" size={50} color="#0288D1" />
          </View>
          <Text style={styles.headerSubtitle}>Equipamentos de Saúde</Text>
          <Text style={styles.headerDescription}>
            Conecte seus dispositivos para{'\n'}monitoramento automático
          </Text>
        </View>

        {/* Status de conexão */}
        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <Text style={styles.statusNumber}>{connectedCount}</Text>
            <Text style={styles.statusLabel}>Conectados</Text>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.statusItem}>
            <Text style={styles.statusNumber}>{devices.length}</Text>
            <Text style={styles.statusLabel}>Disponíveis</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Botão de busca */}
        <TouchableOpacity
          style={styles.scanButton}
          onPress={handleScanAll}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#0288D1', '#03A9F4']}
            style={styles.scanButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="search" size={24} color="#FFFFFF" />
            <Text style={styles.scanButtonText}>Buscar Dispositivos Próximos</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Info card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#0288D1" />
          <Text style={styles.infoText}>
            Conecte seus dispositivos via Bluetooth para sincronizar dados automaticamente com seu prontuário.
          </Text>
        </View>

        {/* Lista de dispositivos */}
        <Text style={styles.sectionTitle}>📱 Dispositivos Compatíveis</Text>

        {devices.map((device) => (
          <TouchableOpacity
            key={device.id}
            style={[
              styles.deviceCard,
              connectedDevices[device.id] && styles.deviceCardConnected
            ]}
            onPress={() => handleConnect(device)}
            activeOpacity={0.8}
          >
            <View style={styles.deviceHeader}>
              <View style={[styles.deviceIcon, { backgroundColor: device.bgColor }]}>
                {renderIcon(device)}
              </View>
              <View style={styles.deviceInfo}>
                <View style={styles.deviceNameRow}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  {connectedDevices[device.id] && (
                    <View style={styles.connectedBadge}>
                      <View style={styles.connectedDot} />
                      <Text style={styles.connectedText}>Conectado</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.deviceDescription}>{device.description}</Text>
              </View>
            </View>

            <View style={styles.deviceData}>
              <Text style={styles.deviceDataTitle}>Dados coletados:</Text>
              <View style={styles.deviceDataTags}>
                {device.info.map((info, index) => (
                  <View key={index} style={[styles.dataTag, { backgroundColor: device.bgColor }]}>
                    <Text style={[styles.dataTagText, { color: device.color }]}>{info}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.deviceAction}>
              <Text style={[
                styles.deviceActionText,
                { color: connectedDevices[device.id] ? '#E53935' : '#0288D1' }
              ]}>
                {connectedDevices[device.id] ? 'Toque para desconectar' : 'Toque para conectar'}
              </Text>
              <Ionicons 
                name={connectedDevices[device.id] ? 'close-circle' : 'add-circle'} 
                size={24} 
                color={connectedDevices[device.id] ? '#E53935' : '#0288D1'} 
              />
            </View>
          </TouchableOpacity>
        ))}

        {/* Dicas */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Dicas</Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
            <Text style={styles.tipText}>Mantenha o Bluetooth ativado</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
            <Text style={styles.tipText}>Deixe os dispositivos próximos ao celular</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
            <Text style={styles.tipText}>Verifique se as baterias estão carregadas</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
            <Text style={styles.tipText}>Dados são sincronizados automaticamente</Text>
          </View>
        </View>

        {/* Benefícios */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>🎯 Benefícios da Integração</Text>
          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: '#E8F5E9' }]}>
              <MaterialCommunityIcons name="sync" size={20} color="#4CAF50" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitName}>Sincronização Automática</Text>
              <Text style={styles.benefitDescription}>Dados enviados em tempo real</Text>
            </View>
          </View>
          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: '#E3F2FD' }]}>
              <MaterialCommunityIcons name="chart-line" size={20} color="#2196F3" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitName}>Histórico Completo</Text>
              <Text style={styles.benefitDescription}>Acompanhe sua evolução</Text>
            </View>
          </View>
          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: '#FFF3E0' }]}>
              <MaterialCommunityIcons name="bell-ring" size={20} color="#FF9800" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitName}>Alertas Inteligentes</Text>
              <Text style={styles.benefitDescription}>Notificações de valores alterados</Text>
            </View>
          </View>
          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: '#FCE4EC' }]}>
              <MaterialCommunityIcons name="doctor" size={20} color="#E91E63" />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitName}>Médico Informado</Text>
              <Text style={styles.benefitDescription}>Dr. Maycon acompanha seus dados</Text>
            </View>
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
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 40,
    borderRadius: 16,
    paddingVertical: 12,
  },
  statusItem: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  statusNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statusLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statusDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  scanButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#0288D1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  scanButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E1F5FE',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#01579B',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  deviceCard: {
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
  deviceCardConnected: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceInfo: {
    flex: 1,
    marginLeft: 14,
  },
  deviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  connectedText: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
  },
  deviceDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  deviceData: {
    marginBottom: 12,
  },
  deviceDataTitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  deviceDataTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dataTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dataTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deviceAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  deviceActionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    marginBottom: 16,
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
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#666',
  },
  benefitsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  benefitsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 14,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitContent: {
    marginLeft: 12,
    flex: 1,
  },
  benefitName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  benefitDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default DevicesScreen;

