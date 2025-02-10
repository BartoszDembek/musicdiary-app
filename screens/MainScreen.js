import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const MainScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MusicDiary</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ostatnie wpisy</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Nie masz jeszcze żadnych wpisów</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Dodaj pierwszy wpis</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statystyki</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Wszystkie wpisy</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Ten miesiąc</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#414868',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BB9AF7',
  },
  profileButton: {
    padding: 8,
  },
  profileButtonText: {
    color: '#7AA2F7',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#7AA2F7',
    marginBottom: 15,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    color: '#C0CAF5',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#BB9AF7',
    padding: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#1E1E2E',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 20,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    color: '#BB9AF7',
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#C0CAF5',
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#BB9AF7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    fontSize: 24,
    color: '#1E1E2E',
    fontWeight: 'bold',
  },
});

export default MainScreen;
