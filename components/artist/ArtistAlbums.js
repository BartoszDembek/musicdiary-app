import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ArtistAlbums = ({ albums }) => {
  const navigation = useNavigation();
  
  if (!albums || albums.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Albums</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.albumsRow}>
        {albums.map((album, index) => (
          <Pressable 
            key={index}
            onPress={() => navigation.push('Album', { albumId: album.id })}
            style={styles.albumCard}
          >
            <Image source={{ uri: album.images[0].url }} style={styles.albumCardImage} />
            <Text style={styles.albumCardName} numberOfLines={1}>{album.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
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
  albumsRow: {
    marginTop: 12,
  },
  albumCard: {
    width: 140,
    marginRight: 12,
  },
  albumCardImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
  },
  albumCardName: {
    color: '#C0CAF5',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ArtistAlbums;
