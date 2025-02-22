import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Alert, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { spotifyService } from '../services/spotifyService';

const AlbumScreen = ({ route }) => {
  const { albumId } = route.params;
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const loadAlbum = async () => {
    try {
      const response = await spotifyService.getAlbumByID(albumId);
      setAlbum(response);
    } catch (error) {
      Alert.alert(
        "Błąd",
        "Nie udało się załadować albumu",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      loadAlbum();
    }, [albumId])
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

        <Image source={{ uri: album.images[0].url }} style={styles.albumImage} />
        
        <View style={styles.albumInfo}>
          <Text style={styles.albumTitle}>{album.name}</Text>
          <Pressable onPress={() => navigation.navigate('Artist', { artistId: album.artists[0].id })}>
            <Text style={styles.artistName}>
              {album.artists.map(artist => artist.name).join(', ')}
            </Text>
          </Pressable>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="musical-notes" size={20} color="#BB9AF7" />
              <Text style={styles.statText}>{album.total_tracks} tracks</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="calendar" size={20} color="#BB9AF7" />
              <Text style={styles.statText}>{album.release_date}</Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Album Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>{album.album_type}</Text>
            </View>
            {album.genres.length > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Genres</Text>
                <View style={styles.genresContainer}>
                  {album.genres.map((genre, index) => (
                    <View key={index} style={styles.genreTag}>
                      <Text style={styles.genreText}>{genre}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Label</Text>
              <Text style={styles.detailValue}>{album.label}</Text>
            </View>
          </View>
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
  albumImage: {
    width: '100%',
    height: 350,
    marginBottom: 20,
  },
  albumInfo: {
    padding: 20,
  },
  albumTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#BB9AF7',
    marginBottom: 8,
  },
  artistName: {
    fontSize: 18,
    color: '#7AA2F7',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#414868',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 30,
  },
  statText: {
    color: '#C0CAF5',
    marginLeft: 8,
    fontSize: 16,
  },
  detailsContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#BB9AF7',
    marginBottom: 15,
    fontWeight: '600',
  },
  detailRow: {
    marginBottom: 15,
  },
  detailLabel: {
    color: '#7AA2F7',
    fontSize: 16,
    marginBottom: 5,
  },
  detailValue: {
    color: '#C0CAF5',
    fontSize: 16,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  genreTag: {
    backgroundColor: '#414868',
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
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
    flexDirection: 'row',
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

export default AlbumScreen;
