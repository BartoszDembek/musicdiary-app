import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, commonStyles } from '../theme';
import { userService } from '../services/userService';

const FollowerItem = ({ follower }) => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInfo = async () => {
      const targetId = follower.user_id || follower.id;
      if (targetId) {
        const info = await userService.getFollowerInfo(targetId);
        if (info) {
          setUserInfo(info);
        }
      }
      setLoading(false);
    };
    loadInfo();
  }, [follower]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <View style={styles.listItem}>
        <View style={[styles.avatarContainer, { backgroundColor: colors.skeleton }]} />
        <View style={styles.itemContent}>
          <View style={{ width: '60%', height: 16, backgroundColor: colors.skeleton, marginBottom: 8, borderRadius: 4 }} />
          <View style={{ width: '40%', height: 12, backgroundColor: colors.skeleton, borderRadius: 4 }} />
        </View>
      </View>
    );
  }

  const displayUsername = userInfo?.username || follower.user_name || 'Unknown user';
  const displayAvatar = userInfo?.avatar || follower.avatar;

  return (
    <Pressable 
      style={styles.listItem}
      onPress={() => {
        const targetId = follower.user_id || follower.id;
        if (targetId) {
          navigation.navigate('UserProfile', { userId: targetId });
        }
      }}
    >
      <View style={styles.avatarContainer}>
        {displayAvatar && displayAvatar !== "NULL" ? (
          <Image 
            source={{ uri: displayAvatar }} 
            style={styles.avatarImage}
          />
        ) : (
          <Text style={styles.avatarText}>
            {displayUsername ? displayUsername[0].toUpperCase() : '?'}
          </Text>
        )}
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{displayUsername}</Text>
        {follower.createdAt && (
          <Text style={styles.dateText}>Following since {formatDate(follower.createdAt)}</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
    </Pressable>
  );
};

const FollowingItem = ({ following }) => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const isArtist = following.artist_name;

  useEffect(() => {
    const loadInfo = async () => {
      if (!isArtist) {
        const targetId = following.id;
        if (targetId) {
           const info = await userService.getFollowerInfo(targetId);
           if (info) {
             setUserInfo(info);
           }
        }
      }
      setLoading(false);
    };
    loadInfo();
  }, [following, isArtist]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <View style={styles.listItem}>
        <View style={[styles.avatarContainer, { backgroundColor: colors.skeleton }]} />
        <View style={styles.itemContent}>
          <View style={{ width: '60%', height: 16, backgroundColor: colors.skeleton, marginBottom: 8, borderRadius: 4 }} />
          <View style={{ width: '40%', height: 12, backgroundColor: colors.skeleton, borderRadius: 4 }} />
        </View>
      </View>
    );
  }

  let displayName = 'Unknown';
  let displayImage = null;
  let typeLabel = 'User';

  if (isArtist) {
      displayName = following.artist_name;
      displayImage = following.image_url;
      typeLabel = 'Artist';
  } else {
      displayName = userInfo?.username || 'Unknown user';
      displayImage = userInfo?.avatar || null;
      typeLabel = 'User';
  }

  return (
      <Pressable 
        style={styles.listItem}
        onPress={() => {
          if (isArtist && following.id) {
            navigation.navigate('Artist', { artistId: following.id });
          } else {
            const targetId = following.user_id || following.id;
            if (targetId) {
              navigation.navigate('UserProfile', { userId: targetId });
            }
          }
        }}
      >
        {displayImage && displayImage !== "NULL" ? (
          <Image 
            source={{ uri: displayImage }} 
            style={isArtist ? styles.artistImage : styles.avatarImage}
          />
        ) : (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {displayName ? displayName[0].toUpperCase() : '?'}
            </Text>
          </View>
        )}
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>
            {displayName}
          </Text>
          <Text style={styles.itemSubtitle}>
            {typeLabel}
          </Text>
          {following.createdAt && (
            <Text style={styles.dateText}>Following since {formatDate(following.createdAt)}</Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
      </Pressable>
  );
};

const StatsDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { type, data, title } = route.params;
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = newest first, 'asc' = oldest first

  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const dataCopy = [...data];
    return dataCopy.sort((a, b) => {
      const dateA = new Date(a.created_at || a.createdAt);
      const dateB = new Date(b.created_at || b.createdAt);
      
      return sortOrder === 'desc' 
        ? dateB - dateA  // Newest first
        : dateA - dateB; // Oldest first
    });
  }, [data, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const renderReviewItem = (review) => (
    <Pressable 
      key={review.id} 
      style={styles.listItem}
      onPress={() => {
        if (review.spotify_id) {
          if (review.types === 'album') {
            navigation.navigate('Album', { albumId: review.spotify_id });
          } else if (review.types === 'song' || review.types === 'track') {
            navigation.navigate('Track', { trackId: review.spotify_id });
          }
        }
      }}
    >
      {review.image ? (
        <Image 
          source={{ uri: review.image }} 
          style={styles.favoriteImage}
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons name="musical-notes" size={32} color={colors.textSecondary} />
        </View>
      )}
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{review.item_name || 'Unknown'}</Text>
        <Text style={styles.itemSubtitle}>{review.artist_name || 'Unknown artist'}</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= review.rating ? 'star' : 'star-outline'}
              size={16}
              color={colors.primary}
            />
          ))}
        </View>
        {review.review_text && (
          <Text style={styles.reviewText} numberOfLines={2}>
            {review.review_text}
          </Text>
        )}
        <Text style={styles.dateText}>{formatDate(review.created_at)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
    </Pressable>
  );

  const renderFavoriteItem = (favorite) => {
    const getTypeLabel = (type) => {
      switch (type) {
        case 'album': return 'Album';
        case 'track': return 'Track';
        case 'song': return 'Track';
        case 'artist': return 'Artist';
        default: return 'Item';
      }
    };

    return (
      <Pressable 
        key={favorite.id} 
        style={styles.listItem}
        onPress={() => {
          console.log('Favorite item pressed:', favorite);
          if (favorite.id) {
            if (favorite.types === 'album') {
              navigation.navigate('Album', { albumId: favorite.id });
            } else if (favorite.types === 'song') {
              navigation.navigate('Track', { trackId: favorite.id });
            }
          }
        }}
      >
        {favorite.image_url ? (
          <Image 
            source={{ uri: favorite.image_url }} 
            style={styles.favoriteImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="musical-notes" size={32} color={colors.textSecondary} />
          </View>
        )}
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{favorite.item_name || 'Unknown'}</Text>
          <Text style={styles.itemSubtitle}>
            {favorite.artist_name || 'Unknown artist'} • {getTypeLabel(favorite.type)}
          </Text>
          {favorite.createdAt && (
            <Text style={styles.dateText}>Added {formatDate(favorite.createdAt)}</Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
      </Pressable>
    );
  };

  const renderContent = () => {
    if (!sortedData || sortedData.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name={
              type === 'reviews' ? 'document-text-outline' :
              type === 'followers' ? 'people-outline' :
              type === 'following' ? 'person-add-outline' :
              'heart-outline'
            } 
            size={64} 
            color={colors.textSecondary} 
          />
          <Text style={styles.emptyText}>No {type} yet</Text>
        </View>
      );
    }

    switch (type) {
      case 'reviews':
        return sortedData.map(renderReviewItem);
      case 'followers':
        return sortedData.map((follower) => <FollowerItem key={follower.id} follower={follower} />);
      case 'following':
        return sortedData.map((following) => <FollowingItem key={following.id} following={following} />);
      case 'favorites':
        return sortedData.map(renderFavoriteItem);
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
        <Pressable 
          onPress={toggleSortOrder}
          style={styles.sortButton}
        >
          <Ionicons 
            name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'} 
            size={24} 
            color={colors.primary} 
          />
        </Pressable>
      </View>

      {sortedData && sortedData.length > 0 && (
        <View style={styles.sortInfoContainer}>
          <Text style={styles.sortInfoText}>
            {sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}
          </Text>
        </View>
      )}

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {renderContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  header: {
    ...commonStyles.header,
  },
  headerTitle: {
    ...commonStyles.headerTitle,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  sortButton: {
    padding: 8,
    width: 40,
  },
  sortInfoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sortInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: 4,
    lineHeight: 20,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  artistImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  favoriteImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
});

export default StatsDetailScreen;
