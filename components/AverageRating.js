import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AverageRating = ({ rating, count }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={
              star <= fullStars
                ? "star"
                : star === fullStars + 1 && hasHalfStar
                ? "star-half"
                : "star-outline"
            }
            size={16}
            color="#BB9AF7"
          />
        ))}
      </View>
      <Text style={styles.text}>{rating.toFixed(1)} ({count} reviews)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  text: {
    color: '#7AA2F7',
    fontSize: 14,
  },
});

export default AverageRating;
