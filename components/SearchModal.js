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
      <View style={styles.sectionHeaderLeft}>
        <Ionicons 
          name={section === 'artists' ? 'person' : section === 'albums' ? 'disc' : 'musical-notes'} 
          size={20} 
          color="#BB9AF7" 
          style={styles.sectionIcon}
        />
        <Text style={styles.sectionHeader}>
          {title}
        </Text>
      </View>
      <View style={styles.sectionHeaderRight}>
        <Text style={styles.itemCount}>{itemCount}</Text>
        <Ionicons 
          name={expandedSections[section] ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color="#7A7C9E" 
        />
      </View>
    </TouchableOpacity>
  );

  const renderItem = (item, type) => {
    const imageUrl = type === 'tracks' 
      ? item.album?.images?.[0]?.url 
      : item.images?.[0]?.url;

    return (
      <TouchableOpacity style={styles.resultItem}>
        {imageUrl ? (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.albumCover}
          />
        ) : (
          <View style={[styles.albumCover, styles.placeholderCover]}>
            <Ionicons 
              name={type === 'artists' ? 'person' : 'musical-note'} 
              size={24} 
              color="#7A7C9E" 
            />
          </View>
        )}
        <View style={styles.itemInfo}>
          <Text style={styles.titleText} numberOfLines={1}>
            {item.name}
          </Text>
          {type !== 'artists' && (
            <Text style={styles.artistText} numberOfLines={1}>
              {type === 'tracks' 
                ? `${item.artists?.[0]?.name} • ${item.album?.name}`
                : item.artists?.[0]?.name
              }
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
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
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#7A7C9E" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for music..."
                placeholderTextColor="#7A7C9E"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#BB9AF7" />
            </Pressable>
          </View>

          <ScrollView 
            style={styles.resultsContainer}
            showsVerticalScrollIndicator={false}
          >
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
                          {renderItem(item, 'artists')}
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
                          {renderItem(item, 'albums')}
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
                          {renderItem(item, 'tracks')}
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#1A1B26',
    marginTop: 50,
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 15,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 15,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#24283B',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#24283B',
    borderRadius: 10,
  },
  section: {
    marginBottom: 15,
    backgroundColor: '#24283B',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1B26',
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIcon: {
    marginRight: 8,
  },
  itemCount: {
    color: '#7A7C9E',
    fontSize: 14,
    fontWeight: '600',
  },
  resultItem: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1B26',
  },
  albumCover: {
    width: 55,
    height: 55,
    borderRadius: 8,
    backgroundColor: '#24283B', // Adding background color for placeholder
  },
  itemInfo: {
    marginLeft: 12,
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  artistText: {
    color: '#7A7C9E',
    fontSize: 14,
  },
  sectionHeader: {
    color: '#BB9AF7',
    fontSize: 17,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  noResults: {
    color: '#7A7C9E',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#F7768E',
    textAlign: 'center',
    margin: 20,
  },
  placeholderCover: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#24283B',
  },
});

export default SearchModal;
