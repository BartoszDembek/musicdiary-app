import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Pressable, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spotifyService } from '../services/spotifyService';
import RenderAlbumCard from '../components/RenderAlbumCard';

const MainScreen = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const loadAlbums = async () => {
    setLoading(true);
    try {
      const response = await spotifyService.loadAlbums();
      let img = [];
      response['albums']['items'].forEach(element => {
        img.push({ 
          id: element['id'], 
          url: element['images'][0]["url"],
          name: element['name'],
          artist: element['artists'][0]['name']
        });
      });
      setAlbums(img);
    } catch (error) {
      Alert.alert(
        "Error",
        "Could not load albums",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlbums();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MusicDiary</Text>
        <Pressable onPress={() => {}} style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#BB9AF7" />
        </Pressable>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.gridContainer}>
            {[1,2,3,4,5,6].map(i => (
              <View key={i} style={[styles.albumCard, styles.skeletonCard]}>
                <View style={[styles.albumImage, styles.skeletonImage]} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {albums.map((album, index) => (
              <RenderAlbumCard key={index} album={album} index={index} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#414868',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BB9AF7',
  },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(187, 154, 247, 0.1)',
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    justifyContent: 'center',
    paddingTop:10
  },
  albumCard: {
    width: 115,
    borderRadius: 8,
    overflow: 'hidden',
  },
  albumImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  skeletonCard: {
    backgroundColor: 'rgba(187, 154, 247, 0.02)',
  },
  skeletonImage: {
    backgroundColor: '#2E2E3E',
  },
  skeletonText: {
    height: 16,
    backgroundColor: '#2E2E3E',
    borderRadius: 4,
    marginVertical: 4,
  },
});

export default MainScreen;
