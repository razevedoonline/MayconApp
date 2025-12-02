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
  Linking,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Dados de medicamentos com descontos para pacientes do Dr. Maycon
const medicationsDatabase = [
  {
    id: 1,
    name: 'Losartana 50mg',
    genericName: 'Losartana Potássica',
    category: 'Anti-hipertensivo',
    requiresPrescription: true,
    pharmacies: [
      { name: 'Farmácia Popular', originalPrice: 15.90, price: 12.90, discount: 19, distance: '0.8 km', hasStock: true },
      { name: 'Drogasil', originalPrice: 24.90, price: 18.50, discount: 26, distance: '1.2 km', hasStock: true },
      { name: 'Pague Menos', originalPrice: 21.90, price: 15.90, discount: 27, distance: '0.5 km', hasStock: true },
      { name: 'Droga Raia', originalPrice: 25.90, price: 19.90, discount: 23, distance: '2.0 km', hasStock: false },
    ],
  },
  {
    id: 2,
    name: 'Metformina 850mg',
    genericName: 'Cloridrato de Metformina',
    category: 'Antidiabético',
    requiresPrescription: true,
    pharmacies: [
      { name: 'Farmácia Popular', originalPrice: 0.00, price: 0.00, discount: 0, distance: '0.8 km', hasStock: true, free: true },
      { name: 'Drogasil', originalPrice: 29.90, price: 22.90, discount: 23, distance: '1.2 km', hasStock: true },
      { name: 'Pague Menos', originalPrice: 26.90, price: 19.90, discount: 26, distance: '0.5 km', hasStock: true },
      { name: 'Droga Raia', originalPrice: 32.50, price: 24.50, discount: 25, distance: '2.0 km', hasStock: true },
    ],
  },
  {
    id: 3,
    name: 'Paracetamol 750mg',
    genericName: 'Paracetamol',
    category: 'Analgésico',
    requiresPrescription: false,
    pharmacies: [
      { name: 'Farmácia Popular', originalPrice: 7.90, price: 5.90, discount: 25, distance: '0.8 km', hasStock: true },
      { name: 'Drogasil', originalPrice: 11.90, price: 8.90, discount: 25, distance: '1.2 km', hasStock: true },
      { name: 'Pague Menos', originalPrice: 8.90, price: 6.50, discount: 27, distance: '0.5 km', hasStock: true },
      { name: 'Droga Raia', originalPrice: 12.90, price: 9.90, discount: 23, distance: '2.0 km', hasStock: true },
    ],
  },
  {
    id: 4,
    name: 'Omeprazol 20mg',
    genericName: 'Omeprazol',
    category: 'Antiácido',
    requiresPrescription: false,
    pharmacies: [
      { name: 'Farmácia Popular', originalPrice: 11.90, price: 8.90, discount: 25, distance: '0.8 km', hasStock: true },
      { name: 'Drogasil', originalPrice: 21.90, price: 15.90, discount: 27, distance: '1.2 km', hasStock: true },
      { name: 'Pague Menos', originalPrice: 16.90, price: 12.50, discount: 26, distance: '0.5 km', hasStock: false },
      { name: 'Droga Raia', originalPrice: 19.90, price: 14.90, discount: 25, distance: '2.0 km', hasStock: true },
    ],
  },
  {
    id: 5,
    name: 'AAS 100mg',
    genericName: 'Ácido Acetilsalicílico',
    category: 'Antiagregante',
    requiresPrescription: false,
    pharmacies: [
      { name: 'Farmácia Popular', originalPrice: 5.90, price: 4.50, discount: 24, distance: '0.8 km', hasStock: true },
      { name: 'Drogasil', originalPrice: 10.90, price: 7.90, discount: 28, distance: '1.2 km', hasStock: true },
      { name: 'Pague Menos', originalPrice: 7.90, price: 5.90, discount: 25, distance: '0.5 km', hasStock: true },
      { name: 'Droga Raia', originalPrice: 11.50, price: 8.50, discount: 26, distance: '2.0 km', hasStock: true },
    ],
  },
  {
    id: 6,
    name: 'Dipirona 500mg',
    genericName: 'Dipirona Sódica',
    category: 'Analgésico',
    requiresPrescription: false,
    pharmacies: [
      { name: 'Farmácia Popular', originalPrice: 8.90, price: 6.90, discount: 22, distance: '0.8 km', hasStock: true },
      { name: 'Drogasil', originalPrice: 12.90, price: 9.50, discount: 26, distance: '1.2 km', hasStock: true },
      { name: 'Pague Menos', originalPrice: 10.90, price: 7.90, discount: 28, distance: '0.5 km', hasStock: true },
      { name: 'Droga Raia', originalPrice: 14.90, price: 10.90, discount: 27, distance: '2.0 km', hasStock: false },
    ],
  },
  {
    id: 7,
    name: 'Ibuprofeno 600mg',
    genericName: 'Ibuprofeno',
    category: 'Anti-inflamatório',
    requiresPrescription: false,
    pharmacies: [
      { name: 'Farmácia Popular', originalPrice: 12.90, price: 9.90, discount: 23, distance: '0.8 km', hasStock: true },
      { name: 'Drogasil', originalPrice: 19.90, price: 14.90, discount: 25, distance: '1.2 km', hasStock: true },
      { name: 'Pague Menos', originalPrice: 15.90, price: 11.90, discount: 25, distance: '0.5 km', hasStock: true },
      { name: 'Droga Raia', originalPrice: 21.50, price: 15.50, discount: 28, distance: '2.0 km', hasStock: true },
    ],
  },
  {
    id: 8,
    name: 'Vitamina D3 2000UI',
    genericName: 'Colecalciferol',
    category: 'Vitamina',
    requiresPrescription: false,
    pharmacies: [
      { name: 'Farmácia Popular', originalPrice: 25.90, price: 19.90, discount: 23, distance: '0.8 km', hasStock: true },
      { name: 'Drogasil', originalPrice: 39.90, price: 29.90, discount: 25, distance: '1.2 km', hasStock: true },
      { name: 'Pague Menos', originalPrice: 32.90, price: 24.90, discount: 24, distance: '0.5 km', hasStock: true },
      { name: 'Droga Raia', originalPrice: 42.50, price: 32.50, discount: 24, distance: '2.0 km', hasStock: true },
    ],
  },
];

