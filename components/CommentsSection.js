import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MOCK_COMMENTS = [
  { id: 1, user: 'Alice', text: 'Totally agree with this!', date: '2024-03-10' },
  { id: 2, user: 'Bob', text: 'Interesting perspective.', date: '2024-03-11' },
  { id: 3, user: 'Charlie', text: 'I think you missed a point about the production.', date: '2024-03-12' },
];

const CommentsSection = () => {
  return (
    <View style={styles.commentsSection}>
      <ScrollView style={styles.commentsList} nestedScrollEnabled={true}>
        {MOCK_COMMENTS.map((comment) => (
          <View key={comment.id} style={styles.commentItem}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentUser}>{comment.user}</Text>
              <Text style={styles.commentDate}>{comment.date}</Text>
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
        />
        <Pressable style={styles.sendCommentButton}>
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
