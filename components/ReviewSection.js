import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { reviewService } from '../services/reviewService';
import ReviewModal from './ReviewModal';

const ReviewSection = ({ userId,itemId, type }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    loadReview();
  }, [itemId]);

  const loadReview = async () => {
    const savedReview = await reviewService.getReview(itemId, type);
    if (savedReview) {
      setRating(savedReview.rating);
      setReview(savedReview.text);
    }
  };

  const handleSave = async () => {
    await reviewService.saveReview(userId, itemId, review, type, rating);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Review</Text>
        <Pressable 
          onPress={() => setIsModalVisible(true)} 
          style={styles.editButton}
        >
          <Ionicons name="create" size={24} color="#7AA2F7" />
        </Pressable>
      </View>

      {(rating > 0 || review) ? (
        <View style={styles.content}>
          <View style={styles.ratingDisplay}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= rating ? "star" : "star-outline"}
                size={20}
                color="#BB9AF7"
              />
            ))}
          </View>
          {review && (
            <Text style={styles.reviewText}>{review}</Text>
          )}
        </View>
      ) : (
        <Pressable 
          onPress={() => setIsModalVisible(true)}
          style={styles.addReviewButton}
        >
          <Ionicons name="add-circle-outline" size={24} color="#7AA2F7" />
          <Text style={styles.addReviewText}>Add your review</Text>
        </Pressable>
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
    backgroundColor: 'rgba(187, 154, 247, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(187, 154, 247, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    color: '#BB9AF7',
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
  },
  content: {
    backgroundColor: '#2D2D44',
    padding: 16,
    borderRadius: 12,
  },
  ratingDisplay: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewText: {
    color: '#C0CAF5',
    fontSize: 16,
    lineHeight: 24,
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
});

export default ReviewSection;
