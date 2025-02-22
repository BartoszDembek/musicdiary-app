import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const TopTracks = ({ tracks }) => {
  if (!tracks || tracks.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Top Tracks</Text>
      {tracks.slice(0, 5).map((track, index) => (
        <View key={index} style={styles.trackItem}>
          <Text style={styles.trackNumber}>{index + 1}</Text>
          <Image source={{ uri: track.album.images[0].url }} style={styles.trackImage} />
          <View style={styles.trackInfo}>
            <Text style={styles.trackName}>{track.name}</Text>
            <Text style={styles.trackAlbum}>{track.album.name}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#BB9AF7',
    marginBottom: 15,
    fontWeight: '600',
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(187, 154, 247, 0.05)',
    padding: 8,
    borderRadius: 8,
  },
  trackNumber: {
    color: '#BB9AF7',
    fontSize: 16,
    width: 30,
    textAlign: 'center',
  },
  trackImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    color: '#C0CAF5',
    fontSize: 16,
    marginBottom: 4,
  },
  trackAlbum: {
    color: '#7AA2F7',
    fontSize: 14,
  },
});

export default TopTracks;
