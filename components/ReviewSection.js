import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { reviewService } from '../services/reviewService';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import ReviewModal from './ReviewModal';

const ReviewItem = ({ review, isUserReview, onEdit }) => (
  <View style={[styles.reviewItem, isUserReview && styles.userReviewItem]}>
    <View style={styles.reviewHeader}>
      <View style={styles.ratingDisplay}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= review.rating ? "star" : "star-outline"}
            size={16}
            color="#BB9AF7"
          />
        ))}
      </View>
      {isUserReview && (
        <Pressable onPress={onEdit} style={styles.editButton}>
          <Ionicons name="create" size={20} color="#7AA2F7" />
        </Pressable>
      )}
    </View>
    <Text style={styles.reviewText}>{review.text}</Text>
    <Text style={styles.reviewDate}>
      {new Date(review.created_at).toLocaleDateString()}
    </Text>
  </View>
);

const ReviewSection = ({ userId, itemId, type, artistName, itemName }) => {
  const [userReview, setUserReview] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
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
      await reviewService.saveReview(userId, itemId, review, type, rating, artistName, itemName);
      setIsModalVisible(false);
      loadReviews(); // Reload reviews after saving
      
      // Update user profile after saving review
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

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Your Review</Text>
        {userReview ? (
          <ReviewItem 
            review={userReview} 
            isUserReview={true} 
            onEdit={() => setIsModalVisible(true)}
          />
        ) : (
          <Pressable 
            onPress={() => setIsModalVisible(true)}
            style={styles.addReviewButton}
          >
            <Ionicons name="add-circle-outline" size={24} color="#7AA2F7" />
            <Text style={styles.addReviewText}>Add your review</Text>
          </Pressable>
        )}
      </View>

      {allReviews.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.title}>Other Reviews</Text>
          <FlatList
            data={allReviews}
            renderItem={({ item }) => (
              <ReviewItem review={item} isUserReview={false} />
            )}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
      )}

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
    alignItems: 'center',
    marginBottom: 8,
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
});

export default ReviewSection;
