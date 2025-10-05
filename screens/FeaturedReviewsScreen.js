import React, { useState, useEffect } from 'react';
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
// Mock data for featured reviews
const mockReviews = [
  {
    id: '1',
    itemName: 'The Dark Side of the Moon',
    artistName: 'Pink Floyd',
    type: 'album',
    rating: 5,
    reviewText: 'An absolute masterpiece that transcends time and genre. Every track flows seamlessly into the next, creating a cohesive journey through sound and emotion. The production quality is unmatched.',
    username: 'MusicLover92',
    createdAt: '2024-10-01T10:30:00Z',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe',
    albumId: 'album1'
  },
  {
    id: '2',
    itemName: 'Bohemian Rhapsody',
    artistName: 'Queen',
    type: 'track',
    rating: 5,
    reviewText: 'A revolutionary piece of music that defies categorization. Freddie Mercury\'s vocals are otherworldly, and the song structure is unlike anything before or since.',
    username: 'RockEnthusiast',
    createdAt: '2024-09-30T15:45:00Z',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a',
    trackId: 'track1'
  },
  {
    id: '3',
    itemName: 'Radiohead',
    artistName: 'Radiohead',
    type: 'artist',
    rating: 4,
    reviewText: 'Consistently innovative throughout their career. From OK Computer to In Rainbows, they\'ve never stopped pushing boundaries and challenging listeners.',
    username: 'IndieHead',
    createdAt: '2024-09-29T09:15:00Z',
    imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb604c49444a0c7c48cdc7b7cc',
    artistId: 'artist1'
  },
  {
    id: '4',
    itemName: 'Kind of Blue',
    artistName: 'Miles Davis',
    type: 'album',
    rating: 5,
    reviewText: 'The pinnacle of jazz music. Every musician on this record is at the top of their game. This album single-handedly defined cool jazz and modal jazz.',
    username: 'JazzAficionado',
    createdAt: '2024-09-28T20:00:00Z',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b273e8b066f70c206551210d902b',
    albumId: 'album2'
  },
  {
    id: '5',
    itemName: 'Billie Jean',
    artistName: 'Michael Jackson',
    type: 'track',
    rating: 4,
    reviewText: 'The perfect pop song. Infectious bassline, incredible vocals, and a music video that changed everything. Still sounds fresh after all these years.',
    username: 'PopCritic',
    createdAt: '2024-09-27T12:30:00Z',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b2734a8d81263b91b3dcbd8f5b9e',
    trackId: 'track2'
  }
];

const FeaturedReviewsScreen = ({ navigation }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFeaturedReviews();
  }, []);

  const loadFeaturedReviews = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setReviews(mockReviews);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading featured reviews:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setReviews([...mockReviews].sort(() => Math.random() - 0.5)); // Shuffle reviews
      setRefreshing(false);
    }, 1500);
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
    if (review.albumId) {
      navigation.navigate('Album', { albumId: review.albumId });
    } else if (review.artistId) {
      navigation.navigate('Artist', { artistId: review.artistId });
    } else if (review.trackId) {
      navigation.navigate('Track', { trackId: review.trackId });
    }
  };

  const renderReviewItem = ({ item }) => (
    <TouchableOpacity
      style={styles.reviewCard}
      onPress={() => navigateToItem(item)}
    >
      <View style={styles.reviewHeader}>
        <View style={styles.itemInfo}>
          {item.imageUrl && (
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
          )}
          <View style={styles.itemDetails}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.itemName}
            </Text>
            <Text style={styles.itemArtist} numberOfLines={1}>
              {item.artistName}
            </Text>
            <Text style={styles.itemType}>
              {item.type === 'album' ? 'Album' : item.type === 'track' ? 'Track' : 'Artist'}
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
          {item.reviewText}
        </Text>
      </View>

      <View style={styles.reviewFooter}>
        <View style={styles.userInfo}>
          <Ionicons name="person-circle" size={20} color="#CDD6F4" />
          <Text style={styles.username}>{item.username}</Text>
        </View>
        <Text style={styles.reviewDate}>
          {new Date(item.createdAt).toLocaleDateString('en-US')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BB9AF7" />
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
      </View>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={renderReviewItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#BB9AF7"
            colors={['#BB9AF7']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#6C7086" />
            <Text style={styles.emptyText}>No reviews to display</Text>
            <Text style={styles.emptySubtext}>
              Check back later or add your first review
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
    backgroundColor: '#1E1E2E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E2E',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#414868',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#CDD6F4',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#9399B2',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  reviewCard: {
    backgroundColor: '#313244',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#414868',
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
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CDD6F4',
    marginBottom: 2,
  },
  itemArtist: {
    fontSize: 14,
    color: '#9399B2',
    marginBottom: 2,
  },
  itemType: {
    fontSize: 12,
    color: '#BB9AF7',
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
    color: '#CDD6F4',
  },
  reviewContent: {
    marginBottom: 12,
  },
  reviewText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#CDD6F4',
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#414868',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 14,
    color: '#9399B2',
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
    color: '#CDD6F4',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9399B2',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default FeaturedReviewsScreen;