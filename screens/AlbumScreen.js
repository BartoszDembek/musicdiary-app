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
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#BB9AF7" />
        </Pressable>
        <Text style={styles.headerTitle}>{album.name}</Text>
        <Text style={styles.headerArtist}>{album.artists.map(artist => artist.name).join(', ')}</Text>
      </View>
      <ScrollView style={styles.content}>
        <Image source={{ uri: album.images[0].url }} style={styles.albumImage} />
        <View style={styles.albumDetails}>
          <Text style={styles.albumInfo}>Typ: {album.album_type}</Text>
          <Text style={styles.albumInfo}>Data wydania: {album.release_date}</Text>
          <Text style={styles.albumInfo}>Ilość piosenek: {album.total_tracks}</Text>
          <Text style={styles.albumInfo}>Gatunki: {album.genres.join(', ')}</Text>
          <Text style={styles.albumInfo}>Label: {album.label}</Text>
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
  header: {
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#414868',
  },
  backButton: {
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BB9AF7',
  },
  headerArtist: {
    fontSize: 18,
    color: '#C0CAF5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  albumImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 20,
  },
  albumDetails: {
    flex: 1,
  },
  albumInfo: {
    fontSize: 16,
    color: '#C0CAF5',
    marginBottom: 10,
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
