import React, { useState, useEffect, useRef } from 'react';
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
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spotifyService } from '../services/spotifyService';

const { height } = Dimensions.get('window');

const SearchModal = ({ visible, onClose, navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: height,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }).start();
    }
  }, [visible, slideAnim]);

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

  const handleItemPress = (item, type) => {
    if (!item?.id) {
      console.error('No item ID found:', item);
      return;
    }
    
    try {
      setSearchQuery('');
      onClose();
      setTimeout(() => {
        if (type === 'artists') {
          navigation.navigate('Artist', { artistId: item.id });
        } else if (type === 'albums') {
          navigation.navigate('Album', { albumId: item.id });
        } else if (type === 'tracks') {
          navigation.navigate('Track', { trackId: item.id });
        }
      }, 100);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const hasAny = artists.length > 0 || albums.length > 0 || tracks.length > 0;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.searchHeader}>
            <Ionicons name="search" size={20} color="#E0AAFF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Szukaj utworów, albumów, artystów…"
              placeholderTextColor="#BFB3FF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#E0AAFF" />
            </Pressable>
          </View>

          <ScrollView 
            style={styles.resultsContainer}
            showsVerticalScrollIndicator={false}
          >
            {!searchQuery.trim() && (
              <Text style={styles.placeholderText}>
                Zacznij pisać, aby wyszukać w MusicDiary.
              </Text>
            )}

            {searchQuery.trim() && !hasAny && !isLoading && (
              <Text style={styles.placeholderText}>
                Brak wyników dla „{searchQuery}”.
              </Text>
            )}

            {isLoading ? (
              <View style={styles.centerContent}>
                <ActivityIndicator color="#E0AAFF" size="large" />
              </View>
            ) : error ? (
              <View style={styles.centerContent}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : (
              <>
                {artists.length > 0 && (
                  <Section title="Artyści">
                    {artists.map((a) => (
                      <TouchableOpacity
                        key={a.id}
                        style={styles.resultItem}
                        onPress={() => handleItemPress(a, 'artists')}
                      >
                        {a.images?.[0]?.url ? (
                          <Image
                            source={{ uri: a.images[0].url }}
                            style={styles.itemImage}
                          />
                        ) : (
                          <View style={[styles.itemImage, styles.placeholderImage]}>
                            <Ionicons name="person" size={20} color="#BFB3FF" />
                          </View>
                        )}
                        <View style={styles.itemInfo}>
                          <Text style={styles.itemTitle} numberOfLines={1}>
                            {a.name}
                          </Text>
                          <Text style={styles.itemSubtitle} numberOfLines={1}>
                            Artysta
                          </Text>
                        </View>
                        <Ionicons name="person" size={16} color="#BFB3FF" />
                      </TouchableOpacity>
                    ))}
                  </Section>
                )}

                {albums.length > 0 && (
                  <Section title="Albumy">
                    {albums.map((a) => (
                      <TouchableOpacity
                        key={a.id}
                        style={styles.resultItem}
                        onPress={() => handleItemPress(a, 'albums')}
                      >
                        {a.images?.[0]?.url ? (
                          <Image
                            source={{ uri: a.images[0].url }}
                            style={styles.itemImage}
                          />
                        ) : (
                          <View style={[styles.itemImage, styles.placeholderImage]}>
                            <Ionicons name="disc" size={20} color="#BFB3FF" />
                          </View>
                        )}
                        <View style={styles.itemInfo}>
                          <Text style={styles.itemTitle} numberOfLines={1}>
                            {a.name}
                          </Text>
                          <Text style={styles.itemSubtitle} numberOfLines={1}>
                            Album · {a.artists?.[0]?.name}
                          </Text>
                        </View>
                        <Ionicons name="disc" size={16} color="#BFB3FF" />
                      </TouchableOpacity>
                    ))}
                  </Section>
                )}

                {tracks.length > 0 && (
                  <Section title="Utwory">
                    {tracks.map((s) => (
                      <TouchableOpacity
                        key={s.id}
                        style={styles.resultItem}
                        onPress={() => handleItemPress(s, 'tracks')}
                      >
                        {s.album?.images?.[0]?.url ? (
                          <Image
                            source={{ uri: s.album.images[0].url }}
                            style={styles.itemImage}
                          />
                        ) : (
                          <View style={[styles.itemImage, styles.placeholderImage]}>
                            <Ionicons name="musical-notes" size={20} color="#BFB3FF" />
                          </View>
                        )}
                        <View style={styles.itemInfo}>
                          <Text style={styles.itemTitle} numberOfLines={1}>
                            {s.name}
                          </Text>
                          <Text style={styles.itemSubtitle} numberOfLines={1}>
                            Utwór · {s.artists?.[0]?.name}
                          </Text>
                        </View>
                        <Ionicons name="musical-notes" size={16} color="#BFB3FF" />
                      </TouchableOpacity>
                    ))}
                  </Section>
                )}
              </>
            )}
          </ScrollView>
        </Animated.View>
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
    backgroundColor: 'rgba(36, 23, 70, 0.85)',
    marginTop: 50,
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 0,
    borderWidth: 1,
    borderColor: 'rgba(199, 125, 255, 0.22)',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(199, 125, 255, 0.36)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
  },
  resultsContainer: {
    flex: 1,
    padding: 8,
    maxHeight: '60%',
  },
  placeholderText: {
    color: '#BFB3FF',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
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
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#E0AAFF',
    fontSize: 17,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#24283B',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemSubtitle: {
    color: '#BFB3FF',
    fontSize: 12,
  },
});

export default SearchModal;
