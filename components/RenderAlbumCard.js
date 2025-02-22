import React from 'react';
import { Pressable, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RenderAlbumCard = ({ album, index }) => {
  const navigation = useNavigation();

  return (
    <Pressable 
      key={index} 
      onPress={() => navigation.push('Album', { albumId: album.id })}
      style={styles.albumCard}
    >
      <Image source={{ uri: album.url }} style={styles.albumImage} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
});

export default RenderAlbumCard;
