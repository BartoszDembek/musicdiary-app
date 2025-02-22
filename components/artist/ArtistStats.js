import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ArtistStats = ({ followers, popularity }) => {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Ionicons name="people" size={20} color="#BB9AF7" />
        <Text style={styles.statValue}>{followers.toLocaleString()}</Text>
        <Text style={styles.statLabel}>Followers</Text>
      </View>
      <View style={styles.statItem}>
        <Ionicons name="star" size={20} color="#BB9AF7" />
        <Text style={styles.statValue}>{popularity}%</Text>
        <Text style={styles.statLabel}>Popularity</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginBottom: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(187, 154, 247, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BB9AF7',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 16,
    color: '#C0CAF5',
    marginTop: 5,
  },
});

export default ArtistStats;
