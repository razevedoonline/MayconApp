import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const doctorPhoto = require('../../assets/doctor.png');
const patientPhoto = require('../../assets/maria.png');

const VideoConferenceScreen = ({ navigation, route }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);
  const [showControls, setShowControls] = useState(true);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Timer da chamada
  useEffect(() => {
    // Simular conexão
    const connectTimer = setTimeout(() => {
      setIsConnecting(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 2000);

    return () => clearTimeout(connectTimer);
  }, []);

  // Contador de tempo
  useEffect(() => {
    if (!isConnecting) {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isConnecting]);

  // Animação de pulso durante conexão
  useEffect(() => {
    if (isConnecting) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isConnecting]);

  // Formatar tempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Encerrar chamada
  const handleEndCall = () => {
    Alert.alert(
      'Encerrar Chamada',
      'Deseja realmente encerrar a videochamada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Encerrar', 
          style: 'destructive',
          onPress: () => navigation.goBack()
        },
      ]
    );
  };

  // Toggle controles
  const toggleControls = () => {
    setShowControls(!showControls);
  };

  if (isConnecting) {
    return (
      <View style={styles.connectingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" translucent />
        <LinearGradient
          colors={['#1A1A2E', '#16213E', '#0F3460']}
          style={styles.connectingGradient}
        >
          <Animated.View style={[styles.connectingPhotoContainer, { transform: [{ scale: pulseAnim }] }]}>
            <Image source={doctorPhoto} style={styles.connectingPhoto} />
          </Animated.View>
          <Text style={styles.connectingName}>Dr. Maycon Fellipe</Text>
          <Text style={styles.connectingStatus}>Conectando...</Text>
          
          <View style={styles.connectingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={1}
      onPress={toggleControls}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" translucent />
      
      {/* Vídeo Principal (Médico) */}
      <View style={styles.mainVideoContainer}>
        <Image source={doctorPhoto} style={styles.mainVideo} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.mainVideoOverlay}
        />
        
        {/* Nome do médico */}
        <Animated.View style={[styles.doctorNameContainer, { opacity: fadeAnim }]}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>AO VIVO</Text>
          </View>
          <Text style={styles.doctorNameMain}>Dr. Maycon Fellipe</Text>
          <Text style={styles.doctorSpecialtyMain}>Médico Clínico e Internista</Text>
        </Animated.View>
      </View>

      {/* Vídeo Pequeno (Paciente) */}
      <Animated.View style={[styles.selfVideoContainer, { opacity: fadeAnim }]}>
        {isCameraOff ? (
          <View style={styles.cameraOffContainer}>
            <Ionicons name="videocam-off" size={30} color="#FFFFFF" />
            <Text style={styles.cameraOffText}>Câmera desligada</Text>
          </View>
        ) : (
          <Image source={patientPhoto} style={styles.selfVideo} />
        )}
        <View style={styles.selfVideoLabel}>
          <Text style={styles.selfVideoText}>Você</Text>
        </View>
      </Animated.View>

      {/* Timer e Info */}
      {showControls && (
        <Animated.View style={[styles.topControls, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={styles.backButtonVideo}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.callInfo}>
            <View style={styles.timerContainer}>
              <View style={styles.recordingDot} />
              <Text style={styles.timerText}>{formatTime(callDuration)}</Text>
            </View>
            <Text style={styles.callQuality}>HD • Conexão estável</Text>
          </View>

          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Controles */}
      {showControls && (
        <Animated.View style={[styles.controls, { opacity: fadeAnim }]}>
          <View style={styles.controlsRow}>
            {/* Mudo */}
            <TouchableOpacity 
              style={[styles.controlButton, isMuted && styles.controlButtonActive]}
              onPress={() => setIsMuted(!isMuted)}
            >
              <Ionicons 
                name={isMuted ? "mic-off" : "mic"} 
                size={26} 
                color="#FFFFFF" 
              />
              <Text style={styles.controlLabel}>{isMuted ? 'Ativar' : 'Mudo'}</Text>
            </TouchableOpacity>

            {/* Câmera */}
            <TouchableOpacity 
              style={[styles.controlButton, isCameraOff && styles.controlButtonActive]}
              onPress={() => setIsCameraOff(!isCameraOff)}
            >
              <Ionicons 
                name={isCameraOff ? "videocam-off" : "videocam"} 
                size={26} 
                color="#FFFFFF" 
              />
              <Text style={styles.controlLabel}>{isCameraOff ? 'Ligar' : 'Câmera'}</Text>
            </TouchableOpacity>

            {/* Encerrar */}
            <TouchableOpacity 
              style={styles.endCallButton}
              onPress={handleEndCall}
            >
              <MaterialCommunityIcons name="phone-hangup" size={32} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Alto-falante */}
            <TouchableOpacity 
              style={[styles.controlButton, !isSpeakerOn && styles.controlButtonActive]}
              onPress={() => setIsSpeakerOn(!isSpeakerOn)}
            >
              <Ionicons 
                name={isSpeakerOn ? "volume-high" : "volume-mute"} 
                size={26} 
                color="#FFFFFF" 
              />
              <Text style={styles.controlLabel}>{isSpeakerOn ? 'Som' : 'Mudo'}</Text>
            </TouchableOpacity>

            {/* Virar câmera */}
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="camera-reverse" size={26} color="#FFFFFF" />
              <Text style={styles.controlLabel}>Virar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Indicador de toque */}
      {!showControls && (
        <View style={styles.tapIndicator}>
          <Text style={styles.tapIndicatorText}>Toque para ver os controles</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  // Tela de conexão
  connectingContainer: {
    flex: 1,
  },
  connectingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectingPhotoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#673AB7',
    overflow: 'hidden',
    marginBottom: 24,
  },
  connectingPhoto: {
    width: '100%',
    height: '100%',
  },
  connectingName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  connectingStatus: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 24,
  },
  connectingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#673AB7',
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  cancelButton: {
    position: 'absolute',
    bottom: 80,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Vídeo principal
  mainVideoContainer: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  mainVideo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mainVideoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  doctorNameContainer: {
    position: 'absolute',
    bottom: 140,
    left: 20,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53935',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  doctorNameMain: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  doctorSpecialtyMain: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  // Vídeo próprio
  selfVideoContainer: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#333',
  },
  selfVideo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cameraOffContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  cameraOffText: {
    fontSize: 10,
    color: '#FFFFFF',
    marginTop: 4,
  },
  selfVideoLabel: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  selfVideoText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Controles superiores
  topControls: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButtonVideo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callInfo: {
    alignItems: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53935',
    marginRight: 8,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  callQuality: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  moreButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Controles inferiores
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  controlButtonActive: {
    opacity: 0.5,
  },
  controlLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    marginTop: 4,
  },
  endCallButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  tapIndicator: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tapIndicatorText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
});

export default VideoConferenceScreen;