// Categorias populares
const popularCategories = [
  { id: 1, name: 'Analgésicos', icon: 'bandage', color: '#E53935' },
  { id: 2, name: 'Vitaminas', icon: 'nutrition', color: '#FF9800' },
  { id: 3, name: 'Diabetes', icon: 'water', color: '#2196F3' },
  { id: 4, name: 'Pressão', icon: 'heart', color: '#E91E63' },
  { id: 5, name: 'Gripe', icon: 'thermometer', color: '#9C27B0' },
  { id: 6, name: 'Estômago', icon: 'medical', color: '#4CAF50' },
];

const PharmacyScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [sortBy, setSortBy] = useState('price'); // 'price', 'distance'

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      const results = medicationsDatabase.filter(
        med => 
          med.name.toLowerCase().includes(query.toLowerCase()) ||
          med.genericName.toLowerCase().includes(query.toLowerCase()) ||
          med.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setSelectedMedication(null);
    } else {
      setSearchResults([]);
    }
  };

  const selectMedication = (medication) => {
    setSelectedMedication(medication);
  };

  const getCheapestPrice = (pharmacies) => {
    const available = pharmacies.filter(p => p.hasStock);
    if (available.length === 0) return null;
    return Math.min(...available.map(p => p.price));
  };

  const getSortedPharmacies = (pharmacies) => {
    const sorted = [...pharmacies].sort((a, b) => {
      if (sortBy === 'price') {
        if (a.free) return -1;
        if (b.free) return 1;
        return a.price - b.price;
      }
      return parseFloat(a.distance) - parseFloat(b.distance);
    });
    return sorted;
  };

  const openMaps = (pharmacyName) => {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(pharmacyName + ' Sobral CE')}`;
    Linking.openURL(url);
  };

  const renderMedicationCard = (medication) => {
    const cheapestPrice = getCheapestPrice(medication.pharmacies);
    const hasFree = medication.pharmacies.some(p => p.free && p.hasStock);

    return (
      <TouchableOpacity
        key={medication.id}
        style={styles.medicationCard}
        onPress={() => selectMedication(medication)}
        activeOpacity={0.7}
      >
        <View style={styles.medicationHeader}>
          <View style={styles.medicationIcon}>
            <MaterialCommunityIcons name="pill" size={24} color="#1A5F7A" />
          </View>
          <View style={styles.medicationInfo}>
            <Text style={styles.medicationName}>{medication.name}</Text>
            <Text style={styles.genericName}>{medication.genericName}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{medication.category}</Text>
            </View>
          </View>
        </View>

        <View style={styles.priceSection}>
          {hasFree ? (
            <View style={styles.freeTag}>
              <Ionicons name="gift" size={14} color="#4CAF50" />
              <Text style={styles.freeText}>Grátis na Farmácia Popular</Text>
            </View>
          ) : (
            <View style={styles.priceInfo}>
              <Text style={styles.priceLabel}>A partir de</Text>
              <Text style={styles.priceValue}>
                R$ {cheapestPrice?.toFixed(2).replace('.', ',')}
              </Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </View>

        {medication.requiresPrescription && (
          <View style={styles.prescriptionTag}>
            <Ionicons name="document-text" size={12} color="#FF9800" />
            <Text style={styles.prescriptionText}>Requer receita</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderPharmacyList = () => {
    if (!selectedMedication) return null;

    const sortedPharmacies = getSortedPharmacies(selectedMedication.pharmacies);

    return (
      <View style={styles.pharmacyListContainer}>
        <View style={styles.pharmacyListHeader}>
          <TouchableOpacity 
            style={styles.backToResults}
            onPress={() => setSelectedMedication(null)}
          >
            <Ionicons name="arrow-back" size={20} color="#1A5F7A" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.selectedMedicationInfo}>
          <MaterialCommunityIcons name="pill" size={32} color="#1A5F7A" />
          <View style={styles.selectedMedicationText}>
            <Text style={styles.selectedMedicationName}>{selectedMedication.name}</Text>
            <Text style={styles.selectedMedicationGeneric}>{selectedMedication.genericName}</Text>
          </View>
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

        {/* Sort Options */}
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

        {/* Pharmacy Cards */}
        {sortedPharmacies.map((pharmacy, index) => (
          <View 
            key={index} 
            style={[
              styles.pharmacyCard,
              !pharmacy.hasStock && styles.pharmacyCardDisabled,
              index === 0 && pharmacy.hasStock && styles.pharmacyCardBest,
            ]}
          >
            {index === 0 && pharmacy.hasStock && (
              <View style={styles.bestPriceBadge}>
                <Ionicons name="trophy" size={12} color="#FFFFFF" />
                <Text style={styles.bestPriceText}>Melhor Preço</Text>
              </View>
            )}

            <View style={styles.pharmacyHeader}>
              <View style={styles.pharmacyInfo}>
                <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
                <View style={styles.distanceInfo}>
                  <Ionicons name="location" size={14} color="#666" />
                  <Text style={styles.distanceText}>{pharmacy.distance}</Text>
                </View>
              </View>
              
              <View style={styles.priceBox}>
                {pharmacy.free ? (
                  <View style={styles.freeBox}>
                    <Text style={styles.freePriceText}>GRÁTIS</Text>
                    <Text style={styles.freeSubtext}>Farmácia Popular</Text>
                  </View>
                ) : (
                  <>
                    {pharmacy.discount > 0 && (
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>-{pharmacy.discount}%</Text>
                      </View>
                    )}
                    {pharmacy.originalPrice && pharmacy.discount > 0 && (
                      <Text style={styles.originalPriceText}>
                        R$ {pharmacy.originalPrice.toFixed(2).replace('.', ',')}
                      </Text>
                    )}
                    <Text style={styles.pharmacyPrice}>
                      R$ {pharmacy.price.toFixed(2).replace('.', ',')}
                    </Text>
                    {!pharmacy.hasStock && (
                      <Text style={styles.noStockText}>Sem estoque</Text>
                    )}
                  </>
                )}
              </View>
            </View>

            {pharmacy.hasStock && (
              <View style={styles.pharmacyActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => openMaps(pharmacy.name)}
                >
                  <Ionicons name="navigate" size={18} color="#1A5F7A" />
                  <Text style={styles.actionButtonText}>Como Chegar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButtonSecondary}>
                  <Ionicons name="call" size={18} color="#666" />
                  <Text style={styles.actionButtonTextSecondary}>Ligar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {/* Tip */}
        <View style={styles.tipBox}>
          <Ionicons name="bulb" size={20} color="#FF9800" />
          <Text style={styles.tipText}>
            Dica: Verifique se você tem direito a medicamentos gratuitos no programa Farmácia Popular!
          </Text>
        </View>
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
          <Text style={styles.headerTitle}>Buscar Medicamentos</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar medicamento..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {selectedMedication ? (
          renderPharmacyList()
        ) : searchResults.length > 0 ? (
          <>
            <Text style={styles.resultsTitle}>
              {searchResults.length} resultado(s) encontrado(s)
            </Text>
            {searchResults.map(renderMedicationCard)}
          </>
        ) : searchQuery.length > 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="pill-off" size={60} color="#CCC" />
            <Text style={styles.emptyTitle}>Nenhum medicamento encontrado</Text>
            <Text style={styles.emptyText}>
              Tente buscar pelo nome comercial ou princípio ativo
            </Text>
          </View>
        ) : (
          <>
            {/* Categorias Populares */}
            <Text style={styles.sectionTitle}>Categorias Populares</Text>
            <View style={styles.categoriesGrid}>
              {popularCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryCard}
                  onPress={() => handleSearch(category.name)}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                    <Ionicons name={category.icon} size={24} color={category.color} />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Medicamentos da Receita */}
            <Text style={styles.sectionTitle}>Seus Medicamentos</Text>
            <Text style={styles.sectionSubtitle}>Baseado nas suas receitas ativas</Text>
            {medicationsDatabase.slice(0, 3).map(renderMedicationCard)}

            {/* Info Farmácia Popular */}
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <FontAwesome5 name="hand-holding-heart" size={24} color="#4CAF50" />
                <Text style={styles.infoTitle}>Programa Farmácia Popular</Text>
              </View>
              <Text style={styles.infoText}>
                Pacientes com hipertensão e diabetes podem retirar medicamentos gratuitamente 
                nas farmácias credenciadas com o programa Farmácia Popular do Brasil.
              </Text>
              <TouchableOpacity style={styles.infoButton}>
                <Text style={styles.infoButtonText}>Saiba mais</Text>
                <Ionicons name="arrow-forward" size={16} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </>
        )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryCard: {
    width: (width - 52) / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  resultsTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  medicationCard: {
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
  medicationHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  medicationIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  genericName: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  categoryText: {
    fontSize: 11,
    color: '#666',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  priceLabel: {
    fontSize: 12,
    color: '#999',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4CAF50',
  },
  freeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  freeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4CAF50',
  },
  prescriptionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  prescriptionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FF9800',
  },
  pharmacyListContainer: {
    flex: 1,
  },
  pharmacyListHeader: {
    marginBottom: 16,
  },
  backToResults: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: 14,
    color: '#1A5F7A',
    fontWeight: '600',
  },
  selectedMedicationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  selectedMedicationText: {
    flex: 1,
  },
  selectedMedicationName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  selectedMedicationGeneric: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  discountInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
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
    backgroundColor: '#FFFFFF',
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
  pharmacyCard: {
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
  pharmacyCardDisabled: {
    opacity: 0.6,
  },
  pharmacyCardBest: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  bestPriceBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  bestPriceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pharmacyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pharmacyInfo: {
    flex: 1,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  distanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  distanceText: {
    fontSize: 13,
    color: '#666',
  },
  priceBox: {
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
  pharmacyPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A5F7A',
  },
  noStockText: {
    fontSize: 11,
    color: '#E53935',
    marginTop: 2,
  },
  freeBox: {
    alignItems: 'flex-end',
  },
  freePriceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4CAF50',
  },
  freeSubtext: {
    fontSize: 10,
    color: '#4CAF50',
  },
  pharmacyActions: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A5F7A',
  },
  actionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  actionButtonTextSecondary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    gap: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#E65100',
    lineHeight: 18,
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
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
});

export default PharmacyScreen;

