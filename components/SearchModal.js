import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  TextInput, 
  StyleSheet, 
  Pressable,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spotifyService } from '../services/spotifyService';

const SearchModal = ({ visible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    artists: true,
    albums: true,
    tracks: true
  });

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsLoading(true);
        setError(null);
        try {
          const results = await spotifyService.search(searchQuery);
          setArtists(results?.artists?.items || []);
          setAlbums(results?.albums?.items || []);
          setTracks(results?.tracks?.items || []);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      } else {
        setArtists([]);
        setAlbums([]);
        setTracks([]);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderSectionHeader = (title, section, itemCount) => (
    <TouchableOpacity 
      onPress={() => toggleSection(section)}
      style={styles.sectionHeaderContainer}
    >
      <Text style={styles.sectionHeader}>
        {title} ({itemCount})
      </Text>
      <Ionicons 
        name={expandedSections[section] ? 'chevron-up' : 'chevron-down'} 
        size={24} 
        color="#BB9AF7" 
      />
    </TouchableOpacity>
  );

  const renderArtist = (item) => (
    <View style={styles.resultItem}>
      <Image 
        source={{ uri: item.images?.[0]?.url }} 
        style={styles.albumCover}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.titleText}>{item.name}</Text>
      </View>
    </View>
  );

  const renderAlbum = (item) => (
    <View style={styles.resultItem}>
      <Image 
        source={{ uri: item.images?.[0]?.url }} 
        style={styles.albumCover}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.titleText}>{item.name}</Text>
        <Text style={styles.artistText}>{item.artists?.[0]?.name}</Text>
      </View>
    </View>
  );

  const renderTrack = (item) => (
    <View style={styles.resultItem}>
      <Image 
        source={{ uri: item.album?.images?.[0]?.url }} 
        style={styles.albumCover}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.titleText}>{item.name}</Text>
        <Text style={styles.artistText}>
          {item.artists?.[0]?.name} • {item.album?.name}
        </Text>
      </View>
    </View>
  );

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
              placeholder="Search..."
              placeholderTextColor="#7A7C9E"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#BB9AF7" />
            </Pressable>
          </View>

          <ScrollView style={styles.resultsContainer}>
            {isLoading ? (
              <View style={styles.centerContent}>
                <ActivityIndicator color="#BB9AF7" size="large" />
              </View>
            ) : error ? (
              <View style={styles.centerContent}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : (
              <>
                {artists.length > 0 && (
                  <View style={styles.section}>
                    {renderSectionHeader('Artists', 'artists', artists.length)}
                    {expandedSections.artists && 
                      artists.map(item => (
                        <View key={`artist-${item.id}`}>
                          {renderArtist(item)}
                        </View>
                      ))
                    }
                  </View>
                )}

                {albums.length > 0 && (
                  <View style={styles.section}>
                    {renderSectionHeader('Albums', 'albums', albums.length)}
                    {expandedSections.albums && 
                      albums.map(item => (
                        <View key={`album-${item.id}`}>
                          {renderAlbum(item)}
                        </View>
                      ))
                    }
                  </View>
                )}

                {tracks.length > 0 && (
                  <View style={styles.section}>
                    {renderSectionHeader('Tracks', 'tracks', tracks.length)}
                    {expandedSections.tracks && 
                      tracks.map(item => (
                        <View key={`track-${item.id}`}>
                          {renderTrack(item)}
                        </View>
                      ))
                    }
                  </View>
                )}

                {!artists.length && !albums.length && !tracks.length && searchQuery.length > 2 && (
                  <View style={styles.centerContent}>
                    <Text style={styles.noResults}>No results found</Text>
                  </View>
                )}
              </>
            )}
          </ScrollView>
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
  section: {
    marginVertical: 5,
    backgroundColor: '#2A2A3E',
    borderRadius: 10,
    overflow: 'hidden',
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A4E',
  },
  resultItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  albumCover: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  itemInfo: {
    marginLeft: 15,
    flex: 1,
  },
  titleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  artistText: {
    color: '#7A7C9E',
    fontSize: 14,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  errorText: {
    color: '#F7768E',
    textAlign: 'center',
    margin: 20,
  },
  noResults: {
    color: '#7A7C9E',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  sectionHeader: {
    color: '#BB9AF7',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
    marginTop: 10,
  },
});

export default SearchModal;
