import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

/**
 * FarmListScreen
 * Mobile screen displaying list of farms available for rental
 */
const FarmListScreen = ({ navigation }) => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredFarms, setFilteredFarms] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api/v1';

  useEffect(() => {
    fetchActiveFarms();
  }, []);

  const fetchActiveFarms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/farms/status/active`);
      setFarms(response.data);
      setFilteredFarms(response.data);
    } catch (error) {
      console.error('Error fetching farms:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByWaterSource = (waterSource) => {
    setSelectedFilter(waterSource);
    if (waterSource === 'all') {
      setFilteredFarms(farms);
    } else {
      setFilteredFarms(farms.filter(farm => farm.waterSource === waterSource));
    }
  };

  const renderFarmCard = ({ item }) => (
    <TouchableOpacity
      style={styles.farmCard}
      onPress={() => navigation.navigate('FarmDetail', { farmId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.farmCardContent}>
        <Text style={styles.farmTitle}>{item.title}</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>📏 Acreage:</Text>
          <Text style={styles.value}>{item.acreage} acres</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>💧 Water:</Text>
          <Text style={styles.value}>{item.waterSource}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>🌱 Soil Type:</Text>
          <Text style={styles.value}>{item.soilType}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Monthly Rate:</Text>
          <Text style={styles.price}>₹{item.pricePerMonth}</Text>
        </View>

        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => navigation.navigate('FarmDetail', { farmId: item.id })}
        >
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Available Farms</Text>

      {/* Filter buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'all' && styles.filterButtonActive
          ]}
          onPress={() => filterByWaterSource('all')}
        >
          <Text style={[
            styles.filterText,
            selectedFilter === 'all' && styles.filterTextActive
          ]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'BOREWELL' && styles.filterButtonActive
          ]}
          onPress={() => filterByWaterSource('BOREWELL')}
        >
          <Text style={[
            styles.filterText,
            selectedFilter === 'BOREWELL' && styles.filterTextActive
          ]}>
            Borewell
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'CANAL' && styles.filterButtonActive
          ]}
          onPress={() => filterByWaterSource('CANAL')}
        >
          <Text style={[
            styles.filterText,
            selectedFilter === 'CANAL' && styles.filterTextActive
          ]}>
            Canal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'RAINFALL_DEPENDENT' && styles.filterButtonActive
          ]}
          onPress={() => filterByWaterSource('RAINFALL_DEPENDENT')}
        >
          <Text style={[
            styles.filterText,
            selectedFilter === 'RAINFALL_DEPENDENT' && styles.filterTextActive
          ]}>
            Rain-fed
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredFarms}
        renderItem={renderFarmCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    marginTop: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#e5e7eb',
  },
  filterButtonActive: {
    backgroundColor: '#16a34a',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  farmCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  farmCardContent: {
    padding: 16,
  },
  farmTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  priceLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  price: {
    fontSize: 18,
    color: '#16a34a',
    fontWeight: '700',
  },
  viewButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FarmListScreen;
