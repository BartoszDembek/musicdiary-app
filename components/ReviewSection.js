import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { reviewService } from '../services/reviewService';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import ReviewModal from './ReviewModal';
import CommentsSection from './CommentsSection';
import AverageRating from './AverageRating';
import { colors } from '../theme';


const ReviewSection = ({ userId, itemId, type, artistName, itemName, image, reviews, averageRating }) => {
  const [userReview, setUserReview] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [activeReviewId, setActiveReviewId] = useState(null);
  const { user, updateUserProfile } = useAuth();

  useEffect(() => {
    loadReviews();
  }, [itemId]);

  const loadReviews = async () => {
    const reviewsData = await reviewService.getReviewsBySpotifyId(itemId, type);
    const userRev = reviewsData.find(r => r.user_id === userId);
    const otherReviews = reviewsData.filter(r => r.user_id !== userId);

    setUserReview(userRev);
    setAllReviews(otherReviews);

    if (userRev) {
      setRating(userRev.rating);
      setReview(userRev.text);
    }
  };

  const handleSave = async () => {
    try {
      await reviewService.saveReview(userId, itemId, review, type, rating, artistName, itemName, image);
      setIsModalVisible(false);
      loadReviews();
      if (user?.id) {
        const freshProfileData = await userService.getUserProfile(user.id);
        if (freshProfileData && freshProfileData[0]) {
          await updateUserProfile(freshProfileData[0]);
        }
      }
    } catch (error) {
      console.error('Error saving review:', error);
    }
  };

  const toggleComments = (id) => {
    setActiveReviewId(prev => prev === id ? null : id);
  };

  const allReviewsList = userReview ? [userReview, ...allReviews] : allReviews;

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <Text style={styles.sectionSubtitle}>
            {allReviewsList.length} recenzji od społeczności
          </Text>
        </View>
        {/* Rating Card */}
        <View style={styles.ratingCard}>
          <View style={styles.ratingContent}>
            <View style={styles.ratingValueContainer}>
              <Text style={styles.ratingValue}>{averageRating.toFixed(1)}</Text>
            </View>
            <View style={styles.ratingInfo}>
              <AverageRating rating={averageRating} count={reviews.length} />
            </View>
          </View>
        </View>
      </View>

      {/* Reviews Grid */}
      <View style={styles.reviewsGrid}>
        {allReviewsList.length > 0 ? (
          allReviewsList.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              {/* Review Header */}
              <View style={styles.reviewCardHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.avatarContainer}>
                    {review.users?.avatar && review.users.avatar !== "NULL" ? (
                      <Image
                        source={{ uri: review.users.avatar }}
                        style={styles.avatar}
                      />
                    ) : (
                      <Text style={styles.avatarText}>
                        {review.users?.username ? review.users.username[0].toUpperCase() : '?'}
                      </Text>
                    )}
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.username}>{review.users?.username || 'Anonymous'}</Text>
                    <Text style={styles.reviewDate}>
                      {new Date(review.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                {/* Rating Stars */}
                <View style={styles.ratingDisplay}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= review.rating ? "star" : "star-outline"}
                      size={14}
                      color="#BB9AF7"
                    />
                  ))}
                </View>
              </View>

              {/* Review Text */}
              <Text style={styles.reviewText} numberOfLines={3}>{review.text}</Text>

              {/* Review Footer */}
              <View style={styles.reviewCardFooter}>
                <Pressable 
                  style={styles.commentButton}
                  onPress={() => toggleComments(review.id)}
                >
                  <Ionicons name="chatbubble-outline" size={14} color="#7AA2F7" />
                  <Text style={styles.commentButtonText}>
                    {review.review_comments?.length || 0}
                  </Text>
                </Pressable>
              </View>

              {/* Comments Section */}
              {activeReviewId === review.id && (
                <CommentsSection 
                  comments={review.review_comments} 
                  reviewId={review.id}
                  userId={userId}
                />
              )}
            </View>
          ))
        ) : (
          <Pressable
            onPress={() => setIsModalVisible(true)}
            style={styles.addReviewPrompt}
          >
            <Ionicons name="add-circle-outline" size={24} color="#7AA2F7" />
            <Text style={styles.addReviewText}>Dodaj pierwszą recenzję</Text>
          </Pressable>
        )}
      </View>

      {/* Add Review Button (if no user review) */}
      {!userReview && (
        <Pressable
          onPress={() => setIsModalVisible(true)}
          style={styles.addReviewButtonMain}
        >
          <Ionicons name="add-circle-outline" size={24} color="#7AA2F7" />
          <Text style={styles.addReviewText}>Dodaj swoją recenzję</Text>
        </Pressable>
      )}

      {/* Review Modal */}
      <ReviewModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        rating={rating}
        setRating={setRating}
        review={review}
        setReview={setReview}
        onSave={handleSave}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 48,
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontFamily: 'Fraunces_700Bold',
    color: '#C0CAF5',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#565F89',
    marginTop: 4,
  },
  reviewsGrid: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: 'rgba(36, 23, 70, 0.85)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  reviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(187, 154, 247, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarText: {
    fontSize: 16,
    color: '#BB9AF7',
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
    gap: 2,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C0CAF5',
  },
  reviewDate: {
    fontSize: 12,
    color: '#565F89',
  },
  ratingDisplay: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    color: '#C0CAF5',
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(187, 154, 247, 0.1)',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 6,
  },
  commentButtonText: {
    fontSize: 12,
    color: '#7AA2F7',
  },
  addReviewPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: 'rgba(122, 162, 247, 0.1)',
    borderRadius: 16,
    gap: 12,
  },
  addReviewButtonMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(122, 162, 247, 0.15)',
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(122, 162, 247, 0.3)',
  },
  addReviewText: {
    color: '#7AA2F7',
    fontSize: 16,
    fontWeight: '500',
  },
  ratingCard: {
    backgroundColor: 'rgba(36, 23, 70, 0.85)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    minWidth: 140,
  },
  ratingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  ratingValue: {
    fontSize: 20,
    fontFamily: 'Fraunces_700Bold',
    color: colors.primary,
  },
  ratingInfo: {
    gap: 2,
  },
});

export default ReviewSection;