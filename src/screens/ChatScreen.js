import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Foto do médico
const doctorPhoto = require('../../assets/doctor.png');

// Mensagens iniciais (simuladas)
const initialMessages = [
  {
    id: 1,
    text: 'Olá Maria! Seja bem-vinda ao chat. Como posso te ajudar hoje?',
    sender: 'doctor',
    time: '09:00',
    date: '28/11/2025',
    read: true,
  },
  {
    id: 2,
    text: 'Bom dia Dr. Maycon! Estou com algumas dúvidas sobre minha medicação.',
    sender: 'patient',
    time: '09:05',
    date: '28/11/2025',
    read: true,
  },
  {
    id: 3,
    text: 'Claro! Pode me contar qual é a sua dúvida?',
    sender: 'doctor',
    time: '09:07',
    date: '28/11/2025',
    read: true,
  },
  {
    id: 4,
    text: 'A Losartana que o senhor receitou, posso tomar junto com a Metformina ou precisa ter intervalo?',
    sender: 'patient',
    time: '09:10',
    date: '28/11/2025',
    read: true,
  },
  {
    id: 5,
    text: 'Ótima pergunta! Você pode tomar os dois medicamentos juntos, não há problema. O importante é manter os horários regulares. A Losartana pela manhã em jejum e a Metformina após as refeições.',
    sender: 'doctor',
    time: '09:15',
    date: '28/11/2025',
    read: true,
  },
  {
    id: 6,
    text: 'Muito obrigada por esclarecer, doutor! 🙏',
    sender: 'patient',
    time: '09:18',
    date: '28/11/2025',
    read: true,
  },
  {
    id: 7,
    text: 'Por nada! Qualquer outra dúvida, estou à disposição. Lembre-se de fazer o acompanhamento da pressão e glicemia em casa. 😊',
    sender: 'doctor',
    time: '09:20',
    date: '28/11/2025',
    read: true,
  },
];

// Respostas automáticas do médico (simuladas)
const autoResponses = [
  'Entendi! Vou analisar sua mensagem e respondo em breve.',
  'Obrigado por compartilhar. Essa informação é importante para o seu tratamento.',
  'Fico feliz em poder ajudar! Se tiver mais dúvidas, estou por aqui.',
  'Vou verificar seu prontuário e te respondo com mais detalhes.',
  'Muito bem! Continue seguindo as orientações e qualquer novidade me avise.',
];

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    // Scroll para o final ao carregar
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, []);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const date = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    const newMessage = {
      id: messages.length + 1,
      text: inputText.trim(),
      sender: 'patient',
      time,
      date,
      read: false,
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Scroll para o final
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simular médico digitando
    setIsTyping(true);

    // Simular resposta do médico após alguns segundos
    setTimeout(() => {
      setIsTyping(false);
      const randomResponse = autoResponses[Math.floor(Math.random() * autoResponses.length)];
      const responseTime = new Date();
      
      const doctorMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: 'doctor',
        time: `${responseTime.getHours().toString().padStart(2, '0')}:${responseTime.getMinutes().toString().padStart(2, '0')}`,
        date,
        read: true,
      };

      setMessages(prev => [...prev, doctorMessage]);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 2000 + Math.random() * 2000);
  };

  const renderMessage = (message, index) => {
    const isDoctor = message.sender === 'doctor';
    const showDate = index === 0 || messages[index - 1].date !== message.date;

    return (
      <View key={message.id}>
        {showDate && (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>{message.date}</Text>
          </View>
        )}
        <View style={[
          styles.messageContainer,
          isDoctor ? styles.doctorMessageContainer : styles.patientMessageContainer,
        ]}>
          {isDoctor && (
            <Image source={doctorPhoto} style={styles.doctorAvatar} />
          )}
          <View style={[
            styles.messageBubble,
            isDoctor ? styles.doctorBubble : styles.patientBubble,
          ]}>
            <Text style={[
              styles.messageText,
              isDoctor ? styles.doctorText : styles.patientText,
            ]}>
              {message.text}
            </Text>
            <View style={styles.messageFooter}>
              <Text style={[
                styles.messageTime,
                isDoctor ? styles.doctorTime : styles.patientTime,
              ]}>
                {message.time}
              </Text>
              {!isDoctor && (
                <Ionicons 
                  name={message.read ? 'checkmark-done' : 'checkmark'} 
                  size={14} 
                  color={message.read ? '#4FC3F7' : 'rgba(255,255,255,0.5)'} 
                />
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
          
          <View style={styles.headerInfo}>
            <Image source={doctorPhoto} style={styles.headerAvatar} />
            <View style={styles.headerText}>
              <Text style={styles.headerName}>Dr. Maycon Fellipe</Text>
              <View style={styles.statusContainer}>
                <View style={styles.onlineDot} />
                <Text style={styles.statusText}>Online</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Aviso */}
      <View style={styles.noticeBar}>
        <Ionicons name="information-circle" size={16} color="#1A5F7A" />
        <Text style={styles.noticeText}>
          Para emergências, ligue para o SAMU: 192
        </Text>
      </View>

      {/* Mensagens */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message, index) => renderMessage(message, index))}
        
        {isTyping && (
          <View style={[styles.messageContainer, styles.doctorMessageContainer]}>
            <Image source={doctorPhoto} style={styles.doctorAvatar} />
            <View style={[styles.messageBubble, styles.doctorBubble, styles.typingBubble]}>
              <View style={styles.typingIndicator}>
                <View style={[styles.typingDot, styles.typingDot1]} />
                <View style={[styles.typingDot, styles.typingDot2]} />
                <View style={[styles.typingDot, styles.typingDot3]} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="attach" size={24} color="#666" />
        </TouchableOpacity>
        
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            onFocus={() => {
              setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }, 300);
            }}
          />
          <TouchableOpacity style={styles.emojiButton}>
            <Ionicons name="happy-outline" size={22} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={inputText.trim() ? '#FFFFFF' : '#999'} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8ECF0',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerText: {
    marginLeft: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noticeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  noticeText: {
    fontSize: 12,
    color: '#1A5F7A',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#E8ECF0',
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 16,
    flexGrow: 1,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    maxWidth: '85%',
  },
  doctorMessageContainer: {
    alignSelf: 'flex-start',
  },
  patientMessageContainer: {
    alignSelf: 'flex-end',
  },
  doctorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 4,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: width * 0.7,
  },
  doctorBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
  },
  patientBubble: {
    backgroundColor: '#1A5F7A',
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  doctorText: {
    color: '#333',
  },
  patientText: {
    color: '#FFFFFF',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  messageTime: {
    fontSize: 11,
  },
  doctorTime: {
    color: '#999',
  },
  patientTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  typingBubble: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999',
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.6,
  },
  typingDot3: {
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8ECF0',
  },
  attachButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F5F7FA',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 4,
  },
  emojiButton: {
    padding: 4,
    marginLeft: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#1A5F7A',
  },
});

export default ChatScreen;

