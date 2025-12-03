import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, ScrollView, TouchableOpacity, Pressable, Linking, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { spotifyService } from '../services/spotifyService';
import { favoriteService } from '../services/favoriteService';
import { userService } from '../services/userService';
import ReviewSection from '../components/ReviewSection';
import { useAuth } from '../context/AuthContext';
import AverageRating from '../components/AverageRating';
import { reviewService } from '../services/reviewService';
import { colors, commonStyles } from '../theme';

const AlbumScreen = ({ route }) => {
  const { userProfile, user, updateUserProfile } = useAuth();
  const { albumId } = route.params;
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation();

  const checkIfFavorite = () => {
    if (userProfile?.favorites?.[0]?.favorite && Array.isArray(userProfile.favorites[0].favorite)) {
      const isAlbumFavorited = userProfile.favorites[0].favorite.some(item => item.id === albumId);
      setIsFavorite(isAlbumFavorited);
    } else {
      setIsFavorite(false);
    }
  };

  const loadData = async () => {
    try {
      const [albumData, reviewsData] = await Promise.all([
        spotifyService.getAlbumByID(albumId),
        reviewService.getReviewsBySpotifyId(albumId, 'album')
      ]);
      
      setAlbum(albumData);
      setReviews(reviewsData || []);
      setAverageRating(reviewService.calculateAverageRating(reviewsData));
      checkIfFavorite();
    } catch (error) {
      Alert.alert("Error", "Failed to load album data");
    } finally {
      setLoading(false);
    }
  };

  const openInSpotify = () => {
    if (album?.external_urls?.spotify) {
      Linking.openURL(album.external_urls.spotify);
    }
  };

  const handleFavorite = async () => {
    setIsFavorite(!isFavorite);
    try {
      let updatedProfile;
      const artistName = album.artists.map(artist => artist.name).join(', ');
      const albumName = album.name;
      if (isFavorite) {
        updatedProfile = await favoriteService.removeFavorite(user.id, albumId);
      } else {
        updatedProfile = await favoriteService.addFavorite(user.id, albumId, artistName, albumName);
      }
          
      if (updatedProfile) {
        // Fetch fresh user profile data
        const freshProfileData = await userService.getUserProfile(user.id);
        if (freshProfileData && freshProfileData[0]) {
          await updateUserProfile(freshProfileData[0]);
          setIsFavorite(!isFavorite);
        }
      }
    } catch (error) {
      Alert.alert("Error", isFavorite ? "Failed to remove from favorites" : "Failed to add to favorites");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      loadData();
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
              <View style={styles.rightButtons}>
                <Pressable onPress={() => navigation.navigate('UserLists', { 
                  userId: user.id, 
                  mode: 'select',
                  itemToAdd: {
                    spotify_id: albumId,
                    item_name: album.name,
                    type: 'album',
                    artist_name: album.artists.map(a => a.name).join(', '),
                    cover: album.images[0]?.url
                  }
                })} style={styles.iconButton}>
                  <Ionicons name="list" size={24} color={colors.primary} />
                </Pressable>
                <Pressable onPress={handleFavorite} style={styles.iconButton}>
                  <Ionicons 
                    name={isFavorite ? "heart" : "heart-outline"} 
                    size={24} 
                    color={isFavorite ? colors.tertiary : colors.primary} 
                  />
                </Pressable>
                <Pressable onPress={openInSpotify} style={styles.iconButton}>
                  <Entypo name="spotify" size={24} color={colors.spotify} />
                </Pressable>
              </View>
            </View>
          </View>

          <Image source={{ uri: album.images[0].url }} style={styles.albumImage} />
          
          <View style={styles.albumInfo}>
            <Text style={styles.albumTitle}>{album.name}</Text>
            <AverageRating rating={averageRating} count={reviews.length} />
            <Pressable onPress={() => navigation.navigate('Artist', { artistId: album.artists[0].id })}>
              <Text style={styles.artistName}>
                {album.artists.map(artist => artist.name).join(', ')}
              </Text>
            </Pressable>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="musical-notes" size={20} color={colors.primary} />
                <Text style={styles.statText}>{album.total_tracks} tracks</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="calendar" size={20} color={colors.primary} />
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

            <ReviewSection 
              userId={user?.id} 
              itemId={albumId} 
              type="album" 
              artistName={album.artists.map(artist => artist.name).join(', ')}
              itemName={album.name}
            />
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
  rightButtons: {
    flexDirection: 'row',
    gap: 10,
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
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  genreTag: {
    backgroundColor: colors.border,
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  genreText: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  skeletonHeader: {
    ...commonStyles.skeletonHeader
  },
  skeletonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonImage: {
    ...commonStyles.skeletonImage
  },
  skeletonText: {
    ...commonStyles.skeletonText
  },
});

export default AlbumScreen;
