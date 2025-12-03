import React, { useState } from 'react';
import { View, Image, Alert, ScrollView, Pressable, Text, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { spotifyService } from '../services/spotifyService';
import { followService } from '../services/followService';
import { userService } from '../services/userService';
import ArtistStats from '../components/artist/ArtistStats';
import ArtistGenres from '../components/artist/ArtistGenres';
import TopTracks from '../components/artist/TopTracks';
import ArtistAlbums from '../components/artist/ArtistAlbums';
import { useAuth } from '../context/AuthContext';
import { colors, commonStyles } from '../theme';

const ArtistScreen = ({ route }) => {
  const { artistId } = route.params;
  const { userProfile, user, updateUserProfile } = useAuth();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowed, setIsFollowed] = useState(false);
  const navigation = useNavigation();

  const checkIfFollowed = () => {
    if (userProfile?.follows?.[0]?.follow && Array.isArray(userProfile.follows[0].follow)) {
      const isArtistFollowed = userProfile.follows[0].follow.some(item => item.id === artistId);
      setIsFollowed(isArtistFollowed);
    } else {
      setIsFollowed(false);
    }
  };

  const loadArtistData = async () => {
    try {
      const [artistData, albumsData, tracksData] = await Promise.all([
        spotifyService.getArtistByID(artistId),
        spotifyService.getArtistAlbums(artistId),
        spotifyService.getArtistTopTracks(artistId),
      ]);

      setArtist(artistData);
      setAlbums(albumsData.items);
      setTopTracks(tracksData.tracks);
      checkIfFollowed();
    } catch (error) {
      Alert.alert("Error", "Failed to load artist data");
    } finally {
      setLoading(false);
    }
  };

  const openInSpotify = () => {
    if (artist?.external_urls?.spotify) {
      Linking.openURL(artist.external_urls.spotify);
    }
  };

  const handleFollow = async () => {
    try {
      let updatedProfile;
      const artistName = artist.name;
      if (isFollowed) {
        updatedProfile = await followService.unfollowArtist(user.id, artistId);
      } else {
        updatedProfile = await followService.followArtist(user.id, artistId, artistName);
      }
      
      if (updatedProfile) {
        // Fetch fresh user profile data
        const freshProfileData = await userService.getUserProfile(user.id);
        if (freshProfileData && freshProfileData[0]) {
          await updateUserProfile(freshProfileData[0]);
          setIsFollowed(!isFollowed);
        }
      }
    } catch (error) {
      Alert.alert("Error", isFollowed ? "Failed to unfollow artist" : "Failed to follow artist");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      loadArtistData();
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
          <View style={styles.headerButtons}>
            <Pressable onPress={() => navigation.goBack()} style={styles.iconButton}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </Pressable>
            <View style={styles.rightButtons}>
              <Pressable 
                onPress={handleFollow} 
                style={[styles.followButton, isFollowed && styles.followingButton]}
              >
                <Ionicons 
                  name={isFollowed ? "checkmark" : "add"} 
                  size={18} 
                  color={isFollowed ? colors.primary : colors.background} 
                />
                <Text style={[styles.followButtonText, isFollowed && styles.followingText]}>
                  {isFollowed ? "Following" : "Follow"}
                </Text>
              </Pressable>
              <Pressable onPress={() => navigation.navigate('UserLists', { 
                userId: user.id, 
                mode: 'select',
                itemToAdd: {
                  spotify_id: artistId,
                  item_name: artist.name,
                  artist_name: artist.name,
                  type: 'artist',
                  cover: artist.images[0]?.url
                }
              })} style={styles.iconButton}>
                <Ionicons name="list" size={24} color={colors.primary} />
              </Pressable>
              <Pressable onPress={openInSpotify} style={styles.iconButton}>
                <Entypo name="spotify" size={24} color={colors.spotify} />
              </Pressable>
            </View>
          </View>
        </View>

        <Image source={{ uri: artist.images[0]?.url }} style={styles.artistImage} />
        
        <View style={styles.artistInfo}>
          <Text style={styles.artistName}>{artist.name}</Text>
          
          <ArtistStats followers={artist.followers.total} popularity={artist.popularity} />
          <ArtistGenres genres={artist.genres} />
          <TopTracks tracks={topTracks} />
          <ArtistAlbums albums={albums} />
        </View>
      </ScrollView>
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
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  followingButton: {
    backgroundColor: colors.surface,
  },
  followButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
  followingText: {
    color: colors.primary,
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
    color: colors.primary,
    marginBottom: 20,
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

export default ArtistScreen;
