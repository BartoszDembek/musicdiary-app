import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { reviewService } from '../services/reviewService';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import ReviewModal from './ReviewModal';
import CommentsSection from './CommentsSection';
import VoteSection from './VoteSection';

const ReviewItem = ({ review, isUserReview, onEdit, showComments, onToggleComments, userId }) => {
  const navigation = useNavigation();
  
  const handleAvatarPress = () => {
    if (review.user_id === userId) {
      // Navigate to user's own profile (tab navigator)
      navigation.navigate('Profile');
    } else {
      // Navigate to other user's profile
      navigation.navigate('UserProfile', { userId: review.user_id });
    }
  };

  return (
    <View style={[styles.reviewItem, isUserReview && styles.userReviewItem]}>
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <Pressable 
            style={styles.avatarContainer}
            onPress={handleAvatarPress}
          >
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
          </Pressable>
          <View style={styles.userDetails}>
            <Text style={styles.username}>{review.users?.username || 'Anonymous'}</Text>
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
        </View>
        {isUserReview && (
          <Pressable onPress={onEdit} style={styles.editButton}>
            <Ionicons name="create" size={20} color="#7AA2F7" />
          </Pressable>
        )}
      </View>
      <Text style={styles.reviewText}>{review.text}</Text>

      <View style={styles.reviewFooter}>
        <Text style={styles.reviewDate}>
          {new Date(review.created_at).toLocaleDateString()}
        </Text>

        <View style={styles.actionsContainer}>
          <VoteSection reviewId={review.id} userId={userId} />

          <Pressable
            style={[styles.commentButton, showComments && styles.activeCommentButton]}
            onPress={onToggleComments}
          >
            <Ionicons
              name={showComments ? "chatbubble" : "chatbubble-outline"}
              size={18}
              color={showComments ? "#BB9AF7" : "#7AA2F7"}
            />
            <Text style={[styles.commentText, showComments && { color: "#BB9AF7" }]}>
              {showComments ? "Close" : ""}
            </Text>
          </Pressable>
        </View>
      </View>

      {showComments && (
        <CommentsSection 
          comments={review.review_comments} 
          reviewId={review.id}
          userId={userId}
        />
      )}
    </View>
  );
};

const ReviewSection = ({ userId, itemId, type, artistName, itemName,image }) => {
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
    const reviews = await reviewService.getReviewsBySpotifyId(itemId, type);
    const userRev = reviews.find(r => r.user_id === userId);
    const otherReviews = reviews.filter(r => r.user_id !== userId);

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

  const renderReviewList = () => {
    let reviewsToList = [];
    if (userReview) {
      reviewsToList.push({ ...userReview, isUser: true });
    }
    reviewsToList = [...reviewsToList, ...allReviews.map(r => ({ ...r, isUser: false }))];

    if (activeReviewId) {
      const activeIndex = reviewsToList.findIndex(r => r.id === activeReviewId);
      if (activeIndex > -1) {
        const [active] = reviewsToList.splice(activeIndex, 1);
        reviewsToList.unshift(active);
      }
    }

    const activeReview = activeReviewId ? reviewsToList.find(r => r.id === activeReviewId) : null;
    const restReviews = reviewsToList.filter(r => r.id !== activeReviewId);

    return (
      <>
        {activeReview && (
          <ReviewItem
            review={activeReview}
            isUserReview={activeReview.isUser}
            onEdit={() => setIsModalVisible(true)}
            showComments={true}
            onToggleComments={() => toggleComments(activeReview.id)}
            userId={userId}
          />
        )}

        {!userReview && (
          <Pressable
            onPress={() => setIsModalVisible(true)}
            style={[styles.addReviewButton, activeReview && { marginTop: 12 }]}
          >
            <Ionicons name="add-circle-outline" size={24} color="#7AA2F7" />
            <Text style={styles.addReviewText}>Add your review</Text>
          </Pressable>
        )}

        {restReviews.map((item, index) => (
          <View key={item.id}>
            {(index > 0 || activeReview || !userReview) && <View style={styles.divider} />}
            <ReviewItem
              review={item}
              isUserReview={item.isUser}
              onEdit={() => setIsModalVisible(true)}
              showComments={false}
              onToggleComments={() => toggleComments(item.id)}
              userId={userId}
            />
          </View>
        ))}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Reviews</Text>
        {renderReviewList()}
      </View>

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
    marginTop: 25,
  },
  section: {
    backgroundColor: 'rgba(187, 154, 247, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(187, 154, 247, 0.1)',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    color: '#BB9AF7',
    fontWeight: '600',
    marginBottom: 16,
  },
  reviewItem: {
    backgroundColor: '#2D2D44',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  userReviewItem: {
    borderColor: '#7AA2F7',
    borderWidth: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(187, 154, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
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
    gap: 4,
  },
  username: {
    color: '#C0CAF5',
    fontSize: 15,
    fontWeight: '600',
  },
  ratingDisplay: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    color: '#C0CAF5',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  reviewDate: {
    color: '#565F89',
    fontSize: 12,
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(122, 162, 247, 0.1)',
    borderRadius: 12,
    gap: 8,
  },
  addReviewText: {
    color: '#7AA2F7',
    fontSize: 16,
    fontWeight: '500',
  },
  editButton: {
    padding: 4,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(187, 154, 247, 0.1)',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 4,
  },
  commentText: {
    color: '#7AA2F7',
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(187, 154, 247, 0.1)',
    marginVertical: 16,
  },

});

export default ReviewSection;