import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { reviewService } from '../services/reviewService';

const CommentsSection = ({ comments = [], reviewId, userId }) => {
  const [localComments, setLocalComments] = useState(comments);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    
    try {
      const result = await reviewService.addComment(reviewId, userId, commentText);
      if (result) {
        setCommentText('');
        const newComments = await reviewService.getComments(reviewId);
        if (newComments) {
          setLocalComments(newComments);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  return (
    <View style={styles.commentsSection}>
      <ScrollView style={styles.commentsList} nestedScrollEnabled={true}>
        {localComments.map((comment) => (
          <View key={comment.id} style={styles.commentItem}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentUser}>{comment.username}</Text>
              <Text style={styles.commentDate}>{new Date(comment.created_at).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.commentContent}>{comment.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.addCommentContainer}>
        <TextInput
          placeholder="Write a comment..."
          placeholderTextColor="#565F89"
          style={styles.commentInput}
          value={commentText}
          onChangeText={setCommentText}
        />
        <Pressable style={styles.sendCommentButton} onPress={handleAddComment}>
          <Ionicons name="send" size={16} color="#1E1E2E" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(187, 154, 247, 0.1)',
  },
  commentsList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  commentItem: {
    marginBottom: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 12,
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentUser: {
    color: '#BB9AF7',
    fontWeight: '600',
    fontSize: 12,
  },
  commentDate: {
    color: '#565F89',
    fontSize: 10,
  },
  commentContent: {
    color: '#C0CAF5',
    fontSize: 14,
  },
  addCommentContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 8,
    color: '#C0CAF5',
  },
  sendCommentButton: {
    backgroundColor: '#BB9AF7',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CommentsSection;
