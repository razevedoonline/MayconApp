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
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Categorias de conteúdo
const healthCategories = [
  { id: 'all', name: 'Todos', icon: 'apps' },
  { id: 'nutrition', name: 'Nutrição', icon: 'nutrition' },
  { id: 'exercise', name: 'Exercícios', icon: 'fitness' },
  { id: 'mental', name: 'Saúde Mental', icon: 'happy' },
  { id: 'prevention', name: 'Prevenção', icon: 'shield-checkmark' },
  { id: 'diabetes', name: 'Diabetes', icon: 'water' },
  { id: 'heart', name: 'Coração', icon: 'heart' },
];

// Artigos e dicas de saúde
const healthContent = [
  {
    id: 1,
    category: 'diabetes',
    title: 'Como Controlar a Glicemia',
    subtitle: 'Dicas práticas para o dia a dia',
    image: '🩸',
    readTime: '5 min',
    featured: true,
    content: `A glicemia é a quantidade de açúcar (glicose) presente no sangue. Para pessoas com diabetes, manter os níveis controlados é essencial.

**Dicas importantes:**

1. **Alimentação equilibrada**
   - Prefira alimentos integrais
   - Evite açúcares refinados
   - Faça refeições em horários regulares

2. **Exercícios físicos**
   - Caminhe pelo menos 30 minutos por dia
   - A atividade física ajuda a reduzir a glicose

3. **Medicação**
   - Tome seus medicamentos nos horários corretos
   - Nunca interrompa sem orientação médica

4. **Monitoramento**
   - Meça sua glicemia regularmente
   - Anote os valores para mostrar ao médico

**Valores de referência:**
- Em jejum: 70 a 99 mg/dL
- Após refeições: até 140 mg/dL`,
  },
  {
    id: 2,
    category: 'heart',
    title: 'Hipertensão: O Que Você Precisa Saber',
    subtitle: 'Entenda e controle sua pressão',
    image: '❤️',
    readTime: '6 min',
    featured: true,
    content: `A hipertensão arterial é uma condição crônica que afeta milhões de brasileiros. É conhecida como "assassina silenciosa" por geralmente não apresentar sintomas.

**O que é pressão alta?**
Pressão arterial acima de 140/90 mmHg em medições repetidas.

**Como controlar:**

1. **Reduza o sal**
   - Evite alimentos industrializados
   - Cozinhe com menos sal
   - Use temperos naturais

2. **Mantenha o peso ideal**
   - O excesso de peso aumenta a pressão

3. **Evite o álcool e cigarro**
   - Ambos elevam a pressão arterial

4. **Controle o estresse**
   - Pratique atividades relaxantes
   - Durma bem

5. **Tome a medicação corretamente**
   - Mesmo sem sintomas, não pare o tratamento

**Valores de referência:**
- Normal: até 120/80 mmHg
- Elevada: 120-129/80 mmHg
- Hipertensão: acima de 130/80 mmHg`,
  },
  {
    id: 3,
    category: 'nutrition',
    title: 'Alimentação Saudável',
    subtitle: 'Monte seu prato ideal',
    image: '🥗',
    readTime: '4 min',
    content: `Uma alimentação equilibrada é a base para uma vida saudável. Veja como montar seu prato:

**O Prato Ideal:**

🥬 **Metade do prato: Vegetais**
- Saladas cruas ou cozidas
- Legumes variados
- Quanto mais colorido, melhor!

🍚 **1/4 do prato: Carboidratos**
- Arroz (prefira integral)
- Batata, mandioca
- Massas integrais

🍗 **1/4 do prato: Proteínas**
- Carnes magras
- Frango, peixe
- Ovos, feijão

**Dicas extras:**

✅ Beba pelo menos 2 litros de água por dia
✅ Evite frituras e alimentos ultraprocessados
✅ Coma frutas como sobremesa
✅ Faça 5-6 refeições pequenas por dia
✅ Mastigue bem os alimentos`,
  },
  {
    id: 4,
    category: 'exercise',
    title: 'Exercícios para Iniciantes',
    subtitle: 'Comece a se movimentar hoje',
    image: '🏃',
    readTime: '5 min',
    content: `Nunca é tarde para começar a se exercitar! Veja como iniciar de forma segura:

**Por que se exercitar?**
- Melhora a saúde do coração
- Ajuda a controlar o peso
- Reduz o estresse e ansiedade
- Melhora o sono
- Aumenta a disposição

**Exercícios recomendados:**

🚶 **Caminhada**
- Comece com 15-20 minutos
- Aumente gradualmente
- Use calçados confortáveis

🏊 **Natação/Hidroginástica**
- Ótimo para as articulações
- Ideal para idosos

🧘 **Alongamento**
- Faça antes e depois dos exercícios
- Previne lesões

**Frequência recomendada:**
- 150 minutos por semana de atividade moderada
- Ou 75 minutos de atividade intensa

⚠️ **Importante:** Consulte seu médico antes de iniciar qualquer atividade física.`,
  },
  {
    id: 5,
    category: 'mental',
    title: 'Cuidando da Saúde Mental',
    subtitle: 'Sua mente também precisa de cuidados',
    image: '🧠',
    readTime: '6 min',
    content: `A saúde mental é tão importante quanto a saúde física. Veja como cuidar bem da sua mente:

**Sinais de alerta:**
- Tristeza persistente
- Ansiedade excessiva
- Alterações no sono
- Perda de interesse em atividades
- Irritabilidade constante

**Como cuidar da saúde mental:**

😴 **Durma bem**
- 7-8 horas por noite
- Mantenha horários regulares

🧘 **Pratique relaxamento**
- Meditação
- Respiração profunda
- Yoga

👥 **Mantenha conexões sociais**
- Converse com amigos e família
- Não se isole

📱 **Limite o uso de telas**
- Especialmente antes de dormir
- Evite excesso de redes sociais

🎯 **Tenha hobbies**
- Faça atividades que te dão prazer
- Aprenda coisas novas

**Quando buscar ajuda?**
Se os sintomas persistirem por mais de 2 semanas, procure ajuda profissional. Não há vergonha em pedir ajuda!`,
  },
  {
    id: 6,
    category: 'prevention',
    title: 'Check-up: Exames Importantes',
    subtitle: 'Prevenção é o melhor remédio',
    image: '🏥',
    readTime: '4 min',
    content: `Realizar check-ups regulares é fundamental para prevenir doenças. Veja os principais exames:

**Exames de rotina:**

🩸 **Hemograma**
- Avalia anemia e infecções
- Frequência: anual

📊 **Glicemia de jejum**
- Detecta diabetes
- Frequência: anual

❤️ **Perfil lipídico**
- Colesterol e triglicerídeos
- Frequência: anual

🫀 **Eletrocardiograma**
- Avalia o coração
- A partir dos 40 anos

**Para mulheres:**
- Papanicolau (anual)
- Mamografia (a partir dos 40 anos)

**Para homens:**
- PSA (a partir dos 50 anos)

**Quando fazer check-up?**
- Até 40 anos: a cada 2-3 anos
- Após 40 anos: anualmente
- Com doenças crônicas: conforme orientação médica`,
  },
  {
    id: 7,
    category: 'diabetes',
    title: 'Hipoglicemia: Como Reconhecer',
    subtitle: 'Saiba identificar e tratar',
    image: '⚠️',
    readTime: '3 min',
    content: `A hipoglicemia ocorre quando o açúcar no sangue fica muito baixo (abaixo de 70 mg/dL).

**Sintomas:**
- Tremores
- Suor frio
- Tontura
- Confusão mental
- Fraqueza
- Fome intensa
- Visão turva

**O que fazer:**

1. **Meça a glicemia** se possível

2. **Consuma açúcar rápido:**
   - 1 colher de sopa de açúcar
   - 1 copo de suco de laranja
   - 3-4 balas de açúcar

3. **Aguarde 15 minutos** e meça novamente

4. **Se não melhorar**, repita o tratamento

5. **Após normalizar**, faça uma refeição

**Prevenção:**
- Não pule refeições
- Tome medicamentos na dose correta
- Tenha sempre açúcar por perto
- Avise pessoas próximas sobre sua condição`,
  },
  {
    id: 8,
    category: 'heart',
    title: 'Sinais de Infarto',
    subtitle: 'Reconheça e aja rápido',
    image: '🚨',
    readTime: '3 min',
    featured: true,
    content: `O infarto é uma emergência médica. Reconhecer os sinais pode salvar vidas!

**Sintomas clássicos:**
- Dor forte no peito (aperto, pressão)
- Dor que irradia para braço esquerdo, pescoço ou mandíbula
- Falta de ar
- Suor frio
- Náusea
- Tontura

**Atenção - Sintomas em mulheres:**
Podem ser diferentes! Fique atenta a:
- Fadiga extrema
- Dor nas costas
- Desconforto abdominal

**O que fazer:**

🚨 **LIGUE IMEDIATAMENTE PARA O SAMU: 192**

Enquanto aguarda:
1. Sente ou deite a pessoa
2. Afrouxe as roupas
3. Se tiver aspirina, dê 1 comprimido
4. Não deixe a pessoa sozinha

**Tempo é vida!**
Quanto mais rápido o atendimento, maior a chance de sobrevivência.`,
  },
];

