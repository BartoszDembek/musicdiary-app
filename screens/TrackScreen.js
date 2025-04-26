import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Alert, ScrollView, Pressable, Linking, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { spotifyService } from '../services/spotifyService';
import ReviewSection from '../components/ReviewSection';
import { useAuth } from '../context/AuthContext';
import AverageRating from '../components/AverageRating';
import { reviewService } from '../services/reviewService';
import { colors, commonStyles } from '../theme';

const TrackScreen = ({ route }) => {
  const { trackId } = route.params;
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const loadData = async () => {
    try {
      const [trackData, reviewsData] = await Promise.all([
        spotifyService.getTrackByID(trackId),
        reviewService.getReviewsBySpotifyId(trackId, 'song')
      ]);
      
      setTrack(trackData);
      setReviews(reviewsData || []);
      setAverageRating(reviewService.calculateAverageRating(reviewsData));
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
      loadData();
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
                <Ionicons name="arrow-back" size={24} color={colors.primary} />
              </Pressable>
              <Pressable onPress={openInSpotify} style={styles.iconButton}>
                <Entypo name="spotify" size={24} color={colors.spotify} />
              </Pressable>
            </View>
          </View>

          <Image source={{ uri: track.album.images[0].url }} style={styles.trackImage} />
          
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle}>{track.name}</Text>
            <AverageRating rating={averageRating} count={reviews.length} />
            <Pressable onPress={() => navigation.navigate('Artist', { artistId: track.artists[0].id })}>
              <Text style={styles.artistName}>
                {track.artists.map(artist => artist.name).join(', ')}
              </Text>
            </Pressable>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="time" size={20} color={colors.primary} />
                <Text style={styles.statText}>{formatDuration(track.duration_ms)}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="musical-note" size={20} color={colors.primary} />
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
    ...commonStyles.container
  },
  content: {
    ...commonStyles.content
  },
  header: {
    padding: 20,
  },
  headerButtons: {
    ...commonStyles.headerButtons
  },
  iconButton: {
    ...commonStyles.iconButton
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
    ...commonStyles.title
  },
  artistName: {
    fontSize: 18,
    color: colors.secondary,
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  statsContainer: {
    ...commonStyles.statsContainer
  },
  statItem: {
    ...commonStyles.statItem
  },
  statText: {
    ...commonStyles.statText
  },
  detailsContainer: {
    ...commonStyles.detailsContainer
  },
  sectionTitle: {
    ...commonStyles.sectionTitle
  },
  detailRow: {
    ...commonStyles.detailRow
  },
  detailLabel: {
    ...commonStyles.detailLabel
  },
  detailValue: {
    ...commonStyles.detailValue
  },
  albumLink: {
    color: colors.textPrimary,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  explicitTag: {
    backgroundColor: colors.tertiary,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  explicitText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  skeletonHeader: {
    ...commonStyles.skeletonHeader
  },
  skeletonContent: {
    alignItems: 'center',
  },
  skeletonImage: {
    ...commonStyles.skeletonImage
  },
  skeletonText: {
    ...commonStyles.skeletonText
  },
});

export default TrackScreen;
