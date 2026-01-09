import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import AlbumScreen from '../../screens/AlbumScreen';
import { spotifyService } from '../../services/spotifyService';
import { reviewService } from '../../services/reviewService';
import { favoriteService } from '../../services/favoriteService';
import { useAuth } from '../../context/AuthContext';

// Mock dependencies
jest.mock('../../services/spotifyService');
jest.mock('../../services/reviewService');
jest.mock('../../services/favoriteService');
jest.mock('../../services/userService');
jest.mock('../../context/AuthContext');
jest.mock('expo-modules-core', () => ({
  EventEmitter: jest.fn(),
  NativeModulesProxy: {},
}));
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
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
}));
jest.mock('../../components/ReviewSection', () => {
  const { View, Text } = require('react-native');
  return () => <View><Text>Review Section</Text></View>;
});
jest.mock('../../components/AverageRating', () => {
  const { View, Text } = require('react-native');
  return () => <View><Text>Average Rating</Text></View>;
});

// Mock useFocusEffect to run immediately
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  const React = require('react');
  return {
    ...actualNav,
    useFocusEffect: (callback) => React.useEffect(callback, []),
    useNavigation: () => ({
      setOptions: jest.fn(),
      navigate: jest.fn(),
    }),
  };
});

describe('AlbumScreen', () => {
  const mockRoute = { params: { albumId: '123' } };
  const mockUser = { id: 1 };
  const mockUserProfile = { favorites: [{ favorite: [] }] };
  const mockUpdateUserProfile = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: mockUser,
      userProfile: mockUserProfile,
      updateUserProfile: mockUpdateUserProfile,
    });
    jest.clearAllMocks();
  });

  it('renders correctly and loads album data', async () => {
    const mockAlbum = {
      id: '123',
      name: 'Test Album',
      artists: [{ name: 'Test Artist' }],
      images: [{ url: 'http://example.com/album.jpg' }],
      external_urls: { spotify: 'http://spotify.com/album' },
      release_date: '2023-01-01',
      total_tracks: 10,
      genres: [],
    };
    const mockReviews = [];

    spotifyService.getAlbumByID.mockResolvedValue(mockAlbum);
    reviewService.getReviewsBySpotifyId.mockResolvedValue(mockReviews);
    reviewService.calculateAverageRating.mockReturnValue(4.5);

    const { getByText } = render(<AlbumScreen route={mockRoute} />);

    await waitFor(() => {
      expect(getByText('Test Album')).toBeTruthy();
      expect(getByText('Test Artist')).toBeTruthy();
      expect(getByText('Review Section')).toBeTruthy();
    });
  });
});
