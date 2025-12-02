import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

// Foto local do Dr. Maycon Fellipe
const doctorPhoto = require('../../assets/doctor.png');

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Animação de pulso suave na borda da foto
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#1A5F7A', '#2D8EBA', '#57C5B6']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Elementos decorativos de fundo */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        <View style={styles.decorativeCircle3} />

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Foto e Info do Médico */}
          <Animated.View
            style={[
              styles.doctorContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.photoWrapper,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <View style={styles.photoBorder}>
                <Image
                  source={doctorPhoto}
                  style={styles.doctorPhoto}
                  resizeMode="cover"
                />
              </View>
            </Animated.View>
            
            <Text style={styles.doctorName}>Dr. Maycon Fellipe</Text>
            <Text style={styles.specialty}>Médico Clínico e Internista</Text>
            <View style={styles.crmContainer}>
              <FontAwesome5 name="user-md" size={12} color="rgba(255,255,255,0.7)" />
              <Text style={styles.crmText}>CRM/CE 15972 | RQE 14023</Text>
            </View>
            <Text style={styles.locationText}>📍 Sobral - CE</Text>
          </Animated.View>

          {/* Especialidades */}
          <Animated.View
            style={[
              styles.featuresContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <FeatureItem
              icon={<MaterialCommunityIcons name="stethoscope" size={24} color="#1A5F7A" />}
              title="Check-up Completo"
              description="Avaliação integral da sua saúde"
            />
            <FeatureItem
              icon={<MaterialCommunityIcons name="calendar-clock" size={24} color="#1A5F7A" />}
              title="Agendamento Online"
              description="Marque sua consulta facilmente"
            />
            <FeatureItem
              icon={<Ionicons name="moon" size={24} color="#1A5F7A" />}
              title="Medicina do Sono"
              description="Tratamento de distúrbios do sono"
            />
          </Animated.View>

          {/* Botões */}
          <Animated.View
            style={[
              styles.buttonsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Acessar Minha Conta</Text>
              <Ionicons name="arrow-forward" size={20} color="#1A5F7A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>Sou Novo Paciente</Text>
            </TouchableOpacity>

            <View style={styles.contactContainer}>
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                <Text style={styles.contactText}>(88) 99805-6685</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.termsText}>
              Ao continuar, você concorda com nossos{' '}
              <Text style={styles.termsLink}>Termos de Uso</Text> e{' '}
              <Text style={styles.termsLink}>Política de Privacidade</Text>
            </Text>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const FeatureItem = ({ icon, title, description }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIcon}>{icon}</View>
    <View style={styles.featureText}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: -150,
    right: -100,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    bottom: 80,
    left: -80,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: height * 0.35,
    right: -50,
  },
  doctorContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  photoWrapper: {
    marginBottom: 16,
  },
  photoBorder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 15,
  },
  doctorPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 85,
    backgroundColor: '#E0E0E0',
  },
  doctorName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    textAlign: 'center',
  },
  specialty: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 6,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  crmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  crmText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  locationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    fontWeight: '400',
  },
  featuresContainer: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    marginLeft: 14,
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  buttonsContainer: {
    gap: 10,
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A5F7A',
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
  },
  contactText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  termsText: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 6,
  },
  termsLink: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;
