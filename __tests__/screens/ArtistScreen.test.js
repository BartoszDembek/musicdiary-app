import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ArtistScreen from '../../screens/ArtistScreen';
import { spotifyService } from '../../services/spotifyService';
import { useAuth } from '../../context/AuthContext';

// Mock dependencies
jest.mock('../../services/spotifyService');
jest.mock('../../services/followService');
jest.mock('../../services/userService');
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: (props) => <View {...props} />,
    Entypo: (props) => <View {...props} />,
  };
});
jest.mock('@expo/vector-icons/Entypo', () => {
  const { View } = require('react-native');
  const MockEntypo = (props) => <View {...props} />;
  return {
    __esModule: true,
    default: MockEntypo,
  };
});
jest.mock('expo-font');
jest.mock('expo-modules-core', () => ({
  EventEmitter: jest.fn(),
  NativeModulesProxy: {},
  ProxyNativeModule: jest.fn(),
}));
jest.mock('../../context/AuthContext');
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
}));
jest.mock('../../components/artist/ArtistStats', () => {
  const { View, Text } = require('react-native');
  return () => <View><Text>Artist Stats</Text></View>;
});
jest.mock('../../components/artist/ArtistGenres', () => {
  const { View, Text } = require('react-native');
  return () => <View><Text>Artist Genres</Text></View>;
});
jest.mock('../../components/artist/TopTracks', () => {
  const { View, Text } = require('react-native');
  return () => <View><Text>Top Tracks</Text></View>;
});
jest.mock('../../components/artist/ArtistAlbums', () => {
  const { View, Text } = require('react-native');
  return () => <View><Text>Artist Albums</Text></View>;
});

// Mock useFocusEffect
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  const React = require('react');
  return {
    ...actualNav,
    useFocusEffect: (callback) => React.useEffect(callback, []),
    useNavigation: () => ({
      setOptions: jest.fn(),
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

describe('ArtistScreen', () => {
  const mockRoute = { params: { artistId: '456' } };
  const mockUser = { id: 1 };
  const mockUserProfile = { follows: [{ follow: [] }] };

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: mockUser,
      userProfile: mockUserProfile,
      updateUserProfile: jest.fn(),
    });
    jest.clearAllMocks();
  });

  it('renders correctly and loads artist data', async () => {
    const mockArtist = {
      id: '456',
      name: 'Test Artist',
      images: [{ url: 'http://example.com/artist.jpg' }],
      external_urls: { spotify: 'http://spotify.com/artist' },
      followers: { total: 1000 },
      popularity: 80,
      genres: ['Pop', 'Rock'],
    };
    const mockAlbums = { items: [] };
    const mockTracks = { tracks: [] };

    spotifyService.getArtistByID.mockResolvedValue(mockArtist);
    spotifyService.getArtistAlbums.mockResolvedValue(mockAlbums);
    spotifyService.getArtistTopTracks.mockResolvedValue(mockTracks);

    const { getByText } = render(
      <NavigationContainer>
        <ArtistScreen route={mockRoute} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Test Artist')).toBeTruthy();
      expect(getByText('Artist Stats')).toBeTruthy();
      expect(getByText('Artist Genres')).toBeTruthy();
      expect(getByText('Top Tracks')).toBeTruthy();
      expect(getByText('Artist Albums')).toBeTruthy();
    });
  });
});
