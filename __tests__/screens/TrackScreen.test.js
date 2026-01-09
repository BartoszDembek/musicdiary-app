import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import TrackScreen from '../../screens/TrackScreen';
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
    }),
  };
});

describe('TrackScreen', () => {
  const mockRoute = { params: { trackId: '123' } };
  const mockUser = { id: 1 };
  const mockUserProfile = { favorites: [{ favorite: [] }] };

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: mockUser,
      userProfile: mockUserProfile,
      updateUserProfile: jest.fn(),
    });
    jest.clearAllMocks();
  });

  it('renders correctly and loads track data', async () => {
    const mockTrack = {
      id: '123',
      name: 'Test Track',
      artists: [{ name: 'Test Artist' }],
      album: { name: 'Test Album', images: [{ url: 'http://example.com/album.jpg' }] },
      external_urls: { spotify: 'http://spotify.com/track' },
      duration_ms: 180000,
    };
    const mockReviews = [];

    spotifyService.getTrackByID.mockResolvedValue(mockTrack);
    reviewService.getReviewsBySpotifyId.mockResolvedValue(mockReviews);
    reviewService.calculateAverageRating.mockReturnValue(4.5);

    const { getByText } = render(<TrackScreen route={mockRoute} />);

    await waitFor(() => {
      expect(getByText('Test Track')).toBeTruthy();
      expect(getByText('Test Artist')).toBeTruthy();
      expect(getByText('Review Section')).toBeTruthy();
    });
  });
});
