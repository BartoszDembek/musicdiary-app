import React from 'react';
import { Modal, View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReviewModal = ({ visible, onClose, rating, setRating, review, setReview, onSave }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss();
        onClose();
      }}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={styles.modalContainer}
            keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
          >
            <View style={styles.modalContent}>
              <View style={styles.dragIndicator} />
              <ScrollView 
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.header}>
                  <Text style={styles.title}>Write Review</Text>
                  <Pressable onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#7AA2F7" />
                  </Pressable>
                </View>

                <Text style={styles.label}>Rating</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Pressable
                      key={star}
                      onPress={() => setRating(star)}
                      style={styles.starButton}
                    >
                      <Ionicons
                        name={star <= rating ? "star" : "star-outline"}
                        size={32}
                        color="#BB9AF7"
                      />
                    </Pressable>
                  ))}
                </View>

                <Text style={styles.label}>Your thoughts</Text>
                <TextInput
                  style={styles.input}
                  multiline
                  value={review}
                  onChangeText={setReview}
                  placeholder="Share your thoughts about this..."
                  placeholderTextColor="#414868"
                />
              </ScrollView>

              <Pressable onPress={onSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Review</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E1E2E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#414868',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#BB9AF7',
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  label: {
    fontSize: 16,
    color: '#7AA2F7',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  starButton: {
    padding: 8,
  },
  scrollContent: {
    flexGrow: 1,
  },
  input: {
    backgroundColor: '#2D2D44',
    color: '#C0CAF5',
    padding: 16,
    borderRadius: 12,
    minHeight: 100,
    maxHeight: 150,
    textAlignVertical: 'top',
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#BB9AF7',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  saveButtonText: {
    color: '#1E1E2E',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReviewModal;
