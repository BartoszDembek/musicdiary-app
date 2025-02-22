import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Alert, ScrollView, Pressable } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { spotifyService } from '../services/spotifyService';

const ArtistScreen = ({ route }) => {
  const { artistId } = route.params;
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const loadArtist = async () => {
    try {
      const response = await spotifyService.getArtistByID(artistId);
      setArtist(response);
    } catch (error) {
      Alert.alert(
        "Błąd",
        "Nie udało się załadować artysty",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      loadArtist();
    }, [artistId])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.skeletonHeader} />
        <View style={styles.skeletonContent}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#BB9AF7" />
          </Pressable>
        </View>

        <Image 
          source={{ uri: artist.images[0]?.url }} 
          style={styles.artistImage}
        />
        
        <View style={styles.artistInfo}>
          <Text style={styles.artistName}>{artist.name}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={20} color="#BB9AF7" />
              <Text style={styles.statValue}>{artist.followers.total.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star" size={20} color="#BB9AF7" />
              <Text style={styles.statValue}>{artist.popularity}%</Text>
              <Text style={styles.statLabel}>Popularity</Text>
            </View>
          </View>

          {artist.genres.length > 0 && (
            <View style={styles.genresSection}>
              <Text style={styles.sectionTitle}>Genres</Text>
              <View style={styles.genresList}>
                {artist.genres.map((genre, index) => (
                  <View key={index} style={styles.genreTag}>
                    <Text style={styles.genreText}>{genre}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(187, 154, 247, 0.1)',
    borderRadius: 20,
  },
  artistImage: {
    width: '100%',
    height: 350,
    marginBottom: 20,
  },
  artistInfo: {
    padding: 20,
  },
  artistName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#BB9AF7',
    marginBottom: 20,
  },
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
  skeletonHeader: {
    width: '100%',
    height: 60,
    backgroundColor: '#2E2E3E',
    marginBottom: 20,
  },
  skeletonContent: {
    alignItems: 'center',
  },
  skeletonImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    backgroundColor: '#2E2E3E',
    marginBottom: 20,
  },
  skeletonText: {
    width: 150,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#2E2E3E',
    marginBottom: 10,
  },
});

export default ArtistScreen;
