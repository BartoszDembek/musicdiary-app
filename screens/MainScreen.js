import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Pressable, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spotifyService } from '../services/spotifyService';
import RenderAlbumCard from '../components/RenderAlbumCard';
import SearchModal from '../components/SearchModal';
import { colors, commonStyles } from '../theme';

const MainScreen = ({ navigation }) => {  
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
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
        <Pressable onPress={() => setIsSearchVisible(true)} style={styles.searchButton}>
          <Ionicons name="search" size={24} color={colors.primary} />
        </Pressable>
      </View>
      
      <Text style={styles.subtitle}>New Releases</Text>

      <SearchModal 
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
        navigation={navigation}
      />

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
    ...commonStyles.container
  },
  header: {
    ...commonStyles.header
  },
  headerTitle: {
    ...commonStyles.headerTitle
  },
  searchButton: {
    ...commonStyles.iconButton
  },
  subtitle: {
    ...commonStyles.subtitle
  },
  content: {
    ...commonStyles.content
  },
  gridContainer: {
    ...commonStyles.gridContainer
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
    backgroundColor: colors.primaryLight,
  },
  skeletonImage: {
    backgroundColor: colors.skeleton,
  },
  skeletonText: {
    height: 16,
    backgroundColor: colors.skeleton,
    borderRadius: 4,
    marginVertical: 4,
  },
});

export default MainScreen;
