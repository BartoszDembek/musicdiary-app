import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Pressable, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Disc3 from '../components/Disc3';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spotifyService } from '../services/spotifyService';
import RenderAlbumCard from '../components/RenderAlbumCard';
import SearchModal from '../components/SearchModal';
import GradientText from '../components/GradientText';
import { colors, commonStyles } from '../theme';

const MainScreen = ({ navigation }) => {  
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;
  const columnCount = screenWidth >= 1024 ? 4 : screenWidth >= 768 ? 3 : 2;
  const cardWidth = (screenWidth - 32 - (columnCount - 1) * 16) / columnCount;
  
  const loadAlbums = async () => {
    setLoading(true);
    try {
      const response = await spotifyService.loadAlbums();
      let img = [];
      response['albums']['items'].forEach(element => {
        img.push({ 
          id: element['id'], 
          url: element['images'][0]["url"],
          name: element['name'],
          artist: element['artists'][0]['name']
        });
      });
      setAlbums(img);
    } catch (error) {
      Alert.alert(
        "Error",
        "Could not load albums",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlbums();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerWrapper}>
        <View style={styles.headerInner}>
          <Pressable style={styles.brandLink} onPress={() => {}}>
            <LinearGradient
              colors={["#10002B", "#3C096C", "#7B2CBF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.brandBadge}
            >
              <Disc3 size={20} color={colors.mauve} strokeWidth={1.5} />
            </LinearGradient>
            <View style={styles.brandTitle}>
              <Text style={styles.brandText}>Music</Text>
              <GradientText style={[styles.brandText, styles.brandTextGradient]}>Diary</GradientText>
            </View>
          </Pressable>
          <Pressable testID="search-button" onPress={() => setIsSearchVisible(true)} style={styles.searchButton}>
            <Ionicons name="search" size={24} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>New Releases</Text>
        </View>
      </View>

      <SearchModal 
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
        navigation={navigation}
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.gridContainer}>
            {[1,2,3,4,5,6].map(i => (
              <View key={i} style={[styles.albumCard, styles.skeletonCard]}>
                <View style={[styles.albumImage, styles.skeletonImage]} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {albums.map((album, index) => (
              <RenderAlbumCard
                key={album.id || index}
                album={album}
                index={index}
                style={[styles.cardItem, { width: cardWidth }]}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container
  },
  header: {
    ...commonStyles.header
  },
  headerTitle: {
    ...commonStyles.headerTitle
  },
  searchButton: {
    ...commonStyles.iconButton
  },
  subtitle: {
    ...commonStyles.subtitle
  },
  content: {
    ...commonStyles.content
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  cardItem: {
    marginBottom: 20,
  },
  albumCard: {
    width: 115,
    borderRadius: 8,
    overflow: 'hidden',
  },
  albumImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  skeletonCard: {
    backgroundColor: colors.primaryLight,
  },
  skeletonImage: {
    backgroundColor: colors.skeleton,
  },
  skeletonText: {
    height: 16,
    backgroundColor: colors.skeleton,
    borderRadius: 4,
    marginVertical: 4,
  },
  headerWrapper: {
    backgroundColor: colors.glass,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(199, 125, 255, 0.22)',
    shadowColor: colors.mauve,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
    overflow: 'hidden',
  },
  headerInner: {
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.mauve,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  brandText: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '700',
    color: colors.foreground,
    marginLeft: 10,
  },
  brandTextGradient: {
    color: colors.primary,
  },
  brandTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 16,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 38,
    fontWeight: '700',
    color: colors.foreground,
  },
});

export default MainScreen;
