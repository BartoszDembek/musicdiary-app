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

  const getRecentActivity = () => {
    const activities = [];

    // Add reviews
    if (reviews && Array.isArray(reviews)) {
      reviews.forEach(review => {
        activities.push({
          type: 'review',
          data: review,
          created_at: review.created_at,
          title: `Reviewed ${review.item_name || 'an album'}`,
          subtitle: review.artist_name || 'Unknown artist'
        });
      });
    }

    // Add follows
    if (follows && follows[0] && Array.isArray(follows[0].follow)) {
      follows[0].follow.forEach(follow => {
        activities.push({
          type: 'follow',
          data: follow,
          created_at: follow.createdAt,
          title: `Following ${follow.artist_name || 'an artist'}`,
          subtitle: 'Artist'
        });
      });
    }

    // Add favorites
    if (favorites && favorites[0] && Array.isArray(favorites[0].favorite)) {
      favorites[0].favorite.forEach(favorite => {
        activities.push({
          type: 'favorite',
          data: favorite,
          created_at: favorite.createdAt,
          title: `Added to favorites: ${favorite.item_name || 'item'}`,
          subtitle: favorite.artist_name || 'Unknown artist'
        });
      });
    }

    // Add review comments
    if (review_comments && Array.isArray(review_comments)) {
      review_comments.forEach(comment => {
        activities.push({
          type: 'comment',
          data: comment,
          created_at: comment.created_at,
          title: `Commented on a review`,
        });
      });
    }

    // Sort by created_at (newest first)
    return activities
      .filter(activity => activity.created_at)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5); // Show only latest 10 activities
  };

  const getIconName = (type) => {
    switch (type) {
      case 'review':
        return 'document-text';
      case 'follow':
        return 'person-add';
      case 'favorite':
        return 'heart';
      case 'comment':
        return 'chatbubble';
      default:
        return 'star';
    }
  };

  const recentActivities = getRecentActivity();
  return (
    <View style={styles.activityContainer}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {recentActivities.length > 0 ? (
        recentActivities.map((activity, index) => (
          <View key={`${activity.type}-${activity.data.id || index}`} style={styles.activityItem}>
            <Ionicons 
              name={getIconName(activity.type)} 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>
                {activity.title}
              </Text>
              <Text style={styles.activitySubtitle}>
                {activity.subtitle}
              </Text>
              <Text style={styles.activityDate}>
                {formatDate(activity.created_at)}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noActivityText}>No recent activity</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  activityContainer: {
    padding: 20,
  },
  sectionTitle: {
    ...commonStyles.sectionTitle
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityContent: {
    marginLeft: 12,
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: colors.textSecondary,
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
