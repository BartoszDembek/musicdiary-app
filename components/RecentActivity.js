import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../theme';

const RecentActivity = ({ follows, reviews, favorites, review_comments }) => {
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else if (diffDays <= 14) {
      return 'a week ago';
    } else if (diffDays <= 30) {
      return `${Math.ceil(diffDays / 7)} weeks ago`;
    } else {
      return `${Math.ceil(diffDays / 30)} months ago`;
    }
  };

  const getRecentReviews = () => {
    if (!reviews || !Array.isArray(reviews)) return [];
    
    return reviews
      .filter(review => review.created_at)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 4)
      .map(review => ({
        id: review.id,
        title: review.item_name || 'Unknown item',
        subtitle: `Reviewed · ${formatDate(review.created_at)}`,
        rating: review.rating || 5
      }));
  };

  const recentReviews = getRecentReviews();

  return (
    <View style={styles.activitySection}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.activityList}>
        {recentReviews.length > 0 ? (
          recentReviews.map((review) => (
            <View key={review.id} style={styles.activityItem}>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle} numberOfLines={1}>
                  {review.title}
                </Text>
                <Text style={styles.activitySubtitle}>
                  {review.subtitle}
                </Text>
              </View>
              <Text style={styles.activityRating}>★ {review.rating}.0</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noActivityText}>No recent activity</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activitySection: {
    marginTop: 40, // mt-10
  },
  sectionTitle: {
    fontSize: 24, // zmniejszone z 28
    color: colors.textPrimary,
    fontFamily: 'Fraunces_700Bold',
    marginBottom: 16, // mb-4
  },
  activityList: {
    gap: 12, // space-y-3
  },
  activityItem: {
    backgroundColor: 'rgba(36, 23, 70, 0.85)', // glass
    borderRadius: 16, // rounded-2xl
    paddingHorizontal: 16, // px-4
    paddingVertical: 12, // py-3
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activityContent: {
    flex: 1,
    minWidth: 0, // min-w-0
  },
  activityTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500', // font-medium
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12, // text-xs
    color: colors.textSecondary,
  },
  activityRating: {
    fontSize: 12, // text-xs
    color: colors.mauve || colors.primary, // text-mauve
  },
  noActivityText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
});

export default RecentActivity;
