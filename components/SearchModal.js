import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  TextInput, 
  StyleSheet, 
  Pressable,
  Text 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchModal = ({ visible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.searchHeader}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for albums..."
              placeholderTextColor="#7A7C9E"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#BB9AF7" />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1E1E2E',
    marginTop: 60,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#2E2E3E',
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#fff',
  },
  closeButton: {
    padding: 5,
  },
});

export default SearchModal;
