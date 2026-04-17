import React from 'react';
import { Pressable, Image, StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const RenderAlbumCard = ({ album, index, style }) => {
  const navigation = useNavigation();
  const cover = album.cover || album.url;
  const title = album.title || album.name;
  const artistName = typeof album.artist === 'string' ? album.artist : album.artist?.name;
  const genre = album.genre || 'Music';

  return (
    <Pressable
      key={index}
      testID={`album-card-${index}`}
      onPress={() => navigation.push('Album', { albumId: album.id })}
      style={[styles.card, style]}
    >
      <View style={styles.mediaWrapper}>
        <Image source={{ uri: cover }} style={styles.albumImage} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(16,0,43,0.9)', 'rgba(36, 0, 70, 0.2)', 'transparent']}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={styles.overlay}
        />
        <View style={styles.genreBadge}>
          <Text style={styles.genreText}>{genre.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.metaContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {artistName}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#140523',
    shadowColor: '#8b66ff',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 34,
    elevation: 10,
  },
  mediaWrapper: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
  },
  albumImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  genreBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(36, 23, 70, 0.75)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(199, 125, 255, 0.22)',
  },
  genreText: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#E0AAFF',
    fontWeight: '600',
  },
  metaContainer: {
    paddingHorizontal: 4,
    paddingTop: 12,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  artist: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
});

export default RenderAlbumCard;
