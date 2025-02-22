import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ArtistGenres = ({ genres }) => {
  if (!genres || genres.length === 0) return null;

  return (
    <View style={styles.genresSection}>
      <Text style={styles.sectionTitle}>Genres</Text>
      <View style={styles.genresList}>
        {genres.map((genre, index) => (
          <View key={index} style={styles.genreTag}>
            <Text style={styles.genreText}>{genre}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  genresSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#BB9AF7',
    marginBottom: 15,
    fontWeight: '600',
  },
  genresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  genreTag: {
    backgroundColor: '#414868',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
  },
  genreText: {
    color: '#C0CAF5',
    fontSize: 14,
  },
});

export default ArtistGenres;