// Dicas rápidas
const quickTips = [
  { id: 1, icon: '💧', text: 'Beba 8 copos de água por dia' },
  { id: 2, icon: '🚶', text: 'Caminhe pelo menos 30 min/dia' },
  { id: 3, icon: '😴', text: 'Durma 7-8 horas por noite' },
  { id: 4, icon: '🍎', text: 'Coma 5 porções de frutas/vegetais' },
  { id: 5, icon: '🧘', text: 'Reserve tempo para relaxar' },
];

const HealthScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showArticleModal, setShowArticleModal] = useState(false);

  const filteredContent = selectedCategory === 'all' 
    ? healthContent 
    : healthContent.filter(item => item.category === selectedCategory);

  const featuredContent = healthContent.filter(item => item.featured);

  const openArticle = (article) => {
    setSelectedArticle(article);
    setShowArticleModal(true);
  };

  const renderFeaturedCard = (article) => (
    <TouchableOpacity
      key={article.id}
      style={styles.featuredCard}
      onPress={() => openArticle(article)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#1A5F7A', '#2D8EBA']}
        style={styles.featuredGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.featuredEmoji}>{article.image}</Text>
        <View style={styles.featuredContent}>
          <Text style={styles.featuredTitle}>{article.title}</Text>
          <Text style={styles.featuredSubtitle}>{article.subtitle}</Text>
        </View>
        <View style={styles.featuredFooter}>
          <View style={styles.readTime}>
            <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.readTimeText}>{article.readTime}</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderArticleCard = (article) => (
    <TouchableOpacity
      key={article.id}
      style={styles.articleCard}
      onPress={() => openArticle(article)}
      activeOpacity={0.7}
    >
      <View style={styles.articleEmoji}>
        <Text style={styles.articleEmojiText}>{article.image}</Text>
      </View>
      <View style={styles.articleInfo}>
        <Text style={styles.articleTitle}>{article.title}</Text>
        <Text style={styles.articleSubtitle}>{article.subtitle}</Text>
        <View style={styles.articleMeta}>
          <Ionicons name="time-outline" size={12} color="#999" />
          <Text style={styles.articleMetaText}>{article.readTime} de leitura</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
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
          <Text style={styles.headerTitle}>Saúde</Text>
          <View style={styles.placeholder} />
        </View>

        <Text style={styles.headerSubtitle}>
          Informações e dicas para cuidar melhor da sua saúde
        </Text>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Dica do Dia */}
        <View style={styles.tipOfDay}>
          <View style={styles.tipHeader}>
            <Ionicons name="bulb" size={20} color="#FF9800" />
            <Text style={styles.tipTitle}>Dica do Dia</Text>
          </View>
          <Text style={styles.tipText}>
            {quickTips[new Date().getDay() % quickTips.length].icon}{' '}
            {quickTips[new Date().getDay() % quickTips.length].text}
          </Text>
        </View>

        {/* Destaques */}
        <Text style={styles.sectionTitle}>Destaques</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredContainer}
        >
          {featuredContent.map(renderFeaturedCard)}
        </ScrollView>

        {/* Categorias */}
        <Text style={styles.sectionTitle}>Categorias</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {healthCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon} 
                size={16} 
                color={selectedCategory === category.id ? '#FFFFFF' : '#666'} 
              />
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category.id && styles.categoryChipTextActive,
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista de Artigos */}
        <Text style={styles.sectionTitle}>
          Artigos {selectedCategory !== 'all' && `(${filteredContent.length})`}
        </Text>
        {filteredContent.map(renderArticleCard)}

        {/* Emergência */}
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <Ionicons name="call" size={24} color="#E53935" />
            <Text style={styles.emergencyTitle}>Em caso de emergência</Text>
          </View>
          <View style={styles.emergencyNumbers}>
            <TouchableOpacity style={styles.emergencyNumber}>
              <Text style={styles.emergencyNumberValue}>192</Text>
              <Text style={styles.emergencyNumberLabel}>SAMU</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emergencyNumber}>
              <Text style={styles.emergencyNumberValue}>193</Text>
              <Text style={styles.emergencyNumberLabel}>Bombeiros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.emergencyNumber}>
              <Text style={styles.emergencyNumberValue}>190</Text>
              <Text style={styles.emergencyNumberLabel}>Polícia</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal do Artigo */}
      <Modal
        visible={showArticleModal}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setShowArticleModal(false)}
      >
        <View style={styles.modalContainer}>
          <StatusBar barStyle="dark-content" />
          
          {/* Header do Modal */}
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowArticleModal(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <View style={styles.modalReadTime}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.modalReadTimeText}>{selectedArticle?.readTime}</Text>
            </View>
          </View>

          {selectedArticle && (
            <ScrollView 
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.modalEmoji}>{selectedArticle.image}</Text>
              <Text style={styles.modalTitle}>{selectedArticle.title}</Text>
              <Text style={styles.modalSubtitle}>{selectedArticle.subtitle}</Text>
              
              <View style={styles.modalDivider} />
              
              <Text style={styles.modalText}>{selectedArticle.content}</Text>

              <View style={styles.modalFooter}>
                <View style={styles.authorInfo}>
                  <MaterialCommunityIcons name="doctor" size={20} color="#1A5F7A" />
                  <View>
                    <Text style={styles.authorName}>Dr. Maycon Fellipe</Text>
                    <Text style={styles.authorRole}>Clínico Geral e Internista</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  tipOfDay: {
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E65100',
  },
  tipText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  featuredContainer: {
    paddingRight: 20,
    marginBottom: 24,
    paddingBottom: 8,
  },
  featuredCard: {
    width: width - 80,
    marginRight: 16,
    borderRadius: 20,
    backgroundColor: '#1A5F7A',
  },
  featuredGradient: {
    padding: 20,
    minHeight: 160,
    borderRadius: 20,
  },
  featuredEmoji: {
    fontSize: 36,
    marginBottom: 12,
  },
  featuredContent: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTimeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  categoriesContainer: {
    paddingRight: 20,
    marginBottom: 24,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryChipActive: {
    backgroundColor: '#1A5F7A',
  },
  categoryChipText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  articleEmoji: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleEmojiText: {
    fontSize: 24,
  },
  articleInfo: {
    flex: 1,
    marginLeft: 12,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  articleSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  articleMetaText: {
    fontSize: 11,
    color: '#999',
  },
  emergencyCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#C62828',
  },
  emergencyNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  emergencyNumber: {
    alignItems: 'center',
  },
  emergencyNumberValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#E53935',
  },
  emergencyNumberLabel: {
    fontSize: 12,
    color: '#C62828',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalReadTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modalReadTimeText: {
    fontSize: 13,
    color: '#666',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 26,
  },
  modalFooter: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginBottom: 40,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  authorRole: {
    fontSize: 12,
    color: '#666',
  },
});

export default HealthScreen;

