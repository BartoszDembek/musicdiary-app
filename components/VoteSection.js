import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { reviewService } from '../services/reviewService';

const VoteSection = ({ reviewId, userId }) => {
  const [vote, setVote] = useState(0); // 0: none, 1: up, -1: down
  const [scores, setScores] = useState({ upvotes: 0, downvotes: 0 });

  useEffect(() => {
    const fetchScores = async () => {
      if (reviewId) {
        const data = await reviewService.getReviewScore(reviewId);
        if (data) {
          const upvotes = Array.isArray(data.upvotes) ? data.upvotes : [];
          const downvotes = Array.isArray(data.downvotes) ? data.downvotes : [];
          
          let userVote = 0;
          if (userId) {
             const hasUpvoted = upvotes.some(id => String(id) === String(userId));
             const hasDownvoted = downvotes.some(id => String(id) === String(userId));

             if (hasUpvoted) userVote = 1;
             else if (hasDownvoted) userVote = -1;
          }
          
          setVote(userVote);

          // Store base scores (excluding current user's vote)
          setScores({ 
            upvotes: upvotes.length - (userVote === 1 ? 1 : 0), 
            downvotes: downvotes.length - (userVote === -1 ? 1 : 0) 
          });
        }
      }
    };
    fetchScores();
  }, [reviewId, userId]);

  const handleVote = async (type) => {
    // Optimistic update
    if (type === 'up') {
      setVote(prev => prev === 1 ? 0 : 1);
    } else {
      setVote(prev => prev === -1 ? 0 : -1);
    }

    await reviewService.voteReview(userId, reviewId, type);
    
    // Refresh scores
    const data = await reviewService.getReviewScore(reviewId);
    if (data) {
        const upvotes = Array.isArray(data.upvotes) ? data.upvotes : [];
        const downvotes = Array.isArray(data.downvotes) ? data.downvotes : [];
        
        // Re-calculate user vote from server response to be sure
        let userVote = 0;
        if (userId) {
            const hasUpvoted = upvotes.some(id => String(id) === String(userId));
            const hasDownvoted = downvotes.some(id => String(id) === String(userId));
            if (hasUpvoted) userVote = 1;
            else if (hasDownvoted) userVote = -1;
        }
        
        // Update base scores
        setScores({ 
            upvotes: upvotes.length - (userVote === 1 ? 1 : 0), 
            downvotes: downvotes.length - (userVote === -1 ? 1 : 0) 
        });
    }
  };

  return (
    <View style={styles.voteContainer}>
      <View style={styles.voteButtonContainer}>
        <Pressable
          style={styles.actionButton}
          onPress={() => handleVote('up')}
        >
          <Ionicons
            name={vote === 1 ? "add-circle" : "add-circle-outline"}
            size={20}
            color={vote === 1 ? "#7AA2F7" : "#565F89"}
          />
        </Pressable>
        <Text style={[styles.voteCount, vote === 1 && { color: "#7AA2F7" }]}>
          {scores.upvotes + (vote === 1 ? 1 : 0)}
        </Text>
      </View>

      <View style={styles.voteButtonContainer}>
        <Pressable
          style={styles.actionButton}
          onPress={() => handleVote('down')}
        >
          <Ionicons
            name={vote === -1 ? "remove-circle" : "remove-circle-outline"}
            size={20}
            color={vote === -1 ? "#F7768E" : "#565F89"}
          />
        </Pressable>
        <Text style={[styles.voteCount, vote === -1 && { color: "#F7768E" }]}>
          {scores.downvotes + (vote === -1 ? 1 : 0)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 20,
    padding: 4,
    gap: 12,
  },
  voteButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButton: {
    padding: 4,
  },
  voteCount: {
    color: '#C0CAF5',
    fontSize: 14,
    fontWeight: '600',
    minWidth: 16,
    textAlign: 'center',
  },
});

export default VoteSection;
