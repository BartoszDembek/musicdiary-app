import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Alert, ScrollView, Pressable, Linking, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { spotifyService } from '../services/spotifyService';
import ReviewSection from '../components/ReviewSection';
import { useAuth } from '../context/AuthContext';

const TrackScreen = ({ route }) => {
  const { trackId } = route.params;
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { user } = useAuth();

  const loadTrack = async () => {
    try {
      const response = await spotifyService.getTrackByID(trackId);
      setTrack(response);
    } catch (error) {
      Alert.alert("Error", "Failed to load track data");
    } finally {
      setLoading(false);
    }
  };

  const openInSpotify = () => {
    if (track?.external_urls?.spotify) {
      Linking.openURL(track.external_urls.spotify);
    }
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      loadTrack();
    }, [trackId])
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
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.headerButtons}>
              <Pressable onPress={() => navigation.goBack()} style={styles.iconButton}>
                <Ionicons name="arrow-back" size={24} color="#BB9AF7" />
              </Pressable>
              <Pressable onPress={openInSpotify} style={styles.iconButton}>
                <Entypo name="spotify" size={24} color="#1DB954" />
              </Pressable>
            </View>
          </View>

          <Image source={{ uri: track.album.images[0].url }} style={styles.trackImage} />
          
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle}>{track.name}</Text>
            <Pressable onPress={() => navigation.navigate('Artist', { artistId: track.artists[0].id })}>
              <Text style={styles.artistName}>
                {track.artists.map(artist => artist.name).join(', ')}
              </Text>
            </Pressable>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="time" size={20} color="#BB9AF7" />
                <Text style={styles.statText}>{formatDuration(track.duration_ms)}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="musical-note" size={20} color="#BB9AF7" />
                <Text style={styles.statText}>{track.popularity}% popularity</Text>
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.sectionTitle}>Track Details</Text>
              <Pressable 
                style={styles.detailRow}
                onPress={() => navigation.navigate('Album', { albumId: track.album.id })}
              >
                <Text style={styles.detailLabel}>Album</Text>
                <Text style={styles.albumLink}>{track.album.name}</Text>
              </Pressable>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Track Number</Text>
                <Text style={styles.detailValue}>{track.track_number} of {track.album.total_tracks}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Release Date</Text>
                <Text style={styles.detailValue}>{track.album.release_date}</Text>
              </View>
              {track.explicit && (
                <View style={styles.explicitTag}>
                  <Text style={styles.explicitText}>Explicit</Text>
                </View>
              )}
            </View>

            <ReviewSection userId={user?.id} itemId={trackId} type="song" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(187, 154, 247, 0.1)',
    borderRadius: 20,
  },
  trackImage: {
    width: '100%',
    height: 350,
    marginBottom: 20,
  },
  trackInfo: {
    padding: 20,
  },
  trackTitle: {
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
  albumLink: {
    color: '#C0CAF5',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  explicitTag: {
    backgroundColor: '#F7768E',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  explicitText: {
    color: '#1E1E2E',
    fontSize: 12,
    fontWeight: 'bold',
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

export default TrackScreen;
