import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VoteSection = () => {
  const [vote, setVote] = useState(0); // 0: none, 1: up, -1: down

  const handleVote = (type) => {
    if (type === 'up') {
      setVote(prev => prev === 1 ? 0 : 1);
    } else {
      setVote(prev => prev === -1 ? 0 : -1);
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
          {12 + (vote === 1 ? 1 : 0)}
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
          {3 + (vote === -1 ? 1 : 0)}
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
