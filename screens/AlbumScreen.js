import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, ScrollView, TouchableOpacity, Pressable, Linking, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { spotifyService } from '../services/spotifyService';
import { favoriteService } from '../services/favoriteService';
import { userService } from '../services/userService';
import ReviewSection from '../components/ReviewSection';
import { useAuth } from '../context/AuthContext';
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
        updatedProfile = await favoriteService.addFavorite(user.id, albumId, artistName, albumName, 'album', album.images[0]?.url);
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
          {/* Header with Back Button and Actions */}
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </Pressable>
            <View style={styles.headerActions}>
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
              })} style={styles.headerActionButton}>
                <Ionicons name="list" size={24} color={colors.primary} />
              </Pressable>
              <Pressable onPress={handleFavorite} style={styles.headerActionButton}>
                <Ionicons 
                  name={isFavorite ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isFavorite ? colors.tertiary : colors.primary} 
                />
              </Pressable>
              <Pressable onPress={openInSpotify} style={styles.headerActionButton}>
                <Entypo name="spotify" size={24} color={colors.spotify} />
              </Pressable>
            </View>
          </View>

          {/* Main Content Container */}
          <View style={styles.mainContainer}>
            {/* Grid Layout: Album Image + Info */}
            <View style={styles.gridContainer}>
              {/* Album Image */}
              <View style={styles.imageWrapper}>
                <Image source={{ uri: album.images[0].url }} style={styles.albumImage} />
              </View>

              {/* Album Info */}
              <View style={styles.albumInfoContainer}>
                <Text style={styles.genreLabel}>
                  Album · {album.genres[0] || 'Music'}
                </Text>
                <Text style={styles.albumTitle}>{album.name}</Text>
                
                <Pressable onPress={() => navigation.navigate('Artist', { artistId: album.artists[0].id })}>
                  <Text style={styles.artistLink}>
                    {album.artists.map(artist => artist.name).join(', ')}
                  </Text>
                </Pressable>

                {/* Release Info */}
                <View style={styles.metaContainer}>
                  <Text style={styles.metaText}>{album.release_date}</Text>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.metaText}>{album.total_tracks} utworów</Text>
                </View>
              </View>
            </View>

            {/* Album Details */}
            <View style={styles.detailsSection}>
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

            {/* Review Section */}
            <ReviewSection 
              userId={user?.id} 
              itemId={albumId} 
              type="album" 
              artistName={album.artists.map(artist => artist.name).join(', ')}
              itemName={album.name}
              image={album.images[0]?.url}
              reviews={reviews}
              averageRating={averageRating}
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 48,
    alignItems: 'flex-start',
  },
  imageWrapper: {
    position: 'relative',
    width: 160,
    height: 160,
  },
  albumImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: colors.card,
    shadowColor: 'rgba(187, 154, 247, 0.6)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 16,
  },
  albumInfoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    minWidth: 0,
  },
  genreLabel: {
    fontSize: 12,
    color: colors.mauve || colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  albumTitle: {
    fontSize: 32,
    fontFamily: 'Fraunces_700Bold',
    color: colors.textPrimary,
    marginBottom: 8,
    lineHeight: 36,
  },
  artistLink: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
    textDecorationLine: 'underline',
    opacity: 0.9,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  metaDot: {
    color: colors.textSecondary,
  },
  detailsSection: {
    marginBottom: 48,
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
