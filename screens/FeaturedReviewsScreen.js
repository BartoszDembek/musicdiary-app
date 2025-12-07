import React, { useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { reviewService } from '../services/reviewService';
import { userService } from '../services/userService';
import { colors } from '../theme/colors';

const FeaturedReviewsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'following'
  const [followingList, setFollowingList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user?.id])
  );

  // Filter reviews whenever activeTab, reviews, or followingList changes
  React.useEffect(() => {
    filterReviews();
  }, [activeTab, reviews, followingList]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadFeaturedReviews(),
        loadUserProfile()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    if (!user?.id) return;
    try {
      const profileData = await userService.getUserProfile(user.id);
      // Assuming profileData[0] contains the user profile and 'following' array
      // Adjust based on actual API response structure
      if (profileData && profileData[0] && profileData[0].following) {
        setFollowingList(profileData[0].following);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadFeaturedReviews = async () => {
    try {
      const data = await reviewService.getFeaturedReviews();
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading featured reviews:', error);
      setReviews([]);
    }
  };

  const filterReviews = () => {
    if (!user) return;

    let filtered = [];
    
    // Helper to get review author ID
    const getAuthorId = (review) => {
      if (review.users && (review.users._id || review.users.id)) {
        return review.users._id || review.users.id;
      }
      if (typeof review.userId === 'object' && review.userId) {
        return review.userId._id || review.userId.id;
      }
      return review.userId;
    };

    // First, filter out current user's reviews from all lists
    const notMyReviews = reviews.filter(review => getAuthorId(review) !== user.id);

    if (activeTab === 'all') {
      filtered = notMyReviews;
    } else {
      // Filter for following
      // Check if followingList contains objects with userId or just IDs
      // Assuming followingList is array of objects with userId property based on typical structure
      // or array of strings. We'll handle both.
      const followingIds = followingList.map(f => (typeof f === 'object' ? f.userId : f));
      
      filtered = notMyReviews.filter(review => 
        followingIds.includes(getAuthorId(review))
      );
    }

    setFilteredReviews(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color="#FFD700"
        />
      );
    }
    return stars;
  };

  const navigateToItem = (review) => {
    const itemType = review.types;
    const itemId = review.spotify_id;

    if (!itemId) return;

    if (itemType === 'album') {
      navigation.navigate('Album', { albumId: itemId });
    }else if (itemType === 'song') {
      navigation.navigate('Track', { trackId: itemId });
    }
  };

  const navigateToUser = (review) => {
    const userId = review.users?.id;
    if (userId) {
      navigation.navigate('UserProfile', { userId });
    }
  };

  const renderReviewItem = ({ item }) => (
    <TouchableOpacity
      style={styles.reviewCard}
      onPress={() => navigateToItem(item)}
    >
      <View style={styles.reviewHeader}>
        <View style={styles.itemInfo}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.itemImage} />
          ) : (
            <View style={[styles.itemImage, styles.itemImagePlaceholder]}>
              <Ionicons name="musical-note" size={24} color={colors.primary} />
            </View>
          )}
          <View style={styles.itemDetails}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.item_name}
            </Text>
            <Text style={styles.itemArtist} numberOfLines={1}>
              {item.artist_name}
            </Text>
            <Text style={styles.itemType}>
              {item.types === 'album' ? 'Album' : item.types === 'track' ? 'Track' : 'Artist'}
            </Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>
            {renderStars(item.rating)}
          </View>
          <Text style={styles.ratingText}>{item.rating}/5</Text>
        </View>
      </View>

      <View style={styles.reviewContent}>
        <Text style={styles.reviewText} numberOfLines={3}>
          {item.text}
        </Text>
      </View>

      <View style={styles.reviewFooter}>
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => navigateToUser(item)}
        >
          {item.users?.avatar ? (
            <Image source={{ uri: item.users.avatar }} style={styles.userAvatar} />
          ) : (
            <View style={[styles.userAvatar, styles.userAvatarPlaceholder]}>
              <Text style={styles.userAvatarText}>
                {item.users?.username ? item.users.username.slice(0, 2).toUpperCase() : '??'}
              </Text>
            </View>
          )}
          <Text style={styles.username}>{item.users?.username || 'User'}</Text>
        </TouchableOpacity>
        <Text style={styles.reviewDate}>
          {item.created_at ? new Date(item.created_at).toLocaleDateString('pl-PL') : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing && reviews.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Featured Reviews</Text>
        <Text style={styles.headerSubtitle}>
          Latest reviews from the community
        </Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'following' && styles.activeTab]}
            onPress={() => setActiveTab('following')}
          >
            <Text style={[styles.tabText, activeTab === 'following' && styles.activeTabText]}>Following</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredReviews}
        keyExtractor={(item) => item._id || item.id || Math.random().toString()}
        renderItem={renderReviewItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#6C7086" />
            <Text style={styles.emptyText}>No reviews to display</Text>
            <Text style={styles.emptySubtext}>
              {activeTab === 'following' 
                ? "Follow users to see their reviews here" 
                : "Check back later or add your first review"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  reviewCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemImagePlaceholder: {
    backgroundColor: colors.primaryMedium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  itemArtist: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  itemType: {
    fontSize: 12,
    color: colors.primary,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  ratingContainer: {
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  reviewContent: {
    marginBottom: 12,
  },
  reviewText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  userAvatarPlaceholder: {
    backgroundColor: colors.primaryMedium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
  },
  username: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  reviewDate: {
    fontSize: 12,
    color: '#6C7086',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default FeaturedReviewsScreen;