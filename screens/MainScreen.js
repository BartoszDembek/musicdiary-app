import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { spotifyService } from '../services/spotifyService';

const MainScreen = () => {
  const [albums, setAlbums] = useState([]);
  
  const loadAlbums = async () => {
    try {
      const response = await spotifyService.loadAlbums();
      let img = [];
      response['albums']['items'].forEach(element => {
        img.push(element['images'][0]["url"]);
      });
      setAlbums(img);
    } catch (error) {
      Alert.alert(
        "Błąd",
        "Nie udało się sprawdzić statusu weryfikacji",
        [{ text: "OK" }]
      );
    }
  };

  useEffect(() => {
    loadAlbums();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MusicDiary</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.albumContainer}>
          {albums.map((album, index) => (
            <Image key={index} source={{ uri: album }} style={styles.albumImage} />
          ))}
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  albumContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 20,
  },
  albumImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
});

export default MainScreen;
